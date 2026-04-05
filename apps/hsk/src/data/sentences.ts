export interface Sentence {
  id: number;
  lesson: number;
  hanzi: string;
  pinyin: string;
  vietnamese: string;
  english: string;
  segments: string[]; // pre-split word segments for scramble game
}

export const hsk1Sentences: Sentence[] = [
  // Lesson 1: Số đếm cơ bản
  {
    id: 1, lesson: 1,
    hanzi: "我有三个苹果。", pinyin: "Wǒ yǒu sān gè píngguǒ.",
    vietnamese: "Tôi có ba quả táo.", english: "I have three apples.",
    segments: ["我", "有", "三个", "苹果"]
  },
  {
    id: 2, lesson: 1,
    hanzi: "今天星期一。", pinyin: "Jīntiān xīngqīyī.",
    vietnamese: "Hôm nay là thứ hai.", english: "Today is Monday.",
    segments: ["今天", "星期一"]
  },

  // Lesson 2: Chào hỏi & Quốc gia
  {
    id: 3, lesson: 2,
    hanzi: "你好吗？", pinyin: "Nǐ hǎo ma?",
    vietnamese: "Bạn khỏe không?", english: "How are you?",
    segments: ["你", "好", "吗"]
  },
  {
    id: 4, lesson: 2,
    hanzi: "我是越南人。", pinyin: "Wǒ shì Yuènán rén.",
    vietnamese: "Tôi là người Việt Nam.", english: "I am Vietnamese.",
    segments: ["我", "是", "越南", "人"]
  },

  // Lesson 3: Gia đình & Đại từ
  {
    id: 5, lesson: 3,
    hanzi: "我爱爸爸妈妈。", pinyin: "Wǒ ài bàba māma.",
    vietnamese: "Tôi yêu bố mẹ.", english: "I love my dad and mom.",
    segments: ["我", "爱", "爸爸", "妈妈"]
  },
  {
    id: 6, lesson: 3,
    hanzi: "他是我哥哥。", pinyin: "Tā shì wǒ gēge.",
    vietnamese: "Anh ấy là anh trai tôi.", english: "He is my older brother.",
    segments: ["他", "是", "我", "哥哥"]
  },

  // Lesson 4: Thời gian & Giá cả
  {
    id: 7, lesson: 4,
    hanzi: "现在几点？", pinyin: "Xiànzài jǐ diǎn?",
    vietnamese: "Bây giờ là mấy giờ?", english: "What time is it now?",
    segments: ["现在", "几", "点"]
  },
  {
    id: 8, lesson: 4,
    hanzi: "我八点去学校。", pinyin: "Wǒ bā diǎn qù xuéxiào.",
    vietnamese: "Tôi đi học lúc 8 giờ.", english: "I go to school at 8 o'clock.",
    segments: ["我", "八点", "去", "学校"]
  },

  // Lesson 5: Đồ ăn & Thức uống
  {
    id: 9, lesson: 5,
    hanzi: "我想喝茶。", pinyin: "Wǒ xiǎng hē chá.",
    vietnamese: "Tôi muốn uống trà.", english: "I want to drink tea.",
    segments: ["我", "想", "喝", "茶"]
  },
  {
    id: 10, lesson: 5,
    hanzi: "米饭很好吃。", pinyin: "Mǐfàn hěn hǎochī.",
    vietnamese: "Cơm rất ngon.", english: "Rice is very delicious.",
    segments: ["米饭", "很", "好吃"]
  },

  // Lesson 6: Địa điểm & Trường học
  {
    id: 11, lesson: 6,
    hanzi: "我是学生。", pinyin: "Wǒ shì xuésheng.",
    vietnamese: "Tôi là học sinh.", english: "I am a student.",
    segments: ["我", "是", "学生"]
  },
  {
    id: 12, lesson: 6,
    hanzi: "我学汉语。", pinyin: "Wǒ xué Hànyǔ.",
    vietnamese: "Tôi học tiếng Hán.", english: "I study Chinese.",
    segments: ["我", "学", "汉语"]
  },

  // Lesson 7: Mua sắm & Giá cả
  {
    id: 13, lesson: 7,
    hanzi: "这个多少钱？", pinyin: "Zhège duōshao qián?",
    vietnamese: "Cái này bao nhiêu tiền?", english: "How much is this?",
    segments: ["这个", "多少", "钱"]
  },
  {
    id: 14, lesson: 7,
    hanzi: "超市在哪儿？", pinyin: "Chāoshì zài nǎr?",
    vietnamese: "Siêu thị ở đâu?", english: "Where is the supermarket?",
    segments: ["超市", "在", "哪儿"]
  },

  // Lesson 8: Sở thích & Giải trí
  {
    id: 15, lesson: 8,
    hanzi: "我喜欢看电影。", pinyin: "Wǒ xǐhuan kàn diànyǐng.",
    vietnamese: "Tôi thích xem phim.", english: "I like watching movies.",
    segments: ["我", "喜欢", "看", "电影"]
  },
  {
    id: 16, lesson: 8,
    hanzi: "今天星期几？", pinyin: "Jīntiān xīngqī jǐ?",
    vietnamese: "Hôm nay là thứ mấy?", english: "What day of the week is it today?",
    segments: ["今天", "星期", "几"]
  },

  // Lesson 9: Giao thông & Thành phố
  {
    id: 17, lesson: 9,
    hanzi: "我不饿。", pinyin: "Wǒ bù è.",
    vietnamese: "Tôi không đói.", english: "I am not hungry.",
    segments: ["我", "不", "饿"]
  },
  {
    id: 18, lesson: 9,
    hanzi: "中国很大。", pinyin: "Zhōngguó hěn dà.",
    vietnamese: "Trung Quốc rất lớn.", english: "China is very big.",
    segments: ["中国", "很", "大"]
  },

  // Lesson 10: Mô tả & Tính cách
  {
    id: 19, lesson: 10,
    hanzi: "她是我女朋友。", pinyin: "Tā shì wǒ nǚpéngyou.",
    vietnamese: "Cô ấy là bạn gái tôi.", english: "She is my girlfriend.",
    segments: ["她", "是", "我", "女朋友"]
  },
  {
    id: 20, lesson: 10,
    hanzi: "他几岁？", pinyin: "Tā jǐ suì?",
    vietnamese: "Anh ấy bao nhiêu tuổi?", english: "How old is he?",
    segments: ["他", "几", "岁"]
  }
];
