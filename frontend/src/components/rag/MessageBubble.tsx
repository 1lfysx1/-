import { Bot, BotMessageSquare, CheckCircle2, Search, ShieldAlert, User } from "lucide-react";
import SourcePanel from "./SourcePanel";
import type { QARagTrace, QASource } from "../../mock/api";

interface MessageBubbleProps {
  role: "user" | "assistant";
  content: string;
  sources?: QASource[];
  ragTrace?: QARagTrace;
}

function modeLabel(trace?: QARagTrace) {
  if (!trace) return "通用回答";
  if (trace.retrievalMode === "keyword") return "关键词兜底";
  if (trace.usedContext) return "基于知识库生成";
  return "通用回答";
}

export default function MessageBubble({ role, content, sources, ragTrace }: MessageBubbleProps) {
  const isUser = role === "user";
  const mode = modeLabel(ragTrace);

  return (
    <div className={`flex gap-3 animate-fade-in-up ${isUser ? "flex-row-reverse" : ""}`}>
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
          isUser ? "bg-orange-100" : "bg-indigo-100"
        }`}
      >
        {isUser ? <User className="w-4 h-4 text-orange-500" /> : <Bot className="w-4 h-4 text-indigo-500" />}
      </div>
      <div className={`max-w-[78%] ${isUser ? "items-end" : "items-start"} flex flex-col`}>
        {!isUser && (
          <div className="mb-1 flex flex-wrap items-center gap-2 text-[11px] text-gray-500">
            <span className="inline-flex items-center gap-1 rounded-full bg-gray-50 border border-gray-100 px-2 py-0.5">
              {ragTrace?.retrievalMode === "keyword" ? <Search className="w-3 h-3 text-amber-500" /> : <BotMessageSquare className="w-3 h-3 text-indigo-500" />}
              {mode}
            </span>
            <span className="inline-flex items-center gap-1 rounded-full bg-gray-50 border border-gray-100 px-2 py-0.5">
              {ragTrace?.usedContext ? <CheckCircle2 className="w-3 h-3 text-emerald-500" /> : <ShieldAlert className="w-3 h-3 text-gray-400" />}
              {ragTrace?.usedContext ? "已使用课程知识库" : "未命中课程知识库"}
            </span>
          </div>
        )}
        <div
          className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
            isUser
              ? "bg-orange-500 text-white rounded-tr-md"
              : "bg-white border border-gray-100 text-gray-800 shadow-sm rounded-tl-md"
          }`}
        >
          {content}
        </div>
        {!isUser && <SourcePanel sources={sources || []} ragTrace={ragTrace} />}
      </div>
    </div>
  );
}
