import { createContext } from "react";
import type { Course, Position, User } from "../types/api";

export interface AppState {
  user: User | null;
  token: string | null;
  selectedPosition: Position | null;
  selectedCourse: Course | null;
}

export interface AppContextType extends AppState {
  setUser: (user: User, token: string) => void;
  setSelectedPosition: (position: Position) => void;
  setSelectedCourse: (course: Course) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

export const AppContext = createContext<AppContextType | null>(null);

