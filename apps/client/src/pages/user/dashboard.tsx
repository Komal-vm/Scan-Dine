"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";

// Define the type for the user response
type UserData = {
  username: string;
  email: string;
  orders: string[]; // Example field for order history, adjust as needed
};

export default function UserDashboard() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    // Fetch user details
    const fetchUserData = async () => {
      try {
        const { data } = await axios.get<UserData>("http://localhost:4000/user/me", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        setUserData(data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  const handleSelectItems = () => {
    router.push("/user/items");
  };

  const handleOrderHistory = () => {
    router.push("/user/order-history");
  };

  const handleProfileSettings = () => {
    router.push("/user/profile");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-r from-green-100 to-blue-200 px-4 py-8">
      <div className="mb-6 text-center">
        <h2 className="text-4xl font-bold text-gray-800">
          Welcome back, {loading ? "Loading..." : userData?.username}!
        </h2>
        <p className="text-xl text-gray-700 mt-2">
          Manage your orders, profile, and explore the menu.
        </p>
      </div>

      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-lg opacity-90 backdrop-blur-lg">
        {/* Button to Select Items from Menu */}
        <button
          onClick={handleSelectItems}
          className="w-full py-3 bg-teal-600 text-white rounded-lg mb-4 hover:bg-teal-700 transition duration-300"
        >
          Select Items from Menu
        </button>

        {/* Button to View Order History */}
        <button
          onClick={handleOrderHistory}
          className="w-full py-3 bg-indigo-600 text-white rounded-lg mb-4 hover:bg-indigo-700 transition duration-300"
        >
          View Order History
        </button>

        {/* Button to Manage Profile */}
        <button
          onClick={handleProfileSettings}
          className="w-full py-3 bg-orange-600 text-white rounded-lg mb-4 hover:bg-orange-700 transition duration-300"
        >
          Profile Settings
        </button>

        {/* Display additional info like email */}
        <div className="mt-4 text-center">
          <p className="text-lg text-gray-600">Email: {userData?.email}</p>
          <p className="text-sm text-gray-500">Manage your preferences and order history from here.</p>
        </div>
      </div>

      <footer className="mt-6 text-center text-sm text-gray-600">
        <p>&copy; 2025 ScanDine. All rights reserved.</p>
      </footer>
    </div>
  );
}
