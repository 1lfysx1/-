import { useEffect, useState } from "react";
import { ArrowLeft, CheckCircle2, Loader2 } from "lucide-react";
import { api, type ExerciseResult, type Question } from "../mock/api";
import QuestionCard from "../components/exercise/QuestionCard";
import { useApp } from "../contexts/useApp";

interface PretestPageProps {
  onDone: () => void;
  onBack: () => void;
}

export default function PretestPage({ onDone, onBack }: PretestPageProps) {
  const { selectedCourse } = useApp();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [results, setResults] = useState<ExerciseResult[]>([]);
  const [scoreText, setScoreText] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      if (!selectedCourse?.id) {
        onBack();
        return;
      }
      setLoading(true);
      setError("");
      try {
        const status = await api.exercise.getPretestStatus(selectedCourse.id);
        if (status.completed) {
          onDone();
          return;
        }
        const qs = await api.exercise.getPretestQuestions(selectedCourse.id);
        setQuestions(qs.slice(0, 8));
        if (qs.length === 0) {
          setError("当前课程暂无可用题库，无法生成使用前问卷。请管理员先上传该课程题库。");
        }
      } catch {
        setError("使用前问卷加载失败，请稍后重试。");
      } finally {
        setLoading(false);
      }
    };
    void load();
  }, [onBack, onDone, selectedCourse?.id]);

  const handleAnswer = (questionId: string, answer: string | string[]) => {
    setAnswers((previous) => ({ ...previous, [questionId]: answer }));
  };

  const allAnswered = questions.length > 0 && questions.every((question) => {
    const answer = answers[question.id];
    if (!answer) return false;
    if (question.type === "multiple") return Array.isArray(answer) && answer.length > 0;
    return true;
  });

  const handleSubmit = async () => {
    if (!selectedCourse?.id || !allAnswered) return;
    setSubmitting(true);
    setError("");
    try {
      const payload = Object.entries(answers).map(([questionId, answer]) => ({ questionId, answer }));
      const response = await api.exercise.submitPretest(selectedCourse.id, payload);
      setResults(response.results);
      setScoreText(`${response.score}/${response.total}，正确率 ${response.percent}%`);
    } catch {
      setError("使用前问卷提交失败，请稍后重试。");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 px-6 py-8">
      <div className="mx-auto max-w-3xl">
        <button onClick={onBack} className="mb-5 inline-flex items-center gap-1 text-sm text-gray-500 hover:text-gray-700">
          <ArrowLeft className="h-4 w-4" />
          返回课程选择
        </button>

        <div className="mb-6 rounded-2xl border border-orange-100 bg-white p-6 shadow-sm">
          <h1 className="text-xl font-semibold text-gray-900">使用前问卷</h1>
          <p className="mt-2 text-sm leading-6 text-gray-500">
            这是进入课程前的基础测评，题目来自当前课程题库。系统会把本次结果记录为使用前数据，用于和后续模拟练习成绩进行真实对比。
          </p>
          {selectedCourse && <p className="mt-2 text-xs text-orange-600">当前课程：{selectedCourse.name}</p>}
        </div>

        {loading ? (
          <div className="flex justify-center py-20">
            <Loader2 className="h-8 w-8 animate-spin text-orange-400" />
          </div>
        ) : error ? (
          <div className="rounded-xl border border-red-100 bg-red-50 px-4 py-8 text-center text-sm text-red-600">
            {error}
          </div>
        ) : (
          <>
            <div className="mb-4 text-sm text-gray-500">
              已作答 {Object.keys(answers).length}/{questions.length}
            </div>
            <div className="space-y-4">
              {questions.map((question, index) => (
                <QuestionCard
                  key={question.id}
                  question={question}
                  index={index}
                  selectedAnswer={answers[question.id] || null}
                  onAnswer={(answer) => handleAnswer(question.id, answer)}
                  showResult={results.length > 0}
                  isCorrect={results.find((result) => result.questionId === question.id)?.correct}
                  explanation={results.find((result) => result.questionId === question.id)?.explanation}
                />
              ))}
            </div>

            {scoreText ? (
              <div className="mt-6 rounded-xl border border-green-200 bg-green-50 p-5 text-center">
                <CheckCircle2 className="mx-auto mb-2 h-8 w-8 text-green-500" />
                <p className="text-sm font-medium text-green-700">使用前问卷已完成：{scoreText}</p>
                <button onClick={onDone} className="mt-4 rounded-xl bg-orange-500 px-6 py-2 text-sm font-medium text-white hover:bg-orange-600">
                  进入学习系统
                </button>
              </div>
            ) : (
              <div className="mt-6 flex flex-col items-center gap-3 border-t border-gray-100 pt-5">
                {!allAnswered && <p className="text-sm text-amber-600">请完成全部题目后再提交</p>}
                <button
                  onClick={() => void handleSubmit()}
                  disabled={!allAnswered || submitting}
                  className="inline-flex items-center gap-2 rounded-2xl bg-orange-500 px-10 py-3 text-sm font-medium text-white shadow-sm transition-all hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-gray-200"
                >
                  {submitting && <Loader2 className="h-5 w-5 animate-spin" />}
                  提交问卷
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
