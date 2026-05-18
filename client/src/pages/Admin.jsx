import { useEffect, useState } from "react";
import api from "../services/api"; // Senin kullandığın axios instance

const Admin = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("reports");

  const fetchDashboardData = async () => {
    try {
      const response = await api.get("/admin/dashboard");
      setData(response.data.data);
    } catch (err) {
      console.error("Dashboard yüklenemedi", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleResolve = async (id) => {
    try {
      await api.patch(`/admin/reports/${id}/resolve`);
      fetchDashboardData(); // Listeyi güncelle
    } catch (err) {
      alert("İşlem başarısız.");
    }
  };

  const handleDeleteTweet = async (id) => {
    if (
      !window.confirm(
        "Bu tweeti kalıcı olarak silmek istediğinize emin misiniz?",
      )
    )
      return;
    try {
      await api.delete(`/admin/tweets/${id}`);
      fetchDashboardData(); // Listeyi güncelle
    } catch (err) {
      alert("Tweet silinemedi.");
    }
  };

  if (loading) {
    return (
      <div className="text-center mt-20 text-gray-500 font-bold animate-pulse">
        Yönetim Paneli Yükleniyor...
      </div>
    );
  }

  if (!data) {
    return (
      <div className="text-center mt-20 text-red-500">
        Veriler alınamadı veya yetkiniz yok.
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto mt-8 p-4 space-y-6">
      <h1 className="text-3xl font-extrabold text-gray-800 tracking-tight">
        Dashboard 🛡️
      </h1>

      {/* İstatistik Kartları */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard
          title="Kullanıcılar"
          count={data.stats.userCount}
          color="blue"
        />
        <StatCard
          title="Toplam Tweet"
          count={data.stats.tweetCount}
          color="green"
        />
        <StatCard
          title="Bekleyen Şikayet"
          count={data.stats.pendingReportCount}
          color="red"
        />
        <StatCard
          title="Geri Bildirimler"
          count={data.stats.feedbackCount}
          color="purple"
        />
      </div>

      {/* Sekmeler (Tabs) */}
      <div className="flex border-b border-gray-200 mt-8">
        <button
          onClick={() => setActiveTab("reports")}
          className={`py-2 px-4 font-bold text-sm ${
            activeTab === "reports"
              ? "border-b-2 border-red-500 text-red-600"
              : "text-gray-500"
          }`}
        >
          Bekleyen Şikayetler
        </button>
        <button
          onClick={() => setActiveTab("feedbacks")}
          className={`py-2 px-4 font-bold text-sm ${
            activeTab === "feedbacks"
              ? "border-b-2 border-purple-500 text-purple-600"
              : "text-gray-500"
          }`}
        >
          Son Geri Bildirimler
        </button>
      </div>

      {/* İçerik */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
        {activeTab === "reports" && (
          <div className="space-y-4">
            {data.pendingReports.length === 0 ? (
              <p className="text-gray-500 text-center py-6">
                Bekleyen şikayet yok. Harika!
              </p>
            ) : (
              data.pendingReports.map((report) => (
                <div
                  key={report.id}
                  className="p-4 border rounded-lg bg-gray-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                >
                  <div>
                    <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded">
                      Nedeni: {report.reason}
                    </span>
                    <p className="text-sm mt-2 text-gray-700">
                      <strong>@{report.tweet?.author?.username}:</strong>{" "}
                      {report.tweet?.content || "(Silinmiş Tweet)"}
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      Şikayet eden: @{report.reporter.username}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleResolve(report.id)}
                      className="px-3 py-1 bg-green-500 text-white text-sm font-semibold rounded hover:bg-green-600 transition"
                    >
                      Temizle
                    </button>
                    {report.tweet && (
                      <button
                        onClick={() => handleDeleteTweet(report.tweet.id)}
                        className="px-3 py-1 bg-red-600 text-white text-sm font-semibold rounded hover:bg-red-700 transition"
                      >
                        Tweeti Sil
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "feedbacks" && (
          <div className="space-y-3">
            {data.recentFeedbacks.length === 0 ? (
              <p className="text-gray-500 text-center py-6">
                Henüz geri bildirim yok.
              </p>
            ) : (
              data.recentFeedbacks.map((fb) => (
                <div key={fb.id} className="p-3 border-b last:border-0">
                  <p className="text-gray-800 text-sm">{fb.content}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Tarih: {new Date(fb.createdAt).toLocaleDateString("tr-TR")}
                  </p>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// Basit İstatistik Kartı Component'i
const StatCard = ({ title, count, color }) => {
  const colorClasses = {
    blue: "text-blue-600 bg-blue-50",
    green: "text-green-600 bg-green-50",
    red: "text-red-600 bg-red-50",
    purple: "text-purple-600 bg-purple-50",
  };

  return (
    <div
      className={`p-5 rounded-2xl ${colorClasses[color]} border border-white/50 shadow-sm`}
    >
      <h3 className="text-sm font-semibold opacity-80 uppercase tracking-wider">
        {title}
      </h3>
      <p className="text-3xl font-black mt-1">{count}</p>
    </div>
  );
};

export default Admin;
