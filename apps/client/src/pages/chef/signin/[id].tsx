"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";
export default function Home() {
  const router = useRouter();
  const { id:restaurantId } = router.query;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignin = async () => {
    console.log("Restaurant id:", restaurantId);
    try {
      const { data } = await axios.post(`http://localhost:4000/chef/signin/${restaurantId}`, {
        username: email,
        password: password,
      });

      localStorage.setItem("token", data.token);
      console.log("Signin successful ✅");
      router.push(`/chef/dashboard/`)
    } catch (err) {
      console.error("Signin failed ❌", err);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 px-4">
      <div className="mb-8 text-center">
        <h2 className="text-3xl font-bold text-gray-800">
          Welcome to ScanDine. Signin below
        </h2>
      </div>

      <div className="w-full max-w-md bg-white p-6 rounded-lg shadow-md">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 mb-4 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 mb-6 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        <button
          onClick={handleSignin}
          className="w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-200"
        >
          Sign in
        </button>
      </div>
    </div>
  );
}
