"""Practical step-by-step guidance generator."""
import base64
import html
import json
import re
from typing import Literal

from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel

from app.services.deepseek_client import chat_completion
from app.utils.security import get_current_user_id

router = APIRouter(prefix="/api/practical", tags=["Practical"])


class PracticalReq(BaseModel):
    query: str
    courseId: str | None = None


class PracticalStep(BaseModel):
    index: int
    instruction: str
    description: str
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
    steps: list[PracticalStep]


INTENT_KEYWORDS = {
    "install": ("安装", "下载", "部署环境", "环境搭建", "装", "install", "setup"),
    "configure": ("配置", "设置", "修改配置", "反向代理", "nginx", "mysql", "redis", "端口", "config"),
    "deploy": ("部署", "发布", "上线", "运行服务", "启动服务", "docker", "服务器", "deploy"),
    "troubleshoot": ("报错", "错误", "失败", "无法", "不能", "排查", "修复", "调试", "troubleshoot"),
    "run": ("启动", "运行", "连接", "测试", "验证", "run", "start"),
}

INTENT_LABELS = {
    "install": "安装类实操",
    "configure": "配置类实操",
    "deploy": "部署类实操",
    "troubleshoot": "排错类实操",
    "run": "运行验证类实操",
    "general": "通用实操",
}

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


def infer_visual_type(text: str, intent: str) -> str:
    lowered = text.lower()
    if any(word in lowered for word in ("nginx", "python", "命令", "终端", "server", "systemctl", "端口")):
        return "terminal"
    if any(word in lowered for word in ("配置", "文件", "参数", "json", "yaml", "conf")):
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


def build_svg_image(step: PracticalStep, intent: str) -> str:
    visual_type = step.visualType if step.visualType in VISUAL_TYPES else infer_visual_type(step.instruction + step.description, intent)
    palettes = {
        "terminal": ("#111827", "#22c55e", "#d1d5db", "#374151"),
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
    title_lines = _wrap_svg_text(step.instruction, width=22, max_lines=2)
    body_source = step.imagePrompt or step.screenshotHint or step.expectedResult or step.description
    body_widths = {
        "terminal": 32,
        "config": 30,
        "browser": 10,
        "procedure": 18,
        "document": 18,
        "chart": 18,
        "care": 18,
        "food": 18,
        "status": 18,
    }
    body_lines = _wrap_svg_text(body_source, width=body_widths.get(visual_type, 18), max_lines=4)
    command_lines = _wrap_svg_text(step.instruction, width=28, max_lines=1)
    expected_lines = _wrap_svg_text(step.expectedResult, width=13, max_lines=1)

    def text_lines(lines: list[str], x: int, y: int, size: int, color: str, gap: int = 26) -> str:
        return "".join(
            f'<text x="{x}" y="{y + index * gap}" font-size="{size}" fill="{color}" font-family="Microsoft YaHei, Arial">{html.escape(line)}</text>'
            for index, line in enumerate(lines)
        )

    if visual_type == "terminal":
        inner = f'''
        <rect x="92" y="92" width="616" height="190" rx="16" fill="#020617"/>
        <circle cx="122" cy="122" r="7" fill="#ef4444"/><circle cx="146" cy="122" r="7" fill="#f59e0b"/><circle cx="170" cy="122" r="7" fill="#22c55e"/>
        <text x="120" y="165" font-size="22" fill="#22c55e" font-family="Consolas, monospace">$ {html.escape(command_lines[0] if command_lines else step.instruction[:24])}</text>
        {text_lines(body_lines[:3], 120, 202, 18, '#cbd5e1', 24)}
        '''
    elif visual_type == "config":
        inner = f'''
        <rect x="100" y="82" width="600" height="212" rx="14" fill="#ffffff" stroke="{soft}" stroke-width="3"/>
        <rect x="100" y="82" width="600" height="42" rx="14" fill="{soft}"/>
        <text x="126" y="111" font-size="17" fill="{fg}" font-family="Consolas, monospace">config/example.conf</text>
        {text_lines(body_lines, 128, 158, 18, fg, 28)}
        '''
    elif visual_type == "browser":
        inner = f'''
        <rect x="96" y="82" width="608" height="214" rx="16" fill="#ffffff" stroke="{soft}" stroke-width="3"/>
        <rect x="118" y="108" width="564" height="34" rx="17" fill="#f1f5f9"/>
        <text x="142" y="131" font-size="15" fill="#64748b" font-family="Arial">https://example.com/result</text>
        <rect x="140" y="168" width="224" height="80" rx="12" fill="{soft}"/>
        <rect x="390" y="168" width="270" height="18" rx="9" fill="#dbeafe"/>
        <rect x="390" y="198" width="220" height="18" rx="9" fill="#dbeafe"/>
        {text_lines(body_lines[:1], 154, 216, 18, fg)}
        '''
    else:
        inner = f'''
        <rect x="94" y="86" width="612" height="206" rx="24" fill="#ffffff" opacity="0.9"/>
        <circle cx="188" cy="188" r="58" fill="{soft}"/>
        <path d="M160 190 L182 212 L222 164" fill="none" stroke="{accent}" stroke-width="12" stroke-linecap="round" stroke-linejoin="round"/>
        <rect x="282" y="142" width="330" height="18" rx="9" fill="{soft}"/>
        <rect x="282" y="178" width="280" height="18" rx="9" fill="{soft}"/>
        <rect x="282" y="214" width="220" height="18" rx="9" fill="{soft}"/>
        {text_lines(body_lines[:2], 282, 260, 17, fg, 23)}
        '''

    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" width="800" height="360" viewBox="0 0 800 360">
      <defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop stop-color="{bg}"/><stop offset="1" stop-color="#ffffff"/></linearGradient></defs>
      <rect width="800" height="360" rx="28" fill="url(#g)"/>
      <rect x="36" y="34" width="92" height="34" rx="17" fill="{accent}" opacity="0.12"/>
      <text x="62" y="58" font-size="18" fill="{accent}" font-weight="700" font-family="Microsoft YaHei, Arial">步骤 {step.index}</text>
      {text_lines(title_lines, 148, 58, 24, fg, 30)}
      {inner}
      <rect x="548" y="302" width="216" height="34" rx="17" fill="{accent}" opacity="0.12"/>
      {text_lines(expected_lines[:1], 570, 325, 15, accent)}
    </svg>'''
    encoded = base64.b64encode(svg.encode("utf-8")).decode("ascii")
    return f"data:image/svg+xml;base64,{encoded}"


def attach_images(steps: list[PracticalStep], intent: str) -> list[PracticalStep]:
    for step in steps:
        if not step.visualType or step.visualType not in VISUAL_TYPES:
            step.visualType = infer_visual_type(step.instruction + step.description, intent)
        if not step.imagePrompt:
            step.imagePrompt = f"简单教学示意图：{step.screenshotHint or step.instruction}"
        step.imageAlt = f"步骤 {step.index} 示意图：{step.instruction}"
        step.imageUrl = build_svg_image(step, intent)
        step.hasImage = True
    return steps


def fallback_steps(query: str, intent: str) -> PracticalResp:
    topic = _topic(query)
    templates = {
        "install": [
            ("确认系统环境", "检查操作系统版本、网络连接、磁盘空间和用户权限。", "环境满足安装要求，命令行可正常执行。"),
            ("获取安装包或安装源", "从官方渠道下载安装包，或配置可信的软件源。", "安装文件完整，软件源可访问。"),
            ("执行安装命令", "按目标软件的官方安装方式执行安装，并记录关键输出。", "安装过程无明显错误，程序文件已写入系统。"),
            ("配置基础参数", "设置路径、端口、账号或环境变量等必要参数。", "配置文件保存成功，参数与任务要求一致。"),
            ("启动并验证", "启动软件或服务，执行版本检查、状态检查或访问测试。", "服务可启动，测试命令返回正常结果。"),
        ],
        "configure": [
            ("备份原始配置", "修改前复制原配置文件，便于出错时回滚。", "备份文件存在且可恢复。"),
            ("定位配置项", "找到与需求相关的端口、路径、代理、权限或连接参数。", "确认需要修改的配置位置。"),
            ("按需求修改配置", "根据任务要求写入配置，并保持格式、缩进和语法正确。", "配置内容与目标需求一致。"),
            ("执行语法检查", "使用软件自带检查命令或启动前校验功能验证配置。", "检查命令返回成功，无语法错误。"),
            ("重载服务并验证效果", "平滑重载或重启服务，再用访问、日志或状态命令确认结果。", "功能生效，日志中没有新的错误。"),
        ],
        "deploy": [
            ("准备运行环境", "确认服务器、依赖、端口、防火墙和权限满足部署要求。", "环境检查通过。"),
            ("上传或拉取材料", "将任务所需文件、工具或资料放到目标位置。", "目标位置包含完整操作材料。"),
            ("安装依赖并准备", "安装运行依赖，必要时执行构建或预处理。", "依赖安装成功，准备工作完成。"),
            ("启动服务或流程", "按要求启动应用、服务或实操流程。", "流程处于运行状态。"),
            ("访问验证与记录", "验证核心结果，并记录关键过程。", "核心功能可用，记录材料完整。"),
        ],
        "troubleshoot": [
            ("复现问题", "按用户描述重新执行操作，记录异常信息和触发条件。", "能够稳定复现或明确问题出现范围。"),
            ("查看日志和状态", "检查相关记录、状态、配置和环境条件。", "找到与问题时间一致的异常线索。"),
            ("定位配置或依赖", "核对配置、依赖版本、权限设置和操作顺序。", "确认最可能的异常原因。"),
            ("执行修复操作", "按定位结果修改配置、补齐依赖或调整流程。", "修复操作完成且无新错误。"),
            ("回归验证", "重新执行原操作并观察结果，确认问题不再出现。", "问题消失，核心流程恢复正常。"),
        ],
        "run": [
            ("确认前置条件", "检查依赖、配置、工具和权限是否满足运行要求。", "前置条件均已满足。"),
            ("执行启动操作", "在正确位置执行启动命令或开始操作流程。", "流程开始执行且无明显错误。"),
            ("查看运行状态", "检查运行状态、输出结果或关键指标。", "状态显示正常运行。"),
            ("执行功能验证", "访问页面、调用接口或检查实际结果。", "功能响应符合预期。"),
            ("记录结果", "保存关键输出和过程材料，便于后续复盘。", "验证材料完整，可用于复盘。"),
        ],
    }
    selected = templates.get(intent, templates["configure"])
    steps = [
        PracticalStep(
            index=index,
            instruction=instruction,
            description=description,
            expectedResult=expected,
            hasImage=True,
            screenshotHint=f"示意图展示：{instruction} 的关键结果。",
            visualType=infer_visual_type(instruction + description + query, intent),
            imagePrompt=f"为职业技能培训生成简单示意图，主题是：{instruction}。画面需要清晰表达：{expected}",
        )
        for index, (instruction, description, expected) in enumerate(selected, start=1)
    ]
    return PracticalResp(title=f"{topic}操作指南", intent=INTENT_LABELS[intent], source="fallback", steps=attach_images(steps, intent))


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
    steps: list[PracticalStep] = []
    for item in raw_steps[:15]:
        if not isinstance(item, dict):
            continue
        instruction = str(item.get("instruction") or item.get("title") or "").strip()
        description = str(item.get("description") or item.get("detail") or "").strip()
        if not instruction or not description:
            continue
        expected = str(item.get("expectedResult") or item.get("expected_result") or item.get("result") or "完成后应能看到该步骤对应结果。")
        screenshot_hint = str(item.get("screenshotHint") or item.get("screenshot_hint") or "展示该步骤的关键操作画面。")
        visual_type = str(item.get("visualType") or item.get("visual_type") or "").strip()
        image_prompt = str(item.get("imagePrompt") or item.get("image_prompt") or screenshot_hint).strip()
        steps.append(PracticalStep(
            index=len(steps) + 1,
            instruction=instruction[:120],
            description=description[:500],
            expectedResult=expected[:300],
            hasImage=True,
            screenshotHint=screenshot_hint[:200],
            visualType=visual_type if visual_type in VISUAL_TYPES else infer_visual_type(instruction + description + image_prompt, intent),
            imagePrompt=image_prompt[:360],
        ))
    if len(steps) < 3:
        return None
    title = str(data.get("title") or f"{_topic(query)}操作指南").strip()[:80]
    return PracticalResp(title=title, intent=INTENT_LABELS[intent], source="llm", steps=attach_images(steps, intent))


async def generate_with_llm(query: str, intent: str) -> PracticalResp | None:
    messages = [
        {
            "role": "system",
            "content": (
                "你是职业技能培训系统的实操指导生成器。只输出严格 JSON，不要 Markdown。"
                "JSON 字段必须为 title 和 steps。steps 为 3 到 15 个步骤。"
                "每个步骤包含 instruction、description、expectedResult、hasImage、screenshotHint、visualType、imagePrompt。"
                "visualType 只能从 terminal、config、browser、document、chart、care、food、procedure、status 中选择。"
                "imagePrompt 用中文描述一张简单教学示意图，不要求真实界面截图，不要包含复杂小字。"
                "内容必须安全、具体、可执行，hasImage 必须为 true。"
            ),
        },
        {
            "role": "user",
            "content": (
                f"实操问题：{query}\n"
                f"识别类型：{INTENT_LABELS[intent]}\n"
                "请生成分步指导 JSON。不要输出解释，不要使用代码块。"
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
