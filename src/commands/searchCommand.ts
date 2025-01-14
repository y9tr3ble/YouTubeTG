import { Context } from "grammy";
import { searchVideos } from '../services/searchVideo';
import { YoutubeResult } from '../interfaces/youtube';
import { InlineKeyboard } from 'grammy';

const videoLinks: { [key: string]: string } = {};

export const searchCommand = async (ctx: Context) => {
    // Get everything after the /search command
    const query = ctx.message?.text?.split('/search ')[1]?.trim();
    
    if (!query) {
        await ctx.reply("Please provide a search query. Example: /search song name");
        return;
    }

    try {
        const result = await searchVideos(query);

        result.forEach((video: YoutubeResult, index: number) => {
            const videoTitle = video.title;
            const channelName = video.channelTitle;
            const videoLink = video.link;

            // Сохраняем ссылку в памяти с уникальным идентификатором
            const uniqueId = `video_${index}`;
            videoLinks[uniqueId] = videoLink;

            const inlineKeyboard = new InlineKeyboard()
                .text("Скачать MP3🎵", `mp3:${uniqueId}`)
                .text("Скачать MP4🎥", `mp4:${uniqueId}`);

            ctx.reply(`Video: ${videoTitle}\nChannel: ${channelName}`, {
                reply_markup: inlineKeyboard,
            });
        });
    } catch (error) {
        console.error('Error searching video:', error);
        await ctx.reply('An error occurred while searching for videos.');
    }
};

export { videoLinks };
