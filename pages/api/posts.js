import prisma from "../../lib/prisma";

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { description, links, ticker } = req.body;

    const newPostData = {
      description,
      links,
      ticker,
      createdAt: new Date(),
    };

    try {
      const newPost = await prisma.post.create({
        data: newPostData,
      });
      res.status(201).json(newPost);
    } catch (error) {
      console.error("Error creating post:", error);
      res.status(500).json({ error: "Error creating post" });
    }
  } else if (req.method === "GET") {
    try {
      const posts = await prisma.post.findMany({
        orderBy: { createdAt: "desc" },
      });
      res.status(200).json(posts);
    } catch (error) {
      console.error("Error fetching posts:", error);
      res.status(500).json({ error: "Error fetching posts" });
    }
  } else {
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
