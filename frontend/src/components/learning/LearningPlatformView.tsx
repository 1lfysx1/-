import { useEffect, useState } from "react";
import { BookMarked, BookOpen, ChevronDown, ChevronUp, Clock, FileText, Loader2 } from "lucide-react";
import { api } from "../../mock/api";
import type { Chapter } from "../../types/api";
import { useApp } from "../../contexts/useApp";

function handleStartLearning(courseName: string, chapterName: string, sectionTitle: string, sectionContent: string) {
  const prompt = `我正在学习《${courseName}》课程中的【${chapterName} - ${sectionTitle}】部分。\n\n以下是需要学习的内容：\n${sectionContent}\n\n请帮我详细讲解以上知识点，结合实际应用场景说明，并提供学习建议。`;
  sessionStorage.setItem("pendingQuestion", prompt);
  window.location.hash = "#/learning?tab=qa";
}

export default function LearningPlatformView() {
  const { selectedCourse } = useApp();
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [chapters, setChapters] = useState<Chapter[]>([]);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const result = await api.learning.getChapters(selectedCourse?.id || "");
        setChapters(result || []);
      } catch {
        setChapters([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [selectedCourse]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-orange-400" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-400 to-orange-500 flex items-center justify-center">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{selectedCourse?.name || "课程学习"}</h2>
            <p className="text-sm text-gray-500">按章节学习课程内容，学完后前往模拟练习巩固知识</p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-sm text-gray-500 bg-white rounded-xl border border-gray-100 px-5 py-3">
          <span className="flex items-center gap-1.5">
            <BookMarked className="w-4 h-4 text-orange-400" />
            共 {chapters.length} 个章节
          </span>
          <span className="w-1 h-1 bg-gray-300 rounded-full" />
          <span className="flex items-center gap-1.5">
            <FileText className="w-4 h-4 text-indigo-400" />
            {chapters.reduce((total, chapter) => total + chapter.sections.length, 0)} 个知识点
          </span>
        </div>
      </div>

      {chapters.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center animate-fade-in-up">
          <BookOpen className="w-8 h-8 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-700 mb-2">暂无学习资料</h3>
          <p className="text-sm text-gray-500">该课程暂时没有可用的章节内容。</p>
        </div>
      ) : (
        <div className="space-y-4 animate-stagger">
          {chapters.map((chapter, chapterIndex) => {
            const isExpanded = expandedId === chapter.id;
            return (
              <div key={chapter.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden transition-all hover:shadow-sm">
                <button
                  onClick={() => setExpandedId(isExpanded ? null : chapter.id)}
                  className="w-full flex items-center gap-4 p-5 text-left hover:bg-gray-50/50 transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center shrink-0 text-sm font-bold text-orange-500">
                    {String(chapterIndex + 1).padStart(2, "0")}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold text-gray-900">{chapter.name}</h3>
                    <p className="text-sm text-gray-500 mt-0.5 line-clamp-1">{chapter.description}</p>
                    <div className="flex items-center gap-3 mt-1.5">
                      <span className="flex items-center gap-1 text-[11px] text-gray-400">
                        <Clock className="w-3 h-3" />
                        {chapter.duration}
                      </span>
                      <span className="flex items-center gap-1 text-[11px] text-gray-400">
                        <BookOpen className="w-3 h-3" />
                        {chapter.sections.length} 节
                      </span>
                    </div>
                  </div>
                  {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                </button>

                {isExpanded && (
                  <div className="border-t border-gray-50 animate-fade-in">
                    <div className="px-5 py-4 space-y-3">
                      {chapter.sections.map((section, sectionIndex) => (
                        <div key={`${chapter.id}-${sectionIndex}`} className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100/80 transition-colors">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-xs font-medium text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full">第{sectionIndex + 1}节</span>
                                <h4 className="text-sm font-medium text-gray-800">{section.title}</h4>
                              </div>
                              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line line-clamp-6">{section.content}</p>
                            </div>
                            <button
                              onClick={() => handleStartLearning(selectedCourse?.name || "", chapter.name, section.title, section.content)}
                              className="shrink-0 px-3 py-1.5 bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white text-xs font-medium rounded-lg transition-all shadow-sm hover:shadow-md"
                            >
                              AI学习
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="px-5 pb-4">
                      <button
                        onClick={() => { window.location.hash = "#/learning?tab=exercise"; }}
                        className="w-full py-3 bg-gradient-to-r from-orange-400 to-orange-500 hover:from-orange-500 hover:to-orange-600 text-white font-medium rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm"
                      >
                        <FileText className="w-5 h-5" />
                        <span>📝 前往模拟练习</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}