import { useState, useRef, useEffect, useCallback, useSyncExternalStore } from "react";
import { BookOpenCheck, Database, FileText, Loader2, RefreshCw, Send, Sparkles, Trash2 } from "lucide-react";
import MessageBubble from "./MessageBubble";
import { api, type CourseRagStatus } from "../../mock/api";
import { useApp } from "../../contexts/useApp";
import { askQuestion, clearChat, getChatSnapshot, getHistoryKey, subscribeChat } from "./qaStore";

const TEXT = {
  title: "智能问答",
  subtitle: "问答记录会按当前用户和课程自动保存，切换功能时也会继续生成",
  clear: "清空记录",
  generating: "正在生成回答，可以先使用其它功能",
  placeholder: "输入你的学习问题...",
  shortcut: "按 Enter 发送，Shift+Enter 换行",
};

function statusColor(status?: CourseRagStatus["status"]) {
  if (status === "indexed") return "bg-emerald-50 text-emerald-700 border-emerald-100";
  if (status === "partial") return "bg-amber-50 text-amber-700 border-amber-100";
  if (status === "parsed") return "bg-sky-50 text-sky-700 border-sky-100";
  return "bg-gray-50 text-gray-600 border-gray-100";
}

export default function ChatView() {
  const { selectedCourse, user } = useApp();
  const historyKey = getHistoryKey(user?.id, selectedCourse?.id);
  const chatState = useSyncExternalStore(
    useCallback((listener) => subscribeChat(historyKey, listener), [historyKey]),
    useCallback(() => getChatSnapshot(historyKey), [historyKey]),
    useCallback(() => getChatSnapshot(historyKey), [historyKey]),
  );
  const { messages, loading } = chatState;
  const [input, setInput] = useState("");
  const [ragStatus, setRagStatus] = useState<CourseRagStatus | null>(null);
  const [ragStatusLoading, setRagStatusLoading] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  const loadRagStatus = useCallback(async () => {
    if (!selectedCourse?.id) {
      setRagStatus(null);
      return;
    }
    setRagStatusLoading(true);
    try {
      setRagStatus(await api.learning.getCourseRagStatus(selectedCourse.id));
    } catch {
      setRagStatus(null);
    } finally {
      setRagStatusLoading(false);
    }
  }, [selectedCourse?.id]);

  useEffect(() => {
    void loadRagStatus();
  }, [loadRagStatus]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const doAsk = useCallback(async (text: string) => {
    await askQuestion(historyKey, text, selectedCourse?.id);
  }, [historyKey, selectedCourse?.id]);

  useEffect(() => {
    const pending = sessionStorage.getItem("pendingQuestion");
    if (!pending) return;
    sessionStorage.removeItem("pendingQuestion");
    void doAsk(pending);
  }, [doAsk]);

  const handleSend = async () => {
    const question = input.trim();
    if (!question || loading) return;
    setInput("");
    await doAsk(question);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full max-w-5xl mx-auto">
      <div className="border-b border-gray-100 pb-4 mb-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{TEXT.title}</h2>
            <p className="text-xs text-gray-400 mt-1">{TEXT.subtitle}</p>
          </div>
          <button
            onClick={() => clearChat(historyKey)}
            disabled={loading || messages.length <= 1}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-500 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all disabled:text-gray-300 disabled:bg-transparent disabled:cursor-not-allowed"
          >
            <Trash2 className="w-3.5 h-3.5" />
            {TEXT.clear}
          </button>
        </div>

        <div className={`mt-3 rounded-xl border px-4 py-3 ${statusColor(ragStatus?.status)}`}>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Database className="w-4 h-4" />
              <span className="text-sm font-semibold">当前课程知识库状态</span>
              <span className="rounded-full bg-white/70 px-2 py-0.5 text-xs">{ragStatus?.statusText || "未加载"}</span>
            </div>
            <button
              onClick={() => void loadRagStatus()}
              disabled={ragStatusLoading || !selectedCourse?.id}
              className="inline-flex items-center gap-1.5 rounded-lg bg-white/70 px-2.5 py-1 text-xs hover:bg-white disabled:opacity-60"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${ragStatusLoading ? "animate-spin" : ""}`} />
              刷新
            </button>
          </div>
          <div className="mt-2 grid gap-2 text-xs sm:grid-cols-4">
            <span className="inline-flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5" />
              资料 {ragStatus?.materialCount ?? 0} 份
            </span>
            <span className="inline-flex items-center gap-1.5">
              <BookOpenCheck className="w-3.5 h-3.5" />
              切片 {ragStatus?.chunkCount ?? 0} 个
            </span>
            <span>已向量化 {ragStatus?.embeddingSuccess ?? 0} 个</span>
            <span>索引状态 {ragStatus?.statusText || "未加载"}</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-4 pb-4">
        {messages.map((message, index) => (
          <MessageBubble
            key={`${message.role}-${index}`}
            role={message.role}
            content={message.content}
            sources={message.sources}
            ragTrace={message.ragTrace}
          />
        ))}
        {loading && (
          <div className="flex gap-3 animate-fade-in">
            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center">
              <Sparkles className="w-4 h-4 text-indigo-500" />
            </div>
            <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-md px-4 py-3 shadow-sm flex items-center gap-2 text-sm text-gray-500">
              <Loader2 className="w-5 h-5 text-orange-400 animate-spin" />
              {TEXT.generating}
            </div>
          </div>
        )}
        <div ref={bottomRef} />
      </div>

      <div className="border-t border-gray-100 pt-4 bg-white">
        <div className="flex items-end gap-2 bg-gray-50 rounded-2xl border border-gray-200 focus-within:border-orange-300 focus-within:ring-2 focus-within:ring-orange-100 transition-all px-4 py-3">
          <textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={TEXT.placeholder}
            rows={1}
            className="flex-1 bg-transparent outline-none text-sm text-gray-800 placeholder-gray-400 resize-none max-h-32"
          />
          <button
            onClick={() => void handleSend()}
            disabled={!input.trim() || loading}
            className="shrink-0 w-9 h-9 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:bg-gray-200 text-white flex items-center justify-center transition-all disabled:cursor-not-allowed"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-xs text-gray-400 mt-2 text-center">{TEXT.shortcut}</p>
      </div>
    </div>
  );
}
