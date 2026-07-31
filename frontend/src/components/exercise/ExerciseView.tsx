import { useState, useEffect } from "react";
import { Loader2, CheckCircle2, ArrowLeft, RefreshCw, BookOpen } from "lucide-react";
import QuestionCard from "./QuestionCard";
import { api, type Question, type ExerciseKnowledgePoint, type ExerciseResult } from "../../mock/api";
import { useApp } from "../../contexts/useApp";

type Phase = "start" | "doing" | "result";

export default function ExerciseView() {
  const { selectedCourse } = useApp();
  const [phase, setPhase] = useState<Phase>("start");
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [results, setResults] = useState<ExerciseResult[]>([]);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(false);
  const [kpLoading, setKpLoading] = useState(true);
  const [knowledgePoints, setKnowledgePoints] = useState<ExerciseKnowledgePoint[]>([]);
  const [selectedKps, setSelectedKps] = useState<string[]>([]);
  const [error, setError] = useState("");

  const handleStart = async () => {
    setLoading(true);
    setError("");
    try {
      const qs = await api.exercise.getQuestions(selectedKps);
      if (qs.length === 0) {
        setError("选中的知识点暂无练习题，请先在管理端题库中添加题目。");
        return;
      }
      setQuestions(qs);
      setAnswers({});
      setResults([]);
      setPhase("doing");
    } catch {
      setError("练习题加载失败，请稍后重试。");
    } finally {
      setLoading(false);
    }
  };

  const handleAnswer = (questionId: string, answer: string | string[]) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const answerList = Object.entries(answers).map(([questionId, answer]) => ({
        questionId,
        answer,
      }));
      const res = await api.exercise.submit(answerList);
      setScore(res.score);
      setResults(res.results);
      setPhase("result");
    } catch {} finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadKps = async () => {
      setKpLoading(true);
      setSelectedKps([]);
      setError("");
      if (!selectedCourse?.id) {
        setKnowledgePoints([]);
        setKpLoading(false);
        return;
      }
      try {
        const kps = await api.exercise.getKnowledgePoints(selectedCourse.id);
        setKnowledgePoints(kps);
      } catch {
        setError("知识点加载失败，请稍后重试。");
      } finally {
        setKpLoading(false);
      }
    };
    loadKps();
  }, [selectedCourse?.id]);

  const allAnswered = questions.every((q) => {
    const ans = answers[q.id];
    if (!ans) return false;
    if (q.type === "multiple") return (ans as string[]).length > 0;
    return true;
  });

  if (phase === "start") {
    return (
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8 animate-fade-in-up">
          <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <BookOpen className="w-8 h-8 text-orange-500" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">模拟练习</h2>
          <p className="text-sm text-gray-500">选择要练习的知识点，系统将根据选中的知识点生成对应的练习题</p>
        </div>

        {kpLoading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-orange-400" />
          </div>
        ) : knowledgePoints.length === 0 ? (
          <div className="text-center py-12 text-sm text-gray-400">
            {error || (selectedCourse ? "当前课程暂无知识点" : "请先选择课程")}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-3 mb-6 animate-stagger">
              {knowledgePoints.map((kp) => {
                const selected = selectedKps.includes(kp.id);
                return (
                  <button
                    key={kp.id}
                    onClick={() => {
                      if (selected) setSelectedKps((prev) => prev.filter((id) => id !== kp.id));
                      else setSelectedKps((prev) => [...prev, kp.id]);
                    }}
                    className={`text-left p-4 rounded-xl border-2 transition-all ${
                      selected ? "border-orange-400 bg-orange-50" : "border-gray-100 bg-white hover:border-gray-200"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-5 h-5 rounded-md border-2 flex items-center justify-center shrink-0 mt-0.5 transition-all ${
                        selected ? "bg-orange-500 border-orange-500" : "border-gray-300"
                      }`}>
                        {selected && <span className="text-white text-xs font-bold">&#10003;</span>}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-gray-800">{kp.name}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{kp.chapter}</p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {error && <p className="text-center text-sm text-red-500 mb-4">{error}</p>}

            <div className="text-center">
              <button
                onClick={handleStart}
                disabled={selectedKps.length === 0 || loading}
                className="px-10 py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-200 text-white font-medium rounded-2xl transition-all disabled:cursor-not-allowed flex items-center gap-2 mx-auto shadow-sm"
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
                开始练习（已选 {selectedKps.length} 个知识点）
              </button>
              <p className="text-xs text-gray-400 mt-3">选择一个或多个知识点来生成练习题目</p>
            </div>
          </>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          {phase === "result" ? (
            <button onClick={() => setPhase("doing")} className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
              <ArrowLeft className="w-4 h-4" /> 返回检查
            </button>
          ) : (
            <div>
              <h3 className="text-lg font-semibold text-gray-900">练习</h3>
              <p className="text-sm text-gray-500">选择你认为正确的答案</p>
            </div>
          )}
        </div>
        {phase === "doing" && (
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-500">
              {Object.keys(answers).length}/{questions.length} 已作答
            </span>
          </div>
        )}
        {phase === "result" && (
          <button
            onClick={handleStart}
            className="flex items-center gap-1.5 text-sm text-orange-500 hover:text-orange-600"
          >
            <RefreshCw className="w-4 h-4" />
            重新练习
          </button>
        )}
      </div>

      {/* Questions */}
      <div className="space-y-4">
        {questions.map((q, i) => (
          <QuestionCard
            key={q.id}
            question={q}
            index={i}
            selectedAnswer={answers[q.id] || null}
            onAnswer={(ans) => handleAnswer(q.id, ans)}
            showResult={phase === "result"}
            isCorrect={results.find((r) => r.questionId === q.id)?.correct}
            explanation={results.find((r) => r.questionId === q.id)?.explanation}
          />
        ))}
      </div>

      {/* Submit button at bottom */}
      {phase === "doing" && (
        <div className="mt-6 flex flex-col items-center gap-3 pt-4 border-t border-gray-100">
          <div className="text-sm text-gray-400">
            {Object.keys(answers).length}/{questions.length} 已作答
            {!allAnswered && <span className="text-amber-500 ml-2">请完成所有题目后再提交</span>}
          </div>
          <button
            onClick={handleSubmit}
            disabled={!allAnswered || loading}
            className="px-10 py-3 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-200 text-white font-medium rounded-2xl transition-all disabled:cursor-not-allowed flex items-center gap-2 shadow-sm hover:shadow-md"
          >
            {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : null}
            提交批改
          </button>
        </div>
      )}

      {/* Result Summary */}
      {phase === "result" && (
        <div className="mt-6 p-6 bg-white rounded-xl border border-gray-100 text-center">
          <CheckCircle2 className="w-10 h-10 text-green-500 mx-auto mb-2" />
          <h3 className="text-lg font-semibold text-gray-900 mb-1">批改完成</h3>
          <p className="text-3xl font-bold text-orange-500 mb-2">
            {score} / {results.length}
          </p>
          <p className="text-sm text-gray-500">
            正确率：{results.length > 0 ? Math.round((score / results.length) * 100) : 0}%
          </p>
        </div>
      )}
    </div>
  );
}





