/**
 * 遗传学章节列表
 * 用于速通模式的章节选择
 */

export interface Chapter {
  number: number;
  title: string;
  topics: string[];
  estimatedQuestions: number;
}

export const GENETICS_CHAPTERS: Chapter[] = [
  {
    number: 1,
    title: '经典遗传学基础',
    topics: ['孟德尔第一定律', '孟德尔第二定律', '基因型与表型', '显性与隐性遗传'],
    estimatedQuestions: 15
  },
  {
    number: 2,
    title: '伴性遗传与染色体遗传',
    topics: ['伴性遗传', '染色体结构', '核型分析', '染色体畸变'],
    estimatedQuestions: 12
  },
  {
    number: 3,
    title: '分子遗传学基础',
    topics: ['DNA复制', '转录与翻译', '基因突变', '中心法则'],
    estimatedQuestions: 18
  },
  {
    number: 4,
    title: '基因表达调控',
    topics: ['基因表达调控', '表观遗传学', 'RNA干扰', '基因组印记'],
    estimatedQuestions: 10
  },
  {
    number: 5,
    title: '细胞遗传学',
    topics: ['减数分裂', '有丝分裂', '单倍体与多倍体', 'X染色体失活'],
    estimatedQuestions: 14
  },
  {
    number: 6,
    title: '群体遗传学',
    topics: ['哈代-温伯格定律', '基因频率', '遗传漂变', '自然选择'],
    estimatedQuestions: 12
  },
  {
    number: 7,
    title: '基因工程与生物技术',
    topics: ['限制性内切酶', 'DNA连接酶', '质粒载体', 'CRISPR-Cas9技术', '转基因技术'],
    estimatedQuestions: 20
  },
  {
    number: 8,
    title: '遗传病与医学遗传学',
    topics: ['常染色体显性遗传病', '常染色体隐性遗传病', 'X连锁遗传病', '唐氏综合征', '基因治疗'],
    estimatedQuestions: 16
  },
  {
    number: 9,
    title: '数量遗传学',
    topics: ['数量性状', '质量性状', '遗传率', '加性效应', '上位性效应'],
    estimatedQuestions: 8
  },
  {
    number: 10,
    title: '特殊遗传现象',
    topics: ['母系遗传', '线粒体遗传', '三体综合征', '嵌合体', '镶嵌现象'],
    estimatedQuestions: 10
  }
];

export const getChaptersByRange = (startChapter: number, endChapter: number): Chapter[] => {
  return GENETICS_CHAPTERS.filter(
    chapter => chapter.number >= startChapter && chapter.number <= endChapter
  );
};

export const getRandomChapters = (count: number): Chapter[] => {
  const shuffled = [...GENETICS_CHAPTERS].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, shuffled.length));
};

export const getTopicsByChapters = (chapters: Chapter[]): string[] => {
  return chapters.flatMap(chapter => chapter.topics);
};

export const getTotalEstimatedQuestions = (chapters: Chapter[]): number => {
  return chapters.reduce((total, chapter) => total + chapter.estimatedQuestions, 0);
};
