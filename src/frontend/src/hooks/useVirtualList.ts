import { useMemo, useRef, useState, useCallback } from 'react';

/**
 * 虚拟列表 Hook - 优化长列表渲染性能
 * @param items 列表数据
 * @param itemHeight 每项高度（px）
 * @param containerHeight 容器高度（px）
 * @param overscan 预渲染数量，默认 5
 */
export function useVirtualList<T>(
  items: T[],
  itemHeight: number,
  containerHeight: number,
  overscan: number = 5
) {
  const [scrollTop, setScrollTop] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // 计算可见范围
  const { visibleRange, totalHeight, offsetY } = useMemo(() => {
    const startIndex = Math.max(0, Math.floor(scrollTop / itemHeight) - overscan);
    const endIndex = Math.min(
      items.length - 1,
      Math.ceil((scrollTop + containerHeight) / itemHeight) + overscan
    );

    return {
      visibleRange: { start: startIndex, end: endIndex },
      totalHeight: items.length * itemHeight,
      offsetY: startIndex * itemHeight,
    };
  }, [scrollTop, itemHeight, containerHeight, items.length, overscan]);

  // 可见数据
  const visibleItems = useMemo(() => {
    return items.slice(visibleRange.start, visibleRange.end + 1);
  }, [items, visibleRange]);

  // 滚动处理
  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  // 滚动到指定索引
  const scrollToIndex = useCallback((index: number) => {
    if (scrollContainerRef.current) {
      const maxScroll = totalHeight - containerHeight;
      const targetScroll = Math.min(
        Math.max(0, index * itemHeight - containerHeight / 2 + itemHeight / 2),
        maxScroll
      );
      scrollContainerRef.current.scrollTop = targetScroll;
    }
  }, [itemHeight, containerHeight, totalHeight]);

  return {
    scrollContainerRef,
    visibleItems,
    totalHeight,
    offsetY,
    handleScroll,
    scrollToIndex,
    visibleRange,
  };
}

/**
 * 动态高度虚拟列表 Hook
 */
export function useDynamicVirtualList<T>(
  items: T[],
  containerHeight: number,
  overscan: number = 5,
  defaultItemHeight: number = 50
) {
  const [scrollTop, setScrollTop] = useState(0);
  const [itemHeights, setItemHeights] = useState<Record<number, number>>({});
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // 计算位置
  const { visibleRange, totalHeight, offsetY } = useMemo(() => {
    let accumulatedHeight = 0;
    let startIndex = 0;
    let endIndex = items.length - 1;

    // 找到起始索引
    for (let i = 0; i < items.length; i++) {
      const height = itemHeights[i] || defaultItemHeight;
      if (accumulatedHeight + height >= scrollTop - overscan * defaultItemHeight) {
        startIndex = Math.max(0, i - overscan);
        break;
      }
      accumulatedHeight += height;
    }

    // 计算总高度和结束索引
    accumulatedHeight = 0;
    let targetReached = false;
    for (let i = 0; i < items.length; i++) {
      const height = itemHeights[i] || defaultItemHeight;
      accumulatedHeight += height;

      if (i >= startIndex && !targetReached) {
        if (accumulatedHeight >= scrollTop + containerHeight + overscan * defaultItemHeight) {
          endIndex = Math.min(items.length - 1, i + overscan);
          targetReached = true;
        }
      }
    }

    // 计算起始偏移
    let startOffset = 0;
    for (let i = 0; i < startIndex; i++) {
      startOffset += itemHeights[i] || defaultItemHeight;
    }

    return {
      visibleRange: { start: startIndex, end: endIndex },
      totalHeight: Object.values(itemHeights).reduce((sum, h) => sum + h, 0) +
        (items.length - Object.keys(itemHeights).length) * defaultItemHeight,
      offsetY: startOffset,
    };
  }, [scrollTop, itemHeights, items.length, containerHeight, overscan, defaultItemHeight]);

  const visibleItems = useMemo(() => {
    return items.slice(visibleRange.start, visibleRange.end + 1);
  }, [items, visibleRange]);

  const handleScroll = useCallback((e: React.UIEvent<HTMLDivElement>) => {
    setScrollTop(e.currentTarget.scrollTop);
  }, []);

  const setItemHeight = useCallback((index: number, height: number) => {
    setItemHeights(prev => {
      if (prev[index] === height) return prev;
      return { ...prev, [index]: height };
    });
  }, []);

  return {
    scrollContainerRef,
    visibleItems,
    totalHeight,
    offsetY,
    handleScroll,
    setItemHeight,
    visibleRange,
  };
}
