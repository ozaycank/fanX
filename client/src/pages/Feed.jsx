import { useEffect, useState } from 'react';
import api from '../services/api';
import TweetInput from '../components/TweetInput';
import TweetCard from '../components/TweetCard';
import useAuthStore from '../store/authStore';

const Feed = () => {
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuthStore();

  const fetchFeed = async () => {
    try {
      const response = await api.get('/feed');
      setTweets(response.data);
    } catch (error) {
      console.error("Feed yüklenirken hata:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeed();
  }, []);

  // Yeni tweet atıldığında listeyi güncelle
  const handleTweetPosted = (newTweet) => {
    setTweets([newTweet, ...tweets]);
  };

  if (loading) return <div>Maç Başlıyor... (Yükleniyor) ⏳</div>;

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <h1 className="text-2xl font-bold mb-5">Global Spor Akışı 🌍🏆</h1>
      
      {/* Sadece giriş yapmış kullanıcılar tweet atabilir */}
      {user && <TweetInput onTweetPosted={handleTweetPosted} />}

      <div className="mt-5 space-y-4">
        {tweets.map((tweet) => (
          <TweetCard key={tweet.id} tweet={tweet} />
        ))}
      </div>
    </div>
  );
};

export default Feed;