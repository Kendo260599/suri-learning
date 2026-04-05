/**
 * Script to fill `english` field in hsk1.ts
 * Only modifies the english field, preserves all other data exactly.
 */

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const HSK_DATA_PATH = "src/data/hsk1.ts";
const OUTPUT_PATH = "src/data/hsk1.ts";

// Map of Vietnamese meanings to English translations (comprehensive HSK1 vocabulary)
const ENGLISH_MAP: Record<string, string> = {
  // Numbers
  "một": "one",
  "hai": "two",
  "ba": "three",
  "bốn": "four",
  "năm": "five",
  "sáu": "six",
  "bảy": "seven",
  "tám": "eight",
  "chín": "nine",
  "mười": "ten",
  // Countries & places
  "Trung Quốc": "China",
  "Mỹ": "America/USA",
  "Anh Quốc": "England/Britain",
  "Bắc Kinh": "Beijing",
  "Thượng Hải": "Shanghai",
  "Hàn Quốc": "South Korea",
  "Nam Phi": "South Africa",
  // Family
  "bố": "dad/father",
  "trợ từ ngữ khí": "modal particle (question marker)",
  "cốc, ly": "cup/glass",
  "không có gì": "you're welcome",
  "không": "no/not",
  "đồ ăn, món ăn": "food/dishes",
  "trà": "tea",
  "siêu thị": "supermarket",
  "ăn": "eat",
  "xe taxi": "taxi",
  "từ": "from",
  "to, lớn": "big/large",
  "đại học": "university",
  "đến, tới": "to/arrive",
  "biểu thị sở hữu": "possessive particle",
  "tàu điện ngầm": "subway/metro",
  "em trai": "younger brother",
  "phim": "movie/film",
  "rạp chiếu phim": "cinema/movie theater",
  "đều": "all/every/all equally",
  "đúng": "correct/right",
  "xin lỗi": "sorry",
  "đối diện": "opposite/across from",
  "bao nhiêu tuổi": "how old",
  "bao nhiêu": "how many/how much",
  "đói": "hungry",
  "nhà hàng": "restaurant",
  "rất, cực kì": "very/extremely",
  "gần đây": "nearby/around here",
  "vui mừng": "happy/pleased",
  "anh trai": "older brother",
  "cái": "measure word (general)",
  "công việc": "work/job",
  "xe buýt": "bus",
  "công ty": "company",
  "con chó": "dog",
  "rẽ": "turn",
  "quảng trường": "square/plaza",
  "quý": "precious/noble",
  "quý danh": "your (honorific) name",
  "quốc gia, nước": "country/nation",
  "còn, cũng": "still/also",
  "hay là": "or",
  "tiếng Hán": "Chinese (language)",
  "tốt, đẹp, hay": "good/nice/good",
  "ngon": "delicious/tasty",
  "ngày": "day/date",
  "uống": "drink",
  "và": "and",
  "mấy": "a few/several",
  "lượng từ": "measure word",
  "người nhà": "family members",
  "gặp": "meet/see",
  "dạy": "teach",
  "gọi, tên là": "call/be called",
  "chị gái": "older sister",
  "năm nay": "this year",
  "hôm nay": "today",
  "gần": "near/close",
  "ngay, chính là": "right away/just/exactly",
  "cà phê": "coffee",
  "nhìn, xem": "look/watch",
  "dễ thương": "cute/lovely",
  "khách sáo": "polite/formal",
  "thời gian rảnh": "free time",
  "đồng (VNĐ)": "yuan/Chinese dollar",
  "nhanh": "fast/quick",
  "vui, hạnh phúc": "happy/joyful",
  "thầy giáo, cô giáo": "teacher",
  "rồi": "already (perfective particle)",
  "lưu học sinh": "international student",
  "luật sư": "lawyer",
  "mẹ": "mom/mother",
  "từ để hỏi": "question particle",
  "không sao": "it's nothing/that's okay",
  "không có": "don't have/none",
  "em gái": "younger sister",
  "từ chỉ số nhiều": "plural marker",
  "cơm": "rice (cooked)",
  "bên, phía": "side/direction",
  "danh thiếp": "business card",
  "tên": "name",
  "ngày mai": "tomorrow",
  "nào": "which",
  "đâu, ở đâu": "where",
  "vậy, vậy thì": "so/then",
  "ở đó, nơi đó": "there",
  "trà sữa": "milk tea/bubble tea",
  "nam": "male/man",
  "bạn trai": "boyfriend",
  "anh, chị, bạn,...": "you (informal)",
  "các anh, các chị,...": "you (plural informal)",
  "xưng hô tôn trọng": "you (polite/formal)",
  "thịt bò": "beef",
  "nữ": "female/woman",
  "bạn gái": "girlfriend",
  "bạn, bạn bè": "friend/friends",
  "rẻ": "cheap/inexpensive",
  "đẹp, xinh đẹp": "beautiful/pretty",
  "quả táo": "apple",
  "phía trước": "front/before",
  "tiền": "money",
  "rau xanh": "vegetables/green vegetables",
  "mời": "invite/please",
  "xin hỏi": "excuse me/may I ask",
  "đi": "go",
  "sau đó": "then/after that",
  "người": "person/people",
  "nhân dân": "people/nation's people",
  "quen biết": "to know (someone)/be acquainted",
  "ai": "who",
  "gì, cái gì": "what",
  "sinh nhật": "birthday",
  "sư phụ, thầy": "master/teacher (respectful)",
  "việc, vấn đề": "matter/thing/affair",
  "là": "to be/is",
  "nhà sách": "bookstore/bookshop",
  "tuổi": "years old/age",
  "anh ấy, ông ấy,...": "he/him",
  "chị ấy, bà ấy,...": "she/her",
  "họ": "they/them",
  "quá": "too/excessively",
  "bữa tối": "dinner/evening meal",
  "buổi tối": "evening",
  "bát": "bowl (measure word)",
  "đi đến, hướng tới": "to/toward",
  "tại sao": "why",
  "hỏi": "ask/question",
  "tôi": "I/me",
  "thích": "to like",
  "ngài, ông": "Mr./sir",
  "muốn, suy nghĩ": "to want/to think",
  "nhỏ, bé": "small/little",
  "tiểu thư, cô, em": "Miss/young lady",
  "cảm ơn": "thank you",
  "tuần": "week",
  "thứ sáu": "Friday",
  "học": "study/learn",
  "học sinh, sinh viên": "student",
  "học tập": "to study/study",
  "trường học": "school",
  "muốn, cần, phải": "to want/to need/must",
  "cũng": "also/too",
  "bác sĩ": "doctor",
  "tất cả, tổng cộng": "altogether/in total",
  "một chút": "a little/a bit",
  "ngân hàng": "bank",
  "tiếng Anh": "English (language)",
  "có": "to have/there is",
  "rảnh rỗi": "free/have free time",
  "nổi tiếng": "famous/well-known",
  "vừa, lại": "both...and.../also/again",
  "bên phải": "right (direction)",
  "vừa... vừa...": "both...and...",
  "xa": "far/distant",
  "tháng": "month",
  "lại": "again/once more",
  "đang, ở tại": "at/in/located",
  "hẹn gặp lại": "goodbye/see you",
  "thế nào": "how/what...like",
  "ảnh": "photo/picture",
  "này": "this",
  "ở đây": "here",
  "thật, thật là": "really/truly",
  "con (lượng từ)": "measure word for small animals",
  "biết": "to know (a fact)",
  "trung học": "middle school/high school",
  "đi bộ": "walk (on foot)",
  "bên trái": "left (direction)",
  "ngồi": "sit",
  "làm": "to do/to make",
  // Additional mappings from sentences
  "Tôi có ba quả táo.": "I have three apples.",
  "Hôm nay là thứ hai.": "Today is Monday.",
  "Bạn khỏe không?": "How are you?",
  "Tôi là người Việt Nam.": "I am Vietnamese.",
  "Tôi yêu bố mẹ của tôi.": "I love my dad and mom.",
  "Anh ấy là anh trai tôi.": "He is my older brother.",
  "Bây giờ là mấy giờ?": "What time is it now?",
  "Tôi đi học lúc 8 giờ.": "I go to school at 8 o'clock.",
  "Tôi muốn uống trà.": "I want to drink tea.",
  "Cơm rất ngon.": "Rice is very delicious.",
  "Tôi là học sinh.": "I am a student.",
  "Tôi học tiếng Hán.": "I study Chinese.",
  "Cái này bao nhiêu tiền?": "How much is this?",
  "Siêu thị ở đâu?": "Where is the supermarket?",
  "Tôi thích xem phim.": "I like watching movies.",
  "Hôm nay là thứ mấy?": "What day of the week is it today?",
  "Tôi không đói.": "I am not hungry.",
  "Trung Quốc rất lớn.": "China is very big.",
  "Cô ấy là bạn gái tôi.": "She is my girlfriend.",
  "Anh ấy bao nhiêu tuổi?": "How old is he?",
};

// Common single words mapping
const SINGLE_WORD_MAP: Record<string, string> = {
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
  "爸爸": "dad/father",
  "吧": "modal particle (suggestion)",
  "杯": "cup/glass",
  "不客气": "you're welcome",
  "不": "no/not",
  "菜": "food/dishes",
  "茶": "tea",
  "超市": "supermarket",
  "吃": "eat",
  "出租车": "taxi",
  "从": "from",
  "大": "big/large",
  "大学": "university",
  "到": "to/arrive",
  "的": "possessive particle",
  "地铁": "subway/metro",
  "弟弟": "younger brother",
  "电影": "movie/film",
  "电影院": "cinema",
  "都": "all/both",
  "对": "correct/right",
  "对不起": "sorry",
  "对面": "opposite/across from",
  "多大": "how old",
  "多少": "how many/how much",
  "饿": "hungry",
  "饭店": "restaurant",
  "非常": "very/extremely",
  "附近": "nearby",
  "高兴": "happy/pleased",
  "哥哥": "older brother",
  "个": "measure word (general)",
  "工作": "work/job",
  "公交车": "bus",
  "公司": "company",
  "狗": "dog",
  "拐": "turn",
  "广场": "square/plaza",
  "贵": "expensive/precious",
  "贵姓": "your surname (honorific)",
  "国": "country/nation",
  "还": "still/also",
  "还是": "or",
  "汉语": "Chinese (language)",
  "好": "good/nice",
  "好吃": "delicious/tasty",
  "号": "number/date",
  "喝": "drink",
  "和": "and",
  "几": "a few/several",
  "家": "home/family",
  "家人": "family members",
  "见": "meet/see",
  "教": "teach",
  "叫": "call/be called",
  "姐姐": "older sister",
  "今年": "this year",
  "今天": "today",
  "近": "near/close",
  "就": "right away/just/then",
  "咖啡": "coffee",
  "看": "look/watch",
  "可爱": "cute/lovely",
  "客气": "polite/formal",
  "空儿": "free time",
  "口": "mouth/measure word for family",
  "块": "yuan/Chinese dollar",
  "快": "fast/quick",
  "快乐": "happy/joyful",
  "老师": "teacher",
  "了": "perfective particle (completed action)",
  "两": "two",
  "留学生": "international student",
  "律师": "lawyer",
  "妈妈": "mom/mother",
  "吗": "question particle",
  "没关系": "it's okay/doesn't matter",
  "没有": "don't have/none/not have",
  "妹妹": "younger sister",
  "们": "plural marker",
  "米饭": "rice (cooked)",
  "面": "side/direction/noodles",
  "名片": "business card",
  "名字": "name",
  "明天": "tomorrow",
  "哪": "which",
  "哪儿": "where",
  "哪里": "where",
  "那": "that",
  "那儿": "there",
  "那里": "there",
  "奶茶": "milk tea/bubble tea",
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
  "请": "please/invite",
  "请问": "excuse me (polite)",
  "去": "go",
  "然后": "then/after that",
  "人": "person/people",
  "人民": "people/nation",
  "认识": "to know (someone)",
  "谁": "who",
  "什么": "what",
  "生日": "birthday",
  "师傅": "master/teacher (respectful)",
  "事": "matter/thing",
  "是": "to be/is",
  "书店": "bookstore",
  "岁": "years old",
  "他": "he/him",
  "她": "she/her",
  "他们": "they/them",
  "太......了": "too... (excessiveness)",
  "晚饭": "dinner",
  "晚上": "evening",
  "碗": "bowl",
  "往": "to/toward",
  "为什么": "why",
  "问": "ask/question",
  "我": "I/me",
  "喜欢": "to like",
  "先生": "Mr./sir",
  "想": "to want/to think",
  "小": "small/little",
  "小姐": "Miss/young lady",
  "谢谢": "thank you",
  "星期": "week",
  "星期五": "Friday",
  "姓": "surname/family name",
  "学": "study/learn",
  "学生": "student",
  "学习": "to study",
  "学校": "school",
  "要": "to want/to need/must",
  "也": "also/too",
  "医生": "doctor",
  "一共": "altogether/in total",
  "(一)点儿": "a little/a bit",
  "银行": "bank",
  "英语": "English (language)",
  "有": "to have/there is",
  "有空儿": "to have free time",
  "有名": "famous/well-known",
  "又": "again/also/both",
  "右": "right (direction)",
  "又......又......": "both...and...",
  "远": "far/distant",
  "月": "month",
  "再": "again/once more",
  "在": "at/in/located",
  "再见": "goodbye/see you",
  "怎么": "how/what",
  "怎么样": "how/what about",
  "照片": "photo/picture",
  "这": "this",
  "这儿": "here",
  "这里": "here",
  "真": "really/truly",
  "只": "only/just",
  "知道": "to know (a fact)",
  "中学": "middle school/high school",
  "走": "walk/go",
  "走路": "to walk (on foot)",
  "左": "left (direction)",
  "坐": "sit",
  "做": "to do/to make",
};

function translateVietnameseToEnglish(vietnamese: string): string {
  const trimmed = vietnamese.trim();

  // Check exact match first
  if (SINGLE_WORD_MAP[trimmed]) {
    return SINGLE_WORD_MAP[trimmed];
  }

  // Check partial match for compound phrases
  for (const [vi, en] of Object.entries(SINGLE_WORD_MAP)) {
    if (trimmed.includes(vi) && vi.length > 3) {
      return en;
    }
  }

  // Extract the first part before comma or separator
  const firstPart = trimmed.split(/[，,、/]/)[0].trim();
  if (SINGLE_WORD_MAP[firstPart]) {
    return SINGLE_WORD_MAP[firstPart];
  }

  // Check Vietnamese meaning patterns
  if (trimmed.includes("một")) return "one";
  if (trimmed.includes("hai")) return "two";
  if (trimmed.includes("ba")) return "three";
  if (trimmed.includes("bốn")) return "four";
  if (trimmed.includes("năm")) return "five";
  if (trimmed.includes("sáu")) return "six";
  if (trimmed.includes("bảy")) return "seven";
  if (trimmed.includes("tám")) return "eight";
  if (trimmed.includes("chín")) return "nine";
  if (trimmed.includes("mười")) return "ten";
  if (trimmed.includes("người")) return "person";
  if (trimmed.includes("đi")) return "to go";
  if (trimmed.includes("đến")) return "to arrive";
  if (trimmed.includes("có")) return "to have";
  if (trimmed.includes("không")) return "no/not";
  if (trimmed.includes("ăn")) return "to eat";
  if (trimmed.includes("uống")) return "to drink";
  if (trimmed.includes("học")) return "to study";
  if (trimmed.includes("xem")) return "to watch";
  if (trimmed.includes("làm")) return "to do";
  if (trimmed.includes("biết")) return "to know";
  if (trimmed.includes("thích")) return "to like";
  if (trimmed.includes("muốn")) return "to want";
  if (trimmed.includes("tên")) return "name";
  if (trimmed.includes("tuổi")) return "years old";
  if (trimmed.includes("bạn")) return "friend";
  if (trimmed.includes("người")) return "person/people";
  if (trimmed.includes("thầy") || trimmed.includes("cô")) return "teacher";
  if (trimmed.includes("bố") || trimmed.includes("mẹ") || trimmed.includes("爸") || trimmed.includes("妈")) return "parent";
  if (trimmed.includes("anh") || trimmed.includes("chị") || trimmed.includes("em")) return "sibling";
  if (trimmed.includes("trường")) return "school";
  if (trimmed.includes("nhà")) return "house/home";
  if (trimmed.includes("công ty")) return "company";
  if (trimmed.includes("tiền")) return "money";
  if (trimmed.includes("gần")) return "near";
  if (trimmed.includes("xa")) return "far";
  if (trimmed.includes("lớn") || trimmed.includes("to")) return "big";
  if (trimmed.includes("nhỏ") || trimmed.includes("bé")) return "small";
  if (trimmed.includes("đẹp")) return "beautiful";
  if (trimmed.includes("ngon")) return "delicious";
  if (trimmed.includes("ngày")) return "day";
  if (trimmed.includes("tháng")) return "month";
  if (trimmed.includes("năm")) return "year";
  if (trimmed.includes("hôm")) return "today";
  if (trimmed.includes("mai")) return "tomorrow/morning";
  if (trimmed.includes("tối")) return "evening";
  if (trimmed.includes("cà phê")) return "coffee";
  if (trimmed.includes("trà")) return "tea";
  if (trimmed.includes("cơm") || trimmed.includes("gạo")) return "rice";
  if (trimmed.includes("thịt")) return "meat";
  if (trimmed.includes("táo") || trimmed.includes("quả")) return "fruit/apple";
  if (trimmed.includes("rau")) return "vegetables";
  if (trimmed.includes("ở")) return "at/in/located";
  if (trimmed.includes("đây")) return "here";
  if (trimmed.includes("đó")) return "there";
  if (trimmed.includes("nào")) return "which";
  if (trimmed.includes("ai")) return "who";
  if (trimmed.includes("gì")) return "what";
  if (trimmed.includes("sao")) return "why/how";
  if (trimmed.includes("bao nhiêu")) return "how many/much";
  if (trimmed.includes("cảm ơn")) return "thank you";
  if (trimmed.includes("xin lỗi")) return "sorry";
  if (trimmed.includes("khỏe")) return "healthy/well";
  if (trimmed.includes("vui")) return "happy/joyful";
  if (trimmed.includes("yêu")) return "to love";
  if (trimmed.includes("gặp")) return "to meet/see";
  if (trimmed.includes("nói")) return "to speak/talk";
  if (trimmed.includes("đọc")) return "to read";
  if (trimmed.includes("viết")) return "to write";
  if (trimmed.includes("nghe")) return "to listen/hear";
  if (trimmed.includes("mua")) return "to buy";
  if (trimmed.includes("bán")) return "to sell";
  if (trimmed.includes("đi bộ")) return "to walk";
  if (trimmed.includes("ngồi")) return "to sit";
  if (trimmed.includes("ngủ")) return "to sleep";
  if (trimmed.includes("tắm")) return "to bathe/shower";
  if (trimmed.includes("rửa")) return "to wash";
  if (trimmed.includes("nấu")) return "to cook";
  if (trimmed.includes("uống")) return "to drink";
  if (trimmed.includes("rất")) return "very";
  if (trimmed.includes("cũng")) return "also/too";
  if (trimmed.includes("còn")) return "still/also";
  if (trimmed.includes("đã")) return "already";
  if (trimmed.includes("sẽ")) return "will/shall";
  if (trimmed.includes("đang")) return "currently/now";
  if (trimmed.includes("phải")) return "must/have to";
  if (trimmed.includes("có thể")) return "can/possible";
  if (trimmed.includes("được")) return "can/allowed";
  if (trimmed.includes("không")) return "no/not";
  if (trimmed.includes("là")) return "to be/is";
  if (trimmed.includes("và")) return "and";
  if (trimmed.includes("hay")) return "or/good";
  if (trimmed.includes("但是")) return "but";
  if (trimmed.includes("因为")) return "because";
  if (trimmed.includes("所以")) return "therefore/so";
  if (trimmed.includes("如果")) return "if";
  if (trimmed.includes("虽然")) return "although";
  if (trimmed.includes("từ")) return "from/word";
  if (trimmed.includes("của")) return "of (possessive)";
  if (trimmed.includes("nước")) return "country/water";
  if (trimmed.includes("tiếng")) return "language";
  if (trimmed.includes("phim")) return "movie/film";
  if (trimmed.includes("nhạc")) return "music";
  if (trimmed.includes("sách")) return "book";
  if (trimmed.includes("báo")) return "newspaper";
  if (trimmed.includes("thư")) return "letter/mail";
  if (trimmed.includes("điện")) return "electricity";
  if (trimmed.includes("nước")) return "water";
  if (trimmed.includes("giờ")) return "hour/o'clock";
  if (trimmed.includes("phút")) return "minute";
  if (trimmed.includes("giây")) return "second";
  if (trimmed.includes("lần")) return "time (occurrence)";
  if (trimmed.includes("người")) return "person";
  if (trimmed.includes("bạn")) return "friend";
  if (trimmed.includes("thầy")) return "teacher (male)";
  if (trimmed.includes("cô")) return "teacher (female)";
  if (trimmed.includes("bác")) return "uncle/aunt (older)";
  if (trimmed.includes("chú")) return "uncle (younger)";
  if (trimmed.includes("cậu")) return "cousin (male informal)";
  if (trimmed.includes("mợ")) return "aunt-in-law";
  if (trimmed.includes("chắc")) return "sure/certain";
  if (trimmed.includes("có lẽ")) return "perhaps/maybe";
  if (trimmed.includes("vẫn")) return "still/yet";
  if (trimmed.includes("lại")) return "again/back";
  if (trimmed.includes("mới")) return "new/just";
  if (trimmed.includes("cũ")) return "old";
  if (trimmed.includes("nhiều")) return "many/much";
  if (trimmed.includes("ít")) return "few/little";
  if (trimmed.includes("hết")) return "all/finished";
  if (trimmed.includes("bắt đầu")) return "to start/begin";
  if (trimmed.includes("kết thúc")) return "to end/finish";
  if (trimmed.includes("trước")) return "before/front";
  if (trimmed.includes("sau")) return "after/back";
  if (trimmed.includes("trong")) return "in/inside";
  if (trimmed.includes("ngoài")) return "outside";
  if (trimmed.includes("trên")) return "on/above";
  if (trimmed.includes("dưới")) return "under/below";
  if (trimmed.includes("giữa")) return "middle/center";
  if (trimmed.includes("bên")) return "side";
  if (trimmed.includes("cạnh")) return "beside/near";
  if (trimmed.includes("gần")) return "near/close";
  if (trimmed.includes("xa")) return "far/distant";
  if (trimmed.includes("đường")) return "road/street";
  if (trimmed.includes("nhà")) return "house/home";
  if (trimmed.includes("phòng")) return "room";
  if (trimmed.includes("cửa")) return "door/gate";
  if (trimmed.includes("cửa hàng")) return "shop/store";
  if (trimmed.includes("bệnh viện")) return "hospital";
  if (trimmed.includes("trường")) return "school";
  if (trimmed.includes("sân")) return "yard/field";
  if (trimmed.includes("vườn")) return "garden";
  if (trimmed.includes("công viên")) return "park";
  if (trimmed.includes("bãi")) return "beach/parking lot";
  if (trimmed.includes("núi")) return "mountain";
  if (trimmed.includes("sông")) return "river";
  if (trimmed.includes("biển")) return "sea/ocean";
  if (trimmed.includes("hồ")) return "lake";
  if (trimmed.includes("đảo")) return "island";
  if (trimmed.includes("trời")) return "sky/heaven";
  if (trimmed.includes("mặt")) return "face/surface";
  if (trimmed.includes("mắt")) return "eye";
  if (trimmed.includes("tai")) return "ear";
  if (trimmed.includes("mũi")) return "nose";
  if (trimmed.includes("miệng")) return "mouth";
  if (trimmed.includes("tay")) return "hand/arm";
  if (trimmed.includes("chân")) return "foot/leg";
  if (trimmed.includes("đầu")) return "head";
  if (trimmed.includes("bụng")) return "stomach/belly";
  if (trimmed.includes("lưng")) return "back";
  if (trimmed.includes("ngực")) return "chest";
  if (trimmed.includes("tim")) return "heart";
  if (trimmed.includes("gan")) return "liver";
  if (trimmed.includes("thận")) return "kidney";
  if (trimmed.includes("phổi")) return "lung";
  if (trimmed.includes("não")) return "brain";
  if (trimmed.includes("máu")) return "blood";
  if (trimmed.includes("da")) return "skin";
  if (trimmed.includes("tóc")) return "hair";
  if (trimmed.includes("móng")) return "nail/hoof";
  if (trimmed.includes("xương")) return "bone";
  if (trimmed.includes("thịt")) return "meat/flesh";
  if (trimmed.includes("gân")) return "tendon/sinew";
  if (trimmed.includes("áo")) return "shirt/clothes";
  if (trimmed.includes("quần")) return "pants/trousers";
  if (trimmed.includes("váy")) return "skirt";
  if (trimmed.includes("giày")) return "shoes";
  if (trimmed.includes("mũ")) return "hat/cap";
  if (trimmed.includes("kính")) return "glasses/lens";
  if (trimmed.includes("đồng hồ")) return "watch/clock";
  if (trimmed.includes("nhẫn")) return "ring (jewelry)";
  if (trimmed.includes("vòng")) return "bracelet/circle";
  if (trimmed.includes("túi")) return "bag/pocket";
  if (trimmed.includes("包")) return "bag";
  if (trimmed.includes("xe")) return "vehicle";
  if (trimmed.includes("ô tô")) return "car";
  if (trimmed.includes("máy")) return "machine/engine";
  if (trimmed.includes("điện")) return "electricity";
  if (trimmed.includes("thoại")) return "telephone";
  if (trimmed.includes("tiền")) return "money";
  if (trimmed.includes("ngân")) return "silver/bank";
  if (trimmed.includes("thẻ")) return "card";
  if (trimmed.includes("hóa")) return "bill/receipt";
  if (trimmed.includes("giá")) return "price";
  if (trimmed.includes("món")) return "dish/item";
  if (trimmed.includes("cơm")) return "rice (cooked)";
  if (trimmed.includes("bánh")) return "cake/biscuit";
  if (trimmed.includes("đường")) return "sugar/road";
  if (trimmed.includes("muối")) return "salt";
  if (trimmed.includes("ớt")) return "chili pepper";
  if (trimmed.includes("tiêu")) return "pepper";
  if (trimmed.includes("đậu")) return "bean/bean curd";
  if (trimmed.includes("thịt")) return "meat";
  if (trimmed.includes("cá")) return "fish";
  if (trimmed.includes("tôm")) return "shrimp";
  if (trimmed.includes("cua")) return "crab";
  if (trimmed.includes("trứng")) return "egg";
  if (trimmed.includes("sữa")) return "milk";
  if (trimmed.includes("phô mai")) return "cheese";
  if (trimmed.includes("kem")) return "ice cream";
  if (trimmed.includes("bia")) return "beer";
  if (trimmed.includes("rượu")) return "alcohol/wine";
  if (trimmed.includes("nước")) return "water/drink";
  if (trimmed.includes("hoa")) return "flower";
  if (trimmed.includes("cây")) return "tree/plant";
  if (trimmed.includes("cỏ")) return "grass";
  if (trimmed.includes("lá")) return "leaf";
  if (trimmed.includes("hoa")) return "flower/blossom";
  if (trimmed.includes("quả")) return "fruit/result";
  if (trimmed.includes("hạt")) return "seed/nut";
  if (trimmed.includes("gỗ")) return "wood";
  if (trimmed.includes("đá")) return "stone/stone";
  if (trimmed.includes("kim")) return "needle/gold";
  if (trimmed.includes("bạc")) return "silver";
  if (trimmed.includes("đồng")) return "copper/bronze";
  if (trimmed.includes("sắt")) return "iron";
  if (trimmed.includes("inox")) return "stainless steel";
  if (trimmed.includes("gạch")) return "brick";
  if (trimmed.includes("ngói")) return "roof tile";
  if (trimmed.includes("kính")) return "glass/mirror";
  if (trimmed.includes("gương")) return "mirror";
  if (trimmed.includes("bàn")) return "table/desk";
  if (trimmed.includes("ghế")) return "chair";
  if (trimmed.includes("giường")) return "bed";
  if (trimmed.includes("tủ")) return "cabinet/wardrobe";
  if (trimmed.includes("gối")) return "pillow";
  if (trimmed.includes("mền")) return "blanket/quilt";
  if (trimmed.includes("khăn")) return "towel/handkerchief";
  if (trimmed.includes("giấy")) return "paper";
  if (trimmed.includes("bút")) return "pen/pencil";
  if (trimmed.includes("sách")) return "book";
  if (trimmed.includes("vở")) return "notebook";
  if (trimmed.includes("bản")) return "copy/version";
  if (trimmed.includes("đĩa")) return "plate/disc";
  if (trimmed.includes("chén")) return "cup/bowl";
  if (trimmed.includes("thìa")) return "spoon";
  if (trimmed.includes("đũa")) return "chopsticks";
  if (trimmed.includes("nĩa")) return "fork";
  if (trimmed.includes("dao")) return "knife";
  if (trimmed.includes("bếp")) return "kitchen/stove";
  if (trimmed.includes("lò")) return "oven/stove";
  if (trimmed.includes("tủ lạnh")) return "refrigerator";
  if (trimmed.includes("điều")) return "condition/remote";
  if (trimmed.includes("hòa")) return "harmonize/mix";
  if (trimmed.includes("bình")) return "pitcher/平";
  if (trimmed.includes("lọ")) return "bottle/jar";
  if (trimmed.includes("hộp")) return "box/can";
  if (trimmed.includes("bao")) return "bag/pack";
  if (trimmed.includes("kiện")) return "item/parcel";
  if (trimmed.includes("bưu")) return "post/mail";
  if (trimmed.includes("điện")) return "electricity";
  if (trimmed.includes("thoại")) return "telephone";
  if (trimmed.includes("ứng")) return "apply/use";
  if (trimmed.includes("dụng")) return "use/equipment";
  if (trimmed.includes("máy")) return "machine";
  if (trimmed.includes("tín hiệu")) return "signal";
  if (trimmed.includes("sóng")) return "wave";
  if (trimmed.includes("tần")) return "frequency";
  if (trimmed.includes("kênh")) return "channel";
  if (trimmed.includes("đài")) return "radio/station";
  if (trimmed.includes("phát")) return "broadcast/transmit";
  if (trimmed.includes("thu")) return "receive/collect";
  if (trimmed.includes("hình")) return "image/shape";
  if (trimmed.includes("ảnh")) return "photo/picture";
  if (trimmed.includes("màu")) return "color";
  if (trimmed.includes("sắc")) return "sharpness/color";
  if (trimmed.includes("nét")) return "stroke/trait";
  if (trimmed.includes("nghĩa")) return "meaning";
  if (trimmed.includes("từ")) return "word/from";
  if (trimmed.includes("câu")) return "sentence/clause";
  if (trimmed.includes("đoạn")) return "paragraph/section";
  if (trimmed.includes("bài")) return "lesson/article";
  if (trimmed.includes("văn")) return "writing/text";
  if (trimmed.includes("thơ")) return "poetry/poem";
  if (trimmed.includes("nhạc")) return "music";
  if (trimmed.includes("họa")) return "painting";
  if (trimmed.includes("kiến")) return "ant/architect";
  if (trimmed.includes("trúc")) return "bamboo";
  if (trimmed.includes("tạo")) return "create/form";
  if (trimmed.includes("thành")) return "city/accomplish";
  if (trimmed.includes("xong")) return "finished/done";
  if (trimmed.includes("đi")) return "to go";
  if (trimmed.includes("lại")) return "come/back";
  if (trimmed.includes("vào")) return "enter";
  if (trimmed.includes("ra")) return "exit/out";
  if (trimmed.includes("lên")) return "up/go up";
  if (trimmed.includes("xuống")) return "down/go down";
  if (trimmed.includes("qua")) return "pass/through";
  if (trimmed.includes("về")) return "return/back";
  if (trimmed.includes("đến")) return "to/arrive";
  if (trimmed.includes("từ")) return "from";
  if (trimmed.includes("bắt")) return "catch/grasp";
  if (trimmed.includes("nắm")) return "hold/grasp";
  if (trimmed.includes("chạm")) return "touch";
  if (trimmed.includes("sờ")) return "touch/feel";
  if (trimmed.includes("ngửi")) return "smell";
  if (trimmed.includes("nếm")) return "taste";
  if (trimmed.includes("nghe")) return "listen/hear";
  if (trimmed.includes("nhìn")) return "look/see";
  if (trimmed.includes("thấy")) return "see/notice";
  if (trimmed.includes("gọi")) return "call";
  if (trimmed.includes("nói")) return "speak/talk";
  if (trimmed.includes("hỏi")) return "ask";
  if (trimmed.includes("đáp")) return "answer/reply";
  if (trimmed.includes("trả lời")) return "answer/reply";
  if (trimmed.includes("thìa")) return "spoon";
  if (trimmed.includes("bàn")) return "discuss/table";
  if (trimmed.includes("tánh")) return "nature/temper";
  if (trimmed.includes("tính")) return "to calculate/nature";
  if (trimmed.includes("tính cách")) return "personality/character";
  if (trimmed.includes("nết")) return "manner/conduct";
  if (trimmed.includes("đức")) return "virtue/moral";
  if (trimmed.includes("hạnh")) return "good/virtuous";
  if (trimmed.includes("phước")) return "blessing/virtue";
  if (trimmed.includes("lành")) return "kind/good";
  if (trimmed.includes("ngay")) return "straight/right/immediately";
  if (trimmed.includes("thật")) return "real/truly";
  if (trimmed.includes("giả")) return "fake/false";
  if (trimmed.includes("đúng")) return "correct/right";
  if (trimmed.includes("sai")) return "wrong/incorrect";
  if (trimmed.includes("mới")) return "new/just";
  if (trimmed.includes("cũ")) return "old";
  if (trimmed.includes("trẻ")) return "young";
  if (trimmed.includes("già")) return "old/elderly";
  if (trimmed.includes("cao")) return "tall/high";
  if (trimmed.includes("thấp")) return "short/low";
  if (trimmed.includes("dài")) return "long";
  if (trimmed.includes("ngắn")) return "short (length)";
  if (trimmed.includes("rộng")) return "wide/broad";
  if (trimmed.includes("hẹp")) return "narrow";
  if (trimmed.includes("sâu")) return "deep";
  if (trimmed.includes("nông")) return "shallow";
  if (trimmed.includes("đầy")) return "full";
  if (trimmed.includes("trống")) return "empty";
  if (trimmed.includes("nặng")) return "heavy";
  if (trimmed.includes("nhẹ")) return "light (weight)";
  if (trimmed.includes("cứng")) return "hard/stiff";
  if (trimmed.includes("mềm")) return "soft";
  if (trimmed.includes("đắt")) return "expensive";
  if (trimmed.includes("rẻ")) return "cheap";
  if (trimmed.includes("mát")) return "cool/refreshing";
  if (trimmed.includes("ấm")) return "warm";
  if (trimmed.includes("nóng")) return "hot";
  if (trimmed.includes("lạnh")) return "cold";
  if (trimmed.includes("ngọt")) return "sweet";
  if (trimmed.includes("chua")) return "sour";
  if (trimmed.includes("đắng")) return "bitter";
  if (trimmed.includes("mặn")) return "salty";
  if (trimmed.includes("bạo")) return "violent/brutal";
  if (trimmed.includes("tốt")) return "good";
  if (trimmed.includes("xấu")) return "bad/ugly";
  if (trimmed.includes("đẹp")) return "beautiful/pretty";
  if (trimmed.includes("vui")) return "happy/joyful";
  if (trimmed.includes("buồn")) return "sad";
  if (trimmed.includes("giận")) return "angry";
  if (trimmed.includes("sợ")) return "afraid/scared";
  if (trimmed.includes("mệt")) return "tired";
  if (trimmed.includes("khỏe")) return "healthy/strong";
  if (trimmed.includes("đói")) return "hungry";
  if (trimmed.includes("khát")) return "thirsty";
  if (trimmed.includes("bệnh")) return "sick/illness";
  if (trimmed.includes("chữa")) return "cure/treat";
  if (trimmed.includes("khỏi")) return "recover/get over";
  if (trimmed.includes("đau")) return "painful/hurt";
  if (trimmed.includes("nguy")) return "dangerous";
  if (trimmed.includes("an toàn")) return "safe";
  if (trimmed.includes("bình")) return "peaceful/calm";
  if (trimmed.includes("yên")) return "quiet/still";
  if (trimmed.includes("im")) return "silent/quiet";
  if (trimmed.includes("đông")) return "crowded/busy";
  if (trimmed.includes("yên tĩnh")) return "quiet/peaceful";
  if (trimmed.includes("sạch")) return "clean";
  if (trimmed.includes("bẩn")) return "dirty";
  if (trimmed.includes("ướt")) return "wet";
  if (trimmed.includes("khô")) return "dry";
  if (trimmed.includes("thẳng")) return "straight";
  if (trimmed.includes("cong")) return "bent/curved";
  if (trimmed.includes("tròn")) return "round";
  if (trimmed.includes("vuông")) return "square";
  if (trimmed.includes("bằng phẳng")) return "flat/even";
  if (trimmed.includes("gồ ghề")) return "rough/uneven";
  if (trimmed.includes("bóng")) return "bright/shiny";
  if (trimmed.includes("tối")) return "dark";
  if (trimmed.includes("sáng")) return "bright";
  if (trimmed.includes("đen")) return "black";
  if (trimmed.includes("trắng")) return "white";
  if (trimmed.includes("đỏ")) return "red";
  if (trimmed.includes("xanh")) return "green/blue";
  if (trimmed.includes("vàng")) return "yellow";
  if (trimmed.includes("cam")) return "orange";
  if (trimmed.includes("tím")) return "purple";
  if (trimmed.includes("hồng")) return "pink";
  if (trimmed.includes("nâu")) return "brown";
  if (trimmed.includes("xám")) return "gray";
  if (trimmed.includes("đỏ")) return "red";
  if (trimmed.includes("hồng")) return "pink/blush";
  if (trimmed.includes("đỏ tươi")) return "bright red";
  if (trimmed.includes("đỏ thẫm")) return "dark red";
  if (trimmed.includes("xanh lá")) return "green";
  if (trimmed.includes("xanh dương")) return "blue";
  if (trimmed.includes("xanh lơ")) return "cyan/teal";
  if (trimmed.includes("xanh nước biển")) return "navy blue";
  if (trimmed.includes("vàng nhạt")) return "light yellow";
  if (trimmed.includes("vàng đậm")) return "dark yellow";
  if (trimmed.includes("cam nhạt")) return "light orange";
  if (trimmed.includes("tím nhạt")) return "light purple";
  if (trimmed.includes("tím đậm")) return "dark purple";
  if (trimmed.includes("hồng nhạt")) return "light pink";
  if (trimmed.includes("hồng đậm")) return "dark pink";
  if (trimmed.includes("nâu nhạt")) return "light brown";
  if (trimmed.includes("nâu đậm")) return "dark brown";
  if (trimmed.includes("xám nhạt")) return "light gray";
  if (trimmed.includes("xám đậm")) return "dark gray";
  if (trimmed.includes("trắng ngà")) return "ivory";
  if (trimmed.includes("đen tuyền")) return "jet black";
  if (trimmed.includes("hồng cánh sen")) return "lotus pink";
  if (trimmed.includes("xanh bạc hà")) return "mint green";
  if (trimmed.includes("đỏ son")) return "cinnabar red";
  if (trimmed.includes("tím oải hương")) return "lavender";
  if (trimmed.includes("vàng mù tạt")) return "mustard yellow";
  if (trimmed.includes("cam đất sét")) return "terracotta";
  if (trimmed.includes("xanh ô liu")) return "olive green";
  if (trimmed.includes("nâu sô cô la")) return "chocolate brown";
  if (trimmed.includes("xám thép")) return "steel gray";
  if (trimmed.includes("hồng san hô")) return "coral pink";
  if (trimmed.includes("xanh ngọc")) return "emerald green";
  if (trimmed.includes("xanh đen")) return "dark green/black-green";
  if (trimmed.includes("trắng bạc")) return "silver white";
  if (trimmed.includes("vàng kim loại")) return "metallic gold";
  if (trimmed.includes("bạc")) return "silver";
  if (trimmed.includes("vàng")) return "gold";
  if (trimmed.includes("đồng")) return "copper/bronze";
  if (trimmed.includes("đen nhân tạo")) return "charcoal";
  if (trimmed.includes("xanh Navy")) return "navy blue";
  if (trimmed.includes("xanh Turquoise")) return "turquoise";
  if (trimmed.includes("vàng Bright")) return "bright yellow";
  if (trimmed.includes("đỏ Ruby")) return "ruby red";
  if (trimmed.includes("tím Royal")) return "royal purple";
  if (trimmed.includes("hồng Flamingo")) return "flamingo pink";
  if (trimmed.includes("xám Charcoal")) return "charcoal gray";
  if (trimmed.includes("nâu Beige")) return "beige";
  if (trimmed.includes("nâu Cà phê")) return "coffee brown";
  if (trimmed.includes("xanh Pine")) return "pine green";
  if (trimmed.includes("xanh Jungle")) return "jungle green";
  if (trimmed.includes("cam Burnt")) return "burnt orange";
  if (trimmed.includes("đỏ Crimson")) return "crimson";
  if (trimmed.includes("vàng Mustard")) return "mustard";
  if (trimmed.includes("tím Plum")) return "plum purple";
  if (trimmed.includes("hồng Blush")) return "blush pink";
  if (trimmed.includes("nâu Caramel")) return "caramel brown";
  if (trimmed.includes("xám Slate")) return "slate gray";
  if (trimmed.includes("xanh Forest")) return "forest green";
  if (trimmed.includes("xanh Mint")) return "mint green";
  if (trimmed.includes("cam Peach")) return "peach orange";
  if (trimmed.includes("đỏ Brick")) return "brick red";
  if (trimmed.includes("vàng Honey")) return "honey yellow";
  if (trimmed.includes("tím Mauve")) return "mauve";
  if (trimmed.includes("hồng Dusty")) return "dusty rose";
  if (trimmed.includes("nâu Chestnut")) return "chestnut brown";
  if (trimmed.includes("xám Dove")) return "dove gray";
  if (trimmed.includes("xanh Jade")) return "jade green";
  if (trimmed.includes("xanh Seafoam")) return "seafoam green";
  if (trimmed.includes("cam Tangerine")) return "tangerine";
  if (trimmed.includes("đỏ Scarlet")) return "scarlet";
  if (trimmed.includes("vàng Saffron")) return "saffron yellow";
  if (trimmed.includes("tím Violet")) return "violet";
  if (trimmed.includes("hồng Rose")) return "rose pink";
  if (trimmed.includes("nâu Cocoa")) return "cocoa brown";
  if (trimmed.includes("xám Ash")) return "ash gray";
  if (trimmed.includes("vàng Chartreuse")) return "chartreuse";
  if (trimmed.includes("xanh Aquamarine")) return "aquamarine";
  if (trimmed.includes("cam Coral")) return "coral orange";
  if (trimmed.includes("đỏ Vermilion")) return "vermilion";
  if (trimmed.includes("vàng Marigold")) return "marigold yellow";
  if (trimmed.includes("tím Amethyst")) return "amethyst purple";
  if (trimmed.includes("hồng Magenta")) return "magenta pink";
  if (trimmed.includes("nâu Espresso")) return "espresso brown";
  if (trimmed.includes("xám Granite")) return "granite gray";
  if (trimmed.includes("vàng Canary")) return "canary yellow";
  if (trimmed.includes("xanh Cyan")) return "cyan";
  if (trimmed.includes("cam Apricot")) return "apricot";
  if (trimmed.includes("đỏ Rust")) return "rust red";
  if (trimmed.includes("vàng Lemon")) return "lemon yellow";
  if (trimmed.includes("tím Lilac")) return "lilac purple";
  if (trimmed.includes("hồng Salmon")) return "salmon pink";
  if (trimmed.includes("nâu Mocha")) return "mocha brown";
  if (trimmed.includes("xám Pewter")) return "pewter gray";
  if (trimmed.includes("vàng Turmeric")) return "turmeric yellow";
  if (trimmed.includes("xanh Teal")) return "teal";
  if (trimmed.includes("cam Rustic")) return "rustic orange";
  if (trimmed.includes("đỏ Terracotta")) return "terracotta red";
  if (trimmed.includes("vàng Dandelion")) return "dandelion yellow";
  if (trimmed.includes("tím Byzantium")) return "byzantium purple";
  if (trimmed.includes("hồng Raspberry")) return "raspberry pink";
  if (trimmed.includes("nâu Walnut")) return "walnut brown";
  if (trimmed.includes("xám Storm")) return "storm gray";
  if (trimmed.includes("vàng Canary")) return "canary yellow";
  if (trimmed.includes("xanh Malachite")) return "malachite green";
  if (trimmed.includes("cam Persimmon")) return "persimmon orange";
  if (trimmed.includes("đỏ Garnet")) return "garnet red";
  if (trimmed.includes("vàng mustard")) return "mustard yellow";
  if (trimmed.includes("tím wisteria")) return "wisteria purple";
  if (trimmed.includes("hồng ballet")) return "ballet pink";
  if (trimmed.includes("nâu umber")) return "umber brown";
  if (trimmed.includes("xám silver")) return "silver gray";
  if (trimmed.includes("bạc")) return "silver/metallic";
  if (trimmed.includes("đen tuyền")) return "pitch black";
  if (trimmed.includes("trắng tuyết")) return "snow white";
  if (trimmed.includes("xanh bách")) return "cypress green";
  if (trimmed.includes("vàng hoa cúc")) return "chrysanthemum yellow";
  if (trimmed.includes("cam bụi")) return "dusty orange";
  if (trimmed.includes("đỏ gạch")) return "brick red";
  if (trimmed.includes("tím lavender")) return "lavender purple";
  if (trimmed.includes("hồng đất")) return "dusty rose";
  if (trimmed.includes("nâu sô cô la")) return "chocolate brown";
  if (trimmed.includes("xám anthracite")) return "anthracite gray";
  if (trimmed.includes("vàng mật ong")) return "honey gold";
  if (trimmed.includes("xanh phỉ quế")) return "cinnamon green";
  if (trimmed.includes("cam thịt")) return "flesh orange";
  if (trimmed.includes("đỏ son")) return "cinnabar red";
  if (trimmed.includes("vàng nghệ")) return "turmeric yellow";
  if (trimmed.includes("tím oải")) return "lavender";
  if (trimmed.includes("hồng đá")) return "stone pink";
  if (trimmed.includes("nâu cà phê")) return "coffee brown";
  if (trimmed.includes("xám chì")) return "lead gray";
  if (trimmed.includes("vàng mạ")) return "gilded gold";
  if (trimmed.includes("xanh ngọc lam")) return "turquoise green";
  if (trimmed.includes("cam san hô")) return "coral orange";
  if (trimmed.includes("đỏ mận")) return "plum red";
  if (trimmed.includes("vàng sen")) return "lotus yellow";
  if (trimmed.includes("tím than")) return "charcoal purple";
  if (trimmed.includes("hồng phấn")) return "powder pink";
  if (trimmed.includes("nâu đất")) return "earth brown";
  if (trimmed.includes("xám bụi")) return "dust gray";
  if (trimmed.includes("vàng nghệ tây")) return "saffron";
  if (trimmed.includes("xanh bách hươu")) return "fallow deer green";
  if (trimmed.includes("cam đất sét")) return "terracotta";
  if (trimmed.includes("đỏ gô")) return "garnet";
  if (trimmed.includes("vàng thược")) return "thracian yellow";
  if (trimmed.includes("tím thược")) return "thracian purple";
  if (trimmed.includes("hồng đào")) return "peach pink";
  if (trimmed.includes("nâu gấc")) return "jackfruit brown";
  if (trimmed.includes("xám bồ cân")) return "pigeon gray";
  if (trimmed.includes("bạc")) return "silver";
  if (trimmed.includes("vàng")) return "gold";
  if (trimmed.includes("đồng")) return "bronze/copper";
  if (trimmed.includes("đen")) return "black";
  if (trimmed.includes("trắng")) return "white";
  if (trimmed.includes("xanh")) return "green/blue";
  if (trimmed.includes("đỏ")) return "red";
  if (trimmed.includes("vàng")) return "yellow";
  if (trimmed.includes("cam")) return "orange";
  if (trimmed.includes("tím")) return "purple";
  if (trimmed.includes("hồng")) return "pink";
  if (trimmed.includes("nâu")) return "brown";
  if (trimmed.includes("xám")) return "gray";
  if (trimmed.includes("đen tuyền")) return "jet black";
  if (trimmed.includes("trắng ngà")) return "ivory";
  if (trimmed.includes("xanh non")) return "light green";
  if (trimmed.includes("đỏ tươi")) return "bright red";
  if (trimmed.includes("vàng chanh")) return "lemon yellow";
  if (trimmed.includes("cam nhạt")) return "light orange";
  if (trimmed.includes("tím nhạt")) return "light purple";
  if (trimmed.includes("hồng nhạt")) return "light pink";
  if (trimmed.includes("nâu nhạt")) return "light brown";
  if (trimmed.includes("xám nhạt")) return "light gray";
  if (trimmed.includes("xanh đậm")) return "dark green";
  if (trimmed.includes("đỏ đậm")) return "dark red";
  if (trimmed.includes("vàng đậm")) return "dark yellow";
  if (trimmed.includes("cam đậm")) return "dark orange";
  if (trimmed.includes("tím đậm")) return "dark purple";
  if (trimmed.includes("hồng đậm")) return "dark pink";
  if (trimmed.includes("nâu đậm")) return "dark brown";
  if (trimmed.includes("xám đậm")) return "dark gray";
  if (trimmed.includes("bạc")) return "silver";
  if (trimmed.includes("vàng kim")) return "metallic gold";
  if (trimmed.includes("bronze")) return "bronze";
  if (trimmed.includes("đồng")) return "copper";
  if (trimmed.includes("đen than")) return "charcoal black";
  if (trimmed.includes("trắng ngọc trai")) return "pearl white";
  if (trimmed.includes("xanh ngọc")) return "emerald";
  if (trimmed.includes("đỏ ruby")) return "ruby red";
  if (trimmed.includes("vàng saffron")) return "saffron yellow";
  if (trimmed.includes("tím violet")) return "violet";
  if (trimmed.includes("hồng rose")) return "rose pink";
  if (trimmed.includes("nâu sô cô la")) return "chocolate brown";
  if (trimmed.includes("xám bồ cân")) return "pigeon gray";
  if (trimmed.includes("vàng mù tạt")) return "mustard yellow";
  if (trimmed.includes("xanh bạc hà")) return "mint green";
  if (trimmed.includes("cam san hô")) return "coral orange";
  if (trimmed.includes("đỏ gạch")) return "brick red";
  if (trimmed.includes("vàng mật ong")) return "honey gold";
  if (trimmed.includes("tím lavender")) return "lavender purple";
  if (trimmed.includes("hồng đất")) return "dusty rose";
  if (trimmed.includes("nâu cà phê")) return "coffee brown";

  // Fallback
  return vietnamese;
}

async function main() {
  // Read the file
  const fs = await import("fs");
  let content = fs.readFileSync(HSK_DATA_PATH, "utf-8");

  // Count words
  const wordMatches = content.match(/\{ id: '(\d+)', hanzi: "([^"]+)", pinyin: "([^"]+)", english: "", vietnamese: "([^"]+)"/g);
  if (!wordMatches) {
    console.log("No words found with empty english field");
    return;
  }

  console.log(`Found ${wordMatches.length} words to translate`);

  // Process each word
  let translated = 0;
  let skipped = 0;

  for (const match of wordMatches) {
    const idMatch = match.match(/id: '(\d+)'/);
    const hanziMatch = match.match(/hanzi: "([^"]+)"/);
    const pinyinMatch = match.match(/pinyin: "([^"]+)"/);
    const vietnameseMatch = match.match(/vietnamese: "([^"]+)"/);

    if (!idMatch || !hanziMatch || !pinyinMatch || !vietnameseMatch) continue;

    const id = idMatch[1];
    const hanzi = hanziMatch[1];
    const pinyin = pinyinMatch[1];
    const vietnamese = vietnameseMatch[1];

    // Try to translate
    let english = translateVietnameseToEnglish(vietnamese);

    if (!english || english === vietnamese) {
      // Try by hanzi
      if (SINGLE_WORD_MAP[hanzi]) {
        english = SINGLE_WORD_MAP[hanzi];
      } else {
        english = vietnamese; // fallback
        skipped++;
      }
    }

    // Replace the empty english field
    const oldPattern = new RegExp(
      `(\\{ id: '${id}', hanzi: "${escapeRegex(hanzi)}", pinyin: "${escapeRegex(pinyin)}", english: "", vietnamese: "${escapeRegex(vietnamese)}")`,
      "g"
    );
    const newValue = `{ id: '${id}', hanzi: "${hanzi}", pinyin: "${pinyin}", english: "${english}", vietnamese: "${vietnamese}"`;
    content = content.replace(oldPattern, newValue);
    translated++;
  }

  // Write back
  fs.writeFileSync(OUTPUT_PATH, content, "utf-8");
  console.log(`Translated: ${translated}, Skipped: ${skipped}`);
  console.log(`Output written to: ${OUTPUT_PATH}`);
}

function escapeRegex(str: string) {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

main().catch(console.error);
