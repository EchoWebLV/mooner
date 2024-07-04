import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from "axios";
import Link from "next/link";
import Logo from "../../componenets/Logo";
import DexScreenerIframe from "../../componenets/DexScreenerIframe";
import LoadingSpinner from "../../componenets/LoadingComponent";

export default function MoonerPost() {
  const [post, setPost] = useState(null);
  const router = useRouter();
  const { ca } = router.query;

  useEffect(() => {
    if (ca) {
      fetchPost(ca);
    }
  }, [ca]);

  const fetchPost = async (contractAddress) => {
    try {
      const { data } = await axios.get(`/api/posts/by-ca/${contractAddress}`);
      setPost(data);
    } catch (error) {
      console.error("Error fetching post:", error);
    }
  };

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

  if (!post) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <div className="text-center text-[0.3rem] md:text-[0.75rem]">
        <Logo />
      </div>
      <div className="text-center py-5 text-[2rem]">
        <Link href="/">[ Back to Home ]</Link>
      </div>
      <div className="bg-white shadow-md rounded-lg p-6 mb-4 text-black">
        {post.image && (
          <img
            src={post.image}
            alt={post.postName}
            className="mb-4 w-full h-64 object-cover rounded-lg"
          />
        )}
        <h1 className="text-3xl font-bold">{post.postName}</h1>
        <p className="text-gray-500 text-sm mb-2">
          Posted {getTimeAgo(post.createdAt)}
        </p>
        <p className="text-xl font-semibold mb-2">TICKER: ({post.ticker})</p>
        <p className="text-xl font-semibold mb-2">CA: {post.CA}</p>
        <p className="text-lg mb-4">{post.description}</p>
        <h2 className="text-xl font-semibold mb-2">Links:</h2>
        <ul className="list-disc list-inside mb-4">
          {post.links.map((link, index) => (
            <li key={index}>
              <a href={link} className="text-blue-500 hover:underline">
                {link}
              </a>
            </li>
          ))}
        </ul>
        <DexScreenerIframe contractAddress={post.CA} />
      </div>
    </div>
  );
}
