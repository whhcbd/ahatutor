/**
 * 图片优化工具
 */

/**
 * 获取响应式图片 srcset
 * @param baseUrl 基础 URL
 * @param sizes 图片尺寸数组
 * @returns srcset 字符串
 */
export function generateSrcSet(
  baseUrl: string,
  sizes: number[]
): string {
  return sizes
    .map(size => {
      // 假设 URL 格式为 /path/to/image-{size}.jpg 或使用查询参数
      const url = baseUrl.includes('{size}')
        ? baseUrl.replace('{size}', String(size))
        : `${baseUrl}?w=${size}`;
      return `${url} ${size}w`;
    })
    .join(', ');
}

/**
 * 生成 sizes 属性
 * @param breakpoints 断点配置
 * @returns sizes 字符串
 */
export function generateSizes(breakpoints: {
  minWidth?: number;
  size: string;
}[]): string {
  return breakpoints
    .map(bp => {
      if (bp.minWidth) {
        return `(min-width: ${bp.minWidth}px) ${bp.size}`;
      }
      return bp.size;
    })
    .join(', ');
}

/**
 * 图片格式检测
 */
export function getSupportedImageFormats(): string[] {
  const formats: string[] = [];
  const canvas = document.createElement('canvas');

  // 检查 WebP 支持
  if (canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0) {
    formats.push('webp');
  }

  // 检查 AVIF 支持
  if (canvas.toDataURL('image/avif').indexOf('data:image/avif') === 0) {
    formats.push('avif');
  }

  // 总是支持的格式
  formats.push('jpeg', 'png', 'gif');

  return formats;
}

/**
 * 根据设备像素比调整图片尺寸
 * @param baseSize 基础尺寸
 * @param scale DPR 缩放因子，默认为设备像素比
 * @returns 调整后的尺寸
 */
export function adjustForDpr(baseSize: number, scale?: number): number {
  const dpr = scale ?? (typeof window !== 'undefined' ? window.devicePixelRatio : 1);
  return Math.ceil(baseSize * dpr);
}

/**
 * 懒加载图片 URL 生成器
 * @param baseUrl 基础 URL
 * @param params 查询参数
 * @returns 完整的图片 URL
 */
export function buildImageUrl(
  baseUrl: string,
  params: Record<string, string | number>
): string {
  const url = new URL(baseUrl, window.location.origin);

  Object.entries(params).forEach(([key, value]) => {
    url.searchParams.set(key, String(value));
  });

  return url.toString();
}

/**
 * 生成低质量图片占位符 (LQIP)
 * @param imageData Base64 编码的图片数据
 * @param width 宽度
 * @param height 高度
 * @returns 带有模糊效果的占位符 URL
 */
export function generateLqip(
  imageData: string,
  width: number,
  height: number
): string {
  // 这里应该是服务端生成的 LQIP
  // 简单实现：返回带有尺寸参数的 URL
  return buildImageUrl(imageData, {
    w: width,
    h: height,
    q: 10, // 低质量
    blur: 10, // 模糊
  });
}

/**
 * 图片压缩配置
 */
export interface ImageCompressOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number; // 0-1
  format?: 'jpeg' | 'png' | 'webp';
}

/**
 * 在浏览器中压缩图片
 */
export async function compressImage(
  file: File,
  options: ImageCompressOptions = {}
): Promise<Blob> {
  const {
    maxWidth = 1920,
    maxHeight = 1080,
    quality = 0.8,
    format = 'jpeg',
  } = options;

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = URL.createObjectURL(file);

    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      // 计算新尺寸
      let { width, height } = img;
      const ratio = Math.min(maxWidth / width, maxHeight / height);

      if (ratio < 1) {
        width *= ratio;
        height *= ratio;
      }

      canvas.width = width;
      canvas.height = height;

      // 绘制图片
      ctx.drawImage(img, 0, 0, width, height);

      // 转换为 Blob
      canvas.toBlob(
        blob => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to compress image'));
          }
          URL.revokeObjectURL(img.src);
        },
        `image/${format}`,
        quality
      );
    };

    img.onerror = () => {
      reject(new Error('Failed to load image'));
      URL.revokeObjectURL(img.src);
    };
  });
}

/**
 * 检查图片是否在视口附近
 */
export function isNearViewport(element: HTMLElement, threshold = 100): boolean {
  const rect = element.getBoundingClientRect();
  const windowHeight = window.innerHeight || document.documentElement.clientHeight;
  const windowWidth = window.innerWidth || document.documentElement.clientWidth;

  return (
    rect.bottom >= -threshold &&
    rect.top <= windowHeight + threshold &&
    rect.right >= -threshold &&
    rect.left <= windowWidth + threshold
  );
}
