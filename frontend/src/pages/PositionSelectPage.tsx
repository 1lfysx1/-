import { useState, useEffect } from "react";
import { Loader2, Users, BookOpen, ArrowRight, Sparkles } from "lucide-react";
import { api, type Position } from "../mock/api";
import { useApp } from "../contexts/useApp";

interface PositionSelectPageProps {
  onNext: () => void;
}

export default function PositionSelectPage({ onNext }: PositionSelectPageProps) {
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { setSelectedPosition } = useApp();

  useEffect(() => {
    const load = async () => {
      try {
        const data = await api.positions.list();
        setPositions(data);
      } catch {} finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handleSelect = (pos: Position) => {
    setSelectedId(pos.id);
    setTimeout(() => {
      setSelectedPosition(pos);
      onNext();
    }, 300);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="text-lg font-semibold text-gray-900">技能培训系统</span>
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="text-center mb-10 animate-fade-in-up">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">选择你的培训岗位</h1>
          <p className="text-sm text-gray-500">选择一个岗位开始你的职业技能学习之旅</p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-orange-400" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-3xl animate-stagger">
            {positions.map((pos) => (
              <button
                key={pos.id}
                onClick={() => handleSelect(pos)}
                className={`text-left bg-white rounded-2xl border-2 p-6 transition-all hover:shadow-md ${
                  selectedId === pos.id
                    ? "border-orange-400 shadow-lg"
                    : "border-gray-100 hover:border-gray-200"
                }`}
              >
                <div className="flex items-start gap-4">
                  <span className="text-3xl">{pos.icon}</span>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{pos.name}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">{pos.description}</p>
                    <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5" />
                        {pos.studentCount} 名学员
                      </span>
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-3.5 h-3.5" />
                        {pos.courseCount} 门课程
                      </span>
                    </div>
                  </div>
                  <ArrowRight className={`w-5 h-5 mt-1 transition-all ${
                    selectedId === pos.id ? "text-orange-500 translate-x-1" : "text-gray-300"
                  }`} />
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}


