import { create } from "zustand";
import { User } from "@/types";

interface SessionState {
  user: User | null;
  setUser: (user: User | null) => void;
  clear: () => void;
}

export const useSessionStore = create<SessionState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clear: () => set({ user: null }),
}));
