import { CheckCircle2, Circle, ImageIcon } from "lucide-react";
import type { Step } from "../../mock/api";

interface StepCardProps {
  step: Step;
  completed: boolean;
  onToggle: () => void;
}

export default function StepCard({ step, completed, onToggle }: StepCardProps) {
  const displayImageUrl = step.imageUrl || null;
  const imageHint = step.screenshotHint || step.imagePrompt || "该步骤的可视化参考";

  return (
    <div
      className={`flex gap-4 p-4 rounded-xl border transition-all ${
        completed
          ? "bg-green-50/50 border-green-200"
          : "bg-white border-gray-100 hover:border-gray-200 hover:shadow-sm"
      }`}
    >
      <button
        type="button"
        onClick={onToggle}
        className="mt-0.5 shrink-0"
        title={completed ? "标记为未完成" : "标记为已完成"}
      >
        {completed ? (
          <CheckCircle2 className="w-5 h-5 text-green-500" />
        ) : (
          <Circle className="w-5 h-5 text-gray-300 hover:text-orange-400 transition-colors" />
        )}
      </button>
      <div className="flex-1 min-w-0">
        <div className="flex items-start gap-2 mb-2">
          <span className="text-xs font-semibold text-orange-500 bg-orange-50 px-2 py-0.5 rounded-full shrink-0">
            步骤 {step.index}
          </span>
          <h4 className="text-sm font-medium text-gray-800 leading-5 break-words">{step.instruction}</h4>
        </div>
        <p className="text-sm text-gray-500 leading-relaxed whitespace-pre-wrap">{step.description}</p>
        {step.expectedResult && (
          <div className="mt-3 rounded-lg bg-green-50/70 border border-green-100 px-3 py-2">
            <p className="text-xs font-medium text-green-700 mb-1">预期结果</p>
            <p className="text-xs text-green-700 leading-relaxed">{step.expectedResult}</p>
          </div>
        )}
        {step.hasImage && (
          <div className="mt-3 rounded-lg border border-dashed border-gray-200 bg-gray-50 p-3">
            {displayImageUrl ? (
              <div className="space-y-3">
                <div className="overflow-hidden rounded-lg bg-white border border-gray-100">
                  <img
                    src={displayImageUrl}
                    alt={step.imageAlt || `步骤 ${step.index} AI示意图`}
                    className="max-h-72 w-full object-contain bg-white"
                  />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-gray-500">AI生成示意图</p>
                  <p className="text-xs text-gray-400 truncate">{imageHint}</p>
                </div>
              </div>
            ) : (
              <div className="flex min-h-28 items-center justify-center rounded-lg border border-transparent">
                <div className="flex flex-col items-center gap-1 text-gray-400 text-center">
                  <ImageIcon className="w-6 h-6" />
                  <span className="text-xs font-medium">AI示意图生成中</span>
                  <span className="text-xs leading-relaxed">{imageHint}</span>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
