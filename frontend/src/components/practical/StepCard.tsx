import { CheckCircle2, Circle, Clipboard, ImageIcon, Info, ShieldAlert, Terminal } from "lucide-react";
import { useState } from "react";
import type { Step } from "../../mock/api";

interface StepCardProps {
  step: Step;
  completed: boolean;
  onToggle: () => void;
}

function languageLabel(language?: string) {
  const value = (language || "text").toLowerCase();
  const labels: Record<string, string> = {
    bash: "终端",
    shell: "终端",
    powershell: "PowerShell",
    nginx: "Nginx 配置",
    python: "Python",
    json: "JSON",
    yaml: "YAML",
    text: "操作清单",
  };
  return labels[value] ?? value.toUpperCase();
}

export default function StepCard({ step, completed, onToggle }: StepCardProps) {
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const commands = step.commands ?? [];
  const notes = step.notes ?? [];
  const warnings = step.warnings ?? [];
  const displayImageUrl = step.hasImage ? step.imageUrl : "";
  const imageHint = step.screenshotHint || step.imagePrompt || "该步骤的教学截图示意";

  const copyCommand = async (code: string, index: number) => {
    await navigator.clipboard.writeText(code);
    setCopiedIndex(index);
    window.setTimeout(() => setCopiedIndex(null), 1200);
  };

  return (
    <article
      className={`rounded-xl border bg-white p-5 transition-all ${
        completed ? "border-green-200 shadow-sm" : "border-gray-200 hover:border-orange-200 hover:shadow-sm"
      }`}
    >
      <div className="flex items-start gap-3">
        <button
          type="button"
          onClick={onToggle}
          className="mt-1 shrink-0 rounded-full text-gray-300 transition-colors hover:text-orange-400"
          title={completed ? "标记为未完成" : "标记为已完成"}
        >
          {completed ? <CheckCircle2 className="h-5 w-5 text-green-500" /> : <Circle className="h-5 w-5" />}
        </button>

        <div className="min-w-0 flex-1">
          <div className="mb-3 flex flex-wrap items-center gap-2">
            <span className="rounded-full bg-orange-50 px-2.5 py-1 text-xs font-semibold text-orange-600">
              步骤 {step.index}
            </span>
            {completed && <span className="rounded-full bg-green-50 px-2 py-1 text-xs text-green-600">已完成</span>}
          </div>

          <h4 className="mb-2 text-base font-semibold leading-6 text-gray-900">{step.title || step.instruction}</h4>
          <p className="whitespace-pre-wrap text-sm leading-7 text-gray-600">{step.description}</p>

          {commands.length > 0 && (
            <div className="mt-4 space-y-3">
              {commands.map((command, index) => (
                <div key={`${step.index}-${index}`} className="overflow-hidden rounded-xl border border-gray-800 bg-gray-950">
                  <div className="flex items-center justify-between border-b border-gray-800 px-3 py-2">
                    <div className="flex items-center gap-2 text-xs font-medium text-gray-300">
                      <Terminal className="h-3.5 w-3.5 text-green-400" />
                      {languageLabel(command.language)}
                    </div>
                    <button
                      type="button"
                      onClick={() => void copyCommand(command.code, index)}
                      className="inline-flex items-center gap-1 rounded-md px-2 py-1 text-xs text-gray-300 transition-colors hover:bg-gray-800 hover:text-white"
                    >
                      <Clipboard className="h-3.5 w-3.5" />
                      {copiedIndex === index ? "已复制" : "复制"}
                    </button>
                  </div>
                  <pre className="max-h-80 overflow-auto px-4 py-3 text-sm leading-6 text-green-100">
                    <code>{command.code}</code>
                  </pre>
                  {command.comment && (
                    <div className="border-t border-gray-800 bg-gray-900 px-4 py-2 text-xs leading-5 text-gray-300">
                      {command.comment}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}

          {step.commandComment && (
            <div className="mt-3 rounded-lg border border-blue-100 bg-blue-50 px-3 py-2 text-sm leading-6 text-blue-700">
              <span className="font-medium">命令说明：</span>
              {step.commandComment}
            </div>
          )}

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {step.expectedResult && (
              <div className="rounded-lg border border-green-100 bg-green-50 px-3 py-2">
                <p className="mb-1 text-xs font-semibold text-green-700">预期结果</p>
                <p className="text-sm leading-6 text-green-700">{step.expectedResult}</p>
              </div>
            )}
            {step.verification && (
              <div className="rounded-lg border border-indigo-100 bg-indigo-50 px-3 py-2">
                <p className="mb-1 text-xs font-semibold text-indigo-700">验证方式</p>
                <p className="text-sm leading-6 text-indigo-700">{step.verification}</p>
              </div>
            )}
          </div>

          {(notes.length > 0 || warnings.length > 0) && (
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              {notes.length > 0 && (
                <div className="rounded-lg border border-gray-200 bg-gray-50 px-3 py-3">
                  <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-gray-700">
                    <Info className="h-4 w-4" />
                    注意事项
                  </div>
                  <ul className="space-y-1 text-sm leading-6 text-gray-600">
                    {notes.map((note) => (
                      <li key={note}>• {note}</li>
                    ))}
                  </ul>
                </div>
              )}
              {warnings.length > 0 && (
                <div className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-3">
                  <div className="mb-2 flex items-center gap-2 text-xs font-semibold text-amber-700">
                    <ShieldAlert className="h-4 w-4" />
                    风险提醒
                  </div>
                  <ul className="space-y-1 text-sm leading-6 text-amber-700">
                    {warnings.map((warning) => (
                      <li key={warning}>• {warning}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}

          {displayImageUrl && (
            <figure className="mt-4 rounded-xl border border-dashed border-gray-200 bg-gray-50 p-3">
              <div className="overflow-hidden rounded-lg border border-gray-100 bg-white">
                <img
                  src={displayImageUrl}
                  alt={step.imageAlt || `步骤 ${step.index} 教学截图`}
                  className="max-h-72 w-full object-contain bg-white"
                />
              </div>
              <figcaption className="mt-2 flex items-start gap-1.5 text-xs leading-5 text-gray-500">
                <ImageIcon className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                <span>AI 教学截图：{imageHint}</span>
              </figcaption>
            </figure>
          )}
        </div>
      </div>
    </article>
  );
}
