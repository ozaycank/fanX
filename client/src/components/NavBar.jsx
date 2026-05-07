import { Link, useNavigate } from 'react-router-dom';
import useAuthStore from '../store/authStore';

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-blue-900 text-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold flex items-center gap-2">
          ⚽ FanX
        </Link>
        <div className="space-x-4 flex items-center">
          {user ? (
            <>
             {/* Kullanıcı adına tıklandığında profile git */}
            <Link to="/profile" className="text-yellow-600 font-bold hover:underline">
              @{user.username}
            </Link>
              <button onClick={handleLogout} className="bg-red-500 px-3 py-1 rounded hover:bg-red-600 transition">
                Çıkış Yap
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-blue-300 transition">Giriş</Link>
              <Link to="/register" className="bg-green-500 px-3 py-1 rounded hover:bg-green-600 transition">Kayıt Ol</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;