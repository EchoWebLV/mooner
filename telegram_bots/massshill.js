const TelegramBot = require("node-telegram-bot-api");
const persist = require("node-persist");

const token = "7023813809:AAHugivIbxPiP_8DPS-sS2dOgO0gic1rEcA";
const bot = new TelegramBot(token, { polling: true });

// Initialize storage
persist.init({
  dir: "group_storage",
  stringify: JSON.stringify,
  parse: JSON.parse,
  encoding: "utf8",
  logging: false,
  ttl: false,
  forgiveParseErrors: false,
});

// Load group chats from storage
let groupChats = new Set();

async function loadGroupChats() {
  const groups = await persist.getItem("groups");
  if (groups) {
    groupChats = new Set(groups);
  }
}

loadGroupChats();

async function saveGroupChats() {
  await persist.setItem("groups", Array.from(groupChats));
}

// Listen for any kind of message
bot.on("message", (msg) => {
  const chatId = msg.chat.id;

  // Check if the message is from a group
  if (msg.chat.type === "group" || msg.chat.type === "supergroup") {
    groupChats.add(chatId);
    saveGroupChats();
  }

  // If the message is "hello" and it's a direct message to the bot
  if (msg.chat.type === "private" && msg.text.toLowerCase() === "hello") {
    // Send "hello" to all groups
    groupChats.forEach((groupId) => {
      bot.sendMessage(groupId, "  ");
    });
  }
});

// Track new groups the bot is added to
bot.on("new_chat_members", (msg) => {
  const chatId = msg.chat.id;
  groupChats.add(chatId);
  saveGroupChats();
  bot.sendMessage(chatId, "hello");
});

// Log when the bot starts
bot.on("polling_error", (error) => {
  console.log(error);
});

bot.on("webhook_error", (error) => {
  console.log(error);
});

bot.on("error", (error) => {
  console.log(error);
});
