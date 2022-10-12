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
          keyboard: [
            [{ text: "Заполнить форму", web_app: { url: webAppUrl + "form" } }],
          ],
        },
      }
    );

    await bot.sendMessage(
      chatId,
      "Приветик от marydressbot, вы можете сделать заказ по кнопочке ниже:",
      {
        reply_markup: {
          inline_keyboard: [
            [{ text: "Сделать заказ", web_app: { url: webAppUrl } }],
          ],
        },
      }
    );
  }

  if (msg?.web_app_data?.data) {
    try {
      const data = JSON.parse(msg?.web_app_data?.data);

      await bot.sendMessage(
        chatId,
        `Спасибо за обратную связь, ${data?.name} ${data?.surName}!`
      );

      setTimeout(async () => {
        await bot.sendMessage(
          chatId,
          "Мы свяжемся с вами для подтверждения заказа по номеру: " +
            data?.telephone
        );
      }, 1000);
    } catch (e) {
      console.log(e);
    }
  }
});
app.post("/web-data", async (req, res) => {
  const { queryId, products, totalPrice } = req.body;
  try {
    await bot.answerWebAppQuery(queryId, {
      type: "article",
      id: queryId,
      title: "Успешная покупка!",
      input_message_content: {
        message_text: `Спасибо за покупку! Вы преобрели товар на сумму + ${totalPrice} zl`,
      },
    });
    return res.status(200).json({});
  } catch (e) {
    await bot.answerWebAppQuery(queryId, {
      type: "article",
      id: queryId,
      title: "Не удалось преобрести товар",
      input_message_content: {
        message_text: "Не удалось преобрести товар",
      },
    });
    return res.status(500).json({});
  }
});
const PORT = 8000;
app.listen(() => console.log(`Server started on ${PORT}`));
