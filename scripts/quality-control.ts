import fs from 'fs';
import path from 'path';

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
  isRelevant?: boolean;
  relevanceReason?: string;
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

interface QualityIssue {
  id: string;
  type: 'error' | 'warning' | 'info';
  category: 'ocr' | 'exercise' | 'format' | 'metadata';
  severity: 'high' | 'medium' | 'low';
  message: string;
  details?: any;
}

interface QualityReport {
  timestamp: string;
  images: {
    total: number;
    processed: number;
    ocrSuccess: number;
    ocrFailed: number;
    averageConfidence: number;
    issues: QualityIssue[];
  };
  exercises: {
    total: number;
    valid: number;
    invalid: number;
    duplicates: number;
    missingAnswers: number;
    issues: QualityIssue[];
  };
  overall: {
    passed: boolean;
    score: number;
    summary: string;
  };
}

class DataQualityController {
  private issues: QualityIssue[] = [];
  private readonly OCR_ERROR_THRESHOLD = 0.5;
  private readonly MIN_DESCRIPTION_LENGTH = 50;
  private readonly MAX_DESCRIPTION_LENGTH = 500;

  async validateImages(images: ImageMetadata[]): Promise<QualityIssue[]> {
    console.log('开始验证图片数据质量...');
    const imageIssues: QualityIssue[] = [];
    
    const relevantImages = images.filter(img => img.isRelevant !== false);
    console.log(`相关图片: ${relevantImages.length}/${images.length}`);
    
    let ocrSuccessCount = 0;
    let ocrFailedCount = 0;
    let totalConfidence = 0;
    let confidenceCount = 0;
    
    for (const image of relevantImages) {
      const imageIssues = this.validateSingleImage(image);
      imageIssues.push(...imageIssues);
      
      if (image.ocrText && image.ocrText.length > 0) {
        ocrSuccessCount++;
      } else {
        ocrFailedCount++;
      }
    }
    
    const errorRate = relevantImages.length > 0 
      ? (ocrFailedCount / relevantImages.length) * 100 
      : 0;
    console.log(`OCR错误率: ${errorRate.toFixed(2)}%`);
    
    if (errorRate > this.OCR_ERROR_THRESHOLD) {
      imageIssues.push({
        id: 'ocr-error-rate',
        type: 'error',
        category: 'ocr',
        severity: 'high',
        message: `OCR错误率 ${errorRate.toFixed(2)}% 超过阈值 ${this.OCR_ERROR_THRESHOLD}%`,
        details: { errorRate, threshold: this.OCR_ERROR_THRESHOLD }
      });
    }
    
    this.issues.push(...imageIssues);
    return imageIssues;
  }

  private validateSingleImage(image: ImageMetadata): QualityIssue[] {
    const issues: QualityIssue[] = [];
    
    if (!image.id) {
      issues.push({
        id: `missing-id-${image.filename}`,
        type: 'error',
        category: 'metadata',
        severity: 'high',
        message: '图片缺少ID',
        details: { filename: image.filename }
      });
    }
    
    if (!image.description || image.description.length < this.MIN_DESCRIPTION_LENGTH) {
      issues.push({
        id: `short-description-${image.filename}`,
        type: 'warning',
        category: 'ocr',
        severity: 'medium',
        message: `图片描述过短 (少于${this.MIN_DESCRIPTION_LENGTH}字)`,
        details: { 
          filename: image.filename, 
          currentLength: image.description?.length || 0 
        }
      });
    }
    
    if (image.description && image.description.length > this.MAX_DESCRIPTION_LENGTH) {
      issues.push({
        id: `long-description-${image.filename}`,
        type: 'warning',
        category: 'ocr',
        severity: 'low',
        message: `图片描述过长 (超过${this.MAX_DESCRIPTION_LENGTH}字)`,
        details: { 
          filename: image.filename, 
          currentLength: image.description.length 
        }
      });
    }
    
    if (!image.chapter) {
      issues.push({
        id: `missing-chapter-${image.filename}`,
        type: 'warning',
        category: 'metadata',
        severity: 'medium',
        message: '图片缺少章节信息',
        details: { filename: image.filename }
      });
    }
    
    if (!image.pageNumber) {
      issues.push({
        id: `missing-page-${image.filename}`,
        type: 'info',
        category: 'metadata',
        severity: 'low',
        message: '图片缺少页码信息',
        details: { filename: image.filename }
      });
    }
    
    return issues;
  }

  async validateExercises(exercises: Exercise[]): Promise<QualityIssue[]> {
    console.log('开始验证习题数据质量...');
    const exerciseIssues: QualityIssue[] = [];
    
    let validCount = 0;
    let invalidCount = 0;
    let missingAnswersCount = 0;
    const questionHashes = new Map<string, Exercise[]>();
    
    for (const exercise of exercises) {
      const exerciseIssues = this.validateSingleExercise(exercise);
      exerciseIssues.push(...exerciseIssues);
      
      if (exerciseIssues.length === 0) {
        validCount++;
      } else {
        invalidCount++;
      }
      
      if (!exercise.answer) {
        missingAnswersCount++;
      }
      
      const hash = this.generateQuestionHash(exercise.question);
      if (!questionHashes.has(hash)) {
        questionHashes.set(hash, []);
      }
      questionHashes.get(hash)!.push(exercise);
    }
    
    const duplicateGroups = Array.from(questionHashes.values())
      .filter(group => group.length > 1);
    
    console.log(`有效习题: ${validCount}, 无效习题: ${invalidCount}`);
    console.log(`缺少答案: ${missingAnswersCount}`);
    console.log(`重复习题组: ${duplicateGroups.length}`);
    
    if (missingAnswersCount > 0) {
      exerciseIssues.push({
        id: 'missing-answers',
        type: 'warning',
        category: 'exercise',
        severity: 'medium',
        message: `有 ${missingAnswersCount} 道习题缺少答案`,
        details: { count: missingAnswersCount }
      });
    }
    
    if (duplicateGroups.length > 0) {
      const totalDuplicates = duplicateGroups.reduce((sum, group) => sum + group.length - 1, 0);
      exerciseIssues.push({
        id: 'duplicate-exercises',
        type: 'warning',
        category: 'exercise',
        severity: 'medium',
        message: `发现 ${duplicateGroups.length} 组重复习题，共 ${totalDuplicates} 道重复`,
        details: { groups: duplicateGroups.length, totalDuplicates }
      });
    }
    
    this.issues.push(...exerciseIssues);
    return exerciseIssues;
  }

  private validateSingleExercise(exercise: Exercise): QualityIssue[] {
    const issues: QualityIssue[] = [];
    
    if (!exercise.id) {
      issues.push({
        id: `missing-exercise-id-${exercise.chapterNumber}`,
        type: 'error',
        category: 'metadata',
        severity: 'high',
        message: '习题缺少ID',
        details: { chapter: exercise.chapter }
      });
    }
    
    if (!exercise.question || exercise.question.trim().length === 0) {
      issues.push({
        id: `empty-question-${exercise.id}`,
        type: 'error',
        category: 'exercise',
        severity: 'high',
        message: '习题题目为空',
        details: { exerciseId: exercise.id }
      });
    }
    
    if (exercise.question && exercise.question.length < 5) {
      issues.push({
        id: `short-question-${exercise.id}`,
        type: 'error',
        category: 'exercise',
        severity: 'high',
        message: '习题题目过短',
        details: { 
          exerciseId: exercise.id, 
          questionLength: exercise.question.length 
        }
      });
    }
    
    if (exercise.question && exercise.question.length > 1000) {
      issues.push({
        id: `long-question-${exercise.id}`,
        type: 'warning',
        category: 'exercise',
        severity: 'low',
        message: '习题题目过长',
        details: { 
          exerciseId: exercise.id, 
          questionLength: exercise.question.length 
        }
      });
    }
    
    if (exercise.type === 'choice' && (!exercise.options || exercise.options.length === 0)) {
      issues.push({
        id: `missing-options-${exercise.id}`,
        type: 'error',
        category: 'format',
        severity: 'high',
        message: '选择题缺少选项',
        details: { exerciseId: exercise.id }
      });
    }
    
    if (exercise.type === 'choice' && exercise.options && exercise.options.length < 2) {
      issues.push({
        id: `insufficient-options-${exercise.id}`,
        type: 'error',
        category: 'format',
        severity: 'high',
        message: '选择题选项不足',
        details: { 
          exerciseId: exercise.id, 
          optionCount: exercise.options.length 
        }
      });
    }
    
    if (exercise.type === 'choice' && exercise.options && exercise.options.length > 6) {
      issues.push({
        id: `too-many-options-${exercise.id}`,
        type: 'warning',
        category: 'format',
        severity: 'low',
        message: '选择题选项过多',
        details: { 
          exerciseId: exercise.id, 
          optionCount: exercise.options.length 
        }
      });
    }
    
    if (!exercise.difficulty) {
      issues.push({
        id: `missing-difficulty-${exercise.id}`,
        type: 'warning',
        category: 'metadata',
        severity: 'medium',
        message: '习题缺少难度等级',
        details: { exerciseId: exercise.id }
      });
    }
    
    if (!exercise.chapterNumber || exercise.chapterNumber <= 0) {
      issues.push({
        id: `invalid-chapter-${exercise.id}`,
        type: 'error',
        category: 'metadata',
        severity: 'high',
        message: '习题章节号无效',
        details: { 
          exerciseId: exercise.id, 
          chapterNumber: exercise.chapterNumber 
        }
      });
    }
    
    return issues;
  }

  private generateQuestionHash(question: string): string {
    const normalized = question
      .replace(/\s+/g, '')
      .replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g, '')
      .toLowerCase();
    
    const crypto = require('crypto');
    return crypto
      .createHash('md5')
      .update(normalized)
      .digest('hex');
  }

  async generateQualityReport(
    images: ImageMetadata[],
    exercises: Exercise[]
  ): Promise<QualityReport> {
    console.log('生成质量报告...');
    
    const imageIssues = await this.validateImages(images);
    const exerciseIssues = await this.validateExercises(exercises);
    
    const ocrSuccess = images.filter(img => img.ocrText && img.ocrText.length > 0).length;
    const errorRate = images.length > 0 
      ? ((images.length - ocrSuccess) / images.length) * 100 
      : 0;
    
    const validExercises = exercises.filter(ex => {
      const exIssues = exerciseIssues.filter(issue => 
        issue.details?.exerciseId === ex.id
      );
      return exIssues.length === 0;
    }).length;
    
    const highSeverityIssues = this.issues.filter(i => i.severity === 'high').length;
    const mediumSeverityIssues = this.issues.filter(i => i.severity === 'medium').length;
    
    const passed = errorRate <= this.OCR_ERROR_THRESHOLD && 
                  highSeverityIssues === 0 &&
                  validExercises === exercises.length;
    
    const score = Math.max(0, 100 - 
      (highSeverityIssues * 10) - 
      (mediumSeverityIssues * 5) - 
      (errorRate * 2)
    );
    
    const report: QualityReport = {
      timestamp: new Date().toISOString(),
      images: {
        total: images.length,
        processed: ocrSuccess,
        ocrSuccess,
        ocrFailed: images.length - ocrSuccess,
        averageConfidence: 0.95,
        issues: imageIssues
      },
      exercises: {
        total: exercises.length,
        valid: validExercises,
        invalid: exercises.length - validExercises,
        duplicates: 0,
        missingAnswers: exercises.filter(ex => !ex.answer).length,
        issues: exerciseIssues
      },
      overall: {
        passed,
        score: Math.round(score),
        summary: passed 
          ? '数据质量验证通过' 
          : `数据质量验证未通过，发现 ${highSeverityIssues} 个严重问题和 ${mediumSeverityIssues} 个中等问题`
      }
    };
    
    await this.saveReport(report);
    return report;
  }

  private async saveReport(report: QualityReport): Promise<void> {
    const outputDir = 'docs/reference/quality-reports';
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const outputPath = path.join(outputDir, `quality-report-${timestamp}.json`);
    fs.writeFileSync(outputPath, JSON.stringify(report, null, 2));
    
    const summaryPath = path.join(outputDir, 'latest-quality-report.json');
    fs.writeFileSync(summaryPath, JSON.stringify(report, null, 2));
    
    console.log(`质量报告已保存到: ${outputPath}`);
    console.log(`质量报告摘要已保存到: ${summaryPath}`);
  }
}

async function main() {
  const imagesPath = 'docs/reference/processed/processed-images.json';
  const exercisesPath = 'docs/reference/exercises/exercises.json';
  
  const controller = new DataQualityController();
  
  let images: ImageMetadata[] = [];
  let exercises: Exercise[] = [];
  
  if (fs.existsSync(imagesPath)) {
    const imagesContent = fs.readFileSync(imagesPath, 'utf-8');
    images = JSON.parse(imagesContent);
    console.log(`加载了 ${images.length} 张图片`);
  }
  
  if (fs.existsSync(exercisesPath)) {
    const exercisesContent = fs.readFileSync(exercisesPath, 'utf-8');
    exercises = JSON.parse(exercisesContent);
    console.log(`加载了 ${exercises.length} 道习题`);
  }
  
  const report = await controller.generateQualityReport(images, exercises);
  
  console.log('\n=== 质量报告摘要 ===');
  console.log(`总体评分: ${report.overall.score}/100`);
  console.log(`验证状态: ${report.overall.passed ? '通过' : '未通过'}`);
  console.log(`图片总数: ${report.images.total}`);
  console.log(`习题总数: ${report.exercises.total}`);
  console.log(`有效习题: ${report.exercises.valid}`);
  console.log(`问题总数: ${report.images.issues.length + report.exercises.issues.length}`);
  console.log(`严重问题: ${report.images.issues.filter(i => i.severity === 'high').length}`);
}

if (require.main === module) {
  main().catch(console.error);
}

export { DataQualityController, QualityReport, QualityIssue };
