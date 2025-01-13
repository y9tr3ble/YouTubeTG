import { Bot } from "grammy";
import { botToken } from './config';
import { searchCommand } from './commands/searchCommand';

const bot = new Bot(botToken);

bot.command("search", searchCommand);



bot.start();
