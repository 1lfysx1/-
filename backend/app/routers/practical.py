"""CSDN-style practical tutorial generator."""
import base64
import html
import json
import re
from typing import Literal

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field

from app.services.deepseek_client import chat_completion
from app.utils.security import get_current_user_id

router = APIRouter(prefix="/api/practical", tags=["Practical"])


class PracticalReq(BaseModel):
    query: str
    courseId: str | None = None


class PracticalCommand(BaseModel):
    language: str = "text"
    code: str
    comment: str = ""


class PracticalStep(BaseModel):
    index: int
    title: str = ""
    instruction: str
    description: str
    commands: list[PracticalCommand] = Field(default_factory=list)
    commandComment: str = ""
    notes: list[str] = Field(default_factory=list)
    warnings: list[str] = Field(default_factory=list)
    verification: str = ""
    expectedResult: str = "完成该步骤后，关键配置或操作状态应符合要求。"
    hasImage: bool = True
    screenshotHint: str = "展示当前步骤的关键操作画面，便于理解。"
    visualType: str = "procedure"
    imagePrompt: str = ""
    imageUrl: str = ""
    imageAlt: str = ""


class PracticalResp(BaseModel):
    title: str
    intent: str
    source: Literal["llm", "fallback"]
    summary: str = ""
    prerequisites: list[str] = Field(default_factory=list)
    steps: list[PracticalStep]


INTENT_KEYWORDS = {
    "install": ("安装", "下载", "部署环境", "环境搭建", "装", "install", "setup"),
    "configure": ("配置", "设置", "修改配置", "反向代理", "nginx", "mysql", "redis", "端口", "config"),
    "deploy": ("部署", "发布", "上线", "运行服务", "启动服务", "docker", "服务器", "deploy"),
    "troubleshoot": ("报错", "错误", "失败", "无法", "不能", "排查", "修复", "调试", "troubleshoot"),
    "run": ("启动", "运行", "连接", "测试", "验证", "脚本", "bash", "shell", "run", "start"),
}

INTENT_LABELS = {
    "install": "安装类实操",
    "configure": "配置类实操",
    "deploy": "部署类实操",
    "troubleshoot": "排错类实操",
    "run": "运行验证类实操",
    "general": "通用实操",
}

TECH_KEYWORDS = (
    "nginx",
    "python",
    "java",
    "mysql",
    "redis",
    "docker",
    "linux",
    "windows",
    "server",
    "服务器",
    "终端",
    "命令",
    "代码",
    "配置",
    "端口",
    "数据库",
    "环境",
    "部署",
    "反向代理",
    "脚本",
    "bash",
    "shell",
)

VISUAL_TYPES = {"terminal", "config", "browser", "document", "chart", "care", "food", "procedure", "status"}


def detect_intent(query: str) -> str:
    lowered = query.lower()
    for intent, keywords in INTENT_KEYWORDS.items():
        if any(keyword.lower() in lowered for keyword in keywords):
            return intent
    return "general"


def _topic(query: str) -> str:
    cleaned = re.sub(r"\s+", " ", query).strip(" ？?。.")
    return cleaned or "实操任务"


def is_technical_topic(query: str) -> bool:
    lowered = query.lower()
    return any(keyword.lower() in lowered for keyword in TECH_KEYWORDS)


def infer_visual_type(text: str, intent: str) -> str:
    lowered = text.lower()
    if any(word in lowered for word in ("nginx", "python", "命令", "终端", "server", "systemctl", "端口", "pip", "npm")):
        return "terminal"
    if any(word in lowered for word in ("配置", "文件", "参数", "json", "yaml", "conf", "nginx.conf")):
        return "config"
    if any(word in lowered for word in ("浏览器", "页面", "访问", "网址", "http")):
        return "browser"
    if any(word in lowered for word in ("表", "票据", "凭证", "税", "会计", "记录")):
        return "document"
    if any(word in lowered for word in ("营养", "食材", "膳食", "餐", "摄入")):
        return "food"
    if any(word in lowered for word in ("护理", "老人", "床", "生命体征", "照护")):
        return "care"
    if intent == "troubleshoot":
        return "status"
    return "procedure"


def _char_width(char: str) -> float:
    if "\u4e00" <= char <= "\u9fff" or "\u3000" <= char <= "\u303f" or "\uff00" <= char <= "\uffef":
        return 1.0
    return 0.55


def _line_width(text: str) -> float:
    return sum(_char_width(char) for char in text)


def _wrap_svg_text(text: str, width: int = 20, max_lines: int = 4) -> list[str]:
    cleaned = re.sub(r"\s+", " ", text).strip()
    if not cleaned:
        return []

    lines: list[str] = []
    current = ""
    current_width = 0.0
    for char in cleaned:
        char_width = _char_width(char)
        if current and current_width + char_width > width:
            lines.append(current.rstrip())
            current = ""
            current_width = 0.0
            if len(lines) >= max_lines:
                break
        current += char
        current_width += char_width

    if current and len(lines) < max_lines:
        lines.append(current.rstrip())

    used_text = "".join(lines).replace(" ", "")
    original_text = cleaned.replace(" ", "")
    if lines and len(used_text) < len(original_text):
        suffix = "..."
        max_width = max(width - _line_width(suffix), 1)
        trimmed = lines[-1].rstrip("，。,. ")
        while trimmed and _line_width(trimmed) > max_width:
            trimmed = trimmed[:-1].rstrip("，。,. ")
        lines[-1] = f"{trimmed}{suffix}" if trimmed else suffix
    return lines


def _language_label(language: str) -> str:
    labels = {
        "bash": "bash",
        "shell": "shell",
        "powershell": "PowerShell",
        "nginx": "nginx",
        "python": "python",
        "json": "JSON",
        "yaml": "YAML",
        "text": "text",
    }
    return labels.get(language.lower(), language or "text")


def _comment_prefix(language: str) -> str:
    lowered = language.lower()
    if lowered in {"json"}:
        return "// "
    if lowered in {"html", "xml"}:
        return "<!-- "
    return "# "


def _code_preview_lines(step: PracticalStep, width: int = 42, max_lines: int = 7) -> list[str]:
    source_lines: list[str] = []
    for command in step.commands:
        if command.comment:
            source_lines.append(f"{_comment_prefix(command.language)}{command.comment}")
        for line in command.code.splitlines():
            cleaned = line.rstrip()
            if cleaned.strip():
                source_lines.append(cleaned)
            if len(source_lines) >= max_lines:
                break
        if len(source_lines) >= max_lines:
            break

    if not source_lines:
        source_lines = [step.instruction, step.description]

    lines: list[str] = []
    for source in source_lines:
        lines.extend(_wrap_svg_text(source, width=width, max_lines=1))
        if len(lines) >= max_lines:
            break
    return lines[:max_lines]


def build_svg_image(step: PracticalStep, intent: str) -> str:
    visual_type = step.visualType if step.visualType in VISUAL_TYPES else infer_visual_type(step.instruction + step.description, intent)
    palettes = {
        "terminal": ("#0f172a", "#22c55e", "#d1d5db", "#1f2937"),
        "config": ("#eef2ff", "#4f46e5", "#1f2937", "#c7d2fe"),
        "browser": ("#eff6ff", "#2563eb", "#1f2937", "#bfdbfe"),
        "document": ("#fff7ed", "#ea580c", "#1f2937", "#fed7aa"),
        "chart": ("#f0fdf4", "#16a34a", "#1f2937", "#bbf7d0"),
        "care": ("#fdf2f8", "#db2777", "#1f2937", "#fbcfe8"),
        "food": ("#f7fee7", "#65a30d", "#1f2937", "#d9f99d"),
        "status": ("#fefce8", "#ca8a04", "#1f2937", "#fde68a"),
        "procedure": ("#f8fafc", "#f97316", "#1f2937", "#fed7aa"),
    }
    bg, accent, fg, soft = palettes.get(visual_type, palettes["procedure"])
    title_lines = _wrap_svg_text(step.title or step.instruction, width=22, max_lines=2)
    body_source = step.imagePrompt or step.screenshotHint or step.expectedResult or step.description
    body_lines = _wrap_svg_text(body_source, width=28 if visual_type in {"terminal", "config"} else 18, max_lines=4)
    code_lines = _code_preview_lines(step)
    expected_source = step.verification or step.expectedResult
    expected_lines = _wrap_svg_text(expected_source, width=48 if step.commands else 18, max_lines=2)
    language = _language_label(step.commands[0].language if step.commands else "text")
    code_label = "代码/命令" if step.commands else "操作要点"

    def text_lines(lines: list[str], x: int, y: int, size: int, color: str, gap: int = 26, family: str = "Microsoft YaHei, Arial") -> str:
        return "".join(
            f'<text x="{x}" y="{y + index * gap}" font-size="{size}" fill="{color}" font-family="{family}">{html.escape(line)}</text>'
            for index, line in enumerate(lines)
        )

    def code_screenshot() -> str:
        rows = []
        for index, line in enumerate(code_lines[:7], start=1):
            y = 158 + (index - 1) * 24
            color = "#6b7280" if line.strip().startswith(("#", "//", "<!--")) else "#8bdf6d"
            if line.strip().startswith(("#!", "sudo", "nginx", "python", "pip", "curl")):
                color = "#60a5fa"
            rows.append(
                f'<text x="52" y="{y}" font-size="15" fill="#cbd5e1" font-family="Consolas, monospace">{index}</text>'
                f'<text x="82" y="{y}" font-size="17" fill="{color}" font-family="Consolas, monospace">{html.escape(line)}</text>'
            )
        expected_y = 292
        expected_text = text_lines(expected_lines[:2], 150, expected_y, 15, "#e5e7eb", 22)
        return f'''
        <rect x="18" y="88" width="764" height="238" rx="8" fill="#282c34"/>
        <rect x="18" y="88" width="764" height="46" rx="8" fill="#242832"/>
        <text x="44" y="118" font-size="16" fill="#60a5fa" font-family="Microsoft YaHei, Arial">{html.escape(language)}</text>
        <rect x="670" y="103" width="16" height="16" rx="2" fill="none" stroke="#e5e7eb" stroke-width="2"/>
        <text x="696" y="117" font-size="15" fill="#e5e7eb" font-family="Microsoft YaHei, Arial">登录复制</text>
        <line x1="78" y1="150" x2="78" y2="258" stroke="#94a3b8" stroke-width="1"/>
        {''.join(rows)}
        <line x1="42" y1="268" x2="748" y2="268" stroke="#3f4654" stroke-width="1"/>
        <text x="52" y="{expected_y}" font-size="15" fill="#94a3b8" font-family="Microsoft YaHei, Arial">预期输出</text>
        {expected_text}
        '''

    if step.commands:
        inner = code_screenshot()
    elif visual_type == "terminal":
        inner = f'''
        <rect x="92" y="88" width="616" height="218" rx="16" fill="#020617"/>
        <circle cx="122" cy="118" r="7" fill="#ef4444"/><circle cx="146" cy="118" r="7" fill="#f59e0b"/><circle cx="170" cy="118" r="7" fill="#22c55e"/>
        <text x="120" y="152" font-size="15" fill="#94a3b8" font-family="Microsoft YaHei, Arial">{code_label}</text>
        {text_lines(code_lines[:3], 120, 180, 17, '#22c55e', 23, 'Consolas, monospace')}
        <line x1="120" y1="246" x2="680" y2="246" stroke="#1f2937" stroke-width="2"/>
        <text x="120" y="271" font-size="15" fill="#94a3b8" font-family="Microsoft YaHei, Arial">预期输出</text>
        {text_lines(expected_lines[:2], 210, 271, 16, '#e5e7eb', 23)}
        '''
    elif visual_type == "config":
        inner = f'''
        <rect x="88" y="82" width="430" height="220" rx="14" fill="#ffffff" stroke="{soft}" stroke-width="3"/>
        <rect x="88" y="82" width="430" height="42" rx="14" fill="{soft}"/>
        <text x="114" y="111" font-size="17" fill="{fg}" font-family="Consolas, monospace">config/example.conf</text>
        {text_lines(code_lines[:4], 116, 154, 16, accent, 24, 'Consolas, monospace')}
        <rect x="540" y="110" width="176" height="154" rx="16" fill="#ffffff" stroke="{soft}" stroke-width="3"/>
        <text x="562" y="142" font-size="16" fill="{accent}" font-weight="700" font-family="Microsoft YaHei, Arial">预期输出</text>
        {text_lines(expected_lines[:2], 562, 178, 15, fg, 25)}
        '''
    elif visual_type == "browser":
        inner = f'''
        <rect x="96" y="82" width="608" height="214" rx="16" fill="#ffffff" stroke="{soft}" stroke-width="3"/>
        <rect x="118" y="108" width="564" height="34" rx="17" fill="#f1f5f9"/>
        <text x="142" y="131" font-size="15" fill="#64748b" font-family="Arial">https://example.com/result</text>
        <rect x="132" y="162" width="260" height="92" rx="12" fill="#0f172a"/>
        <text x="154" y="190" font-size="15" fill="#93c5fd" font-family="Microsoft YaHei, Arial">{code_label}</text>
        {text_lines(code_lines[:2], 154, 218, 15, '#bbf7d0', 22, 'Consolas, monospace')}
        <rect x="416" y="162" width="238" height="92" rx="12" fill="{soft}"/>
        <text x="438" y="190" font-size="15" fill="{accent}" font-weight="700" font-family="Microsoft YaHei, Arial">预期输出</text>
        {text_lines(expected_lines[:2], 438, 218, 15, fg, 22)}
        '''
    else:
        inner = f'''
        <rect x="94" y="86" width="612" height="206" rx="24" fill="#ffffff" opacity="0.92"/>
        <rect x="124" y="124" width="270" height="126" rx="16" fill="{soft}"/>
        <text x="146" y="156" font-size="16" fill="{accent}" font-weight="700" font-family="Microsoft YaHei, Arial">{code_label}</text>
        {text_lines(code_lines[:3], 146, 188, 15, fg, 23)}
        <rect x="424" y="124" width="246" height="126" rx="16" fill="#f8fafc" stroke="{soft}" stroke-width="3"/>
        <text x="446" y="156" font-size="16" fill="{accent}" font-weight="700" font-family="Microsoft YaHei, Arial">预期输出</text>
        {text_lines(expected_lines[:2], 446, 188, 15, fg, 23)}
        {text_lines(body_lines[:1], 146, 276, 15, fg, 23)}
        '''

    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" width="800" height="360" viewBox="0 0 800 360">
      <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="{bg}"/><stop offset="1" stop-color="#ffffff"/></linearGradient></defs>
      <rect width="800" height="360" rx="28" fill="url(#g)"/>
      <rect x="36" y="34" width="92" height="34" rx="17" fill="{accent}" opacity="0.14"/>
      <text x="62" y="58" font-size="18" fill="{accent}" font-weight="700" font-family="Microsoft YaHei, Arial">步骤 {step.index}</text>
      {text_lines(title_lines, 148, 58, 24, fg, 30)}
      {inner}
      <rect x="520" y="302" width="244" height="34" rx="17" fill="{accent}" opacity="0.14"/>
      <text x="544" y="325" font-size="15" fill="{accent}" font-family="Microsoft YaHei, Arial">{'含代码与预期输出' if step.commands else '含操作要点与预期结果'}</text>
    </svg>'''
    encoded = base64.b64encode(svg.encode("utf-8")).decode("ascii")
    return f"data:image/svg+xml;base64,{encoded}"


def attach_images(steps: list[PracticalStep], intent: str) -> list[PracticalStep]:
    for step in steps:
        combined = f"{step.instruction} {step.description} {step.imagePrompt} {' '.join(command.code for command in step.commands)}"
        if not step.visualType or step.visualType not in VISUAL_TYPES:
            step.visualType = infer_visual_type(combined, intent)
        if not step.imagePrompt:
            step.imagePrompt = f"生成类似终端或操作窗口的教学截图，突出：{step.instruction}"
        step.imageAlt = f"步骤 {step.index} 教学截图：{step.instruction}"
        step.imageUrl = build_svg_image(step, intent)
        step.hasImage = True
    return steps


def _list_from_value(value: object, limit: int = 5) -> list[str]:
    if isinstance(value, list):
        return [str(item).strip()[:160] for item in value if str(item).strip()][:limit]
    if isinstance(value, str) and value.strip():
        return [value.strip()[:160]]
    return []


def _commands_from_value(value: object, limit: int = 3) -> list[PracticalCommand]:
    commands: list[PracticalCommand] = []
    if isinstance(value, str) and value.strip():
        commands.append(PracticalCommand(code=value.strip()[:1200]))
    elif isinstance(value, list):
        for item in value:
            if isinstance(item, dict):
                code = str(item.get("code") or item.get("command") or "").strip()
                if not code:
                    continue
                commands.append(PracticalCommand(
                    language=str(item.get("language") or item.get("lang") or "text").strip()[:30] or "text",
                    code=code[:1200],
                    comment=str(item.get("comment") or item.get("description") or "").strip()[:300],
                ))
            elif isinstance(item, str) and item.strip():
                commands.append(PracticalCommand(code=item.strip()[:1200]))
            if len(commands) >= limit:
                break
    return commands


def _make_step(
    index: int,
    title: str,
    description: str,
    expected: str,
    commands: list[PracticalCommand] | None = None,
    notes: list[str] | None = None,
    warnings: list[str] | None = None,
    verification: str = "",
    visual_type: str = "",
    image_prompt: str = "",
) -> PracticalStep:
    instruction = title
    step = PracticalStep(
        index=index,
        title=title,
        instruction=instruction,
        description=description,
        commands=commands or [],
        commandComment="按顺序执行命令或完成清单后，再进入下一步。" if commands else "",
        notes=notes or [],
        warnings=warnings or [],
        verification=verification,
        expectedResult=expected,
        screenshotHint=f"展示“{title}”完成后的终端、配置窗口或操作状态。",
        visualType=visual_type or infer_visual_type(title + description + expected, "general"),
        imagePrompt=image_prompt or f"类似终端或操作窗口的教学截图，内容表现：{expected}",
    )
    return step


def _nginx_fallback(topic: str, intent: str) -> PracticalResp:
    steps = [
        _make_step(
            1,
            "确认 Nginx 已安装",
            "先确认本机或服务器已经安装 Nginx，并能正常读取版本信息。",
            "终端能输出 Nginx 版本号。",
            [PracticalCommand(language="bash", code="nginx -v", comment="查看 Nginx 是否已安装，以及当前版本。")],
            ["如果命令不存在，需要先安装 Nginx。"],
            ["生产服务器操作前建议确认自己具有 sudo 权限。"],
            "能看到类似 nginx version: nginx/1.x 的输出。",
            "terminal",
        ),
        _make_step(
            2,
            "备份原配置文件",
            "修改配置前先备份，方便出现问题时快速恢复。",
            "备份文件已生成。",
            [PracticalCommand(language="bash", code="sudo cp /etc/nginx/nginx.conf /etc/nginx/nginx.conf.bak", comment="复制原始配置文件，保留一份可回滚版本。")],
            ["也可以备份站点配置目录，例如 /etc/nginx/conf.d/。"],
            ["不要直接覆盖唯一配置文件。"],
            "执行 ls /etc/nginx/nginx.conf.bak 能看到备份文件。",
            "terminal",
        ),
        _make_step(
            3,
            "编写反向代理配置",
            "新增或修改 server 配置，将用户访问转发到后端服务地址。",
            "配置文件包含 proxy_pass 等代理参数。",
            [
                PracticalCommand(
                    language="nginx",
                    code=(
                        "server {\n"
                        "    listen 80;\n"
                        "    server_name example.com;\n\n"
                        "    location / {\n"
                        "        proxy_pass http://127.0.0.1:8000;\n"
                        "        proxy_set_header Host $host;\n"
                        "        proxy_set_header X-Real-IP $remote_addr;\n"
                        "    }\n"
                        "}"
                    ),
                    comment="listen 是访问端口，server_name 是域名，proxy_pass 是后端服务地址。",
                )
            ],
            ["把 example.com 和 127.0.0.1:8000 替换成自己的域名和后端端口。"],
            ["配置缩进不是强制要求，但花括号必须成对。"],
            "配置文件保存后无语法报错。",
            "config",
        ),
        _make_step(
            4,
            "检查配置并重载服务",
            "用 Nginx 自带命令检查语法，通过后再平滑重载服务。",
            "Nginx 配置生效，服务无需中断重装。",
            [
                PracticalCommand(language="bash", code="sudo nginx -t", comment="检查配置文件语法是否正确。"),
                PracticalCommand(language="bash", code="sudo systemctl reload nginx", comment="在语法正确后重新加载 Nginx。"),
            ],
            ["如果 nginx -t 失败，先按报错行号修复配置。"],
            ["不要在语法检查失败时强行重启服务。"],
            "看到 syntax is ok 和 test is successful。",
            "terminal",
        ),
        _make_step(
            5,
            "访问验证代理结果",
            "用浏览器或 curl 访问域名，确认请求已经转发到后端服务。",
            "页面或接口返回后端服务内容。",
            [PracticalCommand(language="bash", code="curl -I http://example.com", comment="查看代理后的 HTTP 响应状态。")],
            ["如果返回 502，优先检查后端服务是否启动、端口是否正确。"],
            ["公网服务器还要检查安全组和防火墙。"],
            "HTTP 状态码为 200、301 或业务允许的正常状态。",
            "browser",
        ),
    ]
    return PracticalResp(
        title=f"{topic}教程",
        intent=INTENT_LABELS[intent],
        source="fallback",
        summary="按 CSDN 教程风格整理 Nginx 反向代理配置流程，包含命令、配置示例、注释和验证方式。",
        prerequisites=["已登录目标服务器", "已安装 Nginx 或具备安装权限", "知道后端服务的访问地址和端口"],
        steps=attach_images(steps, intent),
    )


def _python_fallback(topic: str, intent: str) -> PracticalResp:
    steps = [
        _make_step(
            1,
            "检查当前 Python 环境",
            "先查看系统是否已有 Python，以及 pip 是否可用。",
            "终端能输出 Python 和 pip 的版本。",
            [
                PracticalCommand(language="bash", code="python --version", comment="查看 Python 版本。"),
                PracticalCommand(language="bash", code="pip --version", comment="查看 pip 包管理工具是否可用。"),
            ],
            ["Windows 上也可以尝试 py --version。"],
            ["如果存在多个 Python 版本，要确认项目实际使用的是哪一个。"],
            "版本号能正常输出。",
            "terminal",
        ),
        _make_step(
            2,
            "安装或更新 Python",
            "如果本机没有 Python，从官方渠道安装，并勾选加入 PATH。",
            "Python 命令可以在终端直接执行。",
            [PracticalCommand(language="text", code="访问 https://www.python.org/downloads/ 下载稳定版本并安装", comment="安装时勾选 Add Python to PATH。")],
            ["优先选择稳定版，不建议新手安装预发布版本。"],
            ["不要从不明网站下载安装包。"],
            "重新打开终端后 python --version 能输出版本。",
            "browser",
        ),
        _make_step(
            3,
            "创建虚拟环境",
            "给项目创建独立环境，避免依赖互相污染。",
            "项目目录下生成 .venv 环境。",
            [
                PracticalCommand(language="bash", code="python -m venv .venv", comment="在当前项目目录创建虚拟环境。"),
                PracticalCommand(language="bash", code=".venv\\Scripts\\activate", comment="Windows PowerShell 或 cmd 中激活环境。"),
            ],
            ["macOS/Linux 激活命令通常是 source .venv/bin/activate。"],
            ["激活失败时检查执行策略或终端类型。"],
            "命令行前出现 (.venv) 标识。",
            "terminal",
        ),
        _make_step(
            4,
            "安装项目依赖",
            "在虚拟环境中安装项目需要的第三方包。",
            "依赖安装完成，没有明显错误。",
            [PracticalCommand(language="bash", code="pip install -r requirements.txt", comment="按依赖清单安装项目包。")],
            ["没有 requirements.txt 时，可按项目文档逐个安装依赖。"],
            ["网络慢时可配置可信镜像源。"],
            "pip 输出 Successfully installed 或 Requirement already satisfied。",
            "terminal",
        ),
        _make_step(
            5,
            "运行验证脚本",
            "用一个简单命令确认解释器和依赖环境可用。",
            "Python 能正常执行测试命令。",
            [PracticalCommand(language="bash", code="python -c \"print('Python 环境可用')\"", comment="执行一行 Python 代码验证环境。")],
            ["后续可继续运行项目自己的启动命令或测试命令。"],
            [],
            "终端输出 Python 环境可用。",
            "terminal",
        ),
    ]
    return PracticalResp(
        title=f"{topic}教程",
        intent=INTENT_LABELS[intent],
        source="fallback",
        summary="按教程文章方式整理 Python 环境安装、虚拟环境创建和验证流程。",
        prerequisites=["可以打开终端或命令行", "具备安装软件权限", "了解项目所在目录"],
        steps=attach_images(steps, intent),
    )


def _shell_script_fallback(topic: str, intent: str) -> PracticalResp:
    steps = [
        _make_step(
            1,
            "编写标准脚本结构",
            "先建立 shell 脚本的基础结构：解释器声明、注释说明和具体执行命令。",
            "终端输出 Hello Shell Script。",
            [
                PracticalCommand(
                    language="bash",
                    code=(
                        "#!/bin/bash\n"
                        "# 注释：脚本功能、版本、作者说明\n"
                        "# 以下为具体执行的命令\n"
                        "echo \"Hello Shell Script\""
                    ),
                    comment="#!/bin/bash 必须写在第一行，用来声明脚本解释器。",
                )
            ],
            ["脚本第一行建议写明解释器，便于系统按 bash 执行。"],
            ["不要把危险删除命令直接写进练习脚本。"],
            "执行脚本后能看到 Hello Shell Script。",
            "terminal",
        ),
        _make_step(
            2,
            "保存脚本文件",
            "将脚本保存为 .sh 文件，文件名要能表达用途。",
            "当前目录生成 hello.sh。",
            [PracticalCommand(language="bash", code="vim hello.sh", comment="也可以使用 VS Code、记事本或其他编辑器保存。")],
            ["Linux/macOS 常用 .sh 作为 shell 脚本后缀。"],
            [],
            "ls hello.sh 能看到脚本文件。",
            "terminal",
        ),
        _make_step(
            3,
            "添加执行权限",
            "脚本文件需要执行权限，才能用 ./ 文件名运行。",
            "脚本具备可执行权限。",
            [PracticalCommand(language="bash", code="chmod +x hello.sh", comment="给脚本文件增加执行权限。")],
            ["如果只是用 bash hello.sh 执行，可以不加执行权限。"],
            ["权限不足时需要确认当前用户是否拥有该文件。"],
            "ls -l hello.sh 中能看到 x 权限标识。",
            "terminal",
        ),
        _make_step(
            4,
            "运行脚本并检查输出",
            "执行脚本，观察终端输出是否符合预期。",
            "终端输出 Hello Shell Script。",
            [PracticalCommand(language="bash", code="./hello.sh", comment="在脚本所在目录执行。")],
            ["如果提示找不到文件，先确认当前目录是否正确。"],
            ["如果提示权限不足，重新检查 chmod +x 是否执行成功。"],
            "终端显示 Hello Shell Script。",
            "terminal",
        ),
    ]
    return PracticalResp(
        title=f"{topic}教程",
        intent=INTENT_LABELS[intent],
        source="fallback",
        summary="按代码教程截图风格整理 shell 脚本结构，包含脚本代码、注释、执行方式和预期输出。",
        prerequisites=["可以打开终端", "了解脚本保存目录", "具备编辑文本文件的工具"],
        steps=attach_images(steps, intent),
    )


def _generic_fallback(query: str, intent: str) -> PracticalResp:
    topic = _topic(query)
    technical = is_technical_topic(query)
    lowered = query.lower()
    if any(keyword in lowered for keyword in ("bash", "shell")) or "脚本" in query:
        return _shell_script_fallback(topic, intent)
    if "nginx" in query.lower() or "反向代理" in query:
        return _nginx_fallback(topic, intent)
    if "python" in query.lower():
        return _python_fallback(topic, intent)

    if technical:
        steps = [
            _make_step(1, "确认目标和环境", "明确要完成的目标、工具版本、运行位置和权限要求。", "前置条件已确认。", [PracticalCommand(language="bash", code="# 记录当前环境和版本\npwd\nwhoami", comment="确认当前目录和执行用户。")], ["先确认操作环境，后续排错更容易。"], [], "环境信息清晰。", "terminal"),
            _make_step(2, "备份关键文件", "如果涉及配置或数据修改，先备份原文件。", "已保留可回滚版本。", [PracticalCommand(language="bash", code="# 示例：复制配置文件作为备份\ncp config.example config.example.bak", comment="把示例路径替换为实际文件路径。")], ["没有文件修改时可跳过此步。"], ["不要在未备份时直接覆盖重要配置。"], "备份文件存在。", "terminal"),
            _make_step(3, "按步骤执行核心操作", "根据任务要求执行安装、配置、部署或运行命令。", "核心操作已完成。", [PracticalCommand(language="bash", code="# 在这里执行任务对应命令\n# 例如：启动、安装或加载配置", comment="实际命令应以课程资料或官方文档为准。")], ["执行过程中记录关键输出。"], ["遇到报错先停止，保留错误信息。"], "命令执行完成，无明显错误。", "terminal"),
            _make_step(4, "验证结果", "通过状态、日志、页面或输出结果验证操作是否成功。", "验证结果符合任务要求。", [PracticalCommand(language="bash", code="# 示例：查看状态或日志\n# systemctl status 服务名", comment="根据实际软件替换服务名。")], ["优先使用软件自带验证命令。"], [], "状态正常或业务结果可用。", "status"),
        ]
        prerequisites = ["知道目标软件或工具名称", "具备对应操作权限", "可以查看命令输出或日志"]
    else:
        steps = [
            _make_step(1, "准备材料和环境", "确认工具、资料、场地和人员状态是否满足操作要求。", "操作条件已经准备好。", [], ["把需要用到的材料放在顺手位置。"], ["涉及安全或健康场景时，先确认风险点。"], "逐项检查材料是否齐全。", "procedure"),
            _make_step(2, "按照标准流程执行", "按先后顺序完成关键动作，每完成一步都观察结果。", "核心操作按流程完成。", [], ["保持动作稳定，避免跳步。"], ["发现异常时先暂停，不要继续扩大影响。"], "流程记录完整。", "procedure"),
            _make_step(3, "检查关键结果", "对照要求检查结果是否达标，包括状态、记录、反馈或现场情况。", "关键结果符合要求。", [], ["可以用清单方式逐项核对。"], [], "检查项全部通过或已记录问题。", "status"),
            _make_step(4, "记录和复盘", "记录操作时间、结果、异常和改进点，方便后续追踪。", "形成可复盘的操作记录。", [], ["记录要具体，不只写“已完成”。"], [], "记录内容完整、可追溯。", "document"),
        ]
        prerequisites = ["明确操作目标", "准备好相关材料", "了解安全和质量要求"]

    return PracticalResp(
        title=f"{topic}教程",
        intent=INTENT_LABELS[intent],
        source="fallback",
        summary=f"围绕“{topic}”生成的实操教程，包含步骤、说明、注意事项和验证方式。",
        prerequisites=prerequisites,
        steps=attach_images(steps, intent),
    )


def fallback_steps(query: str, intent: str) -> PracticalResp:
    return _generic_fallback(query, intent)


def extract_json(text: str) -> dict | None:
    if not text:
        return None
    cleaned = text.strip()
    fence = re.search(r"```(?:json)?\s*(\{.*?\})\s*```", cleaned, re.DOTALL | re.IGNORECASE)
    if fence:
        cleaned = fence.group(1)
    else:
        start = cleaned.find("{")
        end = cleaned.rfind("}")
        if start == -1 or end == -1 or end <= start:
            return None
        cleaned = cleaned[start:end + 1]
    try:
        data = json.loads(cleaned)
        return data if isinstance(data, dict) else None
    except json.JSONDecodeError:
        return None


def normalize_llm_response(data: dict, query: str, intent: str) -> PracticalResp | None:
    raw_steps = data.get("steps")
    if not isinstance(raw_steps, list):
        return None

    technical = is_technical_topic(query)
    steps: list[PracticalStep] = []
    for item in raw_steps[:12]:
        if not isinstance(item, dict):
            continue
        title = str(item.get("title") or item.get("instruction") or "").strip()
        instruction = str(item.get("instruction") or title).strip()
        description = str(item.get("description") or item.get("detail") or "").strip()
        if not instruction or not description:
            continue
        commands = _commands_from_value(item.get("commands") or item.get("command") or item.get("code"))
        if technical and not commands:
            return None
        expected = str(item.get("expectedResult") or item.get("expected_result") or item.get("result") or "完成后应能看到该步骤对应结果。").strip()
        screenshot_hint = str(item.get("screenshotHint") or item.get("screenshot_hint") or "展示该步骤的关键操作画面。").strip()
        visual_type = str(item.get("visualType") or item.get("visual_type") or "").strip()
        image_prompt = str(item.get("imagePrompt") or item.get("image_prompt") or screenshot_hint).strip()
        command_comment = str(item.get("commandComment") or item.get("command_comment") or "").strip()
        steps.append(PracticalStep(
            index=len(steps) + 1,
            title=(title or instruction)[:120],
            instruction=instruction[:120],
            description=description[:700],
            commands=commands,
            commandComment=(command_comment or "结合代码块下方注释，按顺序执行并观察终端输出。")[:400] if commands else "",
            notes=_list_from_value(item.get("notes")),
            warnings=_list_from_value(item.get("warnings")),
            verification=str(item.get("verification") or "").strip()[:400],
            expectedResult=expected[:400],
            hasImage=True,
            screenshotHint=screenshot_hint[:220],
            visualType=visual_type if visual_type in VISUAL_TYPES else infer_visual_type(instruction + description + image_prompt, intent),
            imagePrompt=image_prompt[:420],
        ))

    if len(steps) < 3:
        return None

    title = str(data.get("title") or f"{_topic(query)}教程").strip()[:90]
    summary = str(data.get("summary") or f"围绕“{_topic(query)}”生成的实操教程。").strip()[:300]
    prerequisites = _list_from_value(data.get("prerequisites") or data.get("environment"), limit=8)
    if not prerequisites:
        prerequisites = ["确认操作环境可用", "准备好相关工具和资料", "具备必要操作权限"]
    return PracticalResp(
        title=title,
        intent=INTENT_LABELS[intent],
        source="llm",
        summary=summary,
        prerequisites=prerequisites,
        steps=attach_images(steps, intent),
    )


async def generate_with_llm(query: str, intent: str) -> PracticalResp | None:
    technical_tip = (
        "如果问题属于程序、服务器、数据库、工具配置类，每个步骤必须提供 commands 数组，代码块可包含 bash、nginx、python、json、yaml 等。"
        if is_technical_topic(query)
        else "如果问题不属于程序技术类，不要硬塞终端命令；commands 可以为空，用 description、notes、warnings 写清操作要点。"
    )
    messages = [
        {
            "role": "system",
            "content": (
                "你是职业技能培训系统的实操教程生成器，输出风格参考 CSDN 技术教程。"
                "只输出严格 JSON，不要 Markdown，不要解释。"
                "JSON 必须包含 title、summary、prerequisites、steps。steps 为 3 到 12 个步骤。"
                "每个步骤包含 title、instruction、description、commands、commandComment、notes、warnings、verification、expectedResult、screenshotHint、visualType、imagePrompt。"
                "commands 是数组，每项包含 language、code、comment。没有代码或命令时 commands 输出空数组。"
                "visualType 只能从 terminal、config、browser、document、chart、care、food、procedure、status 中选择。"
                "imagePrompt 用中文描述一张类似终端、配置文件窗口或操作流程的教学截图，截图内容必须包含代码/操作要点和预期输出结果，文字要少且清楚。"
                "内容必须安全、具体、可执行，不要编造真实截图或真实环境结果。"
            ),
        },
        {
            "role": "user",
            "content": (
                f"实操问题：{query}\n"
                f"识别类型：{INTENT_LABELS[intent]}\n"
                f"{technical_tip}\n"
                "请生成教程 JSON。"
            ),
        },
    ]
    answer = await chat_completion(messages)
    if not answer or answer.startswith("[Config Missing]"):
        return None
    data = extract_json(answer)
    if not data:
        return None
    return normalize_llm_response(data, query, intent)


@router.post("/generate", response_model=PracticalResp)
async def generate_practical(req: PracticalReq, user_id: str = Depends(get_current_user_id)):
    if not user_id:
        raise HTTPException(status_code=401, detail="请先登录")
    query = req.query.strip()
    if len(query) < 2:
        raise HTTPException(status_code=422, detail="请输入具体的实操问题")
    intent = detect_intent(query)
    llm_result = await generate_with_llm(query, intent)
    return llm_result or fallback_steps(query, intent)
