import { useState, useEffect } from 'react';
import useAuthStore from '../store/authStore';
import api from '../services/api';

const Profile = () => {
  const { user, setUser } = useAuthStore(); // authStore'a setUser metodunu eklemelisin!
  const [activeTab, setActiveTab] = useState('editProfile');
  const [message, setMessage] = useState('');

  // Profil Form State
  const [profileData, setProfileData] = useState({
    displayName: user?.displayName || '',
    supportedTeam: user?.supportedTeam || '',
    profilePic: user?.profilePic || ''
  });

  // Şifre Form State
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: ''
  });

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put('/users/profile', profileData);
      setUser({ ...user, ...response.data }); // Global state'i güncelle
      setMessage('Profil başarıyla güncellendi! 🏆');
    } catch (error) {
      setMessage('Hata oluştu.');
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

  if (!user) return <div className="text-center mt-10">Lütfen giriş yapın.</div>;

  return (
    <div className="max-w-2xl mx-auto mt-10 bg-white p-6 rounded-lg shadow-md">
      
      <div className="flex items-center gap-4 border-b pb-6 mb-6">
        <img 
          src={user.profilePic || `https://ui-avatars.com/api/?name=${user.username}&background=random`} 
          alt="Avatar" 
          className="w-24 h-24 rounded-full object-cover border-4 border-blue-100"
        />
        <div>
          <h1 className="text-2xl font-bold">{user.displayName || user.username}</h1>
          <p className="text-gray-500">@{user.username}</p>
          {user.supportedTeam && (
             <span className="inline-block mt-2 bg-blue-900 text-white text-xs px-3 py-1 rounded-full">
               Fan: {user.supportedTeam}
             </span>
          )}
        </div>
      </div>

      
      {message && <div className="bg-green-100 text-green-800 p-3 rounded mb-4 text-center font-semibold">{message}</div>}

      
      <div className="flex gap-4 mb-6 border-b">
        <button onClick={() => setActiveTab('editProfile')} className={`pb-2 ${activeTab === 'editProfile' ? 'border-b-2 border-blue-600 font-bold text-blue-600' : 'text-gray-500'}`}>Profil Düzenle</button>
        <button onClick={() => setActiveTab('changePassword')} className={`pb-2 ${activeTab === 'changePassword' ? 'border-b-2 border-blue-600 font-bold text-blue-600' : 'text-gray-500'}`}>Parola Değiştir</button>
      </div>

      
      {activeTab === 'editProfile' && (
        <form onSubmit={handleProfileUpdate} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Görünen Ad</label>
            <input type="text" className="w-full p-2 border rounded" value={profileData.displayName} onChange={e => setProfileData({...profileData, displayName: e.target.value})} placeholder="Örn: Aslan Parçası" />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Desteklediğin Takım</label>
            <input type="text" className="w-full p-2 border rounded" value={profileData.supportedTeam} onChange={e => setProfileData({...profileData, supportedTeam: e.target.value})} placeholder="Örn: Galatasaray" />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Profil Fotoğrafı URL'si</label>
            <input type="text" className="w-full p-2 border rounded" value={profileData.profilePic} onChange={e => setProfileData({...profileData, profilePic: e.target.value})} placeholder="https://resimlinki.com/foto.jpg (Boş bırakırsan otomatik oluşturulur)" />
          </div>
          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded font-bold hover:bg-blue-700">Profili Kaydet</button>
        </form>
      )}

      
      {activeTab === 'changePassword' && (
        <form onSubmit={handlePasswordUpdate} className="space-y-4">
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Eski Parola</label>
            <input type="password" required className="w-full p-2 border rounded" value={passwordData.oldPassword} onChange={e => setPasswordData({...passwordData, oldPassword: e.target.value})} />
          </div>
          <div>
            <label className="block text-gray-700 font-semibold mb-1">Yeni Parola</label>
            <input type="password" required className="w-full p-2 border rounded" value={passwordData.newPassword} onChange={e => setPasswordData({...passwordData, newPassword: e.target.value})} />
          </div>
          <button type="submit" className="w-full bg-red-600 text-white py-2 rounded font-bold hover:bg-red-700">Parolayı Değiştir</button>
        </form>
      )}
    </div>
  );
};

export default Profile;