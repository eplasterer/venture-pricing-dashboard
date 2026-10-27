"use strict";

const REPRESENTATIVE_TIER = {
  justwatch: "Plus (includes Pro discovery features)",
  reelgood: "Streaming Guide",
  letterboxd: "Pro",
  trakt: "VIP annual"
};
const OFFICIAL_WEBSITES = {
  justwatch: "https://www.justwatch.com/us/",
  reelgood: "https://reelgood.com/us",
  letterboxd: "https://letterboxd.com/",
  trakt: "https://app.trakt.tv/"
};

const state = {
  data: null,
  repOffers: [],
  activeCompetitorType: "all",
  activeOfferFilter: "all",
  activeOfferBand: null,
  selectedCompetitors: new Set(),
  price: 2.49,
  sourceMap: new Map(),
  toastTimer: null
};

const $ = (selector, root) => (root || document).querySelector(selector);
const $$ = (selector, root) => Array.from((root || document).querySelectorAll(selector));
const money = (value, decimals) => "$" + Number(value).toLocaleString("en-US", {
  minimumFractionDigits: decimals === undefined ? 2 : decimals,
  maximumFractionDigits: decimals === undefined ? 2 : decimals
});
const monthMoney = (value) => value === 0 ? "$0" : money(value, 2) + " / mo";
const escapeHtml = (value) => String(value == null ? "" : value).replace(/[&<>"']/g, (char) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;"
}[char]));
const getSource = (id) => state.sourceMap.get(id);

function percentile(sortedValues, p) {
  if (!sortedValues.length) return 0;
  if (sortedValues.length === 1) return sortedValues[0];
  const index = (sortedValues.length - 1) * p;
  const lower = Math.floor(index);
  const upper = Math.ceil(index);
  if (lower === upper) return sortedValues[lower];
  return sortedValues[lower] + (sortedValues[upper] - sortedValues[lower]) * (index - lower);
}

function benchmarkStats() {
  const prices = state.repOffers.map((offer) => Number(offer.monthly_equivalent_usd)).sort((a, b) => a - b);
  const middle = prices.length % 2 ? prices[(prices.length - 1) / 2] : (prices[prices.length / 2 - 1] + prices[prices.length / 2]) / 2;
  return {
    prices,
    min: prices[0] || 0,
    max: prices[prices.length - 1] || 0,
    mean: prices.reduce((sum, value) => sum + value, 0) / (prices.length || 1),
    median: middle,
    q1: percentile(prices, 0.25),
    q3: percentile(prices, 0.75)
  };
}

function classifyPrice(price) {
  const stats = benchmarkStats();
  if (price < stats.min) return { name: "Below observed range", css: "above", detail: "Below " + money(stats.min) + " / month, the minimum representative benchmark." };
  if (price > stats.max) return { name: "Above observed range", css: "above", detail: "Above " + money(stats.max) + " / month, the maximum representative benchmark." };
  if (price <= stats.q1) return { name: "Budget-oriented", css: "budget", detail: "At or below the representative sample's first quartile (" + money(stats.q1) + ")." };
  if (price <= stats.q3) return { name: "Near market middle", css: "middle", detail: "Between the representative sample's first and third quartiles." };
  return { name: "Premium-oriented", css: "premium", detail: "Above the representative sample's third quartile (" + money(stats.q3) + "), within the observed range." };
}

function competitorPosition(price) {
  return classifyPrice(price).name;
}

function sortedCompetitors() {
  const sort = $("#competitor-sort").value;
  const competitors = state.data.competitors.slice();
  if (sort === "price-asc") return competitors.sort((a, b) => repFor(a.id).monthly_equivalent_usd - repFor(b.id).monthly_equivalent_usd);
  if (sort === "price-desc") return competitors.sort((a, b) => repFor(b.id).monthly_equivalent_usd - repFor(a.id).monthly_equivalent_usd);
  return competitors.sort((a, b) => a.name.localeCompare(b.name));
}

function repFor(id) {
  return state.repOffers.find((offer) => offer.competitor_id === id);
}

function repOffer(competitor) {
  return state.data.pricing_offers.find((offer) => offer.competitor_id === competitor.id && offer.tier === REPRESENTATIVE_TIER[competitor.id]);
}

function compOfficialUrl(competitor) {
  return OFFICIAL_WEBSITES[competitor.id] || "https://www.justwatch.com/us/";
}

function init() {
  fetch("./competitor_data.json")
    .then((response) => {
      if (!response.ok) throw new Error("Could not load the Mission 1 research JSON.");
      return response.json();
    })
    .then((data) => {
      state.data = data;
      state.sourceMap = new Map(data.sources.map((source) => [source.id, source]));
      state.repOffers = data.competitors.map((competitor) => {
        const offer = repOffer(competitor);
        if (!offer) throw new Error("Representative offer missing for " + competitor.name + ".");
        return Object.assign({}, offer, { representative: true });
      });
      renderAll();
      bindEvents();
      observeNavigation();
    })
    .catch((error) => {
      $("#main-content").innerHTML = '<section class="panel" style="margin:48px auto;padding:28px;max-width:700px"><h1>Research data could not load</h1><p>' + escapeHtml(error.message) + '</p><p>Serve the project from a local web server or the deployed GitHub Pages site.</p></section>';
    });
}

function renderAll() {
  renderKpis();
  renderRepresentativeChart();
  renderReadout();
  renderRangeChart();
  renderDistribution();
  renderCompetitors();
  renderOfferSummary();
  renderOffers();
  renderExplorer();
  renderOpportunities();
  renderMethodology();
}

function renderKpis() {
  const freeCount = state.data.pricing_comparison.free_core_access.sample_size;
  const stats = benchmarkStats();
  const indirectCount = state.data.competitors.filter((competitor) => competitor.relationship.toLowerCase() === "indirect").length;
  const cards = [
    { label: "Competitors tracked", value: state.data.competitors.length, sub: (state.data.competitors.length - indirectCount) + " direct / adjacent · " + indirectCount + " indirect", tone: "kpi-accent" },
    { label: "Researched offers", value: state.data.pricing_offers.length, sub: "Full researched pricing set", tone: "" },
    { label: "Comparable benchmarks", value: state.repOffers.length, sub: "One representative offer per competitor", tone: "kpi-accent" },
    { label: "Free entry routes", value: freeCount + " / " + state.data.competitors.length, sub: "Within the selected competitor sample", tone: "" },
    { label: "Representative low", value: money(stats.min), sub: "Monthly equivalent · four-offer set", tone: "" },
    { label: "Representative high", value: money(stats.max), sub: "Monthly equivalent · four-offer set", tone: "kpi-accent" },
    { label: "Representative median", value: money(stats.median), sub: "Monthly equivalent · four-offer set", tone: "" },
    { label: "Representative average", value: money(stats.mean), sub: "Monthly equivalent · four-offer set", tone: "kpi-accent" }
  ];
  $("#kpi-grid").innerHTML = cards.map((card) => '<article class="kpi-card"><div class="kpi-label">' + escapeHtml(card.label) + '</div><div class="kpi-value ' + card.tone + '">' + escapeHtml(card.value) + '</div><div class="kpi-sub">' + escapeHtml(card.sub) + '</div></article>').join("");
}

function renderRepresentativeChart() {
  const sorted = state.repOffers.slice().sort((a, b) => a.monthly_equivalent_usd - b.monthly_equivalent_usd);
  const colors = ["#71d8bb", "#86aaf0", "#97b8fb", "#c5a8ef"];
  const width = 650;
  const left = 116;
  const right = 40;
  const top = 13;
  const rowHeight = 39;
  const chartWidth = width - left - right;
  const max = Math.max(6, benchmarkStats().max);
  const height = top + sorted.length * rowHeight + 23;
  const ticks = [0, 2, 4, 6];
  let svg = '<svg viewBox="0 0 ' + width + " " + height + '" class="representative-svg" role="img" aria-label="Bar chart comparing one representative monthly equivalent price per competitor">';
  ticks.forEach((tick) => {
    const x = left + (tick / max) * chartWidth;
    svg += '<line x1="' + x + '" y1="' + (top - 2) + '" x2="' + x + '" y2="' + (top + sorted.length * rowHeight - 4) + '" stroke="#25303d" stroke-dasharray="3 5"/>';
    svg += '<text x="' + x + '" y="' + (height - 2) + '" text-anchor="middle" class="svg-axis">' + (tick === 0 ? "$0" : "$" + tick) + "</text>";
  });
  sorted.forEach((offer, index) => {
    const competitor = state.data.competitors.find((item) => item.id === offer.competitor_id);
    const y = top + index * rowHeight + 6;
    const barWidth = offer.monthly_equivalent_usd === 0 ? 5 : Math.max(5, offer.monthly_equivalent_usd / max * chartWidth);
    const source = getSource((offer.source_ids || [])[0]);
    const color = colors[index % colors.length];
    svg += '<g class="chart-clickable" data-competitor="' + escapeHtml(competitor.id) + '" tabindex="0" role="button" aria-label="Select ' + escapeHtml(competitor.name) + ' at ' + escapeHtml(monthMoney(offer.monthly_equivalent_usd)) + '">';
    svg += "<title>" + escapeHtml(competitor.name + " · " + offer.tier + " · " + offer.price_display + " · " + offer.billing_period + " · " + offer.scope + (source ? " · Source: " + source.title : "")) + "</title>";
    svg += '<text x="0" y="' + (y + 11) + '" class="svg-label">' + escapeHtml(competitor.name) + "</text>";
    svg += '<rect x="' + left + '" y="' + y + '" width="' + chartWidth + '" height="17" rx="5" fill="#1a2330"/>';
    svg += '<rect x="' + left + '" y="' + y + '" width="' + barWidth + '" height="17" rx="5" fill="' + color + '" opacity=".9"/>';
    svg += '<text x="' + (left + Math.min(chartWidth - 2, barWidth + 7)) + '" y="' + (y + 12) + '" class="svg-value">' + escapeHtml(monthMoney(offer.monthly_equivalent_usd)) + "</text>";
    svg += "</g>";
  });
  svg += "</svg>";
  $("#representative-chart").innerHTML = svg;
  $("#rep-chart-note").textContent = "· clickable bars select a competitor";
  $$("#representative-chart [data-competitor]").forEach((item) => {
    item.addEventListener("click", () => toggleCompetitor(item.dataset.competitor));
    item.addEventListener("keydown", (event) => { if (event.key === "Enter" || event.key === " ") { event.preventDefault(); toggleCompetitor(item.dataset.competitor); } });
  });
}

function renderReadout() {
  const paidMonthly = state.data.pricing_comparison.paid_plans_billed_monthly;
  const paid = state.data.pricing_comparison.paid_plan_monthly_equivalent;
  const monthlyCount = state.data.pricing_offers.filter((offer) => offer.price_usd > 0 && offer.billing_period === "Monthly").length;
  const annualCount = state.data.pricing_offers.filter((offer) => offer.price_usd > 0 && offer.billing_period === "Annual").length;
  const namesByPosition = (position) => state.data.competitors.filter((competitor) => competitorPosition(repFor(competitor.id).monthly_equivalent_usd) === position).map((competitor) => competitor.name).join(", ") || "none in this sample";
  const items = [
    ["01", "Free access and mixed billing", "All four sampled services have a $0 entry route. The paid sample has " + monthlyCount + " monthly-billed and " + annualCount + " annual memberships."],
    ["02", "Paid tiers span a wide range", "The five paid memberships normalize to " + money(paid.low_usd) + "–" + money(paid.high_usd) + " per month equivalent; bundles and feature sets differ."],
    ["03", "Representative price positions", "Budget: " + namesByPosition("Budget-oriented") + ". Middle: " + namesByPosition("Near market middle") + ". Premium: " + namesByPosition("Premium-oriented") + ". Quartiles classify one selected offer per competitor."],
    ["04", "JustWatch is a bundle benchmark", "Its " + money(paidMonthly.low_usd) + " monthly plan combines discovery features with ad-free viewing and rental savings."],
    ["05", "Group choice may be a testable gap", "The prior review found no explicit group-consensus chooser in the pages it checked. Treat that as an opportunity hypothesis, not proven demand."]
  ];
  $("#market-readout").innerHTML = items.map((item) => '<div class="readout-item"><span class="readout-index">' + item[0] + '</span><div><strong>' + escapeHtml(item[1]) + '</strong><p>' + escapeHtml(item[2]) + "</p></div></div>").join("");
}

function renderRangeChart() {
  const max = Math.max(6, ...state.data.pricing_offers.map((offer) => offer.monthly_equivalent_usd));
  const rows = state.data.competitors.map((competitor) => {
    const offers = state.data.pricing_offers.filter((offer) => offer.competitor_id === competitor.id);
    return { competitor, min: Math.min(...offers.map((offer) => offer.monthly_equivalent_usd)), max: Math.max(...offers.map((offer) => offer.monthly_equivalent_usd)), count: offers.length };
  });
  $("#range-chart").innerHTML = rows.map((row) => {
    const left = row.min / max * 100;
    const width = Math.max(row.max === 0 ? 1 : 1.6, (row.max - row.min) / max * 100);
    return '<div class="range-row"><span class="range-name">' + escapeHtml(row.competitor.name) + '</span><span class="range-track" aria-label="' + escapeHtml(row.competitor.name + " price span from " + monthMoney(row.min) + " to " + monthMoney(row.max) + " across " + row.count + " offers") + '"><i class="range-span ' + (row.max === 0 ? "zero" : "") + '" style="left:' + left + "%;width:" + width + '%"></i></span><span class="range-values"><strong>' + escapeHtml(money(row.min) + "–" + money(row.max)) + '</strong><small>' + row.count + (row.count === 1 ? " offer" : " offers") + "</small></span></div>";
  }).join("") + '<div class="range-axis"><span>$0</span><span>$2</span><span>$4</span><span>$6</span></div>';
}

function distributionBuckets() {
  const offers = state.data.pricing_offers;
  const buckets = [
    { id: "free", label: "Free · $0", count: 0, css: "free", match: (price) => price === 0 },
    { id: "under2", label: "Under $2", count: 0, css: "", match: (price) => price > 0 && price < 2 },
    { id: "twoToFive", label: "$2 to <$5", count: 0, css: "warm", match: (price) => price >= 2 && price < 5 },
    { id: "fivePlus", label: "$5 and up", count: 0, css: "premium", match: (price) => price >= 5 }
  ];
  offers.forEach((offer) => buckets.forEach((bucket) => { if (bucket.match(Number(offer.monthly_equivalent_usd))) bucket.count += 1; }));
  return buckets;
}

function renderDistribution() {
  const buckets = distributionBuckets();
  const max = Math.max(1, ...buckets.map((bucket) => bucket.count));
  $("#distribution-chart").innerHTML = buckets.map((bucket) => '<button class="dist-row distribution-filter" type="button" data-band="' + bucket.id + '" aria-label="Filter offers in price band ' + escapeHtml(bucket.label) + '"><span class="dist-label">' + escapeHtml(bucket.label) + '</span><span class="dist-track"><i class="dist-fill ' + bucket.css + '" style="width:' + (bucket.count / max * 100) + '%"></i></span><span class="dist-count">' + bucket.count + "</span></button>").join("");
  $$(".distribution-filter").forEach((button) => button.addEventListener("click", () => {
    $("#offer-search").value = "";
    $("#offer-filters .filter-pill").forEach((pill) => pill.classList.toggle("active", pill.dataset.filter === "all"));
    state.activeOfferFilter = "all";
    state.activeOfferBand = button.dataset.band;
    renderOffers();
    document.querySelector("#pricing").scrollIntoView({ behavior: "smooth" });
    showToast("Showing offers in the " + button.querySelector(".dist-label").textContent + " band.");
  }));
}

function positionCss(name) {
  if (name === "Budget-oriented") return "budget";
  if (name === "Premium-oriented") return "premium";
  if (name === "Above observed range" || name === "Below observed range") return "above";
  return "middle";
}

function includesSearch(competitor, rep, query) {
  const haystack = [competitor.name, competitor.relationship, competitor.positioning, competitor.customer_overlap, rep.tier, rep.scope, ...(competitor.strengths || []), ...(competitor.gaps_or_limitations || [])].join(" ").toLowerCase();
  return haystack.includes(query);
}

function renderCompetitors() {
  const query = $("#competitor-search").value.trim().toLowerCase();
  const position = $("#competitor-position").value;
  const filtered = sortedCompetitors().filter((competitor) => {
    const rep = repFor(competitor.id);
    const relationMatches = state.activeCompetitorType === "all" ||
      (state.activeCompetitorType === "indirect" ? competitor.relationship.toLowerCase() === "indirect" : competitor.relationship.toLowerCase() !== "indirect");
    const positionMatches = position === "all" || competitorPosition(rep.monthly_equivalent_usd) === position;
    return relationMatches && positionMatches && includesSearch(competitor, rep, query);
  });
  if (!filtered.length) {
    $("#competitor-cards").innerHTML = '<div class="empty-state"><strong>No competitors match these filters.</strong>Clear the search or select a wider competitor group.</div>';
  } else {
    $("#competitor-cards").innerHTML = filtered.map((competitor) => {
      const rep = repFor(competitor.id);
      const selected = state.selectedCompetitors.has(competitor.id);
      const direct = competitor.relationship.toLowerCase() === "indirect" ? "indirect" : "direct";
      const features = (competitor.strengths || []).slice(0, 3).map((feature) => '<span class="feature-tag">' + escapeHtml(feature) + "</span>").join("");
      const strengths = (competitor.strengths || []).map((item) => "<li>" + escapeHtml(item) + "</li>").join("");
      const gaps = (competitor.gaps_or_limitations || []).map((item) => "<li>" + escapeHtml(item) + "</li>").join("");
      const url = compOfficialUrl(competitor);
      return '<article class="competitor-card ' + (selected ? "selected" : "") + '" data-id="' + escapeHtml(competitor.id) + '">' +
        '<div class="comp-topline"><div class="comp-identity"><span class="comp-mark" aria-hidden="true">' + escapeHtml(competitor.name.slice(0, 1)) + '</span><div><h3>' + escapeHtml(competitor.name) + '</h3><p>' + escapeHtml(competitor.relationship) + '</p></div></div>' +
        '<label class="select-competitor"><input type="checkbox" data-select="' + escapeHtml(competitor.id) + '" ' + (selected ? "checked" : "") + ' aria-label="Select ' + escapeHtml(competitor.name) + ' for comparison"> Compare</label></div>' +
        '<div class="comp-price-row"><div><div class="comp-price">' + escapeHtml(monthMoney(rep.monthly_equivalent_usd)) + '</div><small>' + escapeHtml(rep.tier) + "</small></div>" +
        '<div class="comp-tier">' + escapeHtml(rep.billing_period + " · " + rep.price_display) + '</div></div>' +
        '<div class="comp-position-row"><span class="position-tag ' + positionCss(competitorPosition(rep.monthly_equivalent_usd)) + '">' + escapeHtml(competitorPosition(rep.monthly_equivalent_usd)) + '</span><span class="type-tag ' + direct + '">' + (direct === "indirect" ? "INDIRECT" : "DIRECT / ADJACENT") + '</span></div>' +
        '<p class="profile-line"><strong>Positioning</strong> · ' + escapeHtml(competitor.positioning) + '</p>' +
        '<p class="profile-line" style="margin-top:6px"><strong>Audience overlap</strong> · ' + escapeHtml(competitor.customer_overlap) + '</p>' +
        '<div class="feature-tags">' + features + "</div>" +
        '<details class="comp-details"><summary>Profile details, strengths &amp; limitations</summary><div class="detail-columns"><div><h4>Strengths</h4><ul>' + strengths + '</ul></div><div><h4>Limitations</h4><ul>' + gaps + '</ul></div></div><a class="website-link" href="' + escapeHtml(url) + '" target="_blank" rel="noopener noreferrer">Open official website ↗</a><span class="source-context">Research source links are listed in Sources &amp; Methodology.</span></details></article>';
    }).join("");
    $$("[data-select]", $("#competitor-cards")).forEach((checkbox) => checkbox.addEventListener("change", () => toggleCompetitor(checkbox.dataset.select)));
  }
  renderCompareDrawer();
}

function toggleCompetitor(id) {
  if (state.selectedCompetitors.has(id)) state.selectedCompetitors.delete(id);
  else state.selectedCompetitors.add(id);
  renderCompetitors();
  const names = Array.from(state.selectedCompetitors).map((compId) => state.data.competitors.find((item) => item.id === compId).name);
  showToast(names.length ? names.length + " competitor" + (names.length === 1 ? "" : "s") + " selected for comparison." : "Competitor selection cleared.");
}

function renderCompareDrawer() {
  const selected = state.data.competitors.filter((competitor) => state.selectedCompetitors.has(competitor.id));
  if (!selected.length) {
    $("#comparison-drawer").innerHTML = '<div class="drawer-head"><strong>Side-by-side comparison</strong><span>SELECT COMPETITORS ABOVE</span></div><div class="compare-empty">Select one or more profiles to compare their representative price, tier and key limitation here.</div>';
  } else {
    $("#comparison-drawer").innerHTML = '<div class="drawer-head"><strong>Side-by-side comparison</strong><span>' + selected.length + " selected</span></div><div class=\"compare-grid\">" + selected.map((competitor) => {
      const rep = repFor(competitor.id);
      const limitation = (competitor.gaps_or_limitations || [])[0] || "No limitation reported.";
      return '<div class="compare-mini"><strong>' + escapeHtml(competitor.name) + '</strong><b>' + escapeHtml(monthMoney(rep.monthly_equivalent_usd)) + '</b><small>' + escapeHtml(rep.tier + " · " + rep.verification + " price evidence") + '</small><small>' + escapeHtml(limitation) + "</small></div>";
    }).join("") + "</div>";
  }
}

function renderOfferSummary() {
  const all = state.data.pricing_offers;
  const verified = all.filter((offer) => offer.verification.toLowerCase().startsWith("verified")).length;
  const partial = all.length - verified;
  const paid = state.data.pricing_comparison.paid_plan_monthly_equivalent;
  $("#offer-summary").innerHTML =
    '<span class="summary-chip"><strong>' + all.length + "</strong> researched offers</span>" +
    '<span class="summary-chip"><strong>' + all.filter((offer) => offer.price_usd === 0).length + "</strong> free entry records</span>" +
    '<span class="summary-chip"><strong>' + paid.sample_size + "</strong> paid membership records</span>" +
    '<span class="summary-chip"><strong>' + verified + " verified · " + partial + "</strong> partially verified</span>" +
    '<span class="summary-chip"><strong>' + money(paid.low_usd) + "–" + money(paid.high_usd) + "</strong> paid monthly-equivalent span</span>";
}

function offerPromotion(offer) {
  if (offer.competitor_id === "justwatch" && offer.price_usd > 0) return "7-day trial; $49.99 lifetime offer is limited-time and excluded";
  const txt = offer.notes || "";
  return txt.toLowerCase().includes("promo") ? txt : "None reported in research";
}

function sourceLinkForOffer(offer) {
  const source = getSource((offer.source_ids || [])[0]);
  return source ? '<a class="source-link" href="' + escapeHtml(source.url) + '" target="_blank" rel="noopener noreferrer" aria-label="Open source ' + escapeHtml(source.id) + '">↗ ' + escapeHtml(source.id) + "</a>" : "Not reported";
}

function offerMatchesBand(offer, band) {
  const price = Number(offer.monthly_equivalent_usd);
  if (band === "free") return price === 0;
  if (band === "under2") return price > 0 && price < 2;
  if (band === "twoToFive") return price >= 2 && price < 5;
  if (band === "fivePlus") return price >= 5;
  return true;
}

function renderOffers() {
  const query = $("#offer-search").value.trim().toLowerCase();
  let offers = state.data.pricing_offers.filter((offer) => {
    const competitor = state.data.competitors.find((item) => item.id === offer.competitor_id);
    const filterMatches = state.activeOfferFilter === "all" ||
      (state.activeOfferFilter === "free" && Number(offer.price_usd) === 0) ||
      (state.activeOfferFilter === "paid" && Number(offer.price_usd) > 0) ||
      (state.activeOfferFilter === "partial" && !offer.verification.toLowerCase().startsWith("verified"));
    const queryMatches = !query || [competitor.name, offer.tier, offer.offer_type, offer.scope, offer.billing_period, offer.verification].join(" ").toLowerCase().includes(query);
    const bandMatches = !state.activeOfferBand || offerMatchesBand(offer, state.activeOfferBand);
    return filterMatches && queryMatches && bandMatches;
  });
  const sort = $("#offer-sort").value;
  if (sort === "price-asc") offers.sort((a, b) => a.monthly_equivalent_usd - b.monthly_equivalent_usd);
  else if (sort === "price-desc") offers.sort((a, b) => b.monthly_equivalent_usd - a.monthly_equivalent_usd);
  else if (sort === "competitor") offers.sort((a, b) => a.competitor.localeCompare(b.competitor));
  else offers.sort((a, b) => (a.verification.toLowerCase().startsWith("verified") ? 0 : 1) - (b.verification.toLowerCase().startsWith("verified") ? 0 : 1));
  $("#offer-table-body").innerHTML = offers.length ? offers.map((offer) => {
    const verified = offer.verification.toLowerCase().startsWith("verified");
    return "<tr><td><strong>" + escapeHtml(offer.competitor) + '</strong><small>' + escapeHtml(offer.tier) + "</small></td>" +
      '<td class="price-cell">' + escapeHtml(offer.price_display) + '<small>' + escapeHtml(offer.offer_type) + "</small></td>" +
      '<td class="price-cell">' + escapeHtml(monthMoney(Number(offer.monthly_equivalent_usd))) + '<small>' + (offer.billing_period === "Annual" ? "annual fee / 12" : offer.billing_period === "Free" ? "core access" : "monthly billing") + "</small></td>" +
      "<td>" + escapeHtml(offer.billing_period) + "</td>" +
      "<td>" + escapeHtml(offerPromotion(offer)) + '<small>US snapshot · no stock status reported</small></td>' +
      '<td><span class="verification-pill ' + (verified ? "verified" : "partial") + '"><i class="status-dot ' + (verified ? "" : "partial") + '"></i>' + (verified ? "Verified" : "Partial") + "</span></td>" +
      "<td>" + sourceLinkForOffer(offer) + "</td></tr>";
  }).join("") : '<tr><td colspan="7"><div class="empty-state"><strong>No offers found.</strong>Change the offer filter or search phrase.</div></td></tr>';
  $("#offer-count").textContent = "Showing " + offers.length + " of " + state.data.pricing_offers.length + " pricing records";
}

function renderExplorer() {
  const stats = benchmarkStats();
  $("#middle-preset-label").textContent = money(stats.median) + " / mo · rep median";
  $("#middle-preset-label").closest("button").dataset.price = stats.median.toFixed(2);
  syncPriceControls();
  const status = classifyPrice(state.price);
  const tolerance = Math.max(0.01, Math.abs(state.price) * 0.1);
  const comparisons = state.repOffers.map((offer) => {
    const difference = Number((state.price - offer.monthly_equivalent_usd).toFixed(2));
    let relation = "comparable";
    if (Math.abs(difference) > tolerance) relation = difference < 0 ? "higher" : "cheaper";
    return { offer, competitor: state.data.competitors.find((item) => item.id === offer.competitor_id), difference, relation };
  });
  const within = comparisons.filter((item) => item.relation === "comparable");
  const lower = comparisons.filter((item) => item.relation === "cheaper");
  const higher = comparisons.filter((item) => item.relation === "higher");
  const allMatches = state.data.pricing_offers.filter((offer) => Math.abs(Number(offer.monthly_equivalent_usd) - state.price) <= tolerance);
  const position = stats.max === stats.min ? 0 : Math.max(0, Math.min(100, (state.price - stats.min) / (stats.max - stats.min) * 100));

  $("#price-position-badge").innerHTML = '<span class="badge-symbol">◈</span><div><strong>' + escapeHtml(status.name) + '</strong><span> · ' + escapeHtml(status.detail) + "</span></div>";
  $("#price-ladder").innerHTML = '<div class="ladder-marker user" style="left:' + Math.min(99, position) + '%"><span class="ladder-label">YOU ' + escapeHtml(money(state.price)) + "</span></div>" +
    state.repOffers.map((offer) => {
      const x = stats.max === stats.min ? 0 : Number(offer.monthly_equivalent_usd) / (stats.max - stats.min) * 100;
      return '<div class="ladder-marker comp" style="left:' + Math.min(99, Math.max(0, x)) + '%" title="' + escapeHtml(offer.competitor + " · " + offer.tier + " · " + money(offer.monthly_equivalent_usd) + " / mo equivalent") + '"><span class="ladder-label">' + escapeHtml(offer.competitor.slice(0, 2).toUpperCase()) + " " + escapeHtml(money(offer.monthly_equivalent_usd)) + "</span></div>";
    }).join("") + '<div class="ladder-track"></div><div class="ladder-axis"><span>MIN ' + escapeHtml(money(stats.min)) + '</span><span>REP. MEDIAN ' + escapeHtml(money(stats.median)) + '</span><span>MAX ' + escapeHtml(money(stats.max)) + "</span></div>";
  $("#explorer-metrics").innerHTML =
    '<div class="explorer-metric"><span>Representative median</span><strong>' + escapeHtml(money(stats.median)) + '</strong><small>' + (state.price < stats.median ? money(stats.median - state.price) + " below" : state.price > stats.median ? money(state.price - stats.median) + " above" : "at median") + "</small></div>" +
    '<div class="explorer-metric"><span>Position in observed span</span><strong>' + Math.round(position) + '%</strong><small>' + escapeHtml(money(stats.min) + "–" + money(stats.max) + " / mo") + "</small></div>" +
    '<div class="explorer-metric"><span>Nearby offer records</span><strong>' + allMatches.length + " / " + state.data.pricing_offers.length + '</strong><small>Within ±10% of selected price</small></div>';
  $("#cheaper-list").innerHTML = listComparisons(lower, "cheaper");
  $("#comparable-list").innerHTML = listComparisons(within, "comparable");
  $("#higher-list").innerHTML = listComparisons(higher, "higher");
  $("#dynamic-interpretation").innerHTML = '<span>STRATEGIC INTERPRETATION · BASED ON OBSERVED PRICES</span><p>' + escapeHtml(buildInterpretation(state.price, lower, higher, within, allMatches.length)) + "</p>";
  $$(".preset-card").forEach((button) => button.classList.toggle("active", Math.abs(Number(button.dataset.price) - state.price) < 0.005));
}

function listComparisons(items, relation) {
  if (!items.length) return '<span class="no-comp">No competitors in this group.</span>';
  return items.map((item) => {
    const diff = Math.abs(item.difference);
    const explanation = relation === "cheaper" ? money(diff) + " below your price" : relation === "higher" ? money(diff) + " above your price" : "Within 10% · " + money(diff) + " difference";
    return '<span class="comp-list-chip" title="' + escapeHtml(item.offer.tier + " · " + item.offer.price_display) + '"><strong>' + escapeHtml(item.competitor.name) + "</strong> · " + escapeHtml(explanation) + "</span>";
  }).join("");
}

function buildInterpretation(price, lower, higher, comparable, nearbyCount) {
  const rec = state.data.preliminary_pricing_recommendation.test_price_hypothesis;
  const inBand = price >= 1.99 && price <= 2.99;
  const parts = [];
  if (lower.length) parts.push(lower.map((item) => item.competitor.name).join(", ") + (lower.length === 1 ? " is" : " are") + " below the selected price");
  if (higher.length) parts.push(higher.map((item) => item.competitor.name).join(", ") + (higher.length === 1 ? " is" : " are") + " above it");
  if (comparable.length) parts.push(comparable.map((item) => item.competitor.name).join(", ") + " sits within 10% of it");
  let text = "At " + money(price) + " per month, " + (parts.length ? parts.join("; ") : "the price matches the representative set") + ". ";
  text += inBand ? "This is within the Mission 1 preliminary test band (" + rec + "). " : "This is outside the Mission 1 preliminary test band (" + rec + "). ";
  text += nearbyCount + " of the " + state.data.pricing_offers.length + " offer records fall within 10%; that describes price density only. ";
  text += "A premium would need a clearly demonstrated group-choice benefit; this comparison does not establish customer response or willingness to pay.";
  return text;
}

function syncPriceControls() {
  const price = Number(state.price.toFixed(2));
  $("#price-slider").value = String(price);
  $("#price-number").value = String(price);
  $("#price-output").textContent = price.toFixed(2);
  const min = Number($("#price-slider").min);
  const max = Number($("#price-slider").max);
  const startPct = (1.99 - min) / (max - min) * 100;
  const endPct = (2.99 - min) / (max - min) * 100;
  $("#price-slider").style.backgroundImage = "linear-gradient(90deg,#6685c7 0%,#6685c7 " + startPct + "%,#71d8bb " + startPct + "%,#71d8bb " + endPct + "%,#293343 " + endPct + "%,#293343 100%)";
}

function setPrice(value) {
  const number = Number(value);
  if (!Number.isFinite(number)) return;
  state.price = Math.min(10, Math.max(0, Math.round(number * 100) / 100));
  renderExplorer();
}

function renderOpportunities() {
  const opportunities = [
    { icon: "01", tag: "RESEARCH FACT", type: "", title: "Keep a useful free core", body: "All four sampled alternatives have a free entry route. The report recommends a free core for the venture while demand and operating needs remain unvalidated.", foot: "Source: Mission 1 competitor sample" },
    { icon: "02", tag: "STRATEGIC INFERENCE", type: "inference", title: "Test a shared-choice flow", body: "The prior scan did not identify a core group-consensus chooser. Mood, time, subscriptions and group preferences could support a distinct decision path if users value it.", foot: "Proposed product difference · not validated" },
    { icon: "03", tag: "STRATEGIC INFERENCE", type: "inference", title: "Treat the middle band as a test", body: "The proposed $1.99–$2.99 monthly range sits below observed monthly-billed paid references of $3.99 and $6. Bundles and feature scope differ, so this is not a like-for-like value conclusion.", foot: "No willingness-to-pay conclusion" }
  ];
  $("#opportunity-grid").innerHTML = opportunities.map((item) => '<article class="opportunity-card"><div class="opportunity-top"><span class="opportunity-icon">' + item.icon + '</span><span class="evidence-tag ' + item.type + '">' + item.tag + '</span></div><h3>' + escapeHtml(item.title) + '</h3><p>' + escapeHtml(item.body) + '</p><div class="opportunity-foot">' + escapeHtml(item.foot) + "</div></article>").join("");
  const recommendation = state.data.preliminary_pricing_recommendation;
  $("#recommendation-panel").innerHTML = '<div class="recommendation-copy"><span class="panel-kicker">PRELIMINARY · SUBJECT TO COST AND DEMAND ANALYSIS</span><h3>Launch the core free. Validate before charging.</h3><p>' + escapeHtml(recommendation.rationale) + " " + escapeHtml(recommendation.validation_needed.join(" ")) + '</p></div><div class="recommendation-price"><strong>$1.99–$2.99</strong><small>proposed monthly test band<br>not a validated optimal price</small></div>';
}

function renderMethodology() {
  const method = [
    ["Research snapshot", "US competitor pricing checked on " + state.data.as_of + ". Values are not live feeds and may have changed."],
    ["Explorer range", "The slider spans $0–$10, rounded above the $6 maximum offer equivalent to let you explore outside observed rates. The $10 endpoint is a tool boundary, not a recommendation."],
    ["Representative set", "One offer per competitor: paid entry plan where identified; otherwise free core access. Trakt uses VIP annual at $60/year ($5 monthly equivalent), the lower normalized VIP price."],
    ["Monthly equivalent", "Annual prices are divided by 12. Annual equivalent is a comparison unit, not a claim that monthly billing is available."],
    ["Offer distribution", "Uses all " + state.data.pricing_offers.length + " records, including free plans. Monthly equivalent values put annual and monthly rates on one arithmetic scale."],
    ["Price position rule", "Budget-oriented is at/below Q1; near market middle is Q1–Q3; premium-oriented is above Q3 through the observed maximum; below/above labels mean outside the min/max. Quartiles use linear interpolation of the four representative monthly-equivalent prices."],
    ["Nearby offers", "The explorer flags a representative competitor as comparable when its monthly-equivalent price is within 10% of your selected price. This is a display rule, not a market standard."],
    ["Comparability", "Bundles and features differ. JustWatch Plus includes a selected streaming catalog and rental savings. Reelgood's $0 is a US app listing; no paid tier was found in the reviewed listing."],
    ["Research inputs", "The Mission 1 JSON is the primary input. Competitor profiles, offer notes and limits were cross-checked against its workbook and report."]
  ];
  $("#method-content").innerHTML = method.map((item) => '<div class="method-item"><strong>' + escapeHtml(item[0]) + '</strong><p>' + escapeHtml(item[1]) + "</p></div>").join("");
  $("#limitations-list").innerHTML = state.data.limitations.map((item) => "<li>" + escapeHtml(item) + "</li>").join("");
  $("#source-count").textContent = state.data.sources.length + " records";
  $("#source-list").innerHTML = state.data.sources.map((source) => '<article class="source-card"><span class="source-id">' + escapeHtml(source.id) + '</span><div class="source-info"><a href="' + escapeHtml(source.url) + '" target="_blank" rel="noopener noreferrer">' + escapeHtml(source.title) + ' ↗</a><p>' + escapeHtml(source.competitor + " · " + source.source_type + " · " + source.verification) + "</p></div></article>").join("");
}

function bindEvents() {
  $("#competitor-search").addEventListener("input", renderCompetitors);
  $("#competitor-type").addEventListener("change", () => { state.activeCompetitorType = $("#competitor-type").value; renderCompetitors(); });
  $("#competitor-position").addEventListener("change", renderCompetitors);
  $("#competitor-sort").addEventListener("change", renderCompetitors);
  $("#offer-search").addEventListener("input", () => { state.activeOfferBand = null; renderOffers(); });
  $("#offer-sort").addEventListener("change", renderOffers);
  $("#offer-filters").addEventListener("click", (event) => {
    const button = event.target.closest("[data-filter]");
    if (!button) return;
    state.activeOfferFilter = button.dataset.filter;
    state.activeOfferBand = null;
    $$("#offer-filters .filter-pill").forEach((pill) => pill.classList.toggle("active", pill === button));
    renderOffers();
  });
  $("#price-slider").addEventListener("input", (event) => setPrice(event.target.value));
  $("#price-number").addEventListener("input", (event) => setPrice(event.target.value));
  $$(".preset-card").forEach((button) => button.addEventListener("click", () => setPrice(button.dataset.price)));
}

function observeNavigation() {
  const sections = $$(".section-anchor");
  const links = $$(".nav-link");
  const observer = new IntersectionObserver((entries) => {
    const visible = entries.filter((entry) => entry.isIntersecting).sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (!visible) return;
    links.forEach((link) => link.classList.toggle("active", link.getAttribute("href") === "#" + visible.target.id));
    const label = links.find((link) => link.classList.contains("active"));
    if (label) $("#breadcrumb-current").textContent = label.textContent.trim().toUpperCase();
  }, { rootMargin: "-25% 0px -60% 0px", threshold: [0, .1, .25, .5] });
  sections.forEach((section) => observer.observe(section));
}

function showToast(message) {
  const toast = $("#toast");
  toast.textContent = message;
  toast.classList.add("visible");
  clearTimeout(state.toastTimer);
  state.toastTimer = setTimeout(() => toast.classList.remove("visible"), 1900);
}

init();
