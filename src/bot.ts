import { Bot, InputFile } from "grammy";
import { botToken } from './config';
import { searchCommand, videoLinks } from './commands/searchCommand';
import { downloadAudio, downloadVideo, mergeAudioVideo } from "./ytDownloader/ytDownloader";
import fs from "fs";
import { downloadMP3 } from './services/downloadMP3';
import { I18nService } from './i18n/i18n.service';

const bot = new Bot(botToken);
const i18n = I18nService.getInstance();

bot.command("search", searchCommand);

bot.callbackQuery(/mp4:.+/, async (ctx) => {
    try {
        await ctx.answerCallbackQuery({
            text: i18n.t(ctx, 'download.start'),
        });

        const uniqueId = ctx.callbackQuery.data.split(":")[1];
        const videoLink = videoLinks[uniqueId];

        if (!videoLink) {
            throw new Error(i18n.t(ctx, 'download.videoNotFound'));
        }

        // Download both audio and video
        const [audioPath, videoPath] = await Promise.all([
            downloadAudio(videoLink),
            downloadVideo(videoLink)
        ]);

        // Merge audio and video
        const finalVideoPath = await mergeAudioVideo(audioPath, videoPath);

        // Send the final video
        await ctx.api.sendVideo(ctx.chat?.id!, new InputFile(fs.createReadStream(finalVideoPath)));

        // Clean up the final video file
        fs.unlinkSync(finalVideoPath);
    } catch (error) {
        console.error("Error:", error);
        await ctx.reply(i18n.t(ctx, 'download.error'));
    }
});

bot.callbackQuery(/mp3:(.+)/, async (ctx) => {
    try {
        const videoId = ctx.match[1];
        const videoUrl = videoLinks[videoId];
        
        if (!videoUrl) {
            await ctx.answerCallbackQuery({
                text: i18n.t(ctx, 'download.videoNotFound'),
                show_alert: true
            });
            return;
        }

        await ctx.answerCallbackQuery({
            text: i18n.t(ctx, 'download.mp3Started'),
        });

        const filePath = await downloadMP3(videoUrl);
        await ctx.reply(i18n.t(ctx, 'download.mp3Uploading'));
        await ctx.replyWithAudio(new InputFile(filePath));

        // Clean up the file after sending
        fs.unlinkSync(filePath);
        
    } catch (error) {
        console.error('Error in MP3 download:', error);
        await ctx.answerCallbackQuery({
            text: i18n.t(ctx, 'download.mp3Error'),
            show_alert: true
        });
    }
});

bot.start();
