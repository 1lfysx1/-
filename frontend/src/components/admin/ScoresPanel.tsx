import { useEffect, useState } from "react";
import { Activity, ChevronDown, ChevronUp, Loader2, Target, Users } from "lucide-react";
import { api, type UserScore } from "../../mock/api";

const formatDate = (value: string) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value.slice(5, 16);
  return `${date.getMonth() + 1}/${date.getDate()} ${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
};

const clampPercent = (value: number) => Math.max(0, Math.min(100, value));
const displayScore = (value: number | null | undefined) => value === null || value === undefined ? "暂无" : `${value}%`;

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
    void load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-400" />
      </div>
    );
  }

  const completedPostTests = scores.filter((item) => item.postTest !== null && item.postTest !== undefined);
  const avgPost = completedPostTests.length > 0
    ? Math.round(completedPostTests.reduce((sum, item) => sum + (item.postTest ?? 0), 0) / completedPostTests.length)
    : null;
  const practiceCount = scores.reduce((sum, item) => sum + item.scoreHistory.length, 0);

  return (
    <div className="max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">成绩追踪</h2>
          <p className="text-sm text-gray-500 mt-1">
            使用前问卷作为前测，模拟练习最近一次成绩作为后测，只展示真实产生的数据。
          </p>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
            <Users className="w-5 h-5 text-indigo-500" />
          </div>
          <div>
            <p className="text-xs text-gray-500">已完成前测记录</p>
            <p className="text-xl font-bold text-gray-900">{scores.length}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center">
            <Activity className="w-5 h-5 text-green-500" />
          </div>
          <div>
            <p className="text-xs text-gray-500">模拟练习批次</p>
            <p className="text-xl font-bold text-gray-900">{practiceCount}</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
            <Target className="w-5 h-5 text-orange-500" />
          </div>
          <div>
            <p className="text-xs text-gray-500">后测平均正确率</p>
            <p className="text-xl font-bold text-orange-500">{avgPost === null ? "暂无" : `${avgPost}%`}</p>
          </div>
        </div>
      </div>

      <div className="space-y-3">
        {scores.length === 0 ? (
          <div className="bg-white rounded-xl border border-gray-100 py-16 text-center text-sm text-gray-400">
            暂无真实前测问卷记录
          </div>
        ) : (
          scores.map((userScore) => {
            const isExpanded = expandedId === userScore.userId;
            const history = userScore.scoreHistory;
            const delta = userScore.preTest !== null && userScore.postTest !== null && userScore.postTest !== undefined
              ? userScore.postTest - userScore.preTest
              : null;

            return (
              <div key={userScore.userId} className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:border-gray-200 transition-all">
                <button onClick={() => setExpandedId(isExpanded ? null : userScore.userId)} className="w-full flex items-center gap-4 p-4 text-left">
                  <div className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center text-sm font-bold text-gray-600">
                    {userScore.username.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-semibold text-gray-900">{userScore.username}</h3>
                    <p className="text-xs text-gray-500">{userScore.email}</p>
                    {userScore.courseName && <p className="text-xs text-orange-500 mt-0.5">{userScore.courseName}</p>}
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-400">前测</p>
                    <p className="text-sm font-bold text-gray-700">{displayScore(userScore.preTest)}</p>
                    <p className="text-[10px] text-gray-400">{userScore.preTestCorrect ?? 0}/{userScore.preTestTotal ?? 0}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-xs text-gray-400">后测</p>
                    <p className="text-sm font-bold text-gray-700">{displayScore(userScore.postTest)}</p>
                    <p className="text-[10px] text-gray-400">{userScore.postTestCorrect ?? 0}/{userScore.postTestTotal ?? 0}</p>
                  </div>
                  <div className="w-20 text-center">
                    <p className="text-xs text-gray-400">变化</p>
                    <p className={`text-sm font-bold ${delta === null ? "text-gray-400" : delta >= 0 ? "text-green-600" : "text-red-500"}`}>
                      {delta === null ? "暂无" : `${delta >= 0 ? "+" : ""}${delta}%`}
                    </p>
                  </div>
                  <div className="w-24 h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full rounded-full bg-indigo-500" style={{ width: `${clampPercent(userScore.postTest ?? 0)}%` }} />
                  </div>
                  {isExpanded ? <ChevronUp className="w-4 h-4 text-gray-400 shrink-0" /> : <ChevronDown className="w-4 h-4 text-gray-400 shrink-0" />}
                </button>
                {isExpanded && (
                  <div className="px-4 pb-4 border-t border-gray-50 pt-3 animate-fade-in">
                    <p className="text-xs font-medium text-gray-500 mb-3">模拟练习正确率变化</p>
                    {history.length === 0 ? (
                      <div className="rounded-xl bg-gray-50 py-10 text-center text-sm text-gray-400">暂无后测练习记录</div>
                    ) : (
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
                    )}
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
