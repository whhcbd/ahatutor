import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import FormData from 'form-data';
import * as fs from 'fs/promises';
import * as path from 'path';
import * as crypto from 'crypto';
import { createReadStream } from 'fs';
import * as unzipper from 'unzipper';

export interface MinerUParseResult {
  markdown: string;
  images: string[];
  layouts: string[];
  metadata: {
    filename: string;
    originalFilename: string;
    size: number;
    pages?: number;
  };
}

export interface MinerUParseOptions {
  timeout?: number;
  outputPath?: string;
  keepZip?: boolean;
}

@Injectable()
export class MinerUService {
  private readonly logger = new Logger(MinerUService.name);
  private readonly baseUrl: string;
  private readonly apiEndpoint: string;
  private readonly defaultTimeout: number;

  constructor(private readonly configService: ConfigService) {
    this.baseUrl = this.configService.get<string>('MINERU_BASE_URL', 'http://3a092f40.r6.cpolar.cn');
    this.apiEndpoint = this.configService.get<string>('MINERU_API_ENDPOINT', '/api/convert_pdf');
    this.defaultTimeout = this.configService.get<number>('MINERU_TIMEOUT', 600000);

    this.logger.log(`MinerU service initialized with URL: ${this.baseUrl}`);
  }

  /**
   * 解析 PDF 文件
   */
  async parsePDF(
    filePath: string,
    options: MinerUParseOptions = {},
  ): Promise<MinerUParseResult> {
    const startTime = Date.now();
    const timeout = options.timeout || this.defaultTimeout;
    const outputPath = options.outputPath || this.getDefaultOutputPath(filePath);
    const keepZip = options.keepZip ?? false;

    try {
      this.logger.log(`Starting PDF parsing: ${filePath}`);
      this.logger.log(`Timeout set to ${timeout}ms`);

      const originalFilename = path.basename(filePath);

      const zipBuffer = await this.uploadToMinerU(filePath, timeout);

      const result = await this.processZipResult(zipBuffer, outputPath, originalFilename);

      if (!keepZip) {
        await this.cleanupZip(zipBuffer);
      }

      const processingTime = Date.now() - startTime;
      this.logger.log(`PDF parsing completed in ${processingTime}ms`);
      this.logger.log(`Extracted ${result.images.length} images, ${result.layouts.length} layout images`);

      return result;
    } catch (error) {
      this.logger.error(`PDF parsing failed: ${filePath}`, error);
      throw new Error(`Failed to parse PDF with MinerU: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * 上传文件到 MinerU 服务
   */
  private async uploadToMinerU(filePath: string, timeout: number): Promise<Buffer> {
    const url = `${this.baseUrl}${this.apiEndpoint}`;

    this.logger.log(`Uploading to MinerU: ${url}`);

    const form = new FormData();
    const fileStream = createReadStream(filePath);
    form.append('file', fileStream);

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        ...form.getHeaders(),
      },
      body: form as any,
      signal: AbortSignal.timeout(timeout),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`MinerU API error (${response.status}): ${errorText}`);
    }

    this.logger.log('Received ZIP response from MinerU');

    const arrayBuffer = await response.arrayBuffer();
    return Buffer.from(arrayBuffer);
  }

  /**
   * 处理 ZIP 结果
   */
  private async processZipResult(
    zipBuffer: Buffer,
    outputPath: string,
    originalFilename: string,
  ): Promise<MinerUParseResult> {
    this.logger.log('Processing ZIP result...');

    await fs.mkdir(outputPath, { recursive: true });

    const zipPath = path.join(outputPath, `temp-${Date.now()}.zip`);
    await fs.writeFile(zipPath, zipBuffer);

    const markdownContent = await this.extractZipContent(zipPath, outputPath);

    const images = await this.listFiles(path.join(outputPath, 'images'));
    const layouts = await this.listFiles(path.join(outputPath, 'layout'));

    await fs.unlink(zipPath).catch(() => {});

    const stats = await fs.stat(path.join(outputPath, `${originalFilename}.md`));

    return {
      markdown: markdownContent,
      images: images.map(img => path.join(outputPath, 'images', img)),
      layouts: layouts.map(layout => path.join(outputPath, 'layout', layout)),
      metadata: {
        filename: originalFilename,
        originalFilename,
        size: stats.size,
      },
    };
  }

  /**
   * 提取 ZIP 内容
   */
  private async extractZipContent(zipPath: string, outputPath: string): Promise<string> {
    let markdownContent = '';

    await new Promise<void>((resolve, reject) => {
      createReadStream(zipPath)
        .pipe(unzipper.Extract({ path: outputPath }))
        .on('close', () => {
          this.logger.log('ZIP extracted successfully');
          resolve();
        })
        .on('error', (error: any) => {
          this.logger.error('ZIP extraction failed:', error);
          reject(error);
        });
    });

    const files = await fs.readdir(outputPath);
    const mdFile = files.find(f => f.endsWith('.md'));

    if (mdFile) {
      markdownContent = await fs.readFile(path.join(outputPath, mdFile), 'utf-8');
      this.logger.log(`Markdown content loaded (${markdownContent.length} chars)`);
    }

    return markdownContent;
  }

  /**
   * 列出目录中的文件
   */
  private async listFiles(dirPath: string): Promise<string[]> {
    try {
      const files = await fs.readdir(dirPath);
      return files.filter(f => {
        const ext = path.extname(f).toLowerCase();
        return ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.webp'].includes(ext);
      });
    } catch (error) {
      this.logger.warn(`Failed to list files in ${dirPath}:`, error);
      return [];
    }
  }

  /**
   * 获取默认输出路径
   */
  private getDefaultOutputPath(filePath: string): string {
    const hash = crypto.createHash('md5').update(filePath).digest('hex').substring(0, 8);
    const outputDir = this.configService.get<string>('MINERU_OUTPUT_DIR', './data/mineru-output');
    return path.join(outputDir, `${Date.now()}-${hash}`);
  }

  /**
   * 清理 ZIP 缓冲区
   */
  private async cleanupZip(_zipBuffer: Buffer): Promise<void> {
    this.logger.debug('Cleanup ZIP buffer');
  }

  /**
   * 解析 DOCX 文件（先转换为 PDF，然后解析）
   */
  async parseDocx(_filePath: string, _options: MinerUParseOptions = {}): Promise<MinerUParseResult> {
    throw new Error('DOCX parsing is not yet implemented. Please convert to PDF first.');
  }

  /**
   * 健康检查
   */
  async healthCheck(): Promise<{ healthy: boolean; url: string; error?: string }> {
    try {
      const url = `${this.baseUrl}${this.apiEndpoint}`;

      this.logger.log(`MinerU health check: ${url}`);

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);

      try {
        const response = await fetch(url, {
          method: 'HEAD',
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        if (response.ok || response.status === 405) {
          this.logger.log('MinerU service is healthy');
          return { healthy: true, url };
        }

        return {
          healthy: false,
          url,
          error: `Status code: ${response.status}`,
        };
      } catch (error) {
        clearTimeout(timeoutId);
        throw error;
      }
    } catch (error) {
      this.logger.warn('MinerU health check failed:', error);
      return {
        healthy: false,
        url: this.baseUrl,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * 获取服务配置
   */
  getConfig() {
    return {
      baseUrl: this.baseUrl,
      apiEndpoint: this.apiEndpoint,
      defaultTimeout: this.defaultTimeout,
    };
  }
}
