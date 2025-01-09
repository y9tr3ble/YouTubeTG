declare global {
    namespace NodeJS {
        interface ProcessEnv {
            BOT_TOKEN: string
            YOUTUBE_TOKEN: string
        }
    }
}

export {}