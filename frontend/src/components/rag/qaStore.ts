import { api, type QAResponse } from "../../mock/api";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
  sources?: QAResponse["sources"];
}

export interface ChatState {
  messages: ChatMessage[];
  loading: boolean;
}

const WELCOME_MESSAGE: ChatMessage = {
  role: "assistant",
  content:
    "\u4f60\u597d\uff0c\u6211\u662f\u667a\u80fd\u5b66\u4e60\u52a9\u624b\u3002" +
    "\u4f60\u53ef\u4ee5\u5411\u6211\u63d0\u95ee\u8bfe\u7a0b\u77e5\u8bc6\u3001\u5c97\u4f4d\u6280\u80fd\u6216\u7ec3\u4e60\u9898\u89e3\u6790\uff0c" +
    "\u6211\u4f1a\u7ed3\u5408\u5f53\u524d\u8bfe\u7a0b\u8d44\u6599\u8fdb\u884c\u56de\u7b54\u3002",
};

const MAX_SAVED_MESSAGES = 100;
const stores = new Map<string, ChatState>();
const listeners = new Map<string, Set<() => void>>();

export function getHistoryKey(userId: string | undefined, courseId: string | undefined) {
  return `qa-history:${userId || "anonymous"}:${courseId || "default"}`;
}

function loadHistory(key: string): ChatMessage[] {
  const raw = localStorage.getItem(key);
  if (!raw) return [{ ...WELCOME_MESSAGE }];
  try {
    const saved = JSON.parse(raw) as ChatMessage[];
    if (!Array.isArray(saved)) return [{ ...WELCOME_MESSAGE }];
    const validMessages = saved.filter(
      (message) =>
        (message.role === "user" || message.role === "assistant") &&
        typeof message.content === "string",
    );
    return validMessages.length > 0 ? validMessages.slice(-MAX_SAVED_MESSAGES) : [{ ...WELCOME_MESSAGE }];
  } catch {
    localStorage.removeItem(key);
    return [{ ...WELCOME_MESSAGE }];
  }
}

function saveHistory(key: string, messages: ChatMessage[]) {
  localStorage.setItem(key, JSON.stringify(messages.slice(-MAX_SAVED_MESSAGES)));
}

function ensureState(key: string): ChatState {
  const existing = stores.get(key);
  if (existing) return existing;
  const initial = { messages: loadHistory(key), loading: false };
  stores.set(key, initial);
  return initial;
}

function emit(key: string) {
  listeners.get(key)?.forEach((listener) => listener());
}

function updateState(key: string, next: ChatState) {
  stores.set(key, next);
  saveHistory(key, next.messages);
  emit(key);
}

export function getChatSnapshot(key: string): ChatState {
  return ensureState(key);
}

export function subscribeChat(key: string, listener: () => void) {
  const keyListeners = listeners.get(key) ?? new Set<() => void>();
  keyListeners.add(listener);
  listeners.set(key, keyListeners);
  return () => {
    keyListeners.delete(listener);
    if (keyListeners.size === 0) listeners.delete(key);
  };
}

export function clearChat(key: string) {
  updateState(key, { messages: [{ ...WELCOME_MESSAGE }], loading: false });
}

export async function askQuestion(key: string, question: string, courseId?: string) {
  const text = question.trim();
  const current = ensureState(key);
  if (!text || current.loading) return;

  updateState(key, {
    messages: [...current.messages, { role: "user", content: text }],
    loading: true,
  });

  try {
    const result = await api.qa.ask(text, courseId);
    const latest = ensureState(key);
    updateState(key, {
      messages: [...latest.messages, { role: "assistant", content: result.answer, sources: result.sources }],
      loading: false,
    });
  } catch (error) {
    const latest = ensureState(key);
    const message = error instanceof Error
      ? error.message
      : "\u670d\u52a1\u6682\u65f6\u4e0d\u53ef\u7528\uff0c\u8bf7\u7a0d\u540e\u91cd\u8bd5\u3002";
    updateState(key, {
      messages: [...latest.messages, { role: "assistant", content: `\u62b1\u6b49\uff0c${message}` }],
      loading: false,
    });
  }
}
