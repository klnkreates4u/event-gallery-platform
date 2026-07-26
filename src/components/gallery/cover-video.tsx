'use client';

import React, { useState } from 'react';

export interface CoverVideoProps {
  videoUrl?: string;
  posterUrl: string;
  alt: string;
  className?: string;
}

export function CoverVideo({ videoUrl, posterUrl, alt, className = '' }: CoverVideoProps) {
  const [videoError, setVideoError] = useState(false);

  if (!videoUrl || videoError) {
    return (
      <img
        src={posterUrl}
        alt={alt}
        className={`w-full h-full object-cover ${className}`}
      />
    );
  }

  return (
    <div className={`relative w-full h-full overflow-hidden ${className}`}>
      <video
        autoPlay
        muted
        loop
        playsInline
        poster={posterUrl}
        onError={() => setVideoError(true)}
        className="w-full h-full object-cover"
      >
        <source src={videoUrl} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}
