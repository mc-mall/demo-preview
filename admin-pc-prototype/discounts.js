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
const discountProductView = document.querySelector("#discountProductView");
const discountSelectStore = document.querySelector("#discountSelectStore");
const discountUndoSelection = document.querySelector("#discountUndoSelection");
const discountCodeInput = document.querySelector("#discountCodeInput");
const discountAddCodes = document.querySelector("#discountAddCodes");
const discountCodeResult = document.querySelector("#discountCodeResult");
const discountCodeIssues = document.querySelector("#discountCodeIssues");
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
let previousDiscountSelection = null;
let matchedDiscountCodeIds = [];

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

function getMatchingDiscountProducts(storeProducts = getStoreDiscountProducts()) {
  const keyword = discountProductSearch.value.trim().toLowerCase();
  const categoryId = discountProductCategory.value;
  const view = discountProductView.value;
  const rows = view === "selected" ? getSelectedDiscountProducts(storeProducts) : storeProducts.filter(isDiscountProductEligible);
  return rows.filter((product) => {
    if ((categoryId && product.categoryId !== categoryId) || (view === "unselected" && selectedDiscountProducts.has(product.id))) return false;
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

function getDiscountConflicts(info, campaigns = StoreDiscounts.read(), now = Date.now()) {
  return new Map(findDiscountOverlaps(campaigns, info, now)
    .flatMap((campaign) => campaign.productIds.map((id) => [id, campaign.name])));
}

function getDiscountReviewIssues(selected, conflicts) {
  return {
    unavailable: selected.filter((product) => !isDiscountProductEligible(product)),
    overlapping: selected.filter((product) => isDiscountProductEligible(product) && conflicts.has(product.id)),
  };
}

function discountPriceRange(prices) {
  const low = Math.min(...prices);
  const high = Math.max(...prices);
  return low === high ? formatOrderMoney(low) : `${formatOrderMoney(low)} – ${formatOrderMoney(high)}`;
}

function renderDiscountProducts() {
  const storeProducts = getStoreDiscountProducts();
  const eligible = storeProducts.filter(isDiscountProductEligible);
  const conflicts = getDiscountConflicts(readDiscountInfo());
  const storeConflictCount = eligible.filter((product) => conflicts.has(product.id)).length;
  const rows = getMatchingDiscountProducts(storeProducts);
  const page = getPageSlice(rows, "discountProducts");
  const previousFirstId = discountProductRows.querySelector("[data-discount-product]")?.dataset.discountProduct;
  const checkedCount = page.rows.filter((product) => selectedDiscountProducts.has(product.id)).length;
  const selectedMatches = rows.filter((product) => selectedDiscountProducts.has(product.id)).length;
  const allMatchedSelected = rows.length > 0 && selectedMatches === rows.length;
  discountSelectPage.disabled = !page.rows.length;
  discountSelectPage.checked = page.rows.length > 0 && checkedCount === page.rows.length;
  discountSelectPage.indeterminate = checkedCount > 0 && checkedCount < page.rows.length;
  discountSelectMatches.hidden = !discountProductSearch.value.trim() && !discountProductCategory.value && discountProductView.value === "all";
  discountSelectMatches.disabled = !rows.length;
  discountSelectMatches.textContent = `${allMatchedSelected ? "取消选中全部结果" : "选中全部结果"}（${rows.length} 件）`;
  document.querySelector("#discountMatchCount").textContent = `找到 ${rows.length} 件商品，已选中其中 ${selectedMatches} 件`;
  document.querySelector("#discountSelectedCount").textContent = `已选 ${selectedDiscountProducts.size} 件商品`;
  document.querySelector("#discountFooterCount").textContent = `已选 ${selectedDiscountProducts.size} 件商品`;
  document.querySelector("#discountScopeHint").textContent = `本店可选现售商品 ${eligible.length} 件${storeConflictCount ? ` · ${storeConflictCount} 件与已有活动时间重叠` : ""}`;
  discountSelectStore.textContent = `选中全店 ${eligible.length} 件`;
  discountSelectStore.disabled = !eligible.some((product) => !selectedDiscountProducts.has(product.id));
  discountUndoSelection.disabled = previousDiscountSelection === null;

  discountProductRows.innerHTML = page.rows.map((product) => {
    const id = escapeHtml(product.id);
    const conflict = conflicts.get(product.id);
    const eligibleProduct = isDiscountProductEligible(product);
    const issue = !eligibleProduct ? "商品当前不可参与活动" : conflict ? `与「${conflict}」时间重叠` : "";
    return `
      <tr class="${selectedDiscountProducts.has(product.id) ? "discount-row-selected" : ""}">
        <td><input id="discount-check-${id}" type="checkbox" data-discount-product="${id}" aria-label="选择 ${escapeHtml(product.name)}" ${selectedDiscountProducts.has(product.id) ? "checked" : ""} /></td>
        <td>
          <label class="discount-product-name" for="discount-check-${id}">${escapeHtml(product.name)}</label>
          <small>${escapeHtml(product.spuCode || product.id)} · ${product.skus.length} 个规格</small>
          ${issue ? `<small class="discount-conflict">${escapeHtml(issue)}</small>` : ""}
        </td>
        <td>${escapeHtml(getCategoryPath(product.categoryId) || "类目不可用")}</td>
        <td>${product.skus.length ? discountPriceRange(product.skus.map((sku) => sku.price)) : "—"}</td>
      </tr>`;
  }).join("") || '<tr><td colspan="4"><small>当前范围没有商品，可调整筛选条件。</small></td></tr>';
  if (page.rows[0]?.id !== previousFirstId) discountProductScroll.scrollTop = 0;
  renderPagination("discountProducts", page.total, page.totalPages);
}

function getSelectedDiscountProducts(storeProducts = getStoreDiscountProducts()) {
  const byId = new Map(storeProducts.map((product) => [product.id, product]));
  return [...selectedDiscountProducts].map((id) => byId.get(id) || { id, name: id, skus: [] });
}

function renderDiscountReviewScope(selected, info) {
  const counts = new Map();
  for (const product of selected) {
    const category = getCategoryPath(product.categoryId) || "类目不可用";
    counts.set(category, (counts.get(category) || 0) + 1);
  }
  document.querySelector("#discountCategorySummary").innerHTML = [...counts].sort((a, b) => b[1] - a[1])
    .map(([category, count]) => `<li>${escapeHtml(category)} <strong>${count} 件</strong></li>`).join("");
  const issueSection = document.querySelector("#discountReviewIssues");
  issueSection.classList.add("hidden");
  if (discountReadOnly) return;
  const conflicts = getDiscountConflicts(info);
  const { unavailable, overlapping } = getDiscountReviewIssues(selected, conflicts);
  const issueCount = unavailable.length + overlapping.length;
  if (!issueCount) return;

  issueSection.classList.remove("hidden");
  document.querySelector("#discountRemoveIssues").textContent = `移除这 ${issueCount} 件商品`;
  document.querySelector("#discountReviewIssueList").innerHTML = [
    { title: "当前不可参与", products: unavailable },
    { title: "活动时间冲突", products: overlapping },
  ].filter((group) => group.products.length).map((group) => `<details open>
    <summary>${group.title} · ${group.products.length} 件</summary>
    <ul>${group.products.map((product) => {
      const conflict = conflicts.get(product.id);
      return `<li>${escapeHtml(product.name)} <small>${escapeHtml(product.spuCode || product.id)}${conflict ? ` · ${escapeHtml(conflict)}` : ""}</small></li>`;
    }).join("")}</ul>
  </details>`).join("");
}

function renderDiscountReview() {
  const info = readDiscountInfo();
  const selected = getSelectedDiscountProducts();
  renderDiscountReviewScope(selected, info);
  const page = getPageSlice(selected, "discountPreview");
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
  const categoryCounts = new Map();
  for (const product of getStoreDiscountProducts().filter(isDiscountProductEligible)) {
    categoryCounts.set(product.categoryId, (categoryCounts.get(product.categoryId) || 0) + 1);
  }
  discountProductCategory.innerHTML = '<option value="">全部类目</option>' + getLeafCategories().map((category) =>
    `<option value="${escapeHtml(category.id)}">${escapeHtml(getCategoryPath(category.id))}（${categoryCounts.get(category.id) || 0}）</option>`).join("");
  selectedDiscountProducts = new Set(campaign?.productIds || []);
  previousDiscountSelection = null;
  document.querySelector("#discountCodePanel").open = false;
  resetDiscountCodeMatch();
  const history = document.querySelector("#discountHistory");
  history.classList.toggle("hidden", !campaign?.history.length);
  history.innerHTML = campaign ? `<h4>操作记录</h4><ul class="record-list">${[...campaign.history].reverse().map((entry) =>
    `<li>${macauDiscountDateTime(entry.at).replace("T", " ")} · ${escapeHtml(entry.operator)} · ${entry.action}</li>`).join("")}</ul>` : "";
  ["discountProducts", "discountPreview"].forEach(resetPagination);
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
    const selected = getSelectedDiscountProducts();
    const conflicts = getDiscountConflicts(info, campaigns, now);
    const { unavailable, overlapping } = getDiscountReviewIssues(selected, conflicts);
    if (unavailable.length || overlapping.length) {
      renderDiscountReviewScope(selected, info);
      const message = unavailable.length
        ? `「${unavailable[0].name}」当前不可参与活动，请处理异常商品后再发布。`
        : `所选商品与「${conflicts.get(overlapping[0].id)}」的活动时间重叠，请修改时间或移除冲突商品。`;
      showDiscountError(message);
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
discountProductView.addEventListener("change", filterDiscountProducts);

function setDiscountSelection(ids, checked) {
  const next = new Set(selectedDiscountProducts);
  for (const id of ids) {
    if (checked) next.add(id);
    else next.delete(id);
  }
  if (next.size === selectedDiscountProducts.size) return;
  previousDiscountSelection = selectedDiscountProducts;
  selectedDiscountProducts = next;
  discountFormHint.textContent = "";
  if (discountStep === 2) renderDiscountProducts();
}

discountProductRows.addEventListener("change", (event) => {
  const { discountProduct } = event.target.dataset;
  setDiscountSelection([discountProduct], event.target.checked);
  const nextInput = discountProductRows.querySelector(`[data-discount-product="${CSS.escape(discountProduct)}"]`)
    || discountProductRows.querySelector("[data-discount-product]");
  (nextInput || discountProductView).focus({ preventScroll: true });
});
discountSelectPage.addEventListener("change", () => {
  const ids = [...discountProductRows.querySelectorAll("[data-discount-product]")].map((input) => input.dataset.discountProduct);
  setDiscountSelection(ids, discountSelectPage.checked);
});
discountSelectMatches.addEventListener("click", () => {
  const ids = getMatchingDiscountProducts().map((product) => product.id);
  setDiscountSelection(ids, !ids.every((id) => selectedDiscountProducts.has(id)));
});
discountSelectStore.addEventListener("click", () => {
  const ids = getStoreDiscountProducts().filter(isDiscountProductEligible).map((product) => product.id);
  setDiscountSelection(ids, true);
});
discountUndoSelection.addEventListener("click", () => {
  if (!previousDiscountSelection) return;
  selectedDiscountProducts = previousDiscountSelection;
  previousDiscountSelection = null;
  renderDiscountProducts();
});

function resetDiscountCodeMatch() {
  matchedDiscountCodeIds = [];
  discountAddCodes.disabled = true;
  discountCodeResult.textContent = "";
  discountCodeIssues.innerHTML = "";
}

function matchDiscountCodes() {
  resetDiscountCodeMatch();
  const entries = discountCodeInput.value.split(/[\n\r\t,，、;；]+/)
    .map((code) => code.trim().toUpperCase()).filter(Boolean);
  if (!entries.length) {
    discountCodeResult.textContent = "请先输入 SPU 编码。";
    return;
  }

  const productsByCode = new Map();
  for (const product of getStoreDiscountProducts()) {
    const key = product.spuCode.trim().toUpperCase();
    const matching = productsByCode.get(key) || [];
    matching.push(product);
    productsByCode.set(key, matching);
  }
  const unique = new Set();
  const duplicates = new Set();
  const missing = [];
  const unavailable = [];
  const ambiguous = [];
  for (const code of entries) {
    if (unique.has(code)) {
      duplicates.add(code);
      continue;
    }
    unique.add(code);
    const matches = productsByCode.get(code) || [];
    if (!matches.length) missing.push(code);
    else if (matches.length > 1) ambiguous.push(code);
    else if (!isDiscountProductEligible(matches[0])) unavailable.push(code);
    else matchedDiscountCodeIds.push(matches[0].id);
  }

  discountCodeResult.textContent = `匹配 ${matchedDiscountCodeIds.length} 件 · 重复 ${entries.length - unique.size} 条 · 未匹配 ${missing.length} 条 · 不可参与 ${unavailable.length} 条 · 编码不唯一 ${ambiguous.length} 条`;
  discountCodeIssues.innerHTML = [
    ["重复编码", [...duplicates]], ["未匹配编码", missing], ["不可参与编码", unavailable], ["对应多个商品的编码", ambiguous],
  ].filter(([, codes]) => codes.length).map(([label, codes]) => `<details>
    <summary>${label} · ${codes.length} 个</summary><p>${codes.map(escapeHtml).join("、")}</p>
  </details>`).join("");
  discountAddCodes.disabled = !matchedDiscountCodeIds.length;
}

discountCodeInput.addEventListener("input", resetDiscountCodeMatch);
document.querySelector("#discountCheckCodes").addEventListener("click", matchDiscountCodes);
discountAddCodes.addEventListener("click", () => {
  const previousCount = selectedDiscountProducts.size;
  setDiscountSelection(matchedDiscountCodeIds, true);
  discountCodeResult.textContent += ` · 新增 ${selectedDiscountProducts.size - previousCount} 件`;
  discountAddCodes.disabled = true;
});

document.querySelector("#discountRemoveIssues").addEventListener("click", () => {
  if (discountReadOnly || discountStep !== 3) return;
  const { unavailable, overlapping } = getDiscountReviewIssues(getSelectedDiscountProducts(), getDiscountConflicts(readDiscountInfo()));
  setDiscountSelection([...unavailable, ...overlapping].map((product) => product.id), false);
  showDiscountStep(selectedDiscountProducts.size ? 3 : 2);
});
window.addEventListener("storage", (event) => {
  if (event.key !== StoreDiscounts.storageKey || discountsPage.classList.contains("hidden")) return;
  renderDiscounts();
  if (discountDialog.open && discountStep === 2) renderDiscountProducts();
  if (discountDialog.open && discountStep === 3 && !discountReadOnly) renderDiscountReview();
});
