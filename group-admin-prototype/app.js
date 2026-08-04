const loginView = document.querySelector("#loginView");
const adminView = document.querySelector("#adminView");
const loginForm = document.querySelector("#loginForm");
const loginUsername = document.querySelector("#loginUsername");
const loginPassword = document.querySelector("#loginPassword");
const loginError = document.querySelector("#loginError");
const authenticatedSessionKey = "mcGroupAdminAuthenticated";
const allowedUsernameDigest = "a0ccc593e9fa5e37825f67c5d95b87ce4635c2e457e00fbb689b9b34c995df6e";
const allowedPasswordDigest = "1682e5d97b4d2513d10629e9c8f588d0bc58e491dce833b3e5304620f6dcb469";

async function digestText(value) {
  const bytes = new TextEncoder().encode(value);
  const hash = await crypto.subtle.digest("SHA-256", bytes);
  return Array.from(new Uint8Array(hash), (byte) => byte.toString(16).padStart(2, "0")).join("");
}

function showLogin() {
  adminView.classList.add("hidden");
  loginView.classList.remove("hidden");
  loginError.textContent = "";
  loginPassword.value = "";
  window.setTimeout(() => loginUsername.focus(), 0);
}

function showAdmin() {
  loginView.classList.add("hidden");
  adminView.classList.remove("hidden");
  loginError.textContent = "";
  loginForm.reset();
  loginPassword.type = "password";
  document.querySelector("#togglePassword").textContent = "顯示";
  window.scrollTo({ top: 0, behavior: "instant" });
}

const stores = [
  { id: "MC-MO-001", name: "澳門總店", short: "澳", type: "MC 自營", currency: "MOP", timezone: "Asia/Macau", channels: "Mpay / 微信支付", status: "營業中", orders: 1268, gross: "MOP 186,420", refund: "MOP 4,360", rate: "98.4%", address: "澳門南灣大馬路 88 號", phone: "+853 28•• ••88" },
  { id: "MC-MO-002", name: "氹仔旗艦店", short: "氹", type: "MC 自營", currency: "MOP", timezone: "Asia/Macau", channels: "Mpay", status: "營業中", orders: 936, gross: "MOP 142,880", refund: "MOP 5,120", rate: "96.8%", address: "氹仔基馬拉斯大馬路 28 號", phone: "+853 28•• ••26" },
  { id: "MC-MO-003", name: "路環服務店", short: "路", type: "MC 自營", currency: "MOP", timezone: "Asia/Macau", channels: "Mpay", status: "營業中", orders: 382, gross: "MOP 56,350", refund: "MOP 1,260", rate: "98.1%", address: "路環石排灣馬路 16 號", phone: "+853 28•• ••31" },
  { id: "MC-HK-001", name: "九龍展示店", short: "九", type: "MC 自營", currency: "HKD", timezone: "Asia/Hong_Kong", channels: "微信支付", status: "營業中", orders: 428, gross: "HKD 92,760", refund: "HKD 2,080", rate: "97.2%", address: "九龍觀塘成業街 18 號", phone: "+852 3••• ••92" },
  { id: "MC-MO-004", name: "黑沙環校服店", short: "黑", type: "MC 自營", currency: "MOP", timezone: "Asia/Macau", channels: "Mpay", status: "營業中", orders: 214, gross: "MOP 29,000", refund: "MOP 1,740", rate: "98.8%", address: "澳門黑沙環新街 102 號", phone: "+853 28•• ••10" },
  { id: "MC-MO-005", name: "南灣團體服店", short: "南", type: "MC 自營", currency: "MOP", timezone: "Asia/Macau", channels: "Mpay", status: "營業中", orders: 58, gross: "MOP 14,000", refund: "MOP 0", rate: "99.1%", address: "澳門南灣湖景大馬路 5 號", phone: "+853 28•• ••57" },
  { id: "APPLY-0007", name: "啟星運動用品", short: "啟", type: "外部品牌", currency: "MOP", timezone: "Asia/Macau", channels: "未綁定", status: "待審核", orders: 0, gross: "MOP 0", refund: "MOP 0", rate: "—", address: "澳門慕拉士大馬路 77 號", phone: "+853 6••• ••19" },
  { id: "MC-MO-006", name: "舊區快閃店", short: "舊", type: "MC 自營", currency: "MOP", timezone: "Asia/Macau", channels: "Mpay（停用）", status: "停用", orders: 0, gross: "MOP 0", refund: "MOP 0", rate: "—", address: "澳門沙梨頭海邊街 9 號", phone: "—" },
];

const storeAdmins = [
  { id: "SADM-001", username: "store.liang", name: "梁雅琪", phone: "+853 6••• 2188", email: "li•••@mc-mall.com", storeIds: ["MC-MO-001", "MC-MO-002", "MC-MO-004"], status: "啟用", lastLogin: "2026-08-04 09:18" },
  { id: "SADM-002", username: "store.ho", name: "何志明", phone: "+853 6••• 9032", email: "ho•••@mc-mall.com", storeIds: ["MC-MO-001", "MC-MO-002"], status: "啟用", lastLogin: "2026-08-04 08:42" },
  { id: "SADM-003", username: "store.chow", name: "周凱琳", phone: "+853 6••• 1726", email: "ch•••@mc-mall.com", storeIds: ["MC-MO-003", "MC-MO-005"], status: "啟用", lastLogin: "2026-08-03 18:16" },
  { id: "SADM-004", username: "store.kwok", name: "郭詠欣", phone: "+852 5••• 6280", email: "kw•••@mc-mall.com", storeIds: ["MC-HK-001"], status: "啟用", lastLogin: "2026-08-03 16:08" },
  { id: "SADM-005", username: "store.pending", name: "待配置管理員", phone: "—", email: "—", storeIds: [], status: "啟用", lastLogin: "尚未登入" },
  { id: "SADM-006", username: "store.former", name: "已離職人員", phone: "—", email: "—", storeIds: ["MC-MO-006"], status: "停用", lastLogin: "2026-06-28 10:16" },
];

const categories = [
  { id: "CAT-001", name: "校服", level: 1, products: 126, sort: 10, status: "啟用" },
  { id: "CAT-011", name: "日常校服", level: 2, products: 72, sort: 10, status: "啟用" },
  { id: "CAT-111", name: "上衣", level: 3, products: 38, sort: 10, status: "啟用" },
  { id: "CAT-112", name: "下裝", level: 3, products: 34, sort: 20, status: "啟用" },
  { id: "CAT-012", name: "運動校服", level: 2, products: 54, sort: 20, status: "啟用" },
  { id: "CAT-121", name: "運動套裝", level: 3, products: 54, sort: 10, status: "啟用" },
  { id: "CAT-002", name: "團體服", level: 1, products: 84, sort: 20, status: "啟用" },
  { id: "CAT-021", name: "企業服裝", level: 2, products: 43, sort: 10, status: "啟用" },
  { id: "CAT-211", name: "Polo 衫", level: 3, products: 43, sort: 10, status: "啟用" },
  { id: "CAT-003", name: "配件", level: 1, products: 31, sort: 30, status: "啟用" },
  { id: "CAT-031", name: "舊版配件", level: 2, products: 0, sort: 99, status: "停用" },
];

const organizations = [
  { id: "ORG-SJS", code: "SJS", name: "聖若瑟教區中學", type: "學校", contact: "校務處 · +853 28•• ••36", stores: 3, products: 38, status: "啟用" },
  { id: "ORG-PUICHING", code: "PUICHING", name: "培正中學", type: "學校", contact: "採購負責人 · +853 28•• ••62", stores: 2, products: 27, status: "啟用" },
  { id: "ORG-HOKONG", code: "HOKONG", name: "濠江中學", type: "學校", contact: "校服組 · +853 28•• ••41", stores: 2, products: 19, status: "啟用" },
  { id: "ORG-TEAM-MY", code: "TEAM-MY", name: "澳門青少年球隊", type: "球隊", contact: "球隊領隊 · +853 6••• ••82", stores: 2, products: 16, status: "啟用" },
  { id: "ORG-MC-RETAIL", code: "MC-RETAIL", name: "MC 自營零售", type: "企業", contact: "集團營運組", stores: 6, products: 74, status: "啟用" },
  { id: "ORG-MACAU-YOUTH", code: "MYA", name: "澳門青年社團", type: "社團", contact: "活動統籌 · +853 6••• ••17", stores: 1, products: 8, status: "啟用" },
  { id: "ORG-LEGACY-01", code: "LEGACY-01", name: "舊版測試單位", type: "企業", contact: "—", stores: 0, products: 0, status: "停用" },
];

const customers = [
  { id: "MBR-018920", name: "陳詠琪", initials: "陳", phone: "+853 6••• 2188", source: "澳門總店", orders: "12 單 / 3 店", spend: "MOP 8,640", points: "8,640", status: "有效" },
  { id: "MBR-018742", name: "梁家俊", initials: "梁", phone: "+853 6••• 9032", source: "H5 自助註冊", orders: "7 單 / 2 店", spend: "MOP 4,280", points: "3,980", status: "有效" },
  { id: "MBR-018536", name: "黃敏儀", initials: "黃", phone: "+853 6••• 1726", source: "氹仔旗艦店", orders: "5 單 / 1 店", spend: "MOP 3,120", points: "3,120", status: "有效" },
  { id: "MBR-017998", name: "何俊朗", initials: "何", phone: "+852 5••• 6280", source: "九龍展示店", orders: "3 單 / 1 店", spend: "HKD 2,460", points: "2,460", status: "有效" },
  { id: "MBR-016321", name: "周美玲", initials: "周", phone: "+853 6••• 5509", source: "澳門總店", orders: "2 單 / 2 店", spend: "MOP 1,880", points: "1,540", status: "凍結" },
];

const opportunities = [
  { id: "OPP-260803-019", title: "聖若瑟五校新學年校服", customer: "聖若瑟教區中學第五校", type: "學校合作", source: "澳門總店", owner: "陳嘉雯", amount: "MOP 128,000", stage: "方案洽談", follow: "2026-08-05" },
  { id: "OPP-260802-012", title: "科技公司運動會團體服", customer: "澳門卓越科技有限公司", type: "團購諮詢", source: "H5 諮詢", owner: "李俊傑", amount: "MOP 46,000", stage: "需求確認", follow: "2026-08-04" },
  { id: "OPP-260801-008", title: "酒店前線制服改版", customer: "海灣酒店集團", type: "定制諮詢", source: "氹仔旗艦店", owner: "陳嘉雯", amount: "MOP 86,000", stage: "報價中", follow: "2026-08-06" },
  { id: "OPP-260731-031", title: "青少年球隊比賽服", customer: "啟航青訓中心", type: "團購諮詢", source: "路環服務店", owner: "未分配", amount: "MOP 26,000", stage: "新線索", follow: "待安排" },
];

const paymentConfigs = [
  { id: "PAY-001", channelCode: "MPAY", displayName: "澳設共享商戶號", merchantMasked: "MPAY-MC-••••-8832", environment: "正式環境", boundStores: 5, status: "正常", lastChecked: "2026-08-03 09:18", appIdConfigured: true, secretReferenceConfigured: true },
  { id: "PAY-002", channelCode: "MPAY", displayName: "氹仔獨立商戶號", merchantMasked: "MPAY-TI-••••-1906", environment: "正式環境", boundStores: 1, status: "異常", lastChecked: "2026-08-03 09:06", appIdConfigured: true, secretReferenceConfigured: true },
  { id: "PAY-003", channelCode: "WECHATPAY", displayName: "香港業務商戶號", merchantMasked: "WX-HK-••••-6721", environment: "正式環境", boundStores: 1, status: "正常", lastChecked: "2026-08-03 09:21", appIdConfigured: true, secretReferenceConfigured: true },
  { id: "PAY-004", channelCode: "WECHATPAY", displayName: "集成測試商戶號", merchantMasked: "WX-TEST-••••-0018", environment: "測試環境", boundStores: 0, status: "已停用", lastChecked: "2026-07-26 18:42", appIdConfigured: false, secretReferenceConfigured: true },
];

const pageTitles = { stores: "門店管理", storeAdmins: "門店管理員", categories: "集團商品分類", units: "學校與團體單位", payments: "支付配置", customers: "客戶與會員", crm: "CRM 與商機", accounts: "集團帳號", roles: "角色權限" };
const modal = document.querySelector("#modal");
const modalBody = document.querySelector("#modalBody");
const modalFooter = document.querySelector("#modalFooter");
const modalTitle = document.querySelector("#modalTitle");
const modalEyebrow = document.querySelector("#modalEyebrow");
let unitTab = "all";
let paymentView = "channels";

function statusClass(value) {
  if (["營業中", "啟用", "有效", "已完成", "正常", "成功", "一致"].includes(value)) return "success";
  if (["待審核", "方案洽談", "報價中", "待確認"].includes(value)) return "warning";
  if (["停用", "凍結", "已停用"].includes(value)) return "disabled";
  if (["異常", "有差異", "已拒絕"].includes(value)) return "danger";
  return "blue";
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"]/g, (character) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[character]);
}

function maskMerchantAccount(value, channelCode) {
  const suffix = value.replace(/[^a-z0-9]/gi, "").slice(-4).toUpperCase() || "••••";
  return `${channelCode}-••••-${suffix}`;
}

function storeCell(store) {
  return `<div class="store-cell"><span class="store-logo">${store.short}</span><div><strong>${store.name}</strong><small>${store.type}</small></div></div>`;
}

function renderStores() {
  const keyword = document.querySelector("#storeSearch").value.trim().toLowerCase();
  const currency = document.querySelector("#storeCurrency").value;
  const rows = stores.filter((store) => {
    const matchesWord = `${store.name}${store.id}`.toLowerCase().includes(keyword);
    return matchesWord && (currency === "all" || store.currency === currency);
  });
  document.querySelector("#storeRows").innerHTML = rows.length ? rows.map((store) => `<tr><td>${storeCell(store)}</td><td><span class="masked">${store.id}</span></td><td>${store.type}</td><td><b>${store.currency}</b><br><small>${store.timezone}</small></td><td>${store.channels}</td><td><div class="row-actions"><button data-store-detail="${store.id}">查看</button><button data-store-edit="${store.id}">配置</button>${store.status === "待審核" ? `<button data-store-review="${store.id}">審核</button>` : `<button class="${store.status === "營業中" ? "danger-link" : ""}" data-store-toggle="${store.id}">${store.status === "營業中" ? "停用" : "啟用"}</button>`}</div></td></tr>`).join("") : `<tr><td colspan="6"><div class="empty-state"><strong>未找到符合條件的門店</strong>請調整搜尋或篩選條件。</div></td></tr>`;
  document.querySelector("#storeCount").textContent = `共 ${rows.length} 間門店`;
  bindStoreActions();
}

function getBoundStores(admin) {
  return admin.storeIds.map((storeId) => stores.find((store) => store.id === storeId)).filter(Boolean);
}

function renderAdminStoreBindings(admin) {
  const boundStores = getBoundStores(admin);
  if (!boundStores.length) return `<span class="unbound-label">未綁定</span>`;
  return `<div class="binding-chips">${boundStores.map((store) => `<span>${store.name}</span>`).join("")}</div>`;
}

function renderStoreAdmins() {
  const keyword = document.querySelector("#storeAdminSearch").value.trim().toLowerCase();
  const status = document.querySelector("#storeAdminStatus").value;
  const binding = document.querySelector("#storeAdminBinding").value;
  const rows = storeAdmins.filter((admin) => {
    const storeText = getBoundStores(admin).map((store) => `${store.name}${store.id}`).join("");
    const matchesKeyword = `${admin.username}${admin.name}${storeText}`.toLowerCase().includes(keyword);
    const matchesBinding = binding === "all" || (binding === "bound" ? admin.storeIds.length > 0 : admin.storeIds.length === 0);
    return matchesKeyword && matchesBinding && (status === "all" || admin.status === status);
  });
  document.querySelector("#storeAdminRows").innerHTML = rows.length ? rows.map((admin) => `<tr><td><strong>${admin.username}</strong><br><small class="masked">${admin.id}</small></td><td>${admin.name}</td><td>${admin.phone}<br><small>${admin.email}</small></td><td>${renderAdminStoreBindings(admin)}</td><td>${admin.lastLogin}</td><td><span class="status ${statusClass(admin.status)}">${admin.status}</span></td><td><div class="row-actions"><button data-store-admin-detail="${admin.id}">查看</button><button data-store-admin-edit="${admin.id}">編輯／綁定門店</button><button data-store-admin-password="${admin.id}">重置密碼</button><button class="danger-link" data-store-admin-delete="${admin.id}">刪除</button></div></td></tr>`).join("") : `<tr><td colspan="7"><div class="empty-state"><strong>未找到符合條件的管理員</strong>請調整搜尋或篩選條件。</div></td></tr>`;
  document.querySelector("#storeAdminCount").textContent = `共 ${rows.length} 個管理員`;
  document.querySelectorAll("[data-store-admin-detail]").forEach((button) => button.addEventListener("click", () => openStoreAdminDetail(storeAdmins.find((admin) => admin.id === button.dataset.storeAdminDetail))));
  document.querySelectorAll("[data-store-admin-edit]").forEach((button) => button.addEventListener("click", () => openStoreAdminDialog(storeAdmins.find((admin) => admin.id === button.dataset.storeAdminEdit))));
  document.querySelectorAll("[data-store-admin-password]").forEach((button) => button.addEventListener("click", () => openStoreAdminPasswordReset(storeAdmins.find((admin) => admin.id === button.dataset.storeAdminPassword))));
  document.querySelectorAll("[data-store-admin-delete]").forEach((button) => button.addEventListener("click", () => {
    const admin = storeAdmins.find((item) => item.id === button.dataset.storeAdminDelete);
    openConfirm("刪除門店管理員", `確認刪除管理員「${admin.name}（${admin.username}）」？其與 ${admin.storeIds.length} 間門店的授權關係將一併解除，門店帳套與歷史資料不受影響。`, "確認刪除", () => {
      const index = storeAdmins.findIndex((item) => item.id === admin.id);
      if (index >= 0) storeAdmins.splice(index, 1);
      closeModal(); renderStoreAdmins(); showToast("門店管理員已刪除");
    });
  }));
}

function renderStoreBindingChoices(selectedStoreIds) {
  const selected = new Set(selectedStoreIds);
  return `<div class="store-binding-grid">${stores.map((store) => `<label class="binding-option"><input type="checkbox" name="storeIds" value="${store.id}" ${selected.has(store.id) ? "checked" : ""}><span class="store-logo">${store.short}</span><span><strong>${store.name}</strong><small>${store.id} · ${store.currency}</small></span></label>`).join("")}</div>`;
}

function openStoreAdminDialog(admin) {
  const editing = Boolean(admin);
  const passwordFields = editing ? "" : `<label>初始密碼 <span class="required">*</span><input name="initialPassword" type="password" autocomplete="new-password" minlength="8" required placeholder="至少 8 個字元"></label><label>確認初始密碼 <span class="required">*</span><input name="confirmPassword" type="password" autocomplete="new-password" minlength="8" required placeholder="再次輸入初始密碼"></label>`;
  const accountFields = `<form id="storeAdminForm" class="form-grid"><label>登入帳號 <span class="required">*</span><input name="username" required value="${admin?.username || ""}" ${editing ? "disabled" : ""} placeholder="例如 store.chan"></label><label>管理員姓名 <span class="required">*</span><input name="name" required value="${admin?.name || ""}" placeholder="請輸入姓名"></label><label>聯絡電話<input name="phone" value="${admin?.phone === "—" ? "" : admin?.phone || ""}" placeholder="請輸入聯絡電話"></label><label>電郵地址<input name="email" value="${admin?.email === "—" ? "" : admin?.email || ""}" placeholder="請輸入電郵地址"></label>${passwordFields}<label>帳號狀態<select name="status"><option ${admin?.status !== "停用" ? "selected" : ""}>啟用</option><option ${admin?.status === "停用" ? "selected" : ""}>停用</option></select></label></form>`;
  const bindingSection = editing ? `<div class="detail-section"><div class="section-title-row"><div><h3>綁定門店</h3><small>可多選；每間門店也可同時綁定其他管理員。</small></div><span id="adminBindingCount" class="selection-count">已選 ${admin.storeIds.length} 間</span></div>${renderStoreBindingChoices(admin.storeIds)}</div>` : `<div class="boundary-box">初始密碼由集團後台設定，本原型不保存或回顯明文。帳號建立後預設不綁定門店，可再從列表編輯門店授權。</div>`;
  openModal(editing ? "編輯門店管理員" : "新增門店管理員", "STORE ADMINISTRATOR", `${accountFields}${bindingSection}`, `<button class="secondary-button" id="modalCancel">取消</button><button class="primary-button" id="modalConfirm">${editing ? "儲存管理員與門店綁定" : "建立管理員帳號"}</button>`);
  if (!editing) document.querySelector("#storeAdminForm").elements.confirmPassword.addEventListener("input", (event) => event.currentTarget.setCustomValidity(""));
  if (editing) {
    document.querySelectorAll('.store-binding-grid input[name="storeIds"]').forEach((checkbox) => checkbox.addEventListener("change", () => {
      const count = document.querySelectorAll('.store-binding-grid input[name="storeIds"]:checked').length;
      document.querySelector("#adminBindingCount").textContent = `已選 ${count} 間`;
    }));
  }
  bindModalButtons(() => {
    const form = document.querySelector("#storeAdminForm");
    if (!editing) form.elements.confirmPassword.setCustomValidity("");
    if (!form.reportValidity()) return;
    const data = Object.fromEntries(new FormData(form));
    if (!editing && data.initialPassword !== data.confirmPassword) {
      form.elements.confirmPassword.setCustomValidity("兩次輸入的密碼不一致");
      form.elements.confirmPassword.reportValidity();
      return;
    }
    if (editing) {
      Object.assign(admin, { name: data.name, phone: data.phone || "—", email: data.email || "—", status: data.status, storeIds: Array.from(document.querySelectorAll('.store-binding-grid input[name="storeIds"]:checked'), (input) => input.value) });
    } else {
      storeAdmins.push({ id: `SADM-${Date.now()}`, username: data.username, name: data.name, phone: data.phone || "—", email: data.email || "—", storeIds: [], status: data.status, lastLogin: "尚未登入", passwordUpdatedAt: "剛剛" });
    }
    closeModal(); renderStoreAdmins(); showToast(editing ? "管理員及門店綁定已儲存" : "管理員帳號已建立，請繼續編輯綁定門店");
  });
}

function openStoreAdminDetail(admin) {
  openModal(admin.name, "STORE ADMINISTRATOR DETAIL", `<div class="detail-grid"><div><small>管理員帳號</small><strong>${admin.username}</strong></div><div><small>帳號狀態</small><strong><span class="status ${statusClass(admin.status)}">${admin.status}</span></strong></div><div><small>聯絡電話</small><strong>${admin.phone}</strong></div><div><small>電郵地址</small><strong>${admin.email}</strong></div><div><small>最近登入</small><strong>${admin.lastLogin}</strong></div><div><small>最近設定密碼</small><strong>${admin.passwordUpdatedAt || "未記錄"}</strong></div><div><small>已綁定門店數</small><strong>${admin.storeIds.length} 間</strong></div></div><div class="detail-section"><h3>可管理門店</h3>${renderAdminStoreBindings(admin)}</div><div class="boundary-box">管理員進入門店後仍以所選 store_tenant_id 作為資料邊界；多店授權不形成新的帳套，也不允許跨店合併業務資料。</div>`, `<button class="secondary-button" id="modalCancel">關閉</button><button class="secondary-button" id="modalResetPassword">重置密碼</button><button class="primary-button" id="modalConfirm">編輯／綁定門店</button>`);
  document.querySelector("#modalResetPassword").addEventListener("click", () => openStoreAdminPasswordReset(admin));
  bindModalButtons(() => { closeModal(); openStoreAdminDialog(admin); });
}

function openStoreAdminPasswordReset(admin) {
  openModal("重置管理員密碼", "PASSWORD RESET", `<div class="detail-grid"><div><small>管理員帳號</small><strong>${admin.username}</strong></div><div><small>管理員姓名</small><strong>${admin.name}</strong></div></div><form id="storeAdminPasswordForm" class="form-grid password-reset-form"><label>新密碼 <span class="required">*</span><input name="newPassword" type="password" autocomplete="new-password" minlength="8" required placeholder="至少 8 個字元"></label><label>確認新密碼 <span class="required">*</span><input name="confirmPassword" type="password" autocomplete="new-password" minlength="8" required placeholder="再次輸入新密碼"></label></form><div class="boundary-box">提交後立即覆蓋原密碼。本原型只演示後台重置流程，不保存或回顯任何明文密碼。</div>`, `<button class="secondary-button" id="modalCancel">取消</button><button class="primary-button" id="modalConfirm">確認重置密碼</button>`);
  document.querySelector("#storeAdminPasswordForm").elements.confirmPassword.addEventListener("input", (event) => event.currentTarget.setCustomValidity(""));
  bindModalButtons(() => {
    const form = document.querySelector("#storeAdminPasswordForm");
    form.elements.confirmPassword.setCustomValidity("");
    if (!form.reportValidity()) return;
    const data = Object.fromEntries(new FormData(form));
    if (data.newPassword !== data.confirmPassword) {
      form.elements.confirmPassword.setCustomValidity("兩次輸入的密碼不一致");
      form.elements.confirmPassword.reportValidity();
      return;
    }
    admin.passwordUpdatedAt = "剛剛";
    closeModal(); renderStoreAdmins(); showToast("管理員密碼已重置");
  });
}

function renderCategories() {
  const keyword = document.querySelector("#categorySearch").value.trim().toLowerCase();
  const rows = categories.filter((category) => category.name.toLowerCase().includes(keyword));
  document.querySelector("#categoryRows").innerHTML = rows.map((category) => `<tr><td><span class="tree-name tree-level-${category.level}"><span class="tree-toggle">${category.level < 3 ? "⌄" : "└"}</span><span class="category-icon">◇</span><strong>${category.name}</strong></span></td><td>${category.sort}</td><td><span class="status ${statusClass(category.status)}">${category.status}</span></td><td><div class="row-actions"><button data-category-edit="${category.id}">編輯</button>${category.status === "啟用" ? `<button class="danger-link" data-category-disable="${category.id}">停用</button>` : `<button data-category-disable="${category.id}">啟用</button>`}</div></td></tr>`).join("");
  document.querySelectorAll("[data-category-edit]").forEach((button) => button.addEventListener("click", () => openCategoryDialog(categories.find((item) => item.id === button.dataset.categoryEdit))));
  document.querySelectorAll("[data-category-disable]").forEach((button) => button.addEventListener("click", () => {
    const category = categories.find((item) => item.id === button.dataset.categoryDisable);
    const action = category.status === "啟用" ? "停用" : "啟用";
    openConfirm(`${action}分類`, `${action}「${category.name}」？${action === "停用" ? `目前已綁定 ${category.products} 件商品；停用後不可綁定新商品，既有商品不會自動刪除。` : "門店將可重新選擇符合條件的三級葉子分類。"}`, action, () => { category.status = action === "停用" ? "停用" : "啟用"; renderCategories(); showToast(`分類已${action}`); });
  }));
}

function organizationCell(organization) {
  return `<div class="store-cell"><span class="org-badge">${organization.name.slice(0, 2)}</span><div><strong>${organization.name}</strong><small>${organization.code}</small></div></div>`;
}

function renderOrganizations() {
  const keyword = document.querySelector("#unitSearch").value.trim().toLowerCase();
  const type = document.querySelector("#unitTypeFilter").value;
  const status = document.querySelector("#unitStatusFilter").value;
  const rows = organizations.filter((organization) => {
    const matchesKeyword = `${organization.name}${organization.code}${organization.contact}`.toLowerCase().includes(keyword);
    const matchesTab = unitTab === "all" || (unitTab === "團體" ? organization.type !== "學校" && organization.status !== "停用" : unitTab === "停用" ? organization.status === "停用" : organization.type === unitTab && organization.status !== "停用");
    return matchesKeyword && matchesTab && (type === "all" || organization.type === type) && (status === "all" || organization.status === status);
  });
  document.querySelector("#unitRows").innerHTML = rows.length ? rows.map((organization) => `<tr><td>${organizationCell(organization)}</td><td><span class="masked">${organization.code}</span></td><td>${organization.type}</td><td>${organization.contact}</td><td><span class="status ${statusClass(organization.status)}">${organization.status}</span></td><td><div class="row-actions"><button data-unit-detail="${organization.id}">查看</button><button data-unit-edit="${organization.id}">編輯</button><button class="${organization.status === "啟用" ? "danger-link" : ""}" data-unit-toggle="${organization.id}">${organization.status === "啟用" ? "停用" : "啟用"}</button></div></td></tr>`).join("") : `<tr><td colspan="6"><div class="empty-state"><strong>未找到符合條件的單位</strong>請調整搜尋或篩選條件。</div></td></tr>`;
  document.querySelector("#unitAllCount").textContent = organizations.length;
  document.querySelector("#unitSchoolCount").textContent = organizations.filter((item) => item.type === "學校" && item.status !== "停用").length;
  document.querySelector("#unitGroupCount").textContent = organizations.filter((item) => item.type !== "學校" && item.status !== "停用").length;
  document.querySelector("#unitDisabledCount").textContent = organizations.filter((item) => item.status === "停用").length;
  document.querySelector("#unitCount").textContent = `共 ${rows.length} 個單位`;
  document.querySelectorAll("[data-unit-detail]").forEach((button) => button.addEventListener("click", () => openOrganizationDetail(organizations.find((item) => item.id === button.dataset.unitDetail))));
  document.querySelectorAll("[data-unit-edit]").forEach((button) => button.addEventListener("click", () => openOrganizationDialog(organizations.find((item) => item.id === button.dataset.unitEdit))));
  document.querySelectorAll("[data-unit-toggle]").forEach((button) => button.addEventListener("click", () => {
    const organization = organizations.find((item) => item.id === button.dataset.unitToggle);
    const stopping = organization.status === "啟用";
    openConfirm(stopping ? "停用單位" : "啟用單位", stopping ? `停用「${organization.name}」後，門店不可再為新商品選擇此單位；既有 ${organization.products} 件商品不會自動刪除。` : `啟用「${organization.name}」後，門店可重新在商品資料中選擇此單位。`, stopping ? "確認停用" : "確認啟用", () => { organization.status = stopping ? "停用" : "啟用"; closeModal(); renderOrganizations(); showToast(`單位已${stopping ? "停用" : "啟用"}`); });
  }));
}

function openOrganizationDialog(organization) {
  const editing = Boolean(organization);
  openModal(editing ? "編輯學校／團體單位" : "新增學校／團體單位", "GROUP ORGANIZATION", `<form id="organizationForm" class="form-grid"><label>單位類型 <span class="required">*</span><select name="type"><option ${organization?.type === "學校" ? "selected" : ""}>學校</option><option ${organization?.type === "球隊" ? "selected" : ""}>球隊</option><option ${organization?.type === "企業" ? "selected" : ""}>企業</option><option ${organization?.type === "社團" ? "selected" : ""}>社團</option></select></label><label>單位編號 <span class="required">*</span><input name="code" required value="${organization?.code || ""}" ${editing ? "disabled" : ""} placeholder="例如 SJS 或 TEAM-MY"></label><label class="full">單位名稱 <span class="required">*</span><input name="name" required value="${organization?.name || ""}" placeholder="請輸入學校或團體全稱"></label><label>聯絡部門／窗口<input name="contactName" value="${organization?.contact.split(" · ")[0] || ""}" placeholder="例如校務處或球隊領隊"></label><label>聯絡電話<input name="contactPhone" value="${organization?.contact.split(" · ")[1] || ""}" placeholder="請輸入聯絡電話"></label><label class="full">單位 Logo／展示素材<input name="logo" placeholder="上傳 Logo 或填寫素材地址（原型入口）"></label></form><div class="boundary-box">儲存後此單位將同步作為門店商品的可選公共資料。門店只可引用，不可修改單位名稱、編號、類型或展示素材。</div>`, `<button class="secondary-button" id="modalCancel">取消</button><button class="primary-button" id="modalConfirm">${editing ? "儲存單位" : "新增單位"}</button>`);
  bindModalButtons(() => {
    const form = document.querySelector("#organizationForm");
    if (!form.reportValidity()) return;
    const data = Object.fromEntries(new FormData(form));
    const contact = [data.contactName, data.contactPhone].filter(Boolean).join(" · ") || "—";
    if (editing) Object.assign(organization, { name: data.name, type: data.type, contact });
    else organizations.push({ id: `ORG-${Date.now()}`, code: data.code.toUpperCase(), name: data.name, type: data.type, contact, stores: 0, products: 0, status: "啟用" });
    closeModal(); renderOrganizations(); showToast(editing ? "單位資料已更新" : "單位已新增");
  });
}

function openOrganizationDetail(organization) {
  openModal(organization.name, "GROUP ORGANIZATION DETAIL", `<div class="detail-grid"><div><small>單位編號</small><strong class="masked">${organization.code}</strong></div><div><small>狀態</small><strong><span class="status ${statusClass(organization.status)}">${organization.status}</span></strong></div><div><small>單位類型</small><strong>${organization.type}</strong></div><div><small>聯絡窗口</small><strong>${organization.contact}</strong></div><div><small>已關聯門店</small><strong>${organization.stores} 間</strong></div><div><small>已綁定商品</small><strong>${organization.products} 件</strong></div></div><div class="boundary-box">此資料由集團統一維護。門店可在商品、訂單篩選及商城導覽中引用，但不能新增、編輯或刪除。</div>`, `<button class="secondary-button" id="modalCancel">關閉</button><button class="primary-button" id="modalConfirm">編輯單位</button>`);
  bindModalButtons(() => { closeModal(); openOrganizationDialog(organization); });
}

function paymentRows() {
  const channelCount = new Set(paymentConfigs.map((config) => config.channelCode)).size;
  const productionCount = paymentConfigs.filter((config) => config.environment === "正式環境").length;
  const boundStoreCount = paymentConfigs.reduce((total, config) => total + config.boundStores, 0);
  const abnormalCount = paymentConfigs.filter((config) => config.status === "異常").length;
  return `<div class="payment-kpis"><article><span>支付渠道</span><strong>${channelCount}</strong><small>已完成平台接入</small></article><article><span>商戶號配置</span><strong>${paymentConfigs.length}</strong><small>${productionCount} 個正式環境</small></article><article><span>已綁定門店</span><strong>${boundStoreCount}</strong><small>新增配置需另行綁定</small></article><article><span>渠道異常</span><strong class="danger-text">${abnormalCount}</strong><small>回調延遲待處理</small></article></div><div class="table-wrap"><table><thead><tr><th>渠道</th><th>配置名稱</th><th>商戶號（脫敏）</th><th>狀態</th><th>最近檢查</th><th>操作</th></tr></thead><tbody>${paymentConfigs.map((config) => `<tr><td><strong>${config.channelCode}</strong></td><td>${escapeHtml(config.displayName)}</td><td class="masked">${config.merchantMasked}</td><td><span class="status ${statusClass(config.status)}">${config.status}</span></td><td>${config.lastChecked}</td><td><div class="row-actions"><button data-payment-detail="${config.id}">查看</button><button data-payment-edit="${config.id}">配置</button></div></td></tr>`).join("")}</tbody></table></div>`;
}

function bindingRows() {
  return `<div class="info-banner" style="padding:16px 18px"><span>i</span><p><strong>共享商戶號不等於共享帳套</strong><small>同一商戶號可綁定多店，但支付單、退款單與對帳仍必須保存 store_tenant_id 並回到原門店。</small></p></div><div class="table-wrap"><table><thead><tr><th>門店</th><th>本位幣</th><th>已啟用渠道</th><th>商戶號配置</th><th>展示排序</th><th>可用狀態</th><th>操作</th></tr></thead><tbody>${stores.slice(0,7).map((store, index) => `<tr><td>${storeCell(store)}</td><td><b>${store.currency}</b></td><td>${store.channels}</td><td class="masked">${index === 6 ? "—" : index === 3 ? "WX-HK-••••-6721" : "MPAY-MC-••••-8832"}</td><td>${index === 6 ? "—" : "1"}</td><td><span class="status ${index === 6 ? "warning" : index === 1 ? "danger" : "success"}">${index === 6 ? "待綁定" : index === 1 ? "異常" : "可用"}</span></td><td><div class="row-actions"><button data-bind-store="${store.id}">管理綁定</button></div></td></tr>`).join("")}</tbody></table></div>`;
}

function reconciliationRows() {
  const rows = [["2026-08-02", "澳門總店", "MOP", "186", "MOP 32,680", "MOP 32,680", "一致"], ["2026-08-02", "氹仔旗艦店", "MOP", "128", "MOP 24,920", "MOP 24,680", "有差異"], ["2026-08-02", "九龍展示店", "HKD", "72", "HKD 16,480", "HKD 16,480", "一致"], ["2026-08-01", "路環服務店", "MOP", "61", "MOP 10,260", "MOP 10,260", "一致"]];
  return `<div class="payment-kpis"><article><span>昨日支付單</span><strong>447</strong><small>按門店獨立歸屬</small></article><article><span>支付成功率</span><strong>97.8%</strong><small class="positive">高於 30 日均值</small></article><article><span>退款金額</span><strong>MOP 1,260</strong><small>沿用原訂單支付路徑</small></article><article><span>對帳差異</span><strong class="danger-text">2</strong><small>待支付配置管理員確認</small></article></div><div class="table-wrap"><table><thead><tr><th>對帳日期</th><th>門店帳套</th><th>本位幣</th><th>支付筆數</th><th>平台支付金額</th><th>渠道結算金額</th><th>結果</th><th>操作</th></tr></thead><tbody>${rows.map((item) => `<tr>${item.slice(0,6).map((value) => `<td>${value}</td>`).join("")}<td><span class="status ${statusClass(item[6])}">${item[6]}</span></td><td><div class="row-actions"><button data-reconcile-detail>查看明細</button></div></td></tr>`).join("")}</tbody></table></div>`;
}

function renderPayments() {
  const titleMap = { channels: ["支付渠道與商戶號", "密鑰、證書與回調配置僅支付配置管理員可維護，列表一律脫敏。", "新增商戶號"], bindings: ["門店渠道綁定", "每家門店可綁定多個渠道；完整商戶密鑰不向門店展示。", "新增綁定"], reconciliation: ["交易與對帳", "跨店只讀查看支付、退款及對帳結果，不在集團後台代替門店審核退款。", "匯出對帳摘要"] };
  const [title, note, action] = titleMap[paymentView];
  document.querySelector("#paymentPanelTitle").textContent = title;
  document.querySelector("#paymentPanelNote").textContent = note;
  document.querySelector("#paymentPrimaryAction").textContent = action;
  document.querySelector("#paymentContent").innerHTML = paymentView === "channels" ? paymentRows() : paymentView === "bindings" ? bindingRows() : reconciliationRows();
  document.querySelectorAll("[data-payment-detail]").forEach((button) => button.addEventListener("click", () => openPaymentDetail(paymentConfigs.find((config) => config.id === button.dataset.paymentDetail))));
  document.querySelectorAll("[data-payment-edit]").forEach((button) => button.addEventListener("click", openPaymentConfig));
  document.querySelectorAll("[data-bind-store]").forEach((button) => button.addEventListener("click", () => openBindingDialog(stores.find((store) => store.id === button.dataset.bindStore))));
  document.querySelectorAll("[data-reconcile-detail]").forEach((button) => button.addEventListener("click", () => openConfirm("對帳明細", "此處只讀展示支付系統回傳的渠道流水、商城支付投影與差異原因；實際補單或退款需回到原門店業務流程。", "我知道了", closeModal, false)));
}

function renderCustomers() {
  const keyword = document.querySelector("#customerSearch").value.trim().toLowerCase();
  const rows = customers.filter((customer) => `${customer.id}${customer.name}${customer.phone}`.toLowerCase().includes(keyword));
  document.querySelector("#customerRows").innerHTML = rows.map((customer) => `<tr><td>${storeCell({ short: customer.initials, name: customer.name, type: customer.id })}</td><td>${customer.phone}</td><td>${customer.source}</td><td>${customer.orders}</td><td><strong>${customer.spend}</strong></td><td>${customer.points}</td><td><span class="status ${statusClass(customer.status)}">${customer.status}</span></td><td><div class="row-actions"><button data-customer-detail="${customer.id}">查看</button><button>標籤</button></div></td></tr>`).join("");
  document.querySelectorAll("[data-customer-detail]").forEach((button) => button.addEventListener("click", () => openCustomerDetail(customers.find((item) => item.id === button.dataset.customerDetail))));
}

function renderOpportunities() {
  document.querySelector("#opportunityRows").innerHTML = opportunities.map((opportunity) => `<tr><td><strong>${opportunity.title}</strong><br><small>${opportunity.id}</small></td><td>${opportunity.customer}</td><td>${opportunity.type}</td><td>${opportunity.source}</td><td>${opportunity.owner}</td><td><strong>${opportunity.amount}</strong></td><td><span class="status ${statusClass(opportunity.stage)}">${opportunity.stage}</span></td><td>${opportunity.follow}</td><td><div class="row-actions"><button data-opportunity-detail="${opportunity.id}">查看</button><button>跟進</button></div></td></tr>`).join("");
  document.querySelectorAll("[data-opportunity-detail]").forEach((button) => button.addEventListener("click", () => openOpportunityDetail(opportunities.find((item) => item.id === button.dataset.opportunityDetail))));
}

function renderPlatformPage(page) {
  const target = document.querySelector(`#${page}Page`);
  if (page === "accounts") {
    target.innerHTML = `<section class="content-panel"><div class="panel-head"><div><p class="eyebrow">PLATFORM ACCOUNTS</p><h2>集團帳號</h2><small>平台帳號與門店授權分開管理，多店授權不形成新的業務帳套。</small></div><button class="primary-button" data-simple-create="新增集團帳號">新增集團帳號</button></div>${simpleTable(["帳號", "姓名", "集團角色", "資料範圍", "最近登入", "狀態"], [["group.admin", "梁雅琪", "集團最高管理員", "全平台", "2026-08-03 09:24", "啟用"], ["group.viewer", "何志明", "集團查看人員", "澳門 5 間門店", "2026-08-03 08:42", "啟用"], ["category.ops", "周凱琳", "商品分類管理員", "全平台分類", "2026-08-02 18:16", "啟用"], ["payment.ops", "蘇嘉豪", "支付配置管理員", "全平台支付", "2026-08-02 16:08", "啟用"], ["former.ops", "已離職人員", "集團查看人員", "無", "2026-06-28 10:16", "停用"]])}</section>`;
  } else if (page === "roles") {
    target.innerHTML = `<section class="content-panel"><div class="panel-head"><div><p class="eyebrow">ROLES & DATA SCOPE</p><h2>角色權限</h2><small>每次存取同時校驗功能權限與門店資料範圍。</small></div><button class="primary-button" data-simple-create="新增集團角色">新增角色</button></div>${simpleTable(["角色", "成員數", "功能權限", "資料範圍", "敏感操作", "狀態"], [["集團最高管理員", "1", "全部平台功能", "全平台", "二次驗證", "啟用"], ["集團查看人員", "3", "跨店資料只讀", "按授權門店", "不可操作", "啟用"], ["商品分類管理員", "2", "分類增刪改與啟停", "全平台分類", "停用需確認", "啟用"], ["支付配置管理員", "2", "商戶號與門店綁定", "全平台支付", "二次驗證", "啟用"], ["集團 CRM 管理員", "4", "客戶、線索、商機", "集團 CRM", "匯出需授權", "啟用"]])}</section>`;
  }
  target.querySelectorAll("[data-simple-create]").forEach((button) => button.addEventListener("click", () => showToast(`${button.dataset.simpleCreate}功能已預留`)));
}

function simpleTable(headers, rows) {
  return `<div class="table-wrap"><table><thead><tr>${headers.map((header) => `<th>${header}</th>`).join("")}<th>操作</th></tr></thead><tbody>${rows.map((row) => `<tr>${row.map((value, index) => `<td>${index === row.length - 1 ? `<span class="status ${statusClass(value)}">${value}</span>` : value}</td>`).join("")}<td><div class="row-actions"><button>查看</button><button>編輯</button></div></td></tr>`).join("")}</tbody></table></div><div class="pagination"><span>共 ${rows.length} 條記錄</span><div><button disabled>上一頁</button><b>1</b><button disabled>下一頁</button><select><option>15 條 / 頁</option></select></div></div>`;
}

function switchPage(page) {
  document.querySelectorAll(".page-panel").forEach((panel) => panel.classList.add("hidden"));
  document.querySelector(`#${page}Page`).classList.remove("hidden");
  document.querySelectorAll(".nav-item[data-page]").forEach((button) => button.classList.toggle("active", button.dataset.page === page));
  const current = document.querySelector(`.nav-item[data-page="${page}"]`);
  current?.closest(".nav-group")?.classList.remove("collapsed");
  document.querySelector("#pageTitle").textContent = pageTitles[page];
  if (["accounts", "roles"].includes(page)) renderPlatformPage(page);
  if (page === "stores") renderStores();
  if (page === "storeAdmins") renderStoreAdmins();
  if (page === "categories") renderCategories();
  if (page === "units") renderOrganizations();
  if (page === "payments") renderPayments();
  if (page === "customers") renderCustomers();
  if (page === "crm") renderOpportunities();
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function openModal(title, eyebrow, body, footer) {
  modalTitle.textContent = title;
  modalEyebrow.textContent = eyebrow;
  modalBody.innerHTML = body;
  modalFooter.innerHTML = footer;
  modal.classList.remove("hidden");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  modal.classList.add("hidden");
  document.body.style.overflow = "";
}

function bindModalButtons(primaryCallback) {
  document.querySelector("#modalCancel")?.addEventListener("click", closeModal);
  document.querySelector("#modalConfirm")?.addEventListener("click", primaryCallback);
}

function openConfirm(title, message, action, callback, danger = true) {
  openModal(title, "SENSITIVE ACTION", `<div class="boundary-box" style="margin-top:0;border-left-color:${danger ? "#c23732" : "#1769a8"}">${message}</div>`, `<button class="secondary-button" id="modalCancel">取消</button><button class="${danger ? "primary-button" : "secondary-button"}" id="modalConfirm">${action}</button>`);
  bindModalButtons(callback);
}

function openStoreDialog(store) {
  const editing = Boolean(store);
  openModal(editing ? "配置門店" : "新增門店", "STORE TENANT", `<form id="storeForm" class="form-grid"><label>門店名稱 <span class="required">*</span><input name="name" required value="${store?.name || ""}" placeholder="請輸入門店名稱"></label><label>門店編號 <span class="required">*</span><input name="id" required value="${store?.id || ""}" ${editing ? "disabled" : ""} placeholder="例如 MC-MO-007"></label><label>門店類型 <span class="required">*</span><select name="type"><option ${store?.type === "MC 自營" ? "selected" : ""}>MC 自營</option><option ${store?.type === "外部品牌" ? "selected" : ""}>外部品牌</option><option>加盟門店</option></select></label><label>本位幣 <span class="required">*</span><select name="currency" ${editing ? "disabled" : ""}><option ${store?.currency === "MOP" ? "selected" : ""}>MOP</option><option ${store?.currency === "HKD" ? "selected" : ""}>HKD</option></select></label><label>時區 <span class="required">*</span><select name="timezone"><option>Asia/Macau</option><option ${store?.timezone === "Asia/Hong_Kong" ? "selected" : ""}>Asia/Hong_Kong</option></select></label><label>聯絡電話<input name="phone" value="${store?.phone === "—" ? "" : store?.phone || ""}" placeholder="請輸入門店電話"></label><label class="full">門店地址 <span class="required">*</span><input name="address" required value="${store?.address || ""}" placeholder="請輸入完整地址"></label></form><div class="boundary-box">建立後將生成唯一 store_tenant_id。門店商品、訂單、支付路由與交易財務均以此租戶隔離；門店管理員需在獨立頁面建立並綁定。</div>`, `<button class="secondary-button" id="modalCancel">取消</button><button class="primary-button" id="modalConfirm">${editing ? "儲存配置" : "建立門店租戶"}</button>`);
  bindModalButtons(() => {
    const form = document.querySelector("#storeForm");
    if (!form.reportValidity()) return;
    const data = Object.fromEntries(new FormData(form));
    if (editing) Object.assign(store, data);
    else stores.splice(stores.length - 1, 0, { ...data, short: data.name.slice(0,1), channels: "未綁定", status: "待審核", orders: 0, gross: `${data.currency} 0`, refund: `${data.currency} 0`, rate: "—" });
    closeModal(); renderStores(); showToast(editing ? "門店配置已儲存" : "門店租戶已建立");
  });
}

function openStoreDetail(store) {
  openModal(store.name, "STORE TENANT DETAIL", `<div class="detail-grid"><div><small>租戶編號</small><strong class="masked">${store.id}</strong></div><div><small>門店類型</small><strong>${store.type}</strong></div><div><small>本位幣 / 時區</small><strong>${store.currency} · ${store.timezone}</strong></div><div><small>已啟用支付渠道</small><strong>${store.channels}</strong></div><div><small>門店地址</small><strong>${store.address}</strong></div><div><small>聯絡電話</small><strong>${store.phone}</strong></div></div><div class="detail-section"><h3>已啟用業務能力</h3><div><span class="status blue">商品管理</span> <span class="status blue">現售訂單</span> <span class="status blue">預售訂單</span> <span class="status blue">配送與自提</span> <span class="status blue">售後</span></div></div><div class="boundary-box">集團後台可跨店查看經營、支付及售後結果，但商品編輯、訂單履約、退款審核與售後處理必須回到此門店工作區。</div>`, `<button class="secondary-button" id="modalCancel">關閉</button><button class="primary-button" id="modalConfirm">配置門店</button>`);
  bindModalButtons(() => { closeModal(); openStoreDialog(store); });
}

function bindStoreActions() {
  document.querySelectorAll("[data-store-detail]").forEach((button) => button.addEventListener("click", () => openStoreDetail(stores.find((store) => store.id === button.dataset.storeDetail))));
  document.querySelectorAll("[data-store-edit]").forEach((button) => button.addEventListener("click", () => openStoreDialog(stores.find((store) => store.id === button.dataset.storeEdit))));
  document.querySelectorAll("[data-store-review]").forEach((button) => button.addEventListener("click", () => openStoreReview(stores.find((store) => store.id === button.dataset.storeReview))));
  document.querySelectorAll("[data-store-toggle]").forEach((button) => button.addEventListener("click", () => {
    const store = stores.find((item) => item.id === button.dataset.storeToggle);
    const stopping = store.status === "營業中";
    openConfirm(stopping ? "停用門店" : "啟用門店", stopping ? `停用「${store.name}」後將禁止建立新訂單，但歷史訂單、支付、退款及對帳仍可查詢。` : `啟用「${store.name}」後，門店可在完成支付與商城配置後恢復接單。`, stopping ? "確認停用" : "確認啟用", () => { store.status = stopping ? "停用" : "營業中"; closeModal(); renderStores(); showToast(`門店已${stopping ? "停用" : "啟用"}`); });
  }));
}

function openStoreReview(store) {
  openModal("審核入駐申請", "STORE ONBOARDING", `<div class="detail-grid"><div><small>申請門店</small><strong>${store.name}</strong></div><div><small>申請類型</small><strong>${store.type}</strong></div><div><small>擬用本位幣</small><strong>${store.currency}</strong></div><div><small>申請聯絡人</small><strong>${store.phone}</strong></div><div><small>營業地址</small><strong>${store.address}</strong></div><div><small>資料檢查</small><strong><span class="status success">已齊全</span></strong></div></div><div class="boundary-box">通過後需在「門店管理員」頁綁定至少一名管理員，並完成支付渠道配置後才可正式接單。</div>`, `<button class="secondary-button" id="modalCancel">暫不處理</button><button class="primary-button" id="modalConfirm">通過並進入配置</button>`);
  bindModalButtons(() => { store.status = "停用"; closeModal(); renderStores(); showToast("申請已通過，請完成門店配置後啟用"); });
}

function openCategoryDialog(category) {
  const editing = Boolean(category);
  openModal(editing ? "編輯分類" : "新增分類", "GROUP CATEGORY", `<form id="categoryForm" class="form-grid"><label>分類名稱 <span class="required">*</span><input name="name" required value="${category?.name || ""}" placeholder="請輸入繁體中文名稱"></label><label>分類層級 <span class="required">*</span><select name="level"><option value="1" ${category?.level === 1 ? "selected" : ""}>一級分類</option><option value="2" ${category?.level === 2 ? "selected" : ""}>二級分類</option><option value="3" ${category?.level === 3 ? "selected" : ""}>三級葉子分類</option></select></label><label>上級分類<select name="parent"><option>無（建立一級分類）</option><option>校服</option><option>校服 / 日常校服</option><option>團體服 / 企業服裝</option></select></label><label>商城排序 <span class="required">*</span><input name="sort" type="number" min="1" required value="${category?.sort || 10}"></label><label class="full">展示素材<input placeholder="上傳分類圖標或商城展示素材（原型入口）"></label></form><div class="boundary-box">商品只能綁定啟用的三級葉子分類。集團分類調整會統一更新商城導航，但不改變既有商品的門店歸屬、價格與資料。</div>`, `<button class="secondary-button" id="modalCancel">取消</button><button class="primary-button" id="modalConfirm">${editing ? "儲存分類" : "新增分類"}</button>`);
  bindModalButtons(() => {
    const form = document.querySelector("#categoryForm"); if (!form.reportValidity()) return;
    const data = Object.fromEntries(new FormData(form)); data.level = Number(data.level); data.sort = Number(data.sort);
    if (editing) Object.assign(category, data); else categories.push({ ...data, id: `CAT-${String(categories.length + 4).padStart(3,"0")}`, products: 0, status: "啟用" });
    closeModal(); renderCategories(); showToast(editing ? "分類已更新" : "分類已新增");
  });
}

function openPaymentDetail(config) {
  openModal("商戶號配置詳情", "PAYMENT ACCOUNT", `<div class="detail-grid"><div><small>配置名稱</small><strong>${escapeHtml(config.displayName)}</strong></div><div><small>渠道代碼</small><strong>${config.channelCode}</strong></div><div><small>運行環境</small><strong>${config.environment}</strong></div><div><small>可用狀態</small><strong><span class="status ${statusClass(config.status)}">${config.status}</span></strong></div><div><small>商戶號</small><strong class="masked">${config.merchantMasked}</strong></div><div><small>App ID</small><strong>${config.appIdConfigured ? "已配置（脫敏）" : "未配置"}</strong></div><div><small>Secret 引用</small><strong>${config.secretReferenceConfigured ? "已配置（不回顯）" : "未配置"}</strong></div><div><small>最近健康檢查</small><strong>${config.lastChecked}</strong></div></div><div class="boundary-box">完整密鑰、Secret、證書內容與簽名資料不在列表或詳情中展示；敏感配置變更需二次驗證並保留操作記錄。</div>`, `<button class="secondary-button" id="modalCancel">關閉</button><button class="primary-button" id="modalConfirm">進入安全配置</button>`);
  bindModalButtons(() => { closeModal(); showToast("安全配置流程已預留"); });
}

function openPaymentCreateDialog() {
  openModal("新增商戶號", "NEW CONFIGURATION", `<form id="paymentConfigForm" class="form-grid payment-config-form"><label>展示名稱 <span class="required">*</span><input name="displayName" required placeholder="請輸入配置展示名稱"></label><label>渠道代碼 <span class="required">*</span><select name="channelCode" required><option value="MPAY">MPAY</option></select></label><label>運行環境 <span class="required">*</span><select name="environment" required><option value="UAT">UAT</option><option value="正式環境">正式環境</option></select></label><label>商戶號 <span class="required">*</span><input name="merchantAccount" required autocomplete="off" placeholder="輸入商戶號"></label><label>App ID（可選）<input name="appId" autocomplete="off" placeholder="輸入 App ID"></label><label>Secret 引用 <span class="required">*</span><input name="secretReference" required autocomplete="off" placeholder="例如 secret:mpay/uat"></label></form><div class="security-warning"><span>!</span><p>只填寫 Secret／KMS／只讀文件掛載引用，不要粘貼私鑰或 Secret 正文。提交後不會回顯。</p></div>`, `<button class="secondary-button" id="modalCancel">取消</button><button class="primary-button" id="modalConfirm">保存配置</button>`);
  const paymentForm = document.querySelector("#paymentConfigForm");
  paymentForm.elements.displayName.addEventListener("input", (event) => event.currentTarget.setCustomValidity(""));
  paymentForm.elements.merchantAccount.addEventListener("input", (event) => event.currentTarget.setCustomValidity(""));
  paymentForm.elements.secretReference.addEventListener("input", (event) => event.currentTarget.setCustomValidity(""));
  bindModalButtons(() => {
    const form = document.querySelector("#paymentConfigForm");
    form.elements.displayName.setCustomValidity("");
    form.elements.merchantAccount.setCustomValidity("");
    form.elements.secretReference.setCustomValidity("");
    if (!form.reportValidity()) return;
    const data = Object.fromEntries(new FormData(form));
    if (!data.displayName.trim()) {
      form.elements.displayName.setCustomValidity("請輸入展示名稱");
      form.elements.displayName.reportValidity();
      return;
    }
    if (!data.merchantAccount.trim()) {
      form.elements.merchantAccount.setCustomValidity("請輸入商戶號");
      form.elements.merchantAccount.reportValidity();
      return;
    }
    if (!/^(secret|kms|file):.+/i.test(data.secretReference.trim()) && !data.secretReference.trim().startsWith("/")) {
      form.elements.secretReference.setCustomValidity("請填寫 Secret、KMS 或只讀文件掛載引用，不要填寫 Secret 正文");
      form.elements.secretReference.reportValidity();
      return;
    }
    paymentConfigs.push({
      id: `PAY-${Date.now()}`,
      channelCode: data.channelCode,
      displayName: data.displayName.trim(),
      merchantMasked: maskMerchantAccount(data.merchantAccount, data.channelCode),
      environment: data.environment,
      boundStores: 0,
      status: "待確認",
      lastChecked: "尚未檢查",
      appIdConfigured: Boolean(data.appId.trim()),
      secretReferenceConfigured: true,
    });
    closeModal(); renderPayments(); showToast("商戶號配置已新增");
  });
}

function openPaymentConfig() { openConfirm("安全配置驗證", "修改商戶號、證書、密鑰或回調資訊前需完成二次驗證。此靜態原型不展示、不保存任何真實支付憑證。", "開始驗證", () => { closeModal(); showToast("二次驗證流程已預留"); }, false); }

function openBindingDialog(store) {
  openModal("管理門店支付綁定", "STORE PAYMENT BINDING", `<div class="detail-grid"><div><small>門店租戶</small><strong>${store.name}</strong></div><div><small>租戶編號</small><strong class="masked">${store.id}</strong></div><div><small>門店本位幣</small><strong>${store.currency}</strong></div><div><small>目前渠道</small><strong>${store.channels}</strong></div></div><form class="form-grid" style="margin-top:18px"><label>支付渠道<select><option>Mpay</option><option>微信支付</option></select></label><label>商戶號配置<select><option>澳設共享商戶號 · ••••8832</option><option>氹仔獨立商戶號 · ••••1906</option></select></label><label>門店展示名稱<input value="Mpay"></label><label>展示排序<input type="number" value="1"></label></form><div class="boundary-box">綁定只建立門店與商戶號配置的授權關係。支付與退款仍保存原門店 store_tenant_id，不允許跨店合併對帳。</div>`, `<button class="secondary-button" id="modalCancel">取消</button><button class="primary-button" id="modalConfirm">儲存綁定</button>`);
  bindModalButtons(() => { closeModal(); showToast("門店支付綁定已儲存"); });
}

function openCustomerDetail(customer) {
  openModal(customer.name, "GROUP MEMBER DETAIL", `<div class="detail-grid"><div><small>會員編號</small><strong class="masked">${customer.id}</strong></div><div><small>會員狀態</small><strong><span class="status ${statusClass(customer.status)}">${customer.status}</span></strong></div><div><small>聯絡方式</small><strong>${customer.phone}</strong></div><div><small>首次來源</small><strong>${customer.source}</strong></div><div><small>跨店訂單</small><strong>${customer.orders}</strong></div><div><small>集團積分餘額</small><strong>${customer.points}</strong></div></div><div class="detail-section"><h3>最近積分流水</h3><table><thead><tr><th>時間</th><th>來源門店</th><th>業務</th><th>積分變動</th></tr></thead><tbody><tr><td>2026-08-02 14:20</td><td>澳門總店</td><td>支付成功入賬</td><td class="positive">+680</td></tr><tr><td>2026-07-21 11:06</td><td>氹仔旗艦店</td><td>訂單退款扣回</td><td class="danger-text">-120</td></tr></tbody></table></div><div class="boundary-box">客戶聯絡方式已按角色脫敏。跨店訂單只讀聚合，具體履約與售後操作需回到訂單所屬門店。</div>`, `<button class="secondary-button" id="modalCancel">關閉</button><button class="primary-button" id="modalConfirm">新增聯繫記錄</button>`);
  bindModalButtons(() => showToast("聯繫記錄入口已預留"));
}

function openOpportunityDetail(opportunity) {
  openModal(opportunity.title, "OPPORTUNITY DETAIL", `<div class="detail-grid"><div><small>商機編號</small><strong class="masked">${opportunity.id}</strong></div><div><small>商機階段</small><strong><span class="status ${statusClass(opportunity.stage)}">${opportunity.stage}</span></strong></div><div><small>客戶 / 機構</small><strong>${opportunity.customer}</strong></div><div><small>商機類型</small><strong>${opportunity.type}</strong></div><div><small>來源門店</small><strong>${opportunity.source}</strong></div><div><small>集團負責人</small><strong>${opportunity.owner}</strong></div><div><small>預計金額</small><strong>${opportunity.amount}</strong></div><div><small>下次跟進</small><strong>${opportunity.follow}</strong></div></div><div class="boundary-box">來源門店僅用於追蹤線索渠道；商機、負責人與跟進記錄歸集團 CRM，不在門店後台建立獨立 CRM。</div>`, `<button class="secondary-button" id="modalCancel">關閉</button><button class="primary-button" id="modalConfirm">追加跟進記錄</button>`);
  bindModalButtons(() => showToast("跟進記錄入口已預留"));
}

function showToast(message) {
  const toast = document.querySelector("#toast"); toast.textContent = message; toast.classList.remove("hidden");
  window.clearTimeout(showToast.timer); showToast.timer = window.setTimeout(() => toast.classList.add("hidden"), 2200);
}

document.querySelectorAll(".nav-label").forEach((button) => button.addEventListener("click", () => { const group = button.closest(".nav-group"); group.classList.toggle("collapsed"); button.setAttribute("aria-expanded", String(!group.classList.contains("collapsed"))); }));
document.querySelectorAll(".nav-item[data-page]").forEach((button) => button.addEventListener("click", () => switchPage(button.dataset.page)));
document.querySelector("#openStoreCreate").addEventListener("click", () => openStoreDialog());
document.querySelector("#storeSearch").addEventListener("input", renderStores);
document.querySelector("#storeCurrency").addEventListener("change", renderStores);
document.querySelector("#resetStoreFilters").addEventListener("click", () => { document.querySelector("#storeSearch").value = ""; document.querySelector("#storeCurrency").value = "all"; renderStores(); });
document.querySelector("#openStoreAdminCreate").addEventListener("click", () => openStoreAdminDialog());
document.querySelector("#storeAdminSearch").addEventListener("input", renderStoreAdmins);
document.querySelector("#storeAdminStatus").addEventListener("change", renderStoreAdmins);
document.querySelector("#storeAdminBinding").addEventListener("change", renderStoreAdmins);
document.querySelector("#resetStoreAdminFilters").addEventListener("click", () => { document.querySelector("#storeAdminSearch").value = ""; document.querySelector("#storeAdminStatus").value = "all"; document.querySelector("#storeAdminBinding").value = "all"; renderStoreAdmins(); });
document.querySelector("#openCategoryCreate").addEventListener("click", () => openCategoryDialog());
document.querySelector("#categorySearch").addEventListener("input", renderCategories);
document.querySelector("#openUnitCreate").addEventListener("click", () => openOrganizationDialog());
document.querySelector("#unitSearch").addEventListener("input", renderOrganizations);
document.querySelector("#unitTypeFilter").addEventListener("change", renderOrganizations);
document.querySelector("#unitStatusFilter").addEventListener("change", renderOrganizations);
document.querySelector("#resetUnitFilters").addEventListener("click", () => { document.querySelector("#unitSearch").value = ""; document.querySelector("#unitTypeFilter").value = "all"; document.querySelector("#unitStatusFilter").value = "all"; unitTab = "all"; document.querySelectorAll("[data-unit-tab]").forEach((button) => button.classList.toggle("active", button.dataset.unitTab === "all")); renderOrganizations(); });
document.querySelectorAll("[data-unit-tab]").forEach((button) => button.addEventListener("click", () => { unitTab = button.dataset.unitTab; document.querySelectorAll("[data-unit-tab]").forEach((item) => item.classList.toggle("active", item === button)); renderOrganizations(); }));
document.querySelectorAll("[data-payment-view]").forEach((button) => button.addEventListener("click", () => { paymentView = button.dataset.paymentView; document.querySelectorAll("[data-payment-view]").forEach((item) => item.classList.toggle("active", item === button)); renderPayments(); }));
document.querySelector("#paymentPrimaryAction").addEventListener("click", () => paymentView === "bindings" ? openBindingDialog(stores[0]) : paymentView === "channels" ? openPaymentCreateDialog() : showToast("對帳摘要匯出入口已預留"));
document.querySelector("#customerSearch").addEventListener("input", renderCustomers);
document.querySelector("#exportCustomers").addEventListener("click", () => showToast("客戶資料匯出需權限審批，流程已預留"));
document.querySelector("#openOpportunityCreate").addEventListener("click", () => showToast("新增商機彈窗已預留下一輪完善"));
document.querySelector("#closeModal").addEventListener("click", closeModal);
modal.addEventListener("click", (event) => { if (event.target === modal) closeModal(); });
document.addEventListener("keydown", (event) => { if (event.key === "Escape" && !modal.classList.contains("hidden")) closeModal(); });
loginForm.addEventListener("submit", async (event) => {
  event.preventDefault();
  loginError.textContent = "";
  if (!loginUsername.value.trim() || !loginPassword.value) {
    loginError.textContent = "請輸入帳號和密碼。";
    return;
  }
  const [usernameDigest, passwordDigest] = await Promise.all([
    digestText(loginUsername.value.trim()),
    digestText(`group-admin:${loginPassword.value}`),
  ]);
  if (usernameDigest !== allowedUsernameDigest || passwordDigest !== allowedPasswordDigest) {
    loginError.textContent = "帳號或密碼不正確，請重新輸入。";
    loginPassword.value = "";
    loginPassword.focus();
    return;
  }
  sessionStorage.setItem(authenticatedSessionKey, "1");
  showAdmin();
  showToast("登入成功，歡迎回到集團營運後台");
});
document.querySelector("#togglePassword").addEventListener("click", (event) => {
  const showing = loginPassword.type === "text";
  loginPassword.type = showing ? "password" : "text";
  event.currentTarget.textContent = showing ? "顯示" : "隱藏";
  event.currentTarget.setAttribute("aria-label", showing ? "顯示密碼" : "隱藏密碼");
});
document.querySelector("#logoutButton").addEventListener("click", () => {
  sessionStorage.removeItem(authenticatedSessionKey);
  showLogin();
});

renderStores();
renderStoreAdmins();
renderCategories();
renderOrganizations();
renderPayments();
renderCustomers();
renderOpportunities();
if (sessionStorage.getItem(authenticatedSessionKey) === "1") showAdmin();
else showLogin();
