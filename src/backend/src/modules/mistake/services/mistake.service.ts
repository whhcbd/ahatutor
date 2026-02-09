import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { UploadMistakeDto, UpdateMistakeDto, ErrorType, Subject } from '../dto/mistake.dto';

/**
 * 错题管理服务
 * 负责错题的 CRUD 操作
 */
@Injectable()
export class MistakeService {
  // 内存存储（生产环境应使用数据库）
  private mistakes = new Map<string, any>();

  /**
   * 上传图片到 MinIO/本地存储
   */
  async uploadImage(file: Express.Multer.File): Promise<string> {
    // MVP: 返回 base64 或本地路径
    // 生产环境: 上传到 MinIO 或对象存储服务
    // const filename = `mistake_${Date.now()}_${file.originalname}`;

    // 这里简化处理，返回 base64
    const base64 = file.buffer.toString('base64');
    const mimeType = file.mimetype;
    return `data:${mimeType};base64,${base64}`;
  }

  /**
   * 创建错题
   */
  async create(dto: UploadMistakeDto) {
    const id = uuidv4();
    const mistake = {
      id,
      question: dto.question,
      imageUrl: dto.imageUrl,
      correctAnswer: dto.correctAnswer || '',
      userAnswer: dto.userAnswer || '',
      errorType: dto.errorType || ErrorType.HIGH_LEVEL,
      subject: dto.subject || Subject.GENETICS,
      tags: dto.tags || [],
      notes: dto.notes || '',
      createdAt: new Date(),
      reviewCount: 0,
      mastered: false,
    };

    this.mistakes.set(id, mistake);
    return mistake;
  }

  /**
   * 查找所有错题
   */
  async findAll(filters: { subject?: string; tags?: string } = {}) {
    let mistakes = Array.from(this.mistakes.values());

    if (filters.subject) {
      mistakes = mistakes.filter((m) => m.subject === filters.subject);
    }

    if (filters.tags) {
      const filterTags = filters.tags.split(',');
      mistakes = mistakes.filter((m) =>
        filterTags.some((tag) => m.tags.includes(tag)),
      );
    }

    return mistakes.sort((a, b) => b.createdAt - a.createdAt);
  }

  /**
   * 查找单个错题
   */
  async findOne(id: string) {
    const mistake = this.mistakes.get(id);
    if (!mistake) {
      throw new Error(`Mistake not found: ${id}`);
    }
    return mistake;
  }

  /**
   * 更新错题
   */
  async update(id: string, dto: UpdateMistakeDto) {
    const mistake = await this.findOne(id);

    const updated = {
      ...mistake,
      ...dto,
      updatedAt: new Date(),
    };

    this.mistakes.set(id, updated);
    return updated;
  }

  /**
   * 删除错题
   */
  async delete(id: string) {
    const existed = this.mistakes.has(id);
    this.mistakes.delete(id);
    return { deleted: existed };
  }

  /**
   * 按知识点查找错题
   */
  async findByTopic(topic: string) {
    const allMistakes = await this.findAll();
    return allMistakes.filter((m) =>
      m.tags.includes(topic) || m.question.includes(topic),
    );
  }

  /**
   * 获取薄弱知识点统计
   */
  async getWeaknessStats(): Promise<
    Array<{ topic: string; count: number; errorRate: number }>
  > {
    const allMistakes = await this.findAll();
    const topicStats = new Map<string, { count: number; total: number }>();

    for (const mistake of allMistakes) {
      for (const tag of mistake.tags) {
        const stats = topicStats.get(tag) || { count: 0, total: 0 };
        stats.count++;
        stats.total++;
        topicStats.set(tag, stats);
      }
    }

    return Array.from(topicStats.entries())
      .map(([topic, stats]) => ({
        topic,
        count: stats.count,
        errorRate: stats.count / stats.total,
      }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }

  /**
   * 标记错题为已掌握
   */
  async markAsMastered(id: string) {
    const mistake = await this.findOne(id);
    mistake.mastered = true;
    mistake.masteredAt = new Date();
    this.mistakes.set(id, mistake);
    return mistake;
  }

  /**
   * 增加复习次数
   */
  async incrementReviewCount(id: string) {
    const mistake = await this.findOne(id);
    mistake.reviewCount++;
    mistake.lastReviewedAt = new Date();
    this.mistakes.set(id, mistake);
    return mistake;
  }
}
