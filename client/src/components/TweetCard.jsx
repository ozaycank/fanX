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
    if (diff < 3600) return `${Math.floor(diff / 60)}d`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}sa`;
    return new Date(date).toLocaleDateString("tr-TR", {
      month: "short",
      day: "numeric",
    });
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
    <article className="w-full bg-[#F3F8F9] p-4 border-b border-gray-200 hover:bg-white transition-colors duration-200 text-black">
      <div className="flex gap-3">
        {/* Sol Kısım: Profil Resmi */}
        <Link to={`/profile/${author.username}`} className="flex-shrink-0 pt-1">
          <img
            src={
              author.profilePic ||
              `https://ui-avatars.com/api/?name=${author.username}&background=random`
            }
            className="w-10 h-10 sm:w-11 sm:h-11 rounded-full object-cover hover:opacity-90 transition-opacity"
            alt={author.username}
          />
        </Link>

        {/* Sağ Kısım: Tweet İçeriği */}
        <div className="flex-1 min-w-0 pb-1">
          {/* Üst Başlık ve Menü Alanı */}
          <div className="flex justify-between items-start w-full">
            <div className="flex items-baseline gap-1.5 flex-wrap leading-tight">
              <Link
                to={`/profile/${author.username}`}
                className="font-bold text-[15px] text-black hover:underline truncate max-w-[140px] sm:max-w-[200px]"
              >
                {author.displayName || author.username}
              </Link>
              <Link
                to={`/profile/${author.username}`}
                className="text-[15px] text-gray-500 truncate"
              >
                @{author.username}
              </Link>
              <span className="text-gray-500 text-[15px]">·</span>
              <span className="text-gray-500 text-[15px] hover:underline cursor-pointer whitespace-nowrap">
                {formatTime(tweet.createdAt)}
              </span>
            </div>

            {/* Sağ Üst Aksiyonlar */}
            <div className="flex items-center -mt-1 -mr-2">
              {user && user.id !== author.id && (
                <Link
                  to={`/chat/${author.id}`}
                  className="group p-2 rounded-full hover:bg-blue-50 transition-colors"
                  title="Mesaj Gönder"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.7}
                    stroke="currentColor"
                    className="w-[18px] h-[18px] text-gray-400 group-hover:text-blue-500"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                    />
                  </svg>
                </Link>
              )}

              <div className="relative" ref={menuRef}>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    setShowMenu(!showMenu);
                  }}
                  className="group p-2 rounded-full hover:bg-blue-50 transition-colors"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.7}
                    stroke="currentColor"
                    className="w-[18px] h-[18px] text-gray-400 group-hover:text-blue-500"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z"
                    />
                  </svg>
                </button>

                {showMenu && (
                  <div className="absolute right-0 mt-1 w-48 bg-white border border-gray-100 rounded-xl shadow-[0_0_15px_rgba(0,0,0,0.1)] py-1.5 z-20">
                    {isReported ? (
                      <div className="px-4 py-3 text-sm text-green-600 font-semibold flex items-center gap-2">
                        <svg
                          className="w-5 h-5"
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
                        <div className="px-4 py-2 text-xs font-bold text-gray-500 tracking-wider">
                          Bildir
                        </div>
                        {[
                          "Küfür veya Hakaret",
                          "Müstehcen İçerik",
                          "Spam / Reklam",
                        ].map((reason) => (
                          <button
                            key={reason}
                            onClick={() => handleReport(reason.toUpperCase())}
                            className="w-full text-left px-4 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
                          >
                            {reason}
                          </button>
                        ))}
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Tweet Metni */}
          <p className="text-[15px] text-black leading-normal break-words mt-0.5 whitespace-pre-wrap">
            {tweet.content}
          </p>

          {/* Kategoriler & Etiketler */}
          {(tweet.sportCategory || tweet.tags) && (
            <div className="flex flex-wrap gap-2 mt-3 items-center">
              {tweet.sportCategory && (
                <span className="bg-white text-gray-600 text-[11px] px-2 py-0.5 rounded border border-gray-200 font-bold uppercase tracking-wide">
                  {tweet.sportCategory}
                </span>
              )}
              {tweet.tags && (
                <span className="text-blue-500 hover:underline cursor-pointer text-sm transition-colors">
                  #{tweet.tags.replace("#", "")}
                </span>
              )}
            </div>
          )}

          {/* Aksiyon Satırı (Upvote / Downvote) */}
          <div className="flex items-center gap-6 mt-3 max-w-md">
            {/* Upvote */}
            <button
              onClick={() => handleVote("upvote")}
              className="group flex items-center gap-1 transition-colors"
            >
              <div
                className={`p-2 rounded-full transition-colors duration-200 ${
                  votes.hasUp
                    ? "bg-green-50 text-green-500"
                    : "text-gray-500 hover:bg-green-50 hover:text-green-500"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill={votes.hasUp ? "currentColor" : "none"}
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-[18px] h-[18px]"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 6.75 12 3m0 0 3.75 3.75M12 3v18"
                  />
                </svg>
              </div>
              <span
                className={`text-[13px] font-medium transition-colors ${
                  votes.hasUp
                    ? "text-green-500"
                    : "text-gray-500 group-hover:text-green-500"
                }`}
              >
                {votes.up > 0 && votes.up}
              </span>
            </button>

            {/* Downvote */}
            <button
              onClick={() => handleVote("downvote")}
              className="group flex items-center gap-1 transition-colors"
            >
              <div
                className={`p-2 rounded-full transition-colors duration-200 ${
                  votes.hasDown
                    ? "bg-red-50 text-red-500"
                    : "text-gray-500 hover:bg-red-50 hover:text-red-500"
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill={votes.hasDown ? "currentColor" : "none"}
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-[18px] h-[18px]"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15.75 17.25 12 21m0 0-3.75-3.75M12 21V3"
                  />
                </svg>
              </div>
              <span
                className={`text-[13px] font-medium transition-colors ${
                  votes.hasDown
                    ? "text-red-500"
                    : "text-gray-500 group-hover:text-red-500"
                }`}
              >
                {votes.down > 0 && votes.down}
              </span>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default TweetCard;
