import prisma from "../../../../lib/prisma";

export default async function handler(req, res) {
  const { ca } = req.query;

  if (req.method === "GET") {
    try {
      const post = await prisma.post.findUnique({
        where: { CA: ca },
      });

      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({ message: "Post not found" });
      }
    } catch (error) {
      console.error("Error fetching post:", error);
      res.status(500).json({ message: "Error fetching post" });
    }
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
