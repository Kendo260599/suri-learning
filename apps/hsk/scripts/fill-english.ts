import * as fs from 'fs';
import * as path from 'path';

interface Word {
  id: string;
  hanzi: string;
  pinyin: string;
  english: string;
  vietnamese: string;
  category: string;
  hskLevel: number;
  lesson: number;
}

// Complete HSK1 English translations (standard HSK1 definitions)
const fallbackTranslations: Record<string, string> = {
  "一": "one",
  "二": "two",
  "三": "three",
  "四": "four",
  "五": "five",
  "六": "six",
  "七": "seven",
  "八": "eight",
  "九": "nine",
  "十": "ten",
  "中国": "China",
  "美国": "America/USA",
  "英国": "England/Britain",
  "北京": "Beijing",
  "上海": "Shanghai",
  "韩国": "South Korea",
  "南非": "South Africa",
  "爸爸": "father/dad",
  "吧": "modal particle (suggestion)",
  "杯": "cup/glass",
  "不客气": "you're welcome",
  "不": "no/not",
  "菜": "dish/food/vegetable",
  "茶": "tea",
  "超市": "supermarket",
  "吃": "eat",
  "出租车": "taxi",
  "从": "from",
  "大": "big/large",
  "大学": "university/college",
  "到": "arrive/to/reach",
  "的": "of (possessive particle)",
  "地铁": "subway/metro",
  "弟弟": "younger brother",
  "电影": "movie/film",
  "电影院": "cinema/movie theater",
  "都": "all/both/even",
  "对": "correct/right",
  "对不起": "sorry",
  "对面": "opposite/across",
  "多大": "how old",
  "多少": "how many/how much",
  "饿": "hungry",
  "饭店": "restaurant/hotel",
  "非常": "very/extremely",
  "附近": "nearby/vicinity",
  "高兴": "happy/glad",
  "哥哥": "older brother",
  "个": "general measure word",
  "工作": "work/job",
  "公交车": "bus/public transportation",
  "公司": "company/corporation",
  "狗": "dog",
  "拐": "turn",
  "广场": "square/plaza",
  "贵": "expensive/noble",
  "贵姓": "your surname (polite)",
  "国": "country/nation",
  "还": "still/also/return",
  "还是": "or (in questions)",
  "汉语": "Chinese language",
  "好": "good/well",
  "好吃": "delicious/tasty",
  "号": "number/date",
  "喝": "drink",
  "和": "and/with",
  "几": "how many/a few",
  "家": "home/family",
  "家人": "family members",
  "见": "see/meet",
  "教": "teach",
  "叫": "call/be called",
  "姐姐": "older sister",
  "今年": "this year",
  "今天": "today",
  "近": "near/close",
  "就": "then/just/only",
  "咖啡": "coffee",
  "看": "look/see/watch",
  "可爱": "cute/lovely",
  "客气": "polite/客气 (to be modest)",
  "空儿": "free time",
  "口": "mouth/measure word for family members",
  "块": "yuan (currency unit)/piece",
  "快": "fast/quick",
  "快乐": "happy/joyful",
  "老师": "teacher",
  "了": "perfective aspect particle",
  "两": "two/both",
  "留学生": "international student",
  "律师": "lawyer",
  "妈妈": "mother/mom",
  "吗": "question particle",
  "没关系": "it doesn't matter/没关系",
  "没有": "not have/don't have",
  "妹妹": "younger sister",
  "们": "plural marker",
  "米饭": "rice (cooked)",
  "面": "side/direction",
  "名片": "business card",
  "名字": "name",
  "明天": "tomorrow",
  "哪": "which",
  "哪儿/哪里": "where",
  "那": "that",
  "那儿/那里": "there",
  "奶茶": "milk tea",
  "男": "male/man",
  "男朋友": "boyfriend",
  "呢": "modal particle (question)",
  "你": "you",
  "你们": "you (plural)",
  "您": "you (polite)",
  "牛肉": "beef",
  "女": "female/woman",
  "女朋友": "girlfriend",
  "朋友": "friend",
  "便宜": "cheap/inexpensive",
  "漂亮": "beautiful/pretty",
  "苹果": "apple",
  "前": "front/before",
  "钱": "money",
  "青菜": "green vegetables",
  "请": "please/ask",
  "请问": "excuse me, may I ask",
  "去": "go",
  "然后": "then/after that",
  "人": "person/people",
  "人民": "people/nation",
  "认识": "to know (person)/recognize",
  "谁": "who",
  "什么": "what",
  "生日": "birthday",
  "师傅": "master/master worker",
  "事": "matter/thing/business",
  "是": "to be/am/is/are",
  "书店": "bookstore/book shop",
  "岁": "year (of age)",
  "他": "he/him",
  "她": "she/her",
  "他们": "they/them",
  "太......了": "too... (excessive)",
  "晚饭": "dinner/supper",
  "晚上": "evening/night",
  "碗": "bowl",
  "往": "towards/to",
  "为什么": "why",
  "问": "ask/question",
  "我": "I/me",
  "喜欢": "like",
  "先生": "Mr./sir",
  "想": "want/think",
  "小": "small/little",
  "小姐": "Miss/young lady",
  "谢谢": "thank you",
  "星期": "week",
  "星期五": "Friday",
  "姓": "surname/family name",
  "学": "study/learn",
  "学生": "student",
  "学习": "to study/learn",
  "学校": "school",
  "要": "want/need/must",
  "也": "also/too",
  "医生": "doctor",
  "一共": "altogether/in total",
  "(一)点儿": "a little",
  "银行": "bank",
  "英语": "English language",
  "有": "to have/there is",
  "有空儿": "to be free/have time",
  "有名": "famous/well-known",
  "又": "again/and also",
  "右": "right (direction)",
  "又......又......": "both... and...",
  "远": "far/distant",
  "月": "month/moon",
  "再": "again/then",
  "在": "at/in/on (location)/be",
  "再见": "goodbye/see you again",
  "怎么": "how/why",
  "怎么样": "how/what about",
  "照片": "photo/picture",
  "这": "this",
  "这儿/这里": "here",
  "真": "really/truly",
  "只": "only/just/measure word for animals",
  "知道": "to know",
  "中学": "middle school/high school",
  "走": "walk/go",
  "走路": "walk (on foot)",
  "左": "left (direction)",
  "坐": "sit",
  "做": "do/make",
};

const DATA_FILE = path.join(__dirname, '../src/data/hsk1.ts');

function generateUpdatedFile(words: Word[]): string {
  let content = `export interface Word {
  id: string;
  hanzi: string;
  pinyin: string;
  english: string;
  vietnamese: string;
  category: string;
  hskLevel: number;
  lesson: number;
}

export const hsk1Words: Word[] = [
`;

  words.forEach((word, index) => {
    const english = fallbackTranslations[word.hanzi] || '';
    const lastItem = index === words.length - 1;
    const comma = lastItem ? '' : ',';
    
    content += `  { id: '${word.id}', hanzi: "${word.hanzi}", pinyin: "${word.pinyin}", english: "${english}", vietnamese: "${word.vietnamese}", category: "${word.category}", hskLevel: ${word.hskLevel}, lesson: ${word.lesson} }${comma}
`;
  });

  content += `];
`;

  return content;
}

async function main() {
  console.log('Reading HSK1 data file...');
  
  // Read and parse the file
  const fileContent = fs.readFileSync(DATA_FILE, 'utf-8');
  
  // Extract words using regex
  const wordRegex = /\{ id: '([^']+)', hanzi: "([^"]+)", pinyin: "([^"]+)", english: "", vietnamese: "([^"]+)", category: "([^"]+)", hskLevel: (\d+), lesson: (\d+) \}/g;
  
  const words: Word[] = [];
  let match;
  
  while ((match = wordRegex.exec(fileContent)) !== null) {
    words.push({
      id: match[1],
      hanzi: match[2],
      pinyin: match[3],
      english: '',
      vietnamese: match[4],
      category: match[5],
      hskLevel: parseInt(match[6]),
      lesson: parseInt(match[7]),
    });
  }

  console.log(`Found ${words.length} words to translate`);
  
  // Count how many can be translated
  let filledCount = 0;
  let missingCount = 0;
  
  words.forEach(word => {
    if (fallbackTranslations[word.hanzi]) {
      filledCount++;
    } else {
      missingCount++;
      console.log(`Missing translation for: ${word.hanzi} (${word.pinyin})`);
    }
  });

  console.log(`\nTranslation summary:`);
  console.log(`- Total words: ${words.length}`);
  console.log(`- Filled: ${filledCount}`);
  console.log(`- Missing: ${missingCount}`);

  // Generate updated file
  const updatedContent = generateUpdatedFile(words);
  
  // Write to file
  fs.writeFileSync(DATA_FILE, updatedContent, 'utf-8');
  console.log(`\nUpdated file written to: ${DATA_FILE}`);
}

main().catch(console.error);
