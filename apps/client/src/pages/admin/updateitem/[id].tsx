import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/router";


function UpdateItem() {
  const router = useRouter();
  const { id: itemId } = router.query;
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("");
  const [imageLink, setImageLink] = useState("");
  const apiUrl = process.env.NEXT_PUBLIC_API_URL;

  const handleUpdate = async () => {
    console.log("Trying to update item:", itemId);
    try {
      const response = await axios.put(
        `${apiUrl}/admin/updateitem/${itemId}`,
        {
          title,
          description,
          price,
          imageLink,
        //   published: true, // optional, remove if not needed
        },
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );

      console.log(response.data);
      alert("Item updated successfully ✅");
    } catch (err) {
      console.error("Update failed ❌", err);
      alert("Failed to update item. Check console.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center pt-40 px-4">
      <h1 className="text-3xl font-bold mb-6">Update Item</h1>

      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-lg">
        <input
          type="text"
          placeholder="New Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border border-gray-300 rounded-md p-2 mb-4"
        />

        <input
          type="text"
          placeholder="New Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="w-full border border-gray-300 rounded-md p-2 mb-4"
        />

        <input
          type="number"
          placeholder="price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          className="w-full border border-gray-300 rounded-md p-2 mb-6"
        /> 

        <input
          type="text"
          placeholder="New Image Link"
          value={imageLink}
          onChange={(e) => setImageLink(e.target.value)}
          className="w-full border border-gray-300 rounded-md p-2 mb-6"
        />

        <button
          onClick={handleUpdate}
          className="w-full bg-green-600 text-white py-2 rounded-md hover:bg-green-700 transition"
        >
          Update Item
        </button>
      </div>
    </div>
  );
}

export default UpdateItem;
