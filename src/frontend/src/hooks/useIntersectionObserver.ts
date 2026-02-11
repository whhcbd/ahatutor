import { useEffect, useState, useRef } from 'react';

/**
 * Intersection Observer Hook - 监听元素是否进入视口
 * 适用于懒加载图片、无限滚动等场景
 */
export function useIntersectionObserver(
  options?: IntersectionObserverInit
) {
  const [isIntersecting, setIsIntersecting] = useState(false);
  const [hasIntersected, setHasIntersected] = useState(false);
  const targetRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const element = targetRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(([entry]) => {
      setIsIntersecting(entry.isIntersecting);
      if (entry.isIntersecting && !hasIntersected) {
        setHasIntersected(true);
      }
    }, {
      threshold: 0.1,
      rootMargin: '50px',
      ...options,
    });

    observer.observe(element);

    return () => {
      observer.disconnect();
    };
  }, [options, hasIntersected]);

  return { targetRef, isIntersecting, hasIntersected };
}

/**
 * 懒加载图片 Hook
 */
export function useLazyImage(src: string, placeholder?: string) {
  const [imageSrc, setImageSrc] = useState(placeholder || '');
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { targetRef, isIntersecting } = useIntersectionObserver({
    threshold: 0,
    rootMargin: '100px',
  });

  useEffect(() => {
    if (!isIntersecting || imageSrc === src) return;

    const img = new Image();
    img.src = src;

    img.onload = () => {
      setImageSrc(src);
      setIsLoaded(true);
      setError(null);
    };

    img.onerror = () => {
      setError('Failed to load image');
      setIsLoaded(false);
    };
  }, [isIntersecting, src, imageSrc]);

  return { targetRef, imageSrc, isLoaded, error };
}
