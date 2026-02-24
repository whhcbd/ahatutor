import fs from 'fs';
import path from 'path';
import axios from 'axios';

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
  isRelevant: boolean;
  relevanceReason?: string;
}

interface OCRResponse {
  text: string;
  confidence: number;
  error?: string;
}

const GLM_OCR_API_KEY = 'f44157a142064157934401d5e24375ec.64V3q3g98k7gaJYS';
const GLM_OCR_API_URL = 'https://open.bigmodel.cn/api/paas/v4/ocr';

class ImageProcessor {
  private imageMetadata: Map<string, ImageMetadata> = new Map();
  private processedImages: Set<string> = new Set();

  async processDocument(documentPath: string): Promise<ImageMetadata[]> {
    console.log('开始处理文档:', documentPath);
    
    const content = fs.readFileSync(documentPath, 'utf-8');
    const lines = content.split('\n');
    
    let currentPage = 1;
    let currentChapter = '';
    let currentSection = '';
    let contextLines: string[] = [];
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      if (line.match(/^第[一二三四五六七八九十]+章/)) {
        currentChapter = line;
        currentPage = 1;
      } else if (line.match(/^第[一二三四五六七八九十]+节/)) {
        currentSection = line;
      } else if (line.match(/^[0-9]+$/)) {
        currentPage = parseInt(line, 10);
      }
      
      if (line.match(/^!\[\]\(images\/[^)]+\)/)) {
        const imageMatch = line.match(/^!\[\]\((images\/[^)]+)\)/);
        if (imageMatch) {
          const imagePath = imageMatch[1];
          const filename = path.basename(imagePath);
          const imageId = this.generateImageId(filename);
          
          const metadata: ImageMetadata = {
            id: imageId,
            filename,
            path: imagePath,
            pageNumber: currentPage,
            chapter: currentChapter,
            section: currentSection,
            context: contextLines.slice(-3).join('\n'),
            imageType: this.classifyImageType(filename, contextLines),
          };
          
          this.imageMetadata.set(imageId, metadata);
          console.log(`发现图片: ${filename} (第${currentPage}页, ${currentChapter})`);
        }
      } else if (line.length > 0) {
        contextLines.push(line);
        if (contextLines.length > 10) {
          contextLines.shift();
        }
      }
    }
    
    return Array.from(this.imageMetadata.values());
  }

  async processImagesWithOCR(imageDir: string, outputDir: string): Promise<void> {
    console.log('开始OCR处理图片目录:', imageDir);
    
    const images = Array.from(this.imageMetadata.values());
    const results: ImageMetadata[] = [];
    let relevantCount = 0;
    let irrelevantCount = 0;
    
    for (const image of images) {
      if (this.processedImages.has(image.id)) {
        console.log(`跳过已处理的图片: ${image.filename}`);
        continue;
      }
      
      const fullPath = path.join(imageDir, image.filename);
      
      if (!fs.existsSync(fullPath)) {
        console.warn(`图片文件不存在: ${fullPath}`);
        image.description = '图片文件不存在';
        image.isRelevant = false;
        image.relevanceReason = '文件不存在';
        results.push(image);
        continue;
      }
      
      try {
        console.log(`处理图片: ${image.filename}`);
        const ocrResult = await this.callGLMOCR(fullPath);
        
        if (ocrResult.text) {
          image.ocrText = ocrResult.text;
          image.description = await this.generateDescription(image, ocrResult.text);
          
          const relevance = await this.evaluateImageRelevance(image, ocrResult.text);
          image.isRelevant = relevance.isRelevant;
          image.relevanceReason = relevance.reason;
          
          if (relevance.isRelevant) {
            relevantCount++;
            console.log(`OCR成功: ${image.filename}, 置信度: ${ocrResult.confidence}, 相关性: 是`);
          } else {
            irrelevantCount++;
            console.log(`OCR成功: ${image.filename}, 置信度: ${ocrResult.confidence}, 相关性: 否 (${relevance.reason})`);
          }
        } else {
          image.description = await this.generateDescription(image, '');
          
          const relevance = await this.evaluateImageRelevance(image, '');
          image.isRelevant = relevance.isRelevant;
          image.relevanceReason = relevance.reason;
          
          if (relevance.isRelevant) {
            relevantCount++;
            console.log(`OCR无文本: ${image.filename}, 相关性: 是`);
          } else {
            irrelevantCount++;
            console.log(`OCR无文本: ${image.filename}, 相关性: 否 (${relevance.reason})`);
          }
        }
        
        this.processedImages.add(image.id);
        results.push(image);
        
        await this.saveProgress();
      } catch (error) {
        console.error(`处理图片失败: ${image.filename}`, error);
        image.description = await this.generateDescription(image, '');
        image.isRelevant = false;
        image.relevanceReason = '处理失败';
        results.push(image);
      }
    }
    
    console.log(`\n=== 相关性评估结果 ===`);
    console.log(`相关图片: ${relevantCount}`);
    console.log(`不相关图片: ${irrelevantCount}`);
    console.log(`总计: ${results.length}`);
    
    const relevantImages = results.filter(img => img.isRelevant);
    await this.saveResults(relevantImages, outputDir);
    await this.saveAllResults(results, outputDir);
  }

  private async callGLMOCR(imagePath: string): Promise<OCRResponse> {
    try {
      const imageBuffer = fs.readFileSync(imagePath);
      const base64Image = imageBuffer.toString('base64');
      
      const response = await axios.post(
        GLM_OCR_API_URL,
        {
          model: 'glm-4v',
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'image_url',
                  image_url: {
                    url: `data:image/jpeg;base64,${base64Image}`
                  }
                },
                {
                  type: 'text',
                  text: '请识别这张图片中的所有文字内容，包括标题、标签、数据等。如果是图表，请同时识别图表中的所有数据点。'
                }
              ]
            }
          ],
          max_tokens: 1000,
          temperature: 0.1
        },
        {
          headers: {
            'Authorization': `Bearer ${GLM_OCR_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      const content = response.data.choices[0].message.content;
      return {
        text: content,
        confidence: 0.95
      };
    } catch (error: any) {
      console.error('OCR API调用失败:', error.response?.data || error.message);
      return {
        text: '',
        confidence: 0,
        error: error.message
      };
    }
  }

  private async generateDescription(image: ImageMetadata, ocrText: string): Promise<string> {
    try {
      const context = image.context || '';
      const imageType = this.getImageTypeLabel(image.imageType);
      
      const prompt = `请为这张图片生成一个详细、准确的描述。

图片信息:
- 类型: ${imageType}
- 所在章节: ${image.chapter || '未知'}
- 上下文: ${context.slice(0, 200)}
${ocrText ? `- OCR识别的文本: ${ocrText}` : ''}

要求:
1. 描述要详细、准确，能够帮助理解图片内容
2. 如果是图表，要说明图表的类型、坐标轴、数据趋势等
3. 如果是示意图，要说明展示的概念或过程
4. 如果是照片，要描述照片的主要内容
5. 描述要用中文，长度在100-300字之间`;

      const response = await axios.post(
        GLM_OCR_API_URL,
        {
          model: 'glm-4v',
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 500,
          temperature: 0.3
        },
        {
          headers: {
            'Authorization': `Bearer ${GLM_OCR_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );
      
      return response.data.choices[0].message.content.trim();
    } catch (error) {
      console.error('生成描述失败:', error);
      return `这是一个${this.getImageTypeLabel(image.imageType)}图片`;
    }
  }

  private classifyImageType(filename: string, context: string[]): ImageMetadata['imageType'] {
    const lowerFilename = filename.toLowerCase();
    const contextText = context.join(' ').toLowerCase();
    
    if (lowerFilename.includes('chart') || lowerFilename.includes('graph') || 
        contextText.includes('图') || contextText.includes('曲线') || 
        contextText.includes('分布')) {
      return 'chart';
    }
    
    if (lowerFilename.includes('diagram') || lowerFilename.includes('scheme') ||
        contextText.includes('示意图') || contextText.includes('流程图') ||
        contextText.includes('结构图')) {
      return 'diagram';
    }
    
    if (lowerFilename.includes('illustration') || lowerFilename.includes('figure')) {
      return 'illustration';
    }
    
    if (lowerFilename.includes('photo')) {
      return 'photo';
    }
    
    return 'other';
  }

  private async evaluateImageRelevance(image: ImageMetadata, ocrText: string): Promise<{ isRelevant: boolean; reason: string }> {
    const context = image.context || '';
    const lowerContext = context.toLowerCase();
    const lowerOcrText = ocrText.toLowerCase();
    
    const irrelevanceIndicators = [
      { pattern: /qr\s*code|二维码/i, reason: '包含二维码' },
      { pattern: /版权|copyright|isbn|cip数据/i, reason: '版权信息' },
      { pattern: /登录|注册|用户名|密码/i, reason: '登录界面' },
      { pattern: /应用|app|abook/i, reason: '应用下载界面' },
      { pattern: /课程|数字课程|网课/i, reason: '课程介绍' },
      { pattern: /出版|发行|出版社/i, reason: '出版信息' },
      { pattern: /策划编辑|责任编辑|封面设计/i, reason: '编辑信息' },
      { pattern: /目录|index|contents/i, reason: '目录页' },
      { pattern: /封底|封面|书名/i, reason: '封面信息' }
    ];
    
    for (const indicator of irrelevanceIndicators) {
      if (indicator.pattern.test(lowerContext) || indicator.pattern.test(lowerOcrText)) {
        return {
          isRelevant: false,
          reason: indicator.reason
        };
      }
    }
    
    const geneticsKeywords = [
      '遗传', '基因', '染色体', 'dna', 'rna', '孟德尔', '分离', 
      '自由组合', '显性', '隐性', '杂交', '表型', '基因型',
      '突变', '重组', '连锁', '伴性遗传', '数量性状', '质量性状',
      '减数分裂', '有丝分裂', '配子', '合子', '纯合', '杂合',
      '等位基因', '非等位基因', '上位', '互补', '致死', '复等位',
      '群体', '频率', '哈代', '温伯格', '连锁图', '交换值',
      '核型', '核型分析', '染色体畸变', '缺失', '重复', '倒位',
      '易位', '基因表达', '转录', '翻译', '调控', '启动子',
      '增强子', '内含子', '外显子', '密码子', '反密码子',
      '中心法则', '复制', '转录', '翻译', '逆转录', '基因工程',
      '载体', '质粒', '限制酶', '连接酶', '转化', '转导',
      '转染', '基因克隆', 'pcr', '电泳', '探针', '印迹',
      'southern', 'northern', 'western', 'blotting', '测序', '基因组',
      '基因图谱', '物理图谱', '连锁图谱', '基因定位', '图位克隆',
      '肿瘤', '癌症', '癌基因', '抑癌基因', '遗传病', '先天',
      '代谢缺陷', '酶', '生化', '途径', '通路', '代谢'
    ];
    
    const hasGeneticsContext = geneticsKeywords.some(keyword => 
      lowerContext.includes(keyword.toLowerCase()) || 
      lowerOcrText.includes(keyword.toLowerCase())
    );
    
    if (!hasGeneticsContext) {
      return {
        isRelevant: false,
        reason: '不包含遗传学相关内容'
      };
    }
    
    if (image.chapter) {
      const lowerChapter = image.chapter.toLowerCase();
      const hasGeneticsChapter = lowerChapter.includes('遗传') || 
                                  lowerChapter.includes('基因') ||
                                  lowerChapter.includes('染色体') ||
                                  lowerChapter.includes('孟德尔');
      
      if (!hasGeneticsChapter) {
        return {
          isRelevant: false,
          reason: '章节内容不涉及遗传学'
        };
      }
    }
    
    return {
      isRelevant: true,
      reason: '包含遗传学相关内容'
    };
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

  private generateImageId(filename: string): string {
    const ext = path.extname(filename);
    const base = path.basename(filename, ext);
    const hash = this.simpleHash(base);
    return `img_${hash}_${Date.now()}`;
  }

  private simpleHash(str: string): string {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const char = str.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash;
    }
    return Math.abs(hash).toString(16);
  }

  private async saveProgress(): Promise<void> {
    const progress = {
      processedImages: Array.from(this.processedImages),
      timestamp: new Date().toISOString()
    };
    fs.writeFileSync(
      'image-processing-progress.json',
      JSON.stringify(progress, null, 2)
    );
  }

  private async saveResults(results: ImageMetadata[], outputDir: string): Promise<void> {
    const outputPath = path.join(outputDir, 'processed-images.json');
    fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
    console.log(`相关图片已保存到: ${outputPath}`);
  }

  private async saveAllResults(results: ImageMetadata[], outputDir: string): Promise<void> {
    const outputPath = path.join(outputDir, 'all-images-processed.json');
    fs.writeFileSync(outputPath, JSON.stringify(results, null, 2));
    console.log(`所有图片已保存到: ${outputPath}`);
  }
}

async function main() {
  const documentPath = 'docs/reference/full.md';
  const imageDir = path.dirname(documentPath);
  const outputDir = path.join(imageDir, 'processed');
  
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  const processor = new ImageProcessor();
  const images = await processor.processDocument(documentPath);
  console.log(`发现 ${images.length} 张图片`);
  
  await processor.processImagesWithOCR(imageDir, outputDir);
  console.log('图片处理完成');
}

if (require.main === module) {
  main().catch(console.error);
}

export { ImageProcessor, ImageMetadata };
