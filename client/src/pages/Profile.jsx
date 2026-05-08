import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import useAuthStore from '../store/authStore';
import api from '../services/api';

const Profile = () => {
  const { username: urlUsername } = useParams(); // URL'den gelen kullanıcı adı
  const { user: currentUser, setUser } = useAuthStore();
  
  const [profileData, setProfileData] = useState(null);
  const [activeTab, setActiveTab] = useState('editProfile');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  // Form State'leri
  const [editData, setEditData] = useState({
    displayName: '',
    supportedTeam: '',
    profilePic: ''
  });

  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: ''
  });

  // Kendi profilimiz mi kontrolü
  const isOwnProfile = !urlUsername || urlUsername === currentUser?.username;

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setLoading(true);
        // Eğer URL'de isim varsa onu çek, yoksa giriş yapmış kullanıcıyı çek
        const targetUser = urlUsername || currentUser?.username;
        if (!targetUser) return;

        const response = await api.get(`/users/${targetUser}`);
        setProfileData(response.data);
        
        // Eğer kendi profilimizse düzenleme formunu doldur
        if (isOwnProfile) {
          setEditData({
            displayName: response.data.displayName || '',
            supportedTeam: response.data.supportedTeam || '',
            profilePic: response.data.profilePic || ''
          });
        }
      } catch (error) {
        console.error("Profil yükleme hatası:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [urlUsername, currentUser?.username]);

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put('/users/profile', editData);
      setUser({ ...currentUser, ...response.data }); // Global state'i güncelle
      setProfileData(response.data); // Yerel görünümü güncelle
      setMessage('Profil başarıyla güncellendi! 🏆');
    } catch (error) {
      setMessage('Profil güncellenirken hata oluştu.');
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put('/users/password', passwordData);
      setMessage(response.data.message);
      setPasswordData({ oldPassword: '', newPassword: '' });
    } catch (error) {
      setMessage(error.response?.data?.error || 'Parola değiştirilemedi.');
    }
  };

  if (loading) return <div className="text-center mt-10">Stadyum yükleniyor...</div>;
  if (!profileData) return <div className="text-center mt-10">Kullanıcı bulunamadı.</div>;

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white p-6 rounded-lg shadow-md">
      {/* Üst Bilgi Alanı */}
      <div className="flex items-center gap-4 border-b pb-6 mb-6">
        <img 
          src={profileData.profilePic || `https://ui-avatars.com/api/?name=${profileData.username}&background=random`} 
          className="w-24 h-24 rounded-full object-cover border-4 border-blue-100"
          alt="Avatar" 
        />
        <div>
          <h1 className="text-2xl font-bold">{profileData.displayName || profileData.username}</h1>
          <p className="text-gray-500">@{profileData.username}</p>
          {profileData.supportedTeam && (
            <span className="inline-block mt-2 bg-blue-900 text-white text-xs px-3 py-1 rounded-full">
              Fan: {profileData.supportedTeam}
            </span>
          )}
        </div>
      </div>

      {message && (
        <div className="bg-green-100 text-green-800 p-3 rounded mb-4 text-center font-semibold">
          {message}
        </div>
      )}

      {/* Sadece Kendi Profilimizse Sekmeleri Göster */}
      {isOwnProfile ? (
        <>
          <div className="flex gap-4 mb-6 border-b">
            <button 
              onClick={() => setActiveTab('editProfile')} 
              className={`pb-2 ${activeTab === 'editProfile' ? 'border-b-2 border-blue-600 font-bold text-blue-600' : 'text-gray-500'}`}
            >
              Profil Düzenle
            </button>
            <button 
              onClick={() => setActiveTab('changePassword')} 
              className={`pb-2 ${activeTab === 'changePassword' ? 'border-b-2 border-blue-600 font-bold text-blue-600' : 'text-gray-500'}`}
            >
              Parola Değiştir
            </button>
          </div>

          {activeTab === 'editProfile' && (
            <form onSubmit={handleProfileUpdate} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Görünen Ad</label>
                <input 
                  type="text" 
                  className="w-full p-2 border rounded" 
                  value={editData.displayName} 
                  onChange={e => setEditData({...editData, displayName: e.target.value})} 
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Desteklediğin Takım</label>
                <input 
                  type="text" 
                  className="w-full p-2 border rounded" 
                  value={editData.supportedTeam} 
                  onChange={e => setEditData({...editData, supportedTeam: e.target.value})} 
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Profil Fotoğrafı URL'si</label>
                <input 
                  type="text" 
                  className="w-full p-2 border rounded" 
                  value={editData.profilePic} 
                  onChange={e => setEditData({...editData, profilePic: e.target.value})} 
                />
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700">
                Profili Kaydet
              </button>
            </form>
          )}

          {activeTab === 'changePassword' && (
            <form onSubmit={handlePasswordUpdate} className="space-y-4">
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Eski Parola</label>
                <input 
                  type="password" 
                  required 
                  className="w-full p-2 border rounded" 
                  value={passwordData.oldPassword} 
                  onChange={e => setPasswordData({...passwordData, oldPassword: e.target.value})} 
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-1">Yeni Parola</label>
                <input 
                  type="password" 
                  required 
                  className="w-full p-2 border rounded" 
                  value={passwordData.newPassword} 
                  onChange={e => setPasswordData({...passwordData, newPassword: e.target.value})} 
                />
              </div>
              <button type="submit" className="w-full bg-red-600 text-white py-2 rounded font-bold hover:bg-red-700">
                Parolayı Değiştir
              </button>
            </form>
          )}
        </>
      ) : (
        <div className="text-center text-gray-500 py-10">
          Bu bir kullanıcı profilidir. Paylaşımları yakında burada görünecek! ⚽
        </div>
      )}
    </div>
  );
};

export default Profile;