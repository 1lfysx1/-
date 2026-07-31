import { useState, useRef, useEffect, useCallback, useSyncExternalStore } from "react";
import { Loader2, Send, Sparkles, Trash2 } from "lucide-react";
import MessageBubble from "./MessageBubble";
import { useApp } from "../../contexts/useApp";
import { askQuestion, clearChat, getChatSnapshot, getHistoryKey, subscribeChat } from "./qaStore";

const TEXT = {
  title: "\u667a\u80fd\u95ee\u7b54",
  subtitle:
    "\u95ee\u7b54\u8bb0\u5f55\u4f1a\u6309\u5f53\u524d\u7528\u6237\u548c\u8bfe\u7a0b\u81ea\u52a8\u4fdd\u5b58\uff0c" +
    "\u5207\u6362\u529f\u80fd\u65f6\u4e5f\u4f1a\u7ee7\u7eed\u751f\u6210",
  clear: "\u6e05\u7a7a\u8bb0\u5f55",
  generating: "\u6b63\u5728\u751f\u6210\u56de\u7b54\uff0c\u53ef\u4ee5\u5148\u4f7f\u7528\u5176\u5b83\u529f\u80fd",
  placeholder: "\u8f93\u5165\u4f60\u7684\u5b66\u4e60\u95ee\u9898...",
  shortcut: "\u6309 Enter \u53d1\u9001\uff0cShift+Enter \u6362\u884c",
};

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
  const bottomRef = useRef<HTMLDivElement>(null);

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
    <div className="flex flex-col h-full max-w-4xl mx-auto">
      <div className="flex items-center justify-between border-b border-gray-100 pb-3 mb-4">
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

      <div className="flex-1 overflow-y-auto space-y-4 pb-4">
        {messages.map((message, index) => (
          <MessageBubble key={`${message.role}-${index}`} role={message.role} content={message.content} sources={message.sources} />
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
