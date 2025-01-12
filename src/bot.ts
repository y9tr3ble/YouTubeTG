import { Bot, InlineKeyboard } from "grammy";
import { botToken } from './config';
import { searchVideos } from './services/searchVideo';
import { YoutubeResult } from './interfaces/youtube';

const bot = new Bot(botToken);

bot.command("search", async (ctx) => {
    const query = "deadp47";
    try {
        const result = await searchVideos(query);

        result.forEach((video: YoutubeResult) => {
            const videoTitle = video.title;
            const channelName = video.channelTitle;
            console.log(`Video Title: ${videoTitle}, Channel: ${channelName}`);
            const inlineKeyboard = new InlineKeyboard()
                .text("Скачать MP3🎵", "mp3")
                .text("Скачать MP4🎥", "mp4");
            ctx.reply(`Video: ${videoTitle}\nChannel: ${channelName}`, {
                reply_markup: inlineKeyboard,
            });
        });
    } catch (error) {
        console.error('Error searching video:', error);
        await ctx.reply('An error occurred while searching for videos.');
    }
});

bot.start();
