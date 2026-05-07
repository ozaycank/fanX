import { useEffect, useState } from 'react';
import api from '../services/api';
import TweetInput from '../components/TweetInput';
import TweetCard from '../components/TweetCard';
import useAuthStore from '../store/authStore';

const Feed = () => {
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortType, setSortType] = useState('newest'); // Sıralama tipi state'i
  const { user } = useAuthStore();

  const fetchFeed = async () => {
    setLoading(true);
    try {
      // API isteğine 'sort' query parametresini ekliyoruz
      const response = await api.get(`/feed?sort=${sortType}`);
      setTweets(response.data);
    } catch (error) {
      console.error("Feed yüklenirken hata:", error);
    } finally {
      setLoading(false);
    }
  };

  // sortType her değiştiğinde listeyi yeniden çek
  useEffect(() => {
    fetchFeed();
  }, [sortType]);

  const handleTweetPosted = (newTweet) => {
    // Yeni tweet atıldığında sadece 'en yeni' modundaysak listeye ekle
    if (sortType === 'newest') {
        setTweets([newTweet, ...tweets]);
    } else {
        fetchFeed(); // Diğer modlarda listeyi yenilemek daha sağlıklı
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-4">
      <h1 className="text-2xl font-bold mb-5">Global Spor Akışı 🌍🏆</h1>
      
      {user && <TweetInput onTweetPosted={handleTweetPosted} />}

      {/* --- Sıralama Filtreleri --- */}
      <div className="flex gap-2 mt-6 mb-4 bg-gray-100 p-1 rounded-lg">
        <button 
          onClick={() => setSortType('newest')}
          className={`flex-1 py-2 text-sm font-bold rounded-md transition ${sortType === 'newest' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          🕒 En Yeni
        </button>
        <button 
          onClick={() => setSortType('up')}
          className={`flex-1 py-2 text-sm font-bold rounded-md transition ${sortType === 'up' ? 'bg-white shadow text-green-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          👍 En Popüler
        </button>
        <button 
          onClick={() => setSortType('down')}
          className={`flex-1 py-2 text-sm font-bold rounded-md transition ${sortType === 'down' ? 'bg-white shadow text-red-600' : 'text-gray-500 hover:text-gray-700'}`}
        >
          👎 En Tartışmalı
        </button>
      </div>

      {loading ? (
        <div className="text-center mt-10">Maç Başlıyor... ⏳</div>
      ) : (
        <div className="mt-5 space-y-4">
          {tweets.length > 0 ? (
            tweets.map((tweet) => <TweetCard key={tweet.id} tweet={tweet} />)
          ) : (
            <p className="text-center text-gray-500">Henüz bir paylaşım yok. Sahaya ilk sen çık!</p>
          )}
        </div>
      )}
    </div>
  );
};

export default Feed;