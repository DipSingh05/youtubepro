import React, { useRef, useEffect } from 'react';
import { FaEye, FaClock, FaCalendarAlt } from 'react-icons/fa';
import anime from 'animejs/lib/anime.es.js';

const VideoCard = ({ video, onClick }) => {
  const cardRef = useRef(null);
  
  // Handle hover animations
  const handleMouseEnter = () => {
    anime({
      targets: cardRef.current.querySelector('.video-card-action'),
      translateY: [10, 0],
      opacity: [0, 1],
      duration: 300,
      easing: 'easeOutCubic'
    });
    
    anime({
      targets: cardRef.current.querySelector('img'),
      scale: 1.05,
      duration: 400,
      easing: 'easeOutCubic'
    });
  };
  
  const handleMouseLeave = () => {
    anime({
      targets: cardRef.current.querySelector('.video-card-action'),
      translateY: [0, 10],
      opacity: [1, 0],
      duration: 200,
      easing: 'easeInCubic'
    });
    
    anime({
      targets: cardRef.current.querySelector('img'),
      scale: 1,
      duration: 400,
      easing: 'easeOutCubic'
    });
  };
  
  return (
    <div 
      ref={cardRef}
      className="video-card bg-gray-800 rounded-xl overflow-hidden border border-gray-700 hover:border-purple-500 transition-all duration-300 cursor-pointer"
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="video-thumbnail relative">
        <img 
          src={video.thumbnails?.high?.url || video.thumbnails?.medium?.url || video.thumbnails?.default?.url || 'https://via.placeholder.com/480x360'} 
          alt={video.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent opacity-60"></div>
        
        <div className="video-card-action absolute inset-0 flex items-center justify-center opacity-0">
          <div className="px-4 py-2 bg-purple-600 rounded-full text-white font-medium flex items-center transform hover:scale-105 transition-transform duration-200">
            <span className="mr-2">View Details</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
            </svg>
          </div>
        </div>
        
        {video.duration && (
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded">
            {video.duration}
          </div>
        )}
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-lg line-clamp-2 mb-2">{video.title}</h3>
        
        <div className="text-sm text-gray-300 space-y-2">
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <FaCalendarAlt className="mr-1 text-purple-400" />
              <span>{new Date(video.publishedAt).toLocaleDateString()}</span>
            </div>
            
            {video.viewCount && (
              <div className="flex items-center">
                <FaEye className="mr-1 text-purple-400" />
                <span>{parseInt(video.viewCount).toLocaleString()}</span>
              </div>
            )}
          </div>
          
          <p className="line-clamp-2 text-gray-400 mt-2">{video.description}</p>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;