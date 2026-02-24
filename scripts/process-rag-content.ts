import fs from 'fs';
import path from 'path';
import { ImageProcessor, ImageMetadata } from './process-images-ocr';
import { ExerciseExtractor, Exercise } from './extract-exercises';
import { DataQualityController, QualityReport } from './quality-control';
import { RAGDatabaseUpdater } from './update-rag-database';

interface ProcessConfig {
  documentPath: string;
  imageDir: string;
  outputDir: string;
  ragDatabasePath: string;
  processImages: boolean;
  processExercises: boolean;
  runQualityCheck: boolean;
  updateRAG: boolean;
  removeExistingExercises: boolean;
}

class RAGContentProcessor {
  async process(config: ProcessConfig): Promise<{
    images: ImageMetadata[];
    exercises: Exercise[];
    qualityReport: QualityReport | null;
  }> {
    console.log('=== 开始处理RAG内容 ===\n');
    
    let images: ImageMetadata[] = [];
    let exercises: Exercise[] = [];
    let qualityReport: QualityReport | null = null;
    
    if (config.processImages) {
      console.log('\n### 步骤1: 处理图片 ###');
      const imageProcessor = new ImageProcessor();
      images = await imageProcessor.processDocument(config.documentPath);
      console.log(`发现 ${images.length} 张图片`);
      
      await imageProcessor.processImagesWithOCR(config.imageDir, config.outputDir);
      console.log('图片处理完成');
    }
    
    if (config.processExercises) {
      console.log('\n### 步骤2: 提取习题 ###');
      const exerciseExtractor = new ExerciseExtractor();
      exercises = await exerciseExtractor.extractFromDocument(
        config.documentPath,
        config.ragDatabasePath
      );
      console.log(`提取了 ${exercises.length} 道习题`);
    }
    
    if (config.runQualityCheck) {
      console.log('\n### 步骤3: 质量检查 ###');
      const qualityController = new DataQualityController();
      
      const imagesPath = path.join(config.outputDir, 'processed-images.json');
      const exercisesPath = path.join(config.outputDir, '..', 'exercises', 'exercises.json');
      
      let loadedImages: ImageMetadata[] = [];
      let loadedExercises: Exercise[] = [];
      
      if (fs.existsSync(imagesPath)) {
        const imagesContent = fs.readFileSync(imagesPath, 'utf-8');
        loadedImages = JSON.parse(imagesContent);
      }
      
      if (fs.existsSync(exercisesPath)) {
        const exercisesContent = fs.readFileSync(exercisesPath, 'utf-8');
        loadedExercises = JSON.parse(exercisesContent);
      }
      
      qualityReport = await qualityController.generateQualityReport(
        loadedImages,
        loadedExercises
      );
      
      console.log('\n=== 质量检查结果 ===');
      console.log(`总体评分: ${qualityReport.overall.score}/100`);
      console.log(`验证状态: ${qualityReport.overall.passed ? '通过' : '未通过'}`);
      console.log(`图片问题: ${qualityReport.images.issues.length}`);
      console.log(`习题问题: ${qualityReport.exercises.issues.length}`);
      
      if (!qualityReport.overall.passed) {
        console.warn('\n警告: 数据质量验证未通过，请检查问题');
        console.warn('可以查看质量报告了解详细信息');
      }
    }
    
    if (config.updateRAG) {
      console.log('\n### 步骤4: 更新RAG数据库 ###');
      const ragUpdater = new RAGDatabaseUpdater();
      
      let loadedImages: ImageMetadata[] = [];
      let loadedExercises: Exercise[] = [];
      
      if (config.processImages || fs.existsSync(path.join(config.outputDir, 'processed-images.json'))) {
        const imagesPath = path.join(config.outputDir, 'processed-images.json');
        const imagesContent = fs.readFileSync(imagesPath, 'utf-8');
        loadedImages = JSON.parse(imagesContent);
      }
      
      if (config.processExercises || fs.existsSync(path.join(config.outputDir, '..', 'exercises', 'exercises.json'))) {
        const exercisesPath = path.join(config.outputDir, '..', 'exercises', 'exercises.json');
        const exercisesContent = fs.readFileSync(exercisesPath, 'utf-8');
        loadedExercises = JSON.parse(exercisesContent);
      }
      
      await ragUpdater.updateDatabase(
        loadedImages,
        loadedExercises,
        config.removeExistingExercises
      );
      console.log('RAG数据库更新完成');
    }
    
    console.log('\n=== 处理完成 ===');
    return {
      images,
      exercises,
      qualityReport
    };
  }

  printUsage(): void {
    console.log(`
RAG内容处理器

用法:
  npm run process:rag:content -- [选项]

选项:
  --images              处理图片（OCR和描述生成）
  --exercises           提取习题
  --quality             运行质量检查
  --update-rag          更新RAG数据库
  --remove-exercises    从RAG数据库移除现有习题
  --all                 执行所有步骤（默认）

示例:
  # 仅处理图片
  npm run process:rag:content -- --images
  
  # 仅提取习题
  npm run process:rag:content -- --exercises
  
  # 执行完整流程
  npm run process:rag:content -- --all
  
  # 处理图片和习题，但不更新RAG
  npm run process:rag:content -- --images --exercises --quality
    `);
  }
}

async function main() {
  const args = process.argv.slice(2);
  
  if (args.includes('--help') || args.includes('-h')) {
    const processor = new RAGContentProcessor();
    processor.printUsage();
    process.exit(0);
  }
  
  const processImages = args.includes('--images') || args.includes('--all');
  const processExercises = args.includes('--exercises') || args.includes('--all');
  const runQualityCheck = args.includes('--quality') || args.includes('--all');
  const updateRAG = args.includes('--update-rag') || args.includes('--all');
  const removeExistingExercises = args.includes('--remove-exercises') || args.includes('--all');
  
  if (!processImages && !processExercises && !runQualityCheck && !updateRAG) {
    console.log('错误: 请指定至少一个处理选项');
    console.log('使用 --help 查看使用说明');
    process.exit(1);
  }
  
  const config: ProcessConfig = {
    documentPath: 'docs/reference/full.md',
    imageDir: 'docs/reference',
    outputDir: 'docs/reference/processed',
    ragDatabasePath: 'data/genetics-rag-final.json',
    processImages,
    processExercises,
    runQualityCheck,
    updateRAG,
    removeExistingExercises
  };
  
  const processor = new RAGContentProcessor();
  
  try {
    await processor.process(config);
  } catch (error) {
    console.error('处理失败:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch(console.error);
}

export { RAGContentProcessor, ProcessConfig };
