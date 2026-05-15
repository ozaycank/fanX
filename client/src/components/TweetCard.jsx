import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import useAuthStore from "../store/authStore";
import api from "../services/api";

const TweetCard = ({ tweet }) => {
  const { author } = tweet;
  const { user } = useAuthStore();
  const [showMenu, setShowMenu] = useState(false);
  const [isReported, setIsReported] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleReport = async (reason) => {
    if (!user) return alert("Bildirim yapmak için giriş yapmalısınız.");

    try {
      await api.post("/reports", { tweetId: tweet.id, reason });
      setIsReported(true);
      setShowMenu(false);
    } catch (err) {
      alert(err.response?.data?.error || "Bir hata oluştu.");
      setShowMenu(false);
    }
  };

  const [votes, setVotes] = useState({
    up: tweet._count?.upvoters ?? 0,
    down: tweet._count?.downvoters ?? 0,
    hasUp: tweet.upvoters?.some((u) => u.id === user?.id),
    hasDown: tweet.downvoters?.some((u) => u.id === user?.id),
  });

  const formatTime = (date) => {
    const now = new Date();
    const diff = Math.floor((now - new Date(date)) / 1000);
    if (diff < 60) return "Az önce";
    if (diff < 3600) return `${Math.floor(diff / 60)}dk`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}sa`;
    return new Date(date).toLocaleDateString("tr-TR");
  };

  const handleVote = async (type) => {
    if (!user) return alert("Önce tribüne (giriş) girmen lazım! 🏟️");
    const previousVotes = { ...votes };

    setVotes((prev) => {
      const isUp = type === "upvote";
      if ((isUp && prev.hasUp) || (!isUp && prev.hasDown)) return prev;

      return {
        hasUp: isUp,
        hasDown: !isUp,
        up: isUp ? prev.up + 1 : prev.hasUp ? prev.up - 1 : prev.up,
        down: !isUp ? prev.down + 1 : prev.hasDown ? prev.down - 1 : prev.down,
      };
    });

    try {
      await api.post(`/tweets/${tweet.id}/${type}`);
    } catch (err) {
      setVotes(previousVotes);
    }
  };

  return (
    <div className="bg-white/90 p-4 mx-auto max-w-2xl rounded-xl shadow-sm border border-gray-100 hover:border-blue-200 transition-all mb-4 relative">
      <div className="flex gap-4">
        {/* Sol Kısım: Profil Resmi */}
        <Link to={`/profile/${author.username}`} className="flex-shrink-0 mt-1">
          <img
            src={
              author.profilePic ||
              `https://ui-avatars.com/api/?name=${author.username}&background=random`
            }
            className="w-12 h-12 rounded-full border-2 border-transparent hover:border-blue-400 transition-all object-cover"
            alt={author.username}
          />
        </Link>

        {/* Sağ Kısım: Tweet İçeriği ve Aksiyonlar */}
        <div className="flex-1 min-w-0">
          {/* Üst Başlık Alanı */}
          <div className="flex justify-between items-start w-full mb-1">
            {/* Kullanıcı Bilgileri */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <Link
                to={`/profile/${author.username}`}
                className="font-bold text-gray-900 hover:underline truncate max-w-[150px] sm:max-w-[200px]"
              >
                {author.displayName || author.username}
              </Link>
              <span className="text-gray-500 text-sm truncate">
                @{author.username}
              </span>
              <span className="text-gray-300">·</span>
              <span className="text-gray-400 text-xs whitespace-nowrap">
                {formatTime(tweet.createdAt)}
              </span>
            </div>

            {/* Sağ Üst Aksiyon Grubu (Mesaj + Seçenekler) */}
            <div className="flex items-center gap-1">
              {/* --- MESAJ GÖNDER BUTONU --- */}
              {user && user.id !== author.id && (
                <Link
                  to={`/chat/${author.id}`}
                  className="text-gray-400 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 p-1.5 rounded-full active:scale-95"
                  title="Mesaj Gönder"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.7}
                    stroke="currentColor"
                    className="w-[18px] h-[18px]"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                    />
                  </svg>
                </Link>
              )}

              {/* --- BİLDİR (REPORT) MENÜSÜ --- */}
              <div className="relative z-10" ref={menuRef}>
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className="text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-all duration-200 p-1.5 rounded-full active:scale-95"
                  title="Seçenekler"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.7}
                    stroke="currentColor"
                    className="w-[18px] h-[18px]"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                    />
                  </svg>
                </button>

                {showMenu && (
                  <div className="absolute right-0 mt-1 w-44 bg-white border border-gray-100 rounded-xl shadow-lg py-1.5 z-20 overflow-hidden">
                    {isReported ? (
                      <div className="px-4 py-2 text-sm text-green-600 font-medium flex items-center gap-2">
                        <svg
                          className="w-4 h-4"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                        Bildirildi
                      </div>
                    ) : (
                      <>
                        <div className="px-4 py-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                          Sorun Nedir?
                        </div>
                        <button
                          onClick={() => handleReport("KÜFÜR/HAKARET")}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                        >
                          Küfür veya Hakaret
                        </button>
                        <button
                          onClick={() => handleReport("MÜSTEHCEN")}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                        >
                          Müstehcen İçerik
                        </button>
                        <button
                          onClick={() => handleReport("SPAM")}
                          className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition-colors"
                        >
                          Spam / Reklam
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Tweet Metni */}
          <p className="text-gray-800 text-[15px] leading-relaxed break-words">
            {tweet.content}
          </p>

          {/* Kategoriler & Etiketler */}
          {(tweet.sportCategory || tweet.tags) && (
            <div className="flex flex-wrap gap-2 mt-3">
              {tweet.sportCategory && (
                <span className="bg-blue-50/80 text-blue-600 text-[10px] px-2.5 py-1 rounded-md font-bold uppercase tracking-wide">
                  {tweet.sportCategory}
                </span>
              )}
              {tweet.tags && (
                <span className="text-blue-500 text-sm hover:underline cursor-pointer transition-colors">
                  #{tweet.tags.replace("#", "")}
                </span>
              )}
            </div>
          )}

          {/* Alt Kısım: Upvote / Downvote Butonları */}
          <div className="flex gap-6 mt-4 border-t border-gray-50 pt-3">
            <button
              onClick={() => handleVote("upvote")}
              className={`flex items-center gap-1.5 transition-all duration-200 active:scale-75 ${
                votes.hasUp
                  ? "text-green-600"
                  : "text-gray-400 hover:text-green-500"
              }`}
            >
              <span className="text-[1.1rem] leading-none">👍</span>
              <span className="font-semibold text-sm">{votes.up}</span>
            </button>
            <button
              onClick={() => handleVote("downvote")}
              className={`flex items-center gap-1.5 transition-all duration-200 active:scale-75 ${
                votes.hasDown
                  ? "text-red-600"
                  : "text-gray-400 hover:text-red-500"
              }`}
            >
              <span className="text-[1.1rem] leading-none">👎</span>
              <span className="font-semibold text-sm">{votes.down}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TweetCard;
