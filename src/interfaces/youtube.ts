export interface YoutubeResult {
    id: string;
    link: string;
    kind: string;
    publishedAt: string;
    channelId: string;
    channelTitle: string;
    title: string;
    description: string;
    thumbnails: {
        default: { url: string };
        medium: { url: string };
        high: { url: string };
    };
}
