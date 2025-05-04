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

export default function UserItems() {
  const [items, setItems] = useState<ItemType[]>([]);
  const [cart, setCart] = useState<ItemType[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await axios.get("http://localhost:4000/user/items", {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        });
        setItems(res.data.items);
      } catch (err) {
        console.error("Error fetching items ❌", err);
      } finally {
        setLoading(false);
      }
    };

    fetchItems();
  }, []);

  const addToCart = (item: ItemType) => {
    setCart((prev) => [...prev, item]);
    setMessage(`${item.title} added to cart 🛒`);
    setTimeout(() => setMessage(null), 2000);
  };

  const placeOrder = async () => {
    try {
      for (const item of cart) {
        await axios.post(
          `http://localhost:4000/user/items/${item._id}`,
          {},
          {
            headers: {
              Authorization: "Bearer " + localStorage.getItem("token"),
            },
          }
        );
      }
      setMessage("item added to cart ✅");
      setCart([]);
    } catch (err: any) {
      const msg = err.response?.data?.message || "Order failed ❌";
      setMessage(msg);
    } finally {
      setTimeout(() => setMessage(null), 3000);
    }
  };

  const total = cart.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">Restaurant Menu</h1>

      {message && (
        <div className="text-center text-lg font-medium text-green-600 mb-6">
          {message}
        </div>
      )}

      {loading ? (
        <p className="text-center text-gray-500">Loading items...</p>
      ) : items.length === 0 ? (
        <p className="text-center text-gray-500">No items found.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mb-24">
          {items.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-lg shadow-md overflow-hidden transition hover:shadow-lg"
            >
              <img
                src={item.imageLink}
                alt={item.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4 flex flex-col">
                <h2 className="text-xl font-semibold mb-2">{item.title}</h2>
                <p className="text-gray-600 text-sm flex-grow">
                  {item.description}
                </p>
                <p className="mt-2 text-blue-600 font-bold">₹{item.price}</p>
                <button
                  onClick={() => addToCart(item)}
                  className="mt-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600 transition duration-200"
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {cart.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg p-4 flex items-center justify-between z-50">
          <div>
            <p className="text-lg font-semibold">
              Cart: {cart.length} item{cart.length > 1 ? "s" : ""} | ₹{total}
            </p>
          </div>
          <button
            onClick={placeOrder}
            className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
          >
            Place Order
          </button>
        </div>
      )}
    </div>
  );
}
