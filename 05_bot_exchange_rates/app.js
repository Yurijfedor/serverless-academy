const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");
const NodeCache = require("node-cache");
const { readFileSync, existsSync } = require("fs");
const envFilePath = "./.env";

if (!existsSync(envFilePath)) {
  console.error(`.env file not found. Make sure it exists.`);
  process.exit(1);
}

try {
  const envFile = readFileSync(envFilePath, "utf8");
  const envLines = envFile.split("\n");
  envLines.forEach((line) => {
    const parts = line.split("=");
    if (parts.length === 2) {
      const [key, value] = parts;
      process.env[key] = value.trim();
    } else {
      console.error(`Skipping invalid line: ${line}`);
    }
  });

  if (
    !process.env.TELEGRAM_BOT_TOKEN ||
    process.env.TELEGRAM_BOT_TOKEN.trim() === "" ||
    !process.env.OPENWEATHER_API_KEY ||
    process.env.OPENWEATHER_API_KEY.trim() === ""
  ) {
    console.error(
      "Error: TELEGRAM_BOT_TOKEN or OPENWEATHER_API_KEY is missing or empty in .env"
    );
    process.exit(1);
  }
} catch (err) {
  console.error("Error reading .env:", err);
}

const token = process.env.TELEGRAM_BOT_TOKEN.trim();
const privatBankAPI =
  "https://api.privatbank.ua/p24api/pubinfo?json&exchange&coursid=5";
const monoBankAPI = "https://api.monobank.ua/bank/currency";
const weatherAPIKey = process.env.OPENWEATHER_API_KEY.trim();

const bot = new TelegramBot(token, { polling: true });
const cache = new NodeCache({ stdTTL: 60 });
let city = "";

bot.onText(/Previous menu|\/start/, (msg) => {
  const message =
    msg.text.toString().toLowerCase() === "/start"
      ? "Welcome! \nSelect an option:"
      : "Select an option:";

  bot.sendMessage(msg.chat.id, message, {
    reply_markup: {
      resize_keyboard: true,
      keyboard: [["Forecast in Vinnytsia or another city"], ["Exchange Rates"]],
    },
  });
});

bot.onText(/Forecast in Vinnytsia or another city/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    "Select a forecast in Vinnytsia or enter the name of another city:",
    {
      reply_markup: {
        resize_keyboard: true,
        keyboard: [["forecast in Vinnytsia"], ["Previous menu"]],
      },
    }
  );
});

bot.onText(/forecast in Vinnytsia/, (msg) => {
  city = "vinnytsia";
  bot.sendMessage(msg.chat.id, "Select the forecast interval:", {
    reply_markup: {
      resize_keyboard: true,
      keyboard: [
        ["at intervals of 3 hours", "at intervals of 6 hours"],
        ["Previous menu"],
      ],
    },
  });
});

bot.onText(/^[a-zA-Zа-яА-Я]+$/u, (msg) => {
  city = msg.text.toString().toLowerCase().trim();
  bot.sendMessage(msg.chat.id, "Select the forecast interval:", {
    reply_markup: {
      resize_keyboard: true,
      keyboard: [
        ["at intervals of 3 hours", "at intervals of 6 hours"],
        ["Previous menu"],
      ],
    },
  });
});

bot.onText(/at intervals of (\d+) hours/, async (msg) => {
  try {
    let forecast;
    const response = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${weatherAPIKey}&units=metric`
    );

    const data = response.data.list;
    if (msg.text.toString().toLowerCase().includes(3)) {
      forecast = data;
    } else {
      forecast = data.filter((_, index) => index % 2 === 0);
    }

    let forecastText = "";
    forecast.forEach((data) => {
      const date = new Date(data.dt * 1000).toDateString();
      const time = new Date(data.dt * 1000).toTimeString().split(" ")[0];
      const temperature = data.main.temp;
      const weatherDescription = data.weather[0].description;

      forecastText += `Date: ${date}\nTime: ${time}\nTemperature: ${temperature}°C\nWeather: ${weatherDescription}\n\n`;
    });

    bot.sendMessage(
      msg.chat.id,
      `Weather forecast in Vinnytsia:\n${forecastText}`
    );
  } catch (error) {
    bot.sendMessage(msg.chat.id, "Error getting weather forecast.");
  }
});

bot.onText(/Exchange Rates/, (msg) => {
  bot.sendMessage(msg.chat.id, "Select a currency:", {
    reply_markup: {
      resize_keyboard: true,
      keyboard: [["USD Exchange Rate", "EUR Exchange Rate"], ["Previous menu"]],
    },
  });
});

bot.onText(/USD Exchange Rate/, async (msg) => {
  const cachedData = cache.get("usd_exchange_rate");

  if (cachedData) {
    bot.sendMessage(
      msg.chat.id,
      `USD Exchange Rate:\nbuy: ${cachedData.buy}\nsell: ${cachedData.sale}`
    );
  } else {
    try {
      const response = await axios.get(privatBankAPI);
      const usdRate = response.data.find((item) => item.ccy === "USD");
      if (usdRate) {
        cache.set("usd_exchange_rate", usdRate);
        bot.sendMessage(
          msg.chat.id,
          `USD Exchange Rate:\nbuy: ${usdRate.buy}\nsell: ${usdRate.sale}`
        );
      } else {
        bot.sendMessage(msg.chat.id, "Unable to fetch USD Exchange Rate.");
      }
    } catch (error) {
      bot.sendMessage(msg.chat.id, "Error fetching USD Exchange Rate.");
    }
  }
});

bot.onText(/EUR Exchange Rate/, async (msg) => {
  const cachedData = cache.get("eur_exchange_rate");

  if (cachedData) {
    bot.sendMessage(
      msg.chat.id,
      `EUR Exchange Rate:\nbuy: ${cachedData.rateBuy}\nsell: ${cachedData.rateSell}`
    );
  } else {
    try {
      const response = await axios.get(monoBankAPI);
      const eurRate = response.data.find(
        (item) => item.currencyCodeA === 978 && item.currencyCodeB === 980
      );
      if (eurRate) {
        cache.set("eur_exchange_rate", eurRate);
        bot.sendMessage(
          msg.chat.id,
          `EUR Exchange Rate:\nbuy: ${eurRate.rateBuy}\nsell: ${eurRate.rateSell}`
        );
      } else {
        bot.sendMessage(msg.chat.id, "Unable to fetch EUR Exchange Rate.");
      }
    } catch (error) {
      bot.sendMessage(msg.chat.id, "Error fetching EUR Exchange Rate.");
    }
  }
});
