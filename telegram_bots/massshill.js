const TelegramBot = require("node-telegram-bot-api");
const token = "7023813809:AAHugivIbxPiP_8DPS-sS2dOgO0gic1rEcA";
const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, "Welcome!");
});

bot.on("message", (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, "Received your message");
});
