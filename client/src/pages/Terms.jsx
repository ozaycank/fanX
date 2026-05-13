const Terms = () => {
  const terms = [
    {
      title: "Hizmet Tanımı",
      content:
        "FanX, spor taraftarlarının içerik paylaşımı yapabildiği sosyal medya platformudur.",
    },
    {
      title: "Kullanıcı Hesabı",
      content:
        "Kullanıcılar doğru bilgi vermek ve hesap güvenliğini sağlamakla yükümlüdür.",
    },
    {
      title: "Yasaklı Davranışlar",
      content:
        "Hakaret, spam, nefret söylemi, sahte hesap kullanımı ve yasa dışı içerikler yasaktır.",
    },
    {
      title: "İçerik Sorumluluğu",
      content: "Kullanıcılar paylaştıkları içeriklerden kendileri sorumludur.",
    },
    {
      title: "Hesap Askıya Alma",
      content:
        "Kuralları ihlal eden hesaplar geçici veya kalıcı olarak askıya alınabilir.",
    },
    {
      title: "Hizmet Değişiklikleri",
      content: "FanX hizmetlerinde değişiklik yapma hakkını saklı tutar.",
    },
    {
      title: "Sorumluluk Reddi",
      content: "Kullanıcı içeriklerinden FanX doğrudan sorumlu değildir.",
    },
    {
      title: "İletişim",
      content: "support@fanxapp.com",
    },
  ];

  return (
    <div className="max-w-4xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-blue-900 mb-6">
        Kullanım Şartları
      </h1>

      <div className="space-y-4">
        {terms.map((term, index) => (
          <div
            key={index}
            className="bg-white p-5 rounded-lg shadow-sm border border-gray-100"
          >
            <h2 className="text-xl font-semibold mb-2">{term.title}</h2>
            <p className="text-gray-600">{term.content}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Terms;
