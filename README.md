// README.md
# YouTube Playlist Pro

A modern web application that extracts comprehensive data from YouTube playlists, including video descriptions, thumbnails, upload dates, keywords, and more.

![YouTube Playlist Pro Screenshot](screenshot.png)

## Features

- Extract detailed information from any YouTube playlist
- Beautiful, modern UI with animations
- Video details including descriptions, upload dates, view counts
- Keyword/tag extraction
- Animated loading states
- Responsive design for all devices

## Tech Stack

- **Frontend**: React (Vite), Anime.js, TailwindCSS, DaisyUI
- **Backend**: Node.js, Express
- **API**: YouTube Data API v3

## Installation

### Prerequisites

- Node.js v14+
- YouTube Data API key

### Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/youtube-playlist-pro.git
cd youtube-playlist-pro
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the server directory with your YouTube API key:
```
YOUTUBE_API_KEY=your_youtube_api_key_here
PORT=5000
```

## Development

To run both the frontend and backend concurrently:

```bash
npm run dev:all
```

Or separately:

```bash
# Frontend (Vite React)
npm run dev

# Backend (Express)
npm run server
```

The application will be available at:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000/api

## Building for Production

```bash
npm run build
```

## Usage

1. Enter a YouTube playlist URL (format: https://www.youtube.com/playlist?list=PLAYLIST_ID)
2. Click "Analyze Playlist"
3. View detailed information about each video in the playlist
4. Click on a video card to see more details

## License

MIT

## Credits

- YouTube Data API
- Anime.js for animations
- TailwindCSS & DaisyUI for styling