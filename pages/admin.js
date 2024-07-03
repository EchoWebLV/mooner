import { useState, useEffect } from "react";
import axios from "axios";

export default function Admin() {
  const [posts, setPosts] = useState([]);

  const fetchPosts = async () => {
    try {
      const { data } = await axios.get("/api/posts");
      setPosts(data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/posts/${id}`, {
        headers: { username: "admin" }, // Replace with actual authentication logic
      });
      fetchPosts(); // Refresh the list after deletion
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <h2>Manage Blog Posts</h2>
      {posts.map((post) => (
        <div key={post.id}>
          <p>{post.description}</p>
          <ul>
            {post.links.map((link, index) => (
              <li key={index}>
                <a href={link}>{link}</a>
              </li>
            ))}
          </ul>
          <p>{post.ticker}</p>
          <button onClick={() => handleDelete(post.id)}>Delete</button>
        </div>
      ))}
    </div>
  );
}
