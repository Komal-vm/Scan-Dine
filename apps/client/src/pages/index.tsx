import { useRouter } from 'next/router';

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-black flex items-center justify-center px-4">
      <div className="backdrop-blur-lg bg-white/10 border border-white/20 rounded-2xl shadow-2xl p-8 max-w-2xl w-full text-center text-white">
        <h1 className="text-5xl font-extrabold mb-4 tracking-tight">ScanDine 🍽️</h1>
        <p className="text-lg mb-6 text-gray-300 leading-relaxed">
          <span className="font-semibold text-white">ScanDine</span> is your digital dine-in assistant. Admins can sign up, create a restaurant menu, and auto-generate a QR code that customers scan to browse and order — no app installs needed.
        </p>

        <div className="bg-white/5 p-5 rounded-xl border border-white/10 mb-6 text-left">
          <h2 className="text-xl font-semibold mb-2">👨‍🍳 How it works for Admins:</h2>
          <ul className="list-disc list-inside text-gray-300 text-sm space-y-1">
            <li>Sign up and create your restaurant profile</li>
            <li>Add menu items with name, description & price</li>
            <li>Get your restaurant’s unique QR code</li>
            <li>Place the QR at tables — customers scan & order</li>
          </ul>
        </div>

        <button
          onClick={() => router.push('/admin/signup')}
          className="mt-4 px-6 py-3 rounded-xl bg-purple-600 hover:bg-purple-700 transition-all font-semibold shadow-lg"
        >
          Get Started as Admin 🚀
        </button>
      </div>
    </div>
  );
}
