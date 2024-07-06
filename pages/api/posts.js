import prisma from "../../lib/prisma";
import { uploadMiddleware, runMiddleware } from "../../lib/middleware";
import cloudinary from "../../lib/cloudinary";
const { Connection, PublicKey } = require("@solana/web3.js");

// Layout for a mint account
const MINT_LAYOUT = {
  mintAuthorityOption: { kind: "u32", offset: 0 },
  mintAuthority: { kind: "pubkey", offset: 4 },
  supply: { kind: "u64", offset: 36 },
  decimals: { kind: "u8", offset: 44 },
  isInitialized: { kind: "u8", offset: 45 },
  freezeAuthorityOption: { kind: "u32", offset: 46 },
  freezeAuthority: { kind: "pubkey", offset: 50 },
};

function getMintInfo(accountInfo) {
  const data = Buffer.from(accountInfo.data);
  const mintInfo = {};

  Object.entries(MINT_LAYOUT).forEach(([key, { kind, offset }]) => {
    if (kind === "u8") {
      mintInfo[key] = data.readUInt8(offset);
    } else if (kind === "u32") {
      mintInfo[key] = data.readUInt32LE(offset);
    } else if (kind === "u64") {
      mintInfo[key] = data.readBigUInt64LE(offset);
    } else if (kind === "pubkey") {
      mintInfo[key] = new PublicKey(data.slice(offset, offset + 32));
    }
  });

  return mintInfo;
}

async function getTokenBurnedPercentage(tokenAddress) {
  // Connect to the Solana mainnet
  const connection = new Connection(
    "https://api.mainnet-beta.solana.com",
    "confirmed"
  );

  // Create a PublicKey object from the token address
  const mintPubkey = new PublicKey(tokenAddress);

  // Fetch the account info
  const accountInfo = await connection.getAccountInfo(mintPubkey);

  if (!accountInfo) {
    throw new Error("Token mint not found");
  }

  // Parse the mint info
  const mintInfo = getMintInfo(accountInfo);

  // Calculate the burned amount (assuming burned tokens reduce the supply)
  const totalSupply = mintInfo.supply;

  // Calculate the percentage burned (this assumes all tokens not in circulation are burned)
  const percentageBurned =
    (Number(totalSupply) /
      Number(BigInt(10 ** mintInfo.decimals) * BigInt(1000000000))) *
    100;

  return {
    percentageBurned: (100 - percentageBurned).toFixed(2),
    circulatingSupply: totalSupply.toString(),
    totalSupply: (
      BigInt(10 ** mintInfo.decimals) * BigInt(1000000000)
    ).toString(),
    decimals: mintInfo.decimals,
  };
}

export default async function handler(req, res) {
  if (req.method === "POST") {
    await runMiddleware(req, res, uploadMiddleware);

    const { description, links, postName, ticker, CA } = req.body;
    const newPostData = {
      description,
      links: JSON.parse(links),
      postName,
      ticker,
      CA,
      createdAt: new Date(),
    };

    if (req.file) {
      try {
        // Upload the image to Cloudinary
        const result = await cloudinary.uploader.upload(req.file.path, {
          folder: "posts", // You can organize your images in folders
        });

        // Add the Cloudinary URL to the newPostData
        newPostData.image = result.secure_url;
      } catch (error) {
        console.error("Error uploading image to Cloudinary:", error);
        return res.status(500).json({ error: "Error uploading image" });
      }
    }

    try {
      const newPost = await prisma.post.create({ data: newPostData });

      let message = `New Post Created:\n\nPost Name: ${
        newPost.postName
      }\nDescription: ${newPost.description}\nTicker: ${newPost.ticker}\nCA: ${
        newPost.CA
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
              { CA: { contains: search, mode: "insensitive" } },
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

      // Enrich posts with burned token information
      const enrichedPosts = await Promise.all(
        posts.map(async (post) => {
          try {
            const burnedInfo = await getTokenBurnedPercentage(post.CA);
            return {
              ...post,
              burnedTokens: burnedInfo.percentageBurned + "%",
              circulatingSupply: burnedInfo.circulatingSupply,
              totalSupply: burnedInfo.totalSupply,
              decimals: burnedInfo.decimals,
            };
          } catch (error) {
            console.error(
              `Error fetching burned tokens for ${post.CA}:`,
              error
            );
            return {
              ...post,
              burnedTokens: "Error",
              circulatingSupply: "N/A",
              totalSupply: "N/A",
              decimals: "N/A",
            };
          }
        })
      );

      const totalPages = Math.ceil(totalCount / limit);

      res.status(200).json({
        posts: enrichedPosts,
        pagination: {
          currentPage: page,
          totalPages,
          totalPages,
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
