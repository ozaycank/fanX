# 🏟️ FanX - Modern Sports Fan Social Network

![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-316192?style=for-the-badge&logo=postgresql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)

FanX, spor taraftarlarının bir araya gelip etkileşime girebileceği, modern, ölçeklenebilir ve tam donanımlı (Full-Stack) bir sosyal medya uygulamasıdır. Kullanıcı deneyimi (UX), temiz kod (Clean Code) prensipleri ve performans odaklı mimari gözetilerek geliştirilmiştir.

**Geliştirici:** Özay Can Kırlı  
**Canlı Demo:** [Proje Linkini Buraya Ekle](https://fanx-app.vercel.app)

> ⚠️ **Not (Cold Start):** Backend servisi ücretsiz Render.com katmanında barındırılmaktadır. 15 dakikalık inaktif süreden sonra sunucu uyku moduna geçer. Uygulamayı ilk açtığınızda verilerin yüklenmesi **30-40 saniye** sürebilir. Anlayışınız için teşekkürler.

---

## 📸 Ekran Görüntüleri

|                        Ana Akış (Feed) & Etkileşimler                        |                        Canlı Sohbet (Smart Polling)                        |
| :--------------------------------------------------------------------------: | :------------------------------------------------------------------------: |
|    <img src="fanX\client\src\assets\Feed-Ss.png" alt="Feed" width="100%">    |   <img src="fanX\client\src\assets\Chat-Ss.png" alt="Chat" width="100%">   |
|                            **Profil ve Ayarlar**                             |                          **Raporlama & Güvenlik**                          |
| <img src="fanX\client\src\assets\Profile-Ss.png" alt="Profile" width="100%"> | <img src="fanX\client\src\assets\Report-Ss.png" alt="Report" width="100%"> |

---

## 🚀 Temel Özellikler (Features)

- **Güvenli Kimlik Doğrulama (Auth):** JWT (JSON Web Token) tabanlı oturum yönetimi ve şifrelenmiş (bcrypt) parola altyapısı.
- **Sosyal Etkileşim:** Gönderi (Tweet) paylaşma, Upvote/Downvote mekanizması ve kategori/etiketleme (Hashtag) sistemi.
- **Mesajlaşma Modülü:** Kullanıcılar arası birebir mesajlaşma. Gereksiz ağ isteklerini önleyen **"Smart Polling"** (sadece sekme aktifken istek atma) optimizasyonu.
- **İçerik Moderasyonu:** Kullanıcıların uygunsuz içerikleri şikayet edebileceği (Spam, Hakaret, vb.) durum yönetimli raporlama altyapısı.
- **Global State Yönetimi:** Zustand ile hafif, hızlı ve prop-drilling'den arındırılmış veri akışı.

---

## 🧠 Mimari ve Teknik Kararlar

Bu projeyi geliştirirken sadece "çalışan" bir kod değil, **"bakımı kolay ve ölçeklenebilir"** bir altyapı kurmayı hedefledim:

1. **Modüler Bileşen Yapısı (React):** UI bileşenleri tek sorumluluk prensibine (Single Responsibility Principle) göre parçalandı.
2. **Tip Güvenliği ve ORM (Prisma):** Veritabanı işlemleri için Prisma kullanıldı. Gelen payload'lar (özellikle ID parametreleri) veritabanı tipleriyle (Integer) eşleştirilerek güvenlik açıkları kapatıldı.
3. **Performans Optimizasyonu:** Sohbet ekranında sürekli atılan polling istekleri `document.visibilityState` ile sınırlandırılarak istemci/sunucu yükü %80 oranında düşürüldü.
4. **UX ve Mikro Etkileşimler:** Optimizasyonlar sadece arka planda kalmadı; buton kilitleri (disabled states), skeleton loading'ler ve yumuşak CSS geçişleri ile kullanıcı deneyimi en üst düzeye çıkarıldı.

---

## 🛠️ Kurulum (Lokal Ortam İçin)

Projeyi kendi bilgisayarınızda çalıştırmak için aşağıdaki adımları izleyebilirsiniz.

### 1. Repoyu Klonlayın

```bash
git clone [https://github.com/kullaniciadin/fanx.git](https://github.com/kullaniciadin/fanx.git)
cd fanx

### 2. Ortam Değişkenlerini (Env) Ayarlayın
Ana dizinde bir .env dosyası oluşturun ve aşağıdaki değerleri kendi altyapınıza göre doldurun:
# Backend & Database
DATABASE_URL="postgresql://user:password@localhost:5432/fanxdb"
JWT_SECRET="cok-gizli-bir-anahtar"
PORT=5000

# Frontend
VITE_API_URL="http://localhost:5000/api"

### 3. Bağımlılıkları Kurun ve Veritabanını Hazırlayın

# Backend bağımlılıkları ve DB senkronizasyonu
cd backend
npm install
npx prisma generate
npx prisma db push

# Frontend bağımlılıkları
cd ../frontend
npm install

### 4. Uygulamayı Başlatın
# Backend'i başlatmak için (backend klasöründe)
npm run dev

# Frontend'i başlatmak için (frontend klasöründe)
npm run dev

Bu proje, modern web geliştirme standartlarını (React, Clean Code, RESTful API) pratikte uygulamak ve ölçeklenebilir bir ürün vizyonu sunmak amacıyla Özay Can Kırlı tarafından geliştirilmiştir.
```
