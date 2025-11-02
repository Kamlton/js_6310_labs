import 'dotenv/config';
import TelegramBot from 'node-telegram-bot-api';
import { handleMessage, userStates } from './bot.js';

const token = process.env.TELEGRAM_BOT_TOKEN;

if (!token) {
  console.error('TELEGRAM_BOT_TOKEN is required');
  process.exit(1);
}

const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  const welcomeMessage = `
🎯 Добро пожаловать в AdPro Bot!

Команды:
/create_campaign - Создать рекламную кампанию
/analytics - Получить аналитику

Начните с /create_campaign 🚀
  `;
  bot.sendMessage(chatId, welcomeMessage.trim());
  userStates.set(chatId, { state: 'idle' });
});

bot.onText(/\/create_campaign/, (msg) => {
  handleMessage(bot, msg, 'create_campaign');
});

bot.onText(/\/analytics/, (msg) => {
  handleMessage(bot, msg, 'analytics');
});

bot.on('message', (msg) => {
  if (!msg.text?.startsWith('/')) {
    handleMessage(bot, msg);
  }
});

console.log('AdPro Bot is running...');