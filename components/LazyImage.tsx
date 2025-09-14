'use client';

import { useState, useRef, useEffect, memo } from 'react';
import Image from 'next/image';
import { Box, Skeleton } from '@mui/material';
import { BLUR_DATA_URLS } from '@/lib/blurDataURL';

interface LazyImageProps {
  src: string;
  alt: string;
  width: number;
  height: number;
  priority?: boolean;
  className?: string;
  style?: React.CSSProperties;
  placeholder?: 'blur' | 'empty';
  blurDataURL?: string;
  sizes?: string;
  quality?: number;
}

const LazyImage: React.FC<LazyImageProps> = memo(({
  src,
  alt,
  width,
  height,
  priority = false,
  className,
  style,
  placeholder = 'empty',
  blurDataURL,
  sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw',
  quality = 85,
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(priority);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (priority) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { 
        threshold: 0.1, 
        rootMargin: '100px'
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, [priority]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = () => {
    setHasError(true);
    setIsLoaded(true);
  };

  // Determine the appropriate blur data URL based on image type
  const getBlurDataURL = () => {
    if (blurDataURL) return blurDataURL;
    
    // Check if it's an airline logo
    if (src.includes('airlines/') || src.includes('airline-logos')) {
      return BLUR_DATA_URLS.airline;
    }
    
    // Check if it's a hero image
    if (src.includes('hero') || src.includes('banner')) {
      return BLUR_DATA_URLS.hero;
    }
    
    return BLUR_DATA_URLS.default;
  };

  // Optimize container styles
  const containerStyle: React.CSSProperties = {
    position: 'relative',
    width,
    height,
    overflow: 'hidden',
    contain: 'layout style paint',
    ...style,
  };

  return (
    <Box
      ref={imgRef}
      className={className}
      style={containerStyle}
    >
      {!isLoaded && !hasError && (
        <Skeleton
          variant="rectangular"
          width="100%"
          height="100%"
          animation="wave"
          sx={{
            backgroundColor: '#f3f4f6',
            '&::after': {
              background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
            },
          }}
        />
      )}
      {isInView && !hasError && (
        <Image
          src={src}
          alt={alt}
          width={width}
          height={height}
          priority={priority}
          placeholder={placeholder === 'blur' ? 'blur' : 'empty'}
          blurDataURL={placeholder === 'blur' ? getBlurDataURL() : undefined}
          sizes={sizes}
          quality={quality}
          onLoad={handleLoad}
          onError={handleError}
          style={{
            opacity: isLoaded ? 1 : 0,
            transition: 'opacity 0.2s ease-in-out',
            objectFit: 'cover',
            willChange: isLoaded ? 'auto' : 'opacity',
          }}
          unoptimized={src.startsWith('data:') || src.includes('.svg')}
        />
      )}
      {hasError && (
        <Box
          sx={{
            width: '100%',
            height: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: '#f3f4f6',
            color: '#6b7280',
            fontSize: '0.875rem',
          }}
        >
          Image unavailable
        </Box>
      )}
    </Box>
  );
});

LazyImage.displayName = 'LazyImage';

export default LazyImage;
