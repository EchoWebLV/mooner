const TelegramBot = require("node-telegram-bot-api");
const token = process.env.TELEGRAM_API_TOKEN;
const bot = new TelegramBot(token, { polling: true });

let groupChats = new Set();

// Listen for any kind of message
bot.on("message", (msg) => {
  const chatId = msg.chat.id;

  // Check if the message is from a group
  if (msg.chat.type === "group" || msg.chat.type === "supergroup") {
    groupChats.add(chatId);
  }

  // If the message is "hello", send "hello" to all groups
  if (msg.text.toLowerCase() === "hello") {
    bot.sendMessage(chatId, "hello");
  }
});

// Send "hello" to all groups when the bot is added to a new group
bot.on("new_chat_members", (msg) => {
  const chatId = msg.chat.id;
  groupChats.add(chatId);
  bot.sendMessage(chatId, "hello");
});

// Periodically send "hello" to all groups
setInterval(() => {
  groupChats.forEach((chatId) => {
    bot.sendMessage(chatId, "hello");
  });
}, 60000); // Adjust the interval as needed
