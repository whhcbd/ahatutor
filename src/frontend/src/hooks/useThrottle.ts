import { useState, useEffect, useRef } from 'react';

/**
 * 节流 Hook - 限制函数执行频率，适用于滚动、resize 等场景
 * @param value 需要节流的值
 * @param limit 限制时间（毫秒），默认 300ms
 */
export function useThrottle<T>(value: T, limit: number = 300): T {
  const [throttledValue, setThrottledValue] = useState<T>(value);
  const lastRan = useRef<number>(Date.now());

  useEffect(() => {
    const handler = setTimeout(() => {
      const now = Date.now();
      if (now - lastRan.current >= limit) {
        setThrottledValue(value);
        lastRan.current = now;
      }
    }, limit - (Date.now() - lastRan.current));

    return () => {
      clearTimeout(handler);
    };
  }, [value, limit]);

  return throttledValue;
}

/**
 * 节流函数 Hook - 返回一个节流后的函数
 * @param callback 需要节流的回调函数
 * @param limit 限制时间（毫秒），默认 300ms
 */
export function useThrottledCallback<T extends (...args: any[]) => any>(
  callback: T,
  limit: number = 300
): T {
  const lastRun = useRef<number>(Date.now());
  const timeoutId = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }
    };
  }, []);

  return ((...args: Parameters<T>) => {
    const now = Date.now();
    const timeSinceLastRun = now - lastRun.current;

    if (timeSinceLastRun >= limit) {
      callback(...args);
      lastRun.current = now;
    } else {
      if (timeoutId.current) {
        clearTimeout(timeoutId.current);
      }

      timeoutId.current = setTimeout(() => {
        callback(...args);
        lastRun.current = Date.now();
      }, limit - timeSinceLastRun);
    }
  }) as T;
}
