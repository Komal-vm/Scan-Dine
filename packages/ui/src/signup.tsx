import { useState } from "react";

export function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="font-sans p-4">
      <div className="mt-44 mb-5 text-center">
        <h2 className="text-2xl font-semibold">Welcome to Coursera. Signup below</h2>
      </div>

      <div className="flex justify-center">
        <div className="w-[500px] p-6 border border-gray-300 rounded-lg shadow-md">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 mb-4 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 mb-6 text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            onClick={() => {
              const fetchdata = async () => {
                const response = await fetch("http://localhost:4000/admin/signup", {
                  method: "POST",
                  body: JSON.stringify({
                    username: email,
                    password: password,
                  }),
                  headers: { "Content-Type": "application/json" },
                });
                const data = await response.json();
                localStorage.setItem("token", data.token);
              };
              fetchdata();
            }}
            className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
          >
            Sign up
          </button>
        </div>
      </div>
    </div>
  );
}
