import { useState } from "react";

function AddItem() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState("");
  const [price,setPrice] = useState("")

  const handleSubmit = async () => {
    try {
      const response = await fetch("http://localhost:4000/admin/additems", {
        method: "POST",
        body: JSON.stringify({
          title: title,
          description: description,
          price:price,
          imageLink: image,
          published: true,
        }),
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });

      const data = await response.json();
      console.log(data);
      alert("Item added!");
    } catch (err) {
      console.error("Failed to add item:", err);
      alert("Something went wrong ❌");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center pt-40 px-4">
      <h1 className="text-3xl font-bold mb-6">Add Item Here</h1>

      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-lg">
        <input
          type="text"
          placeholder="Title"
          className="w-full border border-gray-300 rounded-md p-2 mb-4"
          onChange={(e) => setTitle(e.target.value)}
        />

        <input
          type="text"
          placeholder="Description"
          className="w-full border border-gray-300 rounded-md p-2 mb-4"
          onChange={(e) => setDescription(e.target.value)}
        />
        
        <input
          type="number"
          placeholder="price"
          className="w-full border border-gray-300 rounded-md p-2 mb-6"
          onChange={(e) => setPrice(e.target.value)}
        />

        <input
          type="text"
          placeholder="Image Link"
          className="w-full border border-gray-300 rounded-md p-2 mb-6"
          onChange={(e) => setImage(e.target.value)}
        />

        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          Add Item
        </button>
      </div>
    </div>
  );
}

export default AddItem;
