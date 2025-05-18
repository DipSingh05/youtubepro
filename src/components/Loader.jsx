// components/Loader.jsx
import React, { useEffect, useRef } from 'react';
import anime from 'animejs/lib/anime.es.js';

const Loader = () => {
  const loaderRef = useRef(null);
  
  useEffect(() => {
    const animation = anime.timeline({
      targets: '.loader-item',
      easing: 'easeInOutSine',
      loop: true,
    });
    
    animation
      .add({
        translateY: [0, -15],
        opacity: [0.3, 1],
        delay: anime.stagger(100),
        duration: 500,
      })
      .add({
        translateY: [-15, 0],
        opacity: [1, 0.3],
        delay: anime.stagger(100),
        duration: 500,
      });
      
    return () => {
      animation.pause();
    };
  }, []);
  
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-60 backdrop-blur-sm" ref={loaderRef}>
      <div className="text-center">
        <div className="flex space-x-2 justify-center mb-6">
          <div className="loader-item w-4 h-4 bg-red-500 rounded-full"></div>
          <div className="loader-item w-4 h-4 bg-red-400 rounded-full"></div>
          <div className="loader-item w-4 h-4 bg-purple-500 rounded-full"></div>
          <div className="loader-item w-4 h-4 bg-purple-400 rounded-full"></div>
          <div className="loader-item w-4 h-4 bg-red-500 rounded-full"></div>
        </div>
        <div className="bg-gray-800 bg-opacity-80 px-6 py-4 rounded-lg border border-gray-700">
          <p className="text-lg font-medium text-white">Fetching playlist data...</p>
          <p className="text-sm text-gray-300 mt-2">This may take a moment depending on playlist size</p>
        </div>
      </div>
    </div>
  );
};

export default Loader;