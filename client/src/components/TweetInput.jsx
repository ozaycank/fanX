import { useState } from 'react';
import api from '../services/api';

const TweetInput = ({ onTweetPosted }) => {
  const [content, setContent] = useState('');
  const [sportCategory, setSportCategory] = useState('');
  const [tags, setTags] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim()) return;

    try {
      const response = await api.post('/tweets', {
        content,
        sportCategory,
        tags
      });
      onTweetPosted(response.data);
      setContent(''); // Formu temizle
      setTags('');
    } catch (error) {
      console.error("Tweet gönderilemedi", error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border p-4 rounded-lg bg-gray-50">
      <textarea
        className="w-full p-2 border rounded resize-none"
        rows="3"
        placeholder="Takımın hakkında neler düşünüyorsun? (#Galatasaray, #Lakers vs.)"
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />
      <div className="flex gap-2 mt-2">
        <input 
          type="text" placeholder="Kategori (Futbol, e-Spor)" 
          className="p-1 border rounded w-1/3"
          value={sportCategory} onChange={(e) => setSportCategory(e.target.value)}
        />
        <input 
          type="text" placeholder="Etiketler (#CSGO)" 
          className="p-1 border rounded w-1/3"
          value={tags} onChange={(e) => setTags(e.target.value)}
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded font-bold w-1/3 hover:bg-blue-700">
          Gönder 🚀
        </button>
      </div>
    </form>
  );
};

export default TweetInput;