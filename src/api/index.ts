import youtubeSearch from "youtube-search";
import { options } from "./options";
import { YoutubeResult } from "../interfaces/youtube";

export const searchVideo = (query: string): Promise<YoutubeResult[]> => {
    return new Promise((resolve, reject) => {
        youtubeSearch(query, options, (err, results) => {
            if (err) {
                reject(err);
            } else {
                resolve(results as YoutubeResult[]);
            }
        });
    });
};
