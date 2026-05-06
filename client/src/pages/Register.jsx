import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';

const Register = () => {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', formData);
      alert('Kayıt başarılı! Lütfen giriş yapın.');
      navigate('/login');
    } catch (err) {
      setError('Kayıt oluşturulamadı. Kullanıcı adı alınmış olabilir.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 bg-white p-8 border rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-green-700">Formanı Giy (Kayıt Ol) 👕</h2>
      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700">Kullanıcı Adı</label>
          <input type="text" required className="w-full p-2 border rounded focus:outline-green-500"
                 onChange={(e) => setFormData({...formData, username: e.target.value})} />
        </div>
        <div>
          <label className="block text-gray-700">Email</label>
          <input type="email" required className="w-full p-2 border rounded focus:outline-green-500"
                 onChange={(e) => setFormData({...formData, email: e.target.value})} />
        </div>
        <div>
          <label className="block text-gray-700">Şifre</label>
          <input type="password" required className="w-full p-2 border rounded focus:outline-green-500"
                 onChange={(e) => setFormData({...formData, password: e.target.value})} />
        </div>
        <button type="submit" className="w-full bg-green-600 text-white p-2 rounded hover:bg-green-700 font-bold transition">
          Fan Ol
        </button>
      </form>
    </div>
  );
};

export default Register;