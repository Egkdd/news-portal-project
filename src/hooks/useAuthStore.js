import { create } from "zustand";
import { auth } from "../config/firebase";
import { onAuthStateChanged } from "firebase/auth";

const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  setUser: (user) => set({ user, isAuthenticated: !!user }),
}));

onAuthStateChanged(auth, (user) => {
  useAuthStore.getState().setUser(user);
});

export const useAuth = () => useAuthStore((state) => state.user);
