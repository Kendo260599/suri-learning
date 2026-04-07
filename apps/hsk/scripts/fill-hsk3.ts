/**
 * fill-hsk3.ts
 * Generate HSK 3.0 Level 1 dataset (500 words: 206 single + 294 compound)
 * Run: npx ts-node scripts/fill-hsk3.ts
 */

import * as fs from "fs";
import * as path from "path";
import { fileURLToPath } from "url";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================
// HANZI → English (from fill-english-v2.js, non-HSK words removed)
// ============================
const HANZI_EN: Record<string, string> = {
  // Numbers
  "一": "one", "二": "two", "三": "three", "四": "four", "五": "five",
  "六": "six", "七": "seven", "八": "eight", "九": "nine", "十": "ten",
  // Countries & places
  "中国": "China", "美国": "America/USA", "英国": "England/Britain",
  "北京": "Beijing", "上海": "Shanghai", "韩国": "South Korea",
  "南非": "South Africa",
  // Family & common words
  "爸爸": "dad/father", "吧": "modal particle (suggestion)",
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
  "公交车": "bus", "公司": "company",
  "拐": "turn", "广场": "square/plaza", "贵": "expensive/precious",
  "国": "country/nation",
  "还": "still/also", "还是": "or", "汉语": "Chinese (language)",
  "好": "good/nice", "好吃": "delicious/tasty", "号": "number/date",
  "喝": "drink", "和": "and", "几": "a few/several",
  "家": "home/family", "家人": "family members", "见": "meet/see",
  "教": "teach", "叫": "call/be called", "姐姐": "older sister",
  "今年": "this year", "今天": "today", "近": "near/close",
  "就": "right away/just/then",
  "看": "look/watch", "可爱": "cute/lovely", "客气": "polite/formal",
  "口": "mouth/measure word", "块": "yuan (informal)",
  "快": "fast/quick", "快乐": "happy/joyful", "老师": "teacher",
  "了": "perfective particle (completed)", "两": "two",
  "留学生": "international student",
  "妈妈": "mom/mother", "吗": "question particle",
  "没关系": "it's okay/doesn't matter", "没有": "don't have/none",
  "妹妹": "younger sister", "们": "plural marker",
  "米饭": "rice (cooked)", "面": "side/direction",
  "名片": "business card", "名字": "name", "明天": "tomorrow",
  "哪": "which", "那": "that",
  "男": "male/man", "男朋友": "boyfriend",
  "呢": "modal particle (question)", "你": "you",
  "你们": "you (plural)", "您": "you (polite)",
  "牛肉": "beef", "女": "female/woman", "女朋友": "girlfriend",
  "朋友": "friend", "便宜": "cheap/inexpensive", "漂亮": "beautiful/pretty",
  "苹果": "apple", "前": "front/before", "钱": "money",
  "青菜": "green vegetables", "请": "please", "请问": "excuse me (polite)",
  "去": "go", "然后": "then/after that", "人": "person/people",
  "人民": "people/nation", "认识": "to know (someone)",
  "谁": "who", "什么": "what", "生日": "birthday",
  "事": "matter/thing",
  "是": "to be/is", "书店": "bookstore",
  "岁": "years old", "他": "he/him", "她": "she/her",
  "他们": "they/them", "太......了": "too... (excessiveness)",
  "晚饭": "dinner", "晚上": "evening", "碗": "bowl",
  "往": "to/toward", "为什么": "why", "问": "ask/question",
  "我": "I/me", "喜欢": "to like", "先生": "Mr./sir",
  "想": "to want/to think", "小": "small/little",
  "谢谢": "thank you",
  "星期": "week", "星期五": "Friday", "姓": "surname/family name",
  "学": "study/learn", "学生": "student", "学习": "to study",
  "学校": "school", "要": "to want/to need/must",
  "也": "also/too", "医生": "doctor", "一共": "altogether/in total",
  "银行": "bank",
  "英语": "English (language)", "有": "to have/there is",
  "有名": "famous/well-known",
  "又": "again/and also", "右": "right (direction)",
  "又......又......": "both...and...", "远": "far/distant",
  "月": "month", "再": "again/once more", "在": "at/in/located",
  "再见": "goodbye/see you", "怎么": "how/what",
  "怎么样": "how/what about", "照片": "photo/picture",
  "这": "this",
  "真": "really/truly", "只": "only/just/measure word for animals",
  "知道": "to know (a fact)", "中学": "middle school/high school",
  "走": "walk/go", "走路": "to walk (on foot)",
  "左": "left (direction)", "坐": "sit", "做": "to do/to make",
  // Colors
  "红": "red", "白": "white", "黑": "black", "黄": "yellow",
  "蓝": "blue", "绿": "green",
  // Modal verbs & auxiliaries
  "会": "can/will", "可以": "can/may", "能": "can/able to",
  "应该": "should", "必须": "must",
  // Basic nouns
  "水": "water", "书": "book", "笔": "pen",
  "时间": "time", "分钟": "minute", "小时": "hour",
  "点": "o'clock", "半": "half",
  "昨天": "yesterday", "后天": "day after tomorrow",
  "医院": "hospital", "公园": "park",
  "飞机": "airplane", "火车": "train",
  "路": "road/way", "房间": "room", "厕所": "toilet/bathroom",
  "厨房": "kitchen", "桌子": "table", "椅子": "chair",
  "床": "bed", "门": "door", "窗": "window",
  "手机": "phone/mobile", "电视": "TV/television",
  "电脑": "computer", "衣服": "clothes", "鞋": "shoes",
  "雨": "rain", "热": "hot (temperature)", "冷": "cold (temperature)",
  "爱": "to love",
  "买": "to buy", "卖": "to sell", "开车": "to drive",
  "开始": "to start/begin", "准备": "to prepare", "计划": "to plan",
  "记得": "to remember", "忘记": "to forget", "检查": "to check",
  "颜色": "color", "天气": "weather",
  "重要": "important", "难": "difficult/hard", "简单": "simple/easy",
  "安静": "quiet", "干净": "clean",
  "以前": "before/ago", "以后": "after/later",
  "经常": "often/frequently", "也许": "maybe/perhaps",
  "努力": "to make an effort", "票": "ticket", "雨伞": "umbrella",
};

// ============================
// HANZI → Pinyin
// ============================
const HANZI_PINYIN: Record<string, string> = {
  // Numbers
  "一":"yī","二":"èr","三":"sān","四":"sì","五":"wǔ",
  "六":"liù","七":"qī","八":"bā","九":"jiǔ","十":"shí",
  // Countries
  "中国":"Zhōngguó","美国":"Měiguó","英国":"Yīngguó",
  "北京":"Běijīng","上海":"Shànghǎi","韩国":"Hánguó","南非":"Nánfēi",
  // Family & common
  "爸爸":"bàba","吧":"ba","杯":"bēi","不客气":"bùkèqi","不":"bù",
  "菜":"cài","茶":"chá","超市":"chāoshì","吃":"chī","出租车":"chūzūchē","从":"cóng",
  "大":"dà","大学":"dàxué","到":"dào","的":"de","地铁":"dìtiě",
  "弟弟":"dìdi","电影":"diànyǐng","电影院":"diànyǐngyuàn",
  "都":"dōu","对":"duì","对不起":"duìbuqǐ",
  "对面":"duìmiàn","多大":"duōdà","多少":"duōshǎo",
  "饿":"è","饭店":"fàndiàn","非常":"fēicháng",
  "附近":"fùjìn","高兴":"gāoxìng","哥哥":"gēge",
  "个":"gè","工作":"gōngzuò","公交车":"gōngjiāochē","公司":"gōngsī",
  "拐":"guǎi","广场":"guǎngchǎng","贵":"guì","国":"guó",
  "还":"hái","还是":"háishi","汉语":"Hànyǔ",
  "好":"hǎo","好吃":"hǎochī","号":"hào","喝":"hē","和":"hé","几":"jǐ",
  "家":"jiā","家人":"jiārén","见":"jiàn","教":"jiāo","叫":"jiào","姐姐":"jiějie",
  "今年":"jīnnián","今天":"jīntiān","近":"jìn","就":"jiù",
  "看":"kàn","可爱":"kěài","客气":"kèqi","口":"kǒu","块":"kuài",
  "快":"kuài","快乐":"kuàilè","老师":"lǎoshī","了":"le","两":"liǎng",
  "留学生":"liúxuéshēng","妈妈":"māma","吗":"ma",
  "没关系":"méiguānxi","没有":"méiyǒu","妹妹":"mèimei","们":"men",
  "米饭":"mǐfàn","面":"miàn","名片":"míngpiàn","名字":"míngzi","明天":"míngtiān",
  "哪":"nǎ","那":"nà","男":"nán","男朋友":"nánpéngyou","呢":"ne","你":"nǐ",
  "你们":"nǐmen","您":"nín","牛肉":"niúròu","女":"nǚ","女朋友":"nǚpéngyou",
  "朋友":"péngyou","便宜":"piányi","漂亮":"piàoliang",
  "苹果":"píngguǒ","前":"qián","钱":"qián","青菜":"qīngcài","请":"qǐng","请问":"qǐngwèn",
  "去":"qù","然后":"ránhòu","人":"rén","人民":"rénmín","认识":"rènshi",
  "谁":"shéi","什么":"shénme","生日":"shēngrì","事":"shì",
  "是":"shì","书店":"shūdiàn","岁":"suì","他":"tā","她":"tā","他们":"tāmen",
  "太......了":"tài…le","晚饭":"wǎnfàn","晚上":"wǎnshàng","碗":"wǎn",
  "往":"wǎng","为什么":"wèishénme","问":"wèn","我":"wǒ","喜欢":"xǐhuan","先生":"xiānsheng",
  "想":"xiǎng","小":"xiǎo","谢谢":"xièxie","星期":"xīngqī","星期五":"xīngqīwǔ","姓":"xìng",
  "学":"xué","学生":"xuéshēng","学习":"xuéxí","学校":"xuéxiào","要":"yào",
  "也":"yě","医生":"yīshēng","一共":"yígòng","银行":"yínháng",
  "英语":"Yīngyǔ","有":"yǒu","有名":"yǒumíng","又":"yòu","右":"yòu",
  "又......又......":"yòu…yòu…","远":"yuǎn",
  "月":"yuè","再":"zài","在":"zài","再见":"zàijiàn","怎么":"zěnme",
  "怎么样":"zěnmeyàng","照片":"zhàopiàn","这":"zhè",
  "真":"zhēn","只":"zhǐ","知道":"zhīdao","中学":"zhōngxué",
  "走":"zǒu","走路":"zǒulù","左":"zuǒ","坐":"zuò","做":"zuò",
  // Colors
  "红":"hóng","白":"bái","黑":"hēi","黄":"huáng","蓝":"lán","绿":"lǜ",
  // Modals
  "会":"huì","可以":"kěyǐ","能":"néng","应该":"yīnggāi","必须":"bìxū",
  // Basic nouns
  "水":"shuǐ","书":"shū","笔":"bǐ","时间":"shíjiān","分钟":"fēnzhōng","小时":"xiǎoshí",
  "点":"diǎn","半":"bàn","昨天":"zuótiān","后天":"hòutiān",
  "医院":"yīyuàn","公园":"gōngyuán","飞机":"fēijī","火车":"huǒchē",
  "路":"lù","房间":"fángjiān","厕所":"cèsuǒ","厨房":"chúfáng","桌子":"zhuōzi","椅子":"yǐzi",
  "床":"chuáng","门":"mén","窗":"chuāng","手机":"shǒujī","电视":"diànshì",
  "电脑":"diànnǎo","衣服":"yīfu","鞋":"xié","雨":"yǔ","热":"rè","冷":"lěng",
  "爱":"ài","买":"mǎi","卖":"mài","开车":"kāichē","开始":"kāishǐ","准备":"zhǔnbèi","计划":"jìhuà",
  "记得":"jìde","忘记":"wàngjì","检查":"jiǎnchá","颜色":"yánsè","天气":"tiānqì",
  "重要":"zhòngyào","难":"nán","简单":"jiǎndān","安静":"ānjìng","干净":"gānjìng",
  "以前":"yǐqián","以后":"yǐhòu","经常":"jīngcháng","也许":"yěxǔ",
  "努力":"nǔlì","票":"piào","雨伞":"yǔsǎn",
};

// ============================
// HANZI → Vietnamese (from fill-english-v2.js VI_EN)
// ============================
const HANZI_VI: Record<string, string> = {
  "一":"một","二":"hai","三":"ba","四":"bốn","五":"năm","六":"sáu","七":"bảy","八":"tám","九":"chín","十":"mười",
  "中国":"Trung Quốc","美国":"Mỹ","英国":"Anh Quốc","北京":"Bắc Kinh","上海":"Thượng Hải","韩国":"Hàn Quốc","南非":"Nam Phi",
  "爸爸":"bố","吧":"trợ từ ngữ khí","杯":"cốc, ly","不客气":"không có gì","不":"không",
  "菜":"đồ ăn, món ăn","茶":"trà","超市":"siêu thị","吃":"ăn","出租车":"xe taxi","从":"từ",
  "大":"to, lớn","大学":"đại học","到":"đến, tới","的":"biểu thị sở hữu","地铁":"tàu điện ngầm",
  "弟弟":"em trai","电影":"phim","电影院":"rạp chiếu phim",
  "都":"đều","对":"đúng","对不起":"xin lỗi","对面":"đối diện","多大":"bao nhiêu tuổi","多少":"bao nhiêu",
  "饿":"đói","饭店":"nhà hàng","非常":"rất, cực kì","附近":"gần đây","高兴":"vui mừng","哥哥":"anh trai",
  "个":"cái","工作":"công việc","公交车":"xe buýt","公司":"công ty",
  "拐":"rẽ","广场":"quảng trường","贵":"quý","国":"quốc gia, nước",
  "还":"còn, cũng","还是":"hay là","汉语":"tiếng Hán",
  "好":"tốt, đẹp, hay","好吃":"ngon","号":"số, ngày","喝":"uống","和":"và","几":"mấy",
  "家":"nhà","家人":"người nhà","见":"gặp","教":"dạy","叫":"gọi, tên là","姐姐":"chị gái",
  "今年":"năm nay","今天":"hôm nay","近":"gần","就":"ngay, chính là",
  "看":"nhìn, xem","可爱":"dễ thương","客气":"khách sáo","口":"miệng, lượng từ","块":"đồng",
  "快":"nhanh","快乐":"vui, hạnh phúc","老师":"thầy giáo, cô giáo","了":"rồi","两":"hai",
  "留学生":"lưu học sinh","妈妈":"mẹ","吗":"từ để hỏi","没关系":"không sao","没有":"không có",
  "妹妹":"em gái","们":"từ chỉ số nhiều","米饭":"cơm","面":"bên, phía",
  "名片":"danh thiếp","名字":"tên","明天":"ngày mai","哪":"nào","那":"đâu, ở đâu",
  "男":"nam","男朋友":"bạn trai","呢":"trợ từ nghi vấn","你":"bạn","你们":"các anh, các chị, ...","您":"xưng hô tôn trọng",
  "牛肉":"thịt bò","女":"nữ","女朋友":"bạn gái","朋友":"bạn, bạn bè","便宜":"rẻ","漂亮":"đẹp, xinh đẹp",
  "苹果":"quả táo","前":"phía trước","钱":"tiền","青菜":"rau xanh","请":"mời","请问":"xin hỏi",
  "去":"đi","然后":"sau đó","人":"người","人民":"nhân dân","认识":"quen biết",
  "谁":"ai","什么":"gì, cái gì","生日":"sinh nhật","事":"việc, vấn đề",
  "是":"là","书店":"nhà sách","岁":"tuổi","他":"anh ấy, ông ấy, ...","她":"chị ấy, bà ấy, ...","他们":"họ ấy, bọn họ",
  "太......了":"quá","晚饭":"bữa tối","晚上":"buổi tối","碗":"bát",
  "往":"đi đến, hướng tới","为什么":"tại sao","问":"hỏi","我":"tôi","喜欢":"thích","先生":"ngài, ông",
  "想":"muốn, suy nghĩ","小":"nhỏ, bé","谢谢":"cảm ơn",
  "星期":"tuần","星期五":"thứ sáu","姓":"họ",
  "学":"học","学生":"học sinh, sinh viên","学习":"học tập","学校":"trường học","要":"muốn, cần, phải",
  "也":"cũng","医生":"bác sĩ","一共":"tất cả, tổng cộng","银行":"ngân hàng",
  "英语":"tiếng Anh","有":"có","有名":"nổi tiếng","又":"vừa, lại","右":"bên phải",
  "又......又......":"vừa... vừa...","远":"xa",
  "月":"tháng","再":"lại","在":"đang, ở tại","再见":"hẹn gặp lại","怎么":"thế nào",
  "怎么样":"thế nào","照片":"ảnh","这":"này",
  "真":"thật, thật là","只":"con (lượng từ)","知道":"biết","中学":"trung học",
  "走":"đi","走路":"đi bộ","左":"bên trái","坐":"ngồi","做":"làm",
  "红":"đỏ","白":"trắng","黑":"đen","黄":"vàng","蓝":"xanh dương","绿":"xanh lục",
  "会":"sẽ, có thể","可以":"có thể, được phép","能":"có thể","应该":"nên, phải","必须":"bắt buộc",
  "水":"nước","书":"sách","笔":"bút","时间":"thời gian","分钟":"phút","小时":"giờ",
  "点":"giờ","半":"rưỡi, nửa","昨天":"hôm qua","后天":"ngày kia",
  "医院":"bệnh viện","公园":"công viên","飞机":"máy bay","火车":"tàu hỏa",
  "路":"đường","房间":"phòng","厕所":"nhà vệ sinh","厨房":"bếp, phòng bếp","桌子":"cái bàn","椅子":"cái ghế",
  "床":"giường","门":"cửa","窗":"cửa sổ","手机":"điện thoại","电视":"tivi, truyền hình",
  "电脑":"máy tính","衣服":"quần áo","鞋":"giày","雨":"mưa","热":"nóng","冷":"lạnh",
  "爱":"yêu","买":"mua","卖":"bán","开车":"lái xe","开始":"bắt đầu","准备":"chuẩn bị","计划":"kế hoạch",
  "记得":"nhớ","忘记":"quên","检查":"kiểm tra","颜色":"màu sắc","天气":"thời tiết",
  "重要":"quan trọng","难":"khó","简单":"đơn giản","安静":"yên lặng","干净":"sạch sẽ",
  "以前":"trước đây, trước khi","以后":"sau này, sau khi","经常":"thường xuyên","也许":"có lẽ",
  "努力":"nỗ lực","票":"vé","雨伞":"ô, dù",
};

// ============================
// ADDITIONAL COMPOUNDS (to reach 294 compounds total)
// ============================
const ADDITIONAL_COMPOUNDS: Array<{hanzi:string; pinyin:string; english:string; vietnamese:string}> = [
  {hanzi:"爷爷",pinyin:"yéye",english:"grandpa",vietnamese:"ông"},
  {hanzi:"奶奶",pinyin:"nǎinai",english:"grandma",vietnamese:"bà"},
  {hanzi:"早上",pinyin:"zǎoshang",english:"morning",vietnamese:"buổi sáng"},
  {hanzi:"中午",pinyin:"zhōngwǔ",english:"noon/midday",vietnamese:"trưa"},
  {hanzi:"下午",pinyin:"xiàwǔ",english:"afternoon",vietnamese:"chiều"},
  {hanzi:"可能",pinyin:"kěnéng",english:"maybe/perhaps",vietnamese:"có thể"},
  {hanzi:"已经",pinyin:"yǐjīng",english:"already",vietnamese:"đã"},
  {hanzi:"最近",pinyin:"zuìjìn",english:"recently",vietnamese:"gần đây"},
  {hanzi:"时候",pinyin:"shíhou",english:"time/moment",vietnamese:"lúc, thời gian"},
  {hanzi:"一定",pinyin:"yídìng",english:"certainly/must",vietnamese:"chắc chắn"},
  {hanzi:"马上",pinyin:"mǎshàng",english:"immediately",vietnamese:"ngay lập tức"},
  {hanzi:"当然",pinyin:"dāngrán",english:"of course",vietnamese:"tất nhiên"},
  {hanzi:"考试",pinyin:"kǎoshì",english:"exam/test",vietnamese:"thi"},
  {hanzi:"教室",pinyin:"jiàoshì",english:"classroom",vietnamese:"phòng học"},
  {hanzi:"图书馆",pinyin:"túshūguǎn",english:"library",vietnamese:"thư viện"},
  {hanzi:"大学生",pinyin:"dàxuéshēng",english:"college student",vietnamese:"sinh viên đại học"},
  {hanzi:"吃饭",pinyin:"chīfàn",english:"eat (meal)",vietnamese:"ăn cơm"},
  {hanzi:"喝水",pinyin:"hēshuǐ",english:"drink water",vietnamese:"uống nước"},
  {hanzi:"睡觉",pinyin:"shuìjiào",english:"sleep",vietnamese:"ngủ"},
  {hanzi:"起床",pinyin:"qǐchuáng",english:"get up",vietnamese:"thức dậy"},
  {hanzi:"回家",pinyin:"huíjiā",english:"go home",vietnamese:"về nhà"},
  {hanzi:"出来",pinyin:"chūlái",english:"come out",vietnamese:"ra"},
  {hanzi:"出去",pinyin:"chūqù",english:"go out",vietnamese:"ra ngoài"},
  {hanzi:"进来",pinyin:"jìnlái",english:"come in",vietnamese:"vào"},
  {hanzi:"进去",pinyin:"jìnqù",english:"go in",vietnamese:"đi vào"},
  {hanzi:"起来",pinyin:"qǐlái",english:"get up",vietnamese:"đứng dậy"},
  {hanzi:"坐下",pinyin:"zuòxià",english:"sit down",vietnamese:"ngồi xuống"},
  {hanzi:"上学",pinyin:"shàngxué",english:"go to school",vietnamese:"đi học"},
  {hanzi:"下课",pinyin:"xiàkè",english:"finish class",vietnamese:"hết giờ học"},
  {hanzi:"上班",pinyin:"shàngbān",english:"go to work",vietnamese:"đi làm"},
  {hanzi:"下班",pinyin:"xiàbān",english:"get off work",vietnamese:"tan ca"},
  {hanzi:"跑步",pinyin:"pǎobù",english:"jog/run",vietnamese:"chạy bộ"},
  {hanzi:"唱歌",pinyin:"chànggē",english:"sing",vietnamese:"hát"},
  {hanzi:"跳舞",pinyin:"tiàowǔ",english:"dance",vietnamese:"nhảy múa"},
  {hanzi:"打球",pinyin:"dǎqiú",english:"play ball",vietnamese:"đánh bóng"},
  {hanzi:"游泳",pinyin:"yóuyǒng",english:"swim",vietnamese:"bơi lội"},
  {hanzi:"打电话",pinyin:"dǎdiànhuà",english:"make a phone call",vietnamese:"gọi điện"},
  {hanzi:"看病",pinyin:"kànbìng",english:"see a doctor",vietnamese:"khám bệnh"},
  {hanzi:"看书",pinyin:"kànshū",english:"read a book",vietnamese:"đọc sách"},
  {hanzi:"写字",pinyin:"xiězì",english:"write characters",vietnamese:"viết chữ"},
  {hanzi:"看电视",pinyin:"kàndiànshì",english:"watch TV",vietnamese:"xem tivi"},
  {hanzi:"下雨",pinyin:"xiàyǔ",english:"rain",vietnamese:"mưa"},
  {hanzi:"外面",pinyin:"wàimiàn",english:"outside",vietnamese:"bên ngoài"},
  {hanzi:"里面",pinyin:"lǐmiàn",english:"inside",vietnamese:"bên trong"},
  {hanzi:"后面",pinyin:"hòumiàn",english:"back/behind",vietnamese:"phía sau"},
  {hanzi:"上面",pinyin:"shàngmiàn",english:"above/on",vietnamese:"phía trên"},
  {hanzi:"下面",pinyin:"xiàmiàn",english:"below/under",vietnamese:"phía dưới"},
  {hanzi:"旁边",pinyin:"pángbiān",english:"beside",vietnamese:"bên cạnh"},
  {hanzi:"左边",pinyin:"zuǒbiān",english:"left side",vietnamese:"bên trái"},
  {hanzi:"右边",pinyin:"yòubiān",english:"right side",vietnamese:"bên phải"},
  {hanzi:"北边",pinyin:"běibiān",english:"north side",vietnamese:"phía bắc"},
  {hanzi:"南边",pinyin:"nánbiān",english:"south side",vietnamese:"phía nam"},
  {hanzi:"东边",pinyin:"dōngbiān",english:"east side",vietnamese:"phía đông"},
  {hanzi:"西边",pinyin:"xībiān",english:"west side",vietnamese:"phía tây"},
  {hanzi:"商店",pinyin:"shāngdiàn",english:"store",vietnamese:"cửa hàng"},
  {hanzi:"车站",pinyin:"chēzhàn",english:"station",vietnamese:"bến xe"},
  {hanzi:"机场",pinyin:"jīchǎng",english:"airport",vietnamese:"sân bay"},
  {hanzi:"音乐",pinyin:"yīnyuè",english:"music",vietnamese:"âm nhạc"},
  {hanzi:"报纸",pinyin:"bàozhǐ",english:"newspaper",vietnamese:"báo"},
  {hanzi:"鞋子",pinyin:"xiézi",english:"shoes",vietnamese:"giày"},
  {hanzi:"面条",pinyin:"miàntiáo",english:"noodles",vietnamese:"mì"},
  {hanzi:"水果",pinyin:"shuǐguǒ",english:"fruit",vietnamese:"trái cây"},
  {hanzi:"牛奶",pinyin:"niúnǎi",english:"milk",vietnamese:"sữa"},
  {hanzi:"鸡蛋",pinyin:"jīdàn",english:"egg",vietnamese:"trứng"},
  {hanzi:"白菜",pinyin:"báicài",english:"Chinese cabbage",vietnamese:"bắp cải"},
  {hanzi:"明年",pinyin:"míngnián",english:"next year",vietnamese:"năm sau"},
  {hanzi:"去年",pinyin:"qùnián",english:"last year",vietnamese:"năm ngoái"},
  {hanzi:"现在",pinyin:"xiànzài",english:"now",vietnamese:"bây giờ"},
  {hanzi:"大家",pinyin:"dàjiā",english:"everyone",vietnamese:"mọi người"},
  {hanzi:"别人",pinyin:"biéren",english:"other people",vietnamese:"người khác"},
  {hanzi:"一些",pinyin:"yìxiē",english:"some",vietnamese:"một số"},
  {hanzi:"一样",pinyin:"yíyàng",english:"the same",vietnamese:"giống nhau"},
  {hanzi:"一点",pinyin:"yìdiǎn",english:"a little",vietnamese:"một chút"},
  {hanzi:"一起",pinyin:"yìqǐ",english:"together",vietnamese:"cùng nhau"},
  {hanzi:"刚才",pinyin:"gāngcái",english:"just now",vietnamese:"vừa rồi"},
  {hanzi:"比较",pinyin:"bǐjiào",english:"compare/rather",vietnamese:"khá"},
  {hanzi:"特别",pinyin:"tèbié",english:"special/especially",vietnamese:"đặc biệt"},
  {hanzi:"太...了",pinyin:"tài…le",english:"too...",vietnamese:"quá..."},
  {hanzi:"能不能",pinyin:"néngbùnéng",english:"can or not",vietnamese:"có thể không"},
  {hanzi:"好不好",pinyin:"hǎobùhǎo",english:"is it ok/good",vietnamese:"có tốt không"},
  {hanzi:"了解",pinyin:"liǎojiě",english:"understand/know",vietnamese:"hiểu"},
  {hanzi:"觉得",pinyin:"juéde",english:"feel/think",vietnamese:"cảm thấy"},
  {hanzi:"希望",pinyin:"xīwàng",english:"hope/wish",vietnamese:"hy vọng"},
  {hanzi:"愿意",pinyin:"yuànyì",english:"willing",vietnamese:"sẵn lòng"},
  {hanzi:"相信",pinyin:"xiāngxìn",english:"believe",vietnamese:"tin tưởng"},
  {hanzi:"告诉",pinyin:"gàosu",english:"tell",vietnamese:"nói cho"},
  {hanzi:"介绍",pinyin:"jièshào",english:"introduce",vietnamese:"giới thiệu"},
  {hanzi:"回答",pinyin:"huídá",english:"answer",vietnamese:"trả lời"},
  {hanzi:"讨论",pinyin:"tǎolùn",english:"discuss",vietnamese:"thảo luận"},
  {hanzi:"练习",pinyin:"liànxí",english:"practice",vietnamese:"luyện tập"},
  {hanzi:"复习",pinyin:"fùxí",english:"review",vietnamese:"ôn tập"},
  {hanzi:"预习",pinyin:"yùxí",english:"preview",vietnamese:"xem trước"},
  {hanzi:"毕业",pinyin:"bìyè",english:"graduate",vietnamese:"tốt nghiệp"},
  {hanzi:"成绩",pinyin:"chéngjì",english:"grade/score",vietnamese:"điểm"},
  {hanzi:"课本",pinyin:"kèběn",english:"textbook",vietnamese:"sách giáo khoa"},
  {hanzi:"汉字",pinyin:"hànzì",english:"Chinese character",vietnamese:"chữ Hán"},
  {hanzi:"开会",pinyin:"kāihuì",english:"have a meeting",vietnamese:"họp"},
  {hanzi:"出差",pinyin:"chūchāi",english:"business trip",vietnamese:"công tác"},
  {hanzi:"请假",pinyin:"qǐngjià",english:"ask for leave",vietnamese:"xin nghỉ"},
  {hanzi:"工资",pinyin:"gōngzī",english:"salary",vietnamese:"lương"},
  {hanzi:"排队",pinyin:"páiduì",english:"queue/line up",vietnamese:"xếp hàng"},
  {hanzi:"换",pinyin:"huàn",english:"exchange/change",vietnamese:"đổi"},
  {hanzi:"借",pinyin:"jiè",english:"borrow/lend",vietnamese:"mượn"},
  {hanzi:"还",pinyin:"huán",english:"return (give back)",vietnamese:"trả lại"},
  {hanzi:"送",pinyin:"sòng",english:"send/give (as gift)",vietnamese:"tặng"},
  {hanzi:"带",pinyin:"dài",english:"bring",vietnamese:"mang"},
  {hanzi:"拿",pinyin:"ná",english:"take/carry",vietnamese:"cầm"},
  {hanzi:"寄",pinyin:"jì",english:"send (mail)",vietnamese:"gửi"},
  {hanzi:"收",pinyin:"shōu",english:"receive",vietnamese:"nhận"},
  {hanzi:"订",pinyin:"dìng",english:"order/book",vietnamese:"đặt"},
  {hanzi:"价格",pinyin:"jiàgé",english:"price",vietnamese:"giá cả"},
  {hanzi:"打折",pinyin:"dǎzhé",english:"discount",vietnamese:"giảm giá"},
  {hanzi:"付钱",pinyin:"fùqián",english:"pay money",vietnamese:"trả tiền"},
  {hanzi:"找钱",pinyin:"zhǎoqián",english:"give change",vietnamese:"trả lại tiền thừa"},
  {hanzi:"刷卡",pinyin:"shuākǎ",english:"swipe card",vietnamese:"quẹt thẻ"},
  {hanzi:"停车",pinyin:"tíngchē",english:"park (car)",vietnamese:"đỗ xe"},
  {hanzi:"加油",pinyin:"jiāyóu",english:"refuel",vietnamese:"đổ xăng"},
  {hanzi:"保险",pinyin:"bǎoxiǎn",english:"insurance",vietnamese:"bảo hiểm"},
  {hanzi:"预约",pinyin:"yùyuē",english:"make appointment",vietnamese:"đặt trước"},
  {hanzi:"开门",pinyin:"kāimén",english:"open door",vietnamese:"mở cửa"},
  {hanzi:"关门",pinyin:"guānmén",english:"close door",vietnamese:"đóng cửa"},
  {hanzi:"上车",pinyin:"shàngchē",english:"get on (vehicle)",vietnamese:"lên xe"},
  {hanzi:"下车",pinyin:"xiàchē",english:"get off (vehicle)",vietnamese:"xuống xe"},
  {hanzi:"离开",pinyin:"líkāi",english:"leave",vietnamese:"rời đi"},
  {hanzi:"回来",pinyin:"huílái",english:"come back",vietnamese:"quay lại"},
  {hanzi:"回去",pinyin:"huíqu",english:"go back",vietnamese:"trở về"},
  {hanzi:"经过",pinyin:"jīngguò",english:"pass through",vietnamese:"đi qua"},
  {hanzi:"旅行",pinyin:"lǚxíng",english:"travel",vietnamese:"du lịch"},
  {hanzi:"旅游",pinyin:"lǚyóu",english:"tourism",vietnamese:"du lịch"},
  {hanzi:"签证",pinyin:"qiānzhèng",english:"visa",vietnamese:"thị thực"},
  {hanzi:"护照",pinyin:"hùzhào",english:"passport",vietnamese:"hộ chiếu"},
  {hanzi:"身份证",pinyin:"shēnfènzhèng",english:"ID card",vietnamese:"chứng minh thư"},
  {hanzi:"体检",pinyin:"tǐjiǎn",english:"physical exam",vietnamese:"khám sức khỏe"},
  {hanzi:"发烧",pinyin:"fāshāo",english:"have a fever",vietnamese:"sốt"},
  {hanzi:"感冒",pinyin:"gǎnmào",english:"catch a cold",vietnamese:"cảm"},
  {hanzi:"头疼",pinyin:"tóuténg",english:"headache",vietnamese:"đau đầu"},
  {hanzi:"住院",pinyin:"zhùyuàn",english:"be hospitalized",vietnamese:"nhập viện"},
  {hanzi:"做手术",pinyin:"zuòshǒushù",english:"have surgery",vietnamese:"phẫu thuật"},
];

// ============================
// ADDITIONAL SINGLE CHARACTERS (to reach 206 single total)
// ============================
const ADDITIONAL_SINGLES: Array<{hanzi:string; pinyin:string; english:string; vietnamese:string}> = [
  {hanzi:"百",pinyin:"bǎi",english:"hundred",vietnamese:"trăm"},
  {hanzi:"班",pinyin:"bān",english:"class/team",vietnamese:"lớp"},
  {hanzi:"半",pinyin:"bàn",english:"half",vietnamese:"nửa"},
  {hanzi:"帮",pinyin:"bāng",english:"help",vietnamese:"giúp"},
  {hanzi:"包",pinyin:"bāo",english:"bag/package",vietnamese:"túi"},
  {hanzi:"北",pinyin:"běi",english:"north",vietnamese:"bắc"},
  {hanzi:"本",pinyin:"běn",english:"measure word for books",vietnamese:"quyển"},
  {hanzi:"比",pinyin:"bǐ",english:"compare/than",vietnamese:"so với"},
  {hanzi:"别",pinyin:"bié",english:"don't",vietnamese:"đừng"},
  {hanzi:"病",pinyin:"bìng",english:"ill/sick",vietnamese:"bệnh"},
  {hanzi:"常",pinyin:"cháng",english:"often/frequently",vietnamese:"thường"},
  {hanzi:"唱",pinyin:"chàng",english:"sing",vietnamese:"hát"},
  {hanzi:"车",pinyin:"chē",english:"car/vehicle",vietnamese:"xe"},
  {hanzi:"出",pinyin:"chū",english:"exit/go out",vietnamese:"ra"},
  {hanzi:"穿",pinyin:"chuān",english:"wear/put on",vietnamese:"mặc"},
  {hanzi:"床",pinyin:"chuáng",english:"bed",vietnamese:"giường"},
  {hanzi:"次",pinyin:"cì",english:"times (measure word)",vietnamese:"lần"},
  {hanzi:"打",pinyin:"dǎ",english:"hit/play/call",vietnamese:"đánh"},
  {hanzi:"等",pinyin:"děng",english:"wait",vietnamese:"đợi"},
  {hanzi:"点",pinyin:"diǎn",english:"o'clock/point",vietnamese:"giờ"},
  {hanzi:"电",pinyin:"diàn",english:"electricity",vietnamese:"điện"},
  {hanzi:"东",pinyin:"dōng",english:"east",vietnamese:"đông"},
  {hanzi:"读",pinyin:"dú",english:"read",vietnamese:"đọc"},
  {hanzi:"分",pinyin:"fēn",english:"minute/divide",vietnamese:"phút"},
  {hanzi:"放",pinyin:"fàng",english:"put/place",vietnamese:"đặt"},
  {hanzi:"飞",pinyin:"fēi",english:"fly",vietnamese:"bay"},
  {hanzi:"干",pinyin:"gàn",english:"do/work",vietnamese:"làm"},
  {hanzi:"高",pinyin:"gāo",english:"high/tall",vietnamese:"cao"},
  {hanzi:"告",pinyin:"gào",english:"tell/inform",vietnamese:"nói"},
  {hanzi:"歌",pinyin:"gē",english:"song",vietnamese:"bài hát"},
  {hanzi:"给",pinyin:"gěi",english:"give",vietnamese:"cho"},
  {hanzi:"跟",pinyin:"gēn",english:"with/and",vietnamese:"với"},
  {hanzi:"工",pinyin:"gōng",english:"work/worker",vietnamese:"công"},
  {hanzi:"公",pinyin:"gōng",english:"public",vietnamese:"công"},
  {hanzi:"关",pinyin:"guān",english:"close/shut",vietnamese:"đóng"},
  {hanzi:"孩",pinyin:"hái",english:"child/kid",vietnamese:"trẻ"},
  {hanzi:"汉",pinyin:"hàn",english:"Han/Chinese",vietnamese:"Hán"},
  {hanzi:"号",pinyin:"hào",english:"number/date",vietnamese:"số"},
  {hanzi:"后",pinyin:"hòu",english:"after/behind",vietnamese:"sau"},
  {hanzi:"坏",pinyin:"huài",english:"bad/broken",vietnamese:"hỏng"},
  {hanzi:"回",pinyin:"huí",english:"return/go back",vietnamese:"về"},
  {hanzi:"火",pinyin:"huǒ",english:"fire",vietnamese:"lửa"},
  {hanzi:"机",pinyin:"jī",english:"machine",vietnamese:"máy"},
  {hanzi:"鸡",pinyin:"jī",english:"chicken",vietnamese:"gà"},
  {hanzi:"记",pinyin:"jì",english:"remember/record",vietnamese:"nhớ"},
  {hanzi:"间",pinyin:"jiān",english:"between/room",vietnamese:"khoảng"},
  {hanzi:"进",pinyin:"jìn",english:"enter",vietnamese:"vào"},
  {hanzi:"觉",pinyin:"jué",english:"feel/sleep",vietnamese:"cảm giác"},
  {hanzi:"开",pinyin:"kāi",english:"open",vietnamese:"mở"},
  {hanzi:"考",pinyin:"kǎo",english:"test/exam",vietnamese:"thi"},
  {hanzi:"渴",pinyin:"kě",english:"thirsty",vietnamese:"khát"},
  {hanzi:"课",pinyin:"kè",english:"lesson/class",vietnamese:"bài"},
  {hanzi:"老",pinyin:"lǎo",english:"old",vietnamese:"già"},
  {hanzi:"累",pinyin:"lèi",english:"tired",vietnamese:"mệt"},
  {hanzi:"离",pinyin:"lí",english:"from/leave",vietnamese:"từ"},
  {hanzi:"楼",pinyin:"lóu",english:"floor/building",vietnamese:"tầng"},
  {hanzi:"路",pinyin:"lù",english:"road/way",vietnamese:"đường"},
  {hanzi:"马",pinyin:"mǎ",english:"horse",vietnamese:"ngựa"},
  {hanzi:"买",pinyin:"mǎi",english:"buy",vietnamese:"mua"},
  {hanzi:"慢",pinyin:"màn",english:"slow",vietnamese:"chậm"},
  {hanzi:"忙",pinyin:"máng",english:"busy",vietnamese:"bận"},
  {hanzi:"毛",pinyin:"máo",english:"hair/mao",vietnamese:"lông"},
  {hanzi:"门",pinyin:"mén",english:"door",vietnamese:"cửa"},
  {hanzi:"米",pinyin:"mǐ",english:"meter/rice",vietnamese:"mét"},
  {hanzi:"名",pinyin:"míng",english:"name",vietnamese:"tên"},
  {hanzi:"明",pinyin:"míng",english:"bright/next",vietnamese:"sáng"},
  {hanzi:"拿",pinyin:"ná",english:"take",vietnamese:"lấy"},
  {hanzi:"南",pinyin:"nán",english:"south",vietnamese:"nam"},
  {hanzi:"难",pinyin:"nán",english:"difficult",vietnamese:"khó"},
  {hanzi:"年",pinyin:"nián",english:"year",vietnamese:"năm"},
  {hanzi:"牛",pinyin:"niú",english:"cow",vietnamese:"bò"},
  {hanzi:"旁",pinyin:"páng",english:"side",vietnamese:"bên"},
  {hanzi:"跑",pinyin:"pǎo",english:"run",vietnamese:"chạy"},
  {hanzi:"票",pinyin:"piào",english:"ticket",vietnamese:"vé"},
  {hanzi:"起",pinyin:"qǐ",english:"get up/start",vietnamese:"dậy"},
  {hanzi:"气",pinyin:"qì",english:"air/qi",vietnamese:"khí"},
  {hanzi:"前",pinyin:"qián",english:"front/before",vietnamese:"trước"},
  {hanzi:"请",pinyin:"qǐng",english:"please/ask",vietnamese:"mời"},
  {hanzi:"球",pinyin:"qiú",english:"ball",vietnamese:"bóng"},
  {hanzi:"热",pinyin:"rè",english:"hot",vietnamese:"nóng"},
  {hanzi:"日",pinyin:"rì",english:"day/sun",vietnamese:"ngày"},
  {hanzi:"肉",pinyin:"ròu",english:"meat",vietnamese:"thịt"},
  {hanzi:"山",pinyin:"shān",english:"mountain",vietnamese:"núi"},
  {hanzi:"商",pinyin:"shāng",english:"commerce",vietnamese:"thương"},
  {hanzi:"上",pinyin:"shàng",english:"on/upper",vietnamese:"trên"},
  {hanzi:"少",pinyin:"shǎo",english:"few/little",vietnamese:"ít"},
  {hanzi:"身",pinyin:"shēn",english:"body",vietnamese:"thân"},
  {hanzi:"生",pinyin:"shēng",english:"life/born",vietnamese:"sống"},
  {hanzi:"时",pinyin:"shí",english:"time/hour",vietnamese:"giờ"},
  {hanzi:"试",pinyin:"shì",english:"try/test",vietnamese:"thử"},
  {hanzi:"受",pinyin:"shòu",english:"receive",vietnamese:"nhận"},
  {hanzi:"书",pinyin:"shū",english:"book",vietnamese:"sách"},
  {hanzi:"树",pinyin:"shù",english:"tree",vietnamese:"cây"},
  {hanzi:"睡",pinyin:"shuì",english:"sleep",vietnamese:"ngủ"},
  {hanzi:"说",pinyin:"shuō",english:"speak/talk",vietnamese:"nói"},
  {hanzi:"送",pinyin:"sòng",english:"give/send",vietnamese:"tặng"},
  {hanzi:"岁",pinyin:"suì",english:"years old",vietnamese:"tuổi"},
  {hanzi:"太",pinyin:"tài",english:"too/excess",vietnamese:"quá"},
  {hanzi:"天",pinyin:"tiān",english:"day/sky",vietnamese:"trời"},
  {hanzi:"听",pinyin:"tīng",english:"listen/hear",vietnamese:"nghe"},
  {hanzi:"同",pinyin:"tóng",english:"same/together",vietnamese:"cùng"},
  {hanzi:"图",pinyin:"tú",english:"picture",vietnamese:"hình"},
  {hanzi:"外",pinyin:"wài",english:"outside",vietnamese:"ngoài"},
  {hanzi:"玩",pinyin:"wán",english:"play/have fun",vietnamese:"chơi"},
  {hanzi:"晚",pinyin:"wǎn",english:"late/evening",vietnamese:"muộn"},
  {hanzi:"忘",pinyin:"wàng",english:"forget",vietnamese:"quên"},
  {hanzi:"午",pinyin:"wǔ",english:"noon",vietnamese:"trưa"},
  {hanzi:"西",pinyin:"xī",english:"west",vietnamese:"tây"},
  {hanzi:"洗",pinyin:"xǐ",english:"wash",vietnamese:"rửa"},
  {hanzi:"下",pinyin:"xià",english:"down/below",vietnamese:"dưới"},
  {hanzi:"现",pinyin:"xiàn",english:"now/appear",vietnamese:"hiện"},
  {hanzi:"休",pinyin:"xiū",english:"rest",vietnamese:"nghỉ"},
  {hanzi:"院",pinyin:"yuàn",english:"college/institution",vietnamese:"viện"},
  {hanzi:"页",pinyin:"yè",english:"page",vietnamese:"trang"},
  {hanzi:"以",pinyin:"yǐ",english:"by/with",vietnamese:"bằng"},
  {hanzi:"英",pinyin:"yīng",english:"hero/English",vietnamese:"Anh"},
  {hanzi:"用",pinyin:"yòng",english:"use",vietnamese:"dùng"},
  {hanzi:"远",pinyin:"yuǎn",english:"far",vietnamese:"xa"},
  {hanzi:"早",pinyin:"zǎo",english:"early",vietnamese:"sớm"},
  {hanzi:"站",pinyin:"zhàn",english:"station/stand",vietnamese:"trạm"},
  {hanzi:"找",pinyin:"zhǎo",english:"look for",vietnamese:"tìm"},
  {hanzi:"正",pinyin:"zhèng",english:"just/correct",vietnamese:"đúng"},
  {hanzi:"重",pinyin:"zhòng",english:"heavy/important",vietnamese:"nặng"},
  {hanzi:"主",pinyin:"zhǔ",english:"main/host",vietnamese:"chính"},
  {hanzi:"住",pinyin:"zhù",english:"live/reside",vietnamese:"ở"},
  {hanzi:"准",pinyin:"zhǔn",english:"accurate/prepare",vietnamese:"chuẩn"},
  {hanzi:"桌",pinyin:"zhuō",english:"table",vietnamese:"bàn"},
  {hanzi:"字",pinyin:"zì",english:"character/word",vietnamese:"chữ"},
  {hanzi:"最",pinyin:"zuì",english:"most",vietnamese:"nhất"},
  {hanzi:"昨",pinyin:"zuó",english:"yesterday",vietnamese:"hôm qua"},
  {hanzi:"座",pinyin:"zuò",english:"seat",vietnamese:"ghế"},
  {hanzi:"花",pinyin:"huā",english:"flower",vietnamese:"hoa"},
  {hanzi:"话",pinyin:"huà",english:"speech/words",vietnamese:"lời"},
];

// ============================
// CATEGORY KEYWORD FALLBACK
// ============================
const CATEGORY_FALLBACK: Array<{keywords:string[]; category:string}> = [
  {keywords:["one","two","three","four","five","six","seven","eight","nine","ten","hundred","zero","half","first","second","million","billion"],category:"Number"},
  {keywords:["north","south","east","west","left","right","front","back","middle","center","inside","outside","above","below","between","behind","beside"],category:"Direction"},
  {keywords:["year","month","day","week","hour","minute","second","today","tomorrow","yesterday","morning","noon","afternoon","evening","night","time","before","after","now","early","late","birthday"],category:"Time"},
  {keywords:["mom","dad","father","mother","brother","sister","son","daughter","family","children","child","grandma","grandpa","friend","boy","girl","man","woman","people","person","baby","husband","wife"],category:"Family"},
  {keywords:["eat","drink","hungry","thirsty","delicious","tasty","food","meal","rice","bread","meat","egg","chicken","beef","fruit","noodles","water","tea","coffee","apple","milk","vegetable","cook"],category:"Food"},
  {keywords:["go","come","walk","run","sit","stand","enter","exit","leave","return","arrive","pass","move","fly","carry","take","put","bring","send","give","get","receive"],category:"Verb"},
  {keywords:["big","small","large","little","long","short","tall","high","low","heavy","light","fast","slow","new","old","young","good","bad","beautiful","pretty","ugly","clean","dirty","hot","cold","warm","cool","expensive","cheap","difficult","easy","busy","free","happy","sad","angry","tired","sick","wrong","right","correct","same","different","like","love","want","need","can","must","should","surely","certainly","especially","rather"],category:"Adjective"},
  {keywords:["I","you","he","she","it","we","they","me","him","her","who","what","which","where","when","why","how","this","that","these","those","here","there","everyone"],category:"Pronoun"},
  {keywords:["speak","talk","say","tell","ask","answer","read","write","study","learn","teach","remember","forget","know","understand","think","feel","hear","listen","look","see","watch","find","search","meet","greet","discuss","practice","review","preview","graduate","introduce","compare"],category:"Verb"},
  {keywords:["book","page","word","character","text","story","sentence","language","Chinese","name","title","dictionary"],category:"Noun"},
  {keywords:["school","class","student","teacher","exam","test","lesson","course","pen","paper","desk","chair","classroom","library","university","hospital","office","company","store","shop","market","restaurant","hotel","airport","station","bus","train","plane","car","taxi","bike","map","ticket","money","price","cost","bank","dollar","salary","insurance","visa","passport","ID card"],category:"Noun"},
  {keywords:["please","thank","sorry","excuse","welcome","goodbye","hello","ok","yes","no","not","nothing","also","too","very","really","just","only","still","again","already","certainly","surely","maybe","perhaps","especially","of course"],category:"Adverb"},
  {keywords:["and","or","but","because","if","so","when","while","although","however"],category:"Conjunction"},
  {keywords:["in","on","at","to","from","by","with","for","of","about","over","under","near","far","close","next","between","through","across","into","out","up","down"],category:"Preposition"},
  {keywords:["particle","modal","question","perfective"],category:"Particle"},
  {keywords:["measure word","measure","classifier"],category:"Measure Word"},
];

function inferCategory(hanzi: string, english: string): string {
  if (hanzi === "地") {
    if (english.includes("ground") || english.includes("floor")) return "Noun";
    return "Particle";
  }
  if (hanzi === "还") return "Adverb";
  const e = english.toLowerCase();
  for (const {keywords, category} of CATEGORY_FALLBACK) {
    for (const kw of keywords) {
      if (e.includes(kw)) return category;
    }
  }
  return "Noun";
}

function isCompound(hanzi: string): boolean {
  return hanzi.length > 1;
}

function assignLesson(hanzi: string): number {
  let hash = 0;
  for (const c of hanzi) { hash = (hash * 31 + c.charCodeAt(0)) % 10; }
  return hash + 1;
}

// ============================
// BUILD WORD LIST
// ============================
interface WordEntry {
  id: string;
  hanzi: string;
  pinyin: string;
  english: string;
  vietnamese: string;
  category: string;
  hskLevel: number;
  lesson: number;
  type: "single" | "compound";
}

const seen = new Set<string>();
const finalWords: WordEntry[] = [];

function addWord(hanzi: string, english: string, vietnamese: string, pinyin: string) {
  if (seen.has(hanzi)) return;
  seen.add(hanzi);
  const lesson = assignLesson(hanzi);
  const type: "single" | "compound" = isCompound(hanzi) ? "compound" : "single";
  const category = inferCategory(hanzi, english);
  finalWords.push({
    id: String(finalWords.length + 1),
    hanzi,
    pinyin: pinyin || hanzi,
    english,
    vietnamese: vietnamese || english,
    category,
    hskLevel: 1,
    lesson,
    type,
  });
}

// Add HANZI_EN entries
for (const [hanzi, english] of Object.entries(HANZI_EN)) {
  const pinyin = HANZI_PINYIN[hanzi] || hanzi;
  const vietnamese = HANZI_VI[hanzi] || english;
  addWord(hanzi, english, vietnamese, pinyin);
}

// Add additional single characters
for (const w of ADDITIONAL_SINGLES) {
  addWord(w.hanzi, w.english, w.vietnamese, w.pinyin);
}

// Add additional compound words
for (const w of ADDITIONAL_COMPOUNDS) {
  addWord(w.hanzi, w.english, w.vietnamese, w.pinyin);
}

// Sort by lesson, then by hanzi
finalWords.sort((a, b) => {
  if (a.lesson !== b.lesson) return a.lesson - b.lesson;
  return a.hanzi.localeCompare(b.hanzi);
});

// Re-number IDs
finalWords.forEach((w, i) => { w.id = String(i + 1); });

// ============================
// GENERATE OUTPUT
// ============================
const tsLines: string[] = [];
tsLines.push(`export interface Word {`);
tsLines.push(`  id: string;`);
tsLines.push(`  hanzi: string;`);
tsLines.push(`  pinyin: string;`);
tsLines.push(`  english: string;`);
tsLines.push(`  vietnamese: string;`);
tsLines.push(`  category: string;`);
tsLines.push(`  hskLevel: number;`);
tsLines.push(`  lesson: number;`);
tsLines.push(`  type: "single" | "compound";`);
tsLines.push(`}`);
tsLines.push(``);
tsLines.push(`export const hsk1Words: Word[] = [`);
for (const w of finalWords) {
  tsLines.push(`  {`);
  tsLines.push(`    id: "${w.id}",`);
  tsLines.push(`    hanzi: "${w.hanzi}",`);
  tsLines.push(`    pinyin: "${w.pinyin}",`);
  tsLines.push(`    english: "${w.english}",`);
  tsLines.push(`    vietnamese: "${w.vietnamese}",`);
  tsLines.push(`    category: "${w.category}",`);
  tsLines.push(`    hskLevel: ${w.hskLevel},`);
  tsLines.push(`    lesson: ${w.lesson},`);
  tsLines.push(`    type: "${w.type}",`);
  tsLines.push(`  },`);
}
tsLines.push(`];`);

const outPath = path.join(__dirname, "../src/data/hsk1.ts");
fs.writeFileSync(outPath, tsLines.join("\n"), "utf8");

const total = finalWords.length;
const singles = finalWords.filter(w => w.type === "single").length;
const compounds = finalWords.filter(w => w.type === "compound").length;

console.log(`Generated: ${outPath}`);
console.log(`Total words: ${total}`);
console.log(`Single words: ${singles} (target: 206)`);
console.log(`Compound words: ${compounds} (target: 294)`);
console.log(`Lessons distribution:`);
for (let l = 1; l <= 10; l++) {
  const count = finalWords.filter(w => w.lesson === l).length;
  if (count > 0) console.log(`  Lesson ${l}: ${count} words`);
}
