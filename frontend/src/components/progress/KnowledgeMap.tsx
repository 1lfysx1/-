import { masteryColor, masteryBgColor, masteryLabel } from "../../utils/helpers";
import type { KpMastery } from "../../mock/api";

interface KnowledgeMapProps {
  data: KpMastery[];
}

export default function KnowledgeMap({ data }: KnowledgeMapProps) {
  const sorted = [...data].sort((a, b) => a.masteryProb - b.masteryProb);

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5">
      <h3 className="text-sm font-semibold text-gray-800 mb-4">知识点掌握度</h3>
      <div className="space-y-3">
        {sorted.map((kp) => (
          <div key={kp.id} className="animate-fade-in-up">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-xs font-medium text-gray-700 truncate">{kp.name}</span>
                <span className="text-xs text-gray-400 shrink-0">({kp.chapter})</span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <span className={`text-xs font-semibold ${masteryColor(kp.masteryProb)}`}>
                  {Math.round(kp.masteryProb * 100)}%
                </span>
                <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded-full text-white ${masteryBgColor(kp.masteryProb)}`}>
                  {masteryLabel(kp.masteryProb)}
                </span>
              </div>
            </div>
            <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-700 ${masteryBgColor(kp.masteryProb)}`}
                style={{ width: `${kp.masteryProb * 100}%` }}
              />
            </div>
            <div className="flex items-center gap-3 mt-1 text-[10px] text-gray-400">
              <span>答题 {kp.questionCount} 题</span>
              <span>正确 {kp.correctCount} 题</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


