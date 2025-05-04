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

  useEffect(() => {
    const fetchPurchasedItems = async () => {
      try {
        const res = await axios.get("http://localhost:4000/user/purchasedItems", {
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
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
      )}
    </div>
  );
}
