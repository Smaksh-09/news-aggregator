"use client";
import Image from 'next/image';
import { useState } from 'react';


interface CardProps {
  title: string;
  description: string;
  imageUrl?: string;
  onclick: () => void;
}

export default function Card({ title, description, imageUrl, onclick }: CardProps) {
  const [imgError, setImgError] = useState(false); 
  const fallbackImage = '/images/news-logo.svg';

  
  const validImageUrl = (imageUrl && imageUrl.startsWith('http')) ? imageUrl : fallbackImage;

  const handleImageError = () => {
    console.log('Image failed to load, using fallback');
    setImgError(true);
  };

  return (
    <div className="max-w-sm bg-white rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700 m-4">
      <div className="relative w-full h-48">
        <Image
          className="rounded-t-lg object-contain p-2"
          src={imgError ? fallbackImage : validImageUrl}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          onError={handleImageError}
          unoptimized
        />
      </div>
      <div className="p-5">
        <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
          {title}
        </h5>
        <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
          {description}
        </p>
        <button
          onClick={onclick}
          className="text-white bg-blue-500 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2"
        >
          Read More
        </button>
      </div>
    </div>
  );
}
