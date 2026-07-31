import { useState, useEffect } from "react";
import { Loader2, BookOpen, FileText, Sparkles, ArrowRight, ArrowLeft } from "lucide-react";
import { api, type Course } from "../mock/api";
import { useApp } from "../contexts/useApp";

interface CourseSelectPageProps {
  onNext: () => void;
  onBack: () => void;
}

export default function CourseSelectPage({ onNext, onBack }: CourseSelectPageProps) {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const { selectedPosition, setSelectedCourse } = useApp();

  useEffect(() => {
    if (!selectedPosition) {
      onBack();
      return;
    }
    const load = async () => {
      try {
        const data = await api.courses.list(selectedPosition.id);
        setCourses(data);
      } catch {} finally {
        setLoading(false);
      }
    };
    load();
  }, [onBack, selectedPosition]);

  const handleSelect = (course: Course) => {
    setSelectedId(course.id);
    setTimeout(() => {
      setSelectedCourse(course);
      onNext();
    }, 300);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header */}
      <header className="bg-white border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
              <ArrowLeft className="w-4 h-4" /> 返回
            </button>
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-semibold text-gray-900">技能培训系统</span>
            </div>
          </div>
          {selectedPosition && (
            <span className="text-sm text-gray-500">
              当前岗位：<span className="font-medium text-orange-500">{selectedPosition.name}</span>
            </span>
          )}
        </div>
      </header>

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
        <div className="text-center mb-10 animate-fade-in-up">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">选择课程</h1>
          <p className="text-sm text-gray-500">
            {selectedPosition?.name} · 共有 {courses.length} 门课程可供学习
          </p>
        </div>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="w-8 h-8 animate-spin text-orange-400" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full max-w-3xl animate-stagger">
            {courses.map((course) => (
              <button
                key={course.id}
                onClick={() => handleSelect(course)}
                className={`text-left bg-white rounded-2xl border-2 p-6 transition-all hover:shadow-md ${
                  selectedId === course.id
                    ? "border-orange-400 shadow-lg"
                    : "border-gray-100 hover:border-gray-200"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-orange-50 flex items-center justify-center shrink-0">
                    <BookOpen className="w-6 h-6 text-orange-500" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 mb-1">{course.name}</h3>
                    <p className="text-sm text-gray-500 leading-relaxed line-clamp-2">{course.description}</p>
                    <div className="flex items-center gap-4 mt-3 text-xs text-gray-400">
                      <span className="flex items-center gap-1">
                        <BookOpen className="w-3.5 h-3.5" />
                        {course.chapterCount} 章
                      </span>
                      <span className="flex items-center gap-1">
                        <FileText className="w-3.5 h-3.5" />
                        {course.knowledgePointCount} 个知识点
                      </span>
                    </div>
                  </div>
                  <ArrowRight className={`w-5 h-5 mt-1 transition-all ${
                    selectedId === course.id ? "text-orange-500 translate-x-1" : "text-gray-300"
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




