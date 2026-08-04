import { api, type PracticalResponse } from "../../mock/api";

export interface PracticalHistoryItem {
  id: string;
  query: string;
  createdAt: string;
  result: PracticalResponse;
}

export interface PracticalState {
  history: PracticalHistoryItem[];
  result: PracticalResponse | null;
  activeHistoryId: string;
  loading: boolean;
  error: string;
  generatingQuery: string;
  completedStepIndexes: number[];
}

const MAX_HISTORY = 8;
const stores = new Map<string, PracticalState>();
const listeners = new Map<string, Set<() => void>>();

export function getPracticalHistoryKey(userId: string | undefined, courseId: string | undefined) {
  return `practical-history:${userId || "anonymous"}:${courseId || "default"}`;
}

function emptyState(): PracticalState {
  return {
    history: [],
    result: null,
    activeHistoryId: "",
    loading: false,
    error: "",
    generatingQuery: "",
    completedStepIndexes: [],
  };
}

function loadState(key: string): PracticalState {
  const raw = localStorage.getItem(key);
  if (!raw) return emptyState();
  try {
    const saved = JSON.parse(raw) as Partial<PracticalState>;
    const history = Array.isArray(saved.history) ? saved.history.slice(0, MAX_HISTORY) : [];
    const activeHistoryId = typeof saved.activeHistoryId === "string" ? saved.activeHistoryId : "";
    const current = history.find((item) => item.id === activeHistoryId);
    return {
      history,
      result: saved.result ?? current?.result ?? null,
      activeHistoryId,
      loading: false,
      error: "",
      generatingQuery: "",
      completedStepIndexes: Array.isArray(saved.completedStepIndexes) ? saved.completedStepIndexes : [],
    };
  } catch {
    localStorage.removeItem(key);
    return emptyState();
  }
}

function compactResult(result: PracticalResponse): PracticalResponse {
  return {
    ...result,
    steps: result.steps.map((step) => ({
      ...step,
      imageUrl: "",
    })),
  };
}

function saveState(key: string, state: PracticalState) {
  const persisted = {
    history: state.history.slice(0, MAX_HISTORY),
    result: state.result,
    activeHistoryId: state.activeHistoryId,
    completedStepIndexes: state.completedStepIndexes,
  };

  try {
    localStorage.setItem(key, JSON.stringify(persisted));
  } catch {
    const compactHistory = state.history.slice(0, 4).map((item) => ({
      ...item,
      result: compactResult(item.result),
    }));
    const compactCurrent = state.result ? compactResult(state.result) : null;
    try {
      localStorage.setItem(key, JSON.stringify({
        history: compactHistory,
        result: compactCurrent,
        activeHistoryId: state.activeHistoryId,
        completedStepIndexes: state.completedStepIndexes,
      }));
    } catch {
      localStorage.removeItem(key);
    }
  }
}

function ensureState(key: string): PracticalState {
  const existing = stores.get(key);
  if (existing) return existing;
  const initial = loadState(key);
  stores.set(key, initial);
  return initial;
}

function emit(key: string) {
  listeners.get(key)?.forEach((listener) => listener());
}

function updateState(key: string, next: PracticalState) {
  stores.set(key, next);
  saveState(key, next);
  emit(key);
}

export function getPracticalSnapshot(key: string): PracticalState {
  return ensureState(key);
}

export function subscribePractical(key: string, listener: () => void) {
  const keyListeners = listeners.get(key) ?? new Set<() => void>();
  keyListeners.add(listener);
  listeners.set(key, keyListeners);
  return () => {
    keyListeners.delete(listener);
    if (keyListeners.size === 0) listeners.delete(key);
  };
}

export async function generatePractical(key: string, query: string, courseId?: string) {
  const text = query.trim();
  const current = ensureState(key);
  if (!text || current.loading) return;

  updateState(key, {
    ...current,
    result: null,
    activeHistoryId: "",
    loading: true,
    error: "",
    generatingQuery: text,
    completedStepIndexes: [],
  });

  try {
    const result = await api.practical.generate(text, courseId);
    const latest = ensureState(key);
    const item: PracticalHistoryItem = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      query: text,
      createdAt: new Date().toISOString(),
      result,
    };
    updateState(key, {
      ...latest,
      history: [item, ...latest.history.filter((historyItem) => historyItem.query !== text)].slice(0, MAX_HISTORY),
      result,
      activeHistoryId: item.id,
      loading: false,
      error: "",
      generatingQuery: "",
      completedStepIndexes: [],
    });
  } catch (error) {
    const latest = ensureState(key);
    updateState(key, {
      ...latest,
      loading: false,
      error: error instanceof Error ? error.message : "生成失败，请稍后重试",
      generatingQuery: "",
    });
  }
}

export function selectPracticalHistory(key: string, itemId: string) {
  const current = ensureState(key);
  const item = current.history.find((historyItem) => historyItem.id === itemId);
  if (!item) return;
  updateState(key, {
    ...current,
    result: item.result,
    activeHistoryId: item.id,
    error: "",
    completedStepIndexes: [],
  });
}

export function clearPracticalHistory(key: string) {
  const current = ensureState(key);
  updateState(key, {
    ...current,
    history: [],
    result: null,
    activeHistoryId: "",
    error: "",
    completedStepIndexes: [],
  });
}

export function togglePracticalStep(key: string, stepIndex: number) {
  const current = ensureState(key);
  const exists = current.completedStepIndexes.includes(stepIndex);
  updateState(key, {
    ...current,
    completedStepIndexes: exists
      ? current.completedStepIndexes.filter((index) => index !== stepIndex)
      : [...current.completedStepIndexes, stepIndex],
  });
}
