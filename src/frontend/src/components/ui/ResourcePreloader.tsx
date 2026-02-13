import { useEffect } from 'react';

/**
 * 资源预加载组件
 * 在后台预加载关键资源，提升用户体验
 */
interface ResourcePreloaderProps {
  images?: string[];
  scripts?: string[];
  styles?: string[];
  fonts?: string[];
  onProgress?: (loaded: number, total: number) => void;
  onComplete?: () => void;
}

export function ResourcePreloader({
  images = [],
  scripts = [],
  styles = [],
  fonts = [],
  onProgress,
  onComplete,
}: ResourcePreloaderProps) {
  useEffect(() => {
    const totalResources = images.length + scripts.length + styles.length + fonts.length;
    let loadedResources = 0;

    const updateProgress = () => {
      loadedResources++;
      onProgress?.(loadedResources, totalResources);

      if (loadedResources === totalResources) {
        onComplete?.();
      }
    };

    images.forEach(src => {
      const img = new Image();
      img.onload = updateProgress;
      img.onerror = updateProgress;
      img.src = src;
    });

    scripts.forEach(src => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'script';
      link.href = src;
      link.onload = updateProgress;
      link.onerror = updateProgress;
      document.head.appendChild(link);
    });

    styles.forEach(href => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'style';
      link.href = href;
      link.onload = updateProgress;
      link.onerror = updateProgress;
      document.head.appendChild(link);
    });

    fonts.forEach(href => {
      const link = document.createElement('link');
      link.rel = 'preload';
      link.as = 'font';
      link.href = href;
      link.crossOrigin = 'anonymous';
      link.onload = updateProgress;
      link.onerror = updateProgress;
      document.head.appendChild(link);
    });

    if (totalResources === 0) {
      onComplete?.();
    }
  }, [images, scripts, styles, fonts, onProgress, onComplete]);

  return null; // 这个组件不渲染任何内容
}

/**
 * 预获取组件 - 用于预获取即将访问的页面
 */
interface PrefetchProps {
  pages: string[]; // 要预获取的页面路径
}

export function PrefetchLinks({ pages }: PrefetchProps) {
  useEffect(() => {
    pages.forEach(path => {
      const link = document.createElement('link');
      link.rel = 'prefetch';
      link.href = path;
      document.head.appendChild(link);
    });
  }, [pages]);

  return null;
}

/**
 * DNS 预解析组件
 */
interface DnsPrefetchProps {
  domains: string[]; // 要预解析的域名
}

export function DnsPrefetch({ domains }: DnsPrefetchProps) {
  useEffect(() => {
    domains.forEach(domain => {
      const link = document.createElement('link');
      link.rel = 'dns-prefetch';
      link.href = domain;
      document.head.appendChild(link);
    });
  }, [domains]);

  return null;
}

/**
 * 预连接组件
 */
interface PreConnectProps {
  urls: string[]; // 要预连接的 URL
}

export function PreConnect({ urls }: PreConnectProps) {
  useEffect(() => {
    urls.forEach(url => {
      const link = document.createElement('link');
      link.rel = 'preconnect';
      link.href = url;
      link.crossOrigin = 'anonymous';
      document.head.appendChild(link);
    });
  }, [urls]);

  return null;
}
