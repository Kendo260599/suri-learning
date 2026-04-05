/**
 * Fill english field in hsk1.ts — only modifies english, preserves all other data.
 */

const fs = require("fs");

// Comprehensive English translation map based on Vietnamese meanings
const VI_EN = {
  // Numbers
  "một": "one", "hai": "two", "ba": "three", "bốn": "four", "năm": "five",
  "sáu": "six", "bảy": "seven", "tám": "eight", "chín": "nine", "mười": "ten",
  // Common words
  "Trung Quốc": "China", "Mỹ": "America/USA", "Anh Quốc": "England/Britain",
  "Bắc Kinh": "Beijing", "Thượng Hải": "Shanghai", "Hàn Quốc": "South Korea",
  "Nam Phi": "South Africa", "bố": "dad/father", "trợ từ ngữ khí": "modal particle",
  "cốc, ly": "cup/glass", "không có gì": "you're welcome", "không": "no/not",
  "đồ ăn, món ăn": "food/dishes", "trà": "tea", "siêu thị": "supermarket",
  "ăn": "eat", "xe taxi": "taxi", "từ": "from", "to, lớn": "big/large",
  "đại học": "university", "đến, tới": "to/arrive", "biểu thị sở hữu": "possessive particle",
  "tàu điện ngầm": "subway/metro", "em trai": "younger brother", "phim": "movie",
  "rạp chiếu phim": "cinema", "đều": "all/both", "đúng": "correct/right",
  "xin lỗi": "sorry", "đối diện": "opposite/across from", "bao nhiêu tuổi": "how old",
  "bao nhiêu": "how many/how much", "đói": "hungry", "nhà hàng": "restaurant",
  "rất, cực kì": "very/extremely", "gần đây": "nearby", "vui mừng": "happy/pleased",
  "anh trai": "older brother", "cái": "measure word (general)", "công việc": "work/job",
  "xe buýt": "bus", "công ty": "company", "con chó": "dog", "rẽ": "turn",
  "quảng trường": "square/plaza", "quý": "precious/noble", "quý danh": "your (honorific) name",
  "quốc gia, nước": "country/nation", "còn, cũng": "still/also", "hay là": "or",
  "tiếng Hán": "Chinese (language)", "tốt, đẹp, hay": "good/nice",
  "ngon": "delicious/tasty", "ngày": "day/date", "uống": "drink",
  "và": "and", "mấy": "a few/several", "lượng từ": "measure word",
  "người nhà": "family members", "gặp": "meet/see", "dạy": "teach",
  "gọi, tên là": "call/be called", "chị gái": "older sister", "năm nay": "this year",
  "hôm nay": "today", "gần": "near/close", "ngay, chính là": "right away/just",
  "cà phê": "coffee", "nhìn, xem": "look/watch", "dễ thương": "cute/lovely",
  "khách sáo": "polite/formal", "thời gian rảnh": "free time", "nhanh": "fast/quick",
  "vui, hạnh phúc": "happy/joyful", "thầy giáo, cô giáo": "teacher",
  "rồi": "already (perfective particle)", "hai": "two",
  "lưu học sinh": "international student", "luật sư": "lawyer",
  "mẹ": "mom/mother", "từ để hỏi": "question particle",
  "không sao": "it's okay/doesn't matter", "không có": "don't have/none",
  "em gái": "younger sister", "từ chỉ số nhiều": "plural marker",
  "cơm": "rice (cooked)", "bên, phía": "side/direction", "danh thiếp": "business card",
  "tên": "name", "ngày mai": "tomorrow", "nào": "which", "đâu, ở đâu": "where",
  "vậy, vậy thì": "so/then", "ở đó, nơi đó": "there",
  "trà sữa": "milk tea/bubble tea", "nam": "male/man", "bạn trai": "boyfriend",
  "anh, chị, bạn,...": "you (informal)", "các anh, các chị,...": "you (plural)",
  "xưng hô tôn trọng": "you (polite/formal)", "thịt bò": "beef",
  "nữ": "female/woman", "bạn gái": "girlfriend", "bạn, bạn bè": "friend/friends",
  "rẻ": "cheap/inexpensive", "đẹp, xinh đẹp": "beautiful/pretty",
  "quả táo": "apple", "phía trước": "front/before", "tiền": "money",
  "rau xanh": "vegetables", "mời": "please/invite", "xin hỏi": "excuse me (polite)",
  "đi": "go", "sau đó": "then/after that", "người": "person/people",
  "nhân dân": "people/nation", "quen biết": "to know (someone)",
  "ai": "who", "gì, cái gì": "what", "sinh nhật": "birthday",
  "sư phụ, thầy": "master/teacher", "việc, vấn đề": "matter/thing",
  "là": "to be/is", "nhà sách": "bookstore", "tuổi": "years old/age",
  "anh ấy, ông ấy,...": "he/him", "chị ấy, bà ấy,...": "she/her",
  "họ": "they/them", "quá": "too/excessively", "bữa tối": "dinner",
  "buổi tối": "evening", "bát": "bowl", "đi đến, hướng tới": "to/toward",
  "tại sao": "why", "hỏi": "ask/question", "tôi": "I/me",
  "thích": "to like", "ngài, ông": "Mr./sir", "muốn, suy nghĩ": "to want/to think",
  "nhỏ, bé": "small/little", "tiểu thư, cô, em": "Miss/young lady",
  "cảm ơn": "thank you", "tuần": "week", "thứ sáu": "Friday",
  "họ": "surname/family name", "học": "study/learn",
  "học sinh, sinh viên": "student", "học tập": "to study",
  "trường học": "school", "muốn, cần, phải": "to want/to need/must",
  "cũng": "also/too", "bác sĩ": "doctor", "tất cả, tổng cộng": "altogether/in total",
  "một chút": "a little/a bit", "ngân hàng": "bank", "tiếng Anh": "English (language)",
  "có": "to have/there is", "rảnh rỗi": "free/have free time",
  "nổi tiếng": "famous/well-known", "vừa, lại": "also/both...and...",
  "bên phải": "right (direction)", "vừa... vừa...": "both...and...",
  "xa": "far/distant", "tháng": "month", "lại": "again",
  "đang, ở tại": "at/in/located", "hẹn gặp lại": "goodbye/see you",
  "thế nào": "how/what...like", "thế nào": "how",
  "ảnh": "photo/picture", "này": "this", "ở đây": "here",
  "thật, thật là": "really/truly", "con (lượng từ)": "measure word for small animals",
  "biết": "to know (a fact)", "trung học": "middle school/high school",
  "đi bộ": "walk (on foot)", "bên trái": "left (direction)",
  "ngồi": "sit", "làm": "to do/to make",
};

// Hanzi → English lookup (for words without clear Vietnamese meaning mapping)
const HANZI_EN = {
  "一": "one", "二": "two", "三": "three", "四": "four", "五": "five",
  "六": "six", "七": "seven", "八": "eight", "九": "nine", "十": "ten",
  "中国": "China", "美国": "America/USA", "英国": "England/Britain",
  "北京": "Beijing", "上海": "Shanghai", "韩国": "South Korea",
  "南非": "South Africa", "爸爸": "dad/father", "吧": "modal particle (suggestion)",
  "杯": "cup/glass", "不客气": "you're welcome", "不": "no/not",
  "菜": "food/dishes", "茶": "tea", "超市": "supermarket",
  "吃": "eat", "出租车": "taxi", "从": "from",
  "大": "big/large", "大学": "university", "到": "to/arrive",
  "的": "possessive particle", "地铁": "subway/metro",
  "弟弟": "younger brother", "电影": "movie/film", "电影院": "cinema",
  "都": "all/both", "对": "correct/right", "对不起": "sorry",
  "对面": "opposite/across from", "多大": "how old", "多少": "how many/how much",
  "饿": "hungry", "饭店": "restaurant", "非常": "very/extremely",
  "附近": "nearby", "高兴": "happy/pleased", "哥哥": "older brother",
  "个": "measure word (general)", "工作": "work/job",
  "公交车": "bus", "公司": "company", "狗": "dog",
  "拐": "turn", "广场": "square/plaza", "贵": "expensive/precious",
  "贵姓": "your surname (honorific)", "国": "country/nation",
  "还": "still/also", "还是": "or", "汉语": "Chinese (language)",
  "好": "good/nice", "好吃": "delicious/tasty", "号": "number/date",
  "喝": "drink", "和": "and", "几": "a few/several",
  "家": "home/family", "家人": "family members", "见": "meet/see",
  "教": "teach", "叫": "call/be called", "姐姐": "older sister",
  "今年": "this year", "今天": "today", "近": "near/close",
  "就": "right away/just/then", "咖啡": "coffee",
  "看": "look/watch", "可爱": "cute/lovely", "客气": "polite/formal",
  "空儿": "free time", "口": "mouth/measure word", "块": "yuan/Chinese dollar",
  "快": "fast/quick", "快乐": "happy/joyful", "老师": "teacher",
  "了": "perfective particle (completed)", "两": "two",
  "留学生": "international student", "律师": "lawyer",
  "妈妈": "mom/mother", "吗": "question particle",
  "没关系": "it's okay", "没有": "don't have/none",
  "妹妹": "younger sister", "们": "plural marker",
  "米饭": "rice (cooked)", "面": "side/direction/noodles",
  "名片": "business card", "名字": "name", "明天": "tomorrow",
  "哪": "which", "哪儿": "where", "哪里": "where",
  "那": "that", "那儿": "there", "那里": "there",
  "奶茶": "milk tea/bubble tea", "男": "male/man", "男朋友": "boyfriend",
  "呢": "modal particle (question)", "你": "you",
  "你们": "you (plural)", "您": "you (polite)",
  "牛肉": "beef", "女": "female/woman", "女朋友": "girlfriend",
  "朋友": "friend", "便宜": "cheap/inexpensive", "漂亮": "beautiful/pretty",
  "苹果": "apple", "前": "front/before", "钱": "money",
  "青菜": "green vegetables", "请": "please", "请问": "excuse me (polite)",
  "去": "go", "然后": "then/after that", "人": "person/people",
  "人民": "people/nation", "认识": "to know (someone)",
  "谁": "who", "什么": "what", "生日": "birthday",
  "师傅": "master/teacher (respectful)", "事": "matter/thing",
  "是": "to be/is", "书店": "bookstore",
  "岁": "years old", "他": "he/him", "她": "she/her",
  "他们": "they/them", "太......了": "too... (excessiveness)",
  "晚饭": "dinner", "晚上": "evening", "碗": "bowl",
  "往": "to/toward", "为什么": "why", "问": "ask/question",
  "我": "I/me", "喜欢": "to like", "先生": "Mr./sir",
  "想": "to want/to think", "小": "small/little",
  "小姐": "Miss/young lady", "谢谢": "thank you",
  "星期": "week", "星期五": "Friday", "姓": "surname/family name",
  "学": "study/learn", "学生": "student", "学习": "to study",
  "学校": "school", "要": "to want/to need/must",
  "也": "also/too", "医生": "doctor", "一共": "altogether/in total",
  "(一)点儿": "a little/a bit", "银行": "bank",
  "英语": "English (language)", "有": "to have/there is",
  "有空儿": "to have free time", "有名": "famous/well-known",
  "又": "again/also/both", "右": "right (direction)",
  "又......又......": "both...and...", "远": "far/distant",
  "月": "month", "再": "again/once more", "在": "at/in/located",
  "再见": "goodbye/see you", "怎么": "how/what",
  "怎么样": "how/what about", "照片": "photo/picture",
  "这": "this", "这儿": "here", "这里": "here",
  "真": "really/truly", "只": "only/just",
  "知道": "to know (a fact)", "中学": "middle school/high school",
  "走": "walk/go", "走路": "to walk (on foot)",
  "左": "left (direction)", "坐": "sit", "做": "to do/to make",
};

function translate(vietnamese, hanzi) {
  const vi = vietnamese.trim();

  // Try exact Vietnamese match
  if (VI_EN[vi]) return VI_EN[vi];

  // Try first part before comma
  const first = vi.split(/[，,、/]/)[0].trim();
  if (VI_EN[first]) return VI_EN[first];

  // Try first word
  const firstWord = vi.split(" ")[0];
  if (VI_EN[firstWord]) return VI_EN[firstWord];

  // Try hanzi match
  if (HANZI_EN[hanzi]) return HANZI_EN[hanzi];

  // Try first hanzi character
  if (HANZI_EN[hanzi[0]]) return HANZI_EN[hanzi[0]];

  return vietnamese; // fallback — leave as-is
}

const content = fs.readFileSync("src/data/hsk1.ts", "utf8");
const lines = content.split("\n");
let filled = 0;

const updated = lines.map(line => {
  const m = line.match(/(\{ id: '(\d+)', hanzi: "([^"]+)", pinyin: "([^"]+)", english: ""?, vietnamese: "([^"]+)",)/);
  if (!m) return line;

  const english = translate(m[5], m[3]).replace(/"/g, '\\"');
  filled++;
  return line.replace(`english: ""`, `english: "${english}"`);
});

fs.writeFileSync("src/data/hsk1.ts", updated.join("\n"), "utf8");
console.log(`Filled ${filled} english fields`);
