import { useState } from "react";
import api from "../services/api";
import useAuthStore from "../store/authStore";
import { useNavigate } from "react-router-dom";

const Feedback = () => {
  const [text, setText] = useState("");
  const [sent, setSent] = useState(false);
  const { user } = useAuthStore();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/feedback", { content: text, userId: user?.id });
      setSent(true);
      setTimeout(() => navigate("/"), 2000); // 2 saniye sonra ana sayfaya dön
    } catch (err) {
      alert("Hata oluştu.");
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-2xl shadow-xl animate-fade-in">
      <h2 className="text-2xl font-bold mb-4 text-blue-900">
        Geribildirim Gönder 📣
      </h2>
      {!sent ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <textarea
            className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-all"
            rows="5"
            placeholder="FanX'i geliştirmemize yardımcı ol..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg font-bold hover:bg-blue-700 transition"
          >
            Gönder
          </button>
        </form>
      ) : (
        <div className="text-center text-green-600 font-semibold py-10">
          ✅ Geribildirimin iletildi. Teşekkürler!
        </div>
      )}
    </div>
  );
};

export default Feedback;
