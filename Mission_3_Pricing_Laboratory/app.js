(function () {
  "use strict";

  const DATA = window.M3_DATA;
  const KEY = "m3-pricing-cost-lab-v1";
  const CUSTOM_COST_MAX = 12;
  const COLORS = ["#75e3c5", "#91b8ff", "#f2c27a", "#c6a9ff", "#62c9de", "#eb8fb0"];
  const SCENARIOS = {
    lean: {
      name: "Lean",
      caption: "A low-spend validation run with a small audience and minimum operating hours.",
      assumptions: { audience: 300, conversionPct: 5, startupAmortization: 24, includeStartup: false },
      costValues: { maintenance: 65.38, support: 10.77, marketing: 25, backend: 0 },
      prices: { "plus-monthly": 1.99, "plus-annual": 19 },
      mix: { "plus-monthly": 80, "plus-annual": 20 }
    },
    typical: {
      name: "Typical",
      caption: "A working planning baseline, not a market forecast or evidence of demand.",
      assumptions: { audience: 1000, conversionPct: 5, startupAmortization: 24, includeStartup: true },
      costValues: { maintenance: 130.76, support: 43.06, marketing: 150, backend: 0 },
      prices: { "plus-monthly": 2.49, "plus-annual": 24 },
      mix: { "plus-monthly": 76, "plus-annual": 24 }
    },
    expansion: {
      name: "Expansion",
      caption: "A larger reach and higher operating spend to explore a scale case.",
      assumptions: { audience: 10000, conversionPct: 6, startupAmortization: 24, includeStartup: true },
      costValues: { maintenance: 392.28, support: 107.65, marketing: 600, backend: 25 },
      prices: { "plus-monthly": 2.99, "plus-annual": 29 },
      mix: { "plus-monthly": 60, "plus-annual": 40 }
    }
  };

  function defaultState() {
    return {
      schemaVersion: 1,
      scenario: "typical",
      assumptions: { audience: 1000, conversionPct: 5, startupAmortization: 24, includeStartup: true },
      costs: [
        { id: "hosting", name: "Static website hosting", category: "Digital infrastructure", description: "GitHub Pages static files on the public repository; no API or dynamic backend.", kind: "fixed", frequency: "monthly", amount: 0, min: 0, max: 200, step: 1, enabled: true, sourceId: "GH1", evidence: "verified", assumption: "Static HTML/CSS/JS hosting benchmark. Does not include the data license or any backend." },
        { id: "backend", name: "Optional backend capacity", category: "Digital infrastructure", description: "Supabase Free is selected in this baseline; switch to Pro to model production capacity.", kind: "fixed", frequency: "monthly", amount: 0, min: 0, max: 500, step: 1, enabled: true, sourceId: "SUP1", evidence: "verified", assumption: "Free tier default. Pro starts at $25/month; optional, not required for the static lab." },
        { id: "domain", name: "Custom domain", category: "Digital infrastructure", description: "The GitHub Pages subdomain can be used at no charge; a custom domain is optional.", kind: "fixed", frequency: "annual", amount: 0, min: 0, max: 200, step: 1, enabled: true, sourceId: "CF1", evidence: "quote", assumption: "No custom domain budget entered. Registration price depends on the TLD and current quote." },
        { id: "maintenance", name: "Developer maintenance time", category: "People", description: "Illustrative monthly hours valued at the BLS wage-equivalent benchmark.", kind: "fixed", frequency: "monthly", amount: 130.76, min: 0, max: 3000, step: 1, enabled: true, sourceId: "BLSD", evidence: "estimate", assumption: "2 hours × $65.38/hour. Wage-equivalent only; excludes benefits, payroll taxes and contractor markup." },
        { id: "support", name: "Customer support time", category: "People", description: "Illustrative support hours valued at the BLS wage-equivalent benchmark.", kind: "fixed", frequency: "monthly", amount: 43.06, min: 0, max: 1000, step: 1, enabled: true, sourceId: "BLSS", evidence: "estimate", assumption: "2 hours × $21.53/hour. Wage-equivalent only; excludes employer burden and contractor markup." },
        { id: "marketing", name: "Marketing / audience tests", category: "Customer acquisition", description: "Student-set test budget. No paid acquisition quote or measured CAC was available.", kind: "fixed", frequency: "monthly", amount: 150, min: 0, max: 10000, step: 5, enabled: true, sourceId: "", evidence: "assumption", assumption: "Illustrative budget only. Replace with a measured channel plan and customer acquisition cost." },
        { id: "catalog-license", name: "Commercial movie & TV catalog rights", category: "Content & data", description: "Essential rights / data agreement for a revenue-generating recommendation service. Public commercial pricing was not found.", kind: "fixed", frequency: "monthly", amount: 0, min: 0, max: 20000, step: 25, enabled: true, sourceId: "TMDB1", evidence: "quote", assumption: "UNPRICED AND EXCLUDED at $0 in this model. Commercial use requires a separate written agreement and may involve fees. Obtain permission and a quote before launch.", quoteReceived: false },
        { id: "startup-build", name: "Initial product build (one-time)", category: "Startup investment", description: "Replacement-value planning estimate, not a record of cash already spent.", kind: "fixed", frequency: "once", amount: 1961.4, min: 0, max: 50000, step: 25, enabled: true, sourceId: "BLSD", evidence: "estimate", assumption: "30 hours × $65.38/hour. Not actual spend; excludes employer burden, design, legal and data-license costs." },
        { id: "stripe-card-pct", name: "Online card processing", category: "Payment fees", description: "Standard domestic online-card benchmark applied to subscription and one-time revenue.", kind: "pct", frequency: "monthly", amount: 2.9, min: 0, max: 10, step: 0.1, enabled: true, sourceId: "STR1", evidence: "verified", assumption: "U.S. online domestic card benchmark: 2.9% of successful transaction value. Actual method / negotiated rates may differ." },
        { id: "stripe-card-fixed", name: "Per-transaction card fee", category: "Payment fees", description: "Fixed fee on each online card payment; annual subscriptions are prorated across 12 months.", kind: "transaction", frequency: "monthly", amount: 0.3, min: 0, max: 3, step: 0.01, enabled: true, sourceId: "STR1", evidence: "verified", assumption: "$0.30 per successful domestic online card transaction; annual plan fixed fees are divided by 12 in monthly analysis." },
        { id: "stripe-billing", name: "Subscription billing service", category: "Payment fees", description: "Pay-as-you-go subscription billing fee applied to recurring subscription volume, excluding one-time sales.", kind: "pct", basis: "subscription", frequency: "monthly", amount: 0.7, min: 0, max: 5, step: 0.1, enabled: true, sourceId: "STR2", evidence: "verified", assumption: "Pay-as-you-go benchmark: 0.7% of Billing volume, in addition to card processing; one-off invoices are excluded." }
      ],
      products: [
        { id: "free-core", name: "Free Core", description: "Basic mood, genre and streaming-service recommendations.", billing: "free", price: 0, mixPct: 0, unitsPerMonth: 0, enabled: true, protected: true },
        { id: "plus-monthly", name: "Plus Monthly", description: "Optional premium recommendation and shared-choice features.", billing: "monthly", price: 2.49, mixPct: 76, unitsPerMonth: 0, enabled: true },
        { id: "plus-annual", name: "Plus Annual", description: "Annual plan, normalized in the model for monthly comparison.", billing: "annual", price: 24, mixPct: 24, unitsPerMonth: 0, enabled: true }
      ],
      customScenarios: {},
      decision: { review: null, acknowledged: false, justification: "", confirmed: false, confirmation: null }
    };
  }

  function copy(obj) { return JSON.parse(JSON.stringify(obj)); }
  function $(selector, scope) { return (scope || document).querySelector(selector); }
  function $$(selector, scope) { return Array.prototype.slice.call((scope || document).querySelectorAll(selector)); }
  function clamp(value, min, max) { return Math.max(min, Math.min(max, Number(value) || 0)); }
  function money(value, digits) {
    const n = Number.isFinite(Number(value)) ? Number(value) : 0;
    return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: digits === undefined ? 2 : digits, maximumFractionDigits: digits === undefined ? 2 : digits }).format(n);
  }
  function whole(value) { return new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(Math.round(Number(value) || 0)); }
  function pct(value, digits) { return (Number(value) || 0).toFixed(digits === undefined ? 1 : digits) + "%"; }
  function esc(value) {
    return String(value === undefined || value === null ? "" : value).replace(/[&<>"]/g, function (char) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[char];
    });
  }
  function dateStamp(date) {
    return new Intl.DateTimeFormat("en-US", { year: "numeric", month: "short", day: "numeric" }).format(date || new Date());
  }
  function safeUrl(value) {
    try {
      const u = new URL(value);
      return u.protocol === "http:" || u.protocol === "https:" ? u.href : "";
    } catch (_) { return ""; }
  }
  function toast(message, error) {
    const node = $("#toast");
    node.textContent = message;
    node.classList.toggle("error", !!error);
    node.classList.add("show");
    window.clearTimeout(toast.timer);
    toast.timer = window.setTimeout(function () { node.classList.remove("show"); }, 2800);
  }

  function loadState() {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) || "null");
      if (!saved || saved.schemaVersion !== 1 || !Array.isArray(saved.costs) || !Array.isArray(saved.products)) return defaultState();
      return normalizeState(saved);
    } catch (_) { return defaultState(); }
  }

  function normalizeState(value) {
    const base = defaultState();
    const state = Object.assign(base, value);
    state.assumptions = Object.assign(base.assumptions, value.assumptions || {});
    state.costs = (value.costs || base.costs).map(function (cost) {
      return Object.assign({}, base.costs.find(function (x) { return x.id === cost.id; }) || {}, cost);
    });
    state.products = (value.products || base.products).map(function (product) {
      return Object.assign({ enabled: true, mixPct: 0, unitsPerMonth: 0 }, product);
    });
    state.customScenarios = value.customScenarios || {};
    state.decision = Object.assign({ review: null, acknowledged: false, justification: "", confirmed: false, confirmation: null }, value.decision || {});
    if (state.decision.review && state.decision.review.signature !== modelSignature(state)) state.decision.review = null;
    if (state.decision.confirmed && (!state.decision.confirmation || state.decision.confirmation.signature !== modelSignature(state))) {
      state.decision.confirmed = false;
      state.decision.confirmation = null;
    }
    return state;
  }

  let state = loadState();
  let costFilter = "all";
  let toastTimer = null;

  function saveState() {
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
      $("#save-status").textContent = "Saved in this browser";
    } catch (_) {
      $("#save-status").textContent = "Browser storage unavailable";
    }
  }

  function modelSignature(source) {
    const current = source || state;
    return JSON.stringify({
      assumptions: current.assumptions,
      costs: current.costs.map(function (x) { return [x.id, x.kind, x.basis || "all", x.frequency, Number(x.amount), !!x.enabled, !!x.quoteReceived]; }),
      products: current.products.map(function (x) { return [x.id, x.name, x.billing, Number(x.price), Number(x.mixPct), Number(x.unitsPerMonth), !!x.enabled]; })
    });
  }

  function markModelChanged() {
    state.scenario = "custom";
    state.decision.review = null;
    state.decision.acknowledged = false;
    state.decision.confirmed = false;
    state.decision.confirmation = null;
  }

  function fixedCostMonthly(cost) {
    if (!cost.enabled || cost.kind !== "fixed") return 0;
    if (cost.frequency === "once") return 0;
    return Number(cost.amount || 0) / (cost.frequency === "annual" ? 12 : 1);
  }

  function startupTotal() {
    return state.costs.reduce(function (sum, cost) {
      return sum + (cost.enabled && cost.kind === "fixed" && cost.frequency === "once" ? Number(cost.amount || 0) : 0);
    }, 0);
  }

  function costBases() {
    return state.costs.filter(function (x) { return x.enabled; });
  }

  function costTotals() {
    const fixedRecurring = state.costs.reduce(function (sum, cost) { return sum + fixedCostMonthly(cost); }, 0);
    const startup = startupTotal();
    const amortization = state.assumptions.includeStartup && Number(state.assumptions.startupAmortization) > 0
      ? startup / Number(state.assumptions.startupAmortization) : 0;
    const pctRows = state.costs.filter(function (cost) { return cost.enabled && cost.kind === "pct"; });
    const pctRateAll = pctRows.reduce(function (sum, cost) { return sum + (cost.basis === "subscription" ? 0 : Number(cost.amount || 0) / 100); }, 0);
    const pctRateSubscription = pctRows.reduce(function (sum, cost) { return sum + (cost.basis === "subscription" ? Number(cost.amount || 0) / 100 : 0); }, 0);
    const pctRate = pctRateAll + pctRateSubscription;
    const transactionRate = state.costs.reduce(function (sum, cost) { return sum + (cost.enabled && cost.kind === "transaction" ? Number(cost.amount || 0) : 0); }, 0);
    const userRate = state.costs.reduce(function (sum, cost) { return sum + (cost.enabled && cost.kind === "user" ? Number(cost.amount || 0) : 0); }, 0);
    return { fixedRecurring: fixedRecurring, startup: startup, amortization: amortization, fixedMonthly: fixedRecurring + amortization, pctRate: pctRate, pctRateAll: pctRateAll, pctRateSubscription: pctRateSubscription, transactionRate: transactionRate, userRate: userRate };
  }

  function subscriptionMix() {
    const plans = state.products.filter(function (x) { return x.enabled && (x.billing === "monthly" || x.billing === "annual"); });
    const sum = plans.reduce(function (total, plan) { return total + Math.max(0, Number(plan.mixPct) || 0); }, 0);
    return plans.map(function (plan) {
      return Object.assign({}, plan, { normalizedMix: sum > 0 ? Math.max(0, Number(plan.mixPct) || 0) / sum : 0 });
    });
  }

  function project(options) {
    const o = options || {};
    const scale = Number(o.volumeScale === undefined ? 1 : o.volumeScale);
    const priceScale = Number(o.priceScale === undefined ? 1 : o.priceScale);
    const assumptions = state.assumptions;
    const audience = Math.max(0, Number(o.audience === undefined ? assumptions.audience : o.audience) || 0) * scale;
    const conversion = clamp(assumptions.conversionPct, 0, 100) / 100;
    const paidSubscribers = audience * conversion;
    const mix = subscriptionMix();
    const plans = [];
    let subscriptionRevenue = 0;
    let subscriptionTransactions = 0;
    let revenuePerSubscriber = 0;
    let transactionsPerSubscriber = 0;

    mix.forEach(function (plan) {
      const units = paidSubscribers * plan.normalizedMix;
      const divisor = plan.billing === "annual" ? 12 : 1;
      const monthlyPrice = (Number(plan.price) || 0) / divisor;
      const monthlyTx = units / divisor;
      subscriptionRevenue += units * monthlyPrice;
      subscriptionTransactions += monthlyTx;
      revenuePerSubscriber += plan.normalizedMix * monthlyPrice;
      transactionsPerSubscriber += plan.normalizedMix / divisor;
      plans.push({ id: plan.id, name: plan.name, billing: plan.billing, units: units, monthlyPrice: monthlyPrice, revenue: units * monthlyPrice, transactions: monthlyTx, normalizedMix: plan.normalizedMix, priceScale: priceScale });
    });

    let oneTimeRevenue = 0;
    let oneTimeTransactions = 0;
    state.products.filter(function (x) { return x.enabled && x.billing === "one_time"; }).forEach(function (plan) {
      const units = Math.max(0, Number(plan.unitsPerMonth) || 0) * scale;
      const price = Math.max(0, Number(plan.price) || 0) * priceScale;
      const revenue = units * price;
      oneTimeRevenue += revenue;
      oneTimeTransactions += units;
      plans.push({ id: plan.id, name: plan.name, billing: plan.billing, units: units, monthlyPrice: price, revenue: revenue, transactions: units, normalizedMix: 0, priceScale: priceScale });
    });
    const revenue = subscriptionRevenue * priceScale + oneTimeRevenue;
    const txnCount = subscriptionTransactions + oneTimeTransactions;
    const costs = costTotals();
    const variablePct = revenue * costs.pctRateAll + subscriptionRevenue * priceScale * costs.pctRateSubscription;
    const variableTxn = txnCount * costs.transactionRate;
    const variableUsers = paidSubscribers * costs.userRate;
    const variableCosts = variablePct + variableTxn + variableUsers;
    const contribution = revenue - variableCosts;
    const fixedMonthly = costs.fixedMonthly;
    const operatingProfit = contribution - fixedMonthly;
    const contributionPerSubscriber = revenuePerSubscriber * priceScale * (1 - costs.pctRateAll - costs.pctRateSubscription) - transactionsPerSubscriber * costs.transactionRate - costs.userRate;
    const oneTimeContribution = oneTimeRevenue * (1 - costs.pctRateAll) - oneTimeTransactions * costs.transactionRate;
    const breakEvenTarget = fixedMonthly - oneTimeContribution;
    let breakEvenUsers;
    if (breakEvenTarget <= 0) breakEvenUsers = 0;
    else if (contributionPerSubscriber <= 0) breakEvenUsers = Infinity;
    else breakEvenUsers = breakEvenTarget / contributionPerSubscriber;
    const breakEvenRevenue = Number.isFinite(breakEvenUsers) ? oneTimeRevenue + breakEvenUsers * revenuePerSubscriber * priceScale : Infinity;
    return {
      audience: audience,
      conversion: conversion,
      paidSubscribers: paidSubscribers,
      freeAudience: Math.max(0, audience - paidSubscribers),
      plans: plans,
      subscriptionPlans: mix,
      revenue: revenue,
      subscriptionRevenue: subscriptionRevenue * priceScale,
      oneTimeRevenue: oneTimeRevenue,
      transactions: txnCount,
      costs: costs,
      variablePct: variablePct,
      variableTxn: variableTxn,
      variableUsers: variableUsers,
      variableCosts: variableCosts,
      contribution: contribution,
      contributionMargin: revenue > 0 ? contribution / revenue : 0,
      operatingProfit: operatingProfit,
      breakEvenUsers: breakEvenUsers,
      breakEvenRevenue: breakEvenRevenue,
      contributionPerSubscriber: contributionPerSubscriber,
      oneTimeContribution: oneTimeContribution,
      breakEvenTarget: breakEvenTarget,
      marginOfSafety: Number.isFinite(breakEvenUsers) && paidSubscribers > 0 ? (paidSubscribers - breakEvenUsers) / paidSubscribers : null,
      startupCash: costs.startup,
      fixedMonthly: fixedMonthly
    };
  }

  function sourceFor(id) {
    if (!id) return null;
    return DATA.sources.find(function (x) { return x.id === id; }) ||
      (DATA.mission1.sources || []).find(function (x) { return x.id === id; }) || null;
  }

  function renderScenarioControls() {
    $$(".scenario-picker button[data-scenario]").forEach(function (button) {
      button.classList.toggle("selected", state.scenario === button.dataset.scenario);
    });
    $("#scenario-caption").textContent = SCENARIOS[state.scenario] ? SCENARIOS[state.scenario].caption : "Custom student scenario. Save it to keep a named copy in this browser.";
    const customHolder = $("#custom-scenario-picker");
    if (!customHolder) return;
    const names = Object.keys(state.customScenarios || {});
    customHolder.innerHTML = names.map(function (name) {
      return '<button type="button" class="custom-scenario-button" data-custom-scenario="' + esc(name) + '">' + esc(name) + '<span>↗</span></button>';
    }).join("");
  }

  function applyScenario(name) {
    const preset = SCENARIOS[name];
    if (!preset) return;
    state.assumptions = Object.assign({}, state.assumptions, copy(preset.assumptions));
    Object.keys(preset.costValues).forEach(function (id) {
      const cost = state.costs.find(function (x) { return x.id === id; });
      if (cost) cost.amount = preset.costValues[id];
    });
    state.products.forEach(function (product) {
      if (preset.prices[product.id] !== undefined) product.price = preset.prices[product.id];
      if (preset.mix[product.id] !== undefined) product.mixPct = preset.mix[product.id];
    });
    state.scenario = name;
    state.decision.review = null;
    state.decision.confirmed = false;
    state.decision.confirmation = null;
    state.decision.acknowledged = false;
    renderAll();
    saveState();
  }

  function applyCustomScenario(name) {
    const saved = state.customScenarios[name];
    if (!saved) return;
    state.assumptions = copy(saved.assumptions);
    state.costs = copy(saved.costs);
    state.products = copy(saved.products);
    state.scenario = name;
    state.decision.review = null;
    state.decision.confirmed = false;
    state.decision.confirmation = null;
    state.decision.acknowledged = false;
    renderAll();
    saveState();
  }

  function renderAssumptions() {
    ["audience", "conversionPct"].forEach(function (key) {
      const value = Number(state.assumptions[key]) || 0;
      const range = $('[data-assumption="' + key + '"][type="range"]');
      const number = $('[data-assumption="' + key + '"][type="number"]');
      if (range) range.value = String(value);
      if (number) number.value = String(value);
    });
    $("#startup-amortization").value = String(state.assumptions.startupAmortization || 0);
    $("#include-startup").checked = !!state.assumptions.includeStartup;
  }

  function billingLabel(product) {
    if (product.billing === "free") return "Free plan";
    if (product.billing === "annual") return "Annual subscription";
    if (product.billing === "one_time") return "One-time";
    return "Monthly subscription";
  }

  function productPriceLine(product) {
    const price = money(product.price);
    if (product.billing === "free") return "Free";
    if (product.billing === "annual") return price + " / year · " + money((Number(product.price) || 0) / 12) + " monthly equivalent";
    if (product.billing === "one_time") return price + " / purchase";
    return price + " / month";
  }

  function renderProducts() {
    const plans = subscriptionMix();
    const model = project();
    const mixTotal = plans.reduce(function (sum, x) { return sum + (Number(x.mixPct) || 0); }, 0);
    $("#products-list").innerHTML = state.products.map(function (product) {
      const forecast = model.plans.find(function (x) { return x.id === product.id; });
      const isSubscription = product.billing === "monthly" || product.billing === "annual";
      const isFree = product.billing === "free";
      const fields = isSubscription
        ? '<div class="product-input"><label>Price ' + (product.billing === "annual" ? 'per year' : 'per month') + '</label><input aria-label="' + esc(product.name) + ' price" data-product-id="' + esc(product.id) + '" data-product-field="price" type="number" min="0" max="10000" step="0.01" value="' + esc(product.price) + '"></div><div class="product-input mix-input"><label>Paid mix %</label><input aria-label="' + esc(product.name) + ' subscriber mix" data-product-id="' + esc(product.id) + '" data-product-field="mixPct" type="number" min="0" max="100" step="1" value="' + esc(product.mixPct) + '"></div><div class="product-units">forecast<b>' + whole(forecast ? forecast.units : 0) + ' / month</b></div>'
        : product.billing === "one_time"
          ? '<div class="product-input"><label>Price per sale</label><input aria-label="' + esc(product.name) + ' price" data-product-id="' + esc(product.id) + '" data-product-field="price" type="number" min="0" max="10000" step="0.01" value="' + esc(product.price) + '"></div><div class="product-input"><label>Sales / month</label><input aria-label="' + esc(product.name) + ' monthly sales" data-product-id="' + esc(product.id) + '" data-product-field="unitsPerMonth" type="number" min="0" max="1000000" step="1" value="' + esc(product.unitsPerMonth || 0) + '"></div><div class="product-units">revenue<b>' + money(forecast ? forecast.revenue : 0) + '</b></div>'
          : '<div class="product-input"><label>Price</label><input aria-label="' + esc(product.name) + ' price" disabled type="number" value="0"></div><div class="product-input"><label>Paid mix</label><input disabled type="number" value="0"></div><div class="product-units">remaining audience<b>Free users</b></div>';
      return '<article class="product-card" data-product-card="' + esc(product.id) + '"><div class="product-card-head"><div><div class="product-name-line"><b>' + esc(product.name) + '</b><span class="product-billing ' + (isFree ? "free" : "") + '">' + esc(billingLabel(product)) + '</span></div><div class="product-description">' + esc(product.description || "No plan description entered.") + '</div></div><div class="product-price-wrap"><b>' + esc(productPriceLine(product)) + '</b><small>' + (isSubscription ? "Share of paid subscribers: " + pct((Number(product.mixPct) || 0), 0) : (isFree ? "No subscription revenue" : "Transaction sales, not subscribers")) + '</small></div>' + (product.protected ? "" : '<button class="remove-button" type="button" data-remove-product="' + esc(product.id) + '" aria-label="Remove ' + esc(product.name) + '">×</button>') + '</div><div class="product-fields">' + fields + '</div></article>';
    }).join("");
    const paidCount = model.paidSubscribers;
    $("#product-total-row").innerHTML = '<span>Subscriber mix totals ' + pct(mixTotal, 0) + ' before normalization · ' + whole(paidCount) + ' paying subscribers forecast</span><b>' + money(model.revenue) + ' projected monthly revenue</b>';
  }

  function formatCostAmount(cost) {
    if (cost.kind === "pct") return Number(cost.amount || 0).toFixed(1) + "% of revenue";
    if (cost.kind === "transaction") return money(cost.amount) + " / transaction";
    if (cost.kind === "user") return money(cost.amount) + " / paid subscriber / month";
    if (cost.frequency === "once") return money(cost.amount) + " one time";
    if (cost.frequency === "annual") return money(cost.amount) + " / year";
    return money(cost.amount) + " / month";
  }

  function costMultiplierLabel(cost) {
    if (cost.kind === "pct") return "% of revenue";
    if (cost.kind === "transaction") return "per payment";
    if (cost.kind === "user") return "per subscriber / month";
    return cost.frequency === "once" ? "one time" : cost.frequency === "annual" ? "per year" : "per month";
  }

  function costClassLabel(cost) {
    if (cost.kind === "pct") return "Variable · % of revenue";
    if (cost.kind === "transaction") return "Variable · per transaction";
    if (cost.kind === "user") return "Variable · per subscriber";
    return cost.frequency === "once" ? "One-time startup" : "Fixed · recurring";
  }

  function renderCosts() {
    const visible = state.costs.filter(function (cost) {
      if (costFilter === "all") return true;
      if (costFilter === "startup") return cost.kind === "fixed" && cost.frequency === "once";
      if (costFilter === "recurring") return cost.kind === "fixed" && cost.frequency !== "once";
      return cost.kind === "pct" || cost.kind === "transaction" || cost.kind === "user";
    });
    const model = project();
    $("#all-cost-count").textContent = String(state.costs.length);
    $("#cost-list").innerHTML = visible.map(function (cost) {
      const src = sourceFor(cost.sourceId);
      const custom = !state.costs.some(function (x) { return x.id === cost.id && ["hosting", "backend", "domain", "maintenance", "support", "marketing", "catalog-license", "startup-build", "stripe-card-pct", "stripe-card-fixed", "stripe-billing"].indexOf(x.id) >= 0; });
      let max = Number(cost.max || 1000);
      let step = Number(cost.step || (cost.kind === "pct" ? 0.1 : 1));
      let min = Number(cost.min || 0);
      if (cost.kind === "pct") max = Math.max(max, 5);
      const status = cost.evidence === "verified" ? "Verified reference" : cost.evidence === "estimate" ? "Wage estimate" : cost.evidence === "quote" ? (cost.quoteReceived ? "Quote entered" : "Quote required") : "Student assumption";
      const evidenceClass = cost.evidence === "verified" ? "verified" : cost.evidence === "estimate" ? "estimate" : cost.evidence === "quote" ? "quote" : "";
      const costUrl = src && src.url ? src.url : cost.url;
      const link = safeUrl(costUrl) ? '<a href="' + esc(safeUrl(costUrl)) + '" target="_blank" rel="noreferrer">Source ↗</a>' : '<span>No external source · student input</span>';
      const amountSymbol = cost.kind === "pct" ? "" : "$";
      const sliderVal = clamp(cost.amount, min, max);
      const freq = cost.kind === "fixed" ? '<label class="sr-only" for="freq-' + esc(cost.id) + '">Frequency for ' + esc(cost.name) + '</label><select id="freq-' + esc(cost.id) + '" class="cost-frequency" data-cost-frequency="' + esc(cost.id) + '"><option value="monthly"' + (cost.frequency === "monthly" ? " selected" : "") + '>Monthly</option><option value="annual"' + (cost.frequency === "annual" ? " selected" : "") + '>Annual</option><option value="once"' + (cost.frequency === "once" ? " selected" : "") + '>One-time</option></select>' : '';
      const quoteControl = cost.evidence === "quote" ? '<label class="quote-attest"><input type="checkbox" data-cost-quote="' + esc(cost.id) + '"' + (cost.quoteReceived ? " checked" : "") + '> I obtained a quote / terms for this line</label>' : "";
      const remove = custom ? '<button class="remove-cost" type="button" data-remove-cost="' + esc(cost.id) + '" aria-label="Remove ' + esc(cost.name) + '">×</button>' : "";
      return '<article class="cost-card' + (cost.evidence === "quote" && !cost.quoteReceived ? " is-unpriced" : "") + (!cost.enabled ? " disabled" : "") + '" data-cost-card="' + esc(cost.id) + '"><div class="cost-card-top"><div class="cost-title"><input class="cost-toggle" type="checkbox" data-cost-enabled="' + esc(cost.id) + '" aria-label="Include ' + esc(cost.name) + '"' + (cost.enabled ? " checked" : "") + '><div><h4>' + esc(cost.name) + '</h4><p>' + esc(cost.description || cost.assumption || "") + '</p></div></div><div class="cost-card-tools"><span class="evidence-pill ' + evidenceClass + '">' + status + '</span>' + remove + '</div></div><div class="cost-edit-line"><input type="range" min="' + min + '" max="' + max + '" step="' + step + '" value="' + sliderVal + '" data-cost-range="' + esc(cost.id) + '" aria-label="' + esc(cost.name) + ' amount slider"><label class="amount-entry"><span>' + amountSymbol + '</span><input type="number" min="' + min + '" max="' + max + '" step="' + step + '" value="' + esc(cost.amount) + '" data-cost-amount="' + esc(cost.id) + '" aria-label="' + esc(cost.name) + ' amount"><small>' + esc(costMultiplierLabel(cost)) + '</small></label></div><div class="cost-unit"><b>' + esc(formatCostAmount(cost)) + '</b> · ' + esc(costClassLabel(cost)) + ' ' + freq + '</div>' + quoteControl + '<div class="cost-meta"><span>' + esc(cost.category || "Custom cost") + '</span>' + link + '</div></article>';
    }).join("");
    const totals = model.costs;
    $("#cost-summary-bar").innerHTML =
      '<div class="cost-summary-cell"><small>Fixed recurring run-rate</small><b>' + money(totals.fixedRecurring) + ' / month</b></div>' +
      '<div class="cost-summary-cell"><small>Startup cash modeled</small><b>' + money(totals.startup) + ' one time</b></div>' +
      '<div class="cost-summary-cell"><small>Startup recovery</small><b>' + (totals.amortization ? money(totals.amortization) + ' / month' : "Excluded") + '</b></div>' +
      '<div class="cost-summary-cell alert"><small>Unpriced essential item</small><b>' + (state.costs.some(function (x) { return x.id === "catalog-license" && x.evidence === "quote" && !x.quoteReceived; }) ? "Catalog rights" : "Review source terms") + '</b></div>';
    $("#cost-footnotes").innerHTML = '<div class="cost-footnote"><b>Labor values:</b> BLS employee wage medians are planning benchmarks, not quotes. They exclude benefits, payroll tax and contractor markup.</div><div class="cost-footnote"><b>Catalog rights:</b> the $0 value is excluded only to keep the model interactive. It does not imply commercial catalog data is free or available under an appropriate license.</div>';
  }

  function renderCompetitors() {
    const mission = DATA.mission1 || {};
    const offers = mission.pricing_offers || [];
    const filter = $("#competitor-filter").value;
    const visible = offers.filter(function (offer) {
      const paid = Number(offer.monthly_equivalent_usd || 0) > 0;
      return filter === "all" || (filter === "paid" ? paid : !paid);
    });
    $("#competitor-rows").innerHTML = visible.map(function (offer) {
      const verified = String(offer.verification || "");
      let statusClass = /partial/i.test(verified) ? "partial" : /bundle|listing|caveat/i.test(verified + " " + (offer.notes || "")) ? "caveat" : "";
      const relationship = (mission.competitors || []).find(function (c) { return c.id === offer.competitor_id; });
      const sourceIds = (offer.source_ids || []).join(", ");
      const amount = Number(offer.monthly_equivalent_usd || 0);
      const scope = offer.scope || offer.notes || "";
      return '<tr><td class="competitor-cell"><b>' + esc(offer.competitor) + ' · ' + esc(offer.tier) + '</b><small>' + esc(relationship ? relationship.relationship : offer.offer_type) + ' · sources ' + esc(sourceIds) + '</small></td><td class="price-cell">' + esc(offer.price_display || offer.billing_period || money(offer.price_usd)) + '<small>' + esc(offer.billing_period || offer.offer_type || "") + '</small></td><td class="price-cell"><b>' + money(amount) + '</b><small>/ month equivalent</small></td><td>' + esc(scope) + '</td><td><span class="offer-status ' + statusClass + '">' + esc(verified || "Snapshot") + '</span></td></tr>';
    }).join("");
    const paid = offers.map(function (x) { return Number(x.monthly_equivalent_usd || 0); }).filter(function (x) { return x > 0; }).sort(function (a, b) { return a - b; });
    const mean = paid.length ? paid.reduce(function (sum, x) { return sum + x; }, 0) / paid.length : 0;
    const median = paid.length ? (paid.length % 2 ? paid[Math.floor(paid.length / 2)] : (paid[paid.length / 2 - 1] + paid[paid.length / 2]) / 2) : 0;
    $("#market-topline").innerHTML = '<span><b>' + (mission.competitors || []).length + ' competitors</b> · ' + offers.length + ' researched offers · free access appears in the observed set</span><span>Paid offer sample · mean ' + money(mean) + ' · median ' + money(median) + ' / mo equiv.</span>';
    $("#competitor-date").textContent = String(mission.as_of || "Unknown date").replace(/-/g, " ").toUpperCase();
    $("#benchmark-band").innerHTML = '<div><h4>Mission 1 preliminary test band: $1.99–$2.99 per month</h4><p>This is a hypothesis for validation, not a confirmed price or proof of willingness to pay. Annual test band: $19–$29. JustWatch bundles discovery with streaming/rental benefits; the other plans also differ in scope.</p></div><div class="benchmark-value">M1 HYPOTHESIS</div>';
  }

  function renderSources() {
    const m1 = (DATA.mission1 && DATA.mission1.sources) || [];
    const refs = DATA.sources.concat(m1.map(function (item) {
      return { id: item.id, title: item.title, organization: item.source_type || item.competitor || "Mission 1", url: item.url, checked: item.accessed, evidence: item.key_evidence || item.verification || "" };
    }));
    $("#source-register").innerHTML = refs.map(function (source) {
      return '<article class="source-entry"><b>' + esc(source.id + " · " + source.title) + '</b><p>' + esc(source.evidence || "") + '</p>' + (safeUrl(source.url) ? '<a href="' + esc(safeUrl(source.url)) + '" target="_blank" rel="noreferrer">' + esc(source.url) + ' ↗</a>' : '<small>Local project data file</small>') + '<small>' + esc(source.organization || "Source") + ' · checked ' + esc(source.checked || "date not supplied") + '</small></article>';
    }).join("");
  }

  function renderMetrics(model) {
    const profitClass = model.operatingProfit >= 0 ? "positive" : "negative";
    const beText = Number.isFinite(model.breakEvenUsers) ? whole(model.breakEvenUsers) : "N/A";
    const beSub = Number.isFinite(model.breakEvenUsers)
      ? "At current mix · " + (Number.isFinite(model.marginOfSafety) ? pct(model.marginOfSafety * 100, 0) + " margin of safety" : "no paid users")
      : "Non-positive contribution at current prices";
    const metrics = [
      { label: "Projected monthly revenue", value: money(model.revenue), foot: whole(model.paidSubscribers) + " paying subscribers + one-time sales", className: "" },
      { label: "Monthly operating result", value: (model.operatingProfit < 0 ? "−" : "") + money(Math.abs(model.operatingProfit)), foot: model.operatingProfit < 0 ? "Loss at this input set" : "After modeled variable and fixed costs", className: profitClass },
      { label: "Contribution margin", value: pct(model.contributionMargin * 100), foot: money(model.contributionPerSubscriber) + " per paid subscriber equivalent", className: "" },
      { label: "Break-even subscribers", value: beText, foot: beSub, className: "" }
    ];
    $("#metric-grid").innerHTML = metrics.map(function (x) {
      return '<article class="metric-card"><div class="metric-label">' + esc(x.label) + '<span>↗</span></div><strong class="metric-value ' + x.className + '">' + esc(x.value) + '</strong><small class="metric-foot">' + esc(x.foot) + '</small></article>';
    }).join("");
    $("#funnel-result").innerHTML = '<span>Paying subscribers at this conversion</span><b>' + whole(model.paidSubscribers) + '</b>';
    const selectedPlans = state.products.filter(function (p) { return p.enabled && p.billing !== "free"; });
    const priceSummary = selectedPlans.map(function (p) { return esc(p.name) + " " + money(p.price) + (p.billing === "annual" ? "/yr" : p.billing === "one_time" ? "/sale" : "/mo"); }).join(" · ");
    $("#decision-summary").innerHTML = '<b>Current modeled offer:</b> ' + (priceSummary || "No paid plan selected") + '<br><b>Monthly result:</b> ' + money(model.operatingProfit) + ' at ' + whole(model.paidSubscribers) + ' paying subscribers. ' + (model.operatingProfit < 0 ? "This scenario does not cover its modeled cost base." : "This scenario covers its modeled cost base before unpriced items are resolved.");
    const revenuePerSubscriber = subscriptionMix().reduce(function (sum, plan) {
      return sum + plan.normalizedMix * Number(plan.price || 0) / (plan.billing === "annual" ? 12 : 1);
    }, 0);
    $("#unit-economics").innerHTML =
      '<div class="unit-line"><label>Revenue per paid subscriber</label><strong>' + money(revenuePerSubscriber) + '</strong></div>' +
      '<div class="unit-line"><label>Variable fees per subscriber</label><strong>' + money(Math.max(0, revenuePerSubscriber - model.contributionPerSubscriber)) + '</strong></div>' +
      '<div class="unit-line"><label>Contribution / subscriber equiv.</label><strong>' + money(model.contributionPerSubscriber) + '</strong></div>' +
      '<div class="unit-line"><label>Fixed cost run-rate</label><strong>' + money(model.fixedMonthly) + ' / mo</strong></div>';
    const insight = model.operatingProfit >= 0
      ? "<b>At this scenario, modeled contribution covers the entered operating costs.</b> The result still excludes any catalog-rights cost until it is quoted and entered."
      : Number.isFinite(model.breakEvenUsers)
        ? "<b>At current mix, the model needs about " + whole(model.breakEvenUsers) + " paid subscribers to cover entered costs.</b> Your current audience and conversion assumptions imply " + whole(model.paidSubscribers) + ". The audience and conversion values are unvalidated scenarios."
        : "<b>Current variable costs meet or exceed monthly-equivalent revenue per paid subscriber.</b> Raise contribution or change the cost/fee assumptions before break-even can be reached.";
    $("#top-insight").innerHTML = '<span class="insight-icon">i</span><span>' + insight + '</span>';
  }

  function renderDonut(model) {
    const items = [];
    state.costs.forEach(function (cost) {
      const monthly = fixedCostMonthly(cost) + (state.assumptions.includeStartup && cost.kind === "fixed" && cost.frequency === "once" && Number(state.assumptions.startupAmortization) > 0 ? Number(cost.amount || 0) / Number(state.assumptions.startupAmortization) : 0);
      if (monthly > 0) {
        const old = items.find(function (x) { return x.category === cost.category; });
        if (old) old.value += monthly;
        else items.push({ category: cost.category || "Other", value: monthly });
      }
    });
    items.sort(function (a, b) { return b.value - a.value; });
    const total = items.reduce(function (sum, x) { return sum + x.value; }, 0);
    let cursor = 0;
    const stops = items.slice(0, 5).map(function (item, i) {
      const start = cursor;
      cursor += total > 0 ? item.value / total * 100 : 0;
      return COLORS[i % COLORS.length] + " " + start + "% " + cursor + "%";
    });
    if (cursor < 100) stops.push("#34495a " + cursor + "% 100%");
    $("#cost-donut").style.background = "conic-gradient(" + (stops.length ? stops.join(",") : "#293b4c 0 100%") + ")";
    $("#cost-donut").innerHTML = '<div class="donut-center"><b>' + money(total, 0) + '</b><span>MONTHLY COST</span></div>';
    $("#cost-legend").innerHTML = (items.length ? items.slice(0, 5).map(function (item, i) {
      return '<div class="legend-row"><span class="legend-label"><i class="legend-swatch" style="background:' + COLORS[i % COLORS.length] + '"></i>' + esc(item.category) + '</span><b>' + pct(total ? item.value / total * 100 : 0, 0) + '</b></div>';
    }).join("") : '<div class="legend-row"><span class="legend-label">No recurring costs entered</span><b>—</b></div>');
  }

  function renderProductVolumes(model) {
    state.products.forEach(function (product) {
      const node = $('[data-product-card="' + product.id + '"]');
      if (!node) return;
      const forecast = model.plans.find(function (x) { return x.id === product.id; });
      const bold = $(".product-units b", node);
      if (!bold) return;
      bold.textContent = product.billing === "one_time" ? money(forecast ? forecast.revenue : 0) : product.billing === "free" ? "Free users" : whole(forecast ? forecast.units : 0) + " / month";
    });
    const total = $("#product-total-row");
    if (total) total.innerHTML = '<span>Subscriber mix totals ' + pct(subscriptionMix().reduce(function (sum, x) { return sum + Number(x.mixPct || 0); }, 0), 0) + ' before normalization · ' + whole(model.paidSubscribers) + ' paying subscribers forecast</span><b>' + money(model.revenue) + ' projected monthly revenue</b>';
  }

  function chartSvg(model) {
    const w = 820, h = 230;
    const left = 55, right = 17, top = 12, bottom = 34;
    const plotW = w - left - right, plotH = h - top - bottom;
    const maxUsers = Math.max(30, model.paidSubscribers * 1.4, Number.isFinite(model.breakEvenUsers) ? model.breakEvenUsers * 1.18 : 0);
    const xMax = Math.min(10000, Math.max(30, Math.ceil(maxUsers / 10) * 10));
    const costs = model.costs;
    const oneTimeRevenue = model.oneTimeRevenue;
    const oneTimeTx = state.products.filter(function (p) { return p.enabled && p.billing === "one_time"; }).reduce(function (sum, p) { return sum + Number(p.unitsPerMonth || 0); }, 0);
    function rev(x) { return oneTimeRevenue + x * model.subscriptionPlans.reduce(function (sum, p) { return sum + p.normalizedMix * Number(p.price || 0) / (p.billing === "annual" ? 12 : 1); }, 0); }
    function txn(x) { return oneTimeTx + x * model.subscriptionPlans.reduce(function (sum, p) { return sum + p.normalizedMix / (p.billing === "annual" ? 12 : 1); }, 0); }
    function totalCost(x) { const r = rev(x); return costs.fixedMonthly + r * costs.pctRateAll + (r - oneTimeRevenue) * costs.pctRateSubscription + txn(x) * costs.transactionRate + x * costs.userRate; }
    const yMax = Math.max(50, rev(xMax), totalCost(xMax), model.revenue * 1.2, model.fixedMonthly * 1.2);
    const x = function (v) { return left + (v / xMax) * plotW; };
    const y = function (v) { return top + plotH - (v / yMax) * plotH; };
    const parts = [];
    for (let i = 0; i <= 4; i++) {
      const val = yMax * i / 4;
      parts.push('<line x1="' + left + '" y1="' + y(val) + '" x2="' + (w - right) + '" y2="' + y(val) + '" stroke="#26394b" stroke-width="1"/><text x="' + (left - 9) + '" y="' + (y(val) + 3) + '" text-anchor="end" fill="#6e8597" font-size="9">' + (val >= 1000 ? "$" + (val / 1000).toFixed(1) + "k" : "$" + Math.round(val)) + '</text>');
    }
    for (let j = 0; j <= 4; j++) {
      const val = xMax * j / 4;
      parts.push('<text x="' + x(val) + '" y="' + (h - 9) + '" text-anchor="middle" fill="#6e8597" font-size="9">' + whole(val) + '</text>');
    }
    let revPath = "";
    let costPath = "";
    for (let k = 0; k <= 48; k++) {
      const units = xMax * k / 48;
      revPath += (k ? " L " : "M ") + x(units).toFixed(1) + " " + y(rev(units)).toFixed(1);
      costPath += (k ? " L " : "M ") + x(units).toFixed(1) + " " + y(totalCost(units)).toFixed(1);
    }
    const forecastX = x(Math.min(xMax, model.paidSubscribers));
    const beX = Number.isFinite(model.breakEvenUsers) ? x(Math.min(xMax, model.breakEvenUsers)) : null;
    parts.push('<path d="' + revPath + '" fill="none" stroke="#75e3c5" stroke-width="3" stroke-linecap="round"/>');
    parts.push('<path d="' + costPath + '" fill="none" stroke="#f2c27a" stroke-width="2.5" stroke-linecap="round"/>');
    if (beX !== null) parts.push('<line x1="' + beX + '" y1="' + top + '" x2="' + beX + '" y2="' + (top + plotH) + '" stroke="#c6a9ff" stroke-dasharray="4 5" opacity=".65"/><text x="' + Math.min(w - 55, beX + 5) + '" y="' + (top + 11) + '" fill="#c6a9ff" font-size="8">BREAK-EVEN</text>');
    parts.push('<line x1="' + forecastX + '" y1="' + top + '" x2="' + forecastX + '" y2="' + (top + plotH) + '" stroke="#91b8ff" stroke-dasharray="3 5"/><circle cx="' + forecastX + '" cy="' + y(model.revenue) + '" r="4.3" fill="#91b8ff" stroke="#0e1b28" stroke-width="2"/>');
    parts.push('<text x="' + Math.min(w - 52, forecastX + 5) + '" y="' + (top + plotH - 5) + '" fill="#91b8ff" font-size="8">YOU</text>');
    return '<svg viewBox="0 0 ' + w + ' ' + h + '" role="img" aria-label="Monthly revenue and total cost by paid subscriber count">' + parts.join("") + '<text x="' + (left + plotW / 2) + '" y="' + (h - 1) + '" text-anchor="middle" fill="#879baa" font-size="8">PAID SUBSCRIBER EQUIVALENTS / MONTH</text></svg>';
  }

  function renderBars(container, rows) {
    const max = Math.max(1, rows.reduce(function (m, x) { return Math.max(m, Math.abs(x.value)); }, 0));
    container.innerHTML = rows.map(function (row) {
      const width = Math.max(row.value === 0 ? 0 : 1, Math.abs(row.value) / max * 100);
      return '<div class="bar-row"><span class="bar-label">' + esc(row.label) + '</span><span class="bar-track"><i class="bar-fill ' + (row.value < 0 ? "negative" : row.muted ? "muted" : "") + '" style="display:block;width:' + width + '%"></i></span><b class="bar-value">' + (row.value < 0 ? "−" : "") + money(Math.abs(row.value), 0) + '</b></div>';
    }).join("");
  }

  function renderSensitivity(model) {
    const rates = [
      { label: "−50%", scale: 0.5 },
      { label: "−25%", scale: 0.75 },
      { label: "Current", scale: 1 },
      { label: "+25%", scale: 1.25 },
      { label: "+50%", scale: 1.5 }
    ];
    const rows = rates.map(function (row) {
      const value = project({ priceScale: row.scale }).operatingProfit;
      return { label: row.label, value: value };
    });
    renderBars($("#sensitivity-chart"), rows);
  }

  function renderVolume(model) {
    const rows = [0.25, 0.5, 0.75, 1, 1.5, 2].map(function (factor) {
      return { label: Math.round(factor * 100) + "%", value: project({ volumeScale: factor }).operatingProfit, muted: factor !== 1 };
    });
    renderBars($("#volume-chart"), rows);
  }

  function renderProductAnalysis(model) {
    const costs = model.costs;
    const rows = model.plans.map(function (plan) {
      let contribution = plan.revenue * (1 - costs.pctRate);
      contribution -= plan.transactions * costs.transactionRate;
      if (plan.billing !== "one_time" && plan.billing !== "free") contribution -= plan.units * costs.userRate;
      return { name: plan.name, value: contribution };
    });
    const max = Math.max(1, rows.reduce(function (m, x) { return Math.max(m, Math.abs(x.value)); }, 0));
    $("#product-analysis").innerHTML = rows.length ? rows.map(function (row) {
      return '<div class="product-analysis-row"><span>' + esc(row.name) + '</span><span class="product-analysis-track"><i style="width:' + Math.max(row.value === 0 ? 0 : 1, Math.abs(row.value) / max * 100) + '%;background:' + (row.value < 0 ? "#bd6574" : "var(--teal-dark)") + '"></i></span><b>' + (row.value < 0 ? "−" : "") + money(Math.abs(row.value)) + '</b></div>';
    }).join("") : '<span class="chart-caption">Add a paid pricing plan to compare contribution.</span>';
  }

  function updateDerived() {
    const model = project();
    renderMetrics(model);
    renderDonut(model);
    renderProductVolumes(model);
    $("#breakeven-chart").innerHTML = chartSvg(model);
    renderSensitivity(model);
    renderVolume(model);
    renderProductAnalysis(model);
    const current = Number.isFinite(model.breakEvenUsers) ? "Break-even is approximately " + whole(model.breakEvenUsers) + " paying subscribers at this mix." : "Break-even cannot be reached at the current contribution per subscriber.";
    const beyond = Number.isFinite(model.breakEvenUsers) && model.breakEvenUsers > 10000 ? " It is beyond the chart's 10,000-subscriber display limit." : "";
    $("#breakeven-caption").textContent = current + beyond + " Current forecast: " + whole(model.paidSubscribers) + " subscribers and " + money(model.operatingProfit) + " operating result.";
    renderDecision();
  }

  function getDecisionFindings(model) {
    const findings = [];
    const license = state.costs.find(function (x) { return x.id === "catalog-license"; });
    if (license && !license.quoteReceived) findings.push({ level: "critical", title: "Commercial catalog rights are unpriced", body: "The venture depends on movie and TV catalog information. The current $0 row is explicitly excluded, and the source terms require a separate commercial agreement that may carry fees. Obtain permission and a written quote." });
    else if (license && license.quoteReceived && Number(license.amount) === 0) findings.push({ level: "medium", title: "Verify the zero-cost license scope", body: "You marked a quote or terms as received. Confirm that the written agreement covers the exact commercial product, territories, features and usage volumes." });
    findings.push({ level: "high", title: "Demand and willingness to pay are not measured", body: "Mission 1 provides a proposed audience and a preliminary test band, but no real survey, interview, conversion, retention or willingness-to-pay evidence. Validate with actual prospective users." });
    if (!Number.isFinite(model.breakEvenUsers)) {
      findings.push({ level: "high", title: "Current unit contribution is not positive", body: "At this plan mix and variable-fee setup, a paid subscriber does not contribute enough to cover fixed operating costs. Revise the unit economics before relying on a break-even result." });
    } else if (model.operatingProfit < 0) {
      findings.push({ level: "high", title: "The current forecast is below break-even", body: "This scenario produces " + money(model.operatingProfit) + " per month. About " + whole(model.breakEvenUsers) + " paying subscribers are needed at the current mix and costs, versus " + whole(model.paidSubscribers) + " modeled." });
    }
    const paidPlans = state.products.filter(function (x) { return x.enabled && (x.billing === "monthly" || x.billing === "annual"); });
    const bandOut = paidPlans.some(function (plan) {
      return plan.billing === "annual" ? plan.price < 19 || plan.price > 29 : plan.price < 1.99 || plan.price > 2.99;
    });
    if (bandOut) findings.push({ level: "medium", title: "A paid plan sits outside the Mission 1 test band", body: "Mission 1 proposed $1.99–$2.99/month or $19–$29/year as preliminary hypotheses. This plan is outside its corresponding band; that is not inherently wrong, but should be tested with customers." });
    if (state.costs.some(function (x) { return x.enabled && x.evidence === "estimate" && ["maintenance", "support"].indexOf(x.id) >= 0; })) findings.push({ level: "medium", title: "Labor benchmarks are wage equivalents", body: "BLS wage medians do not represent a contractor quote or fully loaded cost. Replace the hour and rate assumptions with a realistic operating plan before launch." });
    if (model.startupCash > 0 && !state.assumptions.includeStartup) findings.push({ level: "low", title: "One-time startup cash is excluded from monthly break-even", body: "The startup cash estimate is shown separately and is not recovered in the operating result until the amortization option is selected." });
    findings.push({ level: "medium", title: "Competitor prices are a dated snapshot", body: "Mission 1 prices and feature bundles were researched on October 27, 2026. Recheck current checkout and terms; observed products do not cover identical value." });
    return findings;
  }

  function renderDecision() {
    const model = project();
    const review = state.decision.review;
    const current = !!review && review.signature === modelSignature();
    const findings = current ? review.findings : [];
    if (!review) {
      $("#risk-score").textContent = "NOT REVIEWED";
      $("#risk-score").className = "risk-score";
      $("#risk-findings").innerHTML = '<div class="risk-finding"><span class="risk-level medium">READY</span><div><b>Run the rule-based review</b><p>The app will evaluate price-band position, contribution, cost coverage, data licensing and research limitations.</p></div></div>';
      $("#review-timestamp").textContent = "";
    } else if (!current) {
      $("#risk-score").textContent = "STALE REVIEW";
      $("#risk-score").className = "risk-score medium";
      $("#risk-findings").innerHTML = '<div class="risk-finding"><span class="risk-level medium">UPDATE</span><div><b>Inputs changed after the last review</b><p>Run the review again on your current assumptions before confirming.</p></div></div>';
      $("#review-timestamp").textContent = "";
    } else {
      const high = findings.some(function (f) { return f.level === "critical" || f.level === "high"; });
      const medium = findings.some(function (f) { return f.level === "medium"; });
      const band = high ? "HIGH" : medium ? "MEDIUM" : "LOW";
      $("#risk-score").textContent = band + " RISK · " + findings.length + " ITEMS";
      $("#risk-score").className = "risk-score " + (high ? "high" : medium ? "medium" : "low");
      $("#risk-findings").innerHTML = findings.map(function (f) {
        const level = f.level === "critical" ? "CRITICAL" : f.level.toUpperCase();
        return '<div class="risk-finding"><span class="risk-level ' + (f.level === "medium" ? "medium" : f.level === "low" ? "low" : "") + '">' + level + '</span><div><b>' + esc(f.title) + '</b><p>' + esc(f.body) + '</p></div></div>';
      }).join("");
      $("#review-timestamp").textContent = "Reviewed " + dateStamp(new Date(review.runAt));
    }
    $("#risk-ack").checked = !!state.decision.acknowledged;
    if ($("#justification").value !== (state.decision.justification || "")) $("#justification").value = state.decision.justification || "";
    const len = (state.decision.justification || "").trim().length;
    $("#justification-count").textContent = len + " / 50 minimum characters";
    const confirmed = !!state.decision.confirmed && !!state.decision.confirmation && state.decision.confirmation.signature === modelSignature();
    $("#confirmation-state").textContent = confirmed ? "CONFIRMED BY YOU" : "NOT CONFIRMED";
    $("#confirmation-state").className = confirmed ? "confirmed-state" : "not-confirmed";
    $("#confirmation-note").textContent = confirmed ? "Confirmed " + dateStamp(new Date(state.decision.confirmation.timestamp)) + ". Any model edit clears this confirmation and locks the report files again." : "";
    const validReview = current;
    const ready = validReview && !!state.decision.acknowledged && len >= 50 && !confirmed;
    $("#confirm-decision").disabled = !ready;
    $("#confirm-decision").textContent = confirmed ? "Decision confirmed" : "Confirm my decision";
    $("#download-docx").disabled = !confirmed;
    $("#download-decision-json").disabled = !confirmed;
    $("#handoff-status").textContent = confirmed
      ? "Confirmed " + dateStamp(new Date(state.decision.confirmation.timestamp)) + ". The DOCX report and decision JSON are ready to download."
      : "Confirm a decision above to unlock the Mission 4 report files.";
  }

  function renderAll() {
    renderScenarioControls();
    renderAssumptions();
    renderProducts();
    renderCosts();
    renderCompetitors();
    renderSources();
    updateDerived();
    $("#active-date").textContent = dateStamp(new Date()).toUpperCase();
  }

  function setCostAmount(id, value) {
    const cost = state.costs.find(function (x) { return x.id === id; });
    if (!cost) return;
    cost.amount = clamp(value, Number(cost.min || 0), Number(cost.max || 1000000));
    const row = $('[data-cost-card="' + id + '"]');
    if (row) {
      const slider = $('[data-cost-range="' + id + '"]', row);
      const number = $('[data-cost-amount="' + id + '"]', row);
      if (slider) slider.value = String(cost.amount);
      if (number) number.value = String(cost.amount);
      const title = $(".cost-unit b", row);
      if (title) title.textContent = formatCostAmount(cost);
    }
    markModelChanged();
    saveState();
    updateDerived();
  }

  function showDialog(id) {
    const dialog = $("#" + id);
    if (dialog && typeof dialog.showModal === "function") dialog.showModal();
    else if (dialog) dialog.setAttribute("open", "open");
  }
  function closeDialog(id) {
    const dialog = $("#" + id);
    if (dialog && typeof dialog.close === "function") dialog.close();
    else if (dialog) dialog.removeAttribute("open");
  }

  function downloadBlob(blob, name) {
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = name;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.setTimeout(function () { URL.revokeObjectURL(url); }, 1600);
  }

  function reportSnapshot() {
    const model = project();
    return {
      assignment: DATA.assignment,
      venture: copy(DATA.venture),
      confirmedAt: state.decision.confirmation.timestamp,
      confirmedByUser: true,
      scenario: state.scenario,
      assumptions: copy(state.assumptions),
      monthlyModel: {
        audience: model.audience,
        conversionRatePct: Number(state.assumptions.conversionPct),
        payingSubscribers: model.paidSubscribers,
        freeAudience: model.freeAudience,
        monthlyRevenue: model.revenue,
        recurringFixedCosts: model.costs.fixedRecurring,
        startupRecoveryMonthly: model.costs.amortization,
        totalVariableFees: model.variableCosts,
        monthlyOperatingResult: model.operatingProfit,
        contributionMarginPct: model.contributionMargin * 100,
        breakEvenPaidSubscribers: Number.isFinite(model.breakEvenUsers) ? model.breakEvenUsers : null,
        breakEvenRevenue: Number.isFinite(model.breakEvenRevenue) ? model.breakEvenRevenue : null,
        marginOfSafetyPct: model.marginOfSafety === null ? null : model.marginOfSafety * 100,
        startupCash: model.startupCash,
        monthlyTransactionEquivalents: model.transactions
      },
      products: copy(state.products),
      costLines: copy(state.costs),
      competitorSnapshotAsOf: DATA.mission1.as_of,
      competitors: copy(DATA.mission1.competitors),
      competitorOffers: copy(DATA.mission1.pricing_offers),
      evidenceSources: copy(DATA.sources).concat(copy(DATA.mission1.sources)),
      riskReview: copy(state.decision.review.findings),
      overallRisk: state.decision.review.overallRisk,
      writtenRationale: state.decision.justification.trim(),
      limitations: copy(DATA.mission1.limitations || []),
      note: "Private student decision record generated locally after the student explicitly confirmed the current model. It is not a validated demand forecast or public customer-facing data."
    };
  }

  function exportModelJson() {
    const payload = {
      assignment: DATA.assignment,
      exportedAt: new Date().toISOString(),
      schemaVersion: state.schemaVersion,
      state: state,
      note: "Editable browser model backup. Scenario inputs are assumptions; export does not confirm a pricing decision."
    };
    downloadBlob(new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" }), "mission-3-pricing-model.json");
    toast("Editable model JSON downloaded.");
  }

  function confirmedPayload() {
    if (!state.decision.confirmed || !state.decision.confirmation || state.decision.confirmation.signature !== modelSignature()) {
      toast("Review and confirm your current decision before downloading Mission 4 files.", true);
      return null;
    }
    return reportSnapshot();
  }

  async function exportDocx() {
    const payload = confirmedPayload();
    if (!payload) return;
    const d = window.docx;
    if (!d || !d.Document || !d.Packer) {
      toast("The offline DOCX generator did not load. Refresh the page and try again.", true);
      return;
    }
    const p = project();
    const H1 = function (text) {
      return new d.Paragraph({ children: [new d.TextRun({ text: text, bold: true, color: "0B6572", size: 30 })], spacing: { before: 300, after: 120 } });
    };
    const H2 = function (text) {
      return new d.Paragraph({ children: [new d.TextRun({ text: text, bold: true, color: "183D4A", size: 23 })], spacing: { before: 200, after: 80 } });
    };
    const P = function (text, opts) {
      const o = opts || {};
      return new d.Paragraph({ children: [new d.TextRun({ text: String(text), bold: !!o.bold, italics: !!o.italics, color: o.color || "344854", size: o.size || 20 })], spacing: { after: 90 } });
    };
    const KV = function (label, value) {
      return new d.Paragraph({ children: [new d.TextRun({ text: label + ": ", bold: true, color: "183D4A", size: 19 }), new d.TextRun({ text: String(value), color: "344854", size: 19 })], spacing: { after: 85 } });
    };
    const children = [];
    children.push(new d.Paragraph({ children: [new d.TextRun({ text: "PRICING DECISION REPORT", bold: true, color: "0B6572", size: 38 })], spacing: { after: 100 } }));
    children.push(new d.Paragraph({ children: [new d.TextRun({ text: DATA.venture.name, color: "263B47", size: 25 })], spacing: { after: 110 } }));
    children.push(P("Mission 3 · Interactive Pricing & Cost Laboratory", { color: "697D87", size: 19 }));
    children.push(P("Student-confirmed " + dateStamp(new Date(payload.confirmedAt)) + " · Scenario: " + (SCENARIOS[state.scenario] ? SCENARIOS[state.scenario].name : state.scenario), { bold: true, color: "0B6572" }));
    children.push(P("Prepared locally in the browser. This report records the student's chosen assumptions; it does not validate customer demand.", { italics: true, color: "687B84", size: 18 }));
    children.push(H1("Decision summary"));
    const selected = state.products.filter(function (x) { return x.enabled && x.billing !== "free"; });
    children.push(KV("Chosen paid plans", selected.map(function (x) { return x.name + " — " + productPriceLine(x); }).join("; ") || "No paid plan selected"));
    children.push(KV("Written rationale", state.decision.justification.trim()));
    children.push(KV("Mission 1 test hypothesis", DATA.venture.revenueHypothesis));
    children.push(H1("Monthly financial snapshot"));
    children.push(KV("Qualified visitors / month", whole(p.audience)));
    children.push(KV("Modeled paid conversion", pct(state.assumptions.conversionPct, 1) + " · unvalidated"));
    children.push(KV("Paying subscribers", whole(p.paidSubscribers)));
    children.push(KV("Projected monthly revenue", money(p.revenue)));
    children.push(KV("Monthly fixed recurring costs", money(p.costs.fixedRecurring)));
    children.push(KV("Startup recovery included", state.assumptions.includeStartup ? money(p.costs.amortization) + "/month over " + state.assumptions.startupAmortization + " months" : "No"));
    children.push(KV("Variable payment and user fees", money(p.variableCosts)));
    children.push(KV("Monthly operating result", money(p.operatingProfit)));
    children.push(KV("Contribution margin", pct(p.contributionMargin * 100, 1)));
    children.push(KV("Break-even subscriber equivalents", Number.isFinite(p.breakEvenUsers) ? whole(p.breakEvenUsers) : "Not attainable at current unit contribution"));
    children.push(KV("Break-even monthly revenue", Number.isFinite(p.breakEvenRevenue) ? money(p.breakEvenRevenue) : "Not attainable"));
    children.push(KV("One-time startup cash modeled", money(p.startupCash) + " · tracked separately from recurring costs"));
    children.push(H1("Plan and volume assumptions"));
    state.products.forEach(function (product) {
      const forecast = p.plans.find(function (x) { return x.id === product.id; });
      children.push(KV(product.name, productPriceLine(product) + " · " + (product.billing === "one_time" ? whole(forecast ? forecast.units : 0) + " units/month" : product.billing === "free" ? "free entry plan" : pct(product.mixPct, 0) + " of subscriber mix; " + whole(forecast ? forecast.units : 0) + " modeled units/month")));
    });
    children.push(P("Subscriber mix percentages normalize across paid recurring plans. One-time purchases are modeled separately.", { italics: true, color: "687B84", size: 17 }));
    children.push(H1("Cost register"));
    state.costs.forEach(function (cost) {
      const status = cost.evidence === "quote" ? (cost.quoteReceived ? "Student marked quote/terms received" : "UNPRICED / quote required") : cost.evidence === "estimate" ? "Wage-equivalent estimate" : cost.evidence === "verified" ? "Published reference" : "Student assumption";
      children.push(KV(cost.name, formatCostAmount(cost) + " · " + costClassLabel(cost) + " · " + status));
      children.push(P((cost.assumption || cost.description || "") + (cost.sourceId ? " [Source " + cost.sourceId + "]" : ""), { color: "657983", size: 16 }));
    });
    children.push(H1("Competitive benchmark"));
    children.push(P("Mission 1 researched " + DATA.mission1.competitors.length + " competitors and " + DATA.mission1.pricing_offers.length + " offers on " + DATA.mission1.as_of + ". The observed paid services differ in feature scope; annual fees are normalized by dividing by 12.", { color: "485d68" }));
    DATA.mission1.pricing_offers.forEach(function (offer) {
      children.push(KV(offer.competitor + " · " + offer.tier, (offer.price_display || money(offer.price_usd)) + " · " + money(offer.monthly_equivalent_usd) + " monthly equivalent · " + offer.verification));
    });
    children.push(P("Preliminary price test band: $1.99–$2.99/month and $19–$29/year. It is not evidence of willingness to pay.", { italics: true, color: "687B84", size: 18 }));
    children.push(H1("Decision risk review"));
    state.decision.review.findings.forEach(function (finding) {
      children.push(KV(finding.level.toUpperCase() + " · " + finding.title, finding.body));
    });
    children.push(KV("Overall rule-based risk", state.decision.review.overallRisk));
    children.push(H1("Evidence limits and next steps"));
    (DATA.mission1.limitations || []).forEach(function (item) { children.push(P("• " + item, { color: "485d68", size: 17 })); });
    children.push(P("The source snapshots, labor estimates and student inputs should be rechecked. Obtain commercial catalog permissions and written costs, then test repeat use, conversion, retention and willingness to pay before treating this model as a launch forecast.", { bold: true, color: "344854", size: 18 }));
    children.push(H1("Mission 4 handoff"));
    children.push(P("The companion JSON export stores the confirmed decision, financial assumptions, cost classifications, source references, risk findings and written rationale in a structured format. Values in this download are private project/model data and are not published as customer-facing website data.", { color: "485d68" }));
    const doc = new d.Document({
      creator: "Mission 3 Pricing & Cost Laboratory",
      title: "Pricing Decision Report — " + DATA.venture.name,
      subject: "Student-confirmed pricing model and competitive context",
      sections: [{ properties: { page: { margin: { top: 850, right: 900, bottom: 850, left: 900 } } }, children: children }]
    });
    try {
      const blob = await d.Packer.toBlob(doc);
      downloadBlob(blob, "mission-3-pricing-decision-report.docx");
      toast("DOCX report downloaded.");
    } catch (error) {
      toast("DOCX generation failed: " + (error && error.message ? error.message : "unknown error"), true);
    }
  }

  function importModel(file) {
    if (!file) return;
    if (file.size > 1000000) { toast("That model file is larger than 1 MB.", true); return; }
    const reader = new FileReader();
    reader.onload = function () {
      try {
        const payload = JSON.parse(String(reader.result || ""));
        const imported = payload.state || payload;
        if (!imported || imported.schemaVersion !== 1 || !Array.isArray(imported.costs) || !Array.isArray(imported.products)) throw new Error("The selected file is not a Mission 3 model backup.");
        state = normalizeState(imported);
        state.decision.review = null;
        state.decision.confirmed = false;
        state.decision.confirmation = null;
        state.decision.acknowledged = false;
        renderAll();
        saveState();
        toast("Model imported. Review it again before confirming a decision.");
      } catch (error) {
        toast(error && error.message ? error.message : "Could not import this model.", true);
      }
    };
    reader.onerror = function () { toast("Could not read the selected file.", true); };
    reader.readAsText(file);
  }

  function bindEvents() {
    $$(".scenario-picker button[data-scenario]").forEach(function (button) {
      button.addEventListener("click", function () { applyScenario(button.dataset.scenario); });
    });
    $("#save-scenario").addEventListener("click", function () { showDialog("scenario-dialog"); });
    $("#custom-scenario-picker").addEventListener("click", function (event) {
      const button = event.target.closest("[data-custom-scenario]");
      if (button) applyCustomScenario(button.dataset.customScenario);
    });
    $("#scenario-form").addEventListener("submit", function (event) {
      event.preventDefault();
      const name = new FormData(event.currentTarget).get("name").trim();
      if (!name) return;
      state.customScenarios[name] = { assumptions: copy(state.assumptions), costs: copy(state.costs), products: copy(state.products) };
      state.scenario = name;
      saveState();
      renderScenarioControls();
      closeDialog("scenario-dialog");
      toast("Scenario saved in this browser.");
    });
    $$(".nav-link").forEach(function (link) {
      link.addEventListener("click", function () {
        $$(".nav-link").forEach(function (x) { x.classList.remove("active"); });
        link.classList.add("active");
      });
    });
    const sections = $$(".section-anchor");
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          const id = entry.target.id;
          const link = $('.nav-link[href="#' + id + '"]');
          if (link) {
            $$(".nav-link").forEach(function (x) { x.classList.remove("active"); });
            link.classList.add("active");
            $("#crumb-current").textContent = link.textContent.trim().replace(/^[0-9]+\s*/, "").toUpperCase();
          }
        });
      }, { rootMargin: "-20% 0px -68% 0px" });
      sections.forEach(function (section) { observer.observe(section); });
    }
    $("#audience-range").addEventListener("input", handleAssumption);
    $("#audience-number").addEventListener("change", handleAssumption);
    $("#audience-number").addEventListener("input", handleAssumption);
    $("#conversion-range").addEventListener("input", handleAssumption);
    $("#conversion-number").addEventListener("change", handleAssumption);
    $("#conversion-number").addEventListener("input", handleAssumption);
    $("#startup-amortization").addEventListener("change", function () {
      state.assumptions.startupAmortization = Number(this.value) || 0;
      markModelChanged(); saveState(); updateDerived();
    });
    $("#include-startup").addEventListener("change", function () {
      state.assumptions.includeStartup = this.checked;
      markModelChanged(); saveState(); renderCosts(); updateDerived();
    });
    $("#products-list").addEventListener("input", function (event) {
      const input = event.target.closest("[data-product-id]");
      if (!input) return;
      const product = state.products.find(function (x) { return x.id === input.dataset.productId; });
      if (!product) return;
      const value = Number(input.value);
      if (!Number.isFinite(value) || value < 0) return;
      product[input.dataset.productField] = value;
      markModelChanged();
      saveState();
      updateDerived();
    });
    $("#products-list").addEventListener("click", function (event) {
      const button = event.target.closest("[data-remove-product]");
      if (!button) return;
      state.products = state.products.filter(function (x) { return x.id !== button.dataset.removeProduct; });
      markModelChanged(); saveState(); renderProducts(); updateDerived();
    });
    $("#add-product").addEventListener("click", function () { showDialog("product-dialog"); });
    $("#product-form").addEventListener("submit", function (event) {
      event.preventDefault();
      const form = new FormData(event.currentTarget);
      const billing = String(form.get("billing"));
      if (state.products.length >= 10) { toast("The model supports up to 10 plans.", true); return; }
      state.products.push({
        id: "custom-plan-" + Date.now(),
        name: String(form.get("name") || "").trim(),
        description: String(form.get("description") || "").trim(),
        billing: billing,
        price: Math.max(0, Number(form.get("price")) || 0),
        mixPct: billing === "monthly" || billing === "annual" ? Math.max(0, Number(form.get("mix")) || 0) : 0,
        unitsPerMonth: billing === "one_time" ? Math.max(0, Number(form.get("units")) || 0) : 0,
        enabled: true
      });
      markModelChanged(); saveState(); renderProducts(); updateDerived(); closeDialog("product-dialog"); event.currentTarget.reset(); toast("Pricing plan added.");
    });
    $("#cost-list").addEventListener("input", function (event) {
      const range = event.target.closest("[data-cost-range]");
      const amount = event.target.closest("[data-cost-amount]");
      if (range) setCostAmount(range.dataset.costRange, range.value);
      else if (amount && amount.value !== "") setCostAmount(amount.dataset.costAmount, amount.value);
    });
    $("#cost-list").addEventListener("change", function (event) {
      const enabled = event.target.closest("[data-cost-enabled]");
      const frequency = event.target.closest("[data-cost-frequency]");
      const quote = event.target.closest("[data-cost-quote]");
      if (enabled) {
        const cost = state.costs.find(function (x) { return x.id === enabled.dataset.costEnabled; });
        if (cost) cost.enabled = enabled.checked;
        markModelChanged(); saveState(); renderCosts(); updateDerived();
      } else if (frequency) {
        const cost = state.costs.find(function (x) { return x.id === frequency.dataset.costFrequency; });
        if (cost) cost.frequency = frequency.value;
        markModelChanged(); saveState(); renderCosts(); updateDerived();
      } else if (quote) {
        const cost = state.costs.find(function (x) { return x.id === quote.dataset.costQuote; });
        if (cost) cost.quoteReceived = quote.checked;
        markModelChanged(); saveState(); renderCosts(); updateDerived();
      }
    });
    $("#cost-list").addEventListener("click", function (event) {
      const remove = event.target.closest("[data-remove-cost]");
      if (!remove) return;
      state.costs = state.costs.filter(function (x) { return x.id !== remove.dataset.removeCost; });
      markModelChanged(); saveState(); renderCosts(); updateDerived();
    });
    $$(".filter-tabs button[data-cost-filter]").forEach(function (button) {
      button.addEventListener("click", function () {
        costFilter = button.dataset.costFilter;
        $$(".filter-tabs button").forEach(function (b) { b.classList.toggle("selected", b === button); });
        renderCosts();
      });
    });
    $("#add-cost").addEventListener("click", function () { showDialog("cost-dialog"); });
    $("#cost-form").addEventListener("submit", function (event) {
      event.preventDefault();
      if (state.costs.length >= CUSTOM_COST_MAX + 11) { toast("The model supports up to " + (CUSTOM_COST_MAX + 11) + " cost lines.", true); return; }
      const form = new FormData(event.currentTarget);
      const kindValue = String(form.get("class"));
      const frequency = kindValue === "startup" ? "once" : String(form.get("frequency") || "monthly");
      const kind = kindValue === "variable_pct" ? "pct" : kindValue === "variable_txn" ? "transaction" : kindValue === "variable_user" ? "user" : "fixed";
      const url = safeUrl(String(form.get("url") || ""));
      state.costs.push({
        id: "custom-cost-" + Date.now(),
        name: String(form.get("name") || "").trim(),
        category: "Custom expense",
        description: String(form.get("assumption") || "").trim() || "Student-entered cost assumption.",
        assumption: String(form.get("assumption") || "").trim(),
        kind: kind,
        basis: "all",
        frequency: frequency,
        amount: Math.max(0, Number(form.get("amount")) || 0),
        min: 0,
        max: kind === "pct" ? 100 : 1000000,
        step: kind === "pct" ? 0.1 : 0.01,
        enabled: true,
        sourceId: "",
        url: url,
        evidence: url ? "assumption" : "assumption"
      });
      markModelChanged(); saveState(); renderCosts(); updateDerived(); closeDialog("cost-dialog"); event.currentTarget.reset(); toast("Cost line added.");
    });
    $$("[data-close]").forEach(function (button) {
      button.addEventListener("click", function () { closeDialog(button.dataset.close); });
    });
    $("#competitor-filter").addEventListener("change", renderCompetitors);
    $("#run-review").addEventListener("click", function () {
      const model = project();
      const findings = getDecisionFindings(model);
      const high = findings.some(function (x) { return x.level === "critical" || x.level === "high"; });
      const medium = findings.some(function (x) { return x.level === "medium"; });
      state.decision.review = { runAt: new Date().toISOString(), signature: modelSignature(), findings: findings, overallRisk: high ? "HIGH" : medium ? "MEDIUM" : "LOW" };
      state.decision.acknowledged = false;
      state.decision.confirmed = false;
      state.decision.confirmation = null;
      saveState(); updateDerived(); toast("Decision review complete. Read the findings and add your rationale.");
    });
    $("#risk-ack").addEventListener("change", function () {
      state.decision.acknowledged = this.checked;
      saveState(); renderDecision();
    });
    $("#justification").addEventListener("input", function () {
      state.decision.justification = this.value;
      saveState(); renderDecision();
    });
    $("#confirm-decision").addEventListener("click", function () {
      const review = state.decision.review;
      if (!review || review.signature !== modelSignature() || !state.decision.acknowledged || state.decision.justification.trim().length < 50) {
        toast("Run a current review, acknowledge it and write at least 50 characters of rationale.", true);
        return;
      }
      state.decision.confirmed = true;
      state.decision.confirmation = { timestamp: new Date().toISOString(), signature: modelSignature(), userAction: true };
      saveState(); updateDerived(); toast("Your pricing decision is confirmed. Mission 4 downloads are unlocked.");
    });
    $("#export-model").addEventListener("click", exportModelJson);
    $("#download-docx").addEventListener("click", exportDocx);
    $("#download-decision-json").addEventListener("click", function () {
      const payload = confirmedPayload();
      if (!payload) return;
      downloadBlob(new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" }), "mission-3-confirmed-pricing-decision.json");
      toast("Confirmed decision JSON downloaded.");
    });
    $("#import-model").addEventListener("change", function () {
      importModel(this.files && this.files[0]);
      this.value = "";
    });
  }

  function handleAssumption(event) {
    const key = event.target.dataset.assumption;
    const value = clamp(event.target.value, key === "conversionPct" ? 0 : 0, key === "conversionPct" ? 30 : 50000);
    state.assumptions[key] = value;
    const counterpartType = event.target.type === "range" ? "number" : "range";
    const counterpart = $('[data-assumption="' + key + '"][type="' + counterpartType + '"]');
    if (counterpart) counterpart.value = String(value);
    markModelChanged(); saveState(); updateDerived();
  }

  function init() {
    if (!window.M3_DATA) {
      document.body.innerHTML = "<p style='padding:2rem;color:white'>The lab data could not be loaded. Refresh the page.</p>";
      return;
    }
    const customHolder = document.createElement("div");
    customHolder.id = "custom-scenario-picker";
    customHolder.className = "custom-scenario-picker";
    const picker = $(".scenario-picker");
    if (picker) picker.insertAdjacentElement("afterend", customHolder);
    renderAll();
    bindEvents();
  }

  init();
})();
