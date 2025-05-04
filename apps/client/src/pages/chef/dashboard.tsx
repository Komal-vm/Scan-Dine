"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";

// Define the type for the chef response
type ChefData = {
  username: string;
  email: string;
};

export default function ChefDashboard() {
  const [chefData, setChefData] = useState<ChefData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    // Fetch chef details
    const fetchChefData = async () => {
      try {
        const { data } = await axios.get<ChefData>("http://localhost:4000/admin/me", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setChefData(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching chef data:", error);
        setLoading(false);
      }
    };

    fetchChefData();
  }, []);

  const handleViewOrders = () => {
    router.push("/chef/orders");
  };

  const handleProfileSettings = () => {
    router.push("/chef/profile");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-indigo-100 to-blue-300 px-4 py-8">
      <div className="mb-6 text-center">
        <h2 className="text-4xl font-bold text-gray-800">
          Welcome, Chef {loading ? "Loading..." : chefData?.username}!
        </h2>
        <p className="text-xl text-gray-700 mt-2">
          Manage orders, your profile, and more.
        </p>
      </div>

      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg opacity-90 backdrop-blur-lg">
        {/* Button to View Orders */}
        <button
          onClick={handleViewOrders}
          className="w-full py-3 bg-blue-600 text-white rounded-lg mb-4 hover:bg-blue-700 transition duration-300"
        >
          View Orders
        </button>

        {/* Button to Manage Profile */}
        <button
          onClick={handleProfileSettings}
          className="w-full py-3 bg-teal-600 text-white rounded-lg mb-4 hover:bg-teal-700 transition duration-300"
        >
          Profile Settings
        </button>

        {/* Display additional info like email */}
        <div className="mt-4 text-center">
          <p className="text-lg text-gray-600">Email: {chefData?.email}</p>
          <p className="text-sm text-gray-500">Manage your orders and update your profile.</p>
        </div>
      </div>

      <footer className="mt-6 text-center text-sm text-gray-600">
        <p>&copy; 2025 ScanDine. All rights reserved.</p>
      </footer>
    </div>
  );
}
