import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

const Messages = () => {
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        const res = await api.get("/messages");
        setConversations(res.data);
      } catch (err) {
        console.error("Konuşma listesi alınamadı:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchConversations();
  }, []);

  const formatTime = (date) => {
    const now = new Date();
    const diff = Math.floor((now - new Date(date)) / 1000);
    if (diff < 60) return "Az önce";
    if (diff < 3600) return `${Math.floor(diff / 60)}dk`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}sa`;
    return new Date(date).toLocaleDateString("tr-TR");
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[50vh] text-blue-900 font-semibold">
        Mesaj kutusu yükleniyor... 📩
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
      <div className="p-4 border-b border-gray-100 bg-blue-50/50 font-bold text-blue-900 text-lg">
        Mesajlar 🏟️
      </div>

      <div className="divide-y divide-gray-100">
        {conversations.length === 0 ? (
          <div className="p-8 text-center text-gray-400 text-sm">
            Henüz hiç mesajınız yok. Tribünden birileriyle sohbet başlatın!
          </div>
        ) : (
          conversations.map((chat) => (
            <div
              key={chat.id}
              onClick={() => navigate(`/chat/${chat.id}`)}
              className="flex items-center gap-4 p-4 hover:bg-gray-50 cursor-pointer transition-colors"
            >
              {/* Profil Resmi */}
              <img
                src={
                  chat.profilePic ||
                  `https://ui-avatars.com/api/?name=${chat.username}&background=random`
                }
                alt={chat.username}
                className="w-12 h-12 rounded-full object-cover border border-gray-100"
              />

              {/* Mesaj İçeriği */}
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-baseline mb-1">
                  <h3 className="font-bold text-gray-900 truncate">
                    {chat.displayName || chat.username}
                  </h3>
                  <span className="text-xs text-gray-400 flex-shrink-0">
                    {formatTime(chat.createdAt)}
                  </span>
                </div>
                <p className="text-sm text-gray-500 truncate">
                  {chat.lastMessage}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Messages;
