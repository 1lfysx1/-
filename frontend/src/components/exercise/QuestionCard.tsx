import type { Question } from "../../mock/api";

interface QuestionCardProps {
  question: Question;
  index: number;
  selectedAnswer: string | string[] | null;
  onAnswer: (answer: string | string[]) => void;
  showResult?: boolean;
  isCorrect?: boolean;
  explanation?: string;
}

export default function QuestionCard({
  question,
  index,
  selectedAnswer,
  onAnswer,
  showResult,
  isCorrect,
  explanation,
}: QuestionCardProps) {
  const isMultiple = question.type === "multiple";

  const handleSelect = (key: string) => {
    if (showResult) return;
    if (isMultiple) {
      const current = (selectedAnswer as string[]) || [];
      const next = current.includes(key) ? current.filter((k) => k !== key) : [...current, key];
      onAnswer(next);
    } else {
      onAnswer(key);
    }
  };
  const typeLabel = question.type === "single" ? "单选题" : question.type === "multiple" ? "多选题" : "判断题";

  return (
    <div className={`bg-white rounded-xl border p-5 transition-all ${showResult ? (isCorrect ? "border-green-200 bg-green-50/30" : "border-red-200 bg-red-50/30") : "border-gray-100 hover:border-gray-200"}`}>
      <div className="flex items-center gap-2 mb-3">
        <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">第{index + 1}题</span>
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${question.type === "judge" ? "bg-purple-50 text-purple-600" : question.type === "multiple" ? "bg-blue-50 text-blue-600" : "bg-gray-100 text-gray-600"}`}>{typeLabel}</span>
      </div>
      <p className="text-sm font-medium text-gray-800 mb-3 leading-relaxed">{question.stem}</p>
      <div className="space-y-2">
        {question.options.map((opt) => {
          const isSelected = isMultiple
            ? (selectedAnswer as string[])?.includes(opt.key)
            : selectedAnswer === opt.key;
          const isCorrectOpt = isMultiple
            ? (question.answer as string[])?.includes(opt.key)
            : question.answer === opt.key;

          let borderClass = "border-gray-200 hover:border-gray-300";
          let bgClass = "bg-white hover:bg-gray-50";
          let textClass = "text-gray-700";
          let indicatorClass = "border-gray-300";

          if (showResult) {
            if (isCorrectOpt) {
              borderClass = "border-green-300";
              bgClass = "bg-green-50";
              textClass = "text-green-800";
              indicatorClass = "border-green-500 bg-green-500";
            } else if (isSelected && !isCorrectOpt) {
              borderClass = "border-red-300";
              bgClass = "bg-red-50";
              textClass = "text-red-700";
              indicatorClass = "border-red-500 bg-red-500";
            }
          } else if (isSelected) {
            borderClass = "border-orange-300";
            bgClass = "bg-orange-50";
            textClass = "text-orange-700";
            indicatorClass = "border-orange-500 bg-orange-500";
          }

          return (
            <button
              key={opt.key}
              onClick={() => handleSelect(opt.key)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl border text-sm text-left transition-all ${borderClass} ${bgClass}`}
            >
              <span className={`w-5 h-5 rounded-full border-2 flex items-center justify-center text-xs font-bold shrink-0 transition-all ${indicatorClass} ${isSelected || (showResult && isCorrectOpt) ? "text-white" : "text-transparent"}`}>
                {isSelected || (showResult && isCorrectOpt) ? "✓" : ""}
              </span>
              <span className={textClass}>{opt.key}. {opt.text}</span>
            </button>
          );
        })}
      </div>
      {showResult && explanation && (
        <div className={`mt-3 p-3 rounded-lg text-sm leading-relaxed ${isCorrect ? "bg-green-50 text-green-700" : "bg-red-50 text-red-700"}`}>
          <span className="font-medium">{isCorrect ? "✓ 正确" : "✕ 错误"}</span>
          <p className="mt-1 text-gray-600">{explanation}</p>
        </div>
      )}
    </div>
  );
}




