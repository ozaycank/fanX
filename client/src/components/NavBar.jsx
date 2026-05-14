import { Link, useNavigate } from "react-router-dom";
import useAuthStore from "../store/authStore";
import FanXLogo from "../assets/FanX-Logo.png";

const Navbar = () => {
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <nav className="bg-white text-blue-900 shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        {/* Logo Alanı */}
        <Link to="/" className="flex items-center group">
          <div className="relative h-12">
            <img
              src={FanXLogo}
              alt="FanX Logo"
              className="h-full w-auto object-contain"
            />
          </div>
        </Link>

        {/* Sağ Menü */}
        <div className="space-x-4 flex items-center">
          {user ? (
            <>
              {/* MESAJLAR BUTONU (Zarf İkonlu) */}
              <Link
                to="/messages"
                className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-full transition-all relative group"
                title="Mesajlar"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-6 h-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0l-10.5 7.5L3 6.75"
                  />
                </svg>
                {/* Bildirim Noktası (Opsiyonel: Yeni mesaj geldiğinde gösterilebilir) */}
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white hidden group-hover:block"></span>
              </Link>

              {/* Kullanıcı Profili */}
              <Link
                to="/profile"
                className="font-semibold hover:text-blue-600 transition-colors"
              >
                @{user.username}
              </Link>

              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-1.5 rounded-lg hover:bg-red-600 transition text-sm font-medium"
              >
                Çıkış Yap
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="font-medium hover:text-blue-600 transition"
              >
                Giriş
              </Link>
              <Link
                to="/register"
                className="bg-blue-600 text-white px-4 py-1.5 rounded-lg hover:bg-blue-700 transition text-sm font-medium shadow-sm"
              >
                Kayıt Ol
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
