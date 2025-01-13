import { Bot, InputFile } from "grammy";
import { botToken } from './config';
import { searchCommand, videoLinks } from './commands/searchCommand';
import { videoDownloader } from "./ytDownloader/ytDownloader";
import fs from "fs";

const bot = new Bot(botToken);

bot.command("search", searchCommand);

bot.callbackQuery(/mp4:.+/, async (ctx) => {
    try {
        await ctx.answerCallbackQuery({
            text: "Загрузка началась. Пожалуйста, подождите.",
        });

        const uniqueId = ctx.callbackQuery.data.split(":")[1];
        const videoLink = videoLinks[uniqueId];

        if (!videoLink) {
            throw new Error("Video link not found for the given identifier");
        }

        const videoPath = await videoDownloader(videoLink);

        await ctx.api.sendVideo(ctx.chat?.id!, new InputFile(fs.createReadStream(videoPath)));

        fs.unlinkSync(videoPath);
    } catch (error) {
        console.error("Ошибка при выполнении функции:", error);

        await ctx.reply("Произошла ошибка при загрузке видео.");
    }
});


bot.start();
