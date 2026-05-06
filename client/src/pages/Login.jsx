import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await login(email, password);
    if (success) {
      navigate('/');
    } else {
      setError('Giriş başarısız. Lütfen bilgilerinizi kontrol edin.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 bg-white p-8 border rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center text-blue-900">Tribüne Katıl (Giriş) 🏟️</h2>
      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-gray-700">Email</label>
          <input type="email" required className="w-full p-2 border rounded focus:outline-blue-500"
                 value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>
        <div>
          <label className="block text-gray-700">Şifre</label>
          <input type="password" required className="w-full p-2 border rounded focus:outline-blue-500"
                 value={password} onChange={(e) => setPassword(e.target.value)} />
        </div>
        <button type="submit" className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 font-bold transition">
          Giriş Yap
        </button>
      </form>
    </div>
  );
};

export default Login;