const TelegramBot = require("node-telegram-bot-api");
require("dotenv").config();
const express = require("express");
const cors = require("cors");

const token = process.env.TELEGRAM_BOT_TOKEN;
const webAppUrl = "https://master--stalwart-phoenix-926558.netlify.app/";

const bot = new TelegramBot(token, { polling: true });

const app = express();

app.use(express.json());
app.use(cors());

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (text === "/start") {
    await bot.sendMessage(
      chatId,
      "Приветик от marydressbot, вы можете сделать заказ по кнопочке ниже:",
      {
        reply_markup: {
          keyboard: [[{ text: "Сделать заказ", web_app: { url: webAppUrl } }]],
        },
      }
    );
  }

  if (msg?.web_app_data?.data) {
    try {
      const data = JSON.parse(msg?.web_app_data?.data);

      await bot.sendMessage(
        chatId,
        `Спасибо за заказ на сумму ${data?.totalPrice} zl, ${data?.inputs?.customerName}!`
      );

      setTimeout(async () => {
        await bot.sendMessage(
          chatId,
          "Мы свяжемся с вами для подтверждения заказа по номеру: " +
            data?.inputs?.telephone
        );
      }, 1000);
    } catch (e) {
      console.log(e);
    }
  }
});

const PORT = 8080;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
