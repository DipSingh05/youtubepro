// server/index.js
const express = require('express');
const cors = require('cors');
const axios = require('axios');
const { google } = require('googleapis');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Initialize YouTube API
const youtube = google.youtube({
  version: 'v3',
  auth: process.env.YOUTUBE_API_KEY
});

// Utility function to format duration
const formatDuration = (duration) => {
  if (!duration) return null;
  
  // Remove PT from the beginning
  duration = duration.replace('PT', '');
  
  let hours = 0;
  let minutes = 0;
  let seconds = 0;
  
  // Extract hours, minutes, and seconds
  if (duration.includes('H')) {
    hours = parseInt(duration.split('H')[0]);
    duration = duration.split('H')[1];
  }
  
  if (duration.includes('M')) {
    minutes = parseInt(duration.split('M')[0]);
    duration = duration.split('M')[1];
  }
  
  if (duration.includes('S')) {
    seconds = parseInt(duration.split('S')[0]);
  }
  
  // Format the duration string
  let formattedDuration = '';
  
  if (hours > 0) {
    formattedDuration += `${hours}:`;
    formattedDuration += minutes < 10 ? `0${minutes}:` : `${minutes}:`;
  } else {
    formattedDuration += `${minutes}:`;
  }
  
  formattedDuration += seconds < 10 ? `0${seconds}` : `${seconds}`;
  
  return formattedDuration;
};

// API Routes
app.post('/api/playlist', async (req, res) => {
  try {
    const { playlistUrl } = req.body;
    
    // Extract playlist ID from the URL
    const urlObj = new URL(playlistUrl);
    const params = new URLSearchParams(urlObj.search);
    const playlistId = params.get('list');
    
    if (!playlistId) {
      return res.status(400).json({ 
        error: 'Invalid playlist URL. Please provide a valid YouTube playlist URL.' 
      });
    }
    
    // Get playlist items
    let nextPageToken = null;
    let playlistItems = [];
    
    do {
      const playlistResponse = await youtube.playlistItems.list({
        part: 'snippet,contentDetails',
        playlistId: playlistId,
        maxResults: 50,
        pageToken: nextPageToken || ''
      });
      
      const items = playlistResponse.data.items;
      
      // If no items are found, break
      if (!items || items.length === 0) break;
      
      // Extract video IDs for batch fetching
      const videoIds = items.map(item => item.contentDetails.videoId);
      
      // Get detailed video information in batch
      const videosResponse = await youtube.videos.list({
        part: 'snippet,contentDetails,statistics',
        id: videoIds.join(',')
      });
      
      const videosData = videosResponse.data.items;
      
      // Map video data to more usable format
      const processedItems = items.map(item => {
        const videoId = item.contentDetails.videoId;
        const videoData = videosData.find(v => v.id === videoId);
        
        if (!videoData) return null;
        
        return {
          videoId,
          title: item.snippet.title,
          description: item.snippet.description,
          publishedAt: item.snippet.publishedAt,
          thumbnails: item.snippet.thumbnails,
          channelTitle: item.snippet.channelTitle,
          channelId: item.snippet.channelId,
          position: item.snippet.position,
          tags: videoData.snippet.tags || [],
          duration: formatDuration(videoData.contentDetails.duration),
          viewCount: videoData.statistics.viewCount,
          likeCount: videoData.statistics.likeCount,
          commentCount: videoData.statistics.commentCount,
          definition: videoData.contentDetails.definition,
          caption: videoData.contentDetails.caption === 'true'
        };
      }).filter(Boolean); // Remove null items
      
      playlistItems = [...playlistItems, ...processedItems];
      nextPageToken = playlistResponse.data.nextPageToken;
      
    } while (nextPageToken);
    
    res.json(playlistItems);
    
  } catch (error) {
    console.error('Error processing playlist:', error);
    
    // Send appropriate error response
    if (error.response && error.response.status === 403) {
      return res.status(403).json({ 
        error: 'API quota exceeded or invalid API key. Please try again later.'
      });
    }
    
    if (error.response && error.response.status === 404) {
      return res.status(404).json({ 
        error: 'Playlist not found. Please check the URL and try again.'
      });
    }
    
    res.status(500).json({ 
      error: 'An error occurred while fetching the playlist data.',
      details: error.message
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({ 
    error: 'Internal Server Error',
    message: err.message 
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`API URL: http://localhost:${PORT}/api`);
});

module.exports = app;