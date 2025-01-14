import ytdl from '@distube/ytdl-core';
import fs from 'fs';
import path from 'path';

export const downloadMP3 = async (videoUrl: string): Promise<string> => {
    try {
        const videoInfo = await ytdl.getInfo(videoUrl);
        const videoTitle = videoInfo.videoDetails.title.replace(/[^\w\s]/gi, '');
        const outputPath = path.join(__dirname, '..', '..', 'downloads', `${videoTitle}.mp3`);

        // Ensure downloads directory exists
        const downloadsDir = path.join(__dirname, '..', '..', 'downloads');
        if (!fs.existsSync(downloadsDir)) {
            fs.mkdirSync(downloadsDir, { recursive: true });
        }

        return new Promise((resolve, reject) => {
            ytdl(videoUrl, {
                filter: 'audioonly',
                quality: 'highestaudio'
            })
            .pipe(fs.createWriteStream(outputPath))
            .on('finish', () => resolve(outputPath))
            .on('error', reject);
        });
    } catch (error) {
        throw new Error(`Error downloading MP3: ${error}`);
    }
};
