import { useState, useCallback, type ReactNode } from "react";
import type { Course, Position, User } from "../types/api";
import { AppContext, type AppState } from "./app-context";

function readStored<T>(key: string): T | null {
  const value = localStorage.getItem(key);
  if (!value) return null;
  try {
    return JSON.parse(value) as T;
  } catch {
    localStorage.removeItem(key);
    return null;
  }
}

const userStorageKey = (userId: string, key: "selectedPosition" | "selectedCourse") => `user:${userId}:${key}`;

function readUserChoice<T>(user: User, key: "selectedPosition" | "selectedCourse"): T | null {
  return readStored<T>(userStorageKey(user.id, key)) ?? readStored<T>(key);
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(() => {
    const user = readStored<User>("user");
    return {
      user,
      token: localStorage.getItem("token"),
      selectedPosition: user ? readUserChoice<Position>(user, "selectedPosition") : null,
      selectedCourse: user ? readUserChoice<Course>(user, "selectedCourse") : null,
    };
  });

  const setUser = useCallback((user: User, token: string) => {
    const selectedPosition = readUserChoice<Position>(user, "selectedPosition");
    const selectedCourse = readUserChoice<Course>(user, "selectedCourse");
    if (selectedPosition) localStorage.setItem(userStorageKey(user.id, "selectedPosition"), JSON.stringify(selectedPosition));
    if (selectedCourse) localStorage.setItem(userStorageKey(user.id, "selectedCourse"), JSON.stringify(selectedCourse));
    localStorage.setItem("user", JSON.stringify(user));
    localStorage.setItem("token", token);
    setState((prev) => ({ ...prev, user, token, selectedPosition, selectedCourse }));
  }, []);

  const setSelectedPosition = useCallback((position: Position) => {
    setState((prev) => {
      if (prev.user) {
        localStorage.setItem(userStorageKey(prev.user.id, "selectedPosition"), JSON.stringify(position));
        localStorage.removeItem(userStorageKey(prev.user.id, "selectedCourse"));
      }
      return { ...prev, selectedPosition: position, selectedCourse: null };
    });
  }, []);

  const setSelectedCourse = useCallback((course: Course) => {
    setState((prev) => {
      if (prev.user) {
        localStorage.setItem(userStorageKey(prev.user.id, "selectedCourse"), JSON.stringify(course));
      }
      return { ...prev, selectedCourse: course };
    });
  }, []);

  const logout = useCallback(() => {
    ["user", "token", "selectedPosition", "selectedCourse"].forEach((key) => localStorage.removeItem(key));
    setState({ user: null, token: null, selectedPosition: null, selectedCourse: null });
  }, []);

  return (
    <AppContext.Provider value={{ ...state, setUser, setSelectedPosition, setSelectedCourse, logout, isAuthenticated: !!state.token }}>
      {children}
    </AppContext.Provider>
  );
}
