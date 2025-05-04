import { useState } from "react";
import axios from "axios";

export default function GenerateQR() {
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await axios.get("http://localhost:4000/admin/generate-qr", {
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

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-gray-50">
      <h1 className="text-3xl font-bold mb-4 text-center">Generate QR Code</h1>

      <button
        onClick={handleGenerate}
        className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow hover:bg-blue-700 transition mb-6 disabled:opacity-50"
        disabled={loading}
      >
        {loading ? "Generating..." : "Generate QR"}
      </button>

      {error && (
        <p className="text-red-600 text-center mb-4">{error}</p>
      )}

      {qrCode && (
        <div className="bg-white p-4 rounded-lg shadow-md">
          <img src={qrCode} alt="QR Code" className="w-64 h-64" />
          <p className="text-center mt-2 text-sm text-gray-500">
            This links to your restaurant's sign-up page
          </p>
        </div>
      )}
    </div>
  );
}
