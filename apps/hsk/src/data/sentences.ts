export interface Sentence {
  id: number;
  lesson: number;
  hanzi: string;
  pinyin: string;
  vietnamese: string;
  english: string;
}

export const hsk1Sentences: Sentence[] = [
  // Lesson 1: Số đếm
  { id: 1, lesson: 1, hanzi: "我有三个苹果。", pinyin: "Wǒ yǒu sān gè píngguǒ.", vietnamese: "Tôi có ba quả táo.", english: "I have three apples." },
  { id: 2, lesson: 1, hanzi: "今天星期一。", pinyin: "Jīntiān xīngqīyī.", vietnamese: "Hôm nay là thứ hai.", english: "Today is Monday." },
  
  // Lesson 2: Chào hỏi
  { id: 3, lesson: 2, hanzi: "你好吗？", pinyin: "Nǐ hǎo ma?", vietnamese: "Bạn khỏe không?", english: "How are you?" },
  { id: 4, lesson: 2, hanzi: "我是越南人。", pinyin: "Wǒ shì Yuènán rén.", vietnamese: "Tôi là người Việt Nam.", english: "I am Vietnamese." },
  
  // Lesson 3: Gia đình
  { id: 5, lesson: 3, hanzi: "我爱我的爸爸妈妈。", pinyin: "Wǒ ài wǒ de bàba māma.", vietnamese: "Tôi yêu bố mẹ của tôi.", english: "I love my dad and mom." },
  { id: 6, lesson: 3, hanzi: "他是我哥哥。", pinyin: "Tā shì wǒ gēge.", vietnamese: "Anh ấy là anh trai tôi.", english: "He is my older brother." },

  // Lesson 4: Thời gian
  { id: 7, lesson: 4, hanzi: "现在几点？", pinyin: "Xiànzài jǐ diǎn?", vietnamese: "Bây giờ là mấy giờ?", english: "What time is it now?" },
  { id: 8, lesson: 4, hanzi: "我八点去学校。", pinyin: "Wǒ bā diǎn qù xuéxiào.", vietnamese: "Tôi đi học lúc 8 giờ.", english: "I go to school at 8 o'clock." },

  // Lesson 5: Đồ ăn
  { id: 9, lesson: 5, hanzi: "我想喝茶。", pinyin: "Wǒ xiǎng hē chá.", vietnamese: "Tôi muốn uống trà.", english: "I want to drink tea." },
  { id: 10, lesson: 5, hanzi: "米饭很好吃。", pinyin: "Mǐfàn hěn hǎochī.", vietnamese: "Cơm rất ngon.", english: "Rice is very delicious." }
];
