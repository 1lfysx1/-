import { useState, useEffect } from "react";
import { Activity, Loader2, ChevronDown, ChevronUp, Target, Users } from "lucide-react";
import { api, type UserScore } from "../../mock/api";

const formatDate = (value: string) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value.slice(5, 16);
  return `${date.getMonth() + 1}/${date.getDate()} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
};

const clampPercent = (value: number) => Math.max(0, Math.min(100, value));

export default function ScoresPanel() {
  const [scores, setScores] = useState<UserScore[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        setScores(await api.admin.getUserScores());
      } catch {
        setScores([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
      </div>
    );
  }

  const latestScores = scores.map((item) => item.postTest);
  const avgLatest = latestScores.length > 0 ? Math.round(latestScores.reduce((s, score) => s + score, 0) / latestScores.length) : null;
  const practiceCount = scores.reduce((sum, item) => sum + item.scoreHistory.length, 0);

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">成绩追踪</h2>
          <p className="text-sm text-gray-500 mt-1">根据学员每次模拟练习的正确率统计学习表现</p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
            <Users className="w-5 h-5 text-indigo-500" />
          </div>
          <div>
            <p className="text-xs text-gray-500">有练习记录学员</p>
            <p className="text-xl font-bold text-gray-900">{scores.length}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
            <Activity className="w-5 h-5 text-green-500" />
          </div>
          <div>
            <p className="text-xs text-gray-500">练习批次数</p>
            <p className="text-xl font-bold text-gray-900">{practiceCount}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
            <Target className="w-5 h-5 text-orange-500" />
          </div>
          <div>
            <p className="text-xs text-gray-500">最近平均正确率</p>
            <p className="text-xl font-bold text-orange-500">{avgLatest === null ? "暂无" : `${avgLatest}%`}</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {scores.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 py-16 text-center text-sm text-gray-400">
            暂无学员模拟练习记录
          </div>
        ) : (
          scores.map((userScore) => {
            const isExpanded = expandedId === userScore.userId;
            const history = userScore.scoreHistory;

            return (
              <div key={userScore.userId} className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:border-gray-200 transition-all">
                <button onClick={() => setExpandedId(isExpanded ? null : userScore.userId)} className="w-full flex items-center gap-4 p-4 text-left">
                  <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-600">{userScore.username.charAt(0)}</div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-gray-900">{userScore.username}</h3>
                    <p className="text-xs text-gray-500">{userScore.email}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-400">首次</p>
                    <p className="text-sm font-bold text-gray-700">{userScore.preTest}%</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-400">最近</p>
                    <p className="text-sm font-bold text-gray-700">{userScore.postTest}%</p>
                  </div>
                  <div className="w-20 text-center">
                    <p className="text-xs text-gray-400">练习次数</p>
                    <p className="text-sm font-bold text-indigo-600">{history.length}</p>
                  </div>
                  <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-indigo-500" style={{ width: `${clampPercent(userScore.postTest)}%` }} />
                  </div>
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />}
                </button>
                {isExpanded && (
                  <div className="px-4 pb-4 border-t border-gray-50 pt-3 animate-fade-in">
                    <p className="text-xs font-medium text-gray-500 mb-3">每次模拟练习正确率</p>
                    <div className="relative h-40 bg-gray-50 rounded-xl p-3">
                      <div className="flex h-full justify-between gap-1">
                        {history.map((item, index) => {
                          const heightPct = clampPercent(item.score);
                          return (
                            <div key={`${item.date}-${index}`} className="grid h-full flex-1 grid-rows-[16px_1fr_16px_16px] items-end gap-1 min-w-0">
                              <span className="text-[9px] text-indigo-600 font-medium">{item.score}%</span>
                              <div className="flex h-full w-full items-end">
                                <div
                                  className="w-full rounded-t-sm bg-indigo-400 transition-all"
                                  style={{ height: `${heightPct}%`, minHeight: heightPct > 0 ? "4px" : "0" }}
                                />
                              </div>
                              <span className="text-center text-[8px] text-gray-400 whitespace-nowrap">{formatDate(item.date)}</span>
                              {item.total !== undefined && (
                                <span className="text-center text-[8px] text-gray-400 whitespace-nowrap">{item.correct ?? 0}/{item.total}</span>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
