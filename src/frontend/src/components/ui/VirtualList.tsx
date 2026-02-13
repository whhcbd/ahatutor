import { ReactNode } from 'react';
import { useVirtualList, useDynamicVirtualList } from '@/hooks/useVirtualList';

interface VirtualListProps<T> {
  items: T[];
  itemHeight: number;
  containerHeight: number;
  renderItem: (item: T, index: number) => ReactNode;
  overscan?: number;
  className?: string;
}

/**
 * 虚拟列表组件 - 优化长列表渲染性能
 * 只渲染可见区域的元素，大幅提升长列表性能
 */
export function VirtualList<T>({
  items,
  itemHeight,
  containerHeight,
  renderItem,
  overscan = 5,
  className = '',
}: VirtualListProps<T>) {
  const {
    scrollContainerRef,
    visibleItems,
    totalHeight,
    offsetY,
    handleScroll,
    visibleRange,
  } = useVirtualList(items, itemHeight, containerHeight, overscan);

  return (
    <div
      ref={scrollContainerRef}
      onScroll={handleScroll}
      className={`overflow-auto ${className}`}
      style={{ height: containerHeight }}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {visibleItems.map((item, index) => (
            <div
              key={visibleRange.start + index}
              style={{ height: itemHeight }}
            >
              {renderItem(item, visibleRange.start + index)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

interface DynamicVirtualListProps<T> {
  items: T[];
  containerHeight: number;
  renderItem: (
    item: T,
    index: number,
    setHeight: (height: number) => void
  ) => ReactNode;
  overscan?: number;
  defaultItemHeight?: number;
  className?: string;
}

/**
 * 动态高度虚拟列表组件
 * 适用于每项高度不固定的场景
 */
export function DynamicVirtualList<T>({
  items,
  containerHeight,
  renderItem,
  overscan = 5,
  defaultItemHeight = 50,
  className = '',
}: DynamicVirtualListProps<T>) {
  const {
    scrollContainerRef,
    visibleItems,
    totalHeight,
    offsetY,
    handleScroll,
    setItemHeight,
    visibleRange,
  } = useDynamicVirtualList(items, containerHeight, overscan, defaultItemHeight);

  // 创建测量高度的包装函数
  const measureHeight = (index: number) => (height: number) => {
    setItemHeight(index, height);
  };

  return (
    <div
      ref={scrollContainerRef}
      onScroll={handleScroll}
      className={`overflow-auto ${className}`}
      style={{ height: containerHeight }}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {visibleItems.map((item, i) => {
            const actualIndex = visibleRange.start + i;
            return (
              <div key={actualIndex}>
                {renderItem(item, actualIndex, measureHeight(actualIndex))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/**
 * 网格虚拟列表 - 适用于网格布局
 */
interface VirtualGridProps<T> {
  items: T[];
  itemHeight: number;
  itemWidth: number;
  containerHeight: number;
  containerWidth: number;
  renderItem: (item: T, index: number) => ReactNode;
  gap?: number;
  overscan?: number;
  className?: string;
}

export function VirtualGrid<T>({
  items,
  itemHeight,
  itemWidth,
  containerHeight,
  containerWidth,
  renderItem,
  gap = 10,
  overscan = 5,
  className = '',
}: VirtualGridProps<T>) {
  const columns = Math.floor(containerWidth / (itemWidth + gap));
  const rows = Math.ceil(items.length / columns);

  const {
    scrollContainerRef,
    visibleItems,
    totalHeight,
    offsetY,
    handleScroll,
  } = useVirtualList(
    Array.from({ length: rows }, (_, i) => i),
    itemHeight + gap,
    containerHeight,
    overscan
  );

  const getRowItems = (rowIndex: number) => {
    const start = rowIndex * columns;
    return items.slice(start, start + columns);
  };

  return (
    <div
      ref={scrollContainerRef}
      onScroll={handleScroll}
      className={`overflow-auto ${className}`}
      style={{ height: containerHeight, width: containerWidth }}
    >
      <div style={{ height: totalHeight, position: 'relative' }}>
        <div style={{ transform: `translateY(${offsetY}px)` }}>
          {visibleItems.map((rowIndex) => {
            const rowItems = getRowItems(rowIndex);
            return (
              <div
                key={rowIndex}
                className="flex"
                style={{ height: itemHeight, gap: `${gap}px`, marginBottom: `${gap}px` }}
              >
                {rowItems.map((item, colIndex) => (
                  <div key={rowIndex * columns + colIndex} style={{ width: itemWidth }}>
                    {renderItem(item, rowIndex * columns + colIndex)}
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
