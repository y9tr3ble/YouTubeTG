import {Bot} from "grammy";
import {botToken} from './config'
import {searchVideo} from "./api";

const bot = new Bot(botToken);

import { YoutubeResult } from './interfaces/youtube';

bot.command("search", async (ctx) => {
    const query = "deadp47";
    try {
        const result = await searchVideo(query);

        if (Array.isArray(result)) {
            result.forEach((video: YoutubeResult) => {
                const videoTitle = video.title;
                const channelName = video.channelTitle;
                console.log(`Video Title: ${videoTitle}, Channel: ${channelName}`);
                ctx.reply(`Video: ${videoTitle}\nChannel: ${channelName}`);
            });
        } else {
            console.log('No results found');
            await ctx.reply('No videos found');
        }
    } catch (error) {
        console.error('Error searching video:', error);
        await ctx.reply('An error occurred while searching for videos.');
    }
});


bot.start();