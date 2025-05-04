"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";

// Define the type for the admin response
type AdminData = {
  username: string;
};

export default function AdminDashboard() {
  const [username, setUsername] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    // Fetch admin username
    const fetchAdminData = async () => {
      try {
        const { data } = await axios.get<AdminData>("http://localhost:4000/admin/me", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setUsername(data.username);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching admin data:", error);
        setLoading(false);
      }
    };

    fetchAdminData();
  }, []);

  const handleAddItems = () => {
    router.push("/admin/additems");
  };

  const handleGenerateQR = () => {
    router.push("/admin/generateQR");
  };
  const Redirect = () => {
    router.push("/admin/items");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-blue-100 to-green-200 px-4 py-8">
      <div className="mb-6 text-center">
        <h2 className="text-4xl font-bold text-gray-800">
          Welcome back, {loading ? "Loading..." : username}!
        </h2>
        <p className="text-xl text-gray-700 mt-2">
          Manage your restaurant easily using the admin panel below.
        </p>
      </div>

      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg opacity-90 backdrop-blur-lg">
        <button
          onClick={handleAddItems}
          className="w-full py-3 bg-purple-600 text-white rounded-lg mb-4 hover:bg-purple-700 transition duration-300"
        >
          Add Items
        </button>
        

        <button
          onClick={Redirect}
          className="w-full py-3 bg-green-600 text-white rounded-lg mb-4 hover:bg-green-700 transition duration-300"
        >
          view all items/Menu
        </button>

        <button
          onClick={handleGenerateQR}
          className="w-full py-3 bg-green-600 text-white rounded-lg mb-4 hover:bg-green-700 transition duration-300"
        >
          Generate QR Code
        </button>


       

        <div className="mt-4 text-center">
          <button
            onClick={() => router.push("/admin/settings")}
            className="py-2 px-4 bg-blue-500 text-white rounded-full hover:bg-blue-600 transition duration-300"
          >
            Account Settings
          </button>
        </div>
      </div>

      <footer className="mt-6 text-center text-sm text-gray-600">
        <p>&copy; 2025 ScanDine. All rights reserved.</p>
      </footer>
    </div>
  );
}
