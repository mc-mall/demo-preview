const StoreDiscounts = (() => {
  const storageKey = "mc-mall.store-discounts.v1";
  const demoStoreId = "store-nam-van";
  const toCents = (amount) => Math.round(amount * 100);
  const discountedCents = (price, fold) => Math.round(toCents(price) * Math.round(fold * 10) / 100);

  let memoryCampaigns;

  function read() {
    if (memoryCampaigns) return memoryCampaigns;
    try {
      const stored = JSON.parse(localStorage.getItem(storageKey));
      if (Array.isArray(stored)) return stored;
    } catch {
      // Keep the standalone preview usable when browser storage is unavailable.
    }

    const now = Date.now();
    const campaigns = [{
      id: "demo-sports-discount",
      storeId: demoStoreId,
      name: "运动长裤限时折扣",
      productIds: ["spu-pc-pants"],
      fold: 8,
      useDiscountedFreeShipping: false,
      startsAt: now,
      endsAt: now + 7 * 24 * 60 * 60 * 1000,
      published: true,
      history: [{ action: "发布活动", operator: "演示数据", at: now }],
    }];
    write(campaigns);
    return campaigns;
  }

  function write(campaigns) {
    try {
      localStorage.setItem(storageKey, JSON.stringify(campaigns));
      memoryCampaigns = undefined;
    } catch {
      memoryCampaigns = campaigns;
    }
  }

  function status(campaign, now = Date.now()) {
    if (!campaign.published) return "草稿";
    if (campaign.endedAt || now >= campaign.endsAt) return "已结束";
    return now < campaign.startsAt ? "待开始" : "进行中";
  }

  function nextBoundary(campaigns, now) {
    const future = campaigns.filter((campaign) => campaign.published && !campaign.endedAt)
      .flatMap((campaign) => [campaign.startsAt, campaign.endsAt])
      .filter((time) => time > now);
    return Math.min(...future);
  }

  function campaignFor(product, campaigns, now) {
    if (product.status !== "在售") return undefined;
    return campaigns.find((campaign) =>
      campaign.storeId === (product.storeId || demoStoreId) &&
      campaign.productIds.includes(product.id) &&
      status(campaign, now) === "进行中"
    );
  }

  return { storageKey, demoStoreId, read, write, status, toCents, discountedCents, campaignFor, nextBoundary };
})();
