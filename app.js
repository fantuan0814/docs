// Polyfill for older browsers
if (!window.crypto || !window.crypto.randomUUID) {
  (function() {
    function _uuid() {
      return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c === "x" ? r : (r & 0x3 | 0x8);
        return v.toString(16);
      });
    }
    if (!window.crypto) window.crypto = {};
    if (!window.crypto.randomUUID) window.crypto.randomUUID = _uuid;
  })();
}

const SOURCES = ["FACEBOOK", "国际站", "独立站", "社媒私信", "展会现场", "老客户转介绍"];
const PRODUCT_CATEGORIES = ["IH电磁饭煲", "保温桶", "电饭煲电脑", "电饭煲机械", "煮粥锅", "电压力锅"];
const STAGES = ["信息已收集", "已联系未回复", "已回复", "需求确认", "待推荐", "已推荐", "待报价", "已报价", "样品中", "谈判中", "已成交", "暂缓", "无效"];
const CLOSED_STAGES = ["已成交", "无效", "暂缓", "取消", "已完成"];
const FOLLOW_PLAN_DAYS = {
  "终端客户": 5,
  "批发商": 2,
  "代理商": 2,
  "贸易商": 3,
  "项目客户": 1,
  "其他": 3,
};
const LEVEL_PLAN_DAYS = {
  "A-重点客户": 1,
  "B-潜力客户": 2,
  "C-普通客户": 4,
  "D-低优先级": 7,
  "VIP-老客户": 14,
};
const CUSTOMER_KINDS = ["公司", "个人"];
const CUSTOMER_NATURES = ["终端客户", "批发商", "代理商", "贸易商", "项目客户", "其他"];
const CONTACT_TYPES = ["WhatsApp", "微信", "电话", "邮箱", "Facebook", "Instagram", "其他"];
const LEVELS = ["A-重点客户", "B-潜力客户", "C-普通客户", "D-低优先级", "VIP-老客户"];
const CURRENCIES = ["USD", "CNY", "EUR"];
const ORDER_STATUS = ["待开PI", "PI已发", "待付款", "生产中", "待出货", "已出货", "已完成", "取消"];
const PAY_STATUS = ["未收款", "已收定金", "已收全款", "退款/取消"];
const STORAGE_KEY = "cyc-crm-local-v4";
const PRODUCT_PARAMS = window.PRODUCT_PARAMS || [];
const SUPABASE_URL = "https://etghiirstnptnpbnnemb.supabase.co";
const SUPABASE_KEY = "sb_publishable_immE4TvFk9dwoba01_B4sA_xUxR2w57";
const supabaseClient = (window.supabase != null ? window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY) : undefined);
const CLOUD_TIMEOUT_MS = 45000;
let currentUser = null;
let cloudSaveTimer = null;
let cloudLoading = false;
let cloudLoadedUserId = null;
const ORDER_DEFAULTS = {
  portLoading: "GUANGZHOU / SHENZHEN, CHINA",
  payment: "100% ADVANCE",
  incoterm: "EXW",
  delivery: "AFTER FULL PAYMENT 14 DAYS",
  partialShipment: "NO ALLOWED",
  currency: "USD",
  status: "待开PI",
  payStatus: "未收款",
};
const PI_SELLER = {
  cnName: "佛山市川粤智能商厨有限公司",
  enName: "Steamatech (China) Technology Co., Ltd.",
  address: "Building 6, Shunde Wanyang Mass Innovation Park, Longjiang Town, Shunde District, Foshan, Guangdong, China",
  bankName: "JPMorgan Chase Bank N.A., Hong Kong Branch",
  bankAccount: "63004289235",
  bankAddress: "18/F, 20/F, 22-29/F, Chater House, 8 Connaught Road Central, Hong Kong",
  swift: "CHASHKHHXXX",
};
const CONTAINER_TYPES = {
  "20GP": 28,
  "40GP": 58,
  "40HQ": 68,
};

const PRODUCT_CATALOG = [
  p("IH电磁饭煲", "21L IH", "", 2380, 2380, 2850, 7600, 1900),
  p("保温桶", "50L保温桶", "", 699, 699, 744, 2440, 610),
  p("保温桶", "25L保温桶", "", 349, 349, 384, 1300, 325),
  p("保温桶", "19L", "", 299, 299, 329, 1120, 280),
  p("电饭煲电脑", "25L电饭煲电脑", "", 685.4, 685.4, 750.4, 2140, 535),
  p("电饭煲电脑", "21L电饭煲电脑", "", 565.8, 565.8, 615.8, 2020, 505),
  p("电饭煲电脑", "16L电饭煲电脑", "", 439.76, 439.76, 469.76, 1580, 395),
  p("电饭煲电脑", "13L电饭煲电脑", "", 406.64, 406.64, 436.64, 1420, 355),
  p("电饭煲机械", "25L", "", 626.52, 626.52, 691.52, 2080, 520),
  p("电饭煲机械", "21L", "", 535.44, 535.44, 585.44, 1880, 470),
  p("电饭煲机械", "16L", "", 394.2, 394.2, 429.2, 1460, 365),
  p("电饭煲机械", "13L", "", 364.5, 364.5, 394.5, 1280, 320),
  p("煮粥锅", "41L压力锅", "大型号，内胆容量约41L", 1380, 1380, 1620, 4320, 1080),
  p("煮粥锅", "41L", "", 1209, 1209, 1395, 3720, 930),
  p("煮粥锅", "23L", "", 584.25, 584.25, 634.25, 1980, 495),
  p("煮粥锅", "15L压力锅", "内胆容量约15L", 335, 335, 365, 1260, 315),
  p("电压力锅", "75L", "", 2580, 2580, 3675, 9800, 2450),
  p("电压力锅", "73L柜机", "", 5850, 5850, 6750, 18000, 4500),
  p("电压力锅", "65L", "", 2380, 2380, 2635, 8000, 2000),
  p("电压力锅", "60L", "", 2180, 2180, 2380, 7400, 1850),
  p("电压力锅", "50L", "", 1980, 1980, 2080, 6600, 1650),
  p("电压力锅", "45L", "", 1580, 1580, 1680, 5120, 1280),
  p("电压力锅", "35L", "内胆容量约35L", 1180, 1180, 1260, 3840, 960),
  p("电压力锅", "29L", "内胆容量约29L", 865, 865, 915, 3120, 780),
  p("电压力锅", "24L", "内胆容量约24L", 755, 755, 805, 2720, 680),
  p("电压力锅", "20L", "内胆容量约20L", 655, 655, 705, 2360, 590),
  p("电压力锅", "17L", "内胆容量约17L", 448, 448, 496, 1580, 395),
  p("电压力锅", "15L", "内胆容量约15L", 428, 428, 475, 1500, 375),
  p("电压力锅", "12L", "内胆容量约12L", 258, 258, 288, 940, 235),
  p("电压力锅", "10L", "", 248, 248, 345, 920, 230),
  p("电压力锅", "8L", "内胆容量8L", 188, 188, 218, 700, 175),
  p("电压力锅", "6L", "", 164.7, 164.7, 194.7, 520, 130),
  p("电压力锅", "1.8L", "", 143, 143, 165, 440, 110),
];

function p(category, model, spec, crossBorder, overseas, wholesale, terminal, floor) {
  return { category, model, spec, status: "在售", crossBorder, overseas, wholesale, terminal, floor };
}

const state = loadState();
normalizeState(state);
let currentView = "dashboard";
let reminderFilter = "all";
let editing = { type: null, id: null };
let detailTarget = null;
let activeInquiryId = (state.inquiries[0] != null ? state.inquiries[0].id : undefined) || null;
let activeOrderId = (state.orders[0] != null ? state.orders[0].id : undefined) || null;
let undoStack = [];
let bulkSelected = new Set();
let sortState = { field: null, dir: 'asc' };
let mergeSourceId = null;
let mergeTargetId = null;
let theme = localStorage.getItem('cyc-crm-theme') || 'light';

const viewMeta = {
  dashboard: ["今日小提醒", "点开提醒卡片可查看详情和编辑。", "新增客户"],
  customers: ["客户小本本", "按客户、公司、国家和联系方式整理。", "新增客户"],
  inquiries: ["询盘中心", "询盘和跟进合在一起，看分类、看阶段、看时间线。", "新增询盘"],
  followups: ["询盘中心", "跟进已经合并到询盘里。", "新增询盘"],
  orders: ["订单 PI", "录入订单后，右侧可直接预览 PI。", "新增订单"],
  kanban: ["询盘看板", "拖拽卡片切换阶段，查看销售漏斗。", "新增询盘"],
  reports: ["数据报表", "收入、转化率、月度趋势分析。", "新增询盘"],
  products: ["产品小库", "随时查型号、分类和价格。", "新增询盘"],
};

const schemas = {
  customer: [
    ["name", "客户名称", "text", true],
    ["customerKind", "客户类型", "select", false, CUSTOMER_KINDS],
    ["personName", "联系人/个人姓名", "text"],
    ["companyName", "公司名称", "text", false, null, "", "company-only"],
    ["position", "职位", "text", false, null, "", "company-only"],
    ["contacts", "联系方式(可多条)", "contacts"],
    ["email", "邮箱", "email"],
    ["website", "公司网站", "text", false, null, "", "company-only"],
    ["firstContactInput", "首次接触时间", "text", false, null, "例如 5.12"],
    ["country", "国家/地区", "text"],
    ["nature", "客户性质", "select", false, CUSTOMER_NATURES],
    ["level", "客户等级", "select", false, LEVELS],
    ["source", "首次来源", "select", false, SOURCES],
    ["productCategories", "产品大类(可多选)", "multi", false, PRODUCT_CATEGORIES],
    ["productModels", "产品型号(可多选)", "multi", false, productModels()],
    ["nextFollowInput", "下次跟进", "text", false, null, "例如 5.13"],
    ["nextAction", "要发/要跟进内容", "textarea"],
    ["notes", "聊天记录/备注", "textarea"],
  ],
  inquiry: [
    ["dateInput", "询盘日期", "text", true, null, "例如 5.12"],
    ["customerName", "客户名称", "text", true],
    ["customerKind", "客户类型", "select", false, CUSTOMER_KINDS],
    ["companyName", "公司名称", "text", false, null, "", "company-only"],
    ["personName", "联系人/个人姓名", "text"],
    ["position", "职位", "text", false, null, "", "company-only"],
    ["contacts", "联系方式(可多条)", "contacts"],
    ["country", "国家/地区", "text"],
    ["nature", "客户性质", "select", false, CUSTOMER_NATURES],
    ["source", "来源分类", "select", false, SOURCES],
    ["stage", "跟进阶段", "select", false, STAGES],
    ["level", "客户等级", "select", false, LEVELS],
    ["productCategories", "产品大类(可多选)", "multi", false, PRODUCT_CATEGORIES],
    ["productModels", "产品型号(可多选)", "multi", false, productModels()],
    ["need", "客户需求", "textarea"],
    ["latestFollowText", "本次/最新跟进内容", "textarea", false, null, "会自动加入这条询盘的跟进时间线"],
    ["sendContent", "要发给客户的内容", "textarea"],
    ["nextFollowInput", "下次跟进", "text", false, null, "例如 5.13"],
    ["notes", "备注", "textarea"],
  ],
  order: [
    ["piDateInput", "PI日期", "text", true, null, "例如 5.12"],
    ["piNo", "PI NO.", "text", false, null, "例如 FJ26158"],
    ["customerName", "客户名称", "text", true],
    ["customerInfo", "客户地址/通用信息", "textarea", false, null, "客户公司、地址、国家等"],
    ["contacts", "联系方式(可多条)", "contacts"],
    ["portLoading", "PORT OF LOADING", "text", false, null, "QINGDAO,CHINA"],
    ["portDischarge", "PORT OF DISCHARGE", "text", false, null, "MOMBASA,KENYA"],
    ["incoterm", "INCOTERM", "text", false, null, "EXW"],
    ["orderItems", "订单产品明细", "orderItems"],
    ["freight", "运费", "number"],
    ["currency", "币种", "select", false, CURRENCIES],
    ["payment", "付款方式", "text", false, null, "100% ADVANCE"],
    ["delivery", "交期", "text", false, null, "AFTER FULL PAYMENT 14 DAYS"],
    ["partialShipment", "分批出货", "text", false, null, "NO ALLOWED"],
    ["status", "订单状态", "select", false, ORDER_STATUS],
    ["payStatus", "收款状态", "select", false, PAY_STATUS],
    ["deliveryInput", "预计交期", "text", false, null, "例如 5.30"],
    ["notes", "备注", "textarea"],
  ],
};

function productModels() {
  return PRODUCT_CATALOG.map((item) => `${item.category} / ${item.model}`);
}

// Handle ?fresh=password1 to reset demo data
(function() {
  const params = new URLSearchParams(window.location.search);
  if (params.get('fresh') === 'password1') {
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('cyc-crm-theme');
  }
})();

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      return normalizeState(JSON.parse(saved));
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  return normalizeState({
    companyProfile: defaultCompanyProfile(),
    customers: [{
      id: crypto.randomUUID(),
      name: "示例客户A",
      customerKind: "公司",
      companyName: "示例客户A",
      personName: "Tom",
      position: "采购",
      contacts: [{ type: "WhatsApp", value: "+00 0000" }, { type: "邮箱", value: "tom@example.com" }],
      firstContactInput: simpleDate(today),
      firstContact: formatISO(today),
      country: "美国",
      nature: "批发商",
      level: "B-潜力客户",
      source: "FACEBOOK",
      productCategories: ["电饭煲电脑", "电压力锅"],
      productModels: ["电饭煲电脑 / 21L电饭煲电脑", "电压力锅 / 35L"],
      nextFollowInput: simpleDate(tomorrow),
      nextFollow: formatISO(tomorrow),
      nextAction: "发21L电饭煲电脑和35L电压力锅推荐信息",
      notes: "客户资料已收集，等待回复",
      chatImages: [],
      profileImages: [],
    }],
    inquiries: [
      { id: 'INQ-20260508-001', date: '2026-05-08', customerName: '示例客户A', customerKind: '公司', companyName: '示例客户A', personName: 'Tom', position: '采购', contacts: [{type:'WhatsApp',value:'+00 0000'},{type:'邮箱',value:'tom@example.com'}], country: '美国', nature: '批发商', source: 'FACEBOOK', stage: '已报价', level: 'B-潜力客户', productCategories: ['电饭煲电脑'], productModels: ['21L电饭煲电脑'], need: '需要21L电饭煲电脑500台，FOB价格', latestFollowText: '已发送FOB报价单，客户正在内部评估', sendContent: '21L电饭煲电脑 FOB USD 565.80/台，MOQ 200台', nextFollowInput: '5.15', nextFollow: '2026-05-15', notes: '价格敏感，可能需要调整', follows: [{id:'f1',date:'2026-05-08',content:'首次询盘，需要电饭煲电脑',sendContent:'',nextFollow:'2026-05-10'},{id:'f2',date:'2026-05-10',content:'已发送报价，客户要求降价',sendContent:'调整报价',nextFollow:'2026-05-15'}], chatImages: [], profileImages: [] },
      { id: 'INQ-20260509-001', date: '2026-05-09', customerName: 'ABC Electronics', customerKind: '公司', companyName: 'ABC Electronics Ltd.', personName: 'Sarah', position: 'CEO', contacts: [{type:'WhatsApp',value:'+1 234 5678'},{type:'邮箱',value:'sarah@abc.com'}], country: '英国', nature: '代理商', source: '国际站', stage: '样品中', level: 'A-重点客户', productCategories: ['电压力锅'], productModels: ['35L'], need: '35L电压力锅年采购量2000台，需要样品测试', latestFollowText: '样品已寄出，等待客户收到后反馈', sendContent: '样品单号：DHL 1234567890', nextFollowInput: '5.14', nextFollow: '2026-05-14', notes: '大客户潜力，跟进服务质量', follows: [{id:'f3',date:'2026-05-09',content:'国际站询盘，要求寄样',sendContent:'确认样品规格',nextFollow:'2026-05-12'},{id:'f4',date:'2026-05-12',content:'样品已发出，等待收货',sendContent:'发送物流单号',nextFollow:'2026-05-14'}], chatImages: [], profileImages: [] },
      { id: 'INQ-20260510-001', date: '2026-05-10', customerName: 'Dubai Trading Co.', customerKind: '公司', companyName: 'Dubai Trading Co. LLC', personName: 'Ahmed', position: '采购经理', contacts: [{type:'WhatsApp',value:'+971 50 1234'}], country: '阿联酋', nature: '贸易商', source: '社媒私信', stage: '谈判中', level: 'A-重点客户', productCategories: ['IH电磁饭煲','电饭煲电脑'], productModels: ['21L IH','25L电饭煲电脑'], need: 'IH电磁饭煲和电饭煲电脑各1000台，迪拜市场', latestFollowText: '价格已确认，正在谈付款方式', sendContent: '30%定金+70%发货前付清', nextFollowInput: '5.13', nextFollow: '2026-05-13', notes: '付款条件可能要求LC', follows: [{id:'f5',date:'2026-05-10',content:'社媒联系，需求明确',sendContent:'初步报价',nextFollow:'2026-05-11'},{id:'f6',date:'2026-05-11',content:'客户对价格满意，讨论付款',sendContent:'付款方式方案',nextFollow:'2026-05-13'}], chatImages: [], profileImages: [] },
      { id: 'INQ-20260511-001', date: '2026-05-11', customerName: 'Juan Carlos', customerKind: '个人', companyName: '', personName: 'Juan Carlos', position: '', contacts: [{type:'WhatsApp',value:'+52 1 5555'}], country: '墨西哥', nature: '终端客户', source: 'FACEBOOK', stage: '已联系未回复', level: 'C-普通客户', productCategories: ['煮粥锅'], productModels: ['23L'], need: '23L煮粥锅300台，本地餐厅使用', latestFollowText: '已发送产品资料，等待回复', sendContent: '23L煮粥锅 FOB USD 584.25/台', nextFollowInput: '5.14', nextFollow: '2026-05-14', notes: '', follows: [{id:'f7',date:'2026-05-11',content:'Facebook广告咨询',sendContent:'产品目录和价格',nextFollow:'2026-05-14'}], chatImages: [], profileImages: [] },
      { id: 'INQ-20260512-001', date: '2026-05-12', customerName: 'Kenya Suppliers', customerKind: '公司', companyName: 'Kenya Suppliers Ltd.', personName: 'Mwangi', position: 'Director', contacts: [{type:'WhatsApp',value:'+254 700 111'}], country: '肯尼亚', nature: '批发商', source: '展会现场', stage: '需求确认', level: 'B-潜力客户', productCategories: ['保温桶','电压力锅'], productModels: ['50L保温桶','60L'], need: '保温桶和电压力锅，东非市场批发', latestFollowText: '展会认识的客户，正在确认具体型号数量', sendContent: '50L保温桶 USD 699/台，60L电压力锅 USD 2180/台', nextFollowInput: '5.16', nextFollow: '2026-05-16', notes: '广交会客户，印象不错', follows: [{id:'f8',date:'2026-05-12',content:'展会现场交换名片，初步沟通需求',sendContent:'公司介绍和产品目录',nextFollow:'2026-05-16'}], chatImages: [], profileImages: [] },
    ],
    orders: [
      { id: 'ORD-20260508-001', piDate: '2026-05-08', piNo: 'FJ26158', customerName: 'Lagos Imports', customerInfo: 'Lagos Imports Nigeria Ltd.\n12 Marina Road, Lagos, Nigeria', contacts: [{type:'WhatsApp',value:'+234 800 2222'},{type:'邮箱',value:'info@lagosimports.com'}], portLoading: 'GUANGZHOU, CHINA', portDischarge: 'APAPA, LAGOS, NIGERIA', orderItems: [{model:'21L电饭煲电脑',qty:500,price:565.80,amount:282900},{model:'35L',qty:200,price:1180,amount:236000}], freight: 8500, container: '2x40HQ', currency: 'USD', delivery: 'AFTER FULL PAYMENT 14 DAYS', destination: 'NIGERIA', partialShipment: 'NO ALLOWED', deliveryDate: '2026-06-30', status: '生产中', payStatus: '已收定金', notes: '老客户返单，质量稳定', chatImages: [], profileImages: [] },
      { id: 'ORD-20260510-001', piDate: '2026-05-10', piNo: 'FJ26160', customerName: 'Euro Kitchen BV', customerInfo: 'Euro Kitchen BV\nDamrak 12, 1012 LG Amsterdam, Netherlands', contacts: [{type:'邮箱',value:'order@eurokitchen.nl'}], portLoading: 'SHENZHEN, CHINA', portDischarge: 'ROTTERDAM, NETHERLANDS', orderItems: [{model:'21L IH',qty:300,price:7600,amount:2280000}], freight: 4200, container: '1x40HQ', currency: 'CNY', delivery: 'AFTER FULL PAYMENT 14 DAYS', destination: 'NETHERLANDS', partialShipment: 'NO ALLOWED', deliveryDate: '2026-06-15', status: '待出货', payStatus: '已收全款', notes: 'IH高端产品，欧洲市场需求增长', chatImages: [], profileImages: [] },
      { id: 'ORD-20260512-001', piDate: '2026-05-12', piNo: 'FJ26162', customerName: '示例客户A', customerInfo: '示例客户A\nNew York, USA', contacts: [{type:'邮箱',value:'tom@example.com'}], portLoading: 'GUANGZHOU, CHINA', portDischarge: 'NEW YORK, USA', orderItems: [{model:'21L电饭煲电脑',qty:200,price:565.80,amount:113160}], freight: 3200, container: '1x40GP', currency: 'USD', delivery: 'AFTER FULL PAYMENT 14 DAYS', destination: 'USA', partialShipment: 'NO ALLOWED', deliveryDate: '2026-06-20', status: '待开PI', payStatus: '未收款', notes: '首批试单', chatImages: [], profileImages: [] },
    ],
  });
}

function defaultCompanyProfile() {
  return { ...PI_SELLER };
}

function normalizeState(target) {
  target.customers ||= [];
  target.inquiries ||= [];
  target.orders ||= [];
  target.companyProfile = { ...defaultCompanyProfile(), ...(target.companyProfile || {}) };
  if (target.companyProfile.cnName === "川粤智能商厨") {
    target.companyProfile.cnName = defaultCompanyProfile().cnName;
  }
  return target;
}

function saveState() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  scheduleCloudSave();
}

function cloudPayload() {
  return {
    customers: state.customers,
    inquiries: state.inquiries,
    orders: state.orders,
    companyProfile: state.companyProfile,
    savedAt: new Date().toISOString(),
  };
}

function setCloudStatus(text) {
  const el = document.getElementById("cloudStatus");
  if (el) el.textContent = text;
}

function scheduleCloudSave() {
  if (!currentUser || cloudLoading) return;
  clearTimeout(cloudSaveTimer);
  cloudSaveTimer = setTimeout(saveCloudData, 500);
}

async function saveCloudData() {
  if (!supabaseClient || !currentUser) return;
  setCloudStatus("云端保存中... 图片多时会慢一点");
  const { error, timedOut } = await withTimeout(
    supabaseClient
      .from("crm_data")
      .upsert({
        user_id: currentUser.id,
        data: cloudPayload(),
        updated_at: new Date().toISOString(),
      }, { onConflict: "user_id" }),
    CLOUD_TIMEOUT_MS
  );
  if (timedOut) {
    setCloudStatus("云端保存超时：当前数据仍在本地，稍后会再试");
    return;
  }
  setCloudStatus(error ? cloudErrorText(error, "保存") : "已同步云端");
  if (error) console.error(error);
}

async function loadCloudData() {
  if (!supabaseClient || !currentUser) return;
  if (cloudLoading || cloudLoadedUserId === currentUser.id) return;
  cloudLoading = true;
  setCloudStatus("云端加载中... 图片多时会慢一点");
  const { data, error, timedOut } = await withTimeout(
    supabaseClient
      .from("crm_data")
      .select("data")
      .eq("user_id", currentUser.id)
      .maybeSingle(),
    CLOUD_TIMEOUT_MS
  );
  if (timedOut) {
    cloudLoading = false;
    setCloudStatus("云端加载超时：先使用本地数据，稍后可刷新重试");
    return;
  }
  if (error) {
    console.error(error);
    setCloudStatus(cloudErrorText(error, "加载"));
    cloudLoading = false;
    return;
  }
  if ((data != null ? data.data : undefined)) {
    state.customers = data.data.customers || [];
    state.inquiries = data.data.inquiries || [];
    state.orders = data.data.orders || [];
    state.companyProfile = { ...defaultCompanyProfile(), ...(data.data.companyProfile || {}) };
    normalizeState(state);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } else {
    setCloudStatus("云端已登录，正在创建你的云端数据...");
    await saveCloudData();
  }
  cloudLoading = false;
  cloudLoadedUserId = currentUser.id;
  setCloudStatus(`云端已登录：${currentUser.email || "Google账号"}`);
  render();
}

async function withTimeout(promise, ms = CLOUD_TIMEOUT_MS) {
  let timer;
  const timeout = new Promise((resolve) => {
    timer = setTimeout(() => resolve({ timedOut: true }), ms);
  });
  const result = await Promise.race([promise, timeout]);
  clearTimeout(timer);
  return result;
}

function cloudErrorText(error, action) {
  const msg = `${(error != null ? error.message : undefined) || ""} ${(error != null ? error.details : undefined) || ""}`;
  if (msg.includes("crm_data") || msg.includes("does not exist") || (error != null ? error.code : undefined) === "42P01") {
    return `云端${action}失败：请先在 Supabase 跑建表 SQL`;
  }
  if (msg.includes("permission") || msg.includes("row-level security") || (error != null ? error.code : undefined) === "42501") {
    return `云端${action}失败：权限策略未生效`;
  }
  return `云端${action}失败：${(error != null ? error.message : undefined) || "未知错误"}`;
}

async function initCloudAuth() {
  if (!supabaseClient) {
    setCloudStatus("未连接云端");
    return;
  }
  const { data } = await supabaseClient.auth.getSession();
  currentUser = (data.session != null ? data.session.user : undefined) || null;
  updateAuthUi();
  if (currentUser) await loadCloudData();
  supabaseClient.auth.onAuthStateChange(async (_event, session) => {
    currentUser = (session != null ? session.user : undefined) || null;
    updateAuthUi();
    if (currentUser) await loadCloudData();
    else {
      cloudLoadedUserId = null;
      setCloudStatus("未登录云端（当前数据只在本地）");
    }
  });
}

function updateAuthUi() {
  (document.getElementById("loginBtn") != null ? document.getElementById("loginBtn").classList : undefined).toggle("hidden", Boolean(currentUser));
  (document.getElementById("signupBtn") != null ? document.getElementById("signupBtn").classList : undefined).toggle("hidden", Boolean(currentUser));
  (document.getElementById("emailLoginInput") != null ? document.getElementById("emailLoginInput").classList : undefined).toggle("hidden", Boolean(currentUser));
  (document.getElementById("passwordLoginInput") != null ? document.getElementById("passwordLoginInput").classList : undefined).toggle("hidden", Boolean(currentUser));
  (document.getElementById("logoutBtn") != null ? document.getElementById("logoutBtn").classList : undefined).toggle("hidden", !currentUser);
  setCloudStatus(currentUser ? `云端已登录：${currentUser.email || "账号"}` : "未登录云端（当前数据只在本地）");
}

function snapshot() {
  undoStack.push(JSON.stringify(state));
  if (undoStack.length > 30) undoStack.shift();
}

function undo() {
  const previous = undoStack.pop();
  if (!previous) return alert("没有可以撤回的操作。");
  const restored = JSON.parse(previous);
  state.customers = restored.customers || [];
  state.inquiries = restored.inquiries || [];
  state.orders = restored.orders || [];
  saveState();
  render();
}

function simpleDate(date) {
  return `${date.getMonth() + 1}.${date.getDate()}`;
}

function toISO(value) {
  if (!value) return "";
  const txt = String(value).trim();
  const now = new Date();
  if (/^\d{1,2}\.\d{1,2}$/.test(txt)) {
    const [m, d] = txt.split(".").map(Number);
    return formatISO(new Date(now.getFullYear(), m - 1, d));
  }
  if (/^\d{4}-\d{1,2}-\d{1,2}$/.test(txt)) {
    const [y, m, d] = txt.split("-").map(Number);
    return formatISO(new Date(y, m - 1, d));
  }
  const parsed = new Date(txt);
  return Number.isNaN(parsed.getTime()) ? "" : formatISO(parsed);
}

function formatISO(date) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function addDays(isoDate, days) {
  const base = isoDate ? new Date(`${isoDate}T00:00:00`) : new Date();
  base.setDate(base.getDate() + Number(days || 0));
  return formatISO(base);
}

function dateCode(isoDate) {
  const date = typeof isoDate === "string" ? new Date(`${isoDate}T00:00:00`) : isoDate;
  return `${String(date.getFullYear()).slice(2)}${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}`;
}

function makeInquiryId(date) {
  const count = state.inquiries.filter((item) => item.date === date).length + 1;
  return `CYC-${dateCode(date)}-${String(count).padStart(3, "0")}`;
}

function makeOrderId(date) {
  return `CYC-${dateCode(date)}`;
}

function daysUntil(isoDate) {
  if (!isoDate) return Infinity;
  return Math.round((new Date(`${isoDate}T00:00:00`) - new Date(`${formatISO(new Date())}T00:00:00`)) / 86400000);
}

function text(value) {
  if (Array.isArray(value) && value[0] && typeof value[0] === "object" && "type" in value[0]) return value.map((row) => `${row.type}: ${row.value}`).join("、");
  return Array.isArray(value) ? value.join("、") : value || "";
}

function escapeHtml(value) {
  return String(value ?? "").replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;").replaceAll('"', "&quot;");
}

function matchesSearch(item, query) {
  return !query || JSON.stringify(item).toLowerCase().includes(query.toLowerCase());
}

function render() {
  document.querySelectorAll(".view").forEach((v) => v.classList.remove("active-view"));
  document.getElementById(currentView).classList.add("active-view");
  // Show/hide date filter for relevant views
  const df = document.getElementById('dateRangeFilter');
  if (df) df.style.display = ['customers','inquiries','orders'].includes(currentView) ? 'flex' : 'none';
  document.querySelectorAll(".nav-btn").forEach((btn) => btn.classList.toggle("active", btn.dataset.view === currentView));
  document.getElementById("viewTitle").textContent = viewMeta[currentView][0];
  document.getElementById("viewSubtitle").textContent = viewMeta[currentView][1];
  document.getElementById("quickAddBtn").textContent = viewMeta[currentView][2];
  renderStats();
  renderCharts();
  renderReminders();
  renderCustomers();
  renderInquiryFilters();
  renderInquiries();
  renderOrders();
  renderFobCalculator();
  renderProducts();
  renderKanban();
  renderReports();
}

function renderStats() {
  document.getElementById("statDue").textContent = getReminders().length;
  document.getElementById("statCustomers").textContent = state.customers.length;
  document.getElementById("statInquiries").textContent = state.inquiries.length;
  document.getElementById("statOrders").textContent = state.orders.length;
}

function countBy(items, getter) {
  const map = {};
  items.forEach((item) => (Array.isArray(getter(item)) ? getter(item) : [getter(item)]).filter(Boolean).forEach((v) => map[v] = (map[v] || 0) + 1));
  return Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 6);
}

function renderCharts() {
  drawBars("countryChart", countBy(state.customers, (item) => item.country || "未填国家"));
  drawBars("productChart", countBy([...state.customers, ...state.inquiries], (item) => item.productCategories || []));
}

function drawBars(id, rows) {
  const box = document.getElementById(id);
  if (!box) return;
  if (!rows.length) return box.innerHTML = `<div class="empty mini">暂无数据</div>`;
  const max = Math.max(...rows.map(([, c]) => c));
  box.innerHTML = rows.map(([label, count]) => `<div class="bar-row"><span>${escapeHtml(label)}</span><div class="bar-track"><i style="width:${Math.max(8, count / max * 100)}%"></i></div><b>${count}</b></div>`).join("");
}

function getReminders() {
  const reminders = [];
  state.customers.forEach((item) => {
    if (CLOSED_STAGES.includes(item.stage)) return;
    const plan = plannedReminder(item, "customer");
    const delta = daysUntil(plan.date);
    if (plan.date && delta <= 7) {
      reminders.push({ recordType: "customer", recordId: item.id, type: "客户跟进", date: plan.date, status: item.stage || item.nature || "未分阶段", customerName: item.name, phone: primaryContact(item), product: text(item.productCategories), action: plan.action, context: plan.reason, delta, auto: plan.auto });
    }
  });
  state.inquiries.forEach((item) => {
    if (CLOSED_STAGES.includes(item.stage)) return;
    const plan = plannedReminder(item, "inquiry");
    const delta = daysUntil(plan.date);
    if (plan.date && delta <= 7) {
      reminders.push({ recordType: "inquiry", recordId: item.id, type: "询盘跟进", date: plan.date, status: item.stage || "新询盘", customerName: item.customerName, phone: primaryContact(item), product: text(item.productCategories), action: plan.action, context: plan.reason, delta, auto: plan.auto });
    }
  });
  state.orders.forEach((item) => {
    const delta = daysUntil(item.deliveryDate);
    if (item.deliveryDate && delta <= 7 && !CLOSED_STAGES.includes(item.status)) {
      reminders.push({ recordType: "order", recordId: item.id, type: "订单交期", date: item.deliveryDate, status: item.status, customerName: item.customerName, phone: primaryContact(item), product: orderProducts(item), action: "确认生产/出货/收款进度", context: item.notes, delta });
    }
  });
  return reminders.sort((a, b) => a.delta - b.delta);
}

function plannedReminder(item, kind) {
  const manual = item.nextFollow;
  if (manual) {
    return {
      date: manual,
      auto: false,
      reason: latestContext(item) || "已手动设置下次跟进日期。",
      action: item.nextAction || item.sendContent || (latestFollow(item) ? latestFollow(item).sendContent : "") || defaultFollowAction(item, kind),
    };
  }
  const baseDate = kind === "customer" ? item.firstContact : item.date;
  if (!baseDate) return { date: "", auto: true, reason: "还没有日期，无法自动安排。", action: defaultFollowAction(item, kind) };
  const days = reminderDays(item);
  return {
    date: addDays(baseDate, days),
    auto: true,
    reason: `${kind === "customer" ? "首次接触" : "询盘"}后按「${item.nature || item.level || "默认"}」自动安排 ${days} 天后跟进。`,
    action: defaultFollowAction(item, kind),
  };
}

function reminderDays(item) {
  const byLevel = LEVEL_PLAN_DAYS[item.level];
  const byNature = FOLLOW_PLAN_DAYS[item.nature];
  const base = Math.min(byLevel || 99, byNature || 99);
  return base === 99 ? 3 : base;
}

function latestContext(item) {
  return (latestFollow(item) && latestFollow(item).content) || item.latestFollowText || item.notes || item.need || "";
}

function defaultFollowAction(item, kind) {
  const product = text(item.productCategories) || text(item.productModels) || "对应产品";
  if (kind === "customer" && (!item.stage || item.stage === "信息已收集" || item.stage === "已联系未回复")) return `发一条简短问候，确认是否需要${product}资料/报价。`;
  if (item.stage === "待推荐") return `根据客户需求推荐${product}型号，并附核心卖点。`;
  if (item.stage === "待报价" || item.stage === "需求确认") return "确认数量、目的港、插头/电压、包装后准备报价。";
  if (item.stage === "已报价") return "追问报价反馈，可补充交期、付款方式和热销型号。";
  if (item.stage === "样品中") return "确认样品是否收到，记录测试反馈。";
  if (item.stage === "谈判中") return "跟进价格、付款、交期三个关键点，推进确认PI。";
  return `继续跟进客户需求，准备${product}资料。`;
}

function renderReminders() {
  const list = document.getElementById("reminderList");
  let rows = getReminders().filter((item) => reminderFilter === "today" ? item.delta === 0 : reminderFilter === "overdue" ? item.delta < 0 : reminderFilter === "week" ? item.delta <= 7 : true);
  renderReminderSummary(rows);
  if (!rows.length) return list.innerHTML = `<div class="empty">今天暂时没有提醒。</div>`;
  list.innerHTML = rows.map((item) => {
    const tone = item.delta < 0 ? "red" : item.delta === 0 ? "amber" : "green";
    const label = item.delta < 0 ? `逾期 ${Math.abs(item.delta)} 天` : item.delta === 0 ? "今天" : `${item.delta} 天后`;
    const meta = [item.phone, item.product].filter(Boolean).map(escapeHtml).join(" · ");
    const quickActions = item.recordType === "order"
      ? `<button class="row-btn" data-edit-type="${item.recordType}" data-edit-id="${item.recordId}" type="button">编辑订单</button>`
      : `<button class="row-btn" data-snooze-type="${item.recordType}" data-snooze-id="${item.recordId}" data-snooze-days="1" type="button">明天跟进</button><button class="row-btn" data-snooze-type="${item.recordType}" data-snooze-id="${item.recordId}" data-snooze-days="3" type="button">3天后跟进</button><button class="row-btn" data-edit-type="${item.recordType}" data-edit-id="${item.recordId}" type="button">编辑跟进</button>`;
    return `<article class="reminder clickable" data-detail-type="${item.recordType}" data-detail-id="${item.recordId}">
      <div><span class="tag ${tone}">${label}</span><p>${item.date}</p>${item.auto ? '<span class="tag soft">自动计划</span>' : ''}</div>
      <div><h4>${escapeHtml(item.customerName)} · ${escapeHtml(item.type)}</h4><p><strong>建议：</strong>${escapeHtml(item.action)}</p><p><strong>原因：</strong>${escapeHtml(item.context || "")}</p>${meta ? `<p>${meta}</p>` : ""}</div>
      <div class="reminder-actions"><span class="tag">${escapeHtml(item.status || "")}</span>${quickActions}</div>
    </article>`;
  }).join("");
}

function renderReminderSummary(rows) {
  const box = document.getElementById("reminderSummary");
  if (!box) return;
  const overdue = rows.filter((x) => x.delta < 0).length;
  const today = rows.filter((x) => x.delta === 0).length;
  const auto = rows.filter((x) => x.auto).length;
  box.innerHTML = `<div class="reminder-summary-card urgent"><span>逾期</span><strong>${overdue}</strong></div>
    <div class="reminder-summary-card today"><span>今天要回</span><strong>${today}</strong></div>
    <div class="reminder-summary-card auto"><span>自动计划</span><strong>${auto}</strong></div>
    <div class="reminder-summary-text">提醒会同时看客户和询盘：优先用你填的“下次跟进”，没填就按客户性质/等级自动排期。</div>`;
}

function renderCustomers() {
  let rows = state.customers.filter((item) => matchesSearch(item, document.getElementById("customerSearch").value));
  rows = rows.filter(item => inDateRange(item, 'firstContact'));
  // Sort
  if (sortState.field) {
    const dir = sortState.dir === 'asc' ? 1 : -1;
    rows = [...rows].sort((a, b) => {
      const va = (a[sortState.field] || '').toString().toLowerCase();
      const vb = (b[sortState.field] || '').toString().toLowerCase();
      if (!isNaN(va) && !isNaN(vb)) return (Number(va) - Number(vb)) * dir;
      return va.localeCompare(vb) * dir;
    });
  }
  document.getElementById("customerList").innerHTML = makeTable(["客户", "类型", "联系人", "首次接触", "国家", "性质", "联系方式", "产品", "下次跟进", "图片", "操作"], rows.map((item) => ({
    _id: item.id,
    0: item.name, 1: item.customerKind, 2: item.personName, 3: item.firstContact, 4: item.country, 5: item.nature, 6: contactSummary(item), 7: text(item.productCategories), 8: item.nextFollow, 9: imageCount(item), 10: actionButtons("customer", item.id)
  })), true, 'customer');
}

function renderInquiryFilters() {
  fillSelect("inquiryStageFilter", "全部阶段", STAGES);
  fillSelect("inquirySourceFilter", "全部来源", SOURCES);
  fillSelect("inquiryProductFilter", "全部产品", PRODUCT_CATEGORIES);
  const filtered = filteredInquiries();
  document.getElementById("inquirySummary").innerHTML = [
    ["筛选结果", filtered.length],
    ["待报价", filtered.filter((x) => x.stage === "待报价").length],
    ["待推荐", filtered.filter((x) => x.stage === "待推荐").length],
    ["已报价", filtered.filter((x) => x.stage === "已报价").length],
  ].map(([label, count]) => `<div class="mini-stat"><span>${label}</span><strong>${count}</strong></div>`).join("");
}

function fillSelect(id, label, options) {
  const el = document.getElementById(id);
  if (!el || el.dataset.ready) return;
  el.innerHTML = `<option value="">${label}</option>${options.map((x) => `<option value="${x}">${x}</option>`).join("")}`;
  el.dataset.ready = "1";
}

function filteredInquiries() {
  const q = (document.getElementById("inquirySearch") != null ? document.getElementById("inquirySearch").value : undefined) || "";
  const stage = (document.getElementById("inquiryStageFilter") != null ? document.getElementById("inquiryStageFilter").value : undefined) || "";
  const source = (document.getElementById("inquirySourceFilter") != null ? document.getElementById("inquirySourceFilter").value : undefined) || "";
  const product = (document.getElementById("inquiryProductFilter") != null ? document.getElementById("inquiryProductFilter").value : undefined) || "";
  return state.inquiries.filter((item) => matchesSearch(item, q) && (!stage || item.stage === stage) && (!source || item.source === source) && (!product || (item.productCategories || []).includes(product)));
}

function renderInquiries() {
  let rows = filteredInquiries();
  rows = rows.filter(item => inDateRange(item, 'date'));
  if (sortState.field) {
    const dir = sortState.dir === 'asc' ? 1 : -1;
    rows = [...rows].sort((a, b) => {
      const va = (a[sortState.field] || '').toString().toLowerCase();
      const vb = (b[sortState.field] || '').toString().toLowerCase();
      if (!isNaN(va) && !isNaN(vb)) return (Number(va) - Number(vb)) * dir;
      return va.localeCompare(vb) * dir;
    });
  }
  if (!activeInquiryId && rows[0]) activeInquiryId = rows[0].id;
  const focus = state.inquiries.find((item) => item.id === activeInquiryId) || rows[0];
  renderInquiryFocus(focus);
  document.getElementById("inquiryList").innerHTML = makeTable(["询盘号", "日期", "客户", "阶段", "国家", "来源", "产品", "需求", "下次跟进", "跟进数", "操作"], rows.map((item) => ({
    _id: item.id, 0: item.id, 1: item.date, 2: item.customerName, 3: item.stage, 4: item.country, 5: item.source, 6: text(item.productCategories), 7: item.need, 8: item.nextFollow, 9: (item.follows != null ? item.follows.length : undefined) || 0, 10: `<div class="row-actions"><button class="row-btn" data-focus-inquiry="${item.id}">查看跟进</button>${actionButtons("inquiry", item.id)}</div>`
  })), true, 'inquiry');
}

function renderInquiryFocus(item) {
  const box = document.getElementById("inquiryFocus");
  if (!box) return;
  if (!item) return box.innerHTML = `<div class="empty">筛选后没有询盘。</div>`;
  const follows = item.follows || [];
  box.innerHTML = `<div class="focus-head"><div><h3>${escapeHtml(item.customerName)} · ${escapeHtml(item.stage || "未填阶段")}</h3><p>${escapeHtml(item.id)} · ${escapeHtml(item.source || "")} · ${escapeHtml(text(item.productCategories))}</p></div><button class="primary-btn" data-add-follow="${item.id}" type="button">新增跟进</button></div>
    <div class="timeline">${follows.length ? follows.map((f) => `<div class="timeline-item"><b>${escapeHtml(f.date)}</b><p>${escapeHtml(f.content)}</p><small>要发：${escapeHtml(f.sendContent || "")} · 下次：${escapeHtml(f.nextFollow || "")}</small></div>`).join("") : "<p>还没有跟进记录。</p>"}</div>`;
}

function renderOrders() {
  let rows = state.orders.filter((item) => matchesSearch(item, document.getElementById("orderSearch").value));
  rows = rows.filter(item => inDateRange(item, 'piDate'));
  if (sortState.field) {
    const dir = sortState.dir === 'asc' ? 1 : -1;
    rows = [...rows].sort((a, b) => {
      const va = (a[sortState.field] || '').toString().toLowerCase();
      const vb = (b[sortState.field] || '').toString().toLowerCase();
      if (!isNaN(va) && !isNaN(vb)) return (Number(va) - Number(vb)) * dir;
      return va.localeCompare(vb) * dir;
    });
  }
  if (!activeOrderId && rows[0]) activeOrderId = rows[0].id;
  const active = state.orders.find((item) => item.id === activeOrderId) || rows[0];
  renderPiPreview(active);
  document.getElementById("orderList").innerHTML = makeTable(["PI编号", "日期", "客户", "产品", "金额", "运费", "状态", "交期", "操作"], rows.map((item) => ({
    _id: item.id, 0: item.id, 1: item.piDate, 2: item.customerName, 3: orderProducts(item), 4: money(orderTotal(item), item.currency), 5: item.freight || "", 6: item.status, 7: item.deliveryDate, 8: `<div class="row-actions"><button class="row-btn" data-preview-order="${item.id}">预览PI</button>${actionButtons("order", item.id)}</div>`
  })), true, 'order');
}

function renderProducts() {
  const search = document.getElementById("productSearch");
  const filter = document.getElementById("productCategoryFilter");
  if (!search || !filter) return;
  if (!filter.dataset.ready) {
    filter.innerHTML = `<option value="">全部产品大类</option>${PRODUCT_CATEGORIES.map((x) => `<option value="${x}">${x}</option>`).join("")}`;
    filter.dataset.ready = "1";
  }
  let rows = PRODUCT_CATALOG.filter((item) => matchesSearch(item, search.value) && (!filter.value || item.category === filter.value));
  if (sortState.field) {
    const dir = sortState.dir === 'asc' ? 1 : -1;
    rows = [...rows].sort((a, b) => {
      const va = (a[sortState.field] || '').toString().toLowerCase();
      const vb = (b[sortState.field] || '').toString().toLowerCase();
      if (!isNaN(va) && !isNaN(vb)) return (Number(va) - Number(vb)) * dir;
      return va.localeCompare(vb) * dir;
    });
  }
  document.getElementById("productList").innerHTML = makeTable(["产品大类", "型号/小类", "内容", "状态", "跨境电商", "国外大客户", "国外中小批发商", "国外C端零售商", "成本底价", "详情"], rows.map((item) => ({
    _id: item.model, 0: item.category, 1: item.model, 2: item.spec, 3: item.status, 4: item.crossBorder, 5: item.overseas, 6: item.wholesale, 7: item.terminal, 8: item.floor, 9: `<button class="row-btn" data-product-detail="${escapeHtml(item.model)}">详情</button>`
  })), true, 'product');
}

function renderFobCalculator() {
  const box = document.getElementById("fobCalculator");
  if (!box || box.dataset.ready) return;
  const fields = [
    ["calcProduct", "选择产品", ""],
    ["quoteMode", "报价模式", "FOB整柜"],
    ["containerType", "柜型", "20GP"],
    ["factoryPrice", "出厂价/个", 528],
    ["factoryTaxType", "出厂价类型", "含税"],
    ["pcsPerBox", "包装个/箱", 1],
    ["boxCount", "箱数", 1],
    ["grossWeight", "毛重KG/箱", 14.8],
    ["cbmPerBox", "体积CBM/箱", 0.1125],
    ["inlandFreight", "陆运费/柜 RMB", 2000],
    ["portFee", "港口+报关费 RMB", 3100],
    ["exchangeRate", "汇率", 6.8],
    ["profitRate", "利润率%", 5],
    ["seaFreight", "海运费 USD/柜", 0],
    ["airFreightTotal", "空运/快递总费用 RMB", 0],
    ["foreignSeaFreight", "国外段海运+清关 USD/柜", 0],
    ["vatRate", "增值税率%", 13],
  ];
  box.innerHTML = fields.map(([key, label, value]) => {
    if (key === "calcProduct") return `<label class="calc-field">${label}<select data-calc="${key}"><option value="">手动填写</option>${PRODUCT_CATALOG.map((item) => `<option value="${escapeHtml(item.model)}">${escapeHtml(item.category)} / ${escapeHtml(item.model)}</option>`).join("")}</select></label>`;
    if (key === "quoteMode") return `<label class="calc-field">${label}<select data-calc="${key}"><option>FOB整柜</option><option>C端空运</option><option>B端海运整柜</option><option>CFR整柜</option></select></label>`;
    if (key === "containerType") return `<label class="calc-field">${label}<select data-calc="${key}">${Object.keys(CONTAINER_TYPES).map((x) => `<option>${x}</option>`).join("")}</select></label>`;
    if (key === "factoryTaxType") return `<label class="calc-field">${label}<select data-calc="${key}"><option>含税</option><option>不含税</option></select></label>`;
    return `<label class="calc-field">${label}<input data-calc="${key}" type="number" step="0.0001" value="${value}"></label>`;
  }).join("");
  box.dataset.ready = "1";
  box.querySelectorAll("input").forEach((input) => input.addEventListener("input", calculateFob));
  box.querySelectorAll("select").forEach((input) => input.addEventListener("change", () => {
    if (input.dataset.calc === "calcProduct") fillCalcFromProduct(input.value);
    calculateFob();
  }));
  calculateFob();
}

function fillCalcFromProduct(model) {
  if (!model) return;
  const catalog = PRODUCT_CATALOG.find((item) => item.model === model);
  const capacity = String(model).match(/[\d.]+L/)[0] || "";
  const params = PRODUCT_PARAMS.find((item) => item["产品型号"] === model) || PRODUCT_PARAMS.find((item) => String(item["内胆容量"] || "") === capacity);
  const set = (key, value) => {
    const el = document.querySelector(`[data-calc="${key}"]`);
    if (el && value !== undefined && value !== null && value !== "") el.value = value;
  };
  if (catalog) {
    set("factoryPrice", catalog.floor || catalog.crossBorder);
  }
  if (params) {
    set("grossWeight", params["包装重量/kg"]);
    const cbm = cbmFromPacking(params["包装尺寸/mm"]);
    if (cbm) set("cbmPerBox", cbm.toFixed(4));
    const pcs = pcsFromPacking(params["包装尺寸/mm"]);
    if (pcs) set("pcsPerBox", pcs);
  }
}

function cbmFromPacking(value) {
  const nums = (String(value || "").match(/\d+(\.\d+)?/g) != null ? String(value || "").match(/\d+(\.\d+)?/g).map(Number) : undefined);
  if (!nums || nums.length < 3) return null;
  return nums[0] / 1000 * (nums[1] / 1000) * (nums[2] / 1000);
}

function pcsFromPacking(value) {
  const match = String(value || "").match(/(\d+)\s*台装/);
  return match ? Number(match[1]) : 1;
}

function calculateFob() {
  const value = (key) => Number((document.querySelector(`[data-calc="${key}"]`) != null ? document.querySelector(`[data-calc="${key}"]`).value : undefined) || 0);
  const mode = (document.querySelector('[data-calc="quoteMode"]') != null ? document.querySelector('[data-calc="quoteMode"]').value : undefined) || "FOB整柜";
  const containerType = (document.querySelector('[data-calc="containerType"]') != null ? document.querySelector('[data-calc="containerType"]').value : undefined) || "20GP";
  const factoryTaxType = (document.querySelector('[data-calc="factoryTaxType"]') != null ? document.querySelector('[data-calc="factoryTaxType"]').value : undefined) || "含税";
  const factoryPrice = value("factoryPrice");
  const pcsPerBox = value("pcsPerBox") || 1;
  const boxCount = value("boxCount") || 1;
  const grossWeight = value("grossWeight") || 0;
  const cbmPerBox = value("cbmPerBox") || 1;
  const inlandFreight = value("inlandFreight");
  const portFee = value("portFee");
  const exchangeRate = value("exchangeRate") || 1;
  const profitRate = value("profitRate");
  const seaFreight = value("seaFreight");
  const airFreightTotal = value("airFreightTotal");
  const foreignSeaFreight = value("foreignSeaFreight");
  const vatRate = value("vatRate");
  const factoryTaxIncluded = factoryTaxType === "含税" ? factoryPrice : factoryPrice * (1 + vatRate / 100);
  const factoryNoTax = factoryTaxType === "含税" ? factoryPrice / (1 + vatRate / 100) : factoryPrice;
  const containerCbm = CONTAINER_TYPES[containerType] || 28;
  const boxes20gp = containerCbm / cbmPerBox;
  const pcs20gp = boxes20gp * pcsPerBox;
  const totalPcs = boxCount * pcsPerBox;
  const totalCbm = boxCount * cbmPerBox;
  const totalWeight = boxCount * grossWeight;
  const inlandPerPc = inlandFreight / pcs20gp;
  const portPerPc = portFee / pcs20gp;
  const fobRmbCost = factoryTaxIncluded + inlandPerPc + portPerPc;
  const fobUsdQuote = fobRmbCost / exchangeRate * (1 + profitRate / 100);
  const rebateProfit = factoryTaxType === "含税" ? factoryNoTax * pcs20gp * (vatRate / 100) : 0;
  const rebateRatio = rebateProfit / (fobUsdQuote * pcs20gp * exchangeRate);
  const seaPerPc = seaFreight / pcs20gp;
  const cfrUsdQuote = fobUsdQuote + seaPerPc;
  const airPerPc = totalPcs ? airFreightTotal / totalPcs : 0;
  const cAirRmbCost = factoryNoTax + airPerPc;
  const cAirUsdQuote = cAirRmbCost / exchangeRate * (1 + profitRate / 100);
  const foreignSeaPerPcRmb = pcs20gp ? foreignSeaFreight * exchangeRate / pcs20gp : 0;
  const bSeaRmbCost = factoryNoTax + inlandPerPc + portPerPc + foreignSeaPerPcRmb;
  const bSeaUsdQuote = bSeaRmbCost / exchangeRate * (1 + profitRate / 100);
  const modeResult = mode === "C端空运"
    ? [`C端空运成本 RMB/个`, cAirRmbCost, `C端空运报价 USD/个`, cAirUsdQuote]
    : mode === "B端海运整柜"
      ? [`B端海运成本 RMB/个`, bSeaRmbCost, `B端海运报价 USD/个`, bSeaUsdQuote]
      : mode === "CFR整柜"
        ? [`CFR成本/报价 USD/个`, cfrUsdQuote, `海运摊到每个 USD/个`, seaPerPc]
        : [`FOB成本 RMB/个`, fobRmbCost, `FOB报价 USD/个`, fobUsdQuote];
  document.getElementById("fobResult").innerHTML = `
    <div><span>当前模式</span><strong>${escapeHtml(mode)}</strong></div>
    <div><span>柜型/估算体积</span><strong>${containerType} / ${containerCbm} CBM</strong></div>
    <div><span>出厂价判断</span><strong>${factoryTaxType} ｜ 含税成本 ${factoryTaxIncluded.toFixed(2)} / 不含税 ${factoryNoTax.toFixed(2)}</strong></div>
    <div><span>${modeResult[0]}</span><strong>${Number(modeResult[1]).toFixed(2)}</strong></div>
    <div><span>${modeResult[2]}</span><strong>${Number(modeResult[3]).toFixed(2)}</strong></div>
    <div><span>总数量/个</span><strong>${totalPcs.toFixed(0)}</strong></div>
    <div><span>总体积CBM</span><strong>${totalCbm.toFixed(3)}</strong></div>
    <div><span>总毛重KG</span><strong>${totalWeight.toFixed(2)}</strong></div>
    <div><span>${containerType}可装箱数</span><strong>${boxes20gp.toFixed(0)}</strong></div>
    <div><span>${containerType}可装个数</span><strong>${pcs20gp.toFixed(0)}</strong></div>
    <div><span>FOB成本 RMB/个</span><strong>${fobRmbCost.toFixed(2)}</strong></div>
    <div><span>FOB报价 USD/个</span><strong>${fobUsdQuote.toFixed(2)}</strong></div>
    <div><span>空运摊到每个 RMB</span><strong>${airPerPc.toFixed(2)}</strong></div>
    <div><span>国外海运清关摊到每个 RMB</span><strong>${foreignSeaPerPcRmb.toFixed(2)}</strong></div>
    <div><span>退税利润/柜</span><strong>${rebateProfit.toFixed(2)} RMB</strong></div>
    <div><span>退税占销售比例</span><strong>${(rebateRatio * 100).toFixed(2)}%</strong></div>
    <div><span>CFR报价 USD/个</span><strong>${cfrUsdQuote.toFixed(2)}</strong></div>
  `;
}

function renderPiPreview(order) {
  const box = document.getElementById("piPreview");
  if (!box) return;
  if (!order) return box.innerHTML = `<div class="empty">新建订单后，这里会预览 PI。</div>`;
  const total = orderTotal(order);
  const items = orderLineItems(order);
  const seller = state.companyProfile || defaultCompanyProfile();
  box.innerHTML = `<div class="pi-paper">
    <div class="pi-company"><h3>${escapeHtml(seller.cnName)}</h3><h4>${escapeHtml(seller.enName)}</h4><p>${escapeHtml(seller.address)}</p></div>
    <h2>PROFORMA INVOICE</h2>
    <div class="pi-grid"><div><b>BUYER:</b><p>${escapeHtml(order.customerName)}</p><b>ADDRESS:</b><p>${escapeHtml(order.customerInfo || "")}</p></div><div><b>DATE:</b><p>${escapeHtml(order.piDate)}</p><b>INVOICE NO:</b><p>${escapeHtml(order.piNo || order.id)}</p><b>PAYMENT:</b><p>${escapeHtml(order.payment || ORDER_DEFAULTS.payment)}</p></div><div><b>INCOTERM:</b><p>${escapeHtml(order.incoterm || ORDER_DEFAULTS.incoterm)}</p></div><div><b>SHIPMENT:</b><p>${escapeHtml(order.portLoading || "")}${order.portDischarge ? ` TO ${escapeHtml(order.portDischarge)}` : ""}</p></div><div><b>SELLER ADDRESS:</b><p>${escapeHtml(seller.address)}</p></div><div><b>CURRENCY:</b><p>${escapeHtml(order.currency || "USD")}</p></div></div>
    <table class="pi-table"><thead><tr><th>ITEM</th><th>Packing Size(mm)</th><th>Gross Weight</th><th>PHOTO</th><th>MODEL NO.</th><th>QTY</th><th>UNIT PRICE</th><th>TOTAL</th></tr></thead><tbody>${items.map((it) => `<tr><td>${escapeHtml(it.description)}</td><td>${escapeHtml(it.size)}</td><td>${escapeHtml(it.weight ? `${it.weight} KGS` : "")}</td><td></td><td>${escapeHtml(it.model || it.description)}</td><td>${escapeHtml(it.qty)}</td><td>${escapeHtml(it.unitPrice)}</td><td>${money(lineAmount(it), "")}</td></tr>`).join("")}<tr><td colspan="5"><b>ORDER VALUE</b></td><td>${sum(items, "qty")}</td><td></td><td>${money(total - Number(order.freight || 0), "")}</td></tr><tr><td colspan="7"><b>FREIGHT</b></td><td>${money(Number(order.freight || 0), "")}</td></tr><tr><td colspan="7"><b>TOTAL AMOUNT</b></td><td>${money(total, "")}</td></tr></tbody></table>
    <p><b>SAY USD:</b> ${money(total, order.currency || "USD")}</p>
    <p><b>DELIVERY TIME:</b> ${escapeHtml(order.delivery || "")}</p><p><b>PARTIAL SHIPMENT:</b> ${escapeHtml(order.partialShipment || "")}</p>
    <div class="pi-bank"><p><b>PAYMENT ACCOUNT</b></p><p>Beneficiary's Bank: <b>${escapeHtml(seller.bankName)}</b></p><p>Bank Account: <b>${escapeHtml(seller.bankAccount)}</b></p><p>Bank Address: ${escapeHtml(seller.bankAddress)}</p><p>SWIFT Code: <b>${escapeHtml(seller.swift)}</b></p><p>Beneficiary's Name: <b>${escapeHtml(seller.enName)}</b></p><p>Beneficiary's Address: ${escapeHtml(seller.address)}</p></div>
    <div class="pi-sign"><p>For Seller:</p><p>${escapeHtml(seller.enName)}</p><p>Authorized Signature:</p><p>${escapeHtml(seller.enName)}</p></div>
  </div>`;
}

function makeTable(headers, rows, sortable = false, type = null) {
  if (!rows.length) return `<div class="empty">还没有数据，先新增一条。</div>`;
  const cbCol = bulkSelected.size > 0 && type ? `<th class="cb-cell"><input type="checkbox" onchange="toggleAllBulk('${type}', this.checked)" id="bulkAll_${type}"></th>` : '';
  const headerRow = headers.map((h, i) => {
    const cls = sortable ? 'sortable' : '';
    const onclick = sortable ? `onclick="sortAndRender('${type}', ${i})"` : '';
    return `<th class="${cls}" ${onclick}>${escapeHtml(h)}</th>`;
  }).join('');
  const bodyRows = rows.map((row) => {
    const id = row._id || '';
    const cells = Array.isArray(row) ? row : Object.keys(row).filter(k => k !== '_id').sort((a,b) => Number(a)-Number(b)).map(k => row[k]);
    const cbCell = bulkSelected.size > 0 && type && id ? `<td class="cb-cell"><input type="checkbox" ${bulkSelected.has(`${type}:${id}`) ? 'checked' : ''} onchange="toggleBulkSelect('${type}', '${id}')"></td>` : '';
    return `<tr>${cbCell}${cells.map((cell) => `<td>${cell ?? ''}</td>`).join('')}</tr>`;
  }).join('');
  return `<table><thead><tr>${cbCol}${headerRow}</tr></thead><tbody>${bodyRows}</tbody></table>`;
}

function sortAndRender(type, fieldIdx) {
  // Map field index to actual field name based on type
  const fieldMap = {
    customer: ['name','customerKind','personName','firstContact','country','nature','contacts','productCategories','nextFollow'],
    inquiry: ['id','date','customerName','stage','country','source','productCategories','need','nextFollow'],
    order: ['id','piDate','customerName','items','total','freight','status','deliveryDate']
  };
  const fields = fieldMap[type] || [];
  const field = fields[fieldIdx];
  if (!field || !sortState) return;
  if (sortState.field === field) {
    sortState.dir = sortState.dir === 'asc' ? 'desc' : 'asc';
  } else {
    sortState.field = field;
    sortState.dir = 'asc';
  }
  render();
}

function toggleAllBulk(type, checked) {
  const list = collectionFor(type);
  list.forEach(item => {
    const key = `${type}:${item.id}`;
    if (checked) bulkSelected.add(key);
    else bulkSelected.delete(key);
  });
  updateBulkBar();
  render();
}

function actionButtons(type, id) {
  return `<button class="row-btn" data-detail-type="${type}" data-detail-id="${id}" type="button">查看</button><button class="row-btn" data-edit-type="${type}" data-edit-id="${id}" type="button">编辑</button><button class="row-btn danger" data-delete-type="${type}" data-delete-id="${id}" type="button">删除</button>`;
}

function openForm(type, id = null, seed = {}) {
  editing = { type, id };
  const record = id ? findRecord(type, id) : { ...(type === "order" ? ORDER_DEFAULTS : {}), ...seed };
  document.getElementById("dialogTitle").textContent = `${id ? "编辑" : "新增"}${labelFor(type)}`;
  document.getElementById("formFields").innerHTML = schemas[type].map((field) => fieldHtml(field, record)).join("") + attachmentFieldHtml(record);
  document.getElementById("formDialog").showModal();
  bindFormHelpers();
  bindKindVisibility();
}

function fieldHtml([key, label, kind, required, options, placeholder, className], record = {}) {
  const value = record[key] ?? (kind === "orderItems" ? (record.items || []) : kind === "multi" ? [] : "");
  const req = required ? "required" : "";
  const cls = className ? ` ${className}` : "";
  if (kind === "textarea") return `<div class="field wide${cls}"><label>${label}</label><textarea name="${key}" placeholder="${escapeHtml(placeholder || "")}">${escapeHtml(value)}</textarea></div>`;
  if (kind === "select") return `<div class="field${cls}"><label>${label}</label><select name="${key}" ${req}><option value="">未选择</option>${options.map((x) => `<option value="${x}" ${x === value ? "selected" : ""}>${x}</option>`).join("")}</select></div>`;
  if (kind === "multi") {
    const selected = Array.isArray(value) ? value : [];
    return `<div class="field wide${cls}"><label>${label}</label><div class="multi-box">${options.map((x) => `<label class="check-pill"><input type="checkbox" name="${key}" value="${escapeHtml(x)}" ${selected.includes(x) ? "checked" : ""}>${escapeHtml(x)}</label>`).join("")}</div></div>`;
  }
  if (kind === "contacts") {
    const rows = Array.isArray(value) && value.length ? value : [{ type: "WhatsApp", value: "" }];
    return `<div class="field wide${cls}"><label>${label}</label><div class="contact-editor" id="contactEditor">${rows.map(contactRowHtml).join("")}<button class="ghost-btn mini-btn" id="addContactBtn" type="button">新增联系方式</button></div></div>`;
  }
  if (kind === "orderItems") {
    const rows = Array.isArray(value) && value.length ? value : [{ description: "", size: "", qty: "", weight: "", unitPrice: "" }];
    return `<div class="field wide"><label>${label}</label><div class="order-item-editor" id="orderItemEditor">${rows.map(orderItemRowHtml).join("")}<button class="ghost-btn mini-btn" id="addOrderItemBtn" type="button">新增产品行</button></div></div>`;
  }
  return `<div class="field${cls}"><label>${label}</label><input name="${key}" type="${kind}" value="${escapeHtml(value)}" ${req} placeholder="${escapeHtml(placeholder || "")}"></div>`;
}

function contactRowHtml(row = {}) {
  return `<div class="contact-row"><select name="contactType">${CONTACT_TYPES.map((x) => `<option value="${x}" ${row.type === x ? "selected" : ""}>${x}</option>`).join("")}</select><input name="contactValue" value="${escapeHtml(row.value || "")}" placeholder="填写账号/号码/邮箱"><button class="row-btn danger" data-remove-contact type="button">删除</button></div>`;
}

function orderItemRowHtml(row = {}) {
  return `<div class="order-item-row"><input name="itemDescription" value="${escapeHtml(row.description || "")}" placeholder="产品描述"><input name="itemSize" value="${escapeHtml(row.size || "")}" placeholder="SIZE"><input name="itemQty" type="number" value="${escapeHtml(row.qty || "")}" placeholder="数量"><input name="itemWeight" type="number" value="${escapeHtml(row.weight || "")}" placeholder="重量"><input name="itemUnitPrice" type="number" step="0.01" value="${escapeHtml(row.unitPrice || "")}" placeholder="单价"><button class="row-btn danger" data-remove-item type="button">删除</button></div>`;
}

function attachmentFieldHtml(record = {}) {
  const chat = record.chatImages || [];
  const profile = [...(record.profileImages || []), ...(record.attachments || [])];
  return `<div class="field wide"><label>聊天图片</label><div class="image-drop" data-image-zone="chat" tabindex="0"><input data-image-input="chat" type="file" accept="image/*" multiple><p>聊天截图放这里，可文件添加，也可 Ctrl+V 粘贴。</p><div data-image-preview="chat" class="image-preview">${chat.map(imageThumb).join("")}</div></div></div>
  <div class="field wide"><label>资料图片</label><div class="image-drop" data-image-zone="profile" tabindex="0"><input data-image-input="profile" type="file" accept="image/*" multiple><p>客户资料、网站截图、名片、PI截图放这里。</p><div data-image-preview="profile" class="image-preview">${profile.map(imageThumb).join("")}</div></div></div>`;
}

function imageThumb(item) {
  const name = escapeHtml(item.name || "截图");
  const src = escapeHtml(item.dataUrl || "");
  return `<figure class="thumb"><button class="thumb-button" data-image-view="${src}" data-image-name="${name}" type="button" title="点击放大查看"><img src="${src}" alt="${name}"></button><figcaption>${name}</figcaption></figure>`;
}

function bindFormHelpers() {
  document.querySelectorAll("[data-image-input]").forEach((input) => input.addEventListener("change", () => addFiles([...input.files], input.dataset.imageInput)));
  document.querySelectorAll("[data-image-zone]").forEach((zone) => zone.addEventListener("paste", (e) => {
    const files = [...e.clipboardData.files].filter((f) => f.type.startsWith("image/"));
    if (files.length) { e.preventDefault(); addFiles(files, zone.dataset.imageZone); }
  }));
  (document.getElementById("addContactBtn") != null ? document.getElementById("addContactBtn").addEventListener("click", () => document.getElementById("addContactBtn").insertAdjacentHTML("beforebegin", contactRowHtml())) : undefined);
  (document.getElementById("addOrderItemBtn") != null ? document.getElementById("addOrderItemBtn").addEventListener("click", () => document.getElementById("addOrderItemBtn").insertAdjacentHTML("beforebegin", orderItemRowHtml())) : undefined);
  ["firstContactInput", "dateInput", "nextFollowInput", "piDateInput", "deliveryInput"].forEach((name) => {
    const input = document.querySelector(`[name="${name}"]`);
    if (!input) return;
    input.addEventListener("blur", () => {
      const iso = toISO(input.value);
      if (iso) input.value = iso;
    });
  });
}

function bindKindVisibility() {
  const select = document.querySelector('[name="customerKind"]');
  if (!select) return;
  const sync = () => document.querySelectorAll(".company-only").forEach((el) => el.style.display = select.value === "个人" ? "none" : "");
  select.addEventListener("change", sync);
  sync();
}

function addFiles(files, kind) {
  const preview = document.querySelector(`[data-image-preview="${kind}"]`);
  files.filter((file) => file.type.startsWith("image/")).forEach((file) => {
    const reader = new FileReader();
    reader.onload = () => {
      const fig = document.createElement("figure");
      fig.className = "thumb";
      fig.dataset.newAttachment = "1";
      fig.dataset.imageKind = kind;
      fig.dataset.name = file.name || "截图";
      fig.dataset.dataUrl = reader.result;
      fig.innerHTML = imageThumb({ name: file.name || "截图", dataUrl: reader.result }).replace('<figure class="thumb">', '').replace('</figure>', '');
      preview.appendChild(fig);
    };
    reader.readAsDataURL(file);
  });
}

function formToObject(formEl) {
  const data = {};
  const form = new FormData(formEl);
  for (const [key, value] of form.entries()) {
    if (["contactType", "contactValue", "itemDescription", "itemSize", "itemQty", "itemWeight", "itemUnitPrice"].includes(key)) continue;
    if (data[key]) data[key] = Array.isArray(data[key]) ? [...data[key], value] : [data[key], value];
    else data[key] = value;
  }
  ["productCategories", "productModels"].forEach((key) => { if (!data[key]) data[key] = []; if (!Array.isArray(data[key])) data[key] = [data[key]]; });
  data.contacts = [...document.querySelectorAll(".contact-row")].map((row) => ({ type: row.querySelector('[name="contactType"]').value, value: row.querySelector('[name="contactValue"]').value.trim() })).filter((x) => x.value);
  data.items = [...document.querySelectorAll(".order-item-row")].map((row) => ({ description: row.querySelector('[name="itemDescription"]').value, size: row.querySelector('[name="itemSize"]').value, qty: Number(row.querySelector('[name="itemQty"]').value || 0), weight: Number(row.querySelector('[name="itemWeight"]').value || 0), unitPrice: Number(row.querySelector('[name="itemUnitPrice"]').value || 0) })).filter((x) => x.description || x.qty);
  const old = editing.id ? findRecord(editing.type, editing.id) || {} : {};
  data.chatImages = [...(old.chatImages || []), ...newImages("chat")];
  data.profileImages = [...(old.profileImages || []), ...(old.attachments || []), ...newImages("profile")];
  data.attachments = [];
  return data;
}

function newImages(kind) {
  return [...document.querySelectorAll(`[data-new-attachment][data-image-kind="${kind}"]`)].map((el) => ({ name: el.dataset.name, dataUrl: el.dataset.dataUrl }));
}

function saveForm(e) {
  e.preventDefault();
  snapshot();
  const data = formToObject(e.target);
  normalizeRecord(editing.type, data);
  if (editing.id) {
    const list = collectionFor(editing.type);
    const idx = list.findIndex((x) => x.id === editing.id);
    list[idx] = { ...list[idx], ...data };
  } else {
    data.id = editing.type === "inquiry" ? makeInquiryId(data.date) : editing.type === "order" ? makeOrderId(data.piDate) : crypto.randomUUID();
    collectionFor(editing.type).push(data);
  }
  if (editing.type === "customer") syncInquiryFromCustomer(data);
  if (editing.type === "inquiry") syncCustomerFromInquiry(data);
  if (editing.type === "inquiry") activeInquiryId = data.id;
  if (editing.type === "order") activeOrderId = data.id;
  saveState();
  document.getElementById("formDialog").close();
  render();
}

function normalizeRecord(type, data) {
  if (type === "customer") {
    data.firstContact = toISO(data.firstContactInput);
    data.firstContactInput = data.firstContact || data.firstContactInput;
    data.nextFollow = toISO(data.nextFollowInput);
    if (data.nextFollow) data.nextFollowInput = data.nextFollow;
    data.phone = primaryContact(data);
    data.email ||= contactByType(data, "邮箱");
    data.name ||= data.companyName || data.personName;
  }
  if (type === "inquiry") {
    data.date = toISO(data.dateInput) || formatISO(new Date());
    data.dateInput = data.date;
    data.nextFollow = toISO(data.nextFollowInput);
    if (data.nextFollow) data.nextFollowInput = data.nextFollow;
    data.stage ||= "新询盘";
    data.phone = primaryContact(data);
    data.email ||= contactByType(data, "邮箱");
    data.follows = mergeFollow(editing.id ? (findRecord("inquiry", editing.id) != null ? findRecord("inquiry", editing.id).follows : undefined) : [], data);
  }
  if (type === "order") {
    data.piDate = toISO(data.piDateInput) || formatISO(new Date());
    data.deliveryDate = toISO(data.deliveryInput);
    data.orderItems = data.items;
    data.portLoading ||= ORDER_DEFAULTS.portLoading;
    data.payment ||= ORDER_DEFAULTS.payment;
    data.incoterm ||= ORDER_DEFAULTS.incoterm;
    data.delivery ||= ORDER_DEFAULTS.delivery;
    data.partialShipment ||= ORDER_DEFAULTS.partialShipment;
    data.currency ||= ORDER_DEFAULTS.currency;
    data.status ||= ORDER_DEFAULTS.status;
    data.payStatus ||= ORDER_DEFAULTS.payStatus;
    data.phone = primaryContact(data);
  }
}

function mergeFollow(old = [], data) {
  if (!data.latestFollowText && !data.sendContent && !data.nextFollow) return old || [];
  return [...(old || []), { id: crypto.randomUUID(), date: data.date, content: data.latestFollowText || data.need || "", sendContent: data.sendContent || "", nextFollow: data.nextFollow || "" }];
}

function syncInquiryFromCustomer(customer) {
  if (!["已回复", "有询盘", "已报价"].includes(customer.stage)) return;
  const existing = state.inquiries.find((x) => x.customerRef === customer.id);
  const date = customer.firstContact || formatISO(new Date());
  const inquiry = { ...(existing || {}), customerRef: customer.id, id: (existing != null ? existing.id : undefined) || makeInquiryId(date), dateInput: customer.firstContactInput, date, customerName: customer.name, customerKind: customer.customerKind, companyName: customer.companyName, personName: customer.personName, position: customer.position, contacts: customer.contacts || [], country: customer.country, nature: customer.nature, source: customer.source, stage: customer.stage === "已报价" ? "已报价" : "已回复", level: customer.level, productCategories: customer.productCategories || [], productModels: customer.productModels || [], need: customer.nextAction, sendContent: customer.nextAction, nextFollowInput: customer.nextFollowInput, nextFollow: customer.nextFollow, notes: customer.notes, chatImages: customer.chatImages || [], profileImages: customer.profileImages || [] };
  if (existing) Object.assign(existing, inquiry); else state.inquiries.push(inquiry);
}

function syncCustomerFromInquiry(inquiry) {
  const existing = state.customers.find((x) => samePerson(x, inquiry));
  const customer = { ...(existing || {}), id: (existing != null ? existing.id : undefined) || crypto.randomUUID(), name: inquiry.customerName, customerKind: inquiry.customerKind, companyName: inquiry.companyName, personName: inquiry.personName, position: inquiry.position, contacts: inquiry.contacts || (existing != null ? existing.contacts : undefined) || [], firstContactInput: (existing != null ? existing.firstContactInput : undefined) || inquiry.dateInput, firstContact: (existing != null ? existing.firstContact : undefined) || inquiry.date, country: inquiry.country, nature: inquiry.nature, source: inquiry.source, level: inquiry.level, productCategories: inquiry.productCategories || [], productModels: inquiry.productModels || [], nextFollowInput: inquiry.nextFollowInput, nextFollow: inquiry.nextFollow, nextAction: inquiry.sendContent || inquiry.need, notes: inquiry.notes, chatImages: inquiry.chatImages || (existing != null ? existing.chatImages : undefined) || [], profileImages: inquiry.profileImages || (existing != null ? existing.profileImages : undefined) || [] };
  if (existing) Object.assign(existing, customer); else state.customers.push(customer);
  inquiry.customerRef = customer.id;
}

function samePerson(customer, inquiry) {
  return Boolean((primaryContact(customer) && primaryContact(customer) === primaryContact(inquiry)) || (customer.name && customer.name === inquiry.customerName));
}

function primaryContact(item) {
  return contactByType(item, "WhatsApp") || contactByType(item, "微信") || contactByType(item, "电话") || contactByType(item, "邮箱") || "";
}

function contactByType(item, type) {
  return ((item.contacts || []).find((x) => x.type === type) != null ? (item.contacts || []).find((x) => x.type === type).value : undefined) || "";
}

function latestFollow(item) {
  const follows = item.follows || [];
  return follows[follows.length - 1];
}

function findRecord(type, id) {
  return collectionFor(type).find((x) => x.id === id);
}

function collectionFor(type) {
  return { customer: state.customers, inquiry: state.inquiries, order: state.orders }[type] || state.inquiries;
}

function labelFor(type) {
  return { customer: "客户", inquiry: "询盘", order: "订单" }[type] || "记录";
}

function openDetail(type, id) {
  const record = findRecord(type, id);
  if (!record) return;
  detailTarget = { type, id };
  document.getElementById("detailTitle").textContent = `${labelFor(type)}详情`;
  document.getElementById("detailBody").innerHTML = detailHtml(record);
  document.getElementById("detailDialog").showModal();
}

function openProductDetail(model) {
  const compact = PRODUCT_CATALOG.find((item) => item.model === model);
  const byCapacity = compact ? PRODUCT_PARAMS.find((item) => String(item["内胆容量"] || "").includes(String(compact.model).match(/[\d.]+L/)[0] || "")) : null;
  const byModel = PRODUCT_PARAMS.find((item) => item["产品型号"] === model);
  const record = byModel || byCapacity;
  detailTarget = null;
  document.getElementById("detailTitle").textContent = `${model} 产品参数`;
  if (!record) {
    document.getElementById("detailBody").innerHTML = `<div class="empty">这个型号暂时没有详细参数，可先看产品价格表。</div>`;
  } else {
    document.getElementById("detailBody").innerHTML = productDetailHtml(record, "cn");
  }
  document.getElementById("detailDialog").showModal();
}

function openImageViewer(src, name = "图片") {
  const dialog = document.getElementById("imageDialog");
  const img = document.getElementById("imageDialogImg");
  const title = document.getElementById("imageDialogTitle");
  if (!dialog || !img) return;
  title.textContent = name || "图片";
  img.src = src;
  img.alt = name || "图片";
  dialog.showModal();
}

function openCompanyDialog() {
  const profile = state.companyProfile || defaultCompanyProfile();
  const fields = [
    ["cnName", "中文公司名"],
    ["enName", "英文公司名"],
    ["address", "公司地址"],
    ["bankName", "收款银行"],
    ["bankAccount", "银行账号"],
    ["bankAddress", "银行地址"],
    ["swift", "SWIFT Code"],
  ];
  document.getElementById("companyFields").innerHTML = fields.map(([key, label]) => {
    const value = escapeHtml(profile[key] || "");
    const field = key === "address" || key === "bankAddress"
      ? `<textarea name="${key}">${value}</textarea>`
      : `<input name="${key}" value="${value}">`;
    return `<div class="field ${key === "address" || key === "bankAddress" ? "wide" : ""}"><label>${label}</label>${field}</div>`;
  }).join("");
  document.getElementById("companyDialog").showModal();
}

function saveCompanyProfile(e) {
  e.preventDefault();
  snapshot();
  const form = new FormData(e.target);
  state.companyProfile = { ...defaultCompanyProfile() };
  for (const key of ["cnName", "enName", "address", "bankName", "bankAccount", "bankAddress", "swift"]) {
    state.companyProfile[key] = String(form.get(key) || "").trim();
  }
  saveState();
  document.getElementById("companyDialog").close();
  render();
}

function productDetailHtml(record, lang = "cn") {
  const entries = Object.entries(record);
  const buttons = `<div class="detail-toolbar"><button class="row-btn" data-product-lang="cn" type="button">中文</button><button class="row-btn" data-product-lang="en" type="button">English</button></div>`;
  const rows = entries.map(([key, value]) => {
    const label = lang === "en" ? productFieldEn(key) : key;
    const val = lang === "en" ? productValueEn(key, value) : value;
    return `<div class="detail-row"><span>${escapeHtml(label)}</span><strong>${escapeHtml(val)}</strong></div>`;
  }).join("");
  window.__lastProductDetail = record;
  return buttons + rows;
}

function productFieldEn(key) {
  const map = {
    "产品型号": "Model",
    "内胆容量": "Inner Pot Capacity",
    "额定电压/功率": "Rated Voltage / Power",
    "额定电流(约等于）": "Rated Current (Approx.)",
    "电源线（BS插） / 规格": "Power Cord (BS Plug) / Specification",
    "锅盖 / 厚度（mm）": "Lid Thickness (mm)",
    "材料  不锈钢": "Material / Stainless Steel",
    "重量(kg)": "Weight (kg)",
    "锅胆 / 胆高度(mm)": "Inner Pot Height (mm)",
    "胆内径(mm)": "Inner Pot Diameter (mm)",
    "材质": "Material",
    "厚度（mm）": "Thickness (mm)",
    "中层 / 材料": "Middle Layer / Material",
    "发热盘 / 功率(kg)": "Heating Plate / Power",
    "发热盘材质": "Heating Plate Material",
    "直径（mm）": "Diameter (mm)",
    "外壳 / 材料": "Outer Shell / Material",
    "厚度(mm)": "Thickness (mm)",
    "锅身 / 锅外直径": "Body Outer Diameter",
    "锅外高度": "Body Outer Height",
    "压力 / 常规(kPa)": "Working Pressure (kPa)",
    "最大值(kPa)": "Max Pressure (kPa)",
    "适用人数": "Suggested Users",
    "包装尺寸/mm": "Packing Size (mm)",
    "净重(kg)": "Net Weight (kg)",
    "包装重量/kg": "Gross Weight (kg)",
  };
  return map[key] || key;
}

function productValueEn(key, value) {
  return String(value)
    .replaceAll("铝金材质", "Aluminum alloy")
    .replaceAll("冷扎板", "Cold-rolled sheet")
    .replaceAll("不锈铁", "Stainless iron")
    .replaceAll("铝", "Aluminum")
    .replaceAll("台装", "pcs/carton")
    .replaceAll("一", "-");
}

function detailHtml(record) {
  const rows = Object.entries(record).filter(([k]) => !["id", "customerRef", "chatImages", "profileImages", "attachments", "follows", "items"].includes(k)).map(([k, v]) => `<div class="detail-row"><span>${escapeHtml(k)}</span><strong>${escapeHtml(text(v))}</strong></div>`).join("");
  const follows = (record.follows != null ? record.follows.length : undefined) ? `<div class="detail-row wide-detail"><span>跟进时间线</span>${record.follows.map((f) => `<strong>${escapeHtml(f.date)}：${escapeHtml(f.content)} ｜ 要发：${escapeHtml(f.sendContent || "")}</strong>`).join("")}</div>` : "";
  const chat = (record.chatImages || []).map(imageThumb).join("");
  const profile = (record.profileImages || []).map(imageThumb).join("");
  return `${rows}${follows}<div class="detail-images"><h4>聊天图片</h4>${chat || "<p>没有聊天图片</p>"}</div><div class="detail-images"><h4>资料图片</h4>${profile || "<p>没有资料图片</p>"}</div>`;
}

function imageCount(item) {
  const c = (item.chatImages != null ? item.chatImages.length : undefined) || 0;
  const p = (item.profileImages != null ? item.profileImages.length : undefined) || 0;
  return c || p ? `<span class="tag">聊天${c} / 资料${p}</span>` : "";
}

function contactSummary(item) {
  return (item.contacts != null ? item.contacts.length : undefined) ? item.contacts.map((x) => `${x.type}: ${escapeHtml(x.value)}`).join("<br>") : "";
}

function orderProducts(order) {
  return orderLineItems(order).map((x) => x.description || x.model).filter(Boolean).join("、");
}

function lineAmount(item) {
  return Number(item.qty || 0) * Number(item.unitPrice ?? item.price ?? 0);
}

function orderTotal(order) {
  return orderLineItems(order).reduce((sum, item) => sum + lineAmount(item), 0) + Number(order.freight || 0);
}

function orderLineItems(order = {}) {
  const rows = (order.items && order.items.length ? order.items : order.orderItems) || [];
  return rows.map((item) => ({
    ...item,
    description: item.description || item.model || "",
    size: item.size || "",
    qty: Number(item.qty || 0),
    weight: Number(item.weight || 0),
    unitPrice: Number(item.unitPrice ?? item.price ?? 0),
  }));
}

function sum(items = [], key) {
  return items.reduce((total, item) => total + Number(item[key] || 0), 0);
}

function money(num, currency = "") {
  if (!num) return "";
  return `${Number(num).toFixed(2)}${currency ? ` ${currency}` : ""}`;
}

function deleteRecord(type, id) {
  if (!confirm("确定删除这条记录吗？")) return;
  snapshot();
  const list = collectionFor(type);
  const idx = list.findIndex((x) => x.id === id);
  if (idx >= 0) list.splice(idx, 1);
  saveState();
  render();
}

function snoozeFollow(type, id, days) {
  const record = findRecord(type, id);
  if (!record) return;
  const nextDate = addDays(formatISO(new Date()), Number(days) || 1);
  snapshot();
  record.nextFollow = nextDate;
  record.nextFollowInput = nextDate;
  if (type === "inquiry") {
    record.follows = record.follows || [];
    record.follows.push({
      id: crypto.randomUUID(),
      date: formatISO(new Date()),
      content: "已处理本次提醒，重新安排下次跟进。",
      sendContent: record.sendContent || record.nextAction || "",
      nextFollow: nextDate,
    });
    syncCustomerFromInquiry(record);
  }
  if (type === "customer") syncInquiryFromCustomer(record);
  saveState();
  render();
}

function exportData() {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `cyc-crm-${formatISO(new Date())}.json`;
  link.click();
  URL.revokeObjectURL(link.href);
}

function importData(file) {
  if (!file) return;
  const reader = new FileReader();
  reader.onload = () => {
    try {
      snapshot();
      const next = JSON.parse(reader.result);
      state.customers = next.customers || [];
      state.inquiries = next.inquiries || [];
      state.orders = next.orders || [];
      saveState();
      render();
    } catch {
      alert("导入失败：文件格式不对。");
    }
  };
  reader.readAsText(file);
}


/* ===== DARK MODE ===== */
function initTheme() {
  document.documentElement.setAttribute('data-theme', theme);
  document.getElementById('themeToggle').textContent = theme === 'dark' ? '☀️' : '🌙';
}
function toggleTheme() {
  theme = theme === 'dark' ? 'light' : 'dark';
  localStorage.setItem('cyc-crm-theme', theme);
  document.documentElement.setAttribute('data-theme', theme);
  document.getElementById('themeToggle').textContent = theme === 'dark' ? '☀️' : '🌙';
}

/* ===== MOBILE NAV ===== */
function toggleMobileNav() {
  document.getElementById('sidebar').classList.toggle('open');
  document.getElementById('sidebarOverlay').classList.toggle('open');
}
function closeMobileNav() {
  document.getElementById('sidebar').classList.remove('open');
  document.getElementById('sidebarOverlay').classList.remove('open');
}

/* ===== KANBAN BOARD ===== */
function renderKanban() {
  const board = document.getElementById('kanbanBoard');
  if (!board || currentView !== 'kanban') return;
  const inquiries = state.inquiries;
  const grouped = {};
  STAGES.forEach(s => grouped[s] = []);
  inquiries.forEach(item => {
    const stage = item.stage || '新询盘';
    if (!grouped[stage]) grouped[stage] = [];
    grouped[stage].push(item);
  });
  board.innerHTML = Object.entries(grouped).map(([stage, items]) => `
    <div class="kanban-col" data-stage="${escapeHtml(stage)}" 
         ondragover="event.preventDefault(); event.dataTransfer.dropEffect='move'; event.currentTarget.classList.add('drag-over')"
         ondragleave="event.currentTarget.classList.remove('drag-over')"
         ondrop="handleKanbanDrop(event, '${escapeHtml(stage)}')">
      <h4>${escapeHtml(stage)} <span class="count">${items.length}</span></h4>
      ${items.map(item => `
        <div class="kanban-card" draggable="true" 
             data-inquiry-id="${item.id}"
             ondragstart="handleDragStart(event, '${item.id}')"
             ondragend="handleDragEnd(event)"
             onclick="openDetail('inquiry', '${item.id}')">
          <div class="card-title">${escapeHtml(item.customerName)}</div>
          <div class="card-meta">${escapeHtml(item.id)} · ${escapeHtml(item.country || '')} · ${escapeHtml(text(item.productCategories))}</div>
        </div>`).join('')}
    </div>
  `).join('');
}

function handleDragStart(e, id) {
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/plain', id);
  e.target.classList.add('dragging');
}
function handleDragEnd(e) {
  e.target.classList.remove('dragging');
  document.querySelectorAll('.kanban-col').forEach(c => c.classList.remove('drag-over'));
}
function handleKanbanDrop(e, stage) {
  e.preventDefault();
  e.currentTarget.classList.remove('drag-over');
  const id = e.dataTransfer.getData('text/plain');
  const inquiry = findRecord('inquiry', id);
  if (inquiry && inquiry.stage !== stage) {
    snapshot();
    inquiry.stage = stage;
    // Auto-add follow record
    if (!inquiry.follows) inquiry.follows = [];
    inquiry.follows.push({
      id: crypto.randomUUID(),
      date: formatISO(new Date()),
      content: `阶段变更为: ${stage}`,
      sendContent: '',
      nextFollow: inquiry.nextFollow || ''
    });
    saveState();
    render();
  }
}

/* ===== REPORTS ===== */
function renderReports() {
  if (currentView !== 'reports') return;
  const orders = state.orders;
  const inquiries = state.inquiries;
  const now = new Date();
  const thisMonth = now.getMonth();
  const thisYear = now.getFullYear();
  const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
  const lastMonthYear = thisMonth === 0 ? thisYear - 1 : thisYear;
  
  // Total revenue
  const totalRevenue = orders.reduce((sum, o) => sum + orderTotal(o), 0);
  document.getElementById('reportRevenue').textContent = money(totalRevenue, '');
  const revenueTrend = document.getElementById('reportRevenueTrend');
  if (revenueTrend) revenueTrend.textContent = `${orders.length} 个订单合计`;
  
  // This month orders
  const monthOrders = orders.filter(o => {
    const d = new Date(o.piDate); return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
  });
  document.getElementById('reportMonthOrders').textContent = monthOrders.length;
  
  // Conversion rate (deals / total inquiries)
  const totalInquiries = inquiries.length;
  const deals = inquiries.filter(i => i.stage === '已成交').length;
  const convRate = totalInquiries ? Math.round(deals / totalInquiries * 100) : 0;
  document.getElementById('reportConversion').textContent = convRate + '%';
  
  // Previous month comparison
  const lastMonthOrders = orders.filter(o => {
    const d = new Date(o.piDate); return d.getMonth() === lastMonth && d.getFullYear() === lastMonthYear;
  });
  const trend = lastMonthOrders.length ? Math.round((monthOrders.length - lastMonthOrders.length) / lastMonthOrders.length * 100) : 0;
  const trendEl = document.getElementById('reportOrderTrend');
  trendEl.textContent = trend >= 0 ? `↑ ${trend}% 环比` : `↓ ${Math.abs(trend)}% 环比`;
  trendEl.className = 'trend' + (trend < 0 ? ' down' : '');
  
  // Sales funnel
  const funnelStages = ['信息已收集', '已联系未回复', '已回复', '需求确认', '已推荐', '已报价', '谈判中', '已成交'];
  const funnelData = funnelStages.map(s => {
    const count = inquiries.filter(i => i.stage === s).length;
    return [s, count];
  }).filter(([,c]) => c > 0);
  drawBars('funnelChart', funnelData);
  
  // Monthly revenue trend (last 6 months)
  const monthlyData = {};
  for (let i = 5; i >= 0; i--) {
    const d = new Date(thisYear, thisMonth - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
    monthlyData[key] = 0;
  }
  orders.forEach(o => {
    const d = new Date(o.piDate);
    const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
    if (monthlyData[key] !== undefined) monthlyData[key] += orderTotal(o);
  });
  drawBars('monthlyRevenueChart', Object.entries(monthlyData));
  const sourceData = countBy(inquiries, (item) => item.source);
  drawBars('sourceChart', sourceData);
}

/* ===== BULK OPERATIONS ===== */
function toggleBulkSelect(type, id) {
  const key = `${type}:${id}`;
  if (bulkSelected.has(key)) bulkSelected.delete(key);
  else bulkSelected.add(key);
  updateBulkBar();
  render();
}
function updateBulkBar() {
  const bar = document.getElementById('bulkBar');
  const count = document.getElementById('bulkCount');
  if (!bar || !count) return;
  bar.classList.toggle('visible', bulkSelected.size > 0);
  count.textContent = `已选 ${bulkSelected.size} 项`;
}
function clearBulkSelection() {
  bulkSelected.clear();
  updateBulkBar();
  render();
}
function bulkDelete() {
  if (!bulkSelected.size) return;
  if (!confirm(`确定删除 ${bulkSelected.size} 条记录吗？`)) return;
  snapshot();
  for (const key of bulkSelected) {
    const [type, id] = key.split(':');
    const list = collectionFor(type);
    const idx = list.findIndex(x => x.id === id);
    if (idx >= 0) list.splice(idx, 1);
  }
  bulkSelected.clear();
  updateBulkBar();
  saveState();
  render();
}
function bulkChangeStage() {
  if (!bulkSelected.size) return;
  const stage = prompt('请输入新阶段：', STAGES.join('/'));
  if (!stage) return;
  snapshot();
  for (const key of bulkSelected) {
    const [type, id] = key.split(':');
    if (type === 'inquiry') {
      const item = findRecord('inquiry', id);
      if (item) {
        item.stage = stage;
        if (!item.follows) item.follows = [];
        item.follows.push({ id: crypto.randomUUID(), date: formatISO(new Date()), content: `批量变更阶段为: ${stage}`, sendContent: '', nextFollow: item.nextFollow || '' });
      }
    }
  }
  saveState();
  render();
}

/* ===== SORTING ===== */
function sortTable(type, field, rows) {
  if (sortState.field === field) {
    sortState.dir = sortState.dir === 'asc' ? 'desc' : 'asc';
  } else {
    sortState.field = field;
    sortState.dir = 'asc';
  }
  const dir = sortState.dir === 'asc' ? 1 : -1;
  return [...rows].sort((a, b) => {
    const va = (a[field] || '').toString().toLowerCase();
    const vb = (b[field] || '').toString().toLowerCase();
    if (!isNaN(va) && !isNaN(vb)) return (Number(va) - Number(vb)) * dir;
    return va.localeCompare(vb) * dir;
  });
}

/* ===== DATE RANGE FILTER ===== */
function inDateRange(item, field) {
  const from = (document.getElementById('dateFrom') != null ? document.getElementById('dateFrom').value : undefined);
  const to = (document.getElementById('dateTo') != null ? document.getElementById('dateTo').value : undefined);
  if (!from && !to) return true;
  const val = item[field];
  if (!val) return !from && !to;
  return (!from || val >= from) && (!to || val <= to);
}

/* ===== PI PRINT ===== */
function printPI() {
  window.print();
}

/* ===== CUSTOMER MERGE ===== */
function openMergeDialog() {
  const list = state.customers;
  document.getElementById('mergeSourceList').innerHTML = list.map(c => 
    `<div class="merge-item" data-cid="${c.id}" onclick="selectMergeSource('${c.id}')">${escapeHtml(c.name)} · ${escapeHtml(c.country || '')} · ${escapeHtml(contactSummary(c))}</div>`
  ).join('');
  document.getElementById('mergeTargetList').innerHTML = list.map(c => 
    `<div class="merge-item" data-cid="${c.id}" onclick="selectMergeTarget('${c.id}')">${escapeHtml(c.name)} · ${escapeHtml(c.country || '')} · ${escapeHtml(contactSummary(c))}</div>`
  ).join('');
  mergeSourceId = null;
  mergeTargetId = null;
  document.getElementById('mergeDialog').showModal();
}
function selectMergeSource(id) {
  mergeSourceId = id;
  document.querySelectorAll('#mergeSourceList .merge-item').forEach(el => el.classList.toggle('selected', el.dataset.cid === id));
}
function selectMergeTarget(id) {
  mergeTargetId = id;
  document.querySelectorAll('#mergeTargetList .merge-item').forEach(el => el.classList.toggle('selected', el.dataset.cid === id));
}
function confirmMerge() {
  if (!mergeSourceId || !mergeTargetId) return alert('请先选择源客户和目标客户');
  if (mergeSourceId === mergeTargetId) return alert('不能合并到同一个客户');
  if (!confirm('确定将源客户合并到目标客户吗？源客户的询盘和订单将转移到目标客户。')) return;
  snapshot();
  const source = findRecord('customer', mergeSourceId);
  const target = findRecord('customer', mergeTargetId);
  if (!source || !target) return;
  // Move inquiries
  state.inquiries.forEach(i => { if (i.customerRef === source.id) i.customerRef = target.id; });
  // Merge contacts
  target.contacts = [...(target.contacts || []), ...(source.contacts || [])];
  // Merge product categories
  target.productCategories = [...new Set([...(target.productCategories || []), ...(source.productCategories || [])])];
  // Merge images
  target.chatImages = [...(target.chatImages || []), ...(source.chatImages || [])];
  target.profileImages = [...(target.profileImages || []), ...(source.profileImages || [])];
  // Remove source customer
  const idx = state.customers.findIndex(c => c.id === source.id);
  if (idx >= 0) state.customers.splice(idx, 1);
  saveState();
  document.getElementById('mergeDialog').close();
  render();
}

/* ===== QUICK FOLLOW-UP ===== */
function quickFollowUp() {
  var type = currentView === 'customers' ? 'customer' : currentView === 'orders' ? 'order' : 'inquiry';
  var list = collectionFor(type);
  if (!list.length) {
    openForm(type === 'customer' ? 'customer' : 'inquiry');
    return;
  }
  var names = list.map(function(item, i) { return (i+1) + '. ' + (item.name || item.customerName || item.id); }).join('\n');
  var idx = prompt('???????????\n' + names + '\n\n?????(??? 0 ??)');
  if (idx === null) return;
  if (idx === '0') { openForm(type === 'customer' ? 'customer' : 'inquiry'); return; }
  var item = list[Number(idx) - 1];
  if (!item) return alert('????');
  if (type === 'inquiry') openForm('inquiry', item.id);
  else openForm(type, item.id);
}

/* ===== INIT CALL ===== */
initTheme();

// Export to window for inline event handlers
window.handleKanbanDrop = handleKanbanDrop;
window.handleDragStart = handleDragStart;
window.handleDragEnd = handleDragEnd;
window.sortAndRender = sortAndRender;
window.toggleBulkSelect = toggleBulkSelect;
window.toggleAllBulk = toggleAllBulk;
window.selectMergeSource = selectMergeSource;
window.selectMergeTarget = selectMergeTarget;
window.confirmMerge = confirmMerge;
window.openMergeDialog = openMergeDialog;
window.toggleTheme = toggleTheme;
window.toggleMobileNav = toggleMobileNav;
window.closeMobileNav = closeMobileNav;
window.quickFollowUp = quickFollowUp;
window.printPI = printPI;
window.bulkDelete = bulkDelete;
window.bulkChangeStage = bulkChangeStage;
window.clearBulkSelection = clearBulkSelection;
document.querySelectorAll(".nav-btn").forEach((btn) => btn.addEventListener("click", () => { currentView = btn.dataset.view; sortState = { field: null, dir: 'asc' }; bulkSelected.clear(); updateBulkBar(); closeMobileNav(); render(); }));
document.getElementById("quickAddBtn").addEventListener("click", () => openForm({ dashboard: "customer", customers: "customer", inquiries: "inquiry", orders: "order", products: "inquiry" }[currentView] || "inquiry"));
document.getElementById("recordForm").addEventListener("submit", saveForm);
document.getElementById("cancelBtn").addEventListener("click", () => document.getElementById("formDialog").close());
document.getElementById("closeDialogBtn").addEventListener("click", () => document.getElementById("formDialog").close());
document.getElementById("closeDetailBtn").addEventListener("click", () => document.getElementById("detailDialog").close());
document.getElementById("detailDoneBtn").addEventListener("click", () => document.getElementById("detailDialog").close());
document.getElementById("detailEditBtn").addEventListener("click", () => { if (detailTarget) { document.getElementById("detailDialog").close(); openForm(detailTarget.type, detailTarget.id); } });
(document.getElementById("closeImageDialogBtn") != null ? document.getElementById("closeImageDialogBtn").addEventListener("click", () => document.getElementById("imageDialog").close()) : undefined);
(document.getElementById("imageDialogDoneBtn") != null ? document.getElementById("imageDialogDoneBtn").addEventListener("click", () => document.getElementById("imageDialog").close()) : undefined);
(document.getElementById("companySettingsBtn") != null ? document.getElementById("companySettingsBtn").addEventListener("click", openCompanyDialog) : undefined);
(document.getElementById("companyForm") != null ? document.getElementById("companyForm").addEventListener("submit", saveCompanyProfile) : undefined);
(document.getElementById("closeCompanyDialogBtn") != null ? document.getElementById("closeCompanyDialogBtn").addEventListener("click", () => document.getElementById("companyDialog").close()) : undefined);
(document.getElementById("cancelCompanyBtn") != null ? document.getElementById("cancelCompanyBtn").addEventListener("click", () => document.getElementById("companyDialog").close()) : undefined);
(document.getElementById("clearInquiryFilters") != null ? document.getElementById("clearInquiryFilters").addEventListener("click", () => { ["inquiryStageFilter", "inquirySourceFilter", "inquiryProductFilter", "inquirySearch"].forEach((id) => document.getElementById(id).value = ""); render(); }) : undefined);

document.body.addEventListener("click", (e) => {
  const removeContact = e.target.closest("[data-remove-contact]");
  const removeItem = e.target.closest("[data-remove-item]");
  const edit = e.target.closest("[data-edit-type]");
  const del = e.target.closest("[data-delete-type]");
  const detail = e.target.closest("[data-detail-type]");
  const focus = e.target.closest("[data-focus-inquiry]");
  const addFollow = e.target.closest("[data-add-follow]");
  const snooze = e.target.closest("[data-snooze-type]");
  const imageView = e.target.closest("[data-image-view]");
  const preview = e.target.closest("[data-preview-order]");
  const productDetail = e.target.closest("[data-product-detail]");
  const productLang = e.target.closest("[data-product-lang]");
  if (removeContact) removeContact.closest(".contact-row").remove();
  else if (removeItem) removeItem.closest(".order-item-row").remove();
  else if (edit) openForm(edit.dataset.editType, edit.dataset.editId);
  else if (del) deleteRecord(del.dataset.deleteType, del.dataset.deleteId);
  else if (focus) { activeInquiryId = focus.dataset.focusInquiry; renderInquiries(); }
  else if (addFollow) { const item = findRecord("inquiry", addFollow.dataset.addFollow); openForm("inquiry", item.id); }
  else if (snooze) snoozeFollow(snooze.dataset.snoozeType, snooze.dataset.snoozeId, snooze.dataset.snoozeDays);
  else if (imageView) openImageViewer(imageView.dataset.imageView, imageView.dataset.imageName);
  else if (preview) { activeOrderId = preview.dataset.previewOrder; renderOrders(); }
  else if (productDetail) openProductDetail(productDetail.dataset.productDetail);
  else if (productLang && window.__lastProductDetail) document.getElementById("detailBody").innerHTML = productDetailHtml(window.__lastProductDetail, productLang.dataset.productLang);
  else if (detail) openDetail(detail.dataset.detailType, detail.dataset.detailId);
});

document.querySelectorAll(".segment").forEach((btn) => btn.addEventListener("click", () => { reminderFilter = btn.dataset.reminderFilter; document.querySelectorAll(".segment").forEach((x) => x.classList.toggle("active", x === btn)); renderReminders(); }));
["customerSearch", "inquirySearch", "orderSearch", "productSearch", "productCategoryFilter", "inquiryStageFilter", "inquirySourceFilter", "inquiryProductFilter"].forEach((id) => {
  const el = document.getElementById(id);
  if (el) { el.addEventListener("input", render); el.addEventListener("change", render); }
});
document.getElementById("exportBtn").addEventListener("click", exportData);
document.getElementById("importInput").addEventListener("change", (e) => importData(e.target.files[0]));
(document.getElementById("loginBtn") != null ? document.getElementById("loginBtn").addEventListener("click", async () => {
  if (!supabaseClient) return alert("Supabase 没有加载成功，请检查网络。");
  const email = (document.getElementById("emailLoginInput") != null ? document.getElementById("emailLoginInput").value : undefined).trim();
  const password = (document.getElementById("passwordLoginInput") != null ? document.getElementById("passwordLoginInput").value : undefined);
  if (!email || !password) return alert("请输入邮箱和密码。");
  const { error } = await supabaseClient.auth.signInWithPassword({
    email,
    password,
  });
  if (error) {
    console.error(error);
    alert(`登录失败：${authErrorText(error)}`);
  } else {
    setCloudStatus("登录成功，正在加载云端数据...");
  }
}) : undefined);

(document.getElementById("signupBtn") != null ? document.getElementById("signupBtn").addEventListener("click", async () => {
  if (!supabaseClient) return alert("Supabase 没有加载成功，请检查网络。");
  const email = (document.getElementById("emailLoginInput") != null ? document.getElementById("emailLoginInput").value : undefined).trim();
  const password = (document.getElementById("passwordLoginInput") != null ? document.getElementById("passwordLoginInput").value : undefined);
  if (!email || !password) return alert("请输入邮箱和密码。");
  if (password.length < 6) return alert("密码至少 6 位。");
  const redirectTo = window.location.origin + window.location.pathname;
  const { data, error } = await supabaseClient.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: redirectTo,
    },
  });
  if (error) {
    console.error(error);
    alert(`注册失败：${authErrorText(error)}`);
  } else if (data && data.session) {
    setCloudStatus("注册成功，正在加载云端数据...");
  } else {
    alert("注册已提交，但 Supabase 现在要求邮箱确认，所以还不会显示云端登录。建议在 Supabase 里关闭 Confirm email，或去邮箱点确认链接后再登录。");
  }
}) : undefined);

function authErrorText(error) {
  const msg = (error != null ? error.message : undefined) || "";
  if (msg.includes("Invalid login credentials")) return "邮箱或密码不对。";
  if (msg.includes("Email not confirmed")) return "邮箱还没确认，请先去邮箱点确认链接。";
  if (msg.includes("User already registered")) return "这个邮箱已经注册过了，请直接登录。";
  if (msg.includes("Password should be at least")) return "密码太短，至少 6 位。";
  return msg || "未知错误";
}
(document.getElementById("logoutBtn") != null ? document.getElementById("logoutBtn").addEventListener("click", async () => {
  if (!supabaseClient) return;
  await supabaseClient.auth.signOut();
}) : undefined);
document.addEventListener("keydown", (e) => { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z" && !["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) { e.preventDefault(); undo(); } });

saveState();
render();
initCloudAuth();

// Theme toggle
(document.getElementById('themeToggle') != null ? document.getElementById('themeToggle').addEventListener('click', toggleTheme) : undefined);

// Mobile nav
(document.getElementById('mobileNavToggle') != null ? document.getElementById('mobileNavToggle').addEventListener('click', toggleMobileNav) : undefined);
(document.getElementById('sidebarOverlay') != null ? document.getElementById('sidebarOverlay').addEventListener('click', closeMobileNav) : undefined);

// Close mobile nav when clicking a nav button
document.querySelectorAll('.nav-btn').forEach(btn => btn.addEventListener('click', () => { closeMobileNav(); }));

// Bulk operations
(document.getElementById('bulkDeleteBtn') != null ? document.getElementById('bulkDeleteBtn').addEventListener('click', bulkDelete) : undefined);
(document.getElementById('bulkStageBtn') != null ? document.getElementById('bulkStageBtn').addEventListener('click', bulkChangeStage) : undefined);
(document.getElementById('bulkCancelBtn') != null ? document.getElementById('bulkCancelBtn').addEventListener('click', clearBulkSelection) : undefined);

// Date range filters
(document.getElementById('dateFrom') != null ? document.getElementById('dateFrom').addEventListener('change', render) : undefined);
(document.getElementById('dateTo') != null ? document.getElementById('dateTo').addEventListener('change', render) : undefined);
(document.getElementById('clearDateFilter') != null ? document.getElementById('clearDateFilter').addEventListener('click', () => {
  document.getElementById('dateFrom').value = '';
  document.getElementById('dateTo').value = '';
  render();
}) : undefined);

// Customer merge
(document.getElementById('closeMergeBtn') != null ? document.getElementById('closeMergeBtn').addEventListener('click', () => document.getElementById('mergeDialog').close()) : undefined);
(document.getElementById('cancelMergeBtn') != null ? document.getElementById('cancelMergeBtn').addEventListener('click', () => document.getElementById('mergeDialog').close()) : undefined);
(document.getElementById('confirmMergeBtn') != null ? document.getElementById('confirmMergeBtn').addEventListener('click', confirmMerge) : undefined);

// Quick follow-up
(document.getElementById('quickFollowBtn') != null ? document.getElementById('quickFollowBtn').addEventListener('click', quickFollowUp) : undefined);

// Merge customer button
(document.getElementById('mergeCustomerBtn') != null ? document.getElementById('mergeCustomerBtn').addEventListener('click', openMergeDialog) : undefined);

// Print PI button
(document.getElementById('printPIBtn') != null ? document.getElementById('printPIBtn').addEventListener('click', printPI) : undefined);

render();
