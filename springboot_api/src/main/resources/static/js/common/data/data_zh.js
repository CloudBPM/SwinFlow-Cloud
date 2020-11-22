/**
 * Organization Management
 */
;

var productname = "创意轩";
var vendor = "轩琦科技"
// 1: standalone;
// 2: private cloud;
// 3: public cloud;
var pversion = 1;
// 0:no approval;1:approval
var approval = 0;


/**
 * 单位性质：
 *
 * 国企, 民营, 合资, 外商独资, 股份制企业, 上市公司, 代表处, 国家机关, 事业单位, 银行, 医院, 学校/下级学院, 律师事务所, 社会团体,
 * 港澳台公司, 其它,
 *
 * 行业：
 *
 * 互联网/电子商务，计算机软件，IT服务(系统/数据/维护)，电子技术/半导体/集成电路，计算机硬件，通信/电信/网络设备，通信/电信运营、增值服务，
 * 网络游戏，基金/证券/期货/投资，保险，银行，信托/担保/拍卖/典当，房地产/建筑/建材/工程，家居/室内设计/装饰装潢，物业管理/商业中心，
 * 专业服务/咨询(财会/法律/人力资源等)，广告/会展/公关，中介服务，检验/检测/认证，外包服务，快速消费品（食品/饮料/烟酒/日化），
 * 耐用消费品（服饰/纺织/皮革/家具/家电），贸易/进出口，零售/批发，租赁服务，教育/培训/院校，礼品/玩具/工艺美术/收藏品/奢侈品，
 * 汽车/摩托车，大型设备/机电设备/重工业，加工制造（原料加工/模具），仪器仪表及工业自动化，印刷/包装/造纸，办公用品及设备，
 * 医药/生物工程，医疗设备/器械，航空/航天研究与制造，交通/运输物流/仓储，医疗/护理/美容/保健/卫生服务，酒店/餐饮，旅游/度假，
 * 媒体/出版/影视/文化传播，娱乐/体育/休闲，能源/矿产/采掘/冶炼，石油/石化/化工，电气/电力/水利，环保，政府/公共事业/非盈利机构，
 * 学术/科研，农/林/牧/渔，跨领域经营，其他
 *
 */

category = {
    'A': 'A 农、林、牧、渔业',
    'B': 'B 采矿业',
    'C': 'C 制造业',
    'D': 'D 电力、热力、燃气及水生产和供应业',
    'E': 'E 建筑业',
    'F': 'F 批发零售业',
    'G': 'G 交通运输、仓储和邮政业',
    'H': 'H 住宿和餐饮业',
    'I': 'I 信息传输、软件和信息技术服务业',
    'J': 'J 金融业',
    'K': 'K 房地产业',
    'L': 'L 租赁和商务服务业',
    'M': 'M 科学研究和技术服务业',
    'N': 'N 水利、环境和公共设施管理业',
    'O': 'O 居民服务、修理和其他服务业',
    'P': 'P 教育',
    'Q': 'Q 卫生与社会工作',
    'R': 'R 文化、体育和娱乐业',
    'S': 'S 公共管理、社会保障和社会组织',
    'T': 'T 国际组织',
};

categorydtails = {
    'A01': 'A 01 农业（农作物种植业等）',
    'A02': 'A 02 林业',
    'A03': 'A 03 畜牧业',
    'A04': 'A 04 渔业',
    'A05': 'A 05 农、林、牧、渔服务业',
    'B06': 'B 06 煤炭开采和洗选业',
    'B07': 'B 07 石油和天然气开采业',
    'B08': 'B 08 黑色金属矿采选业',
    'B09': 'B 09 有色金属矿采选业',
    'B10': 'B 10 非金属矿采选业',
    'B11': 'B 11 开采辅助活动（服务业）',
    'B12': 'B 12 其他采矿业',
    'C13': 'C 13 农副食品加工业',
    'C14': 'C 14 食品制造业',
    'C15': 'C 15 酒、饮料和精制茶制造业',
    'C16': 'C 16 烟草制品业',
    'C17': 'C 17 纺织业',
    'C18': 'C 18 纺织服装、服饰业',
    'C19': 'C 19 皮革、毛皮、羽毛及其制品和制鞋业',
    'C20': 'C 20 木材加工和木、竹、藤、棕、草制品业',
    'C21': 'C 21 家具制造业',
    'C22': 'C 22 造纸和纸制品业',
    'C23': 'C 23 印刷和记录媒介复制业',
    'C24': 'C 24 文教、工美、体育和娱乐用品制造业',
    'C25': 'C 25 石油加工、炼焦和核燃料加工业',
    'C26': 'C 26 化学原料和化学制品制造业',
    'C27': 'C 27 医药制造业',
    'C28': 'C 28 化学纤维制造业',
    'C29': 'C 29 橡胶和塑料制品业',
    'C30': 'C 30 非金属矿物制品业',
    'C31': 'C 31 黑色金属冶炼和压延加工业',
    'C32': 'C 32 有色金属冶炼和压延加工业',
    'C33': 'C 33 金属制品业',
    'C34': 'C 34 通用设备制造业',
    'C35': 'C 35 专用设备制造业',
    'C36': 'C 36 汽车制造业',
    'C37': 'C 37 铁路、船舶、航空航天和其他运输设备制造业',
    'C38': 'C 38 电气机械和器材制造业',
    'C39': 'C 39 计算机、通信和其他电子设备制造业',
    'C40': 'C 40 仪器仪表制造业',
    'C41': 'C 41 其他制造业',
    'C42': 'C 42 废弃资源综合利用业',
    'C43': 'C 43 金属制品、机械和设备修理业',
    'D44': 'D 44 电力、热力生产和供应业',
    'D45': 'D 45 燃气生产和供应业',
    'D46': 'D 46 水的生产和供应业',
    'E47': 'E 47 房屋建筑业',
    'E48': 'E 48 土木工程建筑业',
    'E49': 'E 49 建筑安装业',
    'E50': 'E 50 建筑装饰和其他建筑业',
    'F51': 'F 51 批发业',
    'F52': 'F 52 零售业',
    'G53': 'G 53 铁路运输业',
    'G54': 'G 54 道路运输业',
    'G55': 'G 55 水上运输业',
    'G56': 'G 56 航空运输业',
    'G57': 'G 57 管道运输业',
    'G58': 'G 58 装卸搬运和运输代理业',
    'G59': 'G 59 仓储业',
    'G60': 'G 60 邮政业（基本邮政服务和快递服务业）',
    'H61': 'H 61 住宿业（旅游饭店、酒店、宾馆、旅馆服务业等）',
    'H62': 'H 62 餐饮业（正餐、快餐、饮料冷饮等服务业等）',
    'I63': 'I 63 电信、广播电视和卫星传输服务',
    'I64': 'I 64 互联网和相关服务',
    'I65': 'I 65 软件和信息技术服务业',
    'J66': 'J 66 货币金融服务（货币、非货币银行服务业等）',
    'J67': 'J 67 资本市场服务（证券、期货市场服务业等）',
    'J68': 'J 68 保险业（人寿、健康、财产、养老金业以及相关服务业等）',
    'J69': 'J 69 其他金融业（金融信托与管理、金融信息、控股公司服务业等）',
    'K70': 'K 70 房地产业',
    'L71': 'L 71 租赁业',
    'L72': 'L 72 商务服务业（会计、律师、审计、税务、广告、知识产权、旅行社等）',
    'M73': 'M 73 研究和试验发展',
    'M74': 'M 74 专业技术服务业（气象、地震、测绘、环境监测、地质勘查等）',
    'M75': 'M 75 科技推广和应用服务业',
    'N76': 'N 76 水利管理业',
    'N77': 'N 77 生态保护和环境治理业',
    'N78': 'N 78 公共设施管理业（市政设施、环境卫生、公园景区绿地管理等）',
    'O79': 'O 79 居民服务业（家政、托儿所、理发、按摩、婚介、殡葬等）',
    'O80': 'O 80 机动车、电子产品和日用产品修理业',
    'O81': 'O 81 其他服务业',
    'P82': 'P 82 教育（学龄前、初、中、高等教育与培训等）',
    'Q83': 'Q 83 卫生（医疗保健服务）',
    'Q84': 'Q 84 社会工作（养老院、精神康复、残障收养救助服务）',
    'R85': 'R 85 新闻和出版业',
    'R86': 'R 86 广播、电视、电影和影视录音制作业',
    'R87': 'R 87 文化艺术业',
    'R88': 'R 88 体育',
    'R89': 'R 89 娱乐业（歌舞厅、网吧、游乐园、文体经纪代理等）',
    'S90': 'S 90 中国共产党机关',
    'S91': 'S 91 国家机构（各级政府机构、行政机关单位等）',
    'S92': 'S 92 人民政协、民主党派',
    'S93': 'S 93 社会保障活动',
    'S94': 'S 94 群众团体、社会团体和其他成员组织',
    'S95': 'S 95 基层群众自治组织（社区、村民自治组织等）',
    'T96': 'T 96 国际组织',
};

bloodtype = {
    "A": "A",
    "B": "B",
    "AB": "AB",
    "O": "O",
    "Rh": "Rh",
    "Unknown": "未知",
};

ch_nationality = {
    "汉族": "汉族",
    "蒙古族": "蒙古族",
    "回族": "回族",
    "藏族": "藏族",
    "维吾尔族": "维吾尔族",
    "苗族": "苗族",
    "彝族": "彝族",
    "壮族": "壮族",
    "布依族": "布依族",
    "朝鲜族": "朝鲜族",
    "满族": "满族",
    "侗族": "侗族",
    "瑶族": "瑶族",
    "白族": "白族",
    "土家族": "土家族",
    "哈尼族": "哈尼族",
    "哈萨克族": "哈萨克族",
    "傣族": "傣族",
    "黎族": "黎族",
    "僳僳族": "僳僳族",
    "佤族": "佤族",
    "畲族": "畲族",
    "高山族": "高山族",
    "拉祜族": "拉祜族",
    "水族": "水族",
    "东乡族": "东乡族",
    "纳西族": "纳西族",
    "景颇族": "景颇族",
    "柯尔克孜族": "柯尔克孜族",
    "土族": "土族",
    "达斡尔族": "达斡尔族",
    "仫佬族": "仫佬族",
    "羌族": "羌族",
    "布朗族": "布朗族",
    "撒拉族": "撒拉族",
    "毛南族": "毛南族",
    "仡佬族": "仡佬族",
    "锡伯族": "锡伯族",
    "阿昌族": "阿昌族",
    "普米族": "普米族",
    "塔吉克族": "塔吉克族",
    "怒族": "怒族",
    "乌孜别克族": "乌孜别克族",
    "俄罗斯族": "俄罗斯族",
    "鄂温克族": "鄂温克族",
    "德昂族": "德昂族",
    "保安族": "保安族",
    "保安族": "保安族",
    "京族": "京族",
    "塔塔尔族": "塔塔尔族",
    "独龙族": "独龙族",
    "鄂伦春族": "鄂伦春族",
    "赫哲族": "赫哲族",
    "门巴族": "门巴族",
    "珞巴族": "珞巴族",
    "基诺族": "基诺族",
};

rank = {
    1: '一级',
    2: '二级',
    3: '三级',
    4: '四级',
    5: '五级',
    6: '六级',
    7: '七级',
    8: '八级',
    9: '九级',
    10: '十级',
};

fontfamilies = {
    "Microsoft Yahei": "微软雅黑",
    "simsun": "宋体",
    "FangSong": "仿宋",
    "KaiTi": "楷体",
    "SimHei": "黑体",
    "LiSu": "隶书",
    "YouYuan": "幼圆",
    "FZShuTi": "方正舒体",
    "Arial": "Arial",
    "Arial Black": "Arial Black",
    "Helvetica": "Helvetica",
    "Geneva": "Geneva",
    "Verdana": "Verdana",
    "Times New Roman": "Times New Roman",
};

fontsizes = {
    8: "8",
    9: "9",
    10: "10",
    12: "12",
    14: "14",
    16: "16",
    18: "18",
    20: "20",
    22: "22",
    24: "24",
    26: "26",
    28: "28",
    30: "30",
    32: "32",
    34: "34",
    36: "36",
    38: "38",
    40: "40",
    42: "42",
    46: "46",
    48: "48",
    50: "50",
    52: "52",
    54: "54",
    56: "56",
    58: "58",
    60: "60",
    62: "62",
    66: "66",
    72: "72",
    80: "80",
};

fontweights = {
    "normal": "标准",
    "bold": "粗体",
    "italic": "斜体",
};

staffnumber = {
    1: '20人以下',
    2: '20 - 50人',
    3: '50 - 100人',
    4: '100 - 200人',
    5: '200 - 300人',
    6: '300 - 500人',
    7: '500 - 1000人',
    8: '1000 - 2000人',
    9: '2000 - 5000人',
    10: '5000人以上',
};

yesno = {
    'Y': '是',
    'N': '否',
};

validstatus = {
    3: '未启用',
    4: '已启用',
};

orgstatus = {
    3: '未启用',
    4: '已启用',
    5: '已注销',
};

idtype = {
    0: '身份证',
    1: '护照',
};

gender = {
    'M': '男',
    'F': '女',
};

stafftitle = {
    1: '初级',
    2: '中级',
    3: '副高级',
    4: '正高级',
};

worktype = {
    // 1:full time;2:part time;3:casual;4:intern
    1: '全职',
    2: '兼职',
    3: '临时工',
    4: '实习',
};

workstatus = {
    // 0:idle;1:busy;2:crazy;3:away;4:off
    0: '空闲',
    1: '忙碌',
    2: '繁忙',
    3: '离开',
    4: '下班',
};

jobstatus = {
    1: '在职',
    2: '停职',
    3: '待岗',
    4: '退休',
    5: '离职',
    6: '辞退',
};

banningstatus = {
    0: '可用',
    1: '禁用',
};

customtype = {
    0: '系统',
    1: '自定义',
};

/**
 * Process Management
 */
/**
 *
 */
;
truefalse = {
    'true': '真',
    'false': '假',
};

processtype = {
    0: '办公自动化',
    1: '费用审批',
    2: '金融审批',
    3: '保险审批',
    4: '行政许可审批',
    5: '财务审批',
    6: '合同审批',
    7: '系统集成',
    8: '其他',
};

workflowtype = {
    0: '自动应用',
    1: '单人应用',
    2: '多人应用',
};

accesslevel = {
    0: '内部（绝密）',
    1: '内部（机密）',
    2: '内部（秘密）',
    3: '内部（不公开）',
    4: '内部（公开）',
    5: '外部（公开）',
};

yesno = {
    0: '否',
    1: '是',
};

acsctrl = {
    0: '只读',
    1: '可写',
};

priority = {
    0: '普通',
    1: '重要',
    2: '紧急',
};

trialperiod = {
    0: '无试用期',
    1: '1个月',
    2: '3个月',
    3: '6个月',
    4: '9个月',
    5: '1年',
};

largeduration = {
    0: '工作日',
    1: '日',
    2: '周',
    3: '月',
    4: '季度',
    5: '小时',
    6: '分',
    7: '秒',
    8: '毫秒',
};

datatype = {
    "Integer": "整数",
    "Double": "小数",
    "Boolean": "真假值",
    "String": "字符串",
    "DateTime": "日期时间",
    "Date": "日期",
    "Time": "时间",
    "TimeDuration": "时间区间",
    "Currency": "货币",
    "JSONData": "JSON数据",
    "File": "文件",
    "Handwriting": "写字板"
};

f_group = {
    0: "数组函数",
    1: "文本函数",
    2: "日期函数",
    3: "数学函数",
    4: "JSON函数",
    5: "文件函数",
    6: "手写文本函数",
    7: "其他函数",
};

f_array = {
    "addLastElement": "添加元素到尾部（元素）",
    "addHeadElement": "添加元素到头部（元素）",
    "insertElement": "插入元素（序号，元素）",
};

f_str = {
    "search": "查找（目标文本）",
    "addLastText": "插入文本到尾部（元素）",
    "addHeadTexr": "插入文本到头部（元素）",
    "insertText": "插入文本（序号，元素）",
};

f_date = {};

f_month = {};

pfonlinestatus = {
    1: '未上线',
    0: '上线待审核',
    2: '已上线',
    3: '已撤回',
    4: '审核未通过',
};

onlinestatus = {
    0: '未发布',
    1: '发布待审核',
    2: '已发布',
    3: '已撤回',
    4: '审核未通过',
};

/**
 * Micro service management
 *
 */

/**
 *
 */
;
usage = {
    0: '开发中',
    1: '待审核',
    2: '已上线',
};

templatestatus = {
    0: '已下线',
    1: '已上线',
};

returntype = {
    0: '无返回',
    1: '返回文本',
    2: '返回文件',
};

accesstype = {
    1: '内部服务',
    2: '公共服务',
};

pathdatatype = {
    'int': '整型',
    'double': '实数型',
    'String': '字符串型',
};

formdatatype = {
    'int': '整型',
    'double': '实数型',
    'String': '字符串型',
    'File': '文件',
};

containertype = {
    1: "Java Web应用微服务器",
    2: "PHP应用微服务器",
    3: "Pyhton应用微服务器",
    4: "Ruby应用微服务器",
};

headkeys = {
    "Accept": "Accept",
    "Accept-Charset": "Accept-Charset",
    "Accept-Encoding": "Accept-Encoding",
    "Accept-Language": "Accept-Language",
    "Accept-Datetime": "Accept-Datetime",
    "Cache-Control": "Cache-Control",
    "Connection": "Connection",
    "Cookie": "Cookie",
    "Content-Length": "Content-Length",
    "Content-Type": "Content-Type",
    "Expect": "Expect",
    "From": "From",
    "Host": "Host",
    "If-Match": "If-Match",
    "If-Modified-Since": "If-Modified-Since",
    "If-None-Match": "If-None-Match",
    "If-Range": "If-Range",
    "If-Unmodified-Since": "If-Unmodified-Since",
    "Max-Forwards": "Max-Forwards",
    "Origin": "Origin",
    "Pragma": "Pragma",
    "Range": "Range",
    "Referer": "Referer",
    "TE": "TE",
    "User-Agent": "User-Agent",
    "Upgrade": "Upgrade",
    "Via": "Via",
    "Warning": "Warning",
};

Accept = {
    "*/*": "*/*",
    "text/*": "text/*",
    "image/*": "image/*",
    "application/*": "application/*",
    "audio/*": "audio/*",
    "video/*": "video/*",
    "text/plain": "text/plain",
    "text/html": "text/html",
    "application/xml": "application/xml",
    "application/zip": "application/zip",
    "application/java-archive": "application/java-archive",
    "application/x-rar-compressed": "application/x-rar-compressed",
    "application/vnd.ms-excel": "application/vnd.ms-excel",
    "application/msword": "application/msword",
    "application/pdf": "application/pdf",
    "audio/mpeg": "audio/mpeg",
    "video/mp4": "video/mp4",
    "video/mpeg": "video/mpeg",
};

AcceptCharset = {
    "UTF-8": "UTF-8",
    "ISO-8859-1": "ISO-8859-1",
    "GBK": "GBK",
    "GB2312": "GB2312",
    "Big5": "Big5",
    "GB18030": "GB18030"
};

AcceptEncoding = {
    "*": "*",
    "compress": "compress",
    "gzip": "gzip",
};

AcceptLanguage = {
    "zh-cn": "zh-cn",
    "en-us": "en-us",
};

AcceptDatetime = {};

CacheControl = {
    "no-cache": "no-cache",
    "max-age": "max-age=<seconds>",
    "max-stale": "max-stale[=<seconds>]",
    "min-fresh": "min-fresh=<seconds>",
    "no-store": "no-store",
    "no-transform": "no-transform",
    "only-if-cached": "only-if-cached"
};

Connection = {
    "keep-alive": "keep-alive",
    "close": "close",
};

ContentType = {
    "multipart/form-data": "multipart/form-data",// post
    "application/x-www-form-urlencoded": "application/x-www-form-urlencoded",// post
    // "application/json" : "application/json",// post
    // "application/xml" : "application/xml",// post
    "image/tiff": "image/tiff",// get
    "image/jpeg": "image/jpeg",// get
    "image/png": "image/png",// get
    "image/gif": "image/gif",// get
    "image/jpeg": "image/jpeg",// get
    "text/html": "text/html",// get
    "text/xml": "text/xml",// get
    "text/plain": "text/plain",// get
    "text/css": "text/css",// get
};

AuthenticationType = {
    0: "无认证（No Authentication）",
    1: "基本认证（Basic Authentication）",
    2: "摘要认证（Digest Authentication）",
    3: "NLTM认证（NLTM Authentication）",
};

GetHS1 = {
    "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,image/apng,*/*;q=0.8",
    "Accept-Encoding": "gzip, deflate, br",
    "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
    "Connection": "keep-alive",
    "Upgrade-Insecure-Requests": "1",
    "User-Agent": "Xuanqi micro serivce/1.0",
};

GetHS2 = {
    "Accept": "2",
    "Accept-Encoding": "gzip, deflate, br",
    "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
    "Connection": "keep-alive",
    "Upgrade-Insecure-Requests": "1",
    "User-Agent": "Xuanqi micro serivce/1.0",
};

PostHS1 = {
    "Accept": "3",
    "Accept-Encoding": "gzip, deflate, br",
    "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
    "Connection": "keep-alive",
    "Upgrade-Insecure-Requests": "1",
    "User-Agent": "Xuanqi micro serivce/1.0",
};

PostHS2 = {
    "Accept": "4",
    "Accept-Encoding": "gzip, deflate, br",
    "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
    "Connection": "keep-alive",
    "Upgrade-Insecure-Requests": "1",
    "User-Agent": "Xuanqi micro serivce/1.0",
};

PostHS3 = {
    "Accept": "5",
    "Accept-Encoding": "gzip, deflate, br",
    "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
    "Connection": "keep-alive",
    "Upgrade-Insecure-Requests": "1",
    "User-Agent": "Xuanqi micro serivce/1.0",
};

PostHS4 = {
    "Accept": "6",
    "Accept-Encoding": "gzip, deflate, br",
    "Accept-Language": "zh-CN,zh;q=0.9,en;q=0.8",
    "Connection": "keep-alive",
    "Upgrade-Insecure-Requests": "1",
    "User-Agent": "Xuanqi micro serivce/1.0",
};

// form management

/**
 *
 */
;

formcomponenttype = {
    "Anchor": "超链接组件",
    "Button": "按钮组件",
    "CheckBox": "复选框组件",
    "CheckBoxes": "复选框组组件",
    "Column": "列组件",
    "UIComponent": "组件",
    "UIContainer": "容器组件",
    "CurrencyInput": "货币输入框组件",
    "DateTimeInput": "日期时间组件",
    "DateTimeRangeInput": "日期时间范围组件",
    "DecimalsInput": "小数输入框组件",
    "FileDisplayer": "文件阅读播放器组件",
    "FilesDisplayer": "多文件阅读播放器组件",
    "FileUpload": "文件上传组件",
    "Form": "表单",
    "Header": "标题组件",
    "Image": "图片组件",
    "IntegerInput": "整数输入框组件",
    "MultipleLineText": "多行文本输入框组件",
    "NaturalNumberInput": "自然数输入框组件",
    "PageableTableView": "分页式表格组件",
    "Paragraph": "正文段落组件",
    "Radio": "单选框组件",
    "Radios": "单选框组组件",
    "RichTextInput": "富文本输入框组件",
    "Row": "行组件",
    "SingleLineText": "单行文本输入框组件",
    "SingleSelect": "单选下拉框组件",
    "StaticList": "静态列表组件",
    "TableView": "表格组件",

};

lockstatus = {
    0: '未锁定',
    1: '已锁定',
};

yesno = {
    0: '否',
    1: '是',
};

truefalse = {
    'true': '真',
    'false': '假',
};

shapetype = {
    0: '圆角',
    1: '圆形',
    2: '缩略图',
};

headertype = {
    1: '标题1',
    2: '标题2',
    3: '标题3',
    4: '标题4',
    5: '标题5',
    6: '标题6',
};

textalign = {
    0: '靠左',
    1: '居中',
    2: '靠右',
};

fontstyle = {
    0: '正常',
    1: '斜体',
    2: '倾斜体',
};

liststyle = {
    0: '无序',
    1: '有序',
};

textinputbehaviors = {
    1: "文本正在输入",
    2: "文本已经修改",
    3: "文本已经选择",
    4: "获得输入焦点",
    5: "失去输入焦点",
};

selectbehaviors = {
    2: "选择改变",
    5: "失去输入焦点",
};

checkboxbehaviors = {
    6: "选中",
    7: "未选",
};

radiobehaviors = {
    6: "选中",
};

combehaviors = {
    1: "隐藏",
    2: "显示",
    3: "只读",
    4: "可写",
    5: "可用",
    6: "禁用",
    7: "清空",
    8: "更新",
    9: "验证",
    10: "成功",
    11: "通知",
    12: "警告",
    13: "错误",
};

// 0: automation application service
// 1: single participant application service
// 2: multiple participant application service
// 3: data-collecting UI application service
// 4: data-presentation UI application service
// 5: data-listing UI application service
// 6: data-statistics UI application service
// 7: micro-service application service

servicetype = {
    "0": "自动应用服务",
    "1": "单人应用服务",
    "2": "多人应用服务",
    "3": "数据采集应用",
    "4": "数据展示应用",
    "5": "数据列表应用",
    "6": "数据统计应用",
    "7": "微服务应用",
};

// administration

noticestatus = {
    0: "未发布",
    1: "已发布"
};

propogaterange = {
    0: "对外动态",
    1: "内部动态",
    2: "内部参考",
};

newscategory = {
    0: "公开新闻",
    1: "内部新闻",
    2: "通知公告",
    3: "文献资料",
};

// SaaS big data management

reporttype = {
    0: "普通报表",
    1: "分页报表",
    2: "统计报表",
};

transitionstatus = {
    0: "默认",
    1: "激活",
    2: "完成",
    3: "未用",
    4: "异常",
}

taskstatus = {
    0: "默认",
    1: "激活",
    2: "运行",
    3: "完成",
    4: "未用",
    5: "异常",
    6: "跳过",
    7: "中止",
};

processstatus = {
    0: "默认",
    1: "未锁定",
    2: "锁定",
    3: "版本",
    4: "发起",
    5: "运行",
    6: "暂停",
    7: "中止",
    8: "完成",
};

mtaskphase = {
    "-1": "激活",
    "0": "待领取",
    "1": "未提交",
    "2": "已提交",
    "3": "已退回",
};

participanttype = {
    0: "分配到岗位",
    1: "分配到发起人",
    2: "分配到特定执行人",
};

workpriority = {
    0: "一般",
    1: "重要",
    2: "紧急",
}