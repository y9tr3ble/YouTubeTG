import ytdl from '@distube/ytdl-core';
import fs from 'fs';
import path from 'path';

export const videoDownloader = async (link: string): Promise<string> => {
    const filePath = path.resolve(__dirname, 'video.mp4');
    const stream = ytdl(link);

    return new Promise((resolve, reject) => {
        const fileStream = fs.createWriteStream(filePath);
        stream.pipe(fileStream);

        fileStream.on('finish', () => resolve(filePath));
        fileStream.on('error', (error) => reject(error));
    });
};
