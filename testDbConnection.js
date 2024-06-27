require("dotenv").config(); // Load environment variables from .env file
const { PrismaClient } = require("@prisma/client");

const prisma = new PrismaClient();

async function main() {
  try {
    // Connect to the database and perform a simple query to ensure the connection is working
    const newPost = await prisma.post.create({
      data: {
        description: "Test connection",
        links: ["http://example.com"],
        postName: "TEST",
        ticker: "TEST",
        createdAt: new Date(),
      },
    });

    console.log("Created new post:", newPost);

    const allPosts = await prisma.post.findMany();
    console.log("All posts:", allPosts);

    console.log("Connection to MongoDB using Prisma is successful!");
  } catch (error) {
    console.error("Error connecting to MongoDB using Prisma:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch(console.error);
