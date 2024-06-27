import { useState, useEffect } from "react";
import axios from "axios";

export default function Home() {
  const [posts, setPosts] = useState([]);

  const fetchPosts = async () => {
    const { data } = await axios.get("/api/posts");
    setPosts(data);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  // Helper function to calculate the time difference and format it
  const getTimeAgo = (dateString) => {
    const postDate = new Date(dateString);
    const now = new Date();
    const difference = now - postDate;

    const minutes = Math.floor(difference / 60000);
    const hours = Math.floor(difference / 3600000);
    const days = Math.floor(difference / 86400000);

    if (days >= 1) {
      return `${days} day${days > 1 ? "s" : ""} ago`;
    } else if (hours >= 1) {
      return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    } else {
      return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    }
  };

  return (
    <div>
      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="bg-white shadow-md rounded-lg p-6 mb-4"
            >
              <p className="text-gray-700 mb-2">{post.description}</p>
              <ul className="list-disc list-inside mb-2">
                {post.links.map((link, index) => (
                  <div key={index}>
                    <a href={link} className="text-blue-500 hover:underline">
                      {link}
                    </a>
                  </div>
                ))}
              </ul>
              <p className="text-gray-500 font-semibold">{post.ticker}</p>
              <p className="text-gray-500 text-sm mt-2">
                {getTimeAgo(post.createdAt)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
