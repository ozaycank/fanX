import { Link } from "react-router-dom";
import FanXLogo from "../assets/FanX-Logo.png";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-sky-50 border-t border-gray-200 pt-12 pb-8 mt-auto">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Bölüm 1: Logo ve Slogan */}
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="inline-block mb-4">
              <img
                src={FanXLogo}
                alt="FanX"
                className="h-10 w-auto object-contain"
              />
            </Link>
            <p className="text-gray-500 text-sm leading-relaxed">
              Sporun nabzını taraftarlarla birlikte tutun. FanX, her an
              yanınızda.
            </p>
          </div>

          {/* Bölüm 2: Hızlı Linkler */}
          <div>
            <h4 className="text-blue-900 font-bold mb-4 text-sm uppercase tracking-wider">
              Hızlı Erişim
            </h4>
            <ul className="space-y-2 text-gray-600 text-sm">
              <li>
                <Link to="/" className="hover:text-blue-600 transition">
                  Ana Sayfa
                </Link>
              </li>
              <li>
                <Link to="/profile" className="hover:text-blue-600 transition">
                  Profilim
                </Link>
              </li>
              {/* Buraya yeni ligler/kategoriler gelebilir */}
            </ul>
          </div>

          {/* Bölüm 3: Topluluk & Destek */}
          <div>
            <h4 className="text-blue-900 font-bold mb-4 text-sm uppercase tracking-wider">
              Destek
            </h4>
            <ul className="space-y-2 text-gray-600 text-sm">
              <li>
                <Link
                  to="/feedback"
                  className="text-blue-600 font-semibold hover:underline flex items-center gap-2"
                >
                  <span>📣</span> Öneri ve Geribildirim
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-blue-600 transition">
                  Sıkça Sorulan Sorular
                </Link>
              </li>
            </ul>
          </div>

          {/* Bölüm 4: Sosyal Medya */}
          <div>
            <h4 className="text-blue-900 font-bold mb-4 text-sm uppercase tracking-wider">
              Bizi Takip Et
            </h4>
            <div className="flex gap-4">
              {/* Buraya ikonlar gelecek */}
              <a
                href="#"
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-blue-100 transition text-gray-600"
              >
                𝕏
              </a>
              <a
                href="#"
                className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center hover:bg-pink-100 transition text-gray-600"
              >
                📸
              </a>
            </div>
          </div>
        </div>

        {/* Alt Çizgi ve Telif Hakları */}
        <div className="border-t border-gray-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-400">
          <p>© {currentYear} FanX. Tüm hakları saklıdır.</p>
          <div className="flex gap-6">
            <Link to="/privacy" className="hover:text-gray-600">
              Gizlilik Politikası
            </Link>
            <Link to="/terms" className="hover:text-gray-600">
              Kullanım Şartları
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
