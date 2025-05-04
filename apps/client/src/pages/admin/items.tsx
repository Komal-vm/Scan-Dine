import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation"; // Changed this import for pageRouter

// 1. Define the shape of an item
interface ItemType {
  _id: string; 
  title: string;
  description: string;
  imageLink: string;
  // Add more fields if needed (price, published, etc.)
}

function Items() {
  const [items, setItems] = useState<ItemType[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:4000/admin/items", {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        });
        setItems(response.data.items);
      } catch (error) {
        console.error("Error fetching items:", error);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="flex flex-wrap justify-center p-4">
      {items.map((item, index) => (
        <ItemCard key={index} item={item} />
      ))}
    </div>
  );
}

// 2. Typed child component
function ItemCard({ item }: { item: ItemType }) {
  const router = useRouter(); // Use router here instead of navigate

  const handleUpdate = () => {
    router.push(`/admin/updateitem/${item._id}`); // Use router.push for navigation
  };

  return (
    <div className="m-4 w-[300px] min-h-[200px] rounded-lg shadow-lg bg-white hover:shadow-xl transition-shadow">
      <img
        src={item.imageLink}
        alt="item"
        className="w-full h-[200px] object-cover rounded-t-lg"
      />
      <div className="p-4">
        <h2 className="text-xl font-bold text-center mb-2">{item.title}</h2>
        <p className="text-gray-600 text-center">{item.description}</p>
        <button
         onClick={handleUpdate}
          className="mt-4 w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >Update item</button>
      </div>
    </div>
  );
}

export default Items;
