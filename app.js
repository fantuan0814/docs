const SOURCES = ["FACEBOOK", "国际站", "独立站", "社媒私信", "展会现场", "老客户转介绍"];
const PRODUCT_CATEGORIES = ["IH电磁饭煲", "保温桶", "电饭煲电脑", "电饭煲机械", "煮粥锅", "电压力锅"];
const STAGES = ["信息已收集", "已联系未回复", "已回复", "需求确认", "待推荐", "已推荐", "待报价", "已报价", "样品中", "谈判中", "已成交", "暂缓", "无效"];
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
const supabaseClient = window.supabase?.createClient(SUPABASE_URL, SUPABASE_KEY);
let currentUser = null;
let cloudSaveTimer = null;
let cloudLoading = false;
const ORDER_DEFAULTS = {
  portLoading: "GUANGZHOU / SHENZHEN, CHINA",
  payment: "100% T/T BEFORE SHIPMENT",
  delivery: "AFTER FULL PAYMENT 14 DAYS",
  partialShipment: "NO ALLOWED",
  currency: "USD",
  status: "待开PI",
  payStatus: "未收款",
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
let currentView = "dashboard";
let reminderFilter = "all";
let editing = { type: null, id: null };
let detailTarget = null;
let activeInquiryId = state.inquiries[0]?.id || null;
let activeOrderId = state.orders[0]?.id || null;
let undoStack = [];

const viewMeta = {
  dashboard: ["今日小提醒", "点开提醒卡片可查看详情和编辑。", "新增客户"],
  customers: ["客户小本本", "按客户、公司、国家和联系方式整理。", "新增客户"],
  inquiries: ["询盘中心", "询盘和跟进合在一起，看分类、看阶段、看时间线。", "新增询盘"],
  followups: ["询盘中心", "跟进已经合并到询盘里。", "新增询盘"],
  orders: ["订单 PI", "录入订单后，右侧可直接预览 PI。", "新增订单"],
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
    ["orderItems", "订单产品明细", "orderItems"],
    ["freight", "运费", "number"],
    ["currency", "币种", "select", false, CURRENCIES],
    ["payment", "付款方式", "text", false, null, "100% T/T BEFORE SHIPMENT"],
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

function loadState() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    try {
      return JSON.parse(saved);
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
  }
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  return {
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
    inquiries: [],
    orders: [],
  };
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
  setCloudStatus("云端保存中...");
  const { error, timedOut } = await withTimeout(
    supabaseClient
      .from("crm_data")
      .upsert({
        user_id: currentUser.id,
        data: cloudPayload(),
        updated_at: new Date().toISOString(),
      }, { onConflict: "user_id" }),
    12000
  );
  if (timedOut) {
    setCloudStatus("云端保存超时，请检查网络");
    return;
  }
  setCloudStatus(error ? cloudErrorText(error, "保存") : "已同步云端");
  if (error) console.error(error);
}

async function loadCloudData() {
  if (!supabaseClient || !currentUser) return;
  cloudLoading = true;
  setCloudStatus("云端加载中...");
  const { data, error, timedOut } = await withTimeout(
    supabaseClient
      .from("crm_data")
      .select("data")
      .eq("user_id", currentUser.id)
      .maybeSingle(),
    12000
  );
  if (timedOut) {
    cloudLoading = false;
    setCloudStatus("云端加载超时，请检查网络");
    return;
  }
  if (error) {
    console.error(error);
    setCloudStatus(cloudErrorText(error, "加载"));
    cloudLoading = false;
    return;
  }
  if (data?.data) {
    state.customers = data.data.customers || [];
    state.inquiries = data.data.inquiries || [];
    state.orders = data.data.orders || [];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } else {
    await saveCloudData();
  }
  cloudLoading = false;
  setCloudStatus(`云端已登录：${currentUser.email || "Google账号"}`);
  render();
}

async function withTimeout(promise, ms = 12000) {
  let timer;
  const timeout = new Promise((resolve) => {
    timer = setTimeout(() => resolve({ timedOut: true }), ms);
  });
  const result = await Promise.race([promise, timeout]);
  clearTimeout(timer);
  return result;
}

function cloudErrorText(error, action) {
  const msg = `${error?.message || ""} ${error?.details || ""}`;
  if (msg.includes("crm_data") || msg.includes("does not exist") || error?.code === "42P01") {
    return `云端${action}失败：请先在 Supabase 跑建表 SQL`;
  }
  if (msg.includes("permission") || msg.includes("row-level security") || error?.code === "42501") {
    return `云端${action}失败：权限策略未生效`;
  }
  return `云端${action}失败：${error?.message || "未知错误"}`;
}

async function initCloudAuth() {
  if (!supabaseClient) {
    setCloudStatus("未连接云端");
    return;
  }
  const { data } = await supabaseClient.auth.getSession();
  currentUser = data.session?.user || null;
  updateAuthUi();
  if (currentUser) await loadCloudData();
  supabaseClient.auth.onAuthStateChange(async (_event, session) => {
    currentUser = session?.user || null;
    updateAuthUi();
    if (currentUser) await loadCloudData();
    else setCloudStatus("本地模式");
  });
}

function updateAuthUi() {
  document.getElementById("loginBtn")?.classList.toggle("hidden", Boolean(currentUser));
  document.getElementById("emailLoginInput")?.classList.toggle("hidden", Boolean(currentUser));
  document.getElementById("logoutBtn")?.classList.toggle("hidden", !currentUser);
  setCloudStatus(currentUser ? `云端已登录：${currentUser.email || "Google账号"}` : "本地模式");
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
    const delta = daysUntil(item.nextFollow);
    if (item.nextFollow && delta <= 3 && !["已成交", "无效", "暂缓"].includes(item.stage)) {
      reminders.push({ recordType: "customer", recordId: item.id, type: "客户跟进", date: item.nextFollow, status: item.stage, customerName: item.name, phone: primaryContact(item), product: text(item.productCategories), action: item.nextAction || "继续跟进客户", context: item.notes, delta });
    }
  });
  state.inquiries.forEach((item) => {
    const delta = daysUntil(item.nextFollow);
    if (item.nextFollow && delta <= 3 && !["已成交", "无效"].includes(item.stage)) {
      reminders.push({ recordType: "inquiry", recordId: item.id, type: "询盘跟进", date: item.nextFollow, status: item.stage, customerName: item.customerName, phone: primaryContact(item), product: text(item.productCategories), action: item.sendContent || latestFollow(item)?.sendContent || item.need || "继续跟进询盘", context: latestFollow(item)?.content || item.notes, delta });
    }
  });
  state.orders.forEach((item) => {
    const delta = daysUntil(item.deliveryDate);
    if (item.deliveryDate && delta <= 7 && !["已完成", "取消"].includes(item.status)) {
      reminders.push({ recordType: "order", recordId: item.id, type: "订单交期", date: item.deliveryDate, status: item.status, customerName: item.customerName, phone: primaryContact(item), product: orderProducts(item), action: "确认生产/出货/收款进度", context: item.notes, delta });
    }
  });
  return reminders.sort((a, b) => a.delta - b.delta);
}

function renderReminders() {
  const list = document.getElementById("reminderList");
  let rows = getReminders().filter((item) => reminderFilter === "today" ? item.delta === 0 : reminderFilter === "overdue" ? item.delta < 0 : reminderFilter === "week" ? item.delta <= 7 : true);
  if (!rows.length) return list.innerHTML = `<div class="empty">今天暂时没有提醒。</div>`;
  list.innerHTML = rows.map((item) => {
    const tone = item.delta < 0 ? "red" : item.delta === 0 ? "amber" : "green";
    const label = item.delta < 0 ? `逾期 ${Math.abs(item.delta)} 天` : item.delta === 0 ? "今天" : `${item.delta} 天后`;
    return `<article class="reminder clickable" data-detail-type="${item.recordType}" data-detail-id="${item.recordId}">
      <div><span class="tag ${tone}">${label}</span><p>${item.date}</p></div>
      <div><h4>${escapeHtml(item.customerName)} · ${escapeHtml(item.type)}</h4><p><strong>要做：</strong>${escapeHtml(item.action)}</p><p><strong>最近：</strong>${escapeHtml(item.context || "")}</p><p>${escapeHtml(item.phone)} · ${escapeHtml(item.product)}</p></div>
      <div><span class="tag">${escapeHtml(item.status)}</span><p>点开查看</p></div>
    </article>`;
  }).join("");
}

function renderCustomers() {
  const rows = state.customers.filter((item) => matchesSearch(item, document.getElementById("customerSearch").value));
  document.getElementById("customerList").innerHTML = makeTable(["客户", "类型", "联系人", "首次接触", "国家", "性质", "联系方式", "产品", "下次跟进", "图片", "操作"], rows.map((item) => [
    item.name, item.customerKind, item.personName, item.firstContact, item.country, item.nature, contactSummary(item), text(item.productCategories), item.nextFollow, imageCount(item), actionButtons("customer", item.id)
  ]));
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
  const q = document.getElementById("inquirySearch")?.value || "";
  const stage = document.getElementById("inquiryStageFilter")?.value || "";
  const source = document.getElementById("inquirySourceFilter")?.value || "";
  const product = document.getElementById("inquiryProductFilter")?.value || "";
  return state.inquiries.filter((item) => matchesSearch(item, q) && (!stage || item.stage === stage) && (!source || item.source === source) && (!product || (item.productCategories || []).includes(product)));
}

function renderInquiries() {
  const rows = filteredInquiries();
  if (!activeInquiryId && rows[0]) activeInquiryId = rows[0].id;
  const focus = state.inquiries.find((item) => item.id === activeInquiryId) || rows[0];
  renderInquiryFocus(focus);
  document.getElementById("inquiryList").innerHTML = makeTable(["询盘号", "日期", "客户", "阶段", "国家", "来源", "产品", "需求", "下次跟进", "跟进数", "操作"], rows.map((item) => [
    item.id, item.date, item.customerName, item.stage, item.country, item.source, text(item.productCategories), item.need, item.nextFollow, item.follows?.length || 0, `<div class="row-actions"><button class="row-btn" data-focus-inquiry="${item.id}">查看跟进</button>${actionButtons("inquiry", item.id)}</div>`
  ]));
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
  const rows = state.orders.filter((item) => matchesSearch(item, document.getElementById("orderSearch").value));
  if (!activeOrderId && rows[0]) activeOrderId = rows[0].id;
  const active = state.orders.find((item) => item.id === activeOrderId) || rows[0];
  renderPiPreview(active);
  document.getElementById("orderList").innerHTML = makeTable(["PI编号", "日期", "客户", "产品", "金额", "运费", "状态", "交期", "操作"], rows.map((item) => [
    item.id, item.piDate, item.customerName, orderProducts(item), money(orderTotal(item), item.currency), item.freight || "", item.status, item.deliveryDate, `<div class="row-actions"><button class="row-btn" data-preview-order="${item.id}">预览PI</button>${actionButtons("order", item.id)}</div>`
  ]));
}

function renderProducts() {
  const search = document.getElementById("productSearch");
  const filter = document.getElementById("productCategoryFilter");
  if (!search || !filter) return;
  if (!filter.dataset.ready) {
    filter.innerHTML = `<option value="">全部产品大类</option>${PRODUCT_CATEGORIES.map((x) => `<option value="${x}">${x}</option>`).join("")}`;
    filter.dataset.ready = "1";
  }
  const rows = PRODUCT_CATALOG.filter((item) => matchesSearch(item, search.value) && (!filter.value || item.category === filter.value));
  document.getElementById("productList").innerHTML = makeTable(["产品大类", "型号/小类", "内容", "状态", "跨境电商", "国外大客户", "国外中小批发商", "国外C端零售商", "成本底价", "详情"], rows.map((item) => [item.category, item.model, item.spec, item.status, item.crossBorder, item.overseas, item.wholesale, item.terminal, item.floor, `<button class="row-btn" data-product-detail="${escapeHtml(item.model)}">详情</button>`]));
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
  const capacity = String(model).match(/[\d.]+L/)?.[0] || "";
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
  const nums = String(value || "").match(/\d+(\.\d+)?/g)?.map(Number);
  if (!nums || nums.length < 3) return null;
  return nums[0] / 1000 * (nums[1] / 1000) * (nums[2] / 1000);
}

function pcsFromPacking(value) {
  const match = String(value || "").match(/(\d+)\s*台装/);
  return match ? Number(match[1]) : 1;
}

function calculateFob() {
  const value = (key) => Number(document.querySelector(`[data-calc="${key}"]`)?.value || 0);
  const mode = document.querySelector('[data-calc="quoteMode"]')?.value || "FOB整柜";
  const containerType = document.querySelector('[data-calc="containerType"]')?.value || "20GP";
  const factoryTaxType = document.querySelector('[data-calc="factoryTaxType"]')?.value || "含税";
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
  box.innerHTML = `<div class="pi-paper">
    <div class="pi-company"><h3>山东富士五金有限公司</h3><h4>SHANDONG FUJI HARDWARE CO.,LTD</h4><p>NO.1208-072 NO.100 LINGOROAD LINYI CITY SHANDONG CHINA</p><p>TEL: 0086-539-7057822 &nbsp;&nbsp; FAX: 0086-539-7058822</p></div>
    <h2>PROFORMA INVOICE</h2>
    <div class="pi-grid"><div><b>CUSTOMER:</b><p>${escapeHtml(order.customerInfo || order.customerName)}</p></div><div><b>PI. NO.:</b><p>${escapeHtml(order.piNo || order.id)}</p><b>DATE</b><p>${escapeHtml(order.piDate)}</p></div><div><b>PORT OF LOADING:</b><p>${escapeHtml(order.portLoading || "QINGDAO,CHINA")}</p></div><div><b>PORT OF DISCHARGE:</b><p>${escapeHtml(order.portDischarge || "")}</p></div></div>
    <table class="pi-table"><thead><tr><th>SR. NO.</th><th>DESCRIPTION OF GOODS AND PACKAGE</th><th>SIZE</th><th>QUANTITY</th><th>WEIGHT KGS</th><th>UNIT PRICE USD/KG</th><th>AMOUNT (USD)</th></tr></thead><tbody>${(order.items || []).map((it, i) => `<tr><td>${i + 1}</td><td>${escapeHtml(it.description)}</td><td>${escapeHtml(it.size)}</td><td>${escapeHtml(it.qty)}</td><td>${escapeHtml(it.weight)}</td><td>${escapeHtml(it.unitPrice)}</td><td>${money(lineAmount(it), "")}</td></tr>`).join("")}<tr><td></td><td></td><td>TOTAL:</td><td>${sum(order.items, "qty")}</td><td>${sum(order.items, "weight")}</td><td></td><td>${money(total, "")}</td></tr></tbody></table>
    <p><b>TOTAL U.S.DOLLARS:</b> ${money(total, order.currency || "USD")}</p><p><b>TERMS OF PAYMENT:</b>${escapeHtml(order.payment || "")}</p><p><b>DELIVERY TIME:</b> ${escapeHtml(order.delivery || "")}</p><p><b>PARTIAL SHIPMENT:</b>${escapeHtml(order.partialShipment || "")}</p>
    <p><b>BANK INFORMATION:</b></p><p>BENEFICIARY: <b>SHANDONG FUJI HARDWARE CO., LTD.</b></p><p>ACCOUNT NO.: <b>1610010619200260888</b></p><p>BANK NAME: INDUSTRIAL AND COMMERCIAL BANK OF CHINA, LINYI JINGKAI SUB-BRANCH</p><p>SWIFT CODE：<b>ICBKCNBJXXX</b></p>
  </div>`;
}

function makeTable(headers, rows) {
  if (!rows.length) return `<div class="empty">还没有数据，先新增一条。</div>`;
  return `<table><thead><tr>${headers.map((h) => `<th>${escapeHtml(h)}</th>`).join("")}</tr></thead><tbody>${rows.map((row) => `<tr>${row.map((cell) => `<td>${cell ?? ""}</td>`).join("")}</tr>`).join("")}</tbody></table>`;
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
  const value = record[key] ?? (kind === "multi" ? [] : kind === "orderItems" ? [] : "");
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
  return `<figure class="thumb"><img src="${item.dataUrl}" alt="${escapeHtml(item.name || "图片")}"><figcaption>${escapeHtml(item.name || "截图")}</figcaption></figure>`;
}

function bindFormHelpers() {
  document.querySelectorAll("[data-image-input]").forEach((input) => input.addEventListener("change", () => addFiles([...input.files], input.dataset.imageInput)));
  document.querySelectorAll("[data-image-zone]").forEach((zone) => zone.addEventListener("paste", (e) => {
    const files = [...e.clipboardData.files].filter((f) => f.type.startsWith("image/"));
    if (files.length) { e.preventDefault(); addFiles(files, zone.dataset.imageZone); }
  }));
  document.getElementById("addContactBtn")?.addEventListener("click", () => document.getElementById("addContactBtn").insertAdjacentHTML("beforebegin", contactRowHtml()));
  document.getElementById("addOrderItemBtn")?.addEventListener("click", () => document.getElementById("addOrderItemBtn").insertAdjacentHTML("beforebegin", orderItemRowHtml()));
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
      fig.innerHTML = `<img src="${reader.result}" alt=""><figcaption>${escapeHtml(file.name || "截图")}</figcaption>`;
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
    data.nextFollow = toISO(data.nextFollowInput);
    data.phone = primaryContact(data);
    data.email ||= contactByType(data, "邮箱");
    data.name ||= data.companyName || data.personName;
  }
  if (type === "inquiry") {
    data.date = toISO(data.dateInput) || formatISO(new Date());
    data.nextFollow = toISO(data.nextFollowInput);
    data.stage ||= "新询盘";
    data.phone = primaryContact(data);
    data.email ||= contactByType(data, "邮箱");
    data.follows = mergeFollow(editing.id ? findRecord("inquiry", editing.id)?.follows : [], data);
  }
  if (type === "order") {
    data.piDate = toISO(data.piDateInput) || formatISO(new Date());
    data.deliveryDate = toISO(data.deliveryInput);
    data.portLoading ||= ORDER_DEFAULTS.portLoading;
    data.payment ||= ORDER_DEFAULTS.payment;
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
  const inquiry = { ...(existing || {}), customerRef: customer.id, id: existing?.id || makeInquiryId(date), dateInput: customer.firstContactInput, date, customerName: customer.name, customerKind: customer.customerKind, companyName: customer.companyName, personName: customer.personName, position: customer.position, contacts: customer.contacts || [], country: customer.country, nature: customer.nature, source: customer.source, stage: customer.stage === "已报价" ? "已报价" : "已回复", level: customer.level, productCategories: customer.productCategories || [], productModels: customer.productModels || [], need: customer.nextAction, sendContent: customer.nextAction, nextFollowInput: customer.nextFollowInput, nextFollow: customer.nextFollow, notes: customer.notes, chatImages: customer.chatImages || [], profileImages: customer.profileImages || [] };
  if (existing) Object.assign(existing, inquiry); else state.inquiries.push(inquiry);
}

function syncCustomerFromInquiry(inquiry) {
  const existing = state.customers.find((x) => samePerson(x, inquiry));
  const customer = { ...(existing || {}), id: existing?.id || crypto.randomUUID(), name: inquiry.customerName, customerKind: inquiry.customerKind, companyName: inquiry.companyName, personName: inquiry.personName, position: inquiry.position, contacts: inquiry.contacts || existing?.contacts || [], firstContactInput: existing?.firstContactInput || inquiry.dateInput, firstContact: existing?.firstContact || inquiry.date, country: inquiry.country, nature: inquiry.nature, source: inquiry.source, level: inquiry.level, productCategories: inquiry.productCategories || [], productModels: inquiry.productModels || [], nextFollowInput: inquiry.nextFollowInput, nextFollow: inquiry.nextFollow, nextAction: inquiry.sendContent || inquiry.need, notes: inquiry.notes, chatImages: inquiry.chatImages || existing?.chatImages || [], profileImages: inquiry.profileImages || existing?.profileImages || [] };
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
  return (item.contacts || []).find((x) => x.type === type)?.value || "";
}

function latestFollow(item) {
  return (item.follows || [])[item.follows.length - 1];
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
  const byCapacity = compact ? PRODUCT_PARAMS.find((item) => String(item["内胆容量"] || "").includes(String(compact.model).match(/[\d.]+L/)?.[0] || "")) : null;
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
  const follows = record.follows?.length ? `<div class="detail-row wide-detail"><span>跟进时间线</span>${record.follows.map((f) => `<strong>${escapeHtml(f.date)}：${escapeHtml(f.content)} ｜ 要发：${escapeHtml(f.sendContent || "")}</strong>`).join("")}</div>` : "";
  const chat = (record.chatImages || []).map(imageThumb).join("");
  const profile = (record.profileImages || []).map(imageThumb).join("");
  return `${rows}${follows}<div class="detail-images"><h4>聊天图片</h4>${chat || "<p>没有聊天图片</p>"}</div><div class="detail-images"><h4>资料图片</h4>${profile || "<p>没有资料图片</p>"}</div>`;
}

function imageCount(item) {
  const c = item.chatImages?.length || 0;
  const p = item.profileImages?.length || 0;
  return c || p ? `<span class="tag">聊天${c} / 资料${p}</span>` : "";
}

function contactSummary(item) {
  return item.contacts?.length ? item.contacts.map((x) => `${x.type}: ${escapeHtml(x.value)}`).join("<br>") : "";
}

function orderProducts(order) {
  return (order.items || []).map((x) => x.description).filter(Boolean).join("、");
}

function lineAmount(item) {
  return Number(item.qty || 0) * Number(item.unitPrice || 0);
}

function orderTotal(order) {
  return (order.items || []).reduce((sum, item) => sum + lineAmount(item), 0) + Number(order.freight || 0);
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

document.querySelectorAll(".nav-btn").forEach((btn) => btn.addEventListener("click", () => { currentView = btn.dataset.view; render(); }));
document.getElementById("quickAddBtn").addEventListener("click", () => openForm({ dashboard: "customer", customers: "customer", inquiries: "inquiry", orders: "order", products: "inquiry" }[currentView] || "inquiry"));
document.getElementById("recordForm").addEventListener("submit", saveForm);
document.getElementById("cancelBtn").addEventListener("click", () => document.getElementById("formDialog").close());
document.getElementById("closeDialogBtn").addEventListener("click", () => document.getElementById("formDialog").close());
document.getElementById("closeDetailBtn").addEventListener("click", () => document.getElementById("detailDialog").close());
document.getElementById("detailDoneBtn").addEventListener("click", () => document.getElementById("detailDialog").close());
document.getElementById("detailEditBtn").addEventListener("click", () => { if (detailTarget) { document.getElementById("detailDialog").close(); openForm(detailTarget.type, detailTarget.id); } });
document.getElementById("clearInquiryFilters")?.addEventListener("click", () => { ["inquiryStageFilter", "inquirySourceFilter", "inquiryProductFilter", "inquirySearch"].forEach((id) => document.getElementById(id).value = ""); render(); });

document.body.addEventListener("click", (e) => {
  const removeContact = e.target.closest("[data-remove-contact]");
  const removeItem = e.target.closest("[data-remove-item]");
  const edit = e.target.closest("[data-edit-type]");
  const del = e.target.closest("[data-delete-type]");
  const detail = e.target.closest("[data-detail-type]");
  const focus = e.target.closest("[data-focus-inquiry]");
  const addFollow = e.target.closest("[data-add-follow]");
  const preview = e.target.closest("[data-preview-order]");
  const productDetail = e.target.closest("[data-product-detail]");
  const productLang = e.target.closest("[data-product-lang]");
  if (removeContact) removeContact.closest(".contact-row").remove();
  else if (removeItem) removeItem.closest(".order-item-row").remove();
  else if (edit) openForm(edit.dataset.editType, edit.dataset.editId);
  else if (del) deleteRecord(del.dataset.deleteType, del.dataset.deleteId);
  else if (focus) { activeInquiryId = focus.dataset.focusInquiry; renderInquiries(); }
  else if (addFollow) { const item = findRecord("inquiry", addFollow.dataset.addFollow); openForm("inquiry", item.id); }
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
document.getElementById("loginBtn")?.addEventListener("click", async () => {
  if (!supabaseClient) return alert("Supabase 没有加载成功，请检查网络。");
  const email = document.getElementById("emailLoginInput")?.value.trim();
  if (!email) return alert("先输入你的邮箱。");
  const { error } = await supabaseClient.auth.signInWithOtp({
    email,
    options: {
      emailRedirectTo: window.location.origin + window.location.pathname,
    },
  });
  if (error) {
    console.error(error);
    alert(`发送失败：${error.message || "请检查 Supabase 邮箱登录设置"}`);
  } else {
    setCloudStatus("登录链接已发送，请去邮箱点击链接");
    alert("登录链接已发送到邮箱，点击邮件里的链接就能登录。");
  }
});
document.getElementById("logoutBtn")?.addEventListener("click", async () => {
  if (!supabaseClient) return;
  await supabaseClient.auth.signOut();
});
document.addEventListener("keydown", (e) => { if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "z" && !["INPUT", "TEXTAREA"].includes(document.activeElement.tagName)) { e.preventDefault(); undo(); } });

saveState();
render();
initCloudAuth();
