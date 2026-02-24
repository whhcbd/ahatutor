import { Injectable, Logger } from '@nestjs/common';
import { LLMService } from '../../llm/llm.service';
import { StreamingAnswerInput, StreamingAnswerOutput, StreamingChunk, SkillExecutionResult, SkillType, RetrievalResult } from '@shared/types/skill.types';
import {  } from '@shared/types/agent.types';

/**
 * 流式输出服务
 *
 * 功能：
 * - 基于检索结果的流式答案生成
 * - 支持多种输出风格（简洁、详细、教程）
 * - 实时打字效果
 * - 引用标注
 */
@Injectable()
export class StreamingAnswerService {
  private readonly logger = new Logger(StreamingAnswerService.name);

  constructor(private readonly llmService: LLMService) {}

  /**
   * 生成流式答案
   */
  async generate(
    input: StreamingAnswerInput,
  ): Promise<SkillExecutionResult<StreamingAnswerOutput>> {
    const startTime = Date.now();

    try {
      this.logger.log(`Generating streaming answer for query: ${input.query}`);

      const { query, context, conversationHistory, mode = 'answer', style = 'detailed', streamOptions } = input;

      const prompt = this.buildPrompt(query, context, conversationHistory, mode, style);

      const stream = this.llmService.chatStream(
        [
          { role: 'system', content: this.getSystemPrompt(mode, style) },
          ...((conversationHistory || []) as any),
          { role: 'user' as const, content: prompt },
        ],
        {
          temperature: 0.7,
          maxTokens: 4000,
        },
      );

      const chunks: StreamingChunk[] = [];
      const fullAnswer: string[] = [];
      let tokenCount = 0;

      for await (const chunk of stream) {
        const streamingChunk: StreamingChunk = {
          content: chunk,
          isComplete: false,
          metadata: {
            tokenCount: ++tokenCount,
          },
        };

        chunks.push(streamingChunk);
        fullAnswer.push(chunk);

        if (streamOptions?.onChunk) {
          streamOptions.onChunk(chunk);
        }
      }

      const finalChunk: StreamingChunk = {
        content: '',
        isComplete: true,
        metadata: {
          tokenCount,
        },
      };

      chunks.push(finalChunk);

      if (streamOptions?.onEnd) {
        streamOptions.onEnd();
      }

      const generationTime = Date.now() - startTime;

      const citations = this.extractCitations(fullAnswer.join(''), context);
      const sources = this.extractSources(context);

      this.logger.log(`Streaming answer generated in ${generationTime}ms, ${tokenCount} tokens`);

      const asyncGenerator = (async function* () {
        for (const chunk of chunks) {
          yield chunk;
        }
      })();

      return {
        skill: SkillType.STREAMING_ANSWER,
        success: true,
        data: {
          stream: asyncGenerator,
          fullAnswer: fullAnswer.join(''),
          citations,
          sources,
          generationTime,
        },
        metadata: {
          processingTime: generationTime,
        },
      };
    } catch (error) {
      this.logger.error('Streaming answer generation failed:', error);

      if (input.streamOptions?.onError) {
        input.streamOptions.onError(error instanceof Error ? error : new Error('Unknown error'));
      }

      return {
        skill: SkillType.STREAMING_ANSWER,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        metadata: {
          processingTime: Date.now() - startTime,
        },
      };
    }
  }

  /**
   * 构建提示词
   */
  private buildPrompt(
    query: string,
    context: RetrievalResult[],
    _conversationHistory?: Array<{ role: string; content: string }>,
    _mode: string = 'answer',
    style: string = 'detailed',
  ): string {
    const contextText = context.length > 0
      ? context.map((r, i) => {
          const source = r.metadata.chapter
            ? `[${r.metadata.chapter}${r.metadata.section ? ' - ' + r.metadata.section : ''}]`
            : '[未知章节]';
          return `[参考资料${i + 1} - 来源：${source}] ${r.content}`;
        }).join('\n\n---\n\n')
      : '没有找到相关的参考资料。';

    let prompt = `请**严格基于以下参考资料**回答问题，不要使用参考资料之外的知识。

${contextText}

**重要要求：**
1. **必须使用参考资料中的内容**：答案必须基于提供的参考资料，不能编造或使用外部知识
2. **标注来源**：在回答的每个关键点后，用[参考资料N]标注来自哪个参考资料
3. **明确章节**：在回答中明确说明答案来自课本的哪个章节（如"根据第X章..."）
4. **优先级**：参考资料是唯一的答案来源，如果参考资料不足以回答，请说明

问题：${query}

`;

    if (style === 'concise') {
      prompt += '请用简洁的语言回答，每句话不超过20字，但必须标注来源。';
    } else if (style === 'detailed') {
      prompt += '请详细解释，包括背景、原理和例子。每个关键概念都要标注来自哪个章节和参考资料。';
    } else if (style === 'tutorial') {
      prompt += '请用教学的方式回答，引导思考，分步骤说明。每一步都要说明基于哪个参考资料。';
    }

    return prompt;
  }

  /**
   * 获取系统提示词
   */
  private getSystemPrompt(mode: string, style: string): string {
    const basePrompt = `你是一个遗传学专家，帮助学生理解遗传学概念。

**核心原则：**
1. **严格基于提供的参考资料回答** - 你的所有答案都必须来自用户提供的参考资料
2. **绝不编造或使用外部知识** - 如果参考资料中没有相关内容，明确说明"根据提供的参考资料，没有找到相关信息"
3. **清晰标注来源** - 在每个关键点后标注来自哪个参考资料，并说明来自课本的哪个章节
4. **引导学生使用教材** - 鼓励学生回到教材对应章节深入学习

**可视化能力 - A2UI-MINDMAP 指令：**
当问题涉及复杂的概念关系、层级结构或流程时，可以使用 A2UI-MINDMAP 指令生成思维导图可视化。

**何时使用思维导图：**
- 问题涉及多个相关的概念或原理
- 需要展示概念之间的层级关系
- 涉及复杂的流程或步骤
- 需要展示知识点的整体结构

**A2UI-MINDMAP 指令格式：**
\`\`\`
[A2UI-MINDMAP]
  title: "思维导图标题"
  description: "思维导图的简要说明"
  root: {
    id: "唯一标识符",
    text: "节点文本",
    type: "concept|principle|example|definition|process|outcome",
    level: 0,
    expanded: true,
    children: [子节点列表]
  }
  layout: "radial|horizontal|vertical|tree"
  style: {
    nodeShape: "rounded",
    edgeType: "solid",
    edgeWidth: 2,
    fontFamily: "Arial",
    fontSize: 14
  }
  interactions: ["click", "hover", "zoom", "drag", "expand"]
  annotations: [注释列表]
[/A2UI-MINDMAP]
\`\`\`

**节点类型说明：**
- concept: 核心概念，表示主要知识点
- principle: 原理或定律，表示基本原理
- example: 示例，表示具体例子
- definition: 定义，表示概念定义
- process: 过程，表示流程或步骤
- outcome: 结果，表示结果或结论

**使用规则：**
- 最大层级深度不超过 6 层
- 每个节点的直接子节点数量不超过 8 个
- 节点文本不超过 20 个字符
- 使用 kebab-case 命法命名节点 ID
- 布局选择：radial（放射状）、horizontal（水平）、vertical（垂直）、tree（树状）

**回答格式要求：**
- 开头先说明答案主要来自哪个章节
- 中间每个关键点后用[参考资料N]标注
- 结尾总结知识点的章节位置
- 如果适合，在回答中嵌入 A2UI-MINDMAP 指令生成思维导图`;

    const modePrompt: Record<string, string> = {
      answer: '直接回答学生的问题，所有答案都必须有来源标注。',
      explanation: '解释相关概念和原理，每个概念都要说明来自哪个章节。',
      step_by_step: '分步骤引导学生理解，每一步都要基于参考资料。',
    };

    const stylePrompt: Record<string, string> = {
      concise: '语言简洁，直击要点，但每个要点都必须有来源标注。',
      detailed: '详细说明，提供完整信息，详细标注每个知识点的章节位置。',
      tutorial: '循循善诱，启发思考，引导学生回到教材学习。',
    };

    return `${basePrompt}\n\n${modePrompt[mode] || ''}\n\n${stylePrompt[style] || ''}`;
  }

  /**
   * 提取引用
   */
  private extractCitations(answer: string, context: RetrievalResult[]): Array<{ 
    chunkId: string; 
    content: string; 
    chapter?: string; 
    section?: string 
  }> {
    const citations: Array<{ 
      chunkId: string; 
      content: string; 
      chapter?: string; 
      section?: string 
    }> = [];
    const citationPattern = /\[参考资料(\d+)\]/g;

    let match;
    while ((match = citationPattern.exec(answer)) !== null) {
      const index = parseInt(match[1], 10) - 1;
      if (index >= 0 && index < context.length) {
        citations.push({
          chunkId: context[index].chunkId,
          content: context[index].content,
          chapter: context[index].metadata.chapter,
          section: context[index].metadata.section,
        });
      }
    }

    return citations;
  }

  /**
   * 提取来源
   */
  private extractSources(context: RetrievalResult[]): Array<{ 
    documentId: string; 
    title: string; 
    chapter?: string;
    section?: string;
    url?: string 
  }> {
    const sourceMap = new Map<string, { 
      documentId: string; 
      title: string; 
      chapter?: string;
      section?: string;
      url?: string 
    }>();

    for (const result of context) {
      if (!sourceMap.has(result.documentId)) {
        const title = result.metadata.chapter 
          ? `${result.metadata.chapter}${result.metadata.section ? ' - ' + result.metadata.section : ''}`
          : `文档 ${result.documentId}`;
        
        sourceMap.set(result.documentId, {
          documentId: result.documentId,
          title,
          chapter: result.metadata.chapter,
          section: result.metadata.section,
          url: undefined,
        });
      }
    }

    return Array.from(sourceMap.values());
  }

  /**
   * 分级解析生成（速通模式用）
   */
  async generateLevelExplanation(
    question: string,
    userAnswer: string,
    level: 1 | 2 | 3 | 4 | 5,
    context?: RetrievalResult[],
  ): Promise<SkillExecutionResult<{ explanation: string; highlights: string[] }>> {
    const levelDescriptions: Record<number, string> = {
      1: '最简练的提示，只指出对错，不说原因',
      2: '一句话提示核心错误或正确点',
      3: '简要解释关键知识点',
      4: '详细讲解相关概念和原理',
      5: '完整教学级解析，包括背景、例子和延伸',
    };

    interface LevelExplanation {
      explanation: string;
      highlights: string[];
    }

    const prompt = `你是一个答案解析专家。根据学生答案和等级要求生成解析。

问题：${question}
学生答案：${userAnswer}

解析等级（${level}）：${levelDescriptions[level]}

${context ? `参考资料：${context.map(r => r.content).join('\n\n')}` : ''}

请返回 JSON 格式：
{
  "explanation": "解析内容",
  "highlights": ["需要高亮的关键词1", "关键词2", ...]
}

注意事项：
- 严格按照等级要求控制解析长度和详细程度
- 高亮关键词有助于理解
- 使用中文`;

    try {
      const result = await this.llmService.structuredChat<LevelExplanation>(
        [{ role: 'user', content: prompt }],
        { response_format: { type: 'json_object' } },
      );

      return {
        skill: SkillType.STREAMING_ANSWER,
        success: true,
        data: result,
      };
    } catch (error) {
      this.logger.error('Level explanation generation failed:', error);

      return {
        skill: SkillType.STREAMING_ANSWER,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * 多模态答案生成（支持公式、图片等）
   */
  async generateMultimodalAnswer(
    query: string,
    context: RetrievalResult[],
    _options?: {
      includeFormula?: boolean;
      includeVisualization?: boolean;
      includeExamples?: boolean;
    },
  ): Promise<SkillExecutionResult<{
    text: string;
    formulas?: Array<{ latex: string; description: string }>;
    visualizations?: Array<{ type: string; description: string }>;
    examples?: Array<{ text: string; explanation: string }>;
  }>> {
    interface MultimodalAnswer {
      text: string;
      formulas?: Array<{ latex: string; description: string }>;
      visualizations?: Array<{ type: string; description: string }>;
      examples?: Array<{ text: string; explanation: string }>;
    }

    const prompt = `你是一个多模态答案生成专家。生成包含公式、可视化建议和例子的答案。

问题：${query}

${context ? `参考资料：${context.map(r => r.content).join('\n\n')}` : ''}

请返回 JSON 格式：
{
  "text": "答案文本",
  "formulas": [
    { "latex": "公式LaTeX代码", "description": "公式说明" }
  ],
  "visualizations": [
    { "type": "可视化类型", "description": "可视化说明" }
  ],
  "examples": [
    { "text": "例子", "explanation": "例子解释" }
  ]
}

注意事项：
- 根据问题需要决定是否包含各部分
- 公式使用LaTeX格式
- 可视化类型如：knowledge_graph, punnett_square等
- 使用中文`;

    try {
      const result = await this.llmService.structuredChat<MultimodalAnswer>(
        [{ role: 'user', content: prompt }],
        { response_format: { type: 'json_object' } },
      );

      return {
        skill: SkillType.STREAMING_ANSWER,
        success: true,
        data: result,
      };
    } catch (error) {
      this.logger.error('Multimodal answer generation failed:', error);

      return {
        skill: SkillType.STREAMING_ANSWER,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  /**
   * 答案评估（速通模式用）
   */
  async evaluateAnswer(
    question: string,
    userAnswer: string,
    context?: RetrievalResult[],
  ): Promise<SkillExecutionResult<{
    isCorrect: boolean;
    correctness: number;
    feedback: string;
    level: 1 | 2 | 3 | 4 | 5;
  }>> {
    interface AnswerEvaluation {
      isCorrect: boolean;
      correctness: number;
      feedback: string;
      level: 1 | 2 | 3 | 4 | 5;
    }

    const prompt = `你是一个答案评估专家。评估学生的答案并给出反馈。

问题：${question}
学生答案：${userAnswer}

${context ? `参考资料：${context.map(r => r.content).join('\n\n')}` : ''}

请返回 JSON 格式：
{
  "isCorrect": true/false,
  "correctness": 0-1之间的正确率,
  "feedback": "反馈内容（50字以内）",
  "level": 推荐的解析等级(1-5)
}

注意事项：
- 完全正确 isCorrect=true, level=1
- 部分正确 isCorrect=true, level=2-3
- 完全错误 isCorrect=false, level=4-5
- 反馈要简洁明确
- 使用中文`;

    try {
      const result = await this.llmService.structuredChat<AnswerEvaluation>(
        [{ role: 'user', content: prompt }],
        { response_format: { type: 'json_object' } },
      );

      return {
        skill: SkillType.STREAMING_ANSWER,
        success: true,
        data: result,
      };
    } catch (error) {
      this.logger.error('Answer evaluation failed:', error);

      return {
        skill: SkillType.STREAMING_ANSWER,
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }
}
