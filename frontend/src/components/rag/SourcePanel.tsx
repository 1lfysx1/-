import { BookOpen, FileText, ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";
import type { QASource } from "../../mock/api";

interface SourcePanelProps {
  sources: QASource[];
}

export default function SourcePanel({ sources }: SourcePanelProps) {
  const [expanded, setExpanded] = useState(false);

  if (!sources || sources.length === 0) return null;

  return (
    <div className="mt-3 border border-gray-100 rounded-xl bg-gray-50/50 overflow-hidden">
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center justify-between w-full px-4 py-2.5 text-sm"
      >
        <div className="flex items-center gap-2 text-gray-500">
          <BookOpen className="w-4 h-4 text-orange-400" />
          <span className="font-medium">参考资料（{sources.length} 条）</span>
        </div>
        {expanded ? <ChevronUp className="w-4 h-4 text-gray-400" /> : <ChevronDown className="w-4 h-4 text-gray-400" />}
      </button>
      {expanded && (
        <div className="px-4 pb-3 space-y-2 animate-fade-in">
          {sources.map((src, i) => (
            <div key={i} className="flex items-start gap-2 p-2.5 bg-white rounded-lg border border-gray-100">
              <FileText className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" />
              <div className="text-xs text-gray-600 leading-relaxed">
                <span className="font-medium text-gray-800">{src.chapter}</span>
                <span className="text-gray-400"> · 第{src.page}页</span>
                <p className="mt-0.5 text-gray-500">{src.snippet}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}



