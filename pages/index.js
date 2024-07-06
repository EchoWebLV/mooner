import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import Logo from "../componenets/Logo";
import Nav from "../componenets/Nav";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const postsPerPage = 3;

  const fetchPosts = async (page, search = "") => {
    try {
      const { data } = await axios.get(
        `/api/posts?page=${page}&limit=${postsPerPage}&search=${search}`
      );
      setPosts(data.posts);
      setCurrentPage(data.pagination.currentPage);
      setTotalPages(data.pagination.totalPages);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  useEffect(() => {
    fetchPosts(currentPage, searchTerm);
  }, [currentPage, searchTerm]);

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

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchPosts(1, searchTerm);
  };

  return (
    <div className="flex flex-col min-h-screen">
      <div className="container mx-auto p-4 flex-grow">
        <div className="text-center text-[0.3rem] md:text-[0.75rem]">
          <Logo />
        </div>
        <div>
          <Nav />
        </div>
        <div className="text-center py-5 text-[2rem] text-[#9945FF]">
          <Link href="/post">[ Post New Mooner ]</Link>
        </div>
        <form
          onSubmit={handleSearch}
          className="flex flex-col items-center mb-4 max-w-[400px] mx-auto"
        >
          <div className="flex w-full">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search posts..."
              className="w-full px-4 py-2 border border-gray-300 rounded-l-md"
            />
            <button
              type="submit"
              className="bg-[#9945FF] text-white font-bold px-4 py-2 rounded-r-md"
            >
              Search
            </button>
          </div>
        </form>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {posts.map((post) => (
            <Link href="/mooner/[ca]" as={`/mooner/${post.CA}`} key={post.id}>
              <div className="relative bg-white shadow-md rounded-lg p-6 mb-4 flex flex-col cursor-pointer hover:shadow-lg transition-shadow">
                {post.image && (
                  <img
                    src={post.image}
                    alt={post.postName}
                    className="mb-4 w-full h-48 object-cover rounded-lg"
                  />
                )}
                <p className="text-gray-500 font-semibold">{post.postName}</p>
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
            </Link>
          ))}
        </div>
      </div>

      <div className="mt-auto">
        <div className="flex justify-center py-4">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="bg-[#9a45ff] text-white px-4 py-2 rounded-l-md disabled:bg-[#9945ff78]"
          >
            Prev
          </button>
          <span className="bg-[#9a45ff] px-4 py-2">
            Page {currentPage} of {totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === totalPages}
            className="bg-[#9a45ff] text-white px-4 py-2 rounded-r-md disabled:bg-[#9945ff78]"
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
}
