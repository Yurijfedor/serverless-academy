# Telegram Bot: Weather Forecast and Exchange Rates

This Telegram bot provides users with weather forecasts for a specific city and exchange rates for USD and EUR. It leverages various APIs to deliver real-time data to users.

## Getting Started

To use this bot, you will need to create a `.env` file and provide your Telegram Bot Token and OpenWeather API Key as environment variables.

### Prerequisites

- Node.js
- npm
- Telegram Bot Token
- OpenWeather API Key

### Installation

1. Clone this repository.
2. Install dependencies with `npm install`.
3. Create a `.env` file with your API keys.
4. Start the bot with `npm start`.

## Usage

- /start or "Previous menu": Return to the main menu.
- "Forecast in Vinnytsia or another city": Choose between Vinnytsia and other cities for weather forecasts.
- "forecast in Vinnytsia" or "your city": Select the forecast interval (3 hours or 6 hours).
- "USD Exchange Rate" or "EUR Exchange Rate": Check exchange rates for USD or EUR.

## Acknowledgments

- [Telegram Bot API](https://core.telegram.org/bots/api)
- [OpenWeather API](https://openweathermap.org/api)
