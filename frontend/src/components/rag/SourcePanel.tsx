import { BookOpen, BrainCircuit, ChevronDown, ChevronUp, FileText, GitBranch, Search } from "lucide-react";
import { useState } from "react";
import type { QARagTrace, QASource } from "../../mock/api";

interface SourcePanelProps {
  sources: QASource[];
  ragTrace?: QARagTrace;
}

function percent(score?: number) {
  if (score === undefined || score === null) return "未计算";
  const value = score > 1 ? score : score * 100;
  return `${Math.round(value)}%`;
}

function modeText(mode?: QASource["retrievalMode"] | QARagTrace["retrievalMode"]) {
  if (mode === "keyword") return "关键词兜底";
  if (mode === "vector") return "向量检索";
  return "通用回答";
}

export default function SourcePanel({ sources, ragTrace }: SourcePanelProps) {
  const [expanded, setExpanded] = useState(true);
  const [traceExpanded, setTraceExpanded] = useState(false);
  const hasSources = sources && sources.length > 0;
  const mode = ragTrace?.retrievalMode || sources[0]?.retrievalMode || "none";

  return (
    <div className="mt-3 w-full space-y-2">
      <div className="rounded-xl border border-gray-100 bg-white overflow-hidden">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex items-center justify-between w-full px-4 py-2.5 text-sm"
        >
          <div className="flex items-center gap-2 text-gray-600">
            <BookOpen className="w-4 h-4 text-orange-400" />
            <span className="font-medium">
              知识来源卡片（{hasSources ? sources.length : 0} 条，{modeText(mode)}）
            </span>
          </div>
          {expanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
        </button>
        {expanded && (
          <div className="px-4 pb-3 space-y-2 animate-fade-in">
            {!hasSources ? (
              <div className="rounded-lg border border-dashed border-gray-200 bg-gray-50 px-3 py-3 text-xs text-gray-500">
                本次没有命中课程知识库，回答会标记为通用回答。可以让管理员上传 PDF 并完成向量化后再试。
              </div>
            ) : sources.map((src) => (
              <div key={src.chunkId || `${src.filename}-${src.page}-${src.snippet}`} className="bg-gray-50 rounded-lg border border-gray-100 p-3">
                <div className="flex items-start gap-2">
                  <FileText className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 text-xs">
                      <span className="font-semibold text-gray-800 truncate">{src.filename || "课程资料"}</span>
                      <span className="text-gray-400">第 {src.page || 1} 页</span>
                      <span className="rounded-full bg-white border border-gray-100 px-2 py-0.5 text-gray-500">
                        {modeText(src.retrievalMode)}
                      </span>
                      <span className="rounded-full bg-orange-50 px-2 py-0.5 text-orange-600">
                        相似度 {percent(src.score)}
                      </span>
                    </div>
                    {src.chapter && <p className="mt-1 text-xs font-medium text-gray-700">{src.chapter}</p>}
                    <p className="mt-1.5 text-xs leading-relaxed text-gray-500 whitespace-pre-wrap">
                      {src.snippet || src.content}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {ragTrace && (
        <div className="rounded-xl border border-indigo-100 bg-indigo-50/40 overflow-hidden">
          <button
            onClick={() => setTraceExpanded(!traceExpanded)}
            className="flex items-center justify-between w-full px-4 py-2.5 text-sm"
          >
            <div className="flex items-center gap-2 text-indigo-700">
              <GitBranch className="w-4 h-4" />
              <span className="font-medium">查看本次 RAG 链路</span>
            </div>
            {traceExpanded ? <ChevronUp className="w-4 h-4 text-indigo-400" /> : <ChevronDown className="w-4 h-4 text-indigo-400" />}
          </button>
          {traceExpanded && (
            <div className="px-4 pb-4">
              <div className="grid gap-2 sm:grid-cols-4">
                {ragTrace.steps.map((step, index) => {
                  const Icon = index === 0 ? Search : index === 1 ? BrainCircuit : index === 2 ? FileText : BookOpen;
                  return (
                    <div key={`${step.title}-${index}`} className="rounded-lg bg-white border border-indigo-100 p-3">
                      <div className="flex items-center gap-1.5 text-xs font-semibold text-indigo-700">
                        <Icon className="w-3.5 h-3.5" />
                        {step.title}
                      </div>
                      <p className="mt-2 text-xs leading-relaxed text-gray-600 whitespace-pre-wrap line-clamp-6">
                        {step.detail}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
