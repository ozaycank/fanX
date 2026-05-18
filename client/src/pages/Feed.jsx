import { useState, useEffect } from "react";
import api from "../services/api";
import useAuthStore from "../store/authStore";
import TweetInput from "../components/TweetInput";
import TweetCard from "../components/TweetCard";
import Loader from "../components/Loader";
import FeedBg from "../assets/Feed-Bg.png";

const Feed = () => {
  const [tweets, setTweets] = useState([]);
  const [sortType, setSortType] = useState("newest");
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
  }, [sortType]);

  const tabs = [
    { id: "newest", label: "En Yeni" },
    { id: "up", label: "Popüler" },
    { id: "down", label: "Tartışmalı" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center relative z-0">
      {/* 1. Arkaplan Katmanı - Sadece Feed sütununun dışında görünür */}
      <div
        className="fixed inset-0 -z-10 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `url(${FeedBg})`,
          backgroundPosition: "center",
          backgroundRepeat: "repeat",
          backgroundSize: "400px",
        }}
      />

      {/* 2. Merkez Akış Sütunu (X/Twitter Formatı) */}
      <div className="w-full max-w-[600px] bg-white min-h-screen border-x border-gray-200 flex flex-col shadow-sm">
        {/* Sticky Header ve Sekmeler */}
        <div className="sticky top-0 z-40 bg-white/85 backdrop-blur-md border-b border-gray-200">
          <h1 className="text-xl font-extrabold px-4 pt-3 pb-1 text-gray-900 border-b-2 border-blue-500 text-center relative">
            Akış
          </h1>

          <div className="flex w-full mt-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSortType(tab.id)}
                className="flex-1 hover:bg-gray-200/40 transition-colors duration-200 relative group"
              >
                <div className="flex justify-center items-center py-3">
                  <span
                    className={`text-sm tracking-wide transition-colors ${
                      sortType === tab.id
                        ? "text-gray-900 font-bold"
                        : "text-gray-500 font-medium group-hover:text-gray-700"
                    }`}
                  >
                    {tab.label}
                  </span>
                  {/* Aktif Sekme Çizgisi */}
                  {sortType === tab.id && (
                    <div className="absolute bottom-0 h-1 w-16 bg-blue-500 rounded-full" />
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* 3. İçerik Katmanı */}
        <div className="flex-1">
          {/* Tweet Giriş Alanı */}
          {user && (
            <div className="border-b border-gray-200 p-4 bg-white">
              <TweetInput onTweetPosted={fetchTweets} />
            </div>
          )}

          {/* Tweet Listesi */}
          {loading ? (
            <div className="pt-10 flex justify-center">
              <Loader />
            </div>
          ) : (
            <div className="divide-y divide-gray-100 pb-20">
              {tweets.length > 0 ? (
                tweets.map((t) => (
                  <article
                    key={t.id}
                    className="hover:bg-gray-50 transition-colors duration-150 cursor-pointer"
                  >
                    {/*sarmalayıcı padding eklenebilir eğer TweetCard içinde yoksa */}
                    <TweetCard tweet={t} />
                  </article>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-20 px-4">
                  <p className="text-gray-900 font-extrabold text-xl mb-2">
                    Akış şu an boş
                  </p>
                  <p className="text-gray-500 text-sm text-center">
                    Görünüşe göre burada henüz bir hareket yok. İlk içeriği sen
                    oluştur!
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Feed;
