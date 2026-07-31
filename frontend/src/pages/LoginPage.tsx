import { useEffect, useRef, useState } from "react";
import { ArrowRight, Loader2, Lock, Mail, ShieldCheck, User } from "lucide-react";
import { api } from "../mock/api";
import { useApp } from "../contexts/useApp";

const BG_IMAGE_1 =
  "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260609_195923_b0ba8ace-1d1d-4f2c-9a28-1ab84b330680.png&w=1280&q=85";
const BG_IMAGE_2 =
  "https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260609_201152_bba90a12-bf12-459f-91f0-51f237dbaf3b.png&w=1280&q=85";
const SPOTLIGHT_R = 260;

interface RevealLayerProps {
  image: string;
  cursorX: number;
  cursorY: number;
}

function RevealLayer({ image, cursorX, cursorY }: RevealLayerProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [maskImage, setMaskImage] = useState("");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);
    return () => window.removeEventListener("resize", resizeCanvas);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const gradient = ctx.createRadialGradient(cursorX, cursorY, 0, cursorX, cursorY, SPOTLIGHT_R);
    gradient.addColorStop(0, "rgba(255,255,255,1)");
    gradient.addColorStop(0.4, "rgba(255,255,255,1)");
    gradient.addColorStop(0.6, "rgba(255,255,255,0.75)");
    gradient.addColorStop(0.75, "rgba(255,255,255,0.4)");
    gradient.addColorStop(0.88, "rgba(255,255,255,0.12)");
    gradient.addColorStop(1, "rgba(255,255,255,0)");

    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(cursorX, cursorY, SPOTLIGHT_R, 0, Math.PI * 2);
    ctx.fill();
    setMaskImage(`url(${canvas.toDataURL()})`);
  }, [cursorX, cursorY]);

  return (
    <>
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" style={{ display: "none" }} />
      <div
        className="absolute inset-0 z-30 bg-cover bg-center bg-no-repeat pointer-events-none"
        style={{
          backgroundImage: `url(${image})`,
          maskImage,
          WebkitMaskImage: maskImage,
          maskSize: "100% 100%",
          WebkitMaskSize: "100% 100%",
        }}
      />
    </>
  );
}

export default function LoginPage() {
  const { setUser } = useApp();
  const [mode, setMode] = useState<"login" | "register" | "reset">("login");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [codeCooldown, setCodeCooldown] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [cursorPos, setCursorPos] = useState({ x: -999, y: -999 });
  const mouse = useRef({ x: -999, y: -999 });
  const smooth = useRef({ x: -999, y: -999 });
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      mouse.current = { x: e.clientX, y: e.clientY };
    };

    const animate = () => {
      smooth.current.x += (mouse.current.x - smooth.current.x) * 0.1;
      smooth.current.y += (mouse.current.y - smooth.current.y) * 0.1;
      setCursorPos({ x: smooth.current.x, y: smooth.current.y });
      rafRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", handleMouseMove);
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  useEffect(() => {
    if (codeCooldown <= 0) return;
    const timer = window.setTimeout(() => setCodeCooldown((seconds) => Math.max(0, seconds - 1)), 1000);
    return () => window.clearTimeout(timer);
  }, [codeCooldown]);

  const handleSendCode = async () => {
    if (!email.includes("@") || codeCooldown > 0) return;
    setLoading(true);
    setError("");
    setNotice("");
    try {
      if (mode === "reset") {
        await api.auth.sendResetCode(email);
      } else {
        await api.auth.sendVerifyCode(email);
      }
      setCodeSent(true);
      setCodeCooldown(60);
    } catch (err) {
      setError(err instanceof Error ? err.message : "验证码发送失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setNotice("");
    setLoading(true);
    try {
      if (mode === "login") {
        const res = await api.auth.login({ username, password });
        setUser(res.user, res.token);
      } else if (mode === "register") {
        const res = await api.auth.register({ username, email, password, code });
        setUser(res.user, res.token);
      } else {
        await api.auth.resetPassword({ email, password, code });
        setMode("login");
        setPassword("");
        setCode("");
        setCodeSent(false);
        setNotice("密码已重置，请使用新密码登录");
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "操作失败，请重试");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main
      className="min-h-screen bg-white tracking-[-0.02em]"
      style={{ fontFamily: "'Inter', sans-serif" }}
    >
      <section className="relative h-screen w-full overflow-hidden bg-black" style={{ height: "100dvh" }}>
        <div
          className="hero-zoom absolute inset-0 z-10 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${BG_IMAGE_1})` }}
        />
        <RevealLayer image={BG_IMAGE_2} cursorX={cursorPos.x} cursorY={cursorPos.y} />
        <div className="absolute inset-0 z-40 bg-[linear-gradient(180deg,rgba(0,0,0,0.2),rgba(0,0,0,0.06)_42%,rgba(0,0,0,0.58)),linear-gradient(90deg,rgba(0,0,0,0.5),rgba(0,0,0,0.08)_45%,rgba(0,0,0,0.54))]" />

        <div className="pointer-events-none absolute left-6 top-20 z-50 flex flex-col items-start px-0 text-left sm:left-10 sm:top-24 md:left-14">
          <h1 className="leading-[0.88] text-white">
            <span
              className="hero-anim hero-reveal block font-playfair text-5xl font-normal italic sm:text-7xl md:text-8xl"
              style={{ letterSpacing: "-0.055em", animationDelay: "0.25s" }}
            >
              Knowledge
            </span>
            <span
              className="hero-anim hero-reveal -mt-1 block font-playfair text-5xl font-normal italic sm:text-7xl md:text-8xl"
              style={{ letterSpacing: "-0.07em", animationDelay: "0.42s" }}
            >
              Unfolds
            </span>
          </h1>
        </div>

        <div
          className="hero-anim hero-fade hidden absolute bottom-14 left-10 z-50 max-w-[260px] sm:block md:left-14"
          style={{ animationDelay: "0.7s" }}
        >
          <p className="text-sm leading-relaxed text-white/80">
            基于 RAG 知识库检索与智能问答，系统会把岗位知识、题库练习和实操指导串联起来，帮助学员按职业方向持续提升。
          </p>
        </div>

        <section
          className="hero-anim hero-fade absolute bottom-6 left-5 right-5 z-50 grid gap-5 sm:bottom-10 sm:left-auto sm:right-10 sm:w-[390px] md:right-14"
          style={{ animationDelay: "0.85s" }}
        >
          <div className="rounded-[28px] border border-white/28 bg-black/28 p-5 shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur-md sm:p-6">
            <div className="mb-6">
              <p className="mb-2 inline-flex items-center gap-2 text-xs font-medium text-white/70">
                <ShieldCheck className="h-4 w-4 text-[#e8702a]" />
                安全入口
              </p>
              <h2 className="text-2xl font-semibold text-white">
                {mode === "login" ? "欢迎回来" : mode === "register" ? "创建账号" : "重置密码"}
              </h2>
              <p className="mt-1 text-sm text-white/68">
                {mode === "login" ? "登录后继续你的学习进度" : mode === "register" ? "填写信息后开启学习旅程" : "通过邮箱验证码设置新密码"}
              </p>
            </div>

            <div className="mb-5 grid grid-cols-2 rounded-full border border-white/18 bg-white/10 p-1">
              <button
                type="button"
                className={`rounded-full py-2.5 text-sm font-medium transition-all ${
                  mode === "login" ? "bg-white text-gray-900" : "text-white/70 hover:text-white"
                }`}
                onClick={() => {
                  setMode("login");
                  setError("");
                  setNotice("");
                  setPassword("");
                  setCode("");
                  setCodeSent(false);
                  setCodeCooldown(0);
                }}
              >
                登录
              </button>
              <button
                type="button"
                className={`rounded-full py-2.5 text-sm font-medium transition-all ${
                  mode === "register" ? "bg-white text-gray-900" : "text-white/70 hover:text-white"
                }`}
                onClick={() => {
                  setMode("register");
                  setError("");
                  setNotice("");
                  setPassword("");
                  setCode("");
                  setCodeSent(false);
                  setCodeCooldown(0);
                }}
              >
                注册
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5">
              {(mode === "register" || mode === "reset") && (
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-white/72">邮箱</span>
                  <span className="flex items-center gap-3 rounded-2xl border border-white/16 bg-white/10 px-4 py-3 transition-all focus-within:border-[#e8702a]/70 focus-within:bg-white/14">
                    <Mail className="h-4 w-4 text-white/52" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setCodeSent(false);
                        setCodeCooldown(0);
                        setNotice("");
                      }}
                      placeholder="请输入邮箱"
                      className="login-field min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/38"
                      required
                    />
                  </span>
                </label>
              )}

              {mode !== "reset" && (
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-white/72">
                    {mode === "login" ? "用户名或邮箱" : "用户名"}
                  </span>
                  <span className="flex items-center gap-3 rounded-2xl border border-white/16 bg-white/10 px-4 py-3 transition-all focus-within:border-[#e8702a]/70 focus-within:bg-white/14">
                    <User className="h-4 w-4 text-white/52" />
                    <input
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder={mode === "login" ? "请输入用户名或邮箱" : "请输入用户名"}
                      className="login-field min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/38"
                      required
                    />
                  </span>
                </label>
              )}

              {(mode === "register" || mode === "reset") && (
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-white/72">验证码</span>
                  <span className="flex gap-2">
                    <span className="flex min-w-0 flex-1 items-center gap-3 rounded-2xl border border-white/16 bg-white/10 px-4 py-3 transition-all focus-within:border-[#e8702a]/70 focus-within:bg-white/14">
                      <Mail className="h-4 w-4 text-white/52" />
                      <input
                        value={code}
                        onChange={(e) => setCode(e.target.value)}
                        placeholder="请输入验证码"
                        className="login-field min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/38"
                        required
                      />
                    </span>
                    <button
                      type="button"
                      onClick={handleSendCode}
                      disabled={!email.includes("@") || loading || codeCooldown > 0}
                      className="shrink-0 rounded-2xl border border-white/20 bg-white/10 px-4 text-xs font-medium text-white/82 transition-all hover:border-[#e8702a]/70 hover:text-white disabled:cursor-not-allowed disabled:opacity-35"
                    >
                      {codeCooldown > 0 ? `${codeCooldown}秒后重发` : codeSent ? "重新发送" : "获取验证码"}
                    </button>
                  </span>
                </label>
              )}

              <label className="block">
                <span className="mb-1.5 block text-sm font-medium text-white/72">{mode === "reset" ? "新密码" : "密码"}</span>
                <span className="flex items-center gap-3 rounded-2xl border border-white/16 bg-white/10 px-4 py-3 transition-all focus-within:border-[#e8702a]/70 focus-within:bg-white/14">
                  <Lock className="h-4 w-4 text-white/52" />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder={mode === "reset" ? "请输入新密码" : "请输入密码"}
                    className="login-field min-w-0 flex-1 bg-transparent text-sm text-white outline-none placeholder:text-white/38"
                    required
                  />
                </span>
              </label>

              {mode === "login" && (
                <div className="flex justify-end">
                  <button
                    type="button"
                    onClick={() => {
                      setMode("reset");
                      setError("");
                      setNotice("");
                      setPassword("");
                      setCode("");
                      setCodeSent(false);
                      setCodeCooldown(0);
                    }}
                    className="text-xs font-medium text-white/62 transition-colors hover:text-[#e8702a]"
                  >
                    忘记密码？
                  </button>
                </div>
              )}

              {error && (
                <p className="rounded-2xl border border-red-400/35 bg-red-500/14 px-4 py-3 text-sm text-red-100">
                  {error}
                </p>
              )}
              {notice && (
                <p className="rounded-2xl border border-emerald-400/35 bg-emerald-500/14 px-4 py-3 text-sm text-emerald-100">
                  {notice}
                </p>
              )}

              <button
                type="submit"
                disabled={loading}
                className="mt-2 flex w-full items-center justify-center gap-2 rounded-full bg-[#e8702a] px-7 py-3 text-sm font-medium text-white transition-all hover:scale-[1.03] hover:bg-[#d2611f] hover:shadow-lg hover:shadow-[#e8702a]/30 active:scale-95 disabled:cursor-not-allowed disabled:opacity-55"
              >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : mode === "login" ? "进入系统" : mode === "register" ? "完成注册" : "重置密码"}
                {!loading && <ArrowRight className="h-4 w-4" />}
              </button>
              {mode === "reset" && (
                <button
                  type="button"
                  onClick={() => {
                    setMode("login");
                    setError("");
                    setNotice("");
                    setPassword("");
                    setCode("");
                    setCodeSent(false);
                    setCodeCooldown(0);
                  }}
                  className="w-full rounded-full px-4 py-2 text-sm font-medium text-white/70 transition-colors hover:text-white"
                >
                  返回登录
                </button>
              )}
            </form>
          </div>
        </section>
      </section>
    </main>
  );
}
