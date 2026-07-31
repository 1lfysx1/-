import { useEffect, useState } from "react";
import { Briefcase, Loader2, MessageSquare, Target, Users } from "lucide-react";
import { api } from "../../mock/api";
import type { UserScore } from "../../types/api";

interface DashboardStats {
  users: number | null;
  positions: number | null;
  posts: number | null;
  avgAccuracy: number | null;
}

const EMPTY_STATS: DashboardStats = { users: null, positions: null, posts: null, avgAccuracy: null };

export default function DashboardPanel() {
  const [stats, setStats] = useState<DashboardStats>(EMPTY_STATS);
  const [scoreRows, setScoreRows] = useState<UserScore[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [users, positions, posts, scores] = await Promise.all([
          api.admin.getUsers(),
          api.positions.list(),
          api.admin.getPosts(),
          api.admin.getUserScores(),
        ]);
        const latestScores = scores.map((score) => score.postTest);
        const avgAccuracy = latestScores.length > 0
          ? Math.round(latestScores.reduce((total, score) => total + score, 0) / latestScores.length)
          : null;
        setStats({
          users: users.filter((user) => user.role === "student").length,
          positions: positions.length,
          posts: posts.length,
          avgAccuracy,
        });
        setScoreRows(scores);
      } catch {
        setStats(EMPTY_STATS);
        setScoreRows([]);
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

  const cards = [
    { icon: Users, label: "学员总数", value: stats.users, color: "bg-indigo-50 text-indigo-500" },
    { icon: Briefcase, label: "培训岗位", value: stats.positions, color: "bg-orange-50 text-orange-500" },
    { icon: MessageSquare, label: "社区帖子", value: stats.posts, color: "bg-green-50 text-green-500" },
    { icon: Target, label: "最近平均正确率", value: stats.avgAccuracy === null ? null : `${stats.avgAccuracy}%`, color: "bg-purple-50 text-purple-500" },
  ];

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">系统概览</h2>
        <p className="text-sm text-gray-500 mt-1">管理系统运行状态和数据统计</p>
      </div>
      <div className="grid grid-cols-4 gap-4 mb-8">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.label} className="bg-white rounded-xl border border-gray-100 p-5 animate-fade-in-up">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 ${card.color}`}>
                <Icon className="w-5 h-5" />
              </div>
              <p className="text-2xl font-bold text-gray-900">{card.value === null ? "暂无数据" : card.value}</p>
              <p className="text-sm text-gray-500 mt-1">{card.label}</p>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-xl border border-gray-100 p-5 animate-fade-in-up">
        <h3 className="text-sm font-semibold text-gray-800 mb-4">学员模拟练习正确率</h3>
        {scoreRows.length === 0 ? (
          <div className="py-12 text-center text-sm text-gray-400">暂无真实练习数据</div>
        ) : (
          <div className="space-y-3">
            {scoreRows.map((score) => (
              <div key={score.userId} className="flex items-center gap-4">
                <span className="text-xs text-gray-600 w-24 shrink-0 truncate" title={score.username}>{score.username}</span>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-indigo-500 w-10">最近</span>
                    <div className="flex-1 h-2 bg-gray-100 rounded-full overflow-hidden">
                      <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${Math.max(0, Math.min(100, score.postTest))}%` }} />
                    </div>
                    <span className="text-[10px] text-indigo-600 w-10 text-right">{score.postTest}%</span>
                  </div>
                </div>
                <span className="text-xs text-gray-500 w-16 text-right">{score.scoreHistory.length} 次练习</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
