// App.jsx
import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import anime from 'animejs/lib/anime.es.js';
import { FaYoutube, FaSearch, FaInfoCircle, FaCalendarAlt, FaTags } from 'react-icons/fa';
import { BsPlayCircleFill } from 'react-icons/bs';
import './App.css';
import Loader from './components/Loader';
import VideoCard from './components/VideoCard';

function App() {
  const [playlistUrl, setPlaylistUrl] = useState('');
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeVideo, setActiveVideo] = useState(null);
  const appRef = useRef(null);
  const inputRef = useRef(null);
  const resultsRef = useRef(null);
  
  useEffect(() => {
    // Initial animation
    anime({
      targets: '.app-title',
      translateY: [50, 0],
      opacity: [0, 1],
      duration: 1200,
      easing: 'easeOutElastic(1, .6)'
    });
    
    anime({
      targets: '.search-container',
      translateY: [30, 0],
      opacity: [0, 1],
      delay: 300,
      duration: 1000,
      easing: 'easeOutCubic'
    });
  }, []);
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!playlistUrl.includes('youtube.com/playlist')) {
      setError('Please enter a valid YouTube playlist URL');
      anime({
        targets: '.error-message',
        translateX: [
          { value: -10, duration: 100 },
          { value: 10, duration: 100 },
          { value: -5, duration: 100 },
          { value: 5, duration: 100 },
          { value: 0, duration: 100 }
        ],
        easing: 'easeInOutSine'
      });
      return;
    }
    
    setError('');
    setLoading(true);
    setVideos([]);
    
    try {
      // Animation for search transition
      anime({
        targets: '.search-container',
        translateY: -20,
        scale: 0.95,
        duration: 500,
        easing: 'easeOutCubic'
      });
      
      const response = await axios.post('http://localhost:5000/api/playlist', { playlistUrl });
      setVideos(response.data);
      
      // Animate in the results
      setTimeout(() => {
        anime({
          targets: '.results-container',
          translateY: [20, 0],
          opacity: [0, 1],
          duration: 800,
          easing: 'easeOutCubic'
        });
        
        anime({
          targets: '.video-card',
          scale: [0.9, 1],
          opacity: [0, 1],
          delay: anime.stagger(100, {start: 300}),
          duration: 600,
          easing: 'easeOutCubic'
        });
      }, 300);
      
    } catch (err) {
      console.error('Error fetching playlist data:', err);
      setError('Failed to fetch playlist data. Please check the URL and try again.');
      
      anime({
        targets: '.error-message',
        translateY: [20, 0],
        opacity: [0, 1],
        duration: 300,
        easing: 'easeOutCubic'
      });
    } finally {
      setLoading(false);
    }
  };
  
  const viewVideoDetails = (video) => {
    setActiveVideo(video);
    
    // Animate detail modal
    anime({
      targets: '.video-detail-modal',
      translateY: [20, 0],
      opacity: [0, 1],
      duration: 400,
      easing: 'easeOutCubic'
    });
  };
  
  const closeVideoDetails = () => {
    anime({
      targets: '.video-detail-modal',
      translateY: [0, 20],
      opacity: [1, 0],
      duration: 300,
      easing: 'easeInCubic',
      complete: () => setActiveVideo(null)
    });
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 text-white p-4 md:p-8" ref={appRef}>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col items-center justify-center mb-10 pt-8">
          <h1 className="app-title text-5xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-purple-600 mb-2 flex items-center">
            <FaYoutube className="mr-4 text-red-600" />
            <span>PlaylistPro</span>
          </h1>
          <p className="text-gray-300 mt-4 text-center max-w-2xl">
            Extract complete data from any YouTube playlist. Get video details, descriptions, 
            thumbnails, and more with one click.
          </p>
        </div>
        
        <div className="search-container bg-gray-800 rounded-xl p-6 shadow-lg mb-10 max-w-3xl mx-auto border border-gray-700">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <input
                ref={inputRef}
                type="text"
                value={playlistUrl}
                onChange={(e) => setPlaylistUrl(e.target.value)}
                placeholder="Enter YouTube playlist URL..."
                className="w-full bg-gray-700 text-white px-5 py-4 rounded-lg pl-12 pr-4 border border-gray-600 focus:border-purple-500 focus:ring-2 focus:ring-purple-500 transition-all duration-300 focus:outline-none"
              />
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            
            {error && (
              <div className="error-message text-red-400 bg-red-900 bg-opacity-20 px-4 py-2 rounded-lg flex items-center">
                <FaInfoCircle className="mr-2" /> {error}
              </div>
            )}
            
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-500 hover:to-purple-500 text-white font-bold py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center"
            >
              {loading ? (
                <span className="flex items-center">
                  <span className="animate-spin mr-2">
                    <svg className="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </span>
                  Processing...
                </span>
              ) : (
                'Analyze Playlist'
              )}
            </button>
          </form>
        </div>
        
        {loading && <Loader />}
        
        {videos.length > 0 && (
          <div className="results-container" ref={resultsRef}>
            <h2 className="text-2xl font-bold mb-6 text-purple-300 flex items-center">
              <BsPlayCircleFill className="mr-2" /> 
              {videos.length} Videos Found
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video, index) => (
                <VideoCard 
                  key={video.id || index} 
                  video={video} 
                  onClick={() => viewVideoDetails(video)}
                />
              ))}
            </div>
          </div>
        )}
        
        {activeVideo && (
          <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center p-4 z-50" onClick={closeVideoDetails}>
            <div 
              className="video-detail-modal bg-gray-800 rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto border border-gray-700 shadow-2xl" 
              onClick={e => e.stopPropagation()}
            >
              <div className="space-y-6">
                <div className="relative pb-[56.25%] h-0 overflow-hidden rounded-lg">
                  <img 
                    src={activeVideo.thumbnails?.high?.url || activeVideo.thumbnails?.default?.url} 
                    alt={activeVideo.title}
                    className="absolute top-0 left-0 w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-60"></div>
                  <div className="absolute bottom-4 left-4 right-4">
                    <h3 className="text-2xl font-bold text-white">{activeVideo.title}</h3>
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-4 text-sm">
                  <div className="flex items-center px-3 py-1 bg-gray-700 rounded-full">
                    <FaCalendarAlt className="mr-2 text-purple-400" />
                    <span>{new Date(activeVideo.publishedAt).toLocaleDateString()}</span>
                  </div>
                  
                  {activeVideo.duration && (
                    <div className="flex items-center px-3 py-1 bg-gray-700 rounded-full">
                      <span className="mr-2">⏱️</span>
                      <span>{activeVideo.duration}</span>
                    </div>
                  )}
                  
                  <div className="flex items-center px-3 py-1 bg-gray-700 rounded-full">
                    <span className="mr-2">👁️</span>
                    <span>{activeVideo.viewCount?.toLocaleString() || 'N/A'} views</span>
                  </div>
                </div>
                
                <div>
                  <h4 className="text-lg font-semibold mb-2 text-purple-300">Description</h4>
                  <p className="text-gray-300 whitespace-pre-line">{activeVideo.description || 'No description available.'}</p>
                </div>
                
                {activeVideo.tags && activeVideo.tags.length > 0 && (
                  <div>
                    <h4 className="text-lg font-semibold mb-2 flex items-center text-purple-300">
                      <FaTags className="mr-2" /> Tags
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {activeVideo.tags.map((tag, i) => (
                        <span key={i} className="px-2 py-1 bg-gray-700 text-gray-300 rounded-md text-sm">
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                
                <div className="pt-4 border-t border-gray-700 flex justify-end">
                  <a 
                    href={`https://www.youtube.com/watch?v=${activeVideo.videoId}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors duration-200 flex items-center"
                  >
                    <FaYoutube className="mr-2" /> Watch on YouTube
                  </a>
                  <button 
                    onClick={closeVideoDetails}
                    className="ml-3 bg-gray-700 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;