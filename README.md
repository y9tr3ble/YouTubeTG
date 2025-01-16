# YouTube Telegram Bot

A Telegram bot for downloading YouTube videos and audio with multi-language support and user preferences.

## Features

- 🔍 Search YouTube videos directly in Telegram
- 📥 Download videos in MP4 format
- 🎵 Download audio in MP3 format
- 🌐 Multi-language support (English and Russian)
- ⚙️ User preferences for default download type
- 🔎 Inline search support

## Installation

1. Clone the repository:
```bash
git clone https://github.com/yourusername/YouTubeTG.git
cd YouTubeTG
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file with:
```env
BOT_TOKEN=your_telegram_bot_token
YOUTUBE_API_KEY=your_youtube_api_key
DATABASE_URL=your_postgresql_database_url
```

4. Set up the database:
```bash
npx prisma generate
npx prisma db push
```

5. Build and start the bot:
```bash
npm run build
npm start
```

## Commands

- `/search [query]` - Search for YouTube videos
- `/settings` - Configure bot preferences
- Use inline mode by typing `@your_bot_name [query]`

## Technologies Used

- Node.js
- TypeScript
- Grammy (Telegram Bot Framework)
- Prisma (Database ORM)
- PostgreSQL
- YouTube Data API
- FFmpeg (for media processing)

## Environment Setup

Make sure you have the following installed:
- Node.js (version 18 or higher)
- PostgreSQL
- FFmpeg

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
