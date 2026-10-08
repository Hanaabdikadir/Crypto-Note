const STORAGE_KEY = "crypto-note-coins";
const WALLET_KEY = "crypto-note-wallet";

const form = document.getElementById("coinForm");
const editIdInput = document.getElementById("editId");
const coinNameInput = document.getElementById("coinName");
const investedInput = document.getElementById("invested");
const entryMcapInput = document.getElementById("entryMcap");
const exitMcapInput = document.getElementById("exitMcap");
const currentValueInput = document.getElementById("currentValue");
const notesInput = document.getElementById("notes");
const submitBtn = document.getElementById("submitBtn");
const cancelEditBtn = document.getElementById("cancelEdit");
const formTitle = document.getElementById("form-title");
const coinList = document.getElementById("coinList");
const emptyState = document.getElementById("emptyState");
const coinCount = document.getElementById("coinCount");
const searchInput = document.getElementById("searchInput");

const homeView = document.getElementById("homeView");
const notesView = document.getElementById("notesView");
const detailView = document.getElementById("detailView");
const addView = document.getElementById("addView");
const walletView = document.getElementById("walletView");
const profitView = document.getElementById("profitView");

const headerBrand = document.getElementById("headerBrand");
const openWalletBtn = document.getElementById("openWalletBtn");
const navHome = document.getElementById("navHome");
const navNotes = document.getElementById("navNotes");
const navProfit = document.getElementById("navProfit");
const navCalc = document.getElementById("navCalc");
const navAdd = document.getElementById("navAdd");
const heroNotesBtn = document.getElementById("heroNotesBtn");
const heroAddBtn = document.getElementById("heroAddBtn");
const backToNotes = document.getElementById("backToNotes");
const profitList = document.getElementById("profitList");
const profitEmpty = document.getElementById("profitEmpty");
const profitTotalLabel = document.getElementById("profitTotalLabel");
const calcView = document.getElementById("calcView");
const calcInvested = document.getElementById("calcInvested");
const calcEntryMcap = document.getElementById("calcEntryMcap");
const calcExitMcap = document.getElementById("calcExitMcap");
const calcMultiplier = document.getElementById("calcMultiplier");
const calcFinal = document.getElementById("calcFinal");
const calcProfit = document.getElementById("calcProfit");
const calcRoi = document.getElementById("calcRoi");
const calcClearBtn = document.getElementById("calcClearBtn");

const detailName = document.getElementById("detailName");
const detailDate = document.getElementById("detailDate");
const detailInvested = document.getElementById("detailInvested");
const detailMcap = document.getElementById("detailMcap");
const detailExitMcap = document.getElementById("detailExitMcap");
const detailCurrent = document.getElementById("detailCurrent");
const detailProfit = document.getElementById("detailProfit");
const detailNoteBox = document.getElementById("detailNoteBox");
const detailNote = document.getElementById("detailNote");
const detailEditBtn = document.getElementById("detailEditBtn");
const detailDeleteBtn = document.getElementById("detailDeleteBtn");

const walletForm = document.getElementById("walletForm");
const walletBalance = document.getElementById("walletBalance");
const walletProfit = document.getElementById("walletProfit");
const walletCoinsInvested = document.getElementById("walletCoinsInvested");
const walletCoinsCurrent = document.getElementById("walletCoinsCurrent");
const walletBalanceInput = document.getElementById("walletBalanceInput");
const walletProfitInput = document.getElementById("walletProfitInput");
const walletNoteInput = document.getElementById("walletNoteInput");
const walletSavedNote = document.getElementById("walletSavedNote");
const walletUseAutoBtn = document.getElementById("walletUseAutoBtn");
const walletClearBtn = document.getElementById("walletClearBtn");
const walletToast = document.getElementById("walletToast");

let selectedId = null;
let walletToastTimer = null;

function loadCoins() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveCoins(coins) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(coins));
}

function loadWallet() {
  try {
    const raw = localStorage.getItem(WALLET_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveWallet(data) {
  localStorage.setItem(WALLET_KEY, JSON.stringify(data));
}

function coinTotals() {
  const coins = loadCoins();
  const invested = coins.reduce((sum, c) => sum + Number(c.invested), 0);
  const current = coins.reduce((sum, c) => sum + Number(c.currentValue), 0);
  return { invested, current, profit: current - invested };
}

function money(n) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(Number(n) || 0);
}

function formatMult(n) {
  const v = Math.round(Number(n) * 100) / 100;
  return String(v);
}

function profitClass(profit) {
  if (profit > 0) return "up";
  if (profit < 0) return "down";
  return "flat";
}

function formatDate(iso) {
  try {
    return new Intl.DateTimeFormat("so-SO", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(new Date(iso));
  } catch {
    return new Date(iso).toLocaleDateString();
  }
}

function formatDateTime(iso) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";

  try {
    const day = new Intl.DateTimeFormat("so-SO", { weekday: "long" }).format(d);
    const date = new Intl.DateTimeFormat("so-SO", {
      year: "numeric",
      month: "short",
      day: "numeric",
    }).format(d);
    const time = new Intl.DateTimeFormat("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }).format(d);
    return `${day} · ${date} · ${time}`;
  } catch {
    return d.toLocaleString();
  }
}

function uid() {
  return crypto.randomUUID?.() || String(Date.now()) + Math.random().toString(16).slice(2);
}

function setActiveNav(view) {
  navHome.classList.toggle("active", view === "home");
  navNotes.classList.toggle("active", view === "notes" || view === "detail");
  navProfit.classList.toggle("active", view === "profit");
  navCalc.classList.toggle("active", view === "calc");
  navAdd.classList.toggle("active", view === "add");
  openWalletBtn.classList.toggle("active", view === "wallet");
}

function showView(view) {
  const views = {
    home: homeView,
    notes: notesView,
    detail: detailView,
    add: addView,
    wallet: walletView,
    profit: profitView,
    calc: calcView,
  };

  Object.entries(views).forEach(([key, el]) => {
    const on = key === view;
    el.classList.toggle("is-active", on);
    el.hidden = !on;
  });

  setActiveNav(view);
  window.scrollTo({ top: 0, behavior: "smooth" });

  if (view === "add") {
    requestAnimationFrame(() => coinNameInput.focus());
  }
  if (view === "wallet") {
    renderWallet();
  }
  if (view === "profit") {
    renderProfit();
  }
  if (view === "calc") {
    runCalc();
  }
}

function parseAmount(raw) {
  if (raw == null) return NaN;
  let s = String(raw).trim().toLowerCase().replace(/[$,\s]/g, "");
  if (!s) return NaN;

  const match = s.match(/^(-?\d*\.?\d+)([kmb])?$/i);
  if (!match) return Number(s);

  let n = Number(match[1]);
  if (Number.isNaN(n)) return NaN;

  const suffix = (match[2] || "").toLowerCase();
  if (suffix === "k") n *= 1_000;
  if (suffix === "m") n *= 1_000_000;
  if (suffix === "b") n *= 1_000_000_000;
  return n;
}

function runCalc() {
  const invested = parseAmount(calcInvested.value);
  const entry = parseAmount(calcEntryMcap.value);
  const exit = parseAmount(calcExitMcap.value);

  if (!(invested > 0) || !(entry > 0) || !(exit > 0)) {
    calcMultiplier.textContent = "—";
    calcFinal.textContent = "—";
    calcProfit.textContent = "—";
    calcRoi.textContent = "—";
    calcProfit.classList.remove("up", "down", "flat");
    calcRoi.classList.remove("up", "down", "flat");
    return;
  }

  const multiplier = exit / entry;
  const finalValue = invested * multiplier;
  const profit = finalValue - invested;
  const roi = (profit / invested) * 100;
  const cls = profitClass(profit);

  calcMultiplier.textContent = `${formatMult(multiplier)}x`;
  calcFinal.textContent = money(finalValue);
  calcProfit.textContent = money(profit);
  calcRoi.textContent = `${parseFloat(roi.toFixed(2))}%`;

  calcProfit.classList.remove("up", "down", "flat");
  calcRoi.classList.remove("up", "down", "flat");
  calcProfit.classList.add(cls);
  calcRoi.classList.add(cls);
}

function renderProfit() {
  const coins = loadCoins()
    .slice()
    .sort(
      (a, b) =>
        new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt)
    );

  const totalProfit = coins.reduce(
    (sum, c) => sum + (Number(c.currentValue) - Number(c.invested)),
    0
  );

  profitTotalLabel.textContent = `Wadarta: ${money(totalProfit)}`;
  profitTotalLabel.classList.remove("up", "down", "flat");
  profitTotalLabel.classList.add(profitClass(totalProfit));
  profitList.innerHTML = "";

  if (!coins.length) {
    profitEmpty.classList.add("show");
    return;
  }

  profitEmpty.classList.remove("show");

  coins.forEach((coin) => {
    const profit = Number(coin.currentValue) - Number(coin.invested);
    const pct = Number(coin.invested)
      ? ((profit / Number(coin.invested)) * 100).toFixed(1)
      : "0.0";
    const cls = profitClass(profit);

    const row = document.createElement("div");
    row.className = "profit-row";
    row.innerHTML = `
      <div class="profit-row-left">
        <span class="profit-row-name"></span>
        <span class="profit-row-date"></span>
      </div>
      <span class="profit-row-value ${cls}"></span>
    `;
    row.querySelector(".profit-row-name").textContent = coin.name;
    row.querySelector(".profit-row-date").textContent = formatDateTime(
      coin.updatedAt || coin.createdAt
    );
    row.querySelector(".profit-row-value").textContent = `${money(profit)} (${pct}%)`;
    profitList.appendChild(row);
  });
}

function resetForm() {
  form.reset();
  editIdInput.value = "";
  submitBtn.textContent = "Kudar";
  formTitle.textContent = "Kudar Coin";
}

function fillForm(coin) {
  editIdInput.value = coin.id;
  coinNameInput.value = coin.name;
  investedInput.value = coin.invested;
  entryMcapInput.value = coin.entryMcap;
  exitMcapInput.value = coin.exitMcap || "";
  currentValueInput.value = coin.currentValue;
  notesInput.value = coin.notes || "";
  submitBtn.textContent = "Kaydi";
  formTitle.textContent = `Wax ka beddel: ${coin.name}`;
  showView("add");
}

function openDetail(coin) {
  selectedId = coin.id;
  const profit = Number(coin.currentValue) - Number(coin.invested);
  const pct = Number(coin.invested)
    ? ((profit / Number(coin.invested)) * 100).toFixed(1)
    : "0.0";

  detailName.textContent = coin.name;
  detailDate.textContent = `Lagu daray ${formatDate(coin.createdAt)}`;
  detailInvested.textContent = money(coin.invested);
  detailMcap.textContent = coin.entryMcap;
  detailExitMcap.textContent = coin.exitMcap || "—";
  detailCurrent.textContent = money(coin.currentValue);
  detailProfit.textContent = `${money(profit)} (${pct}%)`;
  detailProfit.classList.remove("up", "down", "flat");
  detailProfit.classList.add(profitClass(profit));

  if (coin.notes) {
    detailNote.textContent = coin.notes;
    detailNoteBox.hidden = false;
  } else {
    detailNoteBox.hidden = true;
  }

  showView("detail");
}

function goNotes() {
  selectedId = null;
  resetForm();
  showView("notes");
}

function showWalletToast() {
  walletToast.classList.add("show");
  clearTimeout(walletToastTimer);
  walletToastTimer = setTimeout(() => walletToast.classList.remove("show"), 1800);
}

function applyWalletDisplay(balance, profit, note) {
  const totals = coinTotals();

  walletBalance.textContent = money(balance);
  walletProfit.textContent = money(profit);
  walletProfit.classList.remove("up", "down", "flat");
  walletProfit.classList.add(profitClass(profit));
  walletCoinsInvested.textContent = money(totals.invested);
  walletCoinsCurrent.textContent = money(totals.current);

  walletBalanceInput.value = balance;
  walletProfitInput.value = profit;
  walletNoteInput.value = note || "";

  if (note) {
    walletSavedNote.hidden = false;
    walletSavedNote.textContent = note;
  } else {
    walletSavedNote.hidden = true;
  }
}

function renderWallet() {
  const totals = coinTotals();
  const saved = loadWallet();

  applyWalletDisplay(
    saved?.balance ?? totals.current,
    saved?.profit ?? totals.profit,
    saved?.note || ""
  );
}

function render() {
  const coins = loadCoins();
  const query = searchInput.value.trim().toLowerCase();
  const filtered = query
    ? coins.filter(
        (c) =>
          c.name.toLowerCase().includes(query) ||
          (c.notes || "").toLowerCase().includes(query)
      )
    : coins;

  coinCount.textContent = `${coins.length} coin${coins.length === 1 ? "" : "s"}`;
  coinList.innerHTML = "";

  if (!filtered.length) {
    emptyState.classList.add("show");
    emptyState.textContent = coins.length
      ? "Wax raadintaada ma helin."
      : "Weli ma jiro note. Riix “Kudar Coin” si aad u bilowdo.";
    return;
  }

  emptyState.classList.remove("show");

  filtered
    .slice()
    .sort(
      (a, b) =>
        new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt)
    )
    .forEach((coin) => {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "name-row";
      btn.innerHTML = `
        <span class="name-row-label"></span>
        <span class="name-row-arrow" aria-hidden="true">›</span>
      `;
      btn.querySelector(".name-row-label").textContent = coin.name;
      btn.addEventListener("click", () => openDetail(coin));
      coinList.appendChild(btn);
    });
}

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const name = coinNameInput.value.trim();
  const invested = Number(investedInput.value);
  const entryMcap = entryMcapInput.value.trim();
  const exitMcap = exitMcapInput.value.trim();
  const currentValue = Number(currentValueInput.value);
  const notes = notesInput.value.trim();

  if (!name || !entryMcap || Number.isNaN(invested) || Number.isNaN(currentValue)) {
    alert("Fadlan buuxi dhammaan meelaha muhiimka ah.");
    return;
  }

  const coins = loadCoins();
  const editId = editIdInput.value;
  let saved = null;

  if (editId) {
    const idx = coins.findIndex((c) => c.id === editId);
    if (idx !== -1) {
      coins[idx] = {
        ...coins[idx],
        name,
        invested,
        entryMcap,
        exitMcap,
        currentValue,
        notes,
        updatedAt: new Date().toISOString(),
      };
      saved = coins[idx];
    }
  } else {
    saved = {
      id: uid(),
      name,
      invested,
      entryMcap,
      exitMcap,
      currentValue,
      notes,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    coins.push(saved);
  }

  saveCoins(coins);
  resetForm();
  render();
  if (saved) openDetail(saved);
  else showView("notes");
});

walletForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const balance = Number(walletBalanceInput.value);
  const profit = Number(walletProfitInput.value);
  const note = walletNoteInput.value.trim();

  if (Number.isNaN(balance) || Number.isNaN(profit)) {
    alert("Fadlan geli tiro sax ah.");
    return;
  }

  saveWallet({
    balance,
    profit,
    note,
    updatedAt: new Date().toISOString(),
  });

  applyWalletDisplay(balance, profit, note);
  showWalletToast();
});

walletUseAutoBtn.addEventListener("click", () => {
  const totals = coinTotals();
  const note = walletNoteInput.value.trim();

  walletBalanceInput.value = totals.current;
  walletProfitInput.value = totals.profit;

  saveWallet({
    balance: totals.current,
    profit: totals.profit,
    note,
    updatedAt: new Date().toISOString(),
  });

  applyWalletDisplay(totals.current, totals.profit, note);
  showWalletToast();
});

walletClearBtn.addEventListener("click", () => {
  walletBalanceInput.value = "0";
  walletProfitInput.value = "0";
  walletNoteInput.value = "";
  saveWallet({
    balance: 0,
    profit: 0,
    note: "",
    updatedAt: new Date().toISOString(),
  });
  applyWalletDisplay(0, 0, "");
  showWalletToast();
  walletBalanceInput.focus();
});

cancelEditBtn.addEventListener("click", goNotes);
searchInput.addEventListener("input", render);

headerBrand.addEventListener("click", () => {
  selectedId = null;
  resetForm();
  showView("home");
});

navHome.addEventListener("click", () => {
  selectedId = null;
  resetForm();
  showView("home");
});

navNotes.addEventListener("click", goNotes);
navProfit.addEventListener("click", () => showView("profit"));
navCalc.addEventListener("click", () => showView("calc"));
heroNotesBtn.addEventListener("click", goNotes);
document.getElementById("heroCalcBtn").addEventListener("click", () => showView("calc"));
backToNotes.addEventListener("click", goNotes);

navAdd.addEventListener("click", () => {
  resetForm();
  showView("add");
});

openWalletBtn.addEventListener("click", () => {
  showView("wallet");
});

heroAddBtn.addEventListener("click", () => {
  resetForm();
  showView("add");
});

[calcInvested, calcEntryMcap, calcExitMcap].forEach((input) => {
  input.addEventListener("input", runCalc);
});

function applyAmountSuffix(input, suffix) {
  let s = String(input.value || "")
    .trim()
    .toLowerCase()
    .replace(/[$,\s]/g, "")
    .replace(/[kmb]$/i, "");
  if (!s || s === "-" || s === ".") s = "1";
  input.value = s + suffix;
  runCalc();
}

document.querySelectorAll(".suffix-btn").forEach((btn) => {
  btn.addEventListener("click", () => {
    const target = document.getElementById(btn.dataset.target);
    if (!target) return;
    applyAmountSuffix(target, btn.dataset.suffix);
  });
});

document.querySelectorAll(".chip[data-target]").forEach((chip) => {
  chip.addEventListener("click", () => {
    const target = document.getElementById(chip.dataset.target);
    if (!target) return;
    target.value = chip.dataset.value;
    runCalc();
  });
});

calcClearBtn.addEventListener("click", () => {
  calcInvested.value = "";
  calcEntryMcap.value = "";
  calcExitMcap.value = "";
  runCalc();
});

detailEditBtn.addEventListener("click", () => {
  const coin = loadCoins().find((c) => c.id === selectedId);
  if (coin) fillForm(coin);
});

detailDeleteBtn.addEventListener("click", () => {
  const coin = loadCoins().find((c) => c.id === selectedId);
  if (!coin) return;
  if (!confirm(`Ma tirtiraysaa ${coin.name}?`)) return;

  saveCoins(loadCoins().filter((c) => c.id !== coin.id));
  selectedId = null;
  if (editIdInput.value === coin.id) resetForm();
  render();
  showView("notes");
});

showView("home");
render();

const THEME_KEY = "crypto-note-theme";
const themeToggleBtn = document.getElementById("themeToggleBtn");
const themeColorMeta = document.getElementById("themeColorMeta");
const installBtn = document.getElementById("installBtn");
const importBtn = document.getElementById("importBtn");
const importFileInput = document.getElementById("importFileInput");

function getTheme() {
  return document.documentElement.getAttribute("data-theme") || "dark";
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem(THEME_KEY, theme);
  if (themeColorMeta) {
    themeColorMeta.setAttribute("content", theme === "light" ? "#eef1f4" : "#2a2a2a");
  }
}

themeToggleBtn.addEventListener("click", () => {
  applyTheme(getTheme() === "dark" ? "light" : "dark");
});

applyTheme(localStorage.getItem(THEME_KEY) || "dark");

function pdfEscape(text) {
  return String(text ?? "")
    .replace(/[’‘]/g, "'")
    .replace(/[“”]/g, '"')
    .replace(/[^\x09\x20-\x7E]/g, "")
    .replace(/\\/g, "\\\\")
    .replace(/\(/g, "\\(")
    .replace(/\)/g, "\\)");
}

function wrapPdfLines(lines) {
  const max = 92;
  const out = [];
  lines.forEach((line) => {
    const text = String(line ?? "");
    if (text.length <= max) {
      out.push(text);
      return;
    }
    for (let i = 0; i < text.length; i += max) {
      out.push(text.slice(i, i + max));
    }
  });
  return out;
}

function buildPdf(lines) {
  const wrapped = wrapPdfLines(lines);
  const leading = 16;
  const perPage = 44;
  const pages = [];
  for (let i = 0; i < wrapped.length; i += perPage) {
    pages.push(wrapped.slice(i, i + perPage));
  }
  if (!pages.length) pages.push([""]);

  const fontId = 3 + pages.length * 2;
  const streams = pages.map((pageLines) => {
    const content = ["BT", "/F1 10 Tf", "48 800 Td", leading + " TL"];
    pageLines.forEach((line, i) => {
      const safe = pdfEscape(line);
      content.push(i === 0 ? "(" + safe + ") Tj" : "T* (" + safe + ") Tj");
    });
    content.push("ET");
    return content.join("\n");
  });

  const objects = [];
  objects.push("1 0 obj<< /Type /Catalog /Pages 2 0 R >>endobj");

  const kids = pages.map((_, i) => 3 + i * 2 + " 0 R").join(" ");
  objects.push(
    "2 0 obj<< /Type /Pages /Kids [" + kids + "] /Count " + pages.length + " >>endobj"
  );

  streams.forEach((stream, i) => {
    const pageId = 3 + i * 2;
    const contentId = pageId + 1;
    objects.push(
      pageId +
        " 0 obj<< /Type /Page /Parent 2 0 R /MediaBox [0 0 595 842] /Contents " +
        contentId +
        " 0 R /Resources << /Font << /F1 " +
        fontId +
        " 0 R >> >> >>endobj"
    );
    objects.push(
      contentId +
        " 0 obj<< /Length " +
        stream.length +
        " >>stream\n" +
        stream +
        "\nendstream endobj"
    );
  });

  objects.push(
    fontId + " 0 obj<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica >>endobj"
  );

  let pdf = "%PDF-1.4\n";
  const offsets = [0];
  objects.forEach((obj) => {
    offsets.push(pdf.length);
    pdf += obj + "\n";
  });

  const xrefPos = pdf.length;
  pdf += "xref\n0 " + (objects.length + 1) + "\n";
  pdf += "0000000000 65535 f \n";
  for (let i = 1; i < offsets.length; i++) {
    pdf += String(offsets[i]).padStart(10, "0") + " 00000 n \n";
  }
  pdf +=
    "trailer<< /Size " +
    (objects.length + 1) +
    " /Root 1 0 R >>\nstartxref\n" +
    xrefPos +
    "\n%%EOF";

  return pdf;
}

function downloadBackupPdf() {
  const coins = loadCoins();
  const wallet = loadWallet();
  const totals = coinTotals();
  const now = new Date();

  const lines = [
    "CRYPTO NOTE - Backup Report",
    "Date: " + now.toLocaleString(),
    "--------------------------------",
    "",
    "WALLET",
    "Lacagta lafaha: " + money(wallet?.balance ?? totals.current),
    "Faaida / Khasaare: " + money(wallet?.profit ?? totals.profit),
    "Coins invested: " + money(totals.invested),
    "Coins current: " + money(totals.current),
    wallet?.note ? "Qoraal: " + wallet.note : "",
    "",
    "COINS (" + coins.length + ")",
    "--------------------------------",
  ];

  if (!coins.length) {
    lines.push("Ma jiro coin.");
  } else {
    coins
      .slice()
      .sort(
        (a, b) =>
          new Date(b.updatedAt || b.createdAt) - new Date(a.updatedAt || a.createdAt)
      )
      .forEach((coin, idx) => {
        const profit = Number(coin.currentValue) - Number(coin.invested);
        const pct = Number(coin.invested)
          ? ((profit / Number(coin.invested)) * 100).toFixed(1)
          : "0.0";
        lines.push("");
        lines.push(idx + 1 + ") " + String(coin.name || "").toUpperCase());
        lines.push("   Lacagta: " + money(coin.invested));
        lines.push("   Qiimaha hadda: " + money(coin.currentValue));
        lines.push("   Entry MCap: " + (coin.entryMcap || "-"));
        lines.push("   Exit MCap: " + (coin.exitMcap || "-"));
        lines.push("   Faaida: " + money(profit) + " (" + pct + "%)");
        lines.push(
          "   Taariikh: " +
            new Date(coin.updatedAt || coin.createdAt).toLocaleString("en-GB")
        );
        if (coin.notes) lines.push("   Qoraal: " + coin.notes);
      });
  }

  const pdf = buildPdf(lines.filter((l) => l !== undefined));
  const blob = new Blob([pdf], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const stamp = now.toISOString().slice(0, 10);
  a.href = url;
  a.download = `crypto-note-${stamp}.pdf`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

function downloadBackupJson() {
  const payload = {
    exportedAt: new Date().toISOString(),
    coins: loadCoins(),
    wallet: loadWallet(),
  };
  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  const stamp = new Date().toISOString().slice(0, 10);
  a.href = url;
  a.download = `crypto-note-backup-${stamp}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

installBtn.addEventListener("click", () => {
  const coins = loadCoins();
  const wallet = loadWallet();
  if (!coins.length && !wallet) {
    alert("Weli ma jiro xog la soo dejiyo. Marka hore ku dar coin ama wallet.");
    return;
  }
  const choice = confirm(
    "OK = PDF soo deji\nCancel = JSON backup (si aad phone ugu wareejiso)"
  );
  if (choice) downloadBackupPdf();
  else downloadBackupJson();
});

importBtn.addEventListener("click", () => importFileInput.click());

importFileInput.addEventListener("change", async () => {
  const file = importFileInput.files && importFileInput.files[0];
  importFileInput.value = "";
  if (!file) return;

  try {
    const text = await file.text();
    const data = JSON.parse(text);
    const coins = Array.isArray(data) ? data : data.coins;
    const wallet = Array.isArray(data) ? null : data.wallet;

    if (!Array.isArray(coins)) {
      alert("Faylkan ma aha backup sax ah.");
      return;
    }

    if (!confirm("Xogta hadda jirta waa la beddeli doonaa. Ma sii wadaysaa?")) {
      return;
    }

    saveCoins(coins);
    if (wallet && typeof wallet === "object") {
      saveWallet(wallet);
    }
    render();
    renderProfit();
    renderWallet();
    alert("Backup waa la soo geliyey. Coins: " + coins.length);
    showView("notes");
  } catch (err) {
    alert("Lama akhriyin faylka. Hubi inuu JSON backup yahay.");
  }
});
(function enableTouchPressFeedback() {
  const SELECTOR =
    ".btn, .nav-item, .icon-btn, .chip, .name-row, .back-btn, .logo";
  const PRESS = "is-pressed";

  function clearPressed() {
    document.querySelectorAll("." + PRESS).forEach((el) => {
      el.classList.remove(PRESS);
    });
  }

  document.addEventListener(
    "touchstart",
    (e) => {
      const target = e.target.closest(SELECTOR);
      if (!target) return;
      clearPressed();
      target.classList.add(PRESS);
    },
    { passive: true }
  );

  document.addEventListener("touchend", clearPressed, { passive: true });
  document.addEventListener("touchcancel", clearPressed, { passive: true });
  document.addEventListener("scroll", clearPressed, { passive: true });
})();

if ("serviceWorker" in navigator && location.protocol !== "file:") {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("./sw.js")
      .then(() => navigator.serviceWorker.ready)
      .then(updatePwaUi)
      .catch(() => {});
  });
}
