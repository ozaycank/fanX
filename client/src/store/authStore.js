import { create } from "zustand";
import api from "../services/api";

const useAuthStore = create((set) => ({
  user: null,
  isAuthenticated: false,
  loading: true, // Başlangıçta kontrol yapıldığını belirtmek için

  // Manuel kullanıcı güncelleme (Profil düzenleme sonrası için)
  setUser: (userData) =>
    set((state) => ({
      user: userData ? { ...state.user, ...userData } : null,
      isAuthenticated: !!userData,
    })),
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

  // SAYFA YENİLENDİĞİNDE ÇALIŞACAK: Token geçerli mi kontrol et
  checkAuth: async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      set({ user: null, isAuthenticated: false, loading: false });
      return;
    }
    try {
      const response = await api.get("/auth/me");
      set({ user: response.data.user, isAuthenticated: true, loading: false });
    } catch (error) {
      localStorage.removeItem("token");
      set({ user: null, isAuthenticated: false, loading: false });
    }
  },

  logout: () => {
    localStorage.removeItem("token");
    set({ user: null, isAuthenticated: false });
  },
}));

export default useAuthStore;
