import { useState } from "react";
import axios from "axios";

export default function GenerateQR() {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [chefQrCode, setChefQrCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const handleGenerateAdminQR = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${apiUrl}/admin/generate-qr`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      setQrCode(res.data.qrCode);
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateChefQR = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${apiUrl}/admin/generate-qr-chef`, {
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });
      setChefQrCode(res.data.qrCode);
    } catch (err: any) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-50">
      <h1 className="text-3xl font-bold mb-4 text-center">Generate QR Code</h1>

      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <button
          onClick={handleGenerateAdminQR}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate User QR"}
        </button>
        <button
          onClick={handleGenerateChefQR}
          className="bg-green-600 text-white px-6 py-2 rounded-lg shadow hover:bg-green-700 transition disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate Chef QR"}
        </button>
      </div>

      {error && <p className="text-red-600 text-center mb-4">{error}</p>}

      {qrCode && (
        <div className="bg-white p-4 rounded-lg shadow-md mb-6">
          <img src={qrCode} alt="Admin QR Code" className="w-64 h-64" />
          <p className="text-center mt-2 text-sm text-gray-500">
            This links to your restaurant's user/customer sign-up page
          </p>
        </div>
      )}

      {chefQrCode && (
        <div className="bg-white p-4 rounded-lg shadow-md">
          <img src={chefQrCode} alt="Chef QR Code" className="w-64 h-64" />
          <p className="text-center mt-2 text-sm text-gray-500">
            This links to your chef's signup/signin page
          </p>
        </div>
      )}
    </div>
  );
}
