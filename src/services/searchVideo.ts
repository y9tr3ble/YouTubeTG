import { YoutubeResult } from '../interfaces/youtube';
import { searchVideo } from '../api';

export const searchVideos = async (query: string): Promise<YoutubeResult[]> => {
    try {
        const result = await searchVideo(query);
        if (Array.isArray(result)) {
            return result;
        } else {
            throw new Error('No results found');
        }
    } catch (error: unknown) {
        if (error instanceof Error) {
            throw new Error(`Error searching videos: ${error.message}`);
        } else {
            throw new Error('An unknown error occurred');
        }
    }
};
