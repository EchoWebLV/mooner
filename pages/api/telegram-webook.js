import { bot } from "../../lib/telegram";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      console.log("Webhook received:", JSON.stringify(req.body, null, 2));
      await bot.handleUpdate(req.body);
      res.status(200).send("OK");
    } catch (error) {
      console.error("Error handling update:", error);
      res.status(500).send("Internal Server Error");
    }
  } else {
    res.status(405).send(`Method ${req.method} Not Allowed`);
  }
}

export const config = {
  api: {
    bodyParser: false,
  },
};
