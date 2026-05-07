import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Profil linki için gerekli
import useAuthStore from '../store/authStore';
import api from '../services/api';

const TweetCard = ({ tweet }) => {
  const author = tweet.author;
  const { user } = useAuthStore();
  
  const avatarUrl = author.profilePic || `https://ui-avatars.com/api/?name=${author.username}&background=random`;

  const initialUpvotes = tweet._count?.upvoters ?? (tweet.upvoters?.length || 0);
  const initialDownvotes = tweet._count?.downvoters ?? (tweet.downvoters?.length || 0);

  const [upvotes, setUpvotes] = useState(initialUpvotes);
  const [downvotes, setDownvotes] = useState(initialDownvotes);
  
  const [hasUpvoted, setHasUpvoted] = useState(tweet.upvoters?.some(u => u.id === user?.id));
  const [hasDownvoted, setHasDownvoted] = useState(tweet.downvoters?.some(u => u.id === user?.id));

  // Eğer tweet prop'u değişirse (F5 veya sayfa yenileme) state'i güncelle
  useEffect(() => {
    setUpvotes(initialUpvotes);
    setDownvotes(initialDownvotes);
    setHasUpvoted(tweet.upvoters?.some(u => u.id === user?.id));
    setHasDownvoted(tweet.downvoters?.some(u => u.id === user?.id));
  }, [tweet, user?.id]);

  const handleUpvote = async () => {
    if (!user) return alert("Oy vermek için giriş yapmalısınız!");
    if (hasUpvoted) return;

    setUpvotes(prev => prev + 1);
    setHasUpvoted(true);
    if (hasDownvoted) {
      setDownvotes(prev => prev - 1);
      setHasDownvoted(false);
    }

    try {
      await api.post(`/tweets/${tweet.id}/upvote`);
    } catch (error) {
      console.error("Upvote hatası:", error);
    }
  };

  const handleDownvote = async () => {
    if (!user) return alert("Oy vermek için giriş yapmalısınız!");
    if (hasDownvoted) return;

    setDownvotes(prev => prev + 1);
    setHasDownvoted(true);
    if (hasUpvoted) {
      setUpvotes(prev => prev - 1);
      setHasUpvoted(false);
    }

    try {
      await api.post(`/tweets/${tweet.id}/downvote`);
    } catch (error) {
      console.error("Downvote hatası:", error);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 fade-in flex flex-col gap-3">
      
      <div className="flex gap-4">
        <div className="flex-shrink-0">
          {/* Profil resmine tıklandığında profile gitsin */}
          <Link to={`/profile/${author.username}`}>
            <img src={avatarUrl} alt="avatar" className="w-12 h-12 rounded-full object-cover border hover:opacity-80 transition-opacity" />
          </Link>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            {/* İSME TIKLANDIĞINDA PROFİLE GİTMEK İÇİN LINK EKLEDİK */}
            <Link to={`/profile/${author.username}`} className="font-bold text-gray-900 hover:text-blue-600 transition-colors">
              {author.displayName || author.username}
            </Link>
            <span className="text-gray-500 text-sm">@{author.username}</span>
            
            {author.supportedTeam && (
              <span className="text-[10px] bg-gray-100 border text-gray-600 px-2 py-0.5 rounded-full font-semibold">
                🛡️ {author.supportedTeam}
              </span>
            )}
            <span className="text-xs text-gray-400 ml-auto">
              {new Date(tweet.createdAt).toLocaleDateString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
            </span>
          </div>
          <p className="text-gray-800 text-base">{tweet.content}</p>

          {/* --- KATEGORİ VE ETİKETLER BÖLÜMÜ (YENİ) --- */}
          <div className="flex flex-wrap gap-2 mt-3">
            {tweet.sportCategory && (
              <span className="bg-blue-50 text-blue-700 text-[11px] px-2 py-0.5 rounded border border-blue-100 font-medium italic">
                #{tweet.sportCategory}
              </span>
            )}
            {tweet.tags && (
              <span className="text-blue-500 text-[11px] font-bold hover:underline cursor-pointer">
                {tweet.tags.startsWith('#') ? tweet.tags : `#${tweet.tags}`}
              </span>
            )}
          </div>
        </div>
      </div>

      <div className="flex gap-4 ml-16 mt-1 border-t pt-2">
        <button 
          onClick={handleUpvote} 
          className={`flex items-center gap-1 text-sm font-semibold px-2 py-1 rounded transition-colors ${hasUpvoted ? 'text-green-600 bg-green-50' : 'text-gray-500 hover:bg-gray-100 hover:text-green-600'}`}
        >
          👍 <span>{upvotes}</span>
        </button>
        
        <button 
          onClick={handleDownvote} 
          className={`flex items-center gap-1 text-sm font-semibold px-2 py-1 rounded transition-colors ${hasDownvoted ? 'text-red-600 bg-red-50' : 'text-gray-500 hover:bg-gray-100 hover:text-red-600'}`}
        >
          👎 <span>{downvotes}</span>
        </button>
      </div>
    </div>
  );
};

export default TweetCard;