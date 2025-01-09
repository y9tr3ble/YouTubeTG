import { Bot } from "grammy";
import { botToken } from './config'

const bot = new Bot(botToken);

bot.start();