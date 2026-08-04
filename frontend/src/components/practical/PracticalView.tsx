import { useCallback, useEffect, useState, useSyncExternalStore } from "react";
import { AlertCircle, Bot, CheckCircle2, Clock3, Lightbulb, ListChecks, Loader2, Search, Trash2 } from "lucide-react";
import type { PracticalHistoryItem } from "./practicalStore";
import { useApp } from "../../contexts/useApp";
import StepCard from "./StepCard";
import {
  clearPracticalHistory,
  generatePractical,
  getPracticalHistoryKey,
  getPracticalSnapshot,
  selectPracticalHistory,
  subscribePractical,
  togglePracticalStep,
} from "./practicalStore";

function formatTime(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleString("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function HistoryItemButton({
  item,
  active,
  onSelect,
}: {
  item: PracticalHistoryItem;
  active: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`w-full rounded-xl border px-3 py-2 text-left transition-all ${
        active ? "border-orange-200 bg-orange-50" : "border-gray-100 bg-white hover:border-gray-200 hover:bg-gray-50"
      }`}
    >
      <p className="line-clamp-2 text-sm font-medium leading-5 text-gray-800">{item.query}</p>
      <div className="mt-1 flex items-center gap-1 text-xs text-gray-400">
        <Clock3 className="h-3 w-3" />
        {formatTime(item.createdAt)}
      </div>
    </button>
  );
}

export default function PracticalView() {
  const { selectedCourse, user } = useApp();
  const historyKey = getPracticalHistoryKey(user?.id, selectedCourse?.id);
  const practicalState = useSyncExternalStore(
    useCallback((listener) => subscribePractical(historyKey, listener), [historyKey]),
    useCallback(() => getPracticalSnapshot(historyKey), [historyKey]),
    useCallback(() => getPracticalSnapshot(historyKey), [historyKey]),
  );
  const { history, result, activeHistoryId, loading, error, generatingQuery, completedStepIndexes } = practicalState;
  const [query, setQuery] = useState("");
  const completedSteps = new Set(completedStepIndexes);

  useEffect(() => {
    if (!query && generatingQuery) setQuery(generatingQuery);
  }, [generatingQuery, query]);

  const handleGenerate = async () => {
    const text = query.trim();
    if (!text || loading) return;
    await generatePractical(historyKey, text, selectedCourse?.id);
  };

  const handleSelectHistory = (item: PracticalHistoryItem) => {
    setQuery(item.query);
    selectPracticalHistory(historyKey, item.id);
  };

  return (
    <div className="mx-auto max-w-6xl">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">实操指导</h2>
        <p className="mt-1 text-sm text-gray-500">
          输入操作类问题，系统会生成教程步骤、终端代码、中文注释和注意事项；切换到其它功能时也会继续生成
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_280px]">
        <div className="min-w-0">
          <div className="mb-4 flex items-center gap-2 rounded-2xl border border-gray-200 bg-white p-2 transition-all focus-within:border-orange-300 focus-within:ring-2 focus-within:ring-orange-100">
            <div className="flex flex-1 items-center gap-2 px-3">
              <Search className="h-5 w-5 text-gray-400" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                onKeyDown={(event) => event.key === "Enter" && void handleGenerate()}
                placeholder="例如：如何配置 Nginx 反向代理？"
                className="flex-1 outline-none text-sm text-gray-800 placeholder-gray-400"
              />
            </div>
            <button
              type="button"
              onClick={() => void handleGenerate()}
              disabled={!query.trim() || loading}
              className="flex items-center gap-1.5 rounded-xl bg-orange-500 px-5 py-2 text-sm font-medium text-white transition-all hover:bg-orange-600 disabled:cursor-not-allowed disabled:bg-gray-200"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {loading ? "生成中" : "生成教程"}
            </button>
          </div>

          {error && (
            <div className="mb-4 flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}

          {!result && !loading && (
            <div className="flex items-start gap-3 rounded-xl border border-indigo-100 bg-indigo-50/50 p-4">
              <Lightbulb className="mt-0.5 h-5 w-5 shrink-0 text-indigo-500" />
              <div className="text-sm text-indigo-700">
                <p className="mb-1 font-medium">提示</p>
                <p>适合输入安装、配置、部署、启动、排错类问题。生成结果会包含步骤、命令、注释、验证方式和 AI 教学截图。</p>
              </div>
            </div>
          )}

          {loading && (
            <div className="mb-4 flex items-center justify-center rounded-2xl border border-orange-100 bg-orange-50 py-10">
              <div className="flex flex-col items-center gap-3 text-orange-600">
                <Loader2 className="h-8 w-8 animate-spin" />
                <span className="text-sm">
                  正在生成“{generatingQuery || query.trim()}”，可以先使用其它功能，回来后会继续显示结果
                </span>
              </div>
            </div>
          )}

          {result && (
            <div className="animate-fade-in">
              <article className="mb-5 rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <h3 className="text-2xl font-semibold leading-8 text-gray-900">{result.title}</h3>
                    <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-gray-500">
                      {result.intent && <span>{result.intent}</span>}
                      {result.source && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1">
                          <Bot className="h-3 w-3" />
                          {result.source === "llm" ? "大模型生成" : "本地模板"}
                        </span>
                      )}
                      <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-2 py-1 text-orange-600">
                        <ListChecks className="h-3 w-3" />
                        CSDN 教程风格
                      </span>
                    </div>
                    {result.summary && <p className="mt-4 text-sm leading-7 text-gray-600">{result.summary}</p>}
                  </div>
                  <span className="rounded-full bg-gray-100 px-3 py-1.5 text-xs text-gray-500">
                    {completedSteps.size}/{result.steps.length} 已完成
                  </span>
                </div>

                {result.prerequisites && result.prerequisites.length > 0 && (
                  <div className="mt-5 rounded-xl border border-orange-100 bg-orange-50/60 p-4">
                    <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-orange-700">
                      <Lightbulb className="h-4 w-4" />
                      环境准备
                    </div>
                    <ul className="grid gap-2 text-sm leading-6 text-orange-800 md:grid-cols-2">
                      {result.prerequisites.map((item) => (
                        <li key={item} className="flex gap-2">
                          <CheckCircle2 className="mt-1 h-3.5 w-3.5 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </article>

              <div className="space-y-3">
                {result.steps.map((step) => (
                  <StepCard
                    key={step.index}
                    step={step}
                    completed={completedSteps.has(step.index)}
                    onToggle={() => togglePracticalStep(historyKey, step.index)}
                  />
                ))}
              </div>

              {completedSteps.size === result.steps.length && (
                <div className="mt-6 rounded-xl border border-green-200 bg-green-50 p-4 text-center">
                  <p className="text-sm font-medium text-green-700">所有步骤已完成</p>
                </div>
              )}
            </div>
          )}
        </div>

        <aside className="h-fit rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
          <div className="mb-3 flex items-center justify-between gap-3">
            <div>
              <h3 className="text-sm font-semibold text-gray-900">历史记录</h3>
              <p className="mt-0.5 text-xs text-gray-400">按当前用户和课程保存</p>
            </div>
            <button
              type="button"
              onClick={() => clearPracticalHistory(historyKey)}
              disabled={history.length === 0 || loading}
              className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-red-50 hover:text-red-500 disabled:cursor-not-allowed disabled:text-gray-200 disabled:hover:bg-transparent"
              title="清空历史记录"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>

          {loading && (
            <div className="mb-3 rounded-xl border border-orange-100 bg-orange-50 px-3 py-2 text-xs leading-5 text-orange-700">
              正在生成：{generatingQuery || query.trim()}
            </div>
          )}

          {history.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-200 px-3 py-6 text-center text-xs text-gray-400">
              生成后的实操教程会保存在这里
            </div>
          ) : (
            <div className="space-y-2">
              {history.map((item) => (
                <HistoryItemButton
                  key={item.id}
                  item={item}
                  active={item.id === activeHistoryId}
                  onSelect={() => handleSelectHistory(item)}
                />
              ))}
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
