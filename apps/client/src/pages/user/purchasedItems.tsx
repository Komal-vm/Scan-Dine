"use client";

import { useEffect, useState } from "react";
import axios from "axios";

interface ItemType {
  _id: string;
  title: string;
  description: string;
  imageLink: string;
  price: number;
}

export default function PurchasedItems() {
  const [items, setItems] = useState<ItemType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchPurchasedItems = async () => {
      try {
        const res = await axios.get(`${apiUrl}/user/purchasedItems`, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        });
        setItems(res.data.purchasedItems);
      } catch (err: any) {
        setError(err.response?.data?.message || "Error fetching cart items");
      } finally {
        setLoading(false);
      }
    };

    fetchPurchasedItems();
  }, []);

  const totalPrice = items.reduce((acc, item) => acc + item.price, 0);

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">🛒 Your Cart</h1>

      {loading ? (
        <p className="text-center text-gray-500">Loading your items...</p>
      ) : error ? (
        <p className="text-center text-red-500">{error}</p>
      ) : items.length === 0 ? (
        <p className="text-center text-gray-500">Your cart is empty.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-10">
            {items.map((item) => (
              <div
                key={item._id}
                className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition"
              >
                <img
                  src={item.imageLink}
                  alt={item.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-4">
                  <h2 className="text-xl font-semibold mb-1">{item.title}</h2>
                  <p className="text-gray-600 text-sm">{item.description}</p>
                  <p className="mt-2 text-blue-600 font-bold">₹{item.price}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Bill Summary */}
          <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
            <h2 className="text-2xl font-bold mb-4 text-center">🧾 Bill Summary</h2>
            <ul className="mb-4 divide-y divide-gray-200">
              {items.map((item) => (
                <li key={item._id} className="flex justify-between py-2">
                  <span>{item.title}</span>
                  <span className="font-medium">₹{item.price}</span>
                </li>
              ))}
            </ul>
            <div className="flex justify-between font-bold text-lg border-t pt-3">
              <span>Total</span>
              <span>₹{totalPrice}</span>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
