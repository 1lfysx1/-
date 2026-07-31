import { useState, useEffect, useMemo } from "react";
import { ChevronDown, ChevronUp, Loader2, AlertCircle, BookOpen, Layers, ArrowLeft, CheckCircle2, XCircle, Trash2 } from "lucide-react";
import { api, type WrongQuestion } from "../../mock/api";
import { formatDate } from "../../utils/helpers";

function parseUserAnswer(userAnswer: string): string[] {
  try {
    const parsed = JSON.parse(userAnswer);
    if (Array.isArray(parsed)) return parsed.map(String);
  } catch {}
  return [userAnswer];
}

function parseCorrectAnswer(correctAnswer: any): string[] {
  if (Array.isArray(correctAnswer)) return correctAnswer.map(String);
  return [String(correctAnswer)];
}

export default function WrongQuestionsView() {
  const [wrongQuestions, setWrongQuestions] = useState<WrongQuestion[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [selectedCourse, setSelectedCourse] = useState<string>("__all__");
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  const handleDelete = async (recordId: string) => {
    if (deletingId) return;
    setDeletingId(recordId);
    try {
      await api.wrongQuestions.delete(recordId);
      setWrongQuestions((prev) => prev.filter((wq) => wq.id !== recordId));
    } catch {} finally {
      setDeletingId(null);
      setConfirmDeleteId(null);
    }
  };

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const data = await api.wrongQuestions.list();
        setWrongQuestions(data);
      } catch {} finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const courseList = useMemo(() => {
    const map = new Map<string, string>();
    for (const wq of wrongQuestions) {
      if (wq.courseName && wq.courseId) {
        map.set(wq.courseId, wq.courseName);
      }
    }
    return Array.from(map.entries()).map(([id, name]) => ({ id, name }));
  }, [wrongQuestions]);

  const filtered = useMemo(() => {
    if (selectedCourse === "__all__") return wrongQuestions;
    return wrongQuestions.filter((wq) => wq.courseId === selectedCourse);
  }, [wrongQuestions, selectedCourse]);

  const grouped = useMemo(() => {
    if (selectedCourse !== "__all__") {
      return [{ courseName: courseList.find((c) => c.id === selectedCourse)?.name || "", questions: filtered }];
    }
    const groups = new Map<string, WrongQuestion[]>();
    for (const wq of filtered) {
      const key = wq.courseName || "其他";
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key)!.push(wq);
    }
    return Array.from(groups.entries()).map(([name, questions]) => ({ courseName: name, questions }));
  }, [filtered, selectedCourse, courseList]);

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="w-8 h-8 animate-spin text-orange-400" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => { window.location.hash = "#/positions"; }}
            className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-orange-500 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            返回选职业
          </button>
          <div className="h-4 w-px bg-gray-200" />
        </div>
        <h2 className="text-xl font-semibold text-gray-900">错题本</h2>
        <p className="text-sm text-gray-500 mt-1">按课程分类查看错题，展示完整题目与答案解析</p>
      </div>

      {wrongQuestions.length > 0 && (
        <div className="flex items-center gap-2 mb-5 overflow-x-auto pb-1 scrollbar-hide">
          <button
            onClick={() => setSelectedCourse("__all__")}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
              selectedCourse === "__all__"
                ? "bg-orange-100 text-orange-700 border border-orange-200"
                : "bg-gray-50 text-gray-500 border border-gray-100 hover:bg-gray-100"
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            全部 ({wrongQuestions.length})
          </button>
          {courseList.map((course) => {
            const count = wrongQuestions.filter((wq) => wq.courseId === course.id).length;
            return (
              <button
                key={course.id}
                onClick={() => setSelectedCourse(course.id)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                  selectedCourse === course.id
                    ? "bg-orange-100 text-orange-700 border border-orange-200"
                    : "bg-gray-50 text-gray-500 border border-gray-100 hover:bg-gray-100"
                }`}
              >
                {course.name} ({count})
              </button>
            );
          })}
        </div>
      )}

      {wrongQuestions.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-16 text-center">
          <div className="w-14 h-14 bg-green-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-7 h-7 text-green-500" />
          </div>
          <h3 className="text-lg font-semibold text-gray-900 mb-1">暂无错题</h3>
          <p className="text-sm text-gray-500">继续保持，所有题目都答对了！</p>
        </div>
      ) : (
        <>
          <div className="flex items-center gap-2 mb-4">
            <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
              共 {filtered.length} 道错题
            </span>
            <span className="text-sm text-gray-400">点击展开查看完整题目与解析</span>
          </div>

          <div className="space-y-6">
            {grouped.map((group) => {
              return (
                <div key={group.courseName}>
                  {selectedCourse === "__all__" && (
                    <div className="flex items-center gap-2 mb-3">
                      <BookOpen className="w-4 h-4 text-orange-400" />
                      <h3 className="text-sm font-semibold text-gray-700">{group.courseName}</h3>
                      <span className="text-xs text-gray-400">({group.questions.length} 题)</span>
                    </div>
                  )}

                  <div className="space-y-3">
                    {group.questions.map((wq) => {
                      const isExpanded = expandedId === wq.id;
                      const userAnswers = parseUserAnswer(wq.userAnswer);
                      const correctAnswers = parseCorrectAnswer(wq.correctAnswer);

                      return (
                        <div key={wq.id} className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:border-gray-200 transition-all">
                          <button
                            onClick={() => setExpandedId(isExpanded ? null : wq.id)}
                            className="w-full flex items-start justify-between gap-3 p-5 text-left"
                          >
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-2">
                                <span className="text-xs font-medium text-red-500 bg-red-50 px-2 py-0.5 rounded-full">答错</span>
                                {confirmDeleteId === wq.id ? (
                                  <div className="flex items-center gap-1.5 ml-auto">
                                    <button
                                      onClick={(e) => { e.stopPropagation(); handleDelete(wq.id); }}
                                      disabled={deletingId === wq.id}
                                      className="text-[11px] px-2 py-0.5 rounded bg-red-500 text-white hover:bg-red-600 disabled:opacity-50"
                                    >
                                      {deletingId === wq.id ? "删除中..." : "确认删除"}
                                    </button>
                                    <button
                                      onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(null); }}
                                      className="text-[11px] px-2 py-0.5 rounded bg-gray-100 text-gray-500 hover:bg-gray-200"
                                    >
                                      取消
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    onClick={(e) => { e.stopPropagation(); setConfirmDeleteId(wq.id); }}
                                    className="ml-auto shrink-0 p-1.5 rounded-lg hover:bg-red-50 text-gray-300 hover:text-red-500 transition-colors"
                                    title="删除此题"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                )}
                                <span className="text-[11px] text-gray-400">{formatDate(wq.wrongDate)}</span>
                              </div>
                              <p className="text-sm font-medium text-gray-800 leading-relaxed">{wq.stem}</p>
                              <div className="flex items-center gap-3 mt-2">
                                {selectedCourse === "__all__" && (
                                  <span className="text-xs text-gray-400">知识点：{wq.knowledgePoint}</span>
                                )}
                                <span className="text-xs text-red-500">你的答案：{wq.userAnswer}</span>
                              </div>
                            </div>
                            <div className="shrink-0 mt-1">
                              {isExpanded ? <ChevronUp className="w-5 h-5 text-gray-400" /> : <ChevronDown className="w-5 h-5 text-gray-400" />}
                            </div>
                          </button>

                          {isExpanded && (
                            <div className="px-5 pb-5 border-t border-gray-50 pt-4 animate-fade-in">
                              <div className="space-y-4">
                                {wq.options && wq.options.length > 0 && (
                                  <div>
                                    <p className="text-xs font-medium text-gray-500 mb-2">选项</p>
                                    <div className="space-y-1.5">
                                      {wq.options.map((opt) => {
                                        const isUserSelected = userAnswers.includes(opt.key);
                                        const isCorrect = correctAnswers.includes(opt.key);
                                        let bgColor = "bg-white border-gray-100";
                                        let textColor = "text-gray-700";
                                        let icon = null;

                                        if (isCorrect) {
                                          bgColor = "bg-green-50 border-green-200";
                                          textColor = "text-green-800";
                                          icon = <CheckCircle2 className="w-4 h-4 text-green-500 shrink-0" />;
                                        } else if (isUserSelected && !isCorrect) {
                                          bgColor = "bg-red-50 border-red-200";
                                          textColor = "text-red-800";
                                          icon = <XCircle className="w-4 h-4 text-red-500 shrink-0" />;
                                        }

                                        return (
                                          <div key={opt.key} className={"flex items-center gap-3 px-3.5 py-2.5 rounded-lg border " + bgColor}>
                                            {icon}
                                            <span className={"w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0 " + (
                                              isCorrect ? "bg-green-200 text-green-700" :
                                              isUserSelected ? "bg-red-200 text-red-700" :
                                              "bg-gray-100 text-gray-500"
                                            )}>
                                              {opt.key}
                                            </span>
                                            <span className={"text-sm " + textColor}>{opt.text}</span>
                                            {isCorrect && (
                                              <span className="ml-auto text-[10px] font-medium text-green-600 bg-green-100 px-2 py-0.5 rounded shrink-0">正确答案</span>
                                            )}
                                            {isUserSelected && !isCorrect && (
                                              <span className="ml-auto text-[10px] font-medium text-red-600 bg-red-100 px-2 py-0.5 rounded shrink-0">你的选择</span>
                                            )}
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                )}

                                <div className="flex items-center gap-3 flex-wrap">
                                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-xs font-medium">
                                    <XCircle className="w-3.5 h-3.5" />
                                    你的答案：{wq.userAnswer}
                                  </span>
                                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-green-50 text-green-600 rounded-lg text-xs font-medium">
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    正确答案：{Array.isArray(wq.correctAnswer) ? wq.correctAnswer.join(", ") : wq.correctAnswer}
                                  </span>
                                </div>

                                {wq.explanation ? (
                                  <div className="bg-gray-50 rounded-xl p-4">
                                    <p className="text-xs font-medium text-gray-500 mb-1">解析</p>
                                    <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{wq.explanation}</p>
                                  </div>
                                ) : (
                                  <div className="bg-yellow-50 rounded-xl p-4">
                                    <p className="text-xs font-medium text-yellow-500 mb-1">暂无解析</p>
                                    <p className="text-xs text-yellow-600">该题目未配置详细解析，请联系管理员完善题库。</p>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}
