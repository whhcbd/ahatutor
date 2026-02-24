import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

interface ImageMetadata {
  id: string;
  filename: string;
  path: string;
  pageNumber?: number;
  chapter?: string;
  section?: string;
  context?: string;
  ocrText?: string;
  description?: string;
  imageType: 'text' | 'chart' | 'diagram' | 'illustration' | 'photo' | 'other';
}

interface Exercise {
  id: string;
  chapter: string;
  chapterNumber: number;
  question: string;
  type: 'choice' | 'fill' | 'calculation' | 'essay' | 'multiple' | 'other';
  options?: string[];
  answer?: string;
  explanation?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags: string[];
  metadata: {
    originalLine: number;
    pageNumber?: number;
    hasImage?: boolean;
    relatedTopics?: string[];
  };
}

interface RAGDocument {
  id: string;
  content: string;
  metadata: {
    type: 'text' | 'image' | 'exercise';
    chapter?: string;
    chapterNumber?: number;
    section?: string;
    pageNumber?: number;
    difficulty?: string;
    tags?: string[];
    imageType?: string;
    exerciseType?: string;
    createdAt: string;
  };
  embedding?: number[];
}

interface RAGDatabase {
  version: string;
  documents: RAGDocument[];
  metadata: {
    totalDocuments: number;
    lastUpdated: string;
    statistics: any;
  };
}

class RAGDatabaseUpdater {
  private readonly RAG_DATABASE_PATH = 'data/genetics-rag-final.json';
  private readonly BACKUP_PATH = 'data/genetics-rag-backup.json';
  private readonly VERSION = '2.0.0';

  async updateDatabase(
    images: ImageMetadata[],
    exercises: Exercise[],
    removeExistingExercises: boolean = true
  ): Promise<void> {
    console.log('开始更新RAG数据库...');
    
    const ragData = await this.loadRAGDatabase();
    
    if (removeExistingExercises) {
      console.log('移除RAG数据库中现有的习题...');
      ragData.documents = ragData.documents.filter(
        doc => doc.metadata.type !== 'exercise'
      );
      console.log(`移除后剩余文档: ${ragData.documents.length}`);
    }
    
    const imageDocuments = this.convertImagesToRAGDocuments(images);
    console.log(`转换了 ${imageDocuments.length} 个图片文档`);
    
    const exerciseDocuments = this.convertExercisesToRAGDocuments(exercises);
    console.log(`转换了 ${exerciseDocuments.length} 个习题文档`);
    
    const newDocuments = [...ragData.documents, ...imageDocuments, ...exerciseDocuments];
    const deduplicatedDocuments = this.deduplicateDocuments(newDocuments);
    console.log(`去重后总文档数: ${deduplicatedDocuments.length}`);
    
    await this.backupExistingDatabase();
    await this.saveRAGDatabase({
      version: this.VERSION,
      documents: deduplicatedDocuments,
      metadata: {
        totalDocuments: deduplicatedDocuments.length,
        lastUpdated: new Date().toISOString(),
        statistics: this.generateStatistics(deduplicatedDocuments)
      }
    });
    
    console.log('RAG数据库更新完成');
  }

  private async loadRAGDatabase(): Promise<RAGDatabase> {
    try {
      if (fs.existsSync(this.RAG_DATABASE_PATH)) {
        const content = fs.readFileSync(this.RAG_DATABASE_PATH, 'utf-8');
        const data = JSON.parse(content);
        console.log(`加载了现有RAG数据库，版本: ${data.version}, 文档数: ${data.documents?.length || 0}`);
        return data;
      }
    } catch (error) {
      console.error('加载RAG数据库失败，将创建新数据库:', error);
    }
    
    return {
      version: this.VERSION,
      documents: [],
      metadata: {
        totalDocuments: 0,
        lastUpdated: new Date().toISOString(),
        statistics: {}
      }
    };
  }

  private async backupExistingDatabase(): Promise<void> {
    if (fs.existsSync(this.RAG_DATABASE_PATH)) {
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupPath = `data/genetics-rag-backup-${timestamp}.json`;
      fs.copyFileSync(this.RAG_DATABASE_PATH, backupPath);
      console.log(`RAG数据库已备份到: ${backupPath}`);
    }
  }

  private async saveRAGDatabase(data: RAGDatabase): Promise<void> {
    const outputDir = path.dirname(this.RAG_DATABASE_PATH);
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    fs.writeFileSync(this.RAG_DATABASE_PATH, JSON.stringify(data, null, 2));
    console.log(`RAG数据库已保存到: ${this.RAG_DATABASE_PATH}`);
  }

  private convertImagesToRAGDocuments(images: ImageMetadata[]): RAGDocument[] {
    const relevantImages = images.filter(img => img.isRelevant !== false);
    console.log(`过滤后相关图片: ${relevantImages.length}/${images.length}`);
    
    return relevantImages.map(image => {
      const content = this.generateImageContent(image);
      
      return {
        id: image.id,
        content,
        metadata: {
          type: 'image',
          chapter: image.chapter,
          section: image.section,
          pageNumber: image.pageNumber,
          imageType: image.imageType,
          tags: this.extractImageTags(image),
          createdAt: new Date().toISOString()
        }
      };
    });
  }

  private generateImageContent(image: ImageMetadata): string {
    const parts: string[] = [];
    
    parts.push(`图片类型: ${this.getImageTypeLabel(image.imageType)}`);
    
    if (image.chapter) {
      parts.push(`所属章节: ${image.chapter}`);
    }
    
    if (image.section) {
      parts.push(`所属小节: ${image.section}`);
    }
    
    if (image.pageNumber) {
      parts.push(`页码: ${image.pageNumber}`);
    }
    
    if (image.ocrText && image.ocrText.length > 0) {
      parts.push(`OCR识别文本: ${image.ocrText}`);
    }
    
    if (image.description) {
      parts.push(`图片描述: ${image.description}`);
    }
    
    if (image.context) {
      parts.push(`上下文: ${image.context}`);
    }
    
    return parts.join('\n');
  }

  private extractImageTags(image: ImageMetadata): string[] {
    const tags: string[] = [];
    
    if (image.chapter) {
      tags.push(image.chapter);
    }
    
    if (image.section) {
      tags.push(image.section);
    }
    
    const typeTags = {
      text: ['文本', '文字'],
      chart: ['图表', '数据图', '曲线图'],
      diagram: ['示意图', '结构图', '流程图'],
      illustration: ['插图', '图解'],
      photo: ['照片', '实物图']
    };
    
    if (typeTags[image.imageType]) {
      tags.push(...typeTags[image.imageType]);
    }
    
    return [...new Set(tags)];
  }

  private getImageTypeLabel(type: ImageMetadata['imageType']): string {
    const labels = {
      text: '文本图片',
      chart: '图表',
      diagram: '示意图',
      illustration: '插图',
      photo: '照片',
      other: '其他图片'
    };
    return labels[type];
  }

  private convertExercisesToRAGDocuments(exercises: Exercise[]): RAGDocument[] {
    return exercises.map(exercise => {
      const content = this.generateExerciseContent(exercise);
      
      return {
        id: exercise.id,
        content,
        metadata: {
          type: 'exercise',
          chapter: exercise.chapter,
          chapterNumber: exercise.chapterNumber,
          difficulty: exercise.difficulty,
          tags: [...exercise.tags, ...this.extractExerciseTags(exercise)],
          exerciseType: exercise.type,
          createdAt: new Date().toISOString()
        }
      };
    });
  }

  private generateExerciseContent(exercise: Exercise): string {
    const parts: string[] = [];
    
    parts.push(`章节: ${exercise.chapter}`);
    parts.push(`题型: ${this.getExerciseTypeLabel(exercise.type)}`);
    parts.push(`难度: ${this.getDifficultyLabel(exercise.difficulty)}`);
    
    if (exercise.tags && exercise.tags.length > 0) {
      parts.push(`标签: ${exercise.tags.join(', ')}`);
    }
    
    parts.push(`题目: ${exercise.question}`);
    
    if (exercise.options && exercise.options.length > 0) {
      parts.push(`选项:`);
      exercise.options.forEach((option, index) => {
        parts.push(`  ${index + 1}. ${option}`);
      });
    }
    
    if (exercise.answer) {
      parts.push(`答案: ${exercise.answer}`);
    }
    
    if (exercise.explanation) {
      parts.push(`解析: ${exercise.explanation}`);
    }
    
    return parts.join('\n');
  }

  private extractExerciseTags(exercise: Exercise): string[] {
    const tags: string[] = [];
    
    tags.push(this.getExerciseTypeLabel(exercise.type));
    tags.push(this.getDifficultyLabel(exercise.difficulty));
    tags.push(`第${exercise.chapterNumber}章`);
    
    return [...new Set(tags)];
  }

  private getExerciseTypeLabel(type: Exercise['type']): string {
    const labels = {
      choice: '选择题',
      fill: '填空题',
      calculation: '计算题',
      essay: '论述题',
      multiple: '多选题',
      other: '其他题型'
    };
    return labels[type];
  }

  private getDifficultyLabel(difficulty: Exercise['difficulty']): string {
    const labels = {
      easy: '简单',
      medium: '中等',
      hard: '困难'
    };
    return labels[difficulty];
  }

  private deduplicateDocuments(documents: RAGDocument[]): RAGDocument[] {
    const seen = new Map<string, RAGDocument>();
    
    for (const doc of documents) {
      if (!seen.has(doc.id)) {
        seen.set(doc.id, doc);
      }
    }
    
    return Array.from(seen.values());
  }

  private generateStatistics(documents: RAGDocument[]): any {
    const stats = {
      total: documents.length,
      byType: {} as Record<string, number>,
      byChapter: {} as Record<string, number>,
      byDifficulty: {} as Record<string, number>,
      byExerciseType: {} as Record<string, number>
    };
    
    documents.forEach(doc => {
      const type = doc.metadata.type;
      stats.byType[type] = (stats.byType[type] || 0) + 1;
      
      if (doc.metadata.chapterNumber) {
        const chapter = `第${doc.metadata.chapterNumber}章`;
        stats.byChapter[chapter] = (stats.byChapter[chapter] || 0) + 1;
      }
      
      if (doc.metadata.difficulty) {
        stats.byDifficulty[doc.metadata.difficulty] = (stats.byDifficulty[doc.metadata.difficulty] || 0) + 1;
      }
      
      if (doc.metadata.exerciseType) {
        stats.byExerciseType[doc.metadata.exerciseType] = (stats.byExerciseType[doc.metadata.exerciseType] || 0) + 1;
      }
    });
    
    return stats;
  }
}

async function main() {
  const imagesPath = 'docs/reference/processed/processed-images.json';
  const exercisesPath = 'docs/reference/exercises/exercises.json';
  
  const updater = new RAGDatabaseUpdater();
  
  let images: ImageMetadata[] = [];
  let exercises: Exercise[] = [];
  
  if (fs.existsSync(imagesPath)) {
    const imagesContent = fs.readFileSync(imagesPath, 'utf-8');
    images = JSON.parse(imagesContent);
    console.log(`加载了 ${images.length} 张图片`);
  } else {
    console.log('图片处理文件不存在，跳过图片更新');
  }
  
  if (fs.existsSync(exercisesPath)) {
    const exercisesContent = fs.readFileSync(exercisesPath, 'utf-8');
    exercises = JSON.parse(exercisesContent);
    console.log(`加载了 ${exercises.length} 道习题`);
  } else {
    console.log('习题文件不存在，跳过习题更新');
  }
  
  if (images.length === 0 && exercises.length === 0) {
    console.log('没有需要更新的数据');
    return;
  }
  
  await updater.updateDatabase(images, exercises, true);
  
  console.log('\n=== 更新完成 ===');
  console.log(`图片文档: ${images.length}`);
  console.log(`习题文档: ${exercises.length}`);
}

if (require.main === module) {
  main().catch(console.error);
}

export { RAGDatabaseUpdater, RAGDocument };
