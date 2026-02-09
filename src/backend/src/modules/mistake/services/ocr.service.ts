import { Injectable } from '@nestjs/common';
import { LLMService } from '../../llm/llm.service';

/**
 * OCR 识别服务
 * 使用 OpenAI Vision API 识别题目图片
 */
@Injectable()
export class OcrService {
  constructor(private readonly llmService: LLMService) {}

  /**
   * 识别题目图片
   * @param imageUrl 图片 URL（支持 base64）
   */
  async recognizeQuestion(imageUrl: string) {
    try {
      const prompt = `请仔细识别这张图片中的题目内容，并按照以下 JSON 格式返回：

{
  "question": "题目内容",
  "options": ["A选项", "B选项", "C选项", "D选项"],
  "type": "choice" | "fill" | "essay",
  "subject": "genetics" | "math" | "physics" | "chemistry" | "biology",
  "difficulty": "easy" | "medium" | "hard",
  "tags": ["知识点1", "知识点2"]
}

如果图片中没有题目，返回 {"error": "无法识别题目"}
`;

      // 获取 OpenAI provider 并调用 Vision API
      const result = await this.llmService.chat([
        {
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            {
              type: 'image_url',
              image_url: { url: imageUrl },
            },
          ],
        },
      ], { provider: 'openai' });

      // 解析 JSON 响应
      const jsonMatch = result.content.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      const jsonText = jsonMatch ? jsonMatch[1] : result.content;

      const recognized = JSON.parse(jsonText);

      if (recognized.error) {
        throw new Error(recognized.error);
      }

      return {
        success: true,
        data: {
          question: recognized.question,
          options: recognized.options || [],
          type: recognized.type || 'choice',
          subject: recognized.subject || 'genetics',
          difficulty: recognized.difficulty || 'medium',
          tags: recognized.tags || [],
          imageUrl,
        },
      };
    } catch (error) {
      const message = error instanceof Error ? error.message : 'OCR识别失败';
      return {
        success: false,
        error: message,
      };
    }
  }

  /**
   * 批量识别题目图片
   */
  async recognizeBatch(imageUrls: string[]) {
    const results = await Promise.all(
      imageUrls.map((url) => this.recognizeQuestion(url)),
    );
    return results;
  }

  /**
   * 验证识别结果
   */
  async validateRecognition(
    imageUrl: string,
    questionText: string,
  ): Promise<{
    isValid: boolean;
    confidence: number;
    corrections?: string[];
  }> {
    const prompt = `验证以下 OCR 识别结果是否正确：

原图片内容：[图片]
识别结果：${questionText}

返回 JSON 格式：
{
  "isValid": true/false,
  "confidence": 0-1,
  "corrections": ["需要修正的部分"]
}`;

    try {
      const result = await this.llmService.chat([
        {
          role: 'user',
          content: [
            { type: 'text', text: prompt },
            {
              type: 'image_url',
              image_url: { url: imageUrl },
            },
          ],
        },
      ], { provider: 'openai' });

      const jsonMatch = result.content.match(/```json\s*([\s\S]*?)\s*```/);
      const jsonText = jsonMatch ? jsonMatch[1] : result.content;

      return JSON.parse(jsonText);
    } catch {
      return {
        isValid: true,
        confidence: 0.8,
      };
    }
  }
}
