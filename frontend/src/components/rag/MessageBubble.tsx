import { User, Bot } from "lucide-react";
import SourcePanel from "./SourcePanel";
import type { QASource } from "../../mock/api";

interface MessageBubbleProps {
  role: "user" | "assistant";
  content: string;
  sources?: QASource[];
  timestamp?: string;
}

export default function MessageBubble({ role, content, sources }: MessageBubbleProps) {
  const isUser = role === "user";

  return (
    <div className={`flex gap-3 animate-fade-in-up ${isUser ? "flex-row-reverse" : ""}`}>
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
          isUser ? "bg-orange-100" : "bg-indigo-100"
        }`}
      >
        {isUser ? (
          <User className="w-4 h-4 text-orange-500" />
        ) : (
          <Bot className="w-4 h-4 text-indigo-500" />
        )}
      </div>
      <div className={`max-w-[75%] ${isUser ? "items-end" : "items-start"} flex flex-col`}>
        <div
          className={`px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap ${
            isUser
              ? "bg-orange-500 text-white rounded-tr-md"
              : "bg-white border border-gray-100 text-gray-800 shadow-sm rounded-tl-md"
          }`}
        >
          {content}
        </div>
        {!isUser && sources && <SourcePanel sources={sources} />}
      </div>
    </div>
  );
}


