const TelegramBot = require("node-telegram-bot-api");
require("dotenv").config();

const token = process.env.TELEGRAM_BOT_TOKEN;
const webAppUrl = "https://google.com";

const bot = new TelegramBot(token, { polling: true });

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (text === "/start") {
    // await bot.sendMessage(chatId, "Приветик", {
    //   reply_markup: {
    //     keyboard: [[{ text: "Нажми сюда", web_app: { url: webAppUrl } }]],
    //   },
    // });
    await bot.sendMessage(chatId, "Received your message", {
      reply_markup: {
        inline_keyboard: [
          [{ text: "Сделать заказ", web_app: { url: webAppUrl } }],
        ],
      },
    });
  }
});
