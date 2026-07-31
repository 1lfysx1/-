import { useState } from "react";
import { AlertCircle, Bot, Lightbulb, Loader2, Search } from "lucide-react";
import { api, type PracticalResponse } from "../../mock/api";
import { useApp } from "../../contexts/useApp";
import StepCard from "./StepCard";

export default function PracticalView() {
  const { selectedCourse } = useApp();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [result, setResult] = useState<PracticalResponse | null>(null);
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const handleGenerate = async () => {
    const q = query.trim();
    if (!q || loading) return;
    setLoading(true);
    setError("");
    setResult(null);
    setCompletedSteps(new Set());
    try {
      const res = await api.practical.generate(q, selectedCourse?.id);
      setResult(res);
    } catch (err) {
      setError(err instanceof Error ? err.message : "生成失败，请稍后重试");
    } finally {
      setLoading(false);
    }
  };

  const toggleStep = (idx: number) => {
    setCompletedSteps((prev) => {
      const next = new Set(prev);
      if (next.has(idx)) next.delete(idx);
      else next.add(idx);
      return next;
    });
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="mb-6">
        <h2 className="text-xl font-semibold text-gray-900">实操指导</h2>
        <p className="text-sm text-gray-500 mt-1">输入操作类问题，系统会生成带 AI 示意图的分步指导</p>
      </div>

      <div className="flex items-center gap-2 bg-white rounded-2xl border border-gray-200 p-2 mb-4 focus-within:border-orange-300 focus-within:ring-2 focus-within:ring-orange-100 transition-all">
        <div className="flex-1 flex items-center gap-2 px-3">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            onKeyDown={(event) => event.key === "Enter" && void handleGenerate()}
            placeholder="例如：如何配置 Nginx 反向代理？"
            className="flex-1 outline-none text-sm text-gray-800 placeholder-gray-400"
          />
        </div>
        <button
          onClick={() => void handleGenerate()}
          disabled={!query.trim() || loading}
          className="px-5 py-2 bg-orange-500 hover:bg-orange-600 disabled:bg-gray-200 text-white text-sm font-medium rounded-xl transition-all disabled:cursor-not-allowed flex items-center gap-1.5"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
          {loading ? "生成中" : "生成步骤"}
        </button>
      </div>

      {error && (
        <div className="mb-4 flex items-center gap-2 rounded-xl border border-red-100 bg-red-50 px-4 py-3 text-sm text-red-600">
          <AlertCircle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {!result && !loading && (
        <div className="bg-indigo-50/50 border border-indigo-100 rounded-xl p-4 flex items-start gap-3">
          <Lightbulb className="w-5 h-5 text-indigo-500 mt-0.5 shrink-0" />
          <div className="text-sm text-indigo-700">
            <p className="font-medium mb-1">提示</p>
            <p>适合输入安装、配置、部署、启动、排错类问题。生成结果会包含操作说明、预期结果和 AI 示意图。</p>
          </div>
        </div>
      )}

      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-3 text-gray-400">
            <Loader2 className="w-8 h-8 animate-spin text-orange-400" />
            <span className="text-sm">正在生成实操步骤...</span>
          </div>
        </div>
      )}

      {result && (
        <div className="animate-fade-in">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <div>
              <h3 className="text-lg font-medium text-gray-900">{result.title}</h3>
              <div className="mt-1 flex flex-wrap items-center gap-2 text-xs text-gray-400">
                {result.intent && <span>{result.intent}</span>}
                {result.source && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-2 py-1">
                    <Bot className="w-3 h-3" />
                    {result.source === "llm" ? "大模型生成" : "本地模板"}
                  </span>
                )}
              </div>
            </div>
            <span className="text-xs text-gray-400 bg-gray-100 px-2 py-1 rounded-full">
              {completedSteps.size}/{result.steps.length} 已完成
            </span>
          </div>
          <div className="space-y-3">
            {result.steps.map((step) => (
              <StepCard
                key={step.index}
                step={step}
                completed={completedSteps.has(step.index)}
                onToggle={() => toggleStep(step.index)}
              />
            ))}
          </div>
          {completedSteps.size === result.steps.length && (
            <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-xl text-center">
              <p className="text-sm font-medium text-green-700">所有步骤已完成</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
