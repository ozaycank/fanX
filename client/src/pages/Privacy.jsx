const PrivacyPolicy = () => {
  const sections = [
    {
      title: "Toplanan Bilgiler",
      content:
        "Ad, kullanıcı adı, e-posta adresi, paylaşılan içerikler, cihaz bilgileri ve kullanım verileri toplanabilir.",
    },
    {
      title: "Bilgilerin Kullanımı",
      content:
        "Toplanan bilgiler hesap yönetimi, güvenlik, kullanıcı deneyimi ve bildirim işlemleri için kullanılabilir.",
    },
    {
      title: "İçerik Paylaşımı",
      content:
        "FanX üzerinde paylaşılan gönderiler diğer kullanıcılar tarafından görüntülenebilir.",
    },
    {
      title: "Veri Güvenliği",
      content:
        "Kullanıcı verilerini korumak için gerekli teknik ve idari önlemler uygulanmaktadır.",
    },
    {
      title: "Üçüncü Taraf Hizmetler",
      content: "FanX bazı üçüncü taraf servis sağlayıcıları kullanabilir.",
    },
    {
      title: "Hesap Silme",
      content:
        "Kullanıcılar hesaplarını uygulama ayarları üzerinden silebilir.",
    },
    {
      title: "Çocukların Gizliliği",
      content: "FanX, 13 yaş altındaki kullanıcılar için tasarlanmamıştır.",
    },
    {
      title: "İletişim",
      content: "support@fanxapp.com",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-blue-900 mb-6">
        Gizlilik Politikası
      </h1>

      <div className="space-y-4">
        {sections.map((section, index) => (
          <div
            key={index}
            className="bg-white p-5 rounded-lg shadow-sm border border-gray-100"
          >
            <h2 className="text-xl font-semibold mb-2">{section.title}</h2>
            <p className="text-gray-600">{section.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PrivacyPolicy;
