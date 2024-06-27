import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import Logo from "../componenets/Logo";

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
        <div className="text-center text-[0.3rem] md:text-[0.75rem]">
          <Logo />
        </div>
        <div className="text-center py-5 text-[2rem]">
          <Link href="/post">[ Post New Mooner ]</Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {posts.map((post) => (
            <div
              key={post.id}
              className="relative bg-white shadow-md rounded-lg p-6 mb-4 flex flex-col"
            >
              {post.image && (
                <img
                  src={post.image}
                  alt={post.name}
                  className="mb-4 w-full h-48 object-cover rounded-lg"
                />
              )}
              <p className="text-gray-500 font-semibold">{post.name}</p>
              <p className="text-gray-500 font-semibold">
                TICKER: ({post.ticker})
              </p>
              <p className="text-gray-700 font-semibold mb-2">
                {post.description}
              </p>
              <ul className="list-disc list-inside mb-2">
                {post.links.map((link, index) => (
                  <div key={index}>
                    <a href={link} className="text-blue-500 hover:underline">
                      {link}
                    </a>
                  </div>
                ))}
              </ul>
              <div className="mt-auto">
                <p className="text-gray-500 text-sm mt-2">
                  {getTimeAgo(post.createdAt)}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
