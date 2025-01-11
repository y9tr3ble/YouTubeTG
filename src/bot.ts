import { Bot } from "grammy";
import { botToken } from './config'

const bot = new Bot(botToken);

bot.command(
    "start",
    (ctx) => ctx.reply("Test"),
);

bot.start();