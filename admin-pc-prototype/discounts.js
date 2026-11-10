const discountDialog = document.querySelector("#discountDialog");
const discountForm = document.querySelector("#discountForm");
const discountSearch = document.querySelector("#discountSearch");
const discountStatus = document.querySelector("#discountStatus");
const discountRows = document.querySelector("#discountRows");
const discountProductSearch = document.querySelector("#discountProductSearch");
const discountProductCategory = document.querySelector("#discountProductCategory");
const discountProductRows = document.querySelector("#discountProductRows");
const discountProductScroll = discountProductRows.closest(".table-wrap");
const discountSelectPage = document.querySelector("#discountSelectPage");
const discountSelectMatches = document.querySelector("#discountSelectMatches");
const discountSelectedList = document.querySelector("#discountSelectedList");
const discountName = document.querySelector("#discountName");
const discountStartsAt = document.querySelector("#discountStartsAt");
const discountEndsAt = document.querySelector("#discountEndsAt");
const discountFreeShipping = document.querySelector("#discountFreeShipping");
const discountPanels = ["#discountInfoStep", "#discountProductsStep", "#discountReviewStep", "#discountDoneStep"]
  .map((selector) => document.querySelector(selector));
const discountPricePreview = document.querySelector("#discountPricePreview");
const discountFold = document.querySelector("#discountFold");
const discountFormHint = document.querySelector("#discountFormHint");
const endDiscountDialog = document.querySelector("#endDiscountDialog");
let editingDiscountId;
let endingDiscountId;
let discountReadOnly;
let discountStep = 1;
let discountStatusTimer;
let selectedDiscountProducts = new Set();

function canUseDiscounts(api = "discount_view") {
  const employee = getEmployeeById(currentEmployeeId);
  const role = getRoleById(employee?.roleId);
  return Boolean(employee?.storeIds.includes(currentStoreId) && role?.status === "启用" &&
    role.permissions.pages.includes("discounts") && role.permissions.apis.includes(api));
}

function updateDiscountAccess() {
  const canView = canUseDiscounts();
  document.querySelector("#discountNav").classList.toggle("hidden", !canView);
  if (!discountsPage.classList.contains("hidden")) {
    if (canView) renderDiscounts();
    else navigateToPage("dashboard");
  }
}

function getStoreDiscountProducts() {
  return products.filter((product) => (product.storeId || StoreDiscounts.demoStoreId) === currentStoreId);
}

function isDiscountProductEligible(product) {
  return product.status === "上架" && product.skus.some((sku) => sku.saleable && sku.stock > 0);
}

function macauDiscountDateTime(timestamp) {
  return new Date(timestamp + 8 * 60 * 60 * 1000).toISOString().slice(0, 16);
}

function renderDiscounts() {
  if (!canUseDiscounts()) return;
  document.querySelector("#newDiscountBtn").hidden = !canUseDiscounts("discount_edit") && !canUseDiscounts("discount_publish");
  const keyword = discountSearch.value.trim().toLowerCase();
  const now = Date.now();
  const campaigns = StoreDiscounts.read().filter((campaign) => campaign.storeId === currentStoreId);
  const boundary = StoreDiscounts.nextBoundary(campaigns, now);
  clearTimeout(discountStatusTimer);
  if (Number.isFinite(boundary)) {
    discountStatusTimer = setTimeout(() => {
      if (!discountsPage.classList.contains("hidden")) renderDiscounts();
    }, Math.min(boundary - now, 2_147_483_647));
  }
  const matches = campaigns.filter((campaign) => campaign.name.toLowerCase().includes(keyword) &&
    (!discountStatus.value || StoreDiscounts.status(campaign, now) === discountStatus.value));
  const page = getPageSlice(matches, "discounts");
  const badges = { "待开始": "presale", "进行中": "up" };
  discountRows.innerHTML = page.rows.map((campaign) => {
    const status = StoreDiscounts.status(campaign, now);
    const editable = status === "草稿" && (canUseDiscounts("discount_edit") || canUseDiscounts("discount_publish"));
    const canEnd = ["待开始", "进行中"].includes(status) && canUseDiscounts("discount_end");
    return `
      <tr>
        <td><strong>${escapeHtml(campaign.name)}</strong></td>
        <td>${campaign.fold} 折</td><td>${campaign.productIds.length} 件</td>
        <td class="discount-dates">${macauDiscountDateTime(campaign.startsAt).replace("T", " ")}<br>至 ${macauDiscountDateTime(campaign.endsAt).replace("T", " ")}</td>
        <td>${campaign.useDiscountedFreeShipping ? "按折后金额" : "按折前金额"}</td>
        <td><span class="badge ${badges[status] || ""}">${status}</span></td>
        <td><div class="row-actions">
          <button class="text-btn" type="button" data-open-discount="${campaign.id}">${editable ? "编辑" : "查看"}</button>
          ${canEnd ? `<button class="text-btn danger-text" type="button" data-end-discount="${campaign.id}">结束活动</button>` : ""}
        </div></td>
      </tr>`;
  }).join("") || '<tr><td colspan="7"><small>暂无符合条件的折扣活动。</small></td></tr>';
  renderPagination("discounts", page.total, page.totalPages);
}

function getMatchingDiscountProducts() {
  const keyword = discountProductSearch.value.trim().toLowerCase();
  const categoryId = discountProductCategory.value;
  return getStoreDiscountProducts().filter((product) => {
    if (!isDiscountProductEligible(product) || (categoryId && product.categoryId !== categoryId)) return false;
    const searchText = [product.name, product.spuCode, ...product.skus.map((sku) => sku.code)].join(" ").toLowerCase();
    return searchText.includes(keyword);
  });
}

function readDiscountInfo() {
  return {
    name: discountName.value.trim(),
    startsAt: Date.parse(discountStartsAt.value + "+08:00"),
    endsAt: Date.parse(discountEndsAt.value + "+08:00"),
    fold: discountFold.valueAsNumber,
    useDiscountedFreeShipping: discountFreeShipping.checked,
  };
}

function findDiscountOverlaps(campaigns, { startsAt, endsAt }, now) {
  return campaigns.filter((campaign) => campaign.storeId === currentStoreId &&
    ["待开始", "进行中"].includes(StoreDiscounts.status(campaign, now)) &&
    campaign.startsAt < endsAt && startsAt < campaign.endsAt);
}

function discountPriceRange(prices) {
  const low = Math.min(...prices);
  const high = Math.max(...prices);
  return low === high ? formatOrderMoney(low) : `${formatOrderMoney(low)} – ${formatOrderMoney(high)}`;
}

function renderDiscountProducts() {
  const rows = getMatchingDiscountProducts();
  const page = getPageSlice(rows, "discountProducts");
  const previousFirstId = discountProductRows.querySelector("[data-discount-product]")?.dataset.discountProduct;
  const checkedCount = page.rows.filter((product) => selectedDiscountProducts.has(product.id)).length;
  const selectedMatches = rows.filter((product) => selectedDiscountProducts.has(product.id)).length;
  discountSelectPage.disabled = !page.rows.length;
  discountSelectPage.checked = page.rows.length > 0 && checkedCount === page.rows.length;
  discountSelectPage.indeterminate = checkedCount > 0 && checkedCount < page.rows.length;
  discountSelectMatches.disabled = !rows.length;
  const allMatchedSelected = rows.length > 0 && selectedMatches === rows.length;
  discountSelectMatches.textContent = `${allMatchedSelected ? "取消选中全部结果" : "选中全部结果"}（${rows.length} 件）`;
  document.querySelector("#discountMatchCount").textContent = `找到 ${rows.length} 件商品，已选中其中 ${selectedMatches} 件`;

  const overlapping = findDiscountOverlaps(StoreDiscounts.read(), readDiscountInfo(), Date.now());
  const conflicts = new Map(overlapping.flatMap((campaign) => campaign.productIds.map((id) => [id, campaign.name])));
  discountProductRows.innerHTML = page.rows.map((product) => {
    const id = escapeHtml(product.id);
    const conflict = conflicts.get(product.id);
    return `
      <tr class="${selectedDiscountProducts.has(product.id) ? "discount-row-selected" : ""}">
        <td><input id="discount-check-${id}" type="checkbox" data-discount-product="${id}" aria-label="选择 ${escapeHtml(product.name)}" ${selectedDiscountProducts.has(product.id) ? "checked" : ""} /></td>
        <td>
          <label class="discount-product-name" for="discount-check-${id}">${escapeHtml(product.name)}</label>
          <small>${escapeHtml(product.spuCode)} · ${product.skus.length} 个规格</small>
          ${conflict ? `<small class="discount-conflict">与「${escapeHtml(conflict)}」时间重叠</small>` : ""}
        </td>
        <td>${escapeHtml(getCategoryPath(product.categoryId))}</td>
        <td>${discountPriceRange(product.skus.map((sku) => sku.price))}</td>
      </tr>`;
  }).join("") || '<tr><td colspan="4"><small>暂无匹配的现售商品，可调整关键词或类目。</small></td></tr>';
  if (page.rows[0]?.id !== previousFirstId) discountProductScroll.scrollTop = 0;
  renderPagination("discountProducts", page.total, page.totalPages);
  renderDiscountSelection();
}

function getSelectedDiscountProducts() {
  const storeProducts = new Map(getStoreDiscountProducts().map((product) => [product.id, product]));
  return [...selectedDiscountProducts].map((id) => storeProducts.get(id) || { id, name: id, skus: [] });
}

function renderDiscountSelection() {
  const page = getPageSlice(getSelectedDiscountProducts(), "discountSelected");
  document.querySelector("#discountSelectedCount").textContent = `${page.total} 件`;
  document.querySelector("#discountFooterCount").textContent = `已选 ${page.total} 件商品`;
  discountSelectedList.innerHTML = page.rows.map((product) => `
    <div class="discount-selection-item">
      <div>
        <strong>${escapeHtml(product.name)}</strong>
        <small>${isDiscountProductEligible(product) ? escapeHtml(product.spuCode) : "商品当前不可参与活动"}</small>
      </div>
      <button class="text-btn" type="button" data-remove-discount-product="${escapeHtml(product.id)}" aria-label="移除 ${escapeHtml(product.name)}">移除</button>
    </div>
  `).join("") || '<p class="discount-selection-empty form-hint">请从左侧勾选商品。已选商品会集中显示在这里。</p>';
  renderPagination("discountSelected", page.total, page.totalPages);
  document.querySelector("#discountSelectedPagination").classList.toggle("hidden", page.totalPages === 1);
}

function renderDiscountReview() {
  const info = readDiscountInfo();
  const page = getPageSlice(getSelectedDiscountProducts(), "discountPreview");
  document.querySelector("#discountReviewSummary").innerHTML = [
    ["活动名称", info.name],
    ["折扣", `${info.fold} 折`],
    ["免运判定", info.useDiscountedFreeShipping ? "按折后商品金额" : "按折前商品金额"],
    ["活动时间（澳门）", `${macauDiscountDateTime(info.startsAt).replace("T", " ")} 至 ${macauDiscountDateTime(info.endsAt).replace("T", " ")}`],
  ].map(([label, value]) => `<div><dt>${label}</dt><dd>${escapeHtml(value)}</dd></div>`).join("");
  document.querySelector("#discountPreviewTitle").textContent = `价格预览 · ${page.total} 件商品`;
  discountPricePreview.innerHTML = page.rows.map((product) => {
    const prices = product.skus.map((sku) => StoreDiscounts.discountedCents(sku.price, info.fold) / 100);
    return `<details class="discount-selected-item">
      <summary>
        <span><strong>${escapeHtml(product.name)}</strong> <small>${escapeHtml(product.spuCode || "")}</small></span>
        <span>${prices.length ? discountPriceRange(prices) : "商品已不可用"}</span>
      </summary>
      ${product.skus.map((sku, index) => `
        <div class="discount-sku-row">
          <span>${escapeHtml(sku.spec)} <small>${escapeHtml(sku.code)}</small></span>
          <span><del>${formatOrderMoney(sku.price)}</del> <strong>${formatOrderMoney(prices[index])}</strong></span>
        </div>`).join("")}
    </details>`;
  }).join("");
  discountPricePreview.scrollTop = 0;
  renderPagination("discountPreview", page.total, page.totalPages);
  document.querySelector("#discountPreviewPagination").classList.toggle("hidden", page.totalPages === 1);
}

function showDiscountStep(step) {
  discountStep = step;
  discountFormHint.textContent = "";
  discountDialog.dataset.step = String(step);
  discountPanels.forEach((panel, index) => panel.classList.toggle("hidden", index !== step - 1));
  document.querySelectorAll("[data-discount-step]").forEach((button) => {
    const number = Number(button.dataset.discountStep);
    button.disabled = number >= step || step === 4;
    button.classList.toggle("is-complete", number < step);
    if (number === step || (step === 4 && number === 3)) button.setAttribute("aria-current", "step");
    else button.removeAttribute("aria-current");
  });
  document.querySelector("#discountFormActions").hidden = discountReadOnly;
  document.querySelector("#discountFooterCount").hidden = step !== 2 && step !== 3;
  document.querySelector("#discountBackBtn").hidden = step !== 2 && step !== 3;
  document.querySelector("#discountNextBtn").hidden = step > 2;
  document.querySelector("#saveDiscountDraftBtn").hidden = step !== 3 || !canUseDiscounts("discount_edit");
  document.querySelector("#publishDiscountBtn").hidden = step !== 3 || !canUseDiscounts("discount_publish");
  document.querySelector("#finishDiscountBtn").hidden = step !== 4;
  document.querySelector("#discountNextBtn").textContent = step === 1 ? "下一步，选品" : "下一步，确认";
  if (step === 2) renderDiscountProducts();
  if (step === 3) {
    document.querySelector("#discountFooterCount").textContent = `已选 ${selectedDiscountProducts.size} 件商品`;
    renderDiscountReview();
  }
  document.querySelector("#discountBody").scrollTop = 0;
  discountPanels[step - 1].querySelector("h4").focus({ preventScroll: true });
}

function showDiscountError(message) {
  discountFormHint.textContent = message;
  discountFormHint.focus();
}

function openDiscount(campaign) {
  if (!canUseDiscounts()) return;
  editingDiscountId = campaign?.id;
  const canEdit = canUseDiscounts("discount_edit");
  const canPublish = canUseDiscounts("discount_publish");
  discountReadOnly = Boolean(campaign?.published) || (!canEdit && !canPublish);
  const minute = 60 * 1000;
  const now = Math.floor(Date.now() / minute) * minute;
  discountForm.reset();
  document.querySelector("#discountDialogTitle").textContent = campaign ? (discountReadOnly ? "查看折扣活动" : "编辑折扣草稿") : "新建折扣活动";
  discountName.value = campaign?.name || "";
  discountFold.value = campaign?.fold ?? 8.5;
  discountStartsAt.value = macauDiscountDateTime(campaign?.startsAt ?? now);
  discountEndsAt.value = macauDiscountDateTime(campaign?.endsAt ?? now + 24 * 60 * minute);
  discountFreeShipping.checked = Boolean(campaign?.useDiscountedFreeShipping);
  document.querySelector("#discountFields").disabled = discountReadOnly;
  document.querySelector("#discountSteps").classList.toggle("hidden", discountReadOnly);
  document.querySelector("#discountReviewTitle").textContent = discountReadOnly ? "活动信息与参与商品" : "核对活动与折后价";
  document.querySelector("#discountReviewHint").classList.toggle("hidden", discountReadOnly);
  discountProductCategory.innerHTML = '<option value="">全部类目</option>' + getLeafCategories().map((category) =>
    `<option value="${escapeHtml(category.id)}">${escapeHtml(getCategoryPath(category.id))}</option>`).join("");
  selectedDiscountProducts = new Set(campaign?.productIds || []);
  const history = document.querySelector("#discountHistory");
  history.classList.toggle("hidden", !campaign?.history.length);
  history.innerHTML = campaign ? `<h4>操作记录</h4><ul class="record-list">${[...campaign.history].reverse().map((entry) =>
    `<li>${macauDiscountDateTime(entry.at).replace("T", " ")} · ${escapeHtml(entry.operator)} · ${entry.action}</li>`).join("")}</ul>` : "";
  ["discountProducts", "discountSelected", "discountPreview"].forEach(resetPagination);
  showDiscountStep(discountReadOnly ? 3 : 1);
  discountDialog.showModal();
  if (!discountReadOnly) discountName.focus();
}

discountForm.addEventListener("submit", (event) => {
  event.preventDefault();
  if (discountReadOnly || discountStep === 4) return;
  const info = readDiscountInfo();
  if (discountStep === 1) {
    if (![discountName, discountFold, discountStartsAt, discountEndsAt].every((input) => input.reportValidity())) return;
    if (!info.name) {
      showDiscountError("请填写活动名称。");
      return;
    }
    if (!Number.isFinite(info.startsAt) || !Number.isFinite(info.endsAt) || info.endsAt <= info.startsAt) {
      showDiscountError("结束时间须晚于开始时间。");
      return;
    }
    showDiscountStep(2);
    return;
  }
  if (discountStep === 2) {
    if (!selectedDiscountProducts.size) {
      showDiscountError("请至少选择一件参与活动的商品。");
      return;
    }
    resetPagination("discountPreview");
    showDiscountStep(3);
    return;
  }

  const action = event.submitter?.value;
  if (action !== "draft" && action !== "publish") return;
  const publish = action === "publish";
  if (!canUseDiscounts(publish ? "discount_publish" : "discount_edit")) return;
  const campaigns = StoreDiscounts.read();
  const existing = campaigns.find((campaign) => campaign.id === editingDiscountId && campaign.storeId === currentStoreId);
  if (editingDiscountId && (!existing || existing.published)) {
    showDiscountError("活动已更新，请关闭弹窗后重试。");
    return;
  }

  const productIds = [...selectedDiscountProducts];
  const now = Date.now();
  if (publish) {
    if (info.endsAt <= now) {
      showDiscountError("活动已到期，请返回「活动信息」更新结束时间。");
      return;
    }
    const unavailable = getSelectedDiscountProducts().find((product) => !isDiscountProductEligible(product));
    if (unavailable) {
      showDiscountError(`「${unavailable.name}」当前不可参与活动，请返回选品移除后再发布。`);
      return;
    }
    const overlap = findDiscountOverlaps(campaigns, info, now)
      .find((campaign) => campaign.productIds.some((id) => selectedDiscountProducts.has(id)));
    if (overlap) {
      showDiscountError(`所选商品与「${overlap.name}」的活动时间重叠，请返回修改时间或选品。`);
      return;
    }
  }

  const campaign = {
    id: existing?.id || crypto.randomUUID(),
    storeId: currentStoreId,
    ...info,
    productIds,
    published: publish,
    history: [...(existing?.history || []), {
      action: publish ? "发布活动" : "保存草稿",
      operator: getEmployeeById(currentEmployeeId).name,
      at: now,
    }],
  };
  StoreDiscounts.write([campaign, ...campaigns.filter((item) => item.id !== campaign.id)]);
  document.querySelector("#discountDoneTitle").textContent = publish ? "活动创建成功" : "草稿已保存";
  document.querySelector("#discountDoneMessage").textContent = `「${campaign.name}」· ${productIds.length} 件商品 · ${StoreDiscounts.status(campaign, now)}`;
  showDiscountStep(4);
  renderDiscounts();
});

discountRows.addEventListener("click", (event) => {
  const button = event.target.closest("button");
  if (!button || !canUseDiscounts()) return;
  const campaign = StoreDiscounts.read().find((item) => item.storeId === currentStoreId &&
    item.id === (button.dataset.openDiscount || button.dataset.endDiscount));
  if (!campaign) return;
  if (button.dataset.openDiscount) {
    openDiscount(campaign);
  } else if (canUseDiscounts("discount_end") && ["待开始", "进行中"].includes(StoreDiscounts.status(campaign))) {
    endingDiscountId = campaign.id;
    document.querySelector("#endDiscountMessage").textContent = `确认结束「${campaign.name}」？`;
    endDiscountDialog.showModal();
  }
});

document.querySelector("#endDiscountForm").addEventListener("submit", (event) => {
  if (event.submitter?.value !== "end" || !canUseDiscounts("discount_end")) return;
  const campaigns = StoreDiscounts.read();
  const campaign = campaigns.find((item) => item.id === endingDiscountId && item.storeId === currentStoreId);
  if (!campaign || !["待开始", "进行中"].includes(StoreDiscounts.status(campaign))) return;
  campaign.endedAt = Date.now();
  campaign.history.push({ action: "提前结束", operator: getEmployeeById(currentEmployeeId).name, at: campaign.endedAt });
  StoreDiscounts.write(campaigns);
  renderDiscounts();
});

document.querySelector("#newDiscountBtn").addEventListener("click", () => openDiscount());
document.querySelector("#closeDiscountBtn").addEventListener("click", () => discountDialog.close());
document.querySelector("#discountBackBtn").addEventListener("click", () => showDiscountStep(discountStep - 1));
document.querySelector("#finishDiscountBtn").addEventListener("click", () => discountDialog.close());
document.querySelector("#discountSteps").addEventListener("click", (event) => {
  const button = event.target.closest("[data-discount-step]");
  if (button && !button.disabled) showDiscountStep(Number(button.dataset.discountStep));
});
discountSearch.addEventListener("input", () => { resetPagination("discounts"); renderDiscounts(); });
discountStatus.addEventListener("change", () => { resetPagination("discounts"); renderDiscounts(); });
function filterDiscountProducts() {
  resetPagination("discountProducts");
  discountProductScroll.scrollTop = 0;
  renderDiscountProducts();
}
discountProductSearch.addEventListener("input", filterDiscountProducts);
discountProductSearch.addEventListener("keydown", (event) => {
  if (event.key === "Enter") event.preventDefault();
});
discountProductCategory.addEventListener("change", filterDiscountProducts);
function setDiscountSelection(ids, checked) {
  for (const id of ids) {
    if (checked) selectedDiscountProducts.add(id);
    else selectedDiscountProducts.delete(id);
  }
  discountFormHint.textContent = "";
  renderDiscountProducts();
}

discountProductRows.addEventListener("change", (event) => {
  const { discountProduct } = event.target.dataset;
  setDiscountSelection([discountProduct], event.target.checked);
  discountProductRows.querySelector(`[data-discount-product="${CSS.escape(discountProduct)}"]`)?.focus();
});
discountSelectPage.addEventListener("change", () => {
  const ids = [...discountProductRows.querySelectorAll("[data-discount-product]")].map((input) => input.dataset.discountProduct);
  setDiscountSelection(ids, discountSelectPage.checked);
});
discountSelectMatches.addEventListener("click", () => {
  const ids = getMatchingDiscountProducts().map((product) => product.id);
  setDiscountSelection(ids, !ids.every((id) => selectedDiscountProducts.has(id)));
});
discountSelectedList.addEventListener("click", (event) => {
  const button = event.target.closest("[data-remove-discount-product]");
  if (!button) return;
  const index = [...discountSelectedList.querySelectorAll("button")].indexOf(button);
  setDiscountSelection([button.dataset.removeDiscountProduct], false);
  const remaining = discountSelectedList.querySelectorAll("button");
  (remaining[Math.min(index, remaining.length - 1)] || discountProductSearch).focus();
});
window.addEventListener("storage", (event) => {
  if (event.key === StoreDiscounts.storageKey && !discountsPage.classList.contains("hidden")) renderDiscounts();
});
