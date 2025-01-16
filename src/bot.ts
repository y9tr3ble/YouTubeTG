import { Bot, InputFile, InlineKeyboard } from "grammy";
import { botToken } from './config';
import { searchCommand, videoLinks } from './commands/searchCommand';
import { downloadAudio, downloadVideo, mergeAudioVideo } from "./ytDownloader/ytDownloader";
import fs from "fs";
import { searchVideos } from './services/searchVideo';
import { downloadMP3 } from './services/downloadMP3';
import { I18nService } from './i18n/i18n.service';
import { SettingsService } from './services/settings.service';
import { InlineQueryResultArticle, InlineQueryResultsButton } from "grammy/types";

const bot = new Bot(botToken);
const i18n = I18nService.getInstance();
const settingsService = SettingsService.getInstance();

bot.command("search", searchCommand);

bot.command("settings", async (ctx) => {
    if (!ctx.from) return;

    const settings = await settingsService.getUserSettings(ctx.from.id);
    const keyboard = new InlineKeyboard()
        .text(
            settings.downloadType === 'mp3' ? '✅ MP3 🎵' : 'MP3 🎵',
            'setting:mp3'
        )
        .text(
            settings.downloadType === 'mp4' ? '✅ MP4 🎥' : 'MP4 🎥',
            'setting:mp4'
        )
        .row()
        .text(
            settings.language === 'en' ? '✅ English 🇬🇧' : 'English 🇬🇧',
            'lang:en'
        )
        .text(
            settings.language === 'ru' ? '✅ Русский 🇷🇺' : 'Русский 🇷🇺',
            'lang:ru'
        );

    await ctx.reply(
        await i18n.t(ctx, 'settings.currentSettings', {
            language: settings.language === 'ru' ? 'Русский' : 'English',
            downloadType: settings.downloadType.toUpperCase()
        }),
        { reply_markup: keyboard }
    );
});

bot.callbackQuery(/setting:(mp3|mp4)/, async (ctx) => {
    if (!ctx.from) return;

    const downloadType = ctx.match[1] as 'mp3' | 'mp4';
    await settingsService.updateDownloadType(ctx.from.id, downloadType);
    await ctx.answerCallbackQuery({
        text: await i18n.t(ctx, 'settings.downloadTypeChanged', { type: downloadType.toUpperCase() })
    });
    
    const settings = await settingsService.getUserSettings(ctx.from.id);
    const keyboard = new InlineKeyboard()
        .text(
            downloadType === 'mp3' ? '✅ MP3 🎵' : 'MP3 🎵',
            'setting:mp3'
        )
        .text(
            downloadType === 'mp4' ? '✅ MP4 🎥' : 'MP4 🎥',
            'setting:mp4'
        )
        .row()
        .text(
            settings.language === 'en' ? '✅ English 🇬🇧' : 'English 🇬🇧',
            'lang:en'
        )
        .text(
            settings.language === 'ru' ? '✅ Русский 🇷🇺' : 'Русский 🇷🇺',
            'lang:ru'
        );

    await ctx.editMessageText(
        await i18n.t(ctx, 'settings.currentSettings', {
            language: settings.language === 'ru' ? 'Русский' : 'English',
            downloadType: settings.downloadType.toUpperCase()
        }),
        { reply_markup: keyboard }
    );
});

bot.callbackQuery(/lang:(en|ru)/, async (ctx) => {
    if (!ctx.from) return;

    const language = ctx.match[1] as 'en' | 'ru';
    
    // First update the language
    await settingsService.updateLanguage(ctx.from.id, language);
    
    // Then get updated settings
    const settings = await settingsService.getUserSettings(ctx.from.id);
    
    // Answer callback query with new language settings
    await ctx.answerCallbackQuery({
        text: language === 'ru' ? 'Язык изменён на Русский' : 'Language changed to English'
    });

    const keyboard = new InlineKeyboard()
        .text(
            settings.downloadType === 'mp3' ? '✅ MP3 🎵' : 'MP3 🎵',
            'setting:mp3'
        )
        .text(
            settings.downloadType === 'mp4' ? '✅ MP4 🎥' : 'MP4 🎥',
            'setting:mp4'
        )
        .row()
        .text(
            settings.language === 'en' ? '✅ English 🇬🇧' : 'English 🇬🇧',
            'lang:en'
        )
        .text(
            settings.language === 'ru' ? '✅ Русский 🇷🇺' : 'Русский 🇷🇺',
            'lang:ru'
        );

    // Now update the message with new language
    await ctx.editMessageText(
        await i18n.t(ctx, 'settings.currentSettings', {
            language: settings.language === 'ru' ? 'Русский' : 'English',
            downloadType: settings.downloadType.toUpperCase()
        }),
        { reply_markup: keyboard }
    );

    // Send language change notification with new language
    await ctx.reply(await i18n.t(ctx, 'settings.languageChanged'));
});

bot.callbackQuery(/mp4:.+/, async (ctx) => {
    try {
        await ctx.answerCallbackQuery({
            text: await i18n.t(ctx, 'download.start'),
        });

        const uniqueId = ctx.callbackQuery.data.split(":")[1];
        const videoLink = videoLinks[uniqueId];

        if (!videoLink) {
            throw new Error(await i18n.t(ctx, 'download.videoNotFound'));
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
        await ctx.reply(await i18n.t(ctx, 'download.error'));
    }
});

bot.callbackQuery(/mp3:(.+)/, async (ctx) => {
    try {
        const videoId = ctx.match[1];
        const videoUrl = videoLinks[videoId];
        
        if (!videoUrl) {
            await ctx.answerCallbackQuery({
                text: await i18n.t(ctx, 'download.videoNotFound'),
                show_alert: true
            });
            return;
        }

        await ctx.answerCallbackQuery({
            text: await i18n.t(ctx, 'download.mp3Started'),
        });

        const filePath = await downloadMP3(videoUrl);
        await ctx.reply(await i18n.t(ctx, 'download.mp3Uploading'));
        await ctx.replyWithAudio(new InputFile(filePath));

        // Clean up the file after sending
        fs.unlinkSync(filePath);
        
    } catch (error) {
        console.error('Error in MP3 download:', error);
        await ctx.answerCallbackQuery({
            text: await i18n.t(ctx, 'download.mp3Error'),
            show_alert: true
        });
    }
});

bot.on("inline_query", async (ctx) => {
    const query = ctx.inlineQuery.query;
    
    if (!query) {
        return await ctx.answerInlineQuery([]);
    }

    try {
        const videos = await searchVideos(query);
        const results = await Promise.all(videos.map(async (video, index) => ({
            type: "article",
            id: `video_${index}`,
            title: video.title,
            description: video.description || "",
            thumbnail_url: video.thumbnails.default.url,
            input_message_content: {
                message_text: await i18n.t(ctx, 'video.info', {
                    title: video.title,
                    channel: video.channelTitle
                })
            },
            reply_markup: new InlineKeyboard()
                .text(await i18n.t(ctx, 'buttons.downloadMP3'), `mp3:${video.id}`)
                .text(await i18n.t(ctx, 'buttons.downloadMP4'), `mp4:${video.id}`)
        })));

        const button: InlineQueryResultsButton = {
            text: "Change default download type",
            start_parameter: "settings"
        };

        await ctx.answerInlineQuery(results as InlineQueryResultArticle[], {
            cache_time: 300,
            button
        });
    } catch (error) {
        console.error('Inline query error:', error);
        await ctx.answerInlineQuery([]);
    }
});

bot.catch((err) => {
    console.error('Bot error:', err);
});

bot.start();
