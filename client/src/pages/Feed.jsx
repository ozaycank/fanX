import { useState, useEffect } from "react";
import api from "../services/api";
import useAuthStore from "../store/authStore";
import TweetInput from "../components/TweetInput";
import TweetCard from "../components/TweetCard";
import Loader from "../components/Loader";
import FeedBg from "../assets/Feed-Bg.png";

const Feed = () => {
  const [tweets, setTweets] = useState([]);
  const [sortType, setSortType] = useState("newest"); // 'newest', 'up', 'down'
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  const fetchTweets = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/tweets?sort=${sortType}`);
      setTweets(res.data);
    } catch (err) {
      console.error("Tweetler çekilemedi:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTweets();
  }, [sortType]); // Sıralama değiştikçe veriyi yeniden çek

  return (
    <div className="min-h-screen relative">
      <div
        className="fixed inset-0 -z-10 opacity-20 pointer-events-none bg-fixed"
        style={{ backgroundImage: `url(${FeedBg})`, backgroundSize: "cover" }}
      />
      {/* Tweet Giriş Alanı */}
      {user && (
        <div className="max-w-2xl mx-auto px-2">
          <TweetInput onTweetPosted={fetchTweets} />
        </div>
      )}

      {/* Sıralama Butonları - Modern Görünüm */}
      <div className="sticky top-20 z-40 flex justify-center gap-2 my-6 bg-white/80 backdrop-blur-md p-2 rounded-2xl shadow-sm border border-gray-100">
        <button
          onClick={() => setSortType("newest")}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-all ${sortType === "newest" ? "bg-blue-600 text-white shadow-md" : "text-gray-500 hover:bg-gray-50"}`}
        >
          🕒 En Yeni
        </button>
        <button
          onClick={() => setSortType("up")}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-all ${sortType === "up" ? "bg-green-600 text-white shadow-md" : "text-gray-500 hover:bg-gray-50"}`}
        >
          👍 Popüler
        </button>
        <button
          onClick={() => setSortType("down")}
          className={`flex-1 py-2 px-4 rounded-lg text-sm font-semibold transition-all ${sortType === "down" ? "bg-red-600 text-white shadow-md" : "text-gray-500 hover:bg-gray-50"}`}
        >
          👎 Tartışmalı
        </button>
      </div>

      {/* Tweet Listesi veya Loader */}
      {loading ? (
        <Loader />
      ) : (
        <div className="space-y-4 pb-10">
          {tweets.length > 0 ? (
            tweets.map((t) => <TweetCard key={t.id} tweet={t} />)
          ) : (
            <div className="text-center py-10 text-gray-500">
              📭 Henüz tweet yok. İlk pası sen at!
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Feed;
