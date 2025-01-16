import { Context } from "grammy";
import { searchVideos } from '../services/searchVideo';
import { YoutubeResult } from '../interfaces/youtube';
import { InlineKeyboard } from 'grammy';
import { I18nService } from '../i18n/i18n.service';

const videoLinks: { [key: string]: string } = {};
const i18n = I18nService.getInstance();

export const searchCommand = async (ctx: Context) => {
    const query = ctx.message?.text?.split('/search ')[1]?.trim();
    
    if (!query) {
        await ctx.reply(await i18n.t(ctx, 'search.noQuery'));
        return;
    }

    try {
        const result = await searchVideos(query);

        for (const video of result) {
            const uniqueId = `video_${video.id}`;
            videoLinks[uniqueId] = video.link;

            const inlineKeyboard = new InlineKeyboard()
                .text(await i18n.t(ctx, 'buttons.downloadMP3'), `mp3:${uniqueId}`)
                .text(await i18n.t(ctx, 'buttons.downloadMP4'), `mp4:${uniqueId}`);

            await ctx.reply(await i18n.t(ctx, 'video.info', {
                title: video.title,
                channel: video.channelTitle
            }), {
                reply_markup: inlineKeyboard,
            });
        }
    } catch (error) {
        console.error('Error searching video:', error);
        await ctx.reply(await i18n.t(ctx, 'search.error'));
    }
};

export { videoLinks };
