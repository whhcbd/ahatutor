import { useRef, useState, useEffect } from 'react';
import { Skeleton } from './Loading';

interface LazyImageProps {
  src: string;
  alt: string;
  className?: string;
  placeholder?: string;
  width?: number | string;
  height?: number | string;
  onLoad?: () => void;
  onError?: () => void;
}

/**
 * 懒加载图片组件 - 只在图片进入视口时才加载
 */
export function LazyImage({
  src,
  alt,
  className = '',
  placeholder,
  width,
  height,
  onLoad,
  onError,
}: LazyImageProps) {
  const imgRef = useRef<HTMLImageElement>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isInView, setIsInView] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: '50px', // 提前 50px 开始加载
      }
    );

    if (imgRef.current) {
      observer.observe(imgRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isInView || !imgRef.current) return;

    const img = imgRef.current;

    const handleLoad = () => {
      setIsLoaded(true);
      onLoad?.();
    };

    const handleError = () => {
      setHasError(true);
      onError?.();
    };

    img.addEventListener('load', handleLoad);
    img.addEventListener('error', handleError);

    return () => {
      img.removeEventListener('load', handleLoad);
      img.removeEventListener('error', handleError);
    };
  }, [isInView, onLoad, onError]);

  if (hasError) {
    return (
      <div
        className={`bg-gray-200 flex items-center justify-center ${className}`}
        style={{ width, height }}
      >
        <span className="text-gray-400 text-sm">图片加载失败</span>
      </div>
    );
  }

  return (
    <div className="relative" style={{ width, height }}>
      {!isLoaded && (
        <Skeleton
          className={`absolute inset-0 ${className}`}
          style={{ width, height }}
        />
      )}
      <img
        ref={imgRef}
        src={isInView ? src : placeholder}
        alt={alt}
        className={`${className} ${isLoaded ? 'opacity-100' : 'opacity-0'} transition-opacity duration-300`}
        loading="lazy"
        width={width}
        height={height}
      />
    </div>
  );
}

/**
 * 渐进式图片加载组件 - 先加载低质量占位图，再加载高清图
 */
export function ProgressiveImage({
  src,
  placeholder,
  alt,
  className = '',
}: {
  src: string;
  placeholder: string;
  alt: string;
  className?: string;
}) {
  const [imgSrc, setImgSrc] = useState(placeholder);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const img = new Image();
    img.src = src;

    img.onload = () => {
      setImgSrc(src);
      setIsLoaded(true);
    };
  }, [src]);

  return (
    <img
      src={imgSrc}
      alt={alt}
      className={`${className} transition-all duration-500 ${isLoaded ? 'blur-0' : 'blur-md'}`}
      loading="lazy"
    />
  );
}
