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
      <div className="flex gap-3">
        {/* Sol Kısım: Profil Resmi */}
        <Link to={`/profile/${author.username}`} className="flex-shrink-0">
          <img
            src={
              author.profilePic ||
              `https://ui-avatars.com/api/?name=${author.username}&background=random`
            }
            className="w-12 h-12 rounded-full border-2 border-transparent hover:border-blue-400 transition-all object-cover"
            alt={author.username}
          />
        </Link>

        {/* --- MESAJ GÖNDER BUTONU --- */}
        {user && user.id !== author.id && (
          <Link
            to={`/chat/${author.id}`}
            className="text-gray-400 hover:text-blue-500 transition p-1 rounded-full hover:bg-gray-100 ml-2"
            title="Mesaj Gönder"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M20.25 8.511c.009.083.014.166.014.25 0 3.84-4.033 6.954-9.014 6.954-1.302 0-2.537-.213-3.655-.595-1.69 1.51-3.722 1.954-5.595 2.01-.256.008-.474-.165-.436-.42.23-.153.64-.474.908-.916M20.25 8.511c.009-.083.014-.166.014-.25 0-3.84-4.033-6.954-9.014-6.954-4.982 0-9.014 3.114-9.014 6.954 0 .084.005.167.014.25m18.014 0A12.048 12.048 0 0111.25 15c-4.982 0-9.014-3.114-9.014-6.954m15.542 3.327A11.962 11.962 0 0111.25 15v5.25"
              />
            </svg>
          </Link>
        )}
        {/* Sağ Kısım: Tweet İçeriği ve Aksiyonlar */}
        <div className="flex-1">
          {/* Üst Başlık Alanı: Kullanıcı Bilgileri ve Bildir Butonu Yan Yana */}
          <div className="flex justify-between items-start w-full">
            <div className="flex items-center gap-1 flex-wrap">
              <Link
                to={`/profile/${author.username}`}
                className="font-bold hover:underline text-gray-900"
              >
                {author.displayName || author.username}
              </Link>
              <span className="text-gray-400 text-sm">@{author.username}</span>
              <span className="text-gray-300 mx-1">·</span>
              <span className="text-gray-400 text-xs">
                {formatTime(tweet.createdAt)}
              </span>
            </div>

            {/* --- BİLDİR (REPORT) MENÜSÜ --- */}
            <div className="relative z-10" ref={menuRef}>
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="text-gray-400 hover:text-red-500 transition p-1 rounded-full hover:bg-gray-100"
                title="Seçenekler"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 3v1.5M3 21v-6m0 0l2.77-.693a9 9 0 016.208.682l.108.054a9 9 0 006.086.71l3.114-.732a48.524 48.524 0 01-.005-10.499l-3.11.732a9 9 0 01-6.085-.711l-.108-.054a9 9 0 00-6.208-.682L3 4.5M3 15V4.5"
                  />
                </svg>
              </button>

              {showMenu && (
                <div className="absolute right-0 mt-1 w-44 bg-white border border-gray-100 rounded-lg shadow-lg py-1 z-20">
                  {isReported ? (
                    <div className="px-4 py-2 text-sm text-green-600 font-medium">
                      ✓ Bildirildi
                    </div>
                  ) : (
                    <>
                      <div className="px-4 py-1 text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                        Sorun Nedir?
                      </div>
                      <button
                        onClick={() => handleReport("KÜFÜR/HAKARET")}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition"
                      >
                        Küfür veya Hakaret
                      </button>
                      <button
                        onClick={() => handleReport("MÜSTEHCEN")}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition"
                      >
                        Müstehcen İçerik
                      </button>
                      <button
                        onClick={() => handleReport("SPAM")}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-red-50 hover:text-red-600 transition"
                      >
                        Spam / Reklam
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
            {/* --- BİLDİR MENÜSÜ BİTİŞ --- */}
          </div>

          {/* Tweet Metni */}
          <p className="text-gray-800 mt-1 leading-relaxed">{tweet.content}</p>

          {/* Kategoriler & Etiketler */}
          <div className="flex gap-2 mt-3">
            {tweet.sportCategory && (
              <span className="bg-blue-50 text-blue-600 text-[10px] px-2 py-1 rounded-md font-bold uppercase italic">
                {tweet.sportCategory}
              </span>
            )}
            {tweet.tags && (
              <span className="text-blue-500 text-xs font-semibold hover:underline cursor-pointer">
                #{tweet.tags.replace("#", "")}
              </span>
            )}
          </div>

          {/* Alt Kısım: Upvote / Downvote Butonları */}
          <div className="flex gap-6 mt-4 border-t pt-2">
            <button
              onClick={() => handleVote("upvote")}
              className={`flex items-center gap-1.5 transition-colors ${votes.hasUp ? "text-green-600" : "text-gray-400 hover:text-green-500"}`}
            >
              <span className="text-lg">👍</span>
              <span className="font-bold text-xs">{votes.up}</span>
            </button>
            <button
              onClick={() => handleVote("downvote")}
              className={`flex items-center gap-1.5 transition-colors ${votes.hasDown ? "text-red-600" : "text-gray-400 hover:text-red-500"}`}
            >
              <span className="text-lg">👎</span>
              <span className="font-bold text-xs">{votes.down}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
export default TweetCard;
