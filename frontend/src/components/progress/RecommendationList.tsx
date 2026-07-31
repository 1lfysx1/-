import { BookOpen, FileText, MessageSquare, ChevronRight } from "lucide-react";
import type { Recommendation } from "../../mock/api";

interface RecommendationListProps {
  items: Recommendation[];
}

const iconMap = {
  material: BookOpen,
  exercise: FileText,
  community: MessageSquare,
};

const colorMap = {
  material: "text-blue-500 bg-blue-50",
  exercise: "text-orange-500 bg-orange-50",
  community: "text-indigo-500 bg-indigo-50",
};

export default function RecommendationList({ items }: RecommendationListProps) {
  if (items.length === 0) {
    return (
      <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
        <p className="text-sm text-gray-500">暂无推荐材料，请先完成基础学习</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-5">
      <h3 className="text-sm font-semibold text-gray-800 mb-4">复习推荐</h3>
      <div className="space-y-3">
        {items.map((item, i) => {
          const Icon = iconMap[item.type];
          const colorClass = colorMap[item.type];
          return (
            <div key={i} className="flex items-start gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group animate-fade-in-up">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${colorClass}`}>
                <Icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-sm font-medium text-gray-800 group-hover:text-orange-600 transition-colors">{item.title}</h4>
                <p className="text-xs text-gray-500 mt-0.5">{item.description}</p>
                <p className="text-[11px] text-orange-500 mt-1">{item.reason}</p>
              </div>
              <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-gray-500 mt-1 shrink-0" />
            </div>
          );
        })}
      </div>
    </div>
  );
}


