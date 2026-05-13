import { useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Feed from "./pages/Feed";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Profile from "./pages/Profile";
import useAuthStore from "./store/authStore";
import Feedback from "./pages/Feedback";
import Footer from "./components/Footer";
import FAQ from "./pages/FAQ";
import PrivacyPolicy from "./pages/Privacy";
import Terms from "./pages/Terms";

function App() {
  const { checkAuth, loading } = useAuthStore();

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  if (loading)
    return (
      <div className="h-screen flex items-center justify-center text-blue-900 font-bold">
        Stadyuma giriliyor... 🏟️
      </div>
    );

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />
      <main className="flex-grow container mx-auto px-4 py-6">
        <Routes>
          <Route path="/" element={<Feed />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          {/* HEM /profile HEM DE /profile/kullaniciadi BU SAYFAYI AÇACAK */}
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/:username" element={<Profile />} />
          <Route path="/feedback" element={<Feedback />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<Terms />} />
        </Routes>
      </main>
      <Footer />
    </div>
  );
}

export default App;
