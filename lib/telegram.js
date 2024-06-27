const { Telegraf } = require("telegraf");

const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
if (!TELEGRAM_BOT_TOKEN) {
  throw new Error("TELEGRAM_BOT_TOKEN is not set.");
}

const bot = new Telegraf(TELEGRAM_BOT_TOKEN);
let chatIds = new Set(); // Store chat IDs in memory
console.log(chatIds);

// Middleware to collect chat IDs
bot.use((ctx, next) => {
  if (
    ctx.chat &&
    (ctx.chat.type === "group" || ctx.chat.type === "supergroup")
  ) {
    chatIds.add(ctx.chat.id.toString());
    console.log(`Added chat ID: ${ctx.chat.id}`);
  }
  return next();
});

// Function to send messages to all stored chat IDs
const sendTelegramMessage = async (message) => {
  for (const chatId of chatIds) {
    try {
      await bot.telegram.sendMessage(chatId, message);
      console.log(`Message sent to chat ID: ${chatId}`);
    } catch (error) {
      console.error(`Failed to send message to chat ID: ${chatId}`, error);
    }
  }
};

module.exports = { bot, sendTelegramMessage };
