import { useEffect, useState } from "react";
import axios from "axios";

interface OrderItem {
  _id: string;
  title: string;
  description: string;
  imageLink: string;
  restaurantId: string;
}

interface UserOrder {
  user: string;
  items: OrderItem[];
}

function ChefOrders() {
  const [orders, setOrders] = useState<UserOrder[]>([]);
  const [completedOrders, setCompletedOrders] = useState<number[]>([]); // track by index
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get(`${apiUrl}/chef/orders`, {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        });
        setOrders(res.data.orders);
      } catch (err) {
        console.error("Error fetching orders:", err);
      }
    };

    fetchOrders();
  }, []);

  const handleComplete = (index: number) => {
    setCompletedOrders(prev => [...prev, index]);
  };

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-center">Chef Orders Dashboard 🍽️</h1>
      <div className="flex flex-col gap-6">
        {orders.map((order, index) => {
          const isCompleted = completedOrders.includes(index);
          return (
            <div
              key={index}
              className={`bg-white rounded-xl shadow-lg p-5 transition-opacity duration-500 ${
                isCompleted ? "opacity-50" : "opacity-100"
              }`}
            >
              <h2 className="text-xl font-semibold text-blue-600 mb-4">
                Orders by: {order.user}
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                {order.items.map(item => (
                  <div
                    key={item._id}
                    className="border rounded-lg overflow-hidden shadow hover:shadow-md transition"
                  >
                    <img
                      src={item.imageLink}
                      alt={item.title}
                      className="w-full h-40 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="text-lg font-bold">{item.title}</h3>
                      <p className="text-gray-600 text-sm">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>

              {!isCompleted ? (
                <button
                  onClick={() => handleComplete(index)}
                  className="mt-2 px-4 py-2 bg-green-500 hover:bg-green-600 text-white font-semibold rounded transition"
                >
                  Mark as Complete
                </button>
              ) : (
                <p className="text-green-600 font-semibold mt-2">Order Completed ✅</p>
              )}
            </div>
          );
        })}

        {orders.length === 0 && (
          <p className="text-center text-gray-500">No orders found for this restaurant.</p>
        )}
      </div>
    </div>
  );
}

export default ChefOrders;
