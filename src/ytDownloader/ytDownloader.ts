import ytdl from '@distube/ytdl-core';
import fs from 'fs';
import path from 'path';
import ffmpeg from 'fluent-ffmpeg';

export const downloadAudio = async (link: string): Promise<string> => {
    const filePath = path.resolve(__dirname, 'audio.mp3');
    const stream = ytdl(link, { 
        quality: 'highestaudio',
        filter: 'audioonly' 
    });

    return new Promise((resolve, reject) => {
        const fileStream = fs.createWriteStream(filePath);
        stream.pipe(fileStream);
        fileStream.on('finish', () => resolve(filePath));
        fileStream.on('error', (error) => reject(error));
    });
};

export const downloadVideo = async (link: string): Promise<string> => {
    const filePath = path.resolve(__dirname, 'video_only.mp4');
    const stream = ytdl(link, { 
        quality: 'highestvideo',
        filter: 'videoonly'
    });

    return new Promise((resolve, reject) => {
        const fileStream = fs.createWriteStream(filePath);
        stream.pipe(fileStream);
        fileStream.on('finish', () => resolve(filePath));
        fileStream.on('error', (error) => reject(error));
    });
};

export const mergeAudioVideo = async (audioPath: string, videoPath: string): Promise<string> => {
    const outputPath = path.resolve(__dirname, 'final_video.mp4');
    
    return new Promise((resolve, reject) => {
        ffmpeg()
            .input(videoPath)
            .input(audioPath)
            .outputOptions(['-c:v copy', '-c:a aac'])
            .save(outputPath)
            .on('end', () => {
                // Clean up temporary files
                fs.unlinkSync(audioPath);
                fs.unlinkSync(videoPath);
                resolve(outputPath);
            })
            .on('error', (error) => reject(error));
    });
};
