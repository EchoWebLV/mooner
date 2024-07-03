import prisma from "../../lib/prisma";
import { uploadMiddleware, runMiddleware } from "../../lib/middleware";

export default async function handler(req, res) {
  if (req.method === "POST") {
    await runMiddleware(req, res, uploadMiddleware);

    const { description, links, postName, ticker } = req.body;
    const newPostData = {
      description,
      links: JSON.parse(links),
      postName,
      ticker,
      createdAt: new Date(),
    };

    if (req.file) {
      newPostData.image = `/uploads/${req.file.filename}`;
    }

    try {
      const newPost = await prisma.post.create({ data: newPostData });

      let message = `New Post Created:\n\nPost Name: ${
        newPost.postName
      }\nDescription: ${newPost.description}\nTicker: ${
        newPost.ticker
      }\nLinks: ${newPost.links.join(", ")}\n`;
      if (newPost.image) {
        message += `Image: ${newPost.image}\n`;
      }

      res.status(201).json(newPost);
    } catch (error) {
      console.error("Error creating post:", error);
      res.status(500).json({ error: "Error creating post" });
    }
  } else if (req.method === "GET") {
    try {
      const page = parseInt(req.query.page) || 1;
      const limit = parseInt(req.query.limit) || 10;
      const search = req.query.search || "";
      const skip = (page - 1) * limit;

      const where = search
        ? {
            OR: [
              { postName: { contains: search, mode: "insensitive" } },
              { description: { contains: search, mode: "insensitive" } },
              { ticker: { contains: search, mode: "insensitive" } },
            ],
          }
        : {};

      const [posts, totalCount] = await Promise.all([
        prisma.post.findMany({
          where,
          orderBy: { createdAt: "desc" },
          skip,
          take: limit,
        }),
        prisma.post.count({ where }),
      ]);

      const totalPages = Math.ceil(totalCount / limit);

      res.status(200).json({
        posts,
        pagination: {
          currentPage: page,
          totalPages,
          totalCount,
          hasNextPage: page < totalPages,
          hasPreviousPage: page > 1,
        },
      });
    } catch (error) {
      console.error("Error fetching posts:", error);
      res.status(500).json({ error: "Error fetching posts" });
    }
  } else {
    res.status(405).json({ error: `Method ${req.method} Not Allowed` });
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
