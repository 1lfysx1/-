import { useState, useEffect } from "react";
import { Loader2, Target, TrendingUp, BookOpen } from "lucide-react";
import KnowledgeMap from "./KnowledgeMap";
import RecommendationList from "./RecommendationList";
import { api, type KpMastery, type Recommendation } from "../../mock/api";

export default function ProgressView() {
  const [mastery, setMastery] = useState<KpMastery[]>([]);
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [m, r] = await Promise.all([
          api.progress.getMastery(),
          api.progress.getRecommendations(),
        ]);
        setMastery(m);
        setRecommendations(r);
      } catch {} finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="w-8 h-8 animate-spin text-orange-400" />
      </div>
    );
  }

  const avgMastery = mastery.length > 0 ? mastery.reduce((s, k) => s + k.masteryProb, 0) / mastery.length : 0;
  const weakCount = mastery.filter((k) => k.masteryProb < 0.6).length;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">学习进度</h2>
        <p className="text-sm text-gray-500 mt-1">查看你的知识点掌握情况和个性化复习推荐</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center">
            <Target className="w-5 h-5 text-orange-500" />
          </div>
          <div>
            <p className="text-xs text-gray-500">综合掌握</p>
            <p className="text-xl font-bold text-gray-900">{Math.round(avgMastery * 100)}%</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center">
            <TrendingUp className="w-5 h-5 text-red-500" />
          </div>
          <div>
            <p className="text-xs text-gray-500">薄弱知识点</p>
            <p className="text-xl font-bold text-gray-900">{weakCount} 个</p>
          </div>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-4 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-indigo-500" />
          </div>
          <div>
            <p className="text-xs text-gray-500">已学知识点</p>
            <p className="text-xl font-bold text-gray-900">{mastery.length} 个</p>
          </div>
        </div>
      </div>

      {/* If no records */}
      {mastery.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
          <p className="text-gray-400 mb-2">尚未开始练习</p>
          <p className="text-sm text-gray-400">请先去完成练习题，系统将自动追踪你的学习进度</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-3">
            <KnowledgeMap data={mastery} />
          </div>
          <div className="lg:col-span-2">
            <RecommendationList items={recommendations} />
          </div>
        </div>
      )}
    </div>
  );
}





