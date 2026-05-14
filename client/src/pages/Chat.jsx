import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../services/api";
import useAuthStore from "../store/authStore";

const Chat = () => {
  const { id: receiverId } = useParams();
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const messagesEndRef = useRef(null);

  // ID'nin geçerli bir sayı olup olmadığını ve "undefined" olmadığını kontrol et
  const isValidChat =
    receiverId && receiverId !== "undefined" && !isNaN(Number(receiverId));

  const fetchMessages = async () => {
    if (!isValidChat) return;
    try {
      const res = await api.get(`/messages/${receiverId}`);
      setMessages(res.data);
    } catch (err) {
      console.error("Mesajlar senkronize edilemedi:", err);
    }
  };

  useEffect(() => {
    if (!isValidChat) return;

    fetchMessages();
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [receiverId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim() || !isValidChat) return;

    const currentText = text;
    const tempId = `temp-${Date.now()}`;
    // Store'dan gelen ID'yi güvenli bir şekilde sayıya dönüştür
    const currentUserId = user?.id ? Number(user.id) : null;

    const tempMessage = {
      id: tempId,
      content: currentText,
      senderId: currentUserId,
      createdAt: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, tempMessage]);
    setText("");

    try {
      const res = await api.post("/messages", {
        // Backend'e gönderirken de sayı formatında gönderdiğimizden emin oluyoruz
        receiverId: Number(receiverId),
        content: currentText,
      });

      setMessages((prev) =>
        prev.map((msg) => (msg.id === tempId ? res.data : msg)),
      );
    } catch (err) {
      alert("Mesaj iletilemedi.");
      setMessages((prev) => prev.filter((msg) => msg.id !== tempId));
      setText(currentText);
    }
  };

  if (!isValidChat) {
    return (
      <div className="max-w-2xl mx-auto mt-10 text-center bg-red-50 text-red-700 p-6 rounded-xl border border-red-200 font-semibold shadow-sm">
        <p className="mb-3">Geçersiz bir sohbet odasına yönlendirildiniz! 🏟️</p>
        <button
          onClick={() => navigate("/")}
          className="px-4 py-2 bg-red-600 text-white rounded-full text-sm font-medium hover:bg-red-700 transition"
        >
          Ana Sayfaya Dön
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto h-[70vh] flex flex-col bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-4 border-b border-gray-100 bg-blue-50/50 rounded-t-xl font-bold text-blue-900">
        Sohbet
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
        {messages.map((msg) => {
          // Gelen ve mevcut ID değerlerini tamamen sayıya (Number) eşitleyerek kontrol sağlıyoruz
          const currentUserId = user?.id ? Number(user.id) : null;
          const isMe = Number(msg.senderId) === currentUserId;

          return (
            <div
              key={msg.id}
              className={`flex ${isMe ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[75%] px-4 py-2 rounded-2xl ${
                  isMe
                    ? "bg-blue-600 text-white rounded-tr-none"
                    : "bg-white border border-gray-200 text-gray-800 rounded-tl-none"
                }`}
              >
                {msg.content}
              </div>
            </div>
          );
        })}
        <div ref={messagesEndRef} />
      </div>

      <form
        onSubmit={handleSend}
        className="p-3 bg-white border-t border-gray-200 flex gap-2 rounded-b-xl"
      >
        <input
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Mesaj yaz..."
          className="flex-1 px-4 py-2 bg-gray-100 border-transparent focus:bg-white focus:border-blue-500 focus:ring-0 rounded-full outline-none transition-all"
        />
        <button
          type="submit"
          className="px-5 py-2 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition"
        >
          Gönder
        </button>
      </form>
    </div>
  );
};

export default Chat;
