import { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import api from "../services/api";
import useAuthStore from "../store/authStore";

const Chat = () => {
  const { id: receiverId } = useParams(); // URL'den gelen karşı tarafın ID'si
  const { user } = useAuthStore();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const messagesEndRef = useRef(null);

  const fetchMessages = async () => {
    try {
      const res = await api.get(`/messages/${receiverId}`);
      setMessages(res.data);
    } catch (err) {
      console.error("Mesaj hatası", err);
    }
  };

  useEffect(() => {
    fetchMessages();
    // Hafif Polling: Sistemi yormamak için her 5 saniyede bir yeni mesaj var mı diye bakar.
    const interval = setInterval(fetchMessages, 5000);
    return () => clearInterval(interval);
  }, [receiverId]);

  // Yeni mesaj geldiğinde otomatik en alta in
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!text.trim()) return;

    // Arayüze anında ekle (kullanıcıya hızlı hissettirir)
    const tempMessage = { id: Date.now(), content: text, senderId: user.id };
    setMessages((prev) => [...prev, tempMessage]);
    setText("");

    try {
      await api.post("/messages", { receiverId, content: text });
      // Hata olmazsa arkaplanda zaten senkronize oldu
    } catch (err) {
      alert("Mesaj iletilemedi.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto h-[70vh] flex flex-col bg-white rounded-xl shadow-sm border border-gray-200">
      {/* Header */}
      <div className="p-4 border-b border-gray-100 bg-blue-50/50 rounded-t-xl font-bold text-blue-900">
        Sohbet
      </div>

      {/* Mesaj Alanı */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
        {messages.map((msg) => {
          const isMe = msg.senderId === user.id;
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

      {/* Mesaj Gönderme Formu */}
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
