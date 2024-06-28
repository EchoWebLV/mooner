const { Telegraf } = require("telegraf");
const prisma = require("./prisma"); // Adjust the path according to your setup
require("dotenv").config();

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
if (!TELEGRAM_BOT_TOKEN) {
  throw new Error("TELEGRAM_BOT_TOKEN is not set.");
}

const bot = new Telegraf(TELEGRAM_BOT_TOKEN);
let chatIds = new Set();

// Log the bot's name
bot.telegram
  .getMe()
  .then((botInfo) => {
    bot.options.username = botInfo.username;
    console.log(`Bot ${botInfo.username} has been started...`);
  })
  .catch((error) => {
    console.error("Failed to get bot info:", error);
  });

// Middleware to collect chat IDs
bot.use((ctx, next) => {
  if (
    ctx.chat &&
    (ctx.chat.type === "group" || ctx.chat.type === "supergroup")
  ) {
    chatIds.add(ctx.chat.id.toString());
    console.log(`Added chat ID: ${ctx.chat.id}`);
  }
  console.log("Current chat IDs:", Array.from(chatIds));
  return next();
});

// Command handler for /show
bot.command("show", async (ctx) => {
  try {
    const posts = await prisma.post.findMany({
      orderBy: { createdAt: "desc" },
    });
    if (posts.length === 0) {
      await ctx.reply("No posts found.");
    } else {
      let message = "Posts:\n\n";
      posts.forEach((post) => {
        message += `Post Name: ${post.postName}\nDescription: ${
          post.description
        }\nTicker: ${post.ticker}\nLinks: ${post.links.join(", ")}\n\n`;
      });
      await ctx.reply(message);
    }
  } catch (error) {
    console.error("Failed to fetch posts:", error);
    await ctx.reply("Failed to fetch posts.");
  }
});

// Function to send messages to all stored chat IDs
const sendTelegramMessage = async (message) => {
  console.log("Sending message to chat IDs:", Array.from(chatIds));
  for (const chatId of chatIds) {
    try {
      await bot.telegram.sendMessage(chatId, message);
      console.log(`Message sent to chat ID: ${chatId}`);
    } catch (error) {
      console.error(`Failed to send message to chat ID: ${chatId}`, error);
    }
  }
};

// Setup webhook or polling
const setupBot = async () => {
  if (process.env.NODE_ENV === "production") {
    const webhookUrl = `${process.env.WEBHOOK_DOMAIN}/api/telegram-webhook`;
    console.log(`Setting webhook to ${webhookUrl}`);
    await bot.telegram.setWebhook(webhookUrl);
  } else {
    console.log("Starting bot in polling mode");
    bot.launch();
  }
};

setupBot().catch(console.error);

module.exports = { bot, sendTelegramMessage };
