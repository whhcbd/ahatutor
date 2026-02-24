const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

class ExerciseExtractor {
  constructor() {
    this.chapters = new Map();
    this.currentChapter = '';
    this.currentChapterNumber = 0;
    this.exercises = [];
    this.answers = new Map();
    this.currentQuestion = '';
    this.currentOptions = [];
    this.currentQuestionNumber = 0;
    this.duplicateChecker = new Set();
    this.ragExerciseIds = new Set();
  }

  extractFromDocument(documentPath, ragDatabasePath) {
    console.log('开始提取习题:', documentPath);
    
    if (ragDatabasePath) {
      this.loadRAGDatabase(ragDatabasePath);
    }
    
    const content = fs.readFileSync(documentPath, 'utf-8');
    const lines = content.split('\n');
    
    let lineIndex = 0;
    let globalChapterNumber = 1;
    
    while (lineIndex < lines.length) {
      const line = lines[lineIndex].trim();
      
      if (line === '# 习题') {
        this.currentChapter = `第${globalChapterNumber}章习题`;
        this.currentChapterNumber = globalChapterNumber;
        this.exercises = [];
        this.answers = new Map();
        this.currentQuestion = '';
        this.currentOptions = [];
        this.currentQuestionNumber = 0;
        console.log(`开始处理习题部分: ${this.currentChapter}`);
        
        const exercisesStartLine = lineIndex;
        lineIndex++;
        this.parseExercises(lines, lineIndex);
        
        this.chapters.set(this.currentChapter, {
          chapter: this.currentChapter,
          chapterNumber: this.currentChapterNumber,
          exercises: this.exercises,
          answers: this.answers,
          exercisesStartLine,
          answersStartLine: 0
        });
        
        globalChapterNumber++;
      } else if (line === '习题答案' || line === '# 习题答案') {
        const chapterData = this.chapters.get(this.currentChapter);
        if (chapterData) {
          chapterData.answersStartLine = lineIndex;
          lineIndex++;
          this.parseAnswers(lines, lineIndex);
        }
      }
      
      lineIndex++;
    }
    
    this.saveCurrentChapter();
    
    const allExercises = this.deduplicateAndClean();
    this.saveExercises(allExercises);
    
    return allExercises;
  }

  parseExercises(lines, startIndex) {
    let i = startIndex;
    let currentQuestionText = '';
    let inQuestion = false;
    let currentNumber = 0;
    let currentOptions = [];
    let inOptions = false;
    let optionIndex = 0;
    let currentSubQuestions = [];
    let inSubQuestion = false;
    let currentTables = [];
    let inTable = false;

    while (i < lines.length) {
      const line = lines[i].trim();
      const originalLine = lines[i];
      
      if (line === '习题答案' || line.startsWith('# ')) {
        break;
      }
      
      const numberMatch = line.match(/^(\d+)\.\s*(.*)/);
      if (numberMatch) {
        if (inQuestion && currentQuestionText.trim()) {
          this.exercises.push(this.createExercise(
            currentNumber,
            currentQuestionText.trim(),
            currentOptions,
            currentSubQuestions,
            currentTables
          ));
        }
        
        currentNumber = parseInt(numberMatch[1], 10);
        currentQuestionText = numberMatch[2];
        currentOptions = [];
        currentSubQuestions = [];
        currentTables = [];
        inQuestion = true;
        inOptions = false;
        inSubQuestion = false;
        inTable = false;
        optionIndex = 0;
      } else if (inQuestion && line.match(/^\((\d+)\)\s*/)) {
        const subQuestionMatch = line.match(/^\((\d+)\)\s*(.*)/);
        if (subQuestionMatch) {
          const subQuestionText = subQuestionMatch[2].trim();
          if (inSubQuestion && currentSubQuestions.length > 0) {
            currentSubQuestions[currentSubQuestions.length - 1] += ' ' + subQuestionText;
          } else {
            currentSubQuestions.push(subQuestionText);
          }
          inSubQuestion = true;
          inOptions = false;
          inTable = false;
        }
      } else if (inQuestion && line.match(/^[ABCD]\.\s*/)) {
        const letterOptionMatch = line.match(/^([ABCD])\.\s*(.*)/);
        if (letterOptionMatch) {
          currentOptions.push(letterOptionMatch[2].trim());
          inOptions = true;
          inSubQuestion = false;
          inTable = false;
        }
      } else if (inQuestion && line.match(/^[一二三四五六七八九十]+\s*[、．.]\s*/)) {
        const chineseOptionMatch = line.match(/^([一二三四五六七八九十]+)\s*[、．.]\s*(.*)/);
        if (chineseOptionMatch) {
          currentOptions.push(chineseOptionMatch[2].trim());
          inOptions = true;
          inSubQuestion = false;
          inTable = false;
        }
      } else if (inQuestion && line.includes('<table>')) {
        const tableContent = this.extractTable(lines, i);
        if (tableContent) {
          currentTables.push(tableContent);
          i = tableContent.endIndex;
          inTable = true;
          continue;
        }
      } else if (inQuestion && line.includes('![')) {
        const imageMatch = line.match(/!\[([^\]]+)\]\(([^\)]+)\)/);
        if (imageMatch) {
          currentOptions.push(`IMAGE: ${imageMatch[1]} ${imageMatch[2]}`);
          inOptions = true;
          inSubQuestion = false;
          inTable = false;
        }
      } else if (inQuestion && line.length > 0) {
        if (inOptions && originalLine.match(/^\s/)) {
          currentOptions[currentOptions.length - 1] += ' ' + line.trim();
        } else if (inSubQuestion && originalLine.match(/^\s/)) {
          currentSubQuestions[currentSubQuestions.length - 1] += ' ' + line.trim();
        } else if (inTable && originalLine.match(/^\s/)) {
          if (currentTables.length > 0) {
            currentTables[currentTables.length - 1] += '\n' + line;
          }
        } else {
          currentQuestionText += '\n' + line;
        }
      }
      
      i++;
    }
    
    if (inQuestion && currentQuestionText.trim()) {
      this.exercises.push(this.createExercise(
        currentNumber,
        currentQuestionText.trim(),
        currentOptions,
        currentSubQuestions,
        currentTables
      ));
    }
    
    console.log(`  解析了 ${this.exercises.length} 道题目`);
  }

  extractTable(lines, startIndex) {
    let i = startIndex;
    let tableContent = '';
    let depth = 0;
    
    while (i < lines.length) {
      const line = lines[i];
      tableContent += line + '\n';
      
      if (line.includes('<table>')) {
        depth++;
      }
      if (line.includes('</table>')) {
        depth--;
        if (depth === 0) {
          return {
            content: tableContent.trim(),
            endIndex: i
          };
        }
      }
      i++;
    }
    
    return null;
  }

  parseAnswers(lines, startIndex) {
    let i = startIndex;
    let currentNumber = 0;
    let currentAnswer = '';
    
    while (i < lines.length) {
      const line = lines[i].trim();
      
      if (line.match(/^第[一二三四五六七八九十]+章/) || line === '# 习题') {
        break;
      }
      
      const numberMatch = line.match(/^(\d+)\.\s*(.*)/);
      if (numberMatch) {
        if (currentAnswer.trim()) {
          this.answers.set(currentNumber.toString(), currentAnswer.trim());
        }
        currentNumber = parseInt(numberMatch[1], 10);
        currentAnswer = numberMatch[2];
      } else if (currentNumber > 0 && line.length > 0) {
        currentAnswer += ' ' + line;
      }
      
      i++;
    }
    
    if (currentAnswer.trim()) {
      this.answers.set(currentNumber.toString(), currentAnswer.trim());
    }
    
    console.log(`  解析了 ${this.answers.size} 个答案`);
  }

  createExercise(number, question, options, subQuestions, tables) {
    const exerciseId = this.generateExerciseId(this.currentChapterNumber, number);
    
    const hasMath = question.includes('$') || question.includes('\\(') || question.includes('\\[');
    const hasImage = question.includes('![](');
    const questionType = this.classifyQuestionType(question, options, subQuestions);
    const difficulty = this.estimateDifficulty(question, options, subQuestions);
    const tags = this.extractTags(question);
    
    const exercise = {
      id: exerciseId,
      chapter: `第${this.currentChapterNumber}章`,
      chapterNumber: this.currentChapterNumber,
      question: this.cleanQuestion(question),
      type: questionType,
      options: options.length > 0 ? options : undefined,
      answer: this.answers.get(number.toString()),
      explanation: undefined,
      difficulty: difficulty,
      tags: tags,
      metadata: {
        originalLine: 0,
        hasImage: hasImage,
        relatedTopics: tags,
        tables: tables && tables.length > 0 ? tables.map(t => t.content) : undefined
      }
    };
    
    return exercise;
  }

  classifyQuestionType(question, options, subQuestions) {
    if (options.length > 0) {
      return 'choice';
    } else if (subQuestions && subQuestions.length > 0) {
      return 'multiple';
    } else if (question.includes('计算') || question.includes('求') || question.includes('比例')) {
      return 'calculation';
    } else if (question.includes('解释') || question.includes('说明') || question.includes('分析')) {
      return 'essay';
    } else if (question.includes('填空') || question.includes('____')) {
      return 'fill';
    } else if (question.includes('哪些') || question.includes('什么') || question.includes('为什么')) {
      return 'multiple';
    }
    return 'other';
  }

  estimateDifficulty(question, options, subQuestions) {
    const hasComplexMath = question.match(/\\[a-z]+\d+/) !== null;
    const hasMultipleGenes = question.match(/[A-Z][a-z]\s*[×+]\s*[A-Z][a-z]/g)?.length || 0 > 1;
    const isLongQuestion = question.length > 200;
    const hasSubQuestions = subQuestions && subQuestions.length > 0;
    const hasChiSquare = question.includes('χ²') || question.includes('卡方') || question.includes('χ^2');
    const hasGeneticAnalysis = question.includes('遗传方式') || question.includes('家系') || question.includes('基因型') || question.includes('表型');
    
    if (hasComplexMath || hasMultipleGenes || isLongQuestion || (hasChiSquare && hasGeneticAnalysis)) {
      return 'hard';
    } else if (question.includes('为什么') || question.includes('分析') || question.includes('解释') || hasSubQuestions || hasChiSquare) {
      return 'medium';
    }
    return 'easy';
  }

  extractTags(question) {
    const tags = [];
    
    const geneticsKeywords = [
      '孟德尔', '分离定律', '自由组合定律', '显性', '隐性',
      '基因型', '表型', '杂交', '自交', '回交', '测交',
      '染色体', '等位基因', '非等位基因', '伴性遗传',
      '连锁', '交换', '突变', '重组', '群体遗传'
    ];
    
    geneticsKeywords.forEach(keyword => {
      if (question.includes(keyword)) {
        tags.push(keyword);
      }
    });
    
    return tags;
  }

  cleanQuestion(question) {
    return question
      .replace(/\$\$/g, '')
      .replace(/\$/g, '')
      .replace(/\\([(){}\[\]])/g, '$1')
      .replace(/\s+/g, ' ')
      .trim();
  }

  generateExerciseId(chapterNumber, questionNumber) {
    const hash = crypto
      .createHash('md5')
      .update(`${chapterNumber}-${questionNumber}`)
      .digest('hex');
    return `ex_${hash.substring(0, 8)}`;
  }

  saveCurrentChapter() {
    if (this.currentChapter && this.exercises.length > 0) {
      this.chapters.set(this.currentChapter, {
        chapter: this.currentChapter,
        chapterNumber: this.currentChapterNumber,
        exercises: this.exercises,
        answers: this.answers,
        exercisesStartLine: 0,
        answersStartLine: 0
      });
    }
  }

  deduplicateAndClean() {
    const deduplicated = [];
    const questionHashes = new Map();
    const allExercises = [];
    
    for (const [chapterName, chapterData] of this.chapters) {
      allExercises.push(...chapterData.exercises);
    }
    
    for (const exercise of allExercises) {
      const hash = this.generateQuestionHash(exercise.question);
      
      if (this.ragExerciseIds.has(exercise.id)) {
        console.log(`跳过RAG中已存在的习题: ${exercise.id}`);
        continue;
      }
      
      if (questionHashes.has(hash)) {
        console.log(`发现重复习题: ${exercise.id}`);
        const existing = questionHashes.get(hash);
        existing.metadata.relatedTopics = [
          ...new Set([...(existing.metadata.relatedTopics || []), ...exercise.tags])
        ];
      } else {
        questionHashes.set(hash, exercise);
        deduplicated.push(exercise);
      }
    }
    
    console.log(`原始习题数: ${allExercises.length}, 去重后: ${deduplicated.length}`);
    return deduplicated;
  }

  generateQuestionHash(question) {
    const normalized = question
      .replace(/\s+/g, '')
      .replace(/[^\u4e00-\u9fa5a-zA-Z0-9]/g, '')
      .toLowerCase();
    return crypto
      .createHash('md5')
      .update(normalized)
      .digest('hex');
  }

  loadRAGDatabase(ragDatabasePath) {
    try {
      if (fs.existsSync(ragDatabasePath)) {
        const content = fs.readFileSync(ragDatabasePath, 'utf-8');
        const data = JSON.parse(content);
        
        if (data.documents) {
          data.documents.forEach((doc) => {
            if (doc.metadata?.type === 'exercise') {
              this.ragExerciseIds.add(doc.id);
            }
          });
          console.log(`已加载RAG数据库中的${this.ragExerciseIds.size}个习题ID`);
        }
      }
    } catch (error) {
      console.error('加载RAG数据库失败:', error);
    }
  }

  saveExercises(exercises) {
    const outputDir = 'docs/reference/exercises';
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    const outputPath = path.join(outputDir, 'exercises.json');
    fs.writeFileSync(outputPath, JSON.stringify(exercises, null, 2));
    console.log(`习题已保存到: ${outputPath}`);
    
    const statsPath = path.join(outputDir, 'statistics.json');
    const stats = this.generateStatistics(exercises);
    fs.writeFileSync(statsPath, JSON.stringify(stats, null, 2));
    console.log(`统计信息已保存到: ${statsPath}`);
  }

  generateStatistics(exercises) {
    const byChapter = new Map();
    const byType = new Map();
    const byDifficulty = new Map();
    
    exercises.forEach(ex => {
      byChapter.set(ex.chapterNumber, (byChapter.get(ex.chapterNumber) || 0) + 1);
      byType.set(ex.type, (byType.get(ex.type) || 0) + 1);
      byDifficulty.set(ex.difficulty, (byDifficulty.get(ex.difficulty) || 0) + 1);
    });
    
    return {
      total: exercises.length,
      byChapter: Array.from(byChapter.entries()).map(([chapter, count]) => ({ chapter, count })),
      byType: Array.from(byType.entries()).map(([type, count]) => ({ type, count })),
      byDifficulty: Array.from(byDifficulty.entries()).map(([difficulty, count]) => ({ difficulty, count })),
      tags: this.getAllTags(exercises)
    };
  }

  getAllTags(exercises) {
    const tagCounts = new Map();
    exercises.forEach(ex => {
      ex.tags.forEach(tag => {
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
      });
    });
    return Array.from(tagCounts.entries())
      .sort((a, b) => b[1] - a[1])
      .map(([tag, count]) => ({ tag, count }));
  }
}

function main() {
  const documentPath = 'docs/reference/full.md';
  const ragDatabasePath = 'data/genetics-rag-final.json';
  
  console.log('开始提取习题...');
  console.log(`文档路径: ${documentPath}`);
  console.log(`RAG数据库路径: ${ragDatabasePath}`);
  
  const extractor = new ExerciseExtractor();
  const exercises = extractor.extractFromDocument(documentPath, ragDatabasePath);
  
  console.log('\n习题提取完成!');
  console.log(`总共提取了 ${exercises.length} 道习题`);
  
  if (exercises.length > 0) {
    console.log('\n前5道习题示例:');
    exercises.slice(0, 5).forEach((ex, i) => {
      console.log(`${i + 1}. ${ex.question.substring(0, 50)}...`);
    });
  }
}

if (require.main === module) {
  main();
}