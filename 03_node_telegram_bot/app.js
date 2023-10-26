const { program } = require("commander");
const TelegramBot = require("node-telegram-bot-api");
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
    !process.env.YOUR_CHAT_ID ||
    process.env.YOUR_CHAT_ID.trim() === ""
  ) {
    console.error(
      "Error: TELEGRAM_BOT_TOKEN or YOUR_CHAT_ID is missing or empty in .env"
    );
    process.exit(1);
  }
} catch (err) {
  console.error("Error reading .env:", err);
}

const token = process.env.TELEGRAM_BOT_TOKEN;

const bot = new TelegramBot(token, {
  polling: true,
});
program
  .command("m <message>")
  .description("Send a text message to a Telegram bot")
  .action((message) => {
    bot
      .sendMessage(process.env.YOUR_CHAT_ID, message)
      .then(() => {
        process.exit(0);
      })
      .catch((error) => {
        console.error("Error sending message:", error.message);
        process.exit(1);
      });
  });

program
  .command("p <path>")
  .description("Send photo to Telegram bot")
  .action((path) => {
    const photo = readFileSync(path);
    bot
      .sendPhoto(process.env.YOUR_CHAT_ID, photo)
      .then(() => {
        console.log("You have successfully sent a photo to your bot");
        process.exit(0);
      })
      .catch((error) => {
        console.error("Error sending photo:", error.message);
        process.exit(1);
      });
  });

program.parse(process.argv);
