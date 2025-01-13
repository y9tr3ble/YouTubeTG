import { Context } from "grammy";
import { searchVideos } from '../services/searchVideo';
import { YoutubeResult } from '../interfaces/youtube';
import { InlineKeyboard } from 'grammy';

export const searchCommand = async (ctx: Context) => {
    const query = "deadp47";
    try {
        const result = await searchVideos(query);

        result.forEach((video: YoutubeResult) => {
            const videoTitle = video.title;
            const channelName = video.channelTitle;
            const link = video.link
            console.log(`Video Title: ${videoTitle}, Channel: ${channelName}`);
            console.log(`Video URL: ${video.link}`)

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
};
