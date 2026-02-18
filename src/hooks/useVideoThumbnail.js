
import { useState, useEffect } from 'react';

const useVideoThumbnail = (videoUrl, time = 2) => {
  const [thumbnail, setThumbnail] = useState(null);

  useEffect(() => {
    if (!videoUrl) return;

    let isActive = true;
    const video = document.createElement('video');
    video.crossOrigin = 'anonymous';
    video.playsInline = true;
    video.muted = true;
    video.src = videoUrl;

    const handleLoadedMetadata = () => {
      video.currentTime = time;
    };

    const handleSeeked = () => {
      if (!isActive) return;

      const canvas = document.createElement('canvas');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const ctx = canvas.getContext('2d');
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      
      try {
          const dataUrl = canvas.toDataURL('image/jpeg');
          setThumbnail(dataUrl);
      } catch (e) {
          console.warn('Failed to capture video thumbnail (likely cross-origin issue):', e);
      }
      
      // Cleanup
      video.remove();
    };

    video.addEventListener('loadeddata', handleLoadedMetadata); // using loadeddata for better reliability than loadedmetadata for some browsers
    video.addEventListener('seeked', handleSeeked);

    // Trigger load
    video.load();

    return () => {
      isActive = false;
      video.removeEventListener('loadeddata', handleLoadedMetadata);
      video.removeEventListener('seeked', handleSeeked);
      video.src = ''; // Cancel loading
      video.remove();
    };
  }, [videoUrl, time]);

  return thumbnail;
};

export default useVideoThumbnail;
