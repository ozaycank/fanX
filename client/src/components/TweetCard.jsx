import { useState } from "react";
import { Link } from "react-router-dom";
import useAuthStore from "../store/authStore";
import api from "../services/api";

const TweetCard = ({ tweet }) => {
  const { author } = tweet;
  const { user } = useAuthStore();

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
    <div className="bg-white/90 p-4 mx-auto max-w-2xl rounded-xl shadow-sm border border-gray-100 hover:border-blue-200 transition-all mb-4">
      <div className="flex gap-3">
        <Link to={`/profile/${author.username}`} className="flex-shrink-0">
          <img
            src={
              author.profilePic ||
              `https://ui-avatars.com/api/?name=${author.username}&background=random`
            }
            className="w-12 h-12 rounded-full border-2 border-transparent hover:border-blue-400 transition-all object-cover"
          />
        </Link>
        <div className="flex-1">
          <div className="flex items-center gap-1">
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
          <p className="text-gray-800 mt-1 leading-relaxed">{tweet.content}</p>

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
