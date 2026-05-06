const TweetCard = ({ tweet }) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 fade-in">
      <div className="flex justify-between items-center mb-2">
        <span className="font-bold text-blue-900">@{tweet.author?.username || 'Bilinmeyen_Taraftar'}</span>
        <span className="text-xs text-gray-500">
          {new Date(tweet.createdAt).toLocaleDateString('tr-TR', { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
      
      <p className="text-gray-800 text-lg mb-3">{tweet.content}</p>
      
      <div className="flex gap-2 text-sm">
        {tweet.sportCategory && (
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full font-medium">
            🏆 {tweet.sportCategory}
          </span>
        )}
        {tweet.tags && tweet.tags.split(',').map((tag, index) => (
          <span key={index} className="text-blue-500 hover:underline cursor-pointer">
            {tag.trim()}
          </span>
        ))}
      </div>
    </div>
  );
};

export default TweetCard;