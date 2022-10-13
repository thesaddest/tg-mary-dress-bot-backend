const TelegramBot = require("node-telegram-bot-api");
require("dotenv").config();

const token = process.env.TELEGRAM_BOT_TOKEN;
const webAppUrl = "https://master--stalwart-phoenix-926558.netlify.app/";

const bot = new TelegramBot(token, { polling: true });

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
