const discountDialog = document.querySelector("#discountDialog");
const discountForm = document.querySelector("#discountForm");
const discountSearch = document.querySelector("#discountSearch");
const discountStatus = document.querySelector("#discountStatus");
const discountRows = document.querySelector("#discountRows");
const discountProductSearch = document.querySelector("#discountProductSearch");
const discountProductCategory = document.querySelector("#discountProductCategory");
const discountProductRows = document.querySelector("#discountProductRows");
const discountSelectPage = document.querySelector("#discountSelectPage");
const discountPricePreview = document.querySelector("#discountPricePreview");
const discountFold = document.querySelector("#discountFold");
const discountFormHint = document.querySelector("#discountFormHint");
const endDiscountDialog = document.querySelector("#endDiscountDialog");
let editingDiscountId;
let endingDiscountId;
let discountReadOnly;
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

function renderDiscountProducts() {
  const keyword = discountProductSearch.value.trim().toLowerCase();
  const categoryId = discountProductCategory.value;
  const rows = getStoreDiscountProducts().filter((product) => {
    const searchText = [product.name, product.spuCode, ...product.skus.map((sku) => sku.code)].join(" ").toLowerCase();
    return isDiscountProductEligible(product) && (!categoryId || product.categoryId === categoryId) && searchText.includes(keyword);
  });
  const page = getPageSlice(rows, "discountProducts");
  const checkedCount = page.rows.filter((product) => selectedDiscountProducts.has(product.id)).length;
  discountSelectPage.disabled = !page.rows.length;
  discountSelectPage.checked = page.rows.length > 0 && checkedCount === page.rows.length;
  discountSelectPage.indeterminate = checkedCount > 0 && checkedCount < page.rows.length;
  discountProductRows.innerHTML = page.rows.map((product) => `
    <tr>
      <td><input type="checkbox" data-discount-product="${escapeHtml(product.id)}" aria-label="选择 ${escapeHtml(product.name)}" ${selectedDiscountProducts.has(product.id) ? "checked" : ""} /></td>
      <td><strong>${escapeHtml(product.name)}</strong><br><small>${escapeHtml(product.spuCode)}</small></td>
      <td>${escapeHtml(getCategoryPath(product.categoryId))}</td><td>${product.skus.length}</td>
    </tr>`).join("") || '<tr><td colspan="4"><small>暂无可选现售商品。</small></td></tr>';
  renderPagination("discountProducts", page.total, page.totalPages);
  renderDiscountPricePreview();
}

function renderDiscountPricePreview() {
  const storeProducts = getStoreDiscountProducts();
  const fold = discountFold.valueAsNumber;
  document.querySelector("#discountSelectedCount").textContent = `已选 ${selectedDiscountProducts.size} 件`;
  discountPricePreview.innerHTML = Array.from(selectedDiscountProducts, (id) => {
    const product = storeProducts.find((item) => item.id === id);
    const skuRows = product?.skus.map((sku) => `
      <div class="discount-sku-row"><span>${escapeHtml(sku.spec)} <small>${escapeHtml(sku.code)}</small></span>
        <span><del>${formatOrderMoney(sku.price)}</del> <strong>${discountFold.validity.valid ? formatOrderMoney(StoreDiscounts.discountedCents(sku.price, fold) / 100) : "—"}</strong></span>
      </div>`).join("") || '<p class="form-hint">此商品已不可用。</p>';
    return `
      <div class="discount-selected-item">
        <div class="mini-head"><strong>${escapeHtml(product?.name || id)}</strong>
          ${discountReadOnly ? "" : `<button type="button" class="text-btn" data-remove-discount-product="${escapeHtml(id)}">移除</button>`}
        </div>
        ${skuRows}
      </div>`;
  }).join("") || '<p class="form-hint">选中商品后，可在这里查看各规格的折后价。</p>';
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
  document.querySelector("#discountName").value = campaign?.name || "";
  discountFold.value = campaign?.fold ?? 8.5;
  document.querySelector("#discountStartsAt").value = macauDiscountDateTime(campaign?.startsAt ?? now);
  document.querySelector("#discountEndsAt").value = macauDiscountDateTime(campaign?.endsAt ?? now + 24 * 60 * minute);
  document.querySelector("#discountFreeShipping").checked = Boolean(campaign?.useDiscountedFreeShipping);
  document.querySelector("#discountFields").disabled = discountReadOnly;
  document.querySelector("#discountPicker").classList.toggle("hidden", discountReadOnly);
  document.querySelector("#discountFormActions").classList.toggle("hidden", discountReadOnly);
  document.querySelector("#saveDiscountDraftBtn").hidden = !canEdit;
  document.querySelector("#publishDiscountBtn").hidden = !canPublish;
  discountProductCategory.innerHTML = '<option value="">全部类目</option>' + getLeafCategories().map((category) =>
    `<option value="${escapeHtml(category.id)}">${escapeHtml(getCategoryPath(category.id))}</option>`).join("");
  selectedDiscountProducts = new Set(campaign?.productIds || []);
  const history = document.querySelector("#discountHistory");
  history.classList.toggle("hidden", !campaign?.history.length);
  history.innerHTML = campaign ? `<h4>操作记录</h4><ul class="record-list">${[...campaign.history].reverse().map((entry) =>
    `<li>${macauDiscountDateTime(entry.at).replace("T", " ")} · ${escapeHtml(entry.operator)} · ${entry.action}</li>`).join("")}</ul>` : "";
  discountFormHint.textContent = "";
  resetPagination("discountProducts");
  renderDiscountProducts();
  discountDialog.showModal();
}

discountForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const publish = event.submitter?.value === "publish";
  if (discountReadOnly || !canUseDiscounts(publish ? "discount_publish" : "discount_edit")) return;
  const campaigns = StoreDiscounts.read();
  const existing = campaigns.find((campaign) => campaign.id === editingDiscountId && campaign.storeId === currentStoreId);
  if (editingDiscountId && (!existing || existing.published)) {
    discountFormHint.textContent = "活动已更新，请关闭弹窗后重试。";
    return;
  }

  const name = document.querySelector("#discountName").value.trim();
  const startsAt = Date.parse(document.querySelector("#discountStartsAt").value + "+08:00");
  const endsAt = Date.parse(document.querySelector("#discountEndsAt").value + "+08:00");
  const productIds = [...selectedDiscountProducts];
  const now = Date.now();
  if (!name || !productIds.length) {
    discountFormHint.textContent = "请填写活动名称并选择至少一件商品。";
    return;
  }
  if (!Number.isFinite(startsAt) || !Number.isFinite(endsAt) || endsAt <= startsAt || (publish && endsAt <= now)) {
    discountFormHint.textContent = "结束时间须晚于开始时间，发布时活动须尚未到期。";
    return;
  }

  if (publish) {
    const eligible = getStoreDiscountProducts().filter(isDiscountProductEligible);
    if (productIds.some((id) => !eligible.some((product) => product.id === id))) {
      discountFormHint.textContent = "已选商品中有商品不可参与活动，请移除后再发布。";
      return;
    }
    const overlap = campaigns.find((campaign) => campaign.storeId === currentStoreId &&
      ["待开始", "进行中"].includes(StoreDiscounts.status(campaign, now)) &&
      campaign.startsAt < endsAt && startsAt < campaign.endsAt &&
      campaign.productIds.some((id) => selectedDiscountProducts.has(id)));
    if (overlap) {
      discountFormHint.textContent = `所选商品与「${overlap.name}」的活动时间重叠，请调整时间或商品。`;
      return;
    }
  }

  const campaign = {
    id: existing?.id || crypto.randomUUID(),
    storeId: currentStoreId,
    name, productIds, startsAt, endsAt,
    fold: discountFold.valueAsNumber,
    useDiscountedFreeShipping: document.querySelector("#discountFreeShipping").checked,
    published: publish,
    history: [...(existing?.history || []), {
      action: publish ? "发布活动" : "保存草稿",
      operator: getEmployeeById(currentEmployeeId).name,
      at: now,
    }],
  };
  StoreDiscounts.write([campaign, ...campaigns.filter((item) => item.id !== campaign.id)]);
  discountDialog.close();
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
discountFold.addEventListener("input", renderDiscountPricePreview);
discountSearch.addEventListener("input", () => { resetPagination("discounts"); renderDiscounts(); });
discountStatus.addEventListener("change", () => { resetPagination("discounts"); renderDiscounts(); });
discountProductSearch.addEventListener("input", () => { resetPagination("discountProducts"); renderDiscountProducts(); });
discountProductCategory.addEventListener("change", () => { resetPagination("discountProducts"); renderDiscountProducts(); });
discountProductRows.addEventListener("change", (event) => {
  const { discountProduct } = event.target.dataset;
  if (event.target.checked) selectedDiscountProducts.add(discountProduct);
  else selectedDiscountProducts.delete(discountProduct);
  renderDiscountProducts();
  discountProductRows.querySelector(`[data-discount-product="${CSS.escape(discountProduct)}"]`)?.focus();
});
discountSelectPage.addEventListener("change", () => {
  discountProductRows.querySelectorAll("[data-discount-product]").forEach((input) => {
    if (discountSelectPage.checked) selectedDiscountProducts.add(input.dataset.discountProduct);
    else selectedDiscountProducts.delete(input.dataset.discountProduct);
  });
  renderDiscountProducts();
});
discountPricePreview.addEventListener("click", (event) => {
  const button = event.target.closest("[data-remove-discount-product]");
  if (!button || discountReadOnly) return;
  selectedDiscountProducts.delete(button.dataset.removeDiscountProduct);
  renderDiscountProducts();
});
window.addEventListener("storage", (event) => {
  if (event.key === StoreDiscounts.storageKey && !discountsPage.classList.contains("hidden")) renderDiscounts();
});
