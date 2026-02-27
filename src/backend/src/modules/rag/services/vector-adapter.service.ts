import { Injectable, Logger } from '@nestjs/common';

@Injectable()
export class VectorAdapterService {
  private readonly logger = new Logger(VectorAdapterService.name);

  /**
   * 将低维向量投影到高维
   * 使用循环填充策略
   * 
   * @param lowDimVector 低维向量
   * @param targetDim 目标维度
   * @returns 高维向量
   */
  projectUp(lowDimVector: number[], targetDim: number): number[] {
    if (lowDimVector.length === targetDim) {
      return lowDimVector;
    }

    if (lowDimVector.length > targetDim) {
      this.logger.warn(`目标维度 ${targetDim} 小于输入维度 ${lowDimVector.length}，将进行降维`);
      return this.projectDown(lowDimVector, targetDim);
    }

    const result = new Array(targetDim).fill(0);
    const srcDim = lowDimVector.length;
    
    for (let i = 0; i < targetDim; i++) {
      result[i] = lowDimVector[i % srcDim];
    }

    this.logger.debug(`投影向量: ${srcDim}d -> ${targetDim}d`);
    return result;
  }

  /**
   * 将高维向量降维到低维
   * 使用平均池化（Average Pooling）
   * 
   * @param highDimVector 高维向量
   * @param targetDim 目标维度
   * @returns 低维向量
   */
  projectDown(highDimVector: number[], targetDim: number): number[] {
    if (highDimVector.length === targetDim) {
      return highDimVector;
    }

    if (highDimVector.length < targetDim) {
      this.logger.warn(`目标维度 ${targetDim} 大于输入维度 ${highDimVector.length}，将进行升维`);
      return this.projectUp(highDimVector, targetDim);
    }

    const result = new Array(targetDim).fill(0);
    const chunkSize = Math.ceil(highDimVector.length / targetDim);
    
    for (let i = 0; i < targetDim; i++) {
      const start = i * chunkSize;
      const end = Math.min(start + chunkSize, highDimVector.length);
      let sum = 0;
      let count = 0;
      
      for (let j = start; j < end; j++) {
        sum += highDimVector[j];
        count++;
      }
      
      result[i] = count > 0 ? sum / count : 0;
    }

    this.logger.debug(`降维向量: ${highDimVector.length}d -> ${targetDim}d`);
    return result;
  }

  /**
   * 检查并调整向量维度
   * 
   * @param vector 输入向量
   * @param targetDim 目标维度
   * @param method 投影方法：'up' | 'down' | 'auto'
   * @returns 调整后的向量
   */
  adaptVector(vector: number[], targetDim: number, method: 'up' | 'down' | 'auto' = 'auto'): number[] {
    if (vector.length === targetDim) {
      return vector;
    }

    if (method === 'auto') {
      method = vector.length > targetDim ? 'down' : 'up';
    }

    return method === 'up' 
      ? this.projectUp(vector, targetDim)
      : this.projectDown(vector, targetDim);
  }

  /**
   * 计算向量的信息损失
   * 
   * @param original 原始向量
   * @param projected 投影后的向量
   * @returns 信息损失率 (0-1)
   */
  calculateInfoLoss(original: number[], projected: number[]): number {
    if (original.length !== projected.length) {
      const tempProjected = this.adaptVector(projected, original.length);
      return this.calculateInfoLoss(original, tempProjected);
    }

    let sumSquares = 0;
    let sumOriginal = 0;

    for (let i = 0; i < original.length; i++) {
      const diff = original[i] - projected[i];
      sumSquares += diff * diff;
      sumOriginal += original[i] * original[i];
    }

    if (sumOriginal === 0) return 0;
    return Math.sqrt(sumSquares / sumOriginal);
  }

  /**
   * 批量调整向量维度
   * 
   * @param vectors 输入向量数组
   * @param targetDim 目标维度
   * @param method 投影方法
   * @returns 调整后的向量数组
   */
  adaptBatch(vectors: number[][], targetDim: number, method: 'up' | 'down' | 'auto' = 'auto'): number[][] {
    this.logger.debug(`批量调整向量维度: ${vectors.length} 个, ${vectors[0]?.length || 0}d -> ${targetDim}d`);
    
    return vectors.map(v => this.adaptVector(v, targetDim, method));
  }

  /**
   * 获取推荐的目标维度
   * 根据输入向量的维度和数量，推荐最优的目标维度
   * 
   * @param vectors 输入向量数组
   * @returns 推荐的目标维度
   */
  getRecommendedTargetDim(vectors: number[][]): number {
    const avgDim = vectors.reduce((sum, v) => sum + v.length, 0) / vectors.length;
    
    // 常见维度：128, 256, 384, 512, 768, 1024, 1536, 2000
    const commonDims = [128, 256, 384, 512, 768, 1024, 1536, 2000];
    
    let closestDim = commonDims[0];
    let minDiff = Math.abs(avgDim - closestDim);
    
    for (const dim of commonDims) {
      const diff = Math.abs(avgDim - dim);
      if (dim < minDiff) {
        minDiff = diff;
        closestDim = dim;
      }
    }
    
    return closestDim;
  }
}
