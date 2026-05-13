const FAQ = () => {
  const faqs = [
    {
      question: "FanX nedir?",
      answer:
        "FanX, spor taraftarlarının düşüncelerini paylaşabildiği sosyal medya platformudur.",
    },
    {
      question: "Nasıl hesap oluşturabilirim?",
      answer:
        "E-posta adresiniz ile kayıt olup kullanıcı hesabınızı oluşturabilirsiniz.",
    },
    {
      question: "Şifremi unuttum, ne yapmalıyım?",
      answer:
        "“Şifremi Unuttum” seçeneğini kullanarak şifre sıfırlama bağlantısı alabilirsiniz.",
    },
    {
      question: "Gönderi paylaşabilir miyim?",
      answer:
        "Evet. Metin tabanlı gönderiler paylaşabilir ve diğer kullanıcılarla etkileşime geçebilirsiniz.",
    },
    {
      question: "Hesabımı silebilir miyim?",
      answer:
        "Evet. Ayarlar bölümünden hesabınızı silebilir veya destek ekibine ulaşabilirsiniz.",
    },
    {
      question: "Kurallara aykırı içerikleri nasıl bildiririm?",
      answer: "Gönderi üzerindeki “Bildir” seçeneğini kullanabilirsiniz.",
    },
    {
      question: "FanX tamamen ücretsiz mi?",
      answer: "Evet, standart kullanıcılar için platform tamamen ücretsizdir.",
    },
    {
      question: "Destek ekibine nasıl ulaşabilirim?",
      answer:
        "support@fanxapp.com adresinden bizimle iletişime geçebilirsiniz.",
    },
  ];

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold text-blue-900 mb-6">
        Sıkça Sorulan Sorular
      </h1>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className="bg-white p-5 rounded-lg shadow-sm border border-gray-100"
          >
            <h3 className="font-bold text-lg mb-2">{faq.question}</h3>
            <p className="text-gray-600">{faq.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FAQ;
