import { useState, useEffect } from "react";
import {
  Mail,
  Shield,
  BookOpen,
  Target,
  TrendingUp,
  Clock,
  Loader2,
  AlertCircle,
  Trash2,
  X,
} from "lucide-react";
import { api, type KpMastery, type UserScore, type WrongQuestion } from "../../mock/api";
import { useApp } from "../../contexts/useApp";
import { masteryColor, masteryBgColor, masteryLabel } from "../../utils/helpers";

export default function PersonalCenterView() {
  const { user, logout } = useApp();
  const [mastery, setMastery] = useState<KpMastery[]>([]);
  const [wrongQuestions, setWrongQuestions] = useState<WrongQuestion[]>([]);
  const [scoreSummary, setScoreSummary] = useState<UserScore | null>(null);
  const [loading, setLoading] = useState(true);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [m, w, s] = await Promise.all([
          api.progress.getMastery(),
          api.wrongQuestions.list(),
          api.progress.getScores(),
        ]);
        setMastery(m);
        setWrongQuestions(w);
        setScoreSummary(s);
      } catch {
        // Personal stats are auxiliary; keep the page usable if they fail.
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const totalQuestions = mastery.reduce((s, k) => s + k.questionCount, 0);
  const totalCorrect = mastery.reduce((s, k) => s + k.correctCount, 0);
  const accuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
  const weakCount = mastery.filter((k) => k.masteryProb < 0.6).length;
  const avgMastery = mastery.length > 0
    ? Math.round((mastery.reduce((s, k) => s + k.masteryProb, 0) / mastery.length) * 100)
    : 0;
  const scoreHistory = scoreSummary?.scoreHistory ?? [];
  const latestScore = scoreHistory.length > 0 ? scoreHistory[scoreHistory.length - 1].score : null;
  const roleLabel = user?.role === "student" ? "学员" : user?.role === "teacher" ? "教师" : "管理员";

  const handleCancelAccount = async () => {
    setDeleting(true);
    setDeleteError("");
    try {
      await api.auth.cancelAccount();
      logout();
      window.location.hash = "#/login";
    } catch (error) {
      setDeleteError(error instanceof Error ? error.message : "注销账号失败，请稍后重试");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-orange-400" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="mb-2">
        <h2 className="text-xl font-semibold text-gray-900">个人中心</h2>
        <p className="text-sm text-gray-500 mt-1">查看你的学习数据和个人信息</p>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 p-6 flex items-center gap-5 animate-fade-in-up">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center text-white text-2xl font-bold shrink-0">
          {user?.username?.charAt(0) || "U"}
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-gray-900 truncate">{user?.username || "用户"}</h3>
          <div className="flex items-center gap-1 text-sm text-gray-500 mt-0.5 min-w-0">
            <Mail className="w-3.5 h-3.5 shrink-0" />
            <span className="truncate">{user?.email || "user@example.com"}</span>
          </div>
          <div className="flex items-center gap-3 mt-2">
            <span className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded-full">
              <Shield className="w-3 h-3" />
              {roleLabel}
            </span>
            <span className="text-xs text-gray-400">已登录</span>
          </div>
        </div>
        <div className="text-right shrink-0">
          <div className="text-2xl font-bold text-gray-900">{totalQuestions}</div>
          <div className="text-xs text-gray-500">总答题数</div>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 animate-stagger">
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <div className="w-9 h-9 rounded-lg bg-orange-50 flex items-center justify-center mb-2">
            <Target className="w-4 h-4 text-orange-500" />
          </div>
          <p className="text-lg font-bold text-gray-900">{accuracy}%</p>
          <p className="text-xs text-gray-500">正确率</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center mb-2">
            <TrendingUp className="w-4 h-4 text-indigo-500" />
          </div>
          <p className="text-lg font-bold text-gray-900">{weakCount}</p>
          <p className="text-xs text-gray-500">薄弱知识点</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <div className="w-9 h-9 rounded-lg bg-green-50 flex items-center justify-center mb-2">
            <BookOpen className="w-4 h-4 text-green-500" />
          </div>
          <p className="text-lg font-bold text-gray-900">{mastery.length}</p>
          <p className="text-xs text-gray-500">知识点</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4">
          <div className="w-9 h-9 rounded-lg bg-amber-50 flex items-center justify-center mb-2">
            <Clock className="w-4 h-4 text-amber-500" />
          </div>
          <p className="text-lg font-bold text-gray-900">{wrongQuestions.length}</p>
          <p className="text-xs text-gray-500">待复习错题</p>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-5 animate-fade-in-up">
        <div className="flex items-center justify-between gap-4 mb-4">
          <div>
            <h3 className="text-sm font-semibold text-gray-800">成绩变化</h3>
            <p className="text-xs text-gray-500 mt-1">根据你每次模拟练习的真实正确率生成</p>
          </div>
          <div className="text-right shrink-0">
            <p className="text-xs text-gray-400">最近正确率</p>
            <p className="text-lg font-bold text-orange-500">{latestScore === null ? "暂无" : `${latestScore}%`}</p>
          </div>
        </div>
        {scoreHistory.length === 0 ? (
          <div className="py-10 text-center text-sm text-gray-400">
            暂无模拟练习记录，完成练习后这里会显示你的成绩变化
          </div>
        ) : (
          <div className="relative h-40 bg-gray-50 rounded-xl p-3">
            <div className="flex h-full justify-between gap-1">
              {scoreHistory.map((item, index) => {
                const heightPct = Math.max(0, Math.min(100, item.score));
                const date = new Date(item.date);
                const dateLabel = Number.isNaN(date.getTime())
                  ? item.date.slice(5, 16)
                  : `${date.getMonth() + 1}/${date.getDate()} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
                return (
                  <div key={`${item.date}-${index}`} className="grid h-full flex-1 grid-rows-[16px_1fr_16px_16px] items-end gap-1 min-w-0">
                    <span className="text-center text-[9px] font-medium text-orange-600">{item.score}%</span>
                    <div className="flex h-full w-full items-end">
                      <div
                        className="w-full rounded-t-sm bg-orange-400 transition-all"
                        style={{ height: `${heightPct}%`, minHeight: heightPct > 0 ? "4px" : "0" }}
                      />
                    </div>
                    <span className="text-center text-[8px] text-gray-400 whitespace-nowrap">{dateLabel}</span>
                    <span className="text-center text-[8px] text-gray-400 whitespace-nowrap">
                      {item.total !== undefined ? `${item.correct ?? 0}/${item.total}` : ""}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-5 animate-fade-in-up">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-gray-800">知识点掌握度</h3>
          <span className="text-xs text-gray-400">综合掌握：{avgMastery}%</span>
        </div>
        {mastery.length === 0 ? (
          <div className="py-8 text-center text-sm text-gray-400">
            尚未开始练习，完成练习题后这里会显示你的学习进度
          </div>
        ) : (
          <div className="space-y-3">
            {[...mastery].sort((a, b) => a.masteryProb - b.masteryProb).map((kp) => (
              <div key={kp.id} className="animate-fade-in-up">
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-xs font-medium text-gray-700 truncate">{kp.name}</span>
                    <span className="text-[10px] text-gray-400 shrink-0">{kp.chapter}</span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className={`text-xs font-semibold ${masteryColor(kp.masteryProb)}`}>
                      {Math.round(kp.masteryProb * 100)}%
                    </span>
                    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full text-white ${masteryBgColor(kp.masteryProb)}`}>
                      {masteryLabel(kp.masteryProb)}
                    </span>
                  </div>
                </div>
                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full transition-all duration-700 ${masteryBgColor(kp.masteryProb)}`} style={{ width: `${kp.masteryProb * 100}%` }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-5 animate-fade-in-up">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
              <AlertCircle className="w-5 h-5 text-red-500" />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-semibold text-gray-800">错题本</h3>
              <p className="text-xs text-gray-500">共 {wrongQuestions.length} 道错题待复习</p>
            </div>
          </div>
          <a
            href="#/learning?tab=wrong"
            className="px-4 py-2 text-sm font-medium text-orange-500 bg-orange-50 hover:bg-orange-100 rounded-xl transition-all shrink-0"
          >
            查看详情
          </a>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-red-100 p-5 animate-fade-in-up">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <h3 className="text-sm font-semibold text-red-600">账号注销</h3>
            <p className="text-xs text-gray-500 mt-1">
              注销后账号会被停用，并退出当前登录。停用后无法继续登录或使用学习功能。
            </p>
          </div>
          <button
            type="button"
            onClick={() => {
              setDeleteError("");
              setConfirmOpen(true);
            }}
            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition-all shrink-0"
          >
            <Trash2 className="w-4 h-4" />
            注销账号
          </button>
        </div>
      </div>

      {confirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 px-4">
          <div className="w-full max-w-md rounded-xl bg-white p-5 shadow-xl">
            <div className="flex items-start justify-between gap-4">
              <div>
                <h3 className="text-base font-semibold text-gray-900">确认注销账号？</h3>
                <p className="mt-2 text-sm leading-6 text-gray-500">
                  账号注销后会立即退出登录，并且该账号不能再次登录。你的学习记录会保留在系统中，便于管理员维护数据一致性。
                </p>
              </div>
              <button
                type="button"
                onClick={() => setConfirmOpen(false)}
                className="rounded-lg p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-600"
                aria-label="关闭"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            {deleteError && (
              <div className="mt-4 rounded-lg border border-red-100 bg-red-50 px-3 py-2 text-sm text-red-600">
                {deleteError}
              </div>
            )}
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setConfirmOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-xl transition-all"
                disabled={deleting}
              >
                取消
              </button>
              <button
                type="button"
                onClick={handleCancelAccount}
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded-xl transition-all disabled:cursor-not-allowed disabled:opacity-60"
                disabled={deleting}
              >
                {deleting && <Loader2 className="w-4 h-4 animate-spin" />}
                确认注销
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
