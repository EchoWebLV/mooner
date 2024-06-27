import { useState } from "react";
import { useWallet } from "@solana/wallet-adapter-react";
import { WalletMultiButton } from "@solana/wallet-adapter-react-ui";
import axios from "axios";
import { Connection, clusterApiUrl, Transaction } from "@solana/web3.js";
import { useRouter } from "next/router";

export default function Home() {
  const { publicKey, sendTransaction } = useWallet();
  const [description, setDescription] = useState("");
  const [links, setLinks] = useState(["", "", ""]);
  const [ticker, setTicker] = useState("");
  const [postName, setPostName] = useState("");
  const [image, setImage] = useState(null); // State to handle image file
  const router = useRouter();

  const handlePost = async () => {
    if (!publicKey) return alert("Please connect your wallet!");

    try {
      // Create the payment transaction
      const { data } = await axios.post("/api/pay", {
        sender: publicKey.toString(),
      });

      const transaction = Transaction.from(
        Buffer.from(data.transaction, "base64")
      );
      const connection = new Connection(
        clusterApiUrl("mainnet-beta"),
        "confirmed"
      );
      await sendTransaction(transaction, connection);

      // After successful payment, create the post
      const postData = new FormData(); // Using FormData to handle file upload
      postData.append("description", description);
      postData.append("links", JSON.stringify(links)); // Convert links array to JSON string
      postData.append("ticker", ticker);
      postData.append("postName", postName);
      if (image) postData.append("image", image); // Append the image file if available

      await axios.post("/api/posts", postData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      router.push("/"); // Redirect to index page
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4 text-black">
      <h1 className="text-2xl font-bold mb-4">Post a Blog</h1>
      <div className="mb-4">
        <WalletMultiButton className="w-full" />
      </div>
      <textarea
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Description"
        className="w-full p-2 border border-gray-300 rounded mb-4"
        rows="4"
      />
      {links.map((link, index) => (
        <input
          key={index}
          type="text"
          value={link}
          onChange={(e) => {
            const newLinks = [...links];
            newLinks[index] = e.target.value;
            setLinks(newLinks);
          }}
          placeholder={`Link ${index + 1}`}
          className="w-full p-2 border border-gray-300 rounded mb-4"
        />
      ))}
      <input
        type="text"
        value={postName}
        onChange={(e) => setPostName(e.target.value)}
        placeholder="Name"
        className="w-full p-2 border border-gray-300 rounded mb-4"
      />
      <input
        type="text"
        value={ticker}
        onChange={(e) => setTicker(e.target.value)}
        placeholder="Ticker"
        className="w-full p-2 border border-gray-300 rounded mb-4"
      />
      <input
        type="file"
        onChange={(e) => setImage(e.target.files[0])} // Handle file input
        className="w-full p-2 border border-gray-300 rounded mb-4"
      />
      <button
        onClick={handlePost}
        className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Submit
      </button>
    </div>
  );
}
