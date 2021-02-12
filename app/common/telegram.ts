import TelegramBot from 'node-telegram-bot-api'

export const telegramBot = new TelegramBot(process.env.TELEGRAM_KEY)