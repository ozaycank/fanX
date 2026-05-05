import { create } from "zustand";
import api from "../services/api";

// Kullanıcı durumunu (State) global olarak yöneten Zustand store
const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,

  login: async (email, password) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", response.data.token);
      set({ user: response.data.user, isAuthenticated: true });
      return true;
    } catch (error) {
      console.error("Giriş hatası", error);
      return false;
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    set({ user: null, isAuthenticated: false });
  },
}));

export default useAuthStore;
