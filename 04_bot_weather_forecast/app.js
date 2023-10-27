const TelegramBot = require("node-telegram-bot-api");
const axios = require("axios");
const { readFileSync, existsSync } = require("fs");

axios.defaults.baseURL = "https://api.openweathermap.org/data/2.5";

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
const weatherAPIKey = process.env.OPENWEATHER_API_KEY.trim();

const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(msg.chat.id, "Welcome! \nSelect an option:", {
    reply_markup: {
      resize_keyboard: true,
      keyboard: [["Forecast in Vinnytsia"]],
    },
  });
});

bot.onText(/Forecast in Vinnytsia/, (msg) => {
  bot.sendMessage(msg.chat.id, "Select the forecast interval:", {
    reply_markup: {
      resize_keyboard: true,
      keyboard: [["at intervals of 3 hours", "at intervals of 6 hours"]],
    },
  });
});

bot.onText(/at intervals of (\d+) hours/, async (msg) => {
  try {
    let forecast;
    const response = await axios.get(
      `/forecast?q=Vinnytsia&appid=${weatherAPIKey}&units=metric`
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
