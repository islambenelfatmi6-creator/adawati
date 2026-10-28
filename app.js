
/* =========================================================
   AADAWATI — 55 TOOLS
   Arabic RTL | Browser-based utilities
   Requires the libraries declared in index.html
   ========================================================= */

"use strict";

const tools = [
  ["pdf", "Word إلى PDF", "wordToPdf"],
  ["pdf", "PDF إلى Word", "pdfToText"],
  ["pdf", "الصور إلى PDF", "imgToPdf"],
  ["pdf", "دمج PDF", "pdfMerge"],
  ["pdf", "تقسيم PDF", "pdfSplit"],
  ["pdf", "ضغط PDF", "pdfCompress"],
  ["pdf", "تدوير PDF", "pdfRotate"],
  ["pdf", "حماية PDF", "pdfProtect"],
  ["img", "قص الخلفية - شفاف", "removeBg"],
  ["img", "إزالة الأضواء - سينمائي", "lightRemove"],
  ["img", "ضغط الصور JPG", "compressImg"],
  ["img", "تغيير مقاس الصورة", "resizeImg"],
  ["img", "تحويل صيغ الصور", "convertImg"],
  ["img", "علامة مائية صورة", "watermark"],
  ["img", "أبيض وأسود", "grayscale"],
  ["img", "تشويش", "blurImg"],
  ["img", "صورة إلى Base64", "imgBase64"],
  ["img", "Base64 إلى صورة", "base64Img"],
  ["img", "منشئ Favicon", "favicon"],
  ["img", "مقارنة صورتين", "compareImg"],
  ["txt", "عداد الكلمات", "wordCounter"],
  ["txt", "تحويل حالة النص", "caseConv"],
  ["txt", "إزالة التشكيل", "tashkeel"],
  ["txt", "قلب النص", "reverseText"],
  ["txt", "تحويل لرابط slug", "slug"],
  ["txt", "نص وهمي Lorem", "lorem"],
  ["txt", "مولد هاشتاغ", "hashtag"],
  ["txt", "إزالة المكرر", "duplicate"],
  ["txt", "ترتيب الأسطر", "sortLines"],
  ["txt", "مولد كلمات سر", "passwordGen"],
  ["txt", "عد الأحرف", "charCounter"],
  ["txt", "مستخرج الإيميلات", "emailExtract"],
  ["calc", "حساب النسبة", "percent"],
  ["calc", "حساب BMI", "bmi"],
  ["calc", "حساب العمر", "ageCalc"],
  ["calc", "حساب TVA", "tva"],
  ["calc", "قرض السكن", "loan"],
  ["calc", "حساب الخصم", "discount"],
  ["calc", "حساب الباك", "bacCalc"],
  ["calc", "حساب المساحة", "area"],
  ["dev", "مولد QR", "qrGen"],
  ["dev", "منسق JSON", "jsonFormat"],
  ["dev", "Base64 نص", "base64Text"],
  ["dev", "تشفير URL", "urlEncode"],
  ["dev", "تحويل ألوان", "colorConv"],
  ["dev", "مولد UUID", "uuid"],
  ["dev", "مولد Hash", "hashGen"],
  ["dev", "مختبر Regex", "regexTest"],
  ["dev", "محول الوقت Unix", "unixTime"],
  ["dev", "مولد باركود", "barcode"],
  ["misc", "حاسبة العمر بالدقائق", "ageMinutes"],
  ["misc", "مولد سيرة ذاتية", "cvGen"],
  ["misc", "مولد فاتورة", "invoiceGen"],
  ["misc", "مقياس قوة كلمة السر", "passStrength"]
];

const categories = {
  all: "الكل",
  pdf: "PDF",
  img: "الصور",
  txt: "النصوص",
  calc: "الحاسبات",
  dev: "المطورين",
  misc: "متنوع"
};

const categoryDescriptions = {
  all: "اكتشف جميع الأدوات المجانية.",
  pdf: "تحويل ملفات PDF وتنظيمها.",
  img: "تعديل الصور وتحويلها ومعالجتها.",
  txt: "أدوات معالجة النصوص والكلمات.",
  calc: "حاسبات عملية للحياة اليومية.",
  dev: "أدوات مفيدة للمبرمجين.",
  misc: "أدوات متنوعة للإنتاجية."
};

const $ = (selector, root = document) => root.querySelector(selector);

const tabsEl = $("#tabs");
const menuEl = $("#menu");
const gridEl = $("#toolsGrid");
const viewEl = $("#toolView");
const searchEl = $("#search");
const darkBtn = $("#darkBtn");
const menuCount = $("#menuCount");
const totalTools = $("#totalTools");
const sectionTitle = $("#sectionTitle");
const sectionDescription = $("#sectionDescription");
const emptyState = $("#emptyState");
const contentHeading = $("#contentHeading");

let activeId = -1;
let activeCategory = "all";
let searchQuery = "";
let currentObjectUrls = [];
let currentCleanup = [];

const categoryIcons = {
  pdf: "📄",
  img: "🖼️",
  txt: "📝",
  calc: "🧮",
  dev: "💻",
  misc: "✨"
};

/* -------------------- Initial setup -------------------- */

function initialize() {
  if (!tabsEl || !menuEl || !gridEl || !viewEl || !searchEl) {
    console.error("Aadawati: required HTML elements are missing.");
    return;
  }

  renderTabs();
  setupTheme();
  setupEvents();

  if ($("#currentYear")) {
    $("#currentYear").textContent = new Date().getFullYear();
  }

  if (totalTools) totalTools.textContent = tools.length;

  renderTools();
}

function renderTabs() {
  tabsEl.innerHTML = "";

  Object.entries(categories).forEach(([key, label]) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "tab";
    button.dataset.category = key;
    button.textContent = key === "all" ? `${label} ${tools.length}` : label;
    button.setAttribute("aria-pressed", String(key === activeCategory));

    if (key === activeCategory) button.classList.add("active");

    tabsEl.appendChild(button);
  });
}

function setupEvents() {
  tabsEl.addEventListener("click", event => {
    const button = event.target.closest("[data-category]");
    if (!button) return;

    activeCategory = button.dataset.category;
    activeId = -1;
    renderTabs();
    renderTools();
  });

  searchEl.addEventListener("input", () => {
    searchQuery = searchEl.value.trim().toLocaleLowerCase();
    activeId = -1;
    renderTools();
  });

  if (darkBtn) {
    darkBtn.addEventListener("click", toggleTheme);
  }

  const clearSearch = $("#clearSearch");
  if (clearSearch) {
    clearSearch.addEventListener("click", () => {
      searchEl.value = "";
      searchQuery = "";
      activeCategory = "all";
      activeId = -1;
      renderTabs();
      renderTools();
    });
  }

  gridEl.addEventListener("click", event => {
    const card = event.target.closest("[data-tool-index]");
    if (card) openTool(Number(card.dataset.toolIndex));
  });

  menuEl.addEventListener("click", event => {
    const item = event.target.closest("[data-tool-index]");
    if (item) openTool(Number(item.dataset.toolIndex));
  });
}

function setupTheme() {
  let saved = "light";

  try {
    saved = localStorage.getItem("aadawati-theme") || "light";
  } catch (_) {}

  document.body.classList.toggle("dark", saved === "dark");
  updateThemeButton();
}

function toggleTheme() {
  const isDark = document.body.classList.toggle("dark");
  try {
    localStorage.setItem("aadawati-theme", isDark ? "dark" : "light");
  } catch (_) {}
  updateThemeButton();
}

function updateThemeButton() {
  if (!darkBtn) return;

  const isDark = document.body.classList.contains("dark");
  darkBtn.textContent = isDark ? "☀️" : "🌙";
  darkBtn.setAttribute(
    "aria-label",
    isDark ? "تفعيل الوضع الفاتح" : "تفعيل الوضع الليلي"
  );
}

/* -------------------- Tool listing -------------------- */

function filteredTools() {
  return tools
    .map((item, index) => ({
      category: item[0],
      name: item[1],
      id: item[2],
      index
    }))
    .filter(item =>
      activeCategory === "all" || item.category === activeCategory
    )
    .filter(item =>
      !searchQuery ||
      item.name.toLocaleLowerCase().includes(searchQuery) ||
      item.id.toLocaleLowerCase().includes(searchQuery) ||
      categories[item.category].toLocaleLowerCase().includes(searchQuery)
    );
}

function renderTools() {
  const list = filteredTools();

  menuEl.innerHTML = "";
  gridEl.innerHTML = "";

  list.forEach(item => {
    const menuButton = document.createElement("button");
    menuButton.type = "button";
    menuButton.className = "menu-item";
    menuButton.dataset.toolIndex = item.index;
    menuButton.textContent = `${categoryIcons[item.category]} ${item.name}`;

    if (item.index === activeId) menuButton.classList.add("active");
    menuEl.appendChild(menuButton);

    const card = document.createElement("button");
    card.type = "button";
    card.className = "tool-card";
    card.dataset.toolIndex = item.index;

    const name = document.createElement("b");
    name.textContent = item.name;

    const category = document.createElement("span");
    category.textContent = categories[item.category];

    card.append(name, category);
    gridEl.appendChild(card);
  });

  if (menuCount) menuCount.textContent = list.length;

  if (sectionTitle) {
    sectionTitle.textContent =
      activeCategory === "all" ? "اكتشف الأدوات" : categories[activeCategory];
  }

  if (sectionDescription) {
    sectionDescription.textContent = categoryDescriptions[activeCategory];
  }

  const isEmpty = list.length === 0;
  emptyState?.classList.toggle("hidden", !isEmpty);

  if (activeId < 0 || !tools[activeId]) {
    gridEl.classList.remove("hidden");
    viewEl.classList.add("hidden");
    if (contentHeading) contentHeading.classList.remove("hidden");
  }
}

/* -------------------- Safe UI helpers -------------------- */

function escapeHTML(value) {
  return String(value).replace(/[&<>"']/g, char => ({
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#39;"
  })[char]);
}

function field(id, label, type = "text", placeholder = "", value = "") {
  return `
    <div class="field">
      <label for="${id}">${escapeHTML(label)}</label>
      <input id="${id}" type="${type}"
        placeholder="${escapeHTML(placeholder)}"
        value="${escapeHTML(value)}">
    </div>`;
}

function textareaField(id, label, placeholder = "", value = "") {
  return `
    <div class="field">
      <label for="${id}">${escapeHTML(label)}</label>
      <textarea id="${id}" placeholder="${escapeHTML(placeholder)}">${escapeHTML(value)}</textarea>
    </div>`;
}

function selectField(id, label, options) {
  return `
    <div class="field">
      <label for="${id}">${escapeHTML(label)}</label>
      <select id="${id}">
        ${options.map(option =>
          `<option value="${escapeHTML(option[0])}">${escapeHTML(option[1])}</option>`
        ).join("")}
      </select>
    </div>`;
}

function box(content) {
  return `<div class="box">${content}</div>`;
}

function buttons(content) {
  return `<div class="btn-row">${content}</div>`;
}

function button(id, label, secondary = false) {
  return `<button type="button" id="${id}" class="btn${secondary ? " btn-secondary" : ""}">${escapeHTML(label)}</button>`;
}

function result(id, text = "النتيجة ستظهر هنا") {
  return `<div class="result" id="${id}" aria-live="polite">${escapeHTML(text)}</div>`;
}

function setResult(id, value) {
  const element = document.getElementById(id);
  if (!element) return;

  if (value instanceof Node) {
    element.replaceChildren(value);
  } else {
    element.textContent = String(value);
  }
}

function setStatus(message, type = "") {
  let element = $("#toolStatus", viewEl);

  if (!element) {
    element = document.createElement("div");
    element.id = "toolStatus";
    element.className = "status-message";
    element.setAttribute("role", "status");
    viewEl.appendChild(element);
  }

  element.className = `status-message ${type}`.trim();
  element.textContent = message;
}

function listen(id, eventName, callback) {
  const element = document.getElementById(id);
  if (element) element.addEventListener(eventName, callback);
  return element;
}

function onClick(id, callback) {
  return listen(id, "click", callback);
}

function value(id) {
  return document.getElementById(id)?.value ?? "";
}

function numberValue(id) {
  const number = Number(value(id));
  return Number.isFinite(number) ? number : NaN;
}

function requireNumber(id, label, min = -Infinity, max = Infinity) {
  const number = numberValue(id);

  if (!Number.isFinite(number) || number < min || number > max) {
    throw new Error(`${label}: أدخل رقماً صحيحاً ضمن الحدود المطلوبة.`);
  }

  return number;
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  currentObjectUrls.push(url);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.style.display = "none";

  document.body.appendChild(link);
  link.click();
  link.remove();

  setTimeout(() => {
    URL.revokeObjectURL(url);
    currentObjectUrls = currentObjectUrls.filter(item => item !== url);
  }, 30000);
}

function downloadText(text, filename, type = "text/plain;charset=utf-8") {
  downloadBlob(new Blob(["\uFEFF", text], { type }), filename);
}

function downloadDataURL(dataURL, filename) {
  const link = document.createElement("a");
  link.href = dataURL;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
}

function randomInt(max) {
  if (window.crypto?.getRandomValues) {
    const array = new Uint32Array(1);
    const limit = Math.floor(0x100000000 / max) * max;

    do {
      crypto.getRandomValues(array);
    } while (array[0] >= limit);

    return array[0] % max;
  }

  return Math.floor(Math.random() * max);
}

function randomPassword(length, options = {}) {
  const sets = [];

  if (options.upper !== false) sets.push("ABCDEFGHJKLMNPQRSTUVWXYZ");
  if (options.lower !== false) sets.push("abcdefghijkmnopqrstuvwxyz");
  if (options.numbers !== false) sets.push("23456789");
  if (options.symbols) sets.push("!@#$%^&*_-+=");

  if (!sets.length) throw new Error("اختر نوعاً واحداً على الأقل.");

  const chars = sets.join("");
  const output = sets.map(set => set[randomInt(set.length)]);

  while (output.length < length) {
    output.push(chars[randomInt(chars.length)]);
  }

  for (let i = output.length - 1; i > 0; i--) {
    const j = randomInt(i + 1);
    [output[i], output[j]] = [output[j], output[i]];
  }

  return output.join("");
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    setStatus("تم نسخ النتيجة.", "success");
  } catch (_) {
    const area = document.createElement("textarea");
    area.value = text;
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();

    const success = document.execCommand("copy");
    area.remove();

    setStatus(
      success ? "تم نسخ النتيجة." : "تعذر النسخ. حدد النص وانسخه يدوياً.",
      success ? "success" : "error"
    );
  }
}

function addCopyButton(parent, text) {
  const buttonElement = document.createElement("button");
  buttonElement.type = "button";
  buttonElement.className = "btn btn-secondary btn-small";
  buttonElement.textContent = "نسخ النتيجة";
  buttonElement.addEventListener("click", () => copyText(text));
  parent.appendChild(buttonElement);
}

function cleanupCurrentTool() {
  currentCleanup.forEach(fn => {
    try { fn(); } catch (_) {}
  });
  currentCleanup = [];

  currentObjectUrls.forEach(url => URL.revokeObjectURL(url));
  currentObjectUrls = [];
}

function openTool(index) {
  if (!Number.isInteger(index) || !tools[index]) return;

  cleanupCurrentTool();
  activeId = index;

  const [category, name, id] = tools[index];

  gridEl.classList.add("hidden");
  emptyState?.classList.add("hidden");
  viewEl.classList.remove("hidden");

  if (contentHeading) contentHeading.classList.add("hidden");

  viewEl.innerHTML = `
    <button type="button" class="back-btn" id="backButton">← رجوع إلى الأدوات</button>
    <div class="tool-view-header">
      <div>
        <h2>${escapeHTML(name)}</h2>
        <p>${escapeHTML(categories[category])} · أداة مجانية</p>
      </div>
    </div>
    <div id="toolBody"></div>`;

  onClick("backButton", () => {
    cleanupCurrentTool();
    activeId = -1;
    renderTools();
  });

  renderTools();
  loadTool(id, name).catch(error => {
    console.error(error);
    setStatus(error.message || "وقع خطأ أثناء تنفيذ الأداة.", "error");
  });

  window.scrollTo({ top: 0, behavior: "smooth" });
}

/* -------------------- File and image helpers -------------------- */

function filePicker(id, accept, multiple = false) {
  return `
    <div class="field">
      <label for="${id}">اختر الملف</label>
      <input id="${id}" type="file" accept="${escapeHTML(accept)}"
        ${multiple ? "multiple" : ""}>
    </div>`;
}

function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = () => reject(new Error("تعذر قراءة الملف."));
    reader.readAsDataURL(file);
  });
}

function readImage(file) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith("image/")) {
      reject(new Error("اختر ملف صورة صالحاً."));
      return;
    }

    const url = URL.createObjectURL(file);
    const img = new Image();

    img.onload = () => {
      URL.revokeObjectURL(url);
      resolve(img);
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("تعذر فتح الصورة."));
    };

    img.src = url;
  });
}

function canvasToBlob(canvas, type = "image/png", quality = 0.9) {
  return new Promise((resolve, reject) => {
    canvas.toBlob(blob => {
      if (blob) resolve(blob);
      else reject(new Error("تعذر إنشاء الصورة الناتجة."));
    }, type, quality);
  });
}

function makeCanvas(width, height) {
  if (width < 1 || height < 1 || width * height > 40000000) {
    throw new Error("أبعاد الصورة كبيرة جداً أو غير صحيحة.");
  }

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  return canvas;
}

function previewImage(container, src, alt = "معاينة") {
  const image = document.createElement("img");
  image.src = src;
  image.alt = alt;
  container.replaceChildren(image);
}

function downloadCanvas(canvas, filename, type = "image/png", quality = 0.9) {
  canvas.toBlob(blob => {
    if (!blob) {
      setStatus("تعذر إنشاء الصورة.", "error");
      return;
    }

    downloadBlob(blob, filename);
    setStatus("تم تجهيز الصورة للتحميل.", "success");
  }, type, quality);
}

function getPDFLib() {
  if (!window.PDFLib) {
    throw new Error("مكتبة PDF غير متاحة. تحقق من اتصال الإنترنت.");
  }
  return window.PDFLib;
}

function getJsPDF() {
  if (!window.jspdf?.jsPDF) {
    throw new Error("مكتبة PDF غير متاحة. تحقق من اتصال الإنترنت.");
  }
  return window.jspdf.jsPDF;
}

async function loadPdf(file) {
  const { PDFDocument } = getPDFLib();
  const buffer = await file.arrayBuffer();
  return PDFDocument.load(buffer);
}

async function pdfDownload(doc, filename) {
  const bytes = await doc.save();
  downloadBlob(new Blob([bytes], { type: "application/pdf" }), filename);
}

/* -------------------- Main tool dispatcher -------------------- */

async function loadTool(id, name) {
  const body = $("#toolBody", viewEl);
  if (!body) return;

  const textInput = (id, label = "النص", placeholder = "اكتب هنا...") =>
    textareaField(id, label, placeholder);

  /* PDF TOOLS */

  if (id === "imgToPdf") {
    body.innerHTML = box(
      filePicker("pdfImages", "image/*", true) +
      `<p class="text-muted">اختر صورة أو عدة صور. الصيغ الشائعة مثل PNG وJPG مدعومة.</p>` +
      button("runImgToPdf", "تحويل الصور إلى PDF") +
      result("pdfImageStatus")
    );

    onClick("runImgToPdf", async () => {
      const files = [...($("#pdfImages").files || [])];
      if (!files.length) throw new Error("اختر صورة واحدة على الأقل.");

      const { PDFDocument } = getPDFLib();
      const pdf = await PDFDocument.create();

      for (const file of files) {
        const image = await readImage(file);
        const canvas = makeCanvas(image.naturalWidth, image.naturalHeight);
        canvas.getContext("2d").drawImage(image, 0, 0);
        const blob = await canvasToBlob(canvas, "image/png");
        const bytes = await blob.arrayBuffer();
        const embedded = await pdf.embedPng(bytes);
        const page = pdf.addPage([embedded.width, embedded.height]);
        page.drawImage(embedded, {
          x: 0, y: 0, width: embedded.width, height: embedded.height
        });
      }

      await pdfDownload(pdf, "aadawati-images.pdf");
      setResult("pdfImageStatus", `تم تحويل ${files.length} صورة.`);
    });
    return;
  }

  if (id === "pdfMerge") {
    body.innerHTML = box(
      filePicker("pdfFiles", ".pdf,application/pdf", true) +
      button("runPdfMerge", "دمج ملفات PDF") +
      result("pdfMergeStatus")
    );

    onClick("runPdfMerge", async () => {
      const files = [...($("#pdfFiles").files || [])];
      if (files.length < 2) throw new Error("اختر ملفي PDF على الأقل.");

      const { PDFDocument } = getPDFLib();
      const merged = await PDFDocument.create();

      for (const file of files) {
        const pdf = await loadPdf(file);
        const pages = await merged.copyPages(pdf, pdf.getPageIndices());
        pages.forEach(page => merged.addPage(page));
      }

      await pdfDownload(merged, "merged.pdf");
      setResult("pdfMergeStatus", `تم دمج ${files.length} ملفات.`);
    });
    return;
  }

  if (id === "pdfSplit") {
    body.innerHTML = box(
      filePicker("splitFile", ".pdf,application/pdf") +
      field("splitPages", "أرقام الصفحات", "text", "مثال: 1,3,5 أو 2-5") +
      button("runPdfSplit", "استخراج الصفحات") +
      result("splitStatus")
    );

    onClick("runPdfSplit", async () => {
      const file = $("#splitFile").files[0];
      if (!file) throw new Error("اختر ملف PDF.");

      const pdf = await loadPdf(file);
      const total = pdf.getPageCount();
      const input = value("splitPages").trim();
      const selected = new Set();

      if (!input) throw new Error("أدخل أرقام الصفحات.");

      for (const part of input.split(",")) {
        const range = part.trim().match(/^(\d+)\s*-\s*(\d+)$/);

        if (range) {
          const start = Number(range[1]);
          const end = Number(range[2]);

          if (start < 1 || end < start || end > total) {
            throw new Error(`النطاق غير صالح. عدد الصفحات: ${total}`);
          }

          for (let i = start; i <= end; i++) selected.add(i - 1);
        } else {
          const page = Number(part.trim());

          if (!Number.isInteger(page) || page < 1 || page > total) {
            throw new Error(`رقم صفحة غير صالح. عدد الصفحات: ${total}`);
          }

          selected.add(page - 1);
        }
      }

      const output = await getPDFLib().PDFDocument.create();
      const indices = [...selected].sort((a, b) => a - b);
      const pages = await output.copyPages(pdf, indices);
      pages.forEach(page => output.addPage(page));

      await pdfDownload(output, "split-pages.pdf");
      setResult("splitStatus", `تم استخراج ${indices.length} صفحات.`);
    });
    return;
  }

  if (id === "pdfRotate") {
    body.innerHTML = box(
      filePicker("rotateFile", ".pdf,application/pdf") +
      selectField("rotateDegrees", "زاوية التدوير", [
        ["90", "90 درجة"],
        ["180", "180 درجة"],
        ["270", "270 درجة"]
      ]) +
      button("runPdfRotate", "تدوير وتحميل PDF") +
      result("rotateStatus")
    );

    onClick("runPdfRotate", async () => {
      const file = $("#rotateFile").files[0];
      if (!file) throw new Error("اختر ملف PDF.");

      const pdf = await loadPdf(file);
      const degrees = Number(value("rotateDegrees"));
      const { degrees: pdfDegrees } = getPDFLib();

      pdf.getPages().forEach(page => {
        const current = page.getRotation().angle;
        page.setRotation(pdfDegrees((current + degrees) % 360));
      });

      await pdfDownload(pdf, "rotated.pdf");
      setResult("rotateStatus", "تم تدوير صفحات الملف.");
    });
    return;
  }

  if (id === "pdfCompress") {
    body.innerHTML = box(
      filePicker("compressPdfFile", ".pdf,application/pdf") +
      `<p class="text-muted">يعيد هذا الإجراء حفظ PDF وإزالة بعض البيانات غير الضرورية. لا يضمن تقليل حجم كل ملف؛ فالملفات التي تحتوي صوراً كبيرة قد تحتاج أداة ضغط متخصصة.</p>` +
      button("runCompressPdf", "إعادة حفظ PDF") +
      result("compressPdfStatus")
    );

    onClick("runCompressPdf", async () => {
      const file = $("#compressPdfFile").files[0];
      if (!file) throw new Error("اختر ملف PDF.");

      const pdf = await loadPdf(file);
      await pdfDownload(pdf, "optimized.pdf");

      setResult(
        "compressPdfStatus",
        `حجم الملف الأصلي: ${(file.size / 1024).toFixed(1)} KB. تم حفظ نسخة جديدة؛ قارن الحجم قبل الاعتماد عليها.`
      );
    });
    return;
  }

  if (id === "pdfProtect") {
    body.innerHTML = box(
      filePicker("protectPdfFile", ".pdf,application/pdf") +
      `<p class="text-muted">مكتبة pdf-lib لا تدعم إنشاء تشفير PDF بكلمة مرور مباشرة. يمكن فتح الملف وحفظ نسخة جديدة فقط؛ هذه الأداة لا تضع كلمة مرور حقيقية.</p>` +
      button("runProtectPdf", "حفظ نسخة PDF") +
      result("protectStatus")
    );

    onClick("runProtectPdf", async () => {
      const file = $("#protectPdfFile").files[0];
      if (!file) throw new Error("اختر ملف PDF.");

      const pdf = await loadPdf(file);
      await pdfDownload(pdf, "pdf-copy.pdf");
      setResult("protectStatus", "حُفظت نسخة PDF دون تشفير بكلمة مرور.");
    });
    return;
  }

  if (id === "pdfToText") {
    body.innerHTML = box(
      filePicker("textPdfFile", ".pdf,application/pdf") +
      button("runPdfText", "استخراج النص من PDF") +
      result("pdfTextStatus") +
      `<div class="field"><label for="pdfExtractedText">النص المستخرج</label><textarea id="pdfExtractedText" placeholder="سيظهر النص هنا..."></textarea></div>` +
      button("downloadExtractedText", "تحميل النص TXT", true)
    );

    onClick("runPdfText", async () => {
      const file = $("#textPdfFile").files[0];
      if (!file) throw new Error("اختر ملف PDF.");
      if (!window.pdfjsLib) throw new Error("مكتبة قراءة PDF غير متاحة.");

      const buffer = await file.arrayBuffer();
      const pdf = await window.pdfjsLib.getDocument({ data: buffer }).promise;
      let text = "";

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        text += content.items.map(item => item.str).join(" ") + "\n\n";
      }

      $("#pdfExtractedText").value = text;
      setResult(
        "pdfTextStatus",
        `تم استخراج النص من ${pdf.numPages} صفحة. هذا استخراج نص وليس تحويلاً كاملاً إلى Word؛ الصفحات المصورة قد تحتاج OCR.`
      );
    });

    onClick("downloadExtractedText", () => {
      downloadText(value("pdfExtractedText"), "pdf-text.txt");
    });
    return;
  }

  if (id === "wordToPdf") {
    body.innerHTML = box(
      filePicker("wordFile", ".docx,application/vnd.openxmlformats-officedocument.wordprocessingml.document") +
      `<p class="text-muted">يُستخرج النص من DOCX ثم يُنشأ PDF بسيط. قد لا يحافظ على الصور والتنسيق الأصلي، وقد يحتاج النص العربي إلى خط مناسب.</p>` +
      button("runWordPdf", "تحويل إلى PDF") +
      result("wordPdfStatus")
    );

    onClick("runWordPdf", async () => {
      const file = $("#wordFile").files[0];
      if (!file) throw new Error("اختر ملف DOCX.");

      if (!window.mammoth) throw new Error("مكتبة Word غير متاحة.");

      const buffer = await file.arrayBuffer();
      const converted = await window.mammoth.extractRawText({ arrayBuffer: buffer });
      const JsPDF = getJsPDF();

      const pdf = new JsPDF();
      const lines = pdf.splitTextToSize(converted.value || " ");
      let y = 15;

      for (const line of lines) {
        if (y > 275) {
          pdf.addPage();
          y = 15;
        }

        pdf.text(line, 10, y);
        y += 7;
      }

      pdf.save("converted.pdf");
      setResult("wordPdfStatus", "تم إنشاء PDF نصي. راجع التنسيق العربي قبل استخدام الملف.");
    });
    return;
  }

  /* IMAGE TOOLS */

  if ([
    "removeBg", "lightRemove", "compressImg", "resizeImg",
    "convertImg", "watermark", "grayscale", "blurImg",
    "imgBase64", "base64Img", "favicon", "compareImg"
  ].includes(id)) {
    await loadImageTool(id, body);
    return;
  }

  /* TEXT TOOLS */

  if (id === "wordCounter" || id === "charCounter") {
    body.innerHTML = box(
      textInput("counterText", "النص", "اكتب النص هنا...") +
      `<div class="tool-grid">
        <div class="result">الكلمات <div class="result-value" id="countWords">0</div></div>
        <div class="result">الأحرف <div class="result-value" id="countChars">0</div></div>
        <div class="result">الأحرف دون مسافات <div class="result-value" id="countNoSpaces">0</div></div>
        <div class="result">الأسطر <div class="result-value" id="countLines">0</div></div>
      </div>`
    );

    const update = () => {
      const text = value("counterText");
      $("#countWords").textContent = text.trim() ? text.trim().split(/\s+/u).length : 0;
      $("#countChars").textContent = text.length;
      $("#countNoSpaces").textContent = [...text].filter(c => !/\s/u.test(c)).length;
      $("#countLines").textContent = text ? text.split(/\r\n|\r|\n/).length : 0;
    };

    listen("counterText", "input", update);
    return;
  }

  if (id === "caseConv") {
    body.innerHTML = box(
      textInput("caseText") +
      buttons(
        button("caseUpper", "أحرف كبيرة") +
        button("caseLower", "أحرف صغيرة") +
        button("caseTitle", "بداية كل كلمة") +
        button("caseCopy", "نسخ", true)
      )
    );

    onClick("caseUpper", () => $("#caseText").value = value("caseText").toUpperCase());
    onClick("caseLower", () => $("#caseText").value = value("caseText").toLowerCase());
    onClick("caseTitle", () => {
      $("#caseText").value = value("caseText").toLowerCase().replace(/\b\p{L}/gu, c => c.toUpperCase());
    });
    onClick("caseCopy", () => copyText(value("caseText")));
    return;
  }

  if (id === "tashkeel") {
    body.innerHTML = box(
      textInput("tashText", "النص العربي") +
      button("runTash", "إزالة التشكيل") +
      result("tashResult") +
      button("copyTash", "نسخ النتيجة", true)
    );

    onClick("runTash", () => {
      setResult("tashResult", value("tashText").replace(/[\u0610-\u061A\u064B-\u065F\u0670\u06D6-\u06ED]/g, ""));
    });
    onClick("copyTash", () => copyText($("#tashResult").textContent));
    return;
  }

  if (id === "reverseText") {
    body.innerHTML = box(
      textInput("reverseInput") +
      button("runReverse", "قلب النص") +
      result("reverseResult")
    );

    onClick("runReverse", () => {
      setResult("reverseResult", [...value("reverseInput")].reverse().join(""));
    });
    return;
  }

  if (id === "slug") {
    body.innerHTML = box(
      field("slugInput", "النص", "text", "عنوان المقال") +
      button("runSlug", "إنشاء Slug") +
      result("slugResult") +
      button("copySlug", "نسخ", true)
    );

    onClick("runSlug", () => {
      const slug = value("slugInput")
        .trim()
        .toLowerCase()
        .normalize("NFKC")
        .replace(/[^\p{L}\p{N}]+/gu, "-")
        .replace(/^-+|-+$/g, "");

      setResult("slugResult", slug);
    });

    onClick("copySlug", () => copyText($("#slugResult").textContent));
    return;
  }

  if (id === "lorem") {
    body.innerHTML = box(
      field("loremCount", "عدد الفقرات", "number", "", "3") +
      button("runLorem", "توليد النص") +
      result("loremResult") +
      button("downloadLorem", "تحميل TXT", true)
    );

    const lorem = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";

    onClick("runLorem", () => {
      const count = requireNumber("loremCount", "عدد الفقرات", 1, 50);
      setResult("loremResult", Array.from({ length: count }, () => lorem).join("\n\n"));
    });

    onClick("downloadLorem", () => downloadText($("#loremResult").textContent, "lorem.txt"));
    return;
  }

  if (id === "hashtag") {
    body.innerHTML = box(
      textInput("hashInput", "موضوع المنشور") +
      button("runHashtag", "إنشاء هاشتاغ") +
      result("hashtagResult") +
      button("copyHashtag", "نسخ", true)
    );

    onClick("runHashtag", () => {
      const words = value("hashInput").match(/[\p{L}\p{N}_]+/gu) || [];
      const unique = [...new Set(words)].slice(0, 30);
      setResult("hashtagResult", unique.map(word => "#" + word.replace(/\s/g, "")).join(" "));
    });

    onClick("copyHashtag", () => copyText($("#hashtagResult").textContent));
    return;
  }

  if (id === "duplicate" || id === "sortLines") {
    body.innerHTML = box(
      textInput("linesInput", "أدخل سطراً في كل مرة") +
      selectField("lineMode", "طريقة المعالجة", id === "duplicate" ? [
        ["remove", "إزالة الأسطر المكررة"],
        ["keep", "إظهار الأسطر المكررة فقط"]
      ] : [
        ["asc", "ترتيب تصاعدي"],
        ["desc", "ترتيب تنازلي"]
      ]) +
      button("runLines", "تنفيذ") +
      result("linesResult") +
      button("copyLines", "نسخ النتيجة", true)
    );

    onClick("runLines", () => {
      const lines = value("linesInput").split(/\r\n|\r|\n/);
      const mode = value("lineMode");
      let output;

      if (id === "duplicate") {
        const counts = new Map();
        lines.forEach(line => counts.set(line, (counts.get(line) || 0) + 1));

        output = mode === "remove"
          ? [...counts.keys()]
          : lines.filter(line => counts.get(line) > 1);
      } else {
        output = [...lines].sort((a, b) => a.localeCompare(b, "ar"));
        if (mode === "desc") output.reverse();
      }

      setResult("linesResult", output.join("\n"));
    });

    onClick("copyLines", () => copyText($("#linesResult").textContent));
    return;
  }

  if (id === "passwordGen") {
    body.innerHTML = box(
      field("passLength", "طول كلمة المرور", "number", "", "16") +
      `<div class="field">
        <label><input type="checkbox" id="passUpper" checked> أحرف كبيرة</label>
        <label><input type="checkbox" id="passLower" checked> أحرف صغيرة</label>
        <label><input type="checkbox" id="passNumbers" checked> أرقام</label>
        <label><input type="checkbox" id="passSymbols"> رموز</label>
      </div>` +
      button("runPassword", "توليد كلمة المرور") +
      result("passwordResult") +
      button("copyPassword", "نسخ كلمة المرور", true)
    );

    onClick("runPassword", () => {
      const length = requireNumber("passLength", "الطول", 4, 256);
      const password = randomPassword(length, {
        upper: $("#passUpper").checked,
        lower: $("#passLower").checked,
        numbers: $("#passNumbers").checked,
        symbols: $("#passSymbols").checked
      });

      setResult("passwordResult", password);
    });

    onClick("copyPassword", () => copyText($("#passwordResult").textContent));
    return;
  }

  if (id === "emailExtract") {
    body.innerHTML = box(
      textInput("emailText", "النص") +
      button("runEmails", "استخراج الإيميلات") +
      result("emailResult") +
      button("copyEmails", "نسخ", true)
    );

    onClick("runEmails", () => {
      const matches = value("emailText").match(/[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}/gi) || [];
      setResult("emailResult", [...new Set(matches)].join("\n") || "لم يتم العثور على بريد إلكتروني.");
    });

    onClick("copyEmails", () => copyText($("#emailResult").textContent));
    return;
  }

  /* CALCULATORS */

  if (id === "percent") {
    body.innerHTML = box(
      field("percentAmount", "القيمة", "number", "", "100") +
      field("percentRate", "النسبة المئوية", "number", "", "20") +
      button("runPercent", "احسب النسبة") +
      result("percentResult")
    );

    onClick("runPercent", () => {
      const a = requireNumber("percentAmount", "القيمة");
      const b = requireNumber("percentRate", "النسبة");
      setResult("percentResult", (a * b / 100).toLocaleString("fr-MA", { maximumFractionDigits: 4 }));
    });
    return;
  }

  if (id === "bmi") {
    body.innerHTML = box(
      field("bmiHeight", "الطول بالسنتيمتر", "number", "", "170") +
      field("bmiWeight", "الوزن بالكيلوغرام", "number", "", "70") +
      button("runBMI", "حساب BMI") +
      result("bmiResult")
    );

    onClick("runBMI", () => {
      const height = requireNumber("bmiHeight", "الطول", 50, 300) / 100;
      const weight = requireNumber("bmiWeight", "الوزن", 2, 700);
      const bmi = weight / (height * height);

      let label = "ضمن النطاق المعتاد للبالغين";
      if (bmi < 18.5) label = "أقل من النطاق المعتاد";
      else if (bmi >= 25 && bmi < 30) label = "أعلى من النطاق المعتاد";
      else if (bmi >= 30) label = "مرتفع";

      setResult("bmiResult", `BMI: ${bmi.toFixed(2)} — ${label}. مؤشر تقريبي للبالغين وليس تشخيصاً طبياً.`);
    });
    return;
  }

  if (id === "ageCalc" || id === "ageMinutes") {
    body.innerHTML = box(
      field("birthDate", "تاريخ الميلاد", "date") +
      button("runAge", "حساب العمر") +
      result("ageResult")
    );

    onClick("runAge", () => {
      const input = value("birthDate");
      if (!input) throw new Error("أدخل تاريخ الميلاد.");

      const birth = new Date(`${input}T00:00:00`);
      const now = new Date();

      if (Number.isNaN(birth.getTime()) || birth > now) {
        throw new Error("تاريخ الميلاد غير صالح.");
      }

      const milliseconds = now.getTime() - birth.getTime();
      const minutes = Math.floor(milliseconds / 60000);

      let years = now.getFullYear() - birth.getFullYear();
      let months = now.getMonth() - birth.getMonth();
      let days = now.getDate() - birth.getDate();

      if (days < 0) {
        months--;
        const lastMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        days += lastMonth.getDate();
      }

      if (months < 0) {
        years--;
        months += 12;
      }

      const message = id === "ageMinutes"
        ? `عمرك التقريبي بالدقائق: ${minutes.toLocaleString("fr-MA")}`
        : `عمرك: ${years} سنة، ${months} شهر، ${days} يوم.`;

      setResult("ageResult", message);
    });
    return;
  }

  if (id === "tva") {
    body.innerHTML = box(
      field("tvaAmount", "المبلغ دون ضريبة (DH)", "number", "", "1000") +
      field("tvaRate", "نسبة TVA (%)", "number", "", "20") +
      button("runTVA", "حساب الضريبة") +
      result("tvaResult")
    );

    onClick("runTVA", () => {
      const amount = requireNumber("tvaAmount", "المبلغ", 0);
      const rate = requireNumber("tvaRate", "نسبة الضريبة", 0, 1000);
      const tax = amount * rate / 100;

      setResult("tvaResult",
        `المبلغ الأصلي: ${amount.toFixed(2)} DH\nالضريبة: ${tax.toFixed(2)} DH\nالإجمالي: ${(amount + tax).toFixed(2)} DH`
      );
    });
    return;
  }

  if (id === "loan") {
    body.innerHTML = box(
      field("loanAmount", "مبلغ القرض (DH)", "number", "", "300000") +
      field("loanRate", "الفائدة السنوية (%)", "number", "", "5") +
      field("loanYears", "مدة القرض بالسنوات", "number", "", "20") +
      button("runLoan", "حساب القسط") +
      result("loanResult")
    );

    onClick("runLoan", () => {
      const principal = requireNumber("loanAmount", "مبلغ القرض", 0.01);
      const annual = requireNumber("loanRate", "الفائدة", 0, 100);
      const years = requireNumber("loanYears", "المدة", 1, 50);
      const months = years * 12;
      const rate = annual / 1200;

      const payment = rate === 0
        ? principal / months
        : principal * rate / (1 - Math.pow(1 + rate, -months));

      setResult("loanResult",
        `القسط الشهري التقريبي: ${payment.toFixed(2)} DH\nإجمالي الأداء: ${(payment * months).toFixed(2)} DH\nالفوائد: ${(payment * months - principal).toFixed(2)} DH\nلا يشمل الحساب رسوم البنك أو التأمين.`
      );
    });
    return;
  }

  if (id === "discount") {
    body.innerHTML = box(
      field("discountPrice", "الثمن الأصلي (DH)", "number", "", "500") +
      field("discountRate", "نسبة الخصم (%)", "number", "", "20") +
      button("runDiscount", "حساب الخصم") +
      result("discountResult")
    );

    onClick("runDiscount", () => {
      const price = requireNumber("discountPrice", "الثمن", 0);
      const rate = requireNumber("discountRate", "الخصم", 0, 100);
      const discount = price * rate / 100;

      setResult("discountResult",
        `قيمة الخصم: ${discount.toFixed(2)} DH\nالثمن بعد الخصم: ${(price - discount).toFixed(2)} DH`
      );
    });
    return;
  }

  if (id === "bacCalc") {
    body.innerHTML = box(
      field("bacRegional", "الجهوي /20", "number", "", "12") +
      field("bacNational", "الوطني /20", "number", "", "14") +
      field("bacControl", "المراقبة المستمرة /20", "number", "", "15") +
      button("runBac", "حساب المعدل") +
      result("bacResult") +
      `<p class="text-muted">الحساب يستخدم الأوزان الافتراضية 25% جهوي، 50% وطني، 25% مراقبة. تحقق من الأوزان المعتمدة لمسلكك وسنتك الدراسية.</p>`
    );

    onClick("runBac", () => {
      const regional = requireNumber("bacRegional", "الجهوي", 0, 20);
      const national = requireNumber("bacNational", "الوطني", 0, 20);
      const control = requireNumber("bacControl", "المراقبة", 0, 20);

      setResult("bacResult", `المعدل التقديري: ${(regional * 0.25 + national * 0.5 + control * 0.25).toFixed(2)} /20`);
    });
    return;
  }

  if (id === "area") {
    body.innerHTML = box(
      selectField("areaShape", "الشكل", [
        ["rectangle", "مستطيل"],
        ["square", "مربع"],
        ["triangle", "مثلث"],
        ["circle", "دائرة"]
      ]) +
      field("areaA", "الطول أو نصف القطر", "number", "", "5") +
      field("areaB", "العرض أو الارتفاع (إن لزم)", "number", "", "3") +
      button("runArea", "حساب المساحة") +
      result("areaResult")
    );

    const updateFields = () => {
      const shape = value("areaShape");
      const label = $("#areaB").closest(".field");
      label.style.display = shape === "square" || shape === "circle" ? "none" : "";
      $("#areaA").previousElementSibling.textContent =
        shape === "circle" ? "نصف القطر" : shape === "square" ? "طول الضلع" : "الطول أو القاعدة";
    };

    listen("areaShape", "change", updateFields);
    updateFields();

    onClick("runArea", () => {
      const shape = value("areaShape");
      const a = requireNumber("areaA", "القيمة", 0);
      const b = shape === "square" || shape === "circle" ? a : requireNumber("areaB", "القيمة", 0);

      let area;

      if (shape === "rectangle") area = a * b;
      else if (shape === "square") area = a * a;
      else if (shape === "triangle") area = a * b / 2;
      else area = Math.PI * a * a;

      setResult("areaResult", `المساحة: ${area.toFixed(4)} وحدة مربعة.`);
    });
    return;
  }

  /* DEVELOPER TOOLS */

  if (id === "qrGen") {
    body.innerHTML = box(
      field("qrText", "النص أو الرابط", "text", "https://example.com") +
      button("runQR", "إنشاء QR") +
      `<div id="qrOutput" class="preview"></div>` +
      button("downloadQR", "تحميل QR", true)
    );

    onClick("runQR", () => {
      if (!window.QRCode) throw new Error("مكتبة QR غير متاحة.");

      const text = value("qrText").trim();
      if (!text) throw new Error("أدخل نصاً أو رابطاً.");

      const output = $("#qrOutput");
      output.innerHTML = "";

      new QRCode(output, {
        text,
        width: 240,
        height: 240,
        correctLevel: QRCode.CorrectLevel.H
      });
    });

    onClick("downloadQR", () => {
      const canvas = $("#qrOutput canvas");
      const image = $("#qrOutput img");

      if (canvas) downloadDataURL(canvas.toDataURL("image/png"), "qr-code.png");
      else if (image?.src) downloadDataURL(image.src, "qr-code.png");
      else throw new Error("أنشئ QR أولاً.");
    });
    return;
  }

  if (id === "jsonFormat") {
    body.innerHTML = box(
      textInput("jsonInput", "JSON", '{"name":"Aadawati","active":true}') +
      buttons(button("runJSON", "تنسيق JSON") + button("minJSON", "ضغط JSON", true)) +
      result("jsonResult") +
      button("copyJSON", "نسخ النتيجة", true)
    );

    const formatJson = compact => {
      const parsed = JSON.parse(value("jsonInput"));
      setResult("jsonResult", JSON.stringify(parsed, null, compact ? 0 : 2));
    };

    onClick("runJSON", () => {
      try { formatJson(false); }
      catch (error) { throw new Error("JSON غير صالح: " + error.message); }
    });

    onClick("minJSON", () => {
      try { formatJson(true); }
      catch (error) { throw new Error("JSON غير صالح: " + error.message); }
    });

    onClick("copyJSON", () => copyText($("#jsonResult").textContent));
    return;
  }

  if (id === "base64Text") {
    body.innerHTML = box(
      textInput("base64Input", "النص") +
      buttons(button("encodeBase64", "ترميز Base64") + button("decodeBase64", "فك الترميز", true)) +
      result("base64Result") +
      button("copyBase64", "نسخ النتيجة", true)
    );

    onClick("encodeBase64", () => {
      setResult("base64Result", btoa(unescape(encodeURIComponent(value("base64Input")))));
    });

    onClick("decodeBase64", () => {
      try {
        const decoded = decodeURIComponent(escape(atob(value("base64Input").trim())));
        setResult("base64Result", decoded);
      } catch (_) {
        throw new Error("النص ليس Base64 صالحاً أو لا يمثل UTF-8.");
      }
    });

    onClick("copyBase64", () => copyText($("#base64Result").textContent));
    return;
  }

  if (id === "urlEncode") {
    body.innerHTML = box(
      textInput("urlInput", "النص أو الرابط") +
      buttons(button("encodeURL", "تشفير URL") + button("decodeURL", "فك التشفير", true)) +
      result("urlResult") +
      button("copyURL", "نسخ", true)
    );

    onClick("encodeURL", () => setResult("urlResult", encodeURIComponent(value("urlInput"))));

    onClick("decodeURL", () => {
      try { setResult("urlResult", decodeURIComponent(value("urlInput"))); }
      catch (_) { throw new Error("صيغة URL غير صالحة."); }
    });

    onClick("copyURL", () => copyText($("#urlResult").textContent));
    return;
  }

  if (id === "colorConv") {
    body.innerHTML = box(
      field("colorInput", "اختر اللون", "color", "", "#2563eb") +
      field("colorHex", "HEX", "text", "", "#2563eb") +
      result("colorResult")
    );

    const updateColor = source => {
      let hex = value(source).trim();
      if (!hex.startsWith("#")) hex = "#" + hex;

      if (!/^#[0-9a-fA-F]{6}$/.test(hex)) {
        setResult("colorResult", "أدخل لون HEX صحيحاً مثل #2563eb.");
        return;
      }

      const r = parseInt(hex.slice(1, 3), 16);
      const g = parseInt(hex.slice(3, 5), 16);
      const b = parseInt(hex.slice(5, 7), 16);

      $("#colorInput").value = hex;
      $("#colorHex").value = hex;

      setResult("colorResult",
        `RGB: ${r}, ${g}, ${b}\nHSL: ${rgbToHsl(r, g, b).join(", ")}`
      );
    };

    listen("colorInput", "input", () => updateColor("colorInput"));
    listen("colorHex", "input", () => updateColor("colorHex"));
    updateColor("colorHex");
    return;
  }

  if (id === "uuid") {
    body.innerHTML = box(
      button("runUUID", "إنشاء UUID") +
      result("uuidResult") +
      button("copyUUID", "نسخ", true)
    );

    onClick("runUUID", () => {
      const uuid = crypto.randomUUID
        ? crypto.randomUUID()
        : "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, c => {
            const r = randomInt(16);
            return (c === "x" ? r : (r & 3) | 8).toString(16);
          });

      setResult("uuidResult", uuid);
    });

    onClick("copyUUID", () => copyText($("#uuidResult").textContent));
    return;
  }

  if (id === "hashGen") {
    body.innerHTML = box(
      textInput("hashInput", "النص المراد حساب Hash له") +
      selectField("hashAlgorithm", "الخوارزمية", [
        ["SHA-256", "SHA-256"],
        ["SHA-384", "SHA-384"],
        ["SHA-512", "SHA-512"]
      ]) +
      button("runHash", "إنشاء Hash") +
      result("hashResult") +
      button("copyHash", "نسخ", true)
    );

    onClick("runHash", async () => {
      if (!crypto.subtle) throw new Error("Web Crypto يحتاج HTTPS أو localhost.");
      const bytes = new TextEncoder().encode(value("hashInput"));
      const hash = await crypto.subtle.digest(value("hashAlgorithm"), bytes);
      const hex = [...new Uint8Array(hash)].map(b => b.toString(16).padStart(2, "0")).join("");
      setResult("hashResult", hex);
    });

    onClick("copyHash", () => copyText($("#hashResult").textContent));
    return;
  }

  if (id === "regexTest") {
    body.innerHTML = box(
      field("regexPattern", "Regex", "text", "\\d+") +
      field("regexFlags", "Flags", "text", "g") +
      textInput("regexText", "النص المراد اختباره") +
      button("runRegex", "اختبار Regex") +
      result("regexResult")
    );

    onClick("runRegex", () => {
      let regex;

      try {
        regex = new RegExp(value("regexPattern"), value("regexFlags"));
      } catch (error) {
        throw new Error("Regex غير صالح: " + error.message);
      }

      const text = value("regexText");
      const matches = text.match(regex);

      setResult("regexResult",
        matches ? `عدد المطابقات: ${matches.length}\n${matches.join("\n")}` : "لا توجد مطابقات."
      );
    });
    return;
  }

  if (id === "unixTime") {
    body.innerHTML = box(
      field("unixInput", "Unix timestamp (بالثواني)", "number", "", String(Math.floor(Date.now() / 1000))) +
      button("runUnix", "تحويل الوقت") +
      result("unixResult") +
      button("currentUnix", "استعمال الوقت الحالي", true)
    );

    onClick("runUnix", () => {
      const seconds = requireNumber("unixInput", "الوقت");
      const date = new Date(seconds * 1000);

      if (Number.isNaN(date.getTime())) throw new Error("قيمة الوقت خارج النطاق.");

      setResult("unixResult", `UTC: ${date.toISOString()}\nالمحلي: ${date.toLocaleString()}`);
    });

    onClick("currentUnix", () => {
      $("#unixInput").value = Math.floor(Date.now() / 1000);
      $("#runUnix").click();
    });
    return;
  }

  if (id === "barcode") {
    body.innerHTML = box(
      field("barcodeInput", "رقم أو نص", "text", "123456789012") +
      button("runBarcode", "إنشاء باركود") +
      `<div class="preview" id="barcodeOutput"></div>` +
      button("downloadBarcode", "تحميل PNG", true)
    );

    onClick("runBarcode", () => {
      if (!window.JsBarcode) throw new Error("مكتبة الباركود غير متاحة.");

      const text = value("barcodeInput").trim();
      if (!text) throw new Error("أدخل قيمة.");

      const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      $("#barcodeOutput").replaceChildren(svg);

      try {
        JsBarcode(svg, text, { format: "CODE128", displayValue: true });
      } catch (_) {
        throw new Error("تعذر إنشاء الباركود لهذه القيمة.");
      }
    });

    onClick("downloadBarcode", async () => {
      const svg = $("#barcodeOutput svg");
      if (!svg) throw new Error("أنشئ الباركود أولاً.");

      const xml = new XMLSerializer().serializeToString(svg);
      const image = new Image();
      const url = URL.createObjectURL(new Blob([xml], { type: "image/svg+xml" }));

      image.onload = () => {
        const canvas = makeCanvas(image.width || 400, image.height || 150);
        canvas.getContext("2d").drawImage(image, 0, 0);
        URL.revokeObjectURL(url);
        downloadCanvas(canvas, "barcode.png");
      };

      image.onerror = () => {
        URL.revokeObjectURL(url);
        setStatus("تعذر تحويل الباركود إلى PNG.", "error");
      };

      image.src = url;
    });
    return;
  }

  /* CV GENERATOR */

  if (id === "cvGen") {
    body.innerHTML = box(
      field("cvName", "الاسم الكامل", "text", "اسمك الكامل") +
      field("cvJob", "الوظيفة المطلوبة", "text", "مثلاً: سائق") +
      field("cvPhone", "الهاتف", "tel", "06XXXXXXXX") +
      field("cvEmail", "البريد الإلكتروني", "email", "name@example.com") +
      field("cvCity", "المدينة", "text", "الدار البيضاء") +
      textInput("cvSummary", "نبذة مهنية") +
      textInput("cvExperience", "الخبرة المهنية", "اكتب كل تجربة في سطر") +
      textInput("cvEducation", "التعليم والشهادات", "اكتب كل شهادة في سطر") +
      field("cvLanguages", "اللغات", "text", "العربية، الفرنسية...") +
      button("runCV", "إنشاء السيرة الذاتية") +
      result("cvResult") +
      buttons(button("downloadCV", "تحميل TXT") + button("printCV", "طباعة أو حفظ PDF", true))
    );

    const makeCV = () => {
      const name = value("cvName").trim();
      if (!name) throw new Error("أدخل الاسم الكامل.");

      return [
        name,
        value("cvJob"),
        "",
        `الهاتف: ${value("cvPhone")}`,
        `البريد الإلكتروني: ${value("cvEmail")}`,
        `المدينة: ${value("cvCity")}`,
        "",
        "نبذة مهنية",
        value("cvSummary"),
        "",
        "الخبرة المهنية",
        value("cvExperience"),
        "",
        "التعليم والشهادات",
        value("cvEducation"),
        "",
        "اللغات",
        value("cvLanguages")
      ].join("\n");
    };

    onClick("runCV", () => setResult("cvResult", makeCV()));
    onClick("downloadCV", () => downloadText(makeCV(), "cv.txt"));

    onClick("printCV", () => {
      const cv = makeCV();
      const popup = window.open("", "_blank");

      if (!popup) throw new Error("السماح بالنافذة المنبثقة ضروري للطباعة.");

      popup.document.write(`
        <!doctype html><html lang="ar" dir="rtl"><head>
        <meta charset="utf-8"><title>السيرة الذاتية</title>
        <style>body{font-family:Arial,sans-serif;padding:35px;white-space:pre-wrap;line-height:1.9}</style>
        </head><body>${escapeHTML(cv)}<script>window.onload=()=>window.print();<\/script></body></html>
      `);

      popup.document.close();
    });
    return;
  }

  /* INVOICE GENERATOR */

  if (id === "invoiceGen") {
    body.innerHTML = box(
      field("invoiceSeller", "اسم البائع أو الشركة", "text", "اسم الشركة") +
      field("invoiceBuyer", "الزبون", "text", "اسم الزبون") +
      field("invoiceNumber", "رقم الفاتورة", "text", "INV-001") +
      field("invoiceDate", "التاريخ", "date", "", new Date().toISOString().slice(0, 10)) +
      field("invoiceItem", "وصف السلعة أو الخدمة", "text", "خدمة") +
      field("invoiceQty", "الكمية", "number", "", "1") +
      field("invoicePrice", "ثمن الوحدة (DH)", "number", "", "100") +
      field("invoiceTax", "TVA (%)", "number", "", "20") +
      button("runInvoice", "إنشاء الفاتورة") +
      result("invoiceResult") +
      buttons(button("downloadInvoice", "تحميل TXT") + button("printInvoice", "طباعة أو PDF", true))
    );

    const makeInvoice = () => {
      const seller = value("invoiceSeller").trim();
      const buyer = value("invoiceBuyer").trim();
      if (!seller || !buyer) throw new Error("أدخل اسم البائع والزبون.");

      const qty = requireNumber("invoiceQty", "الكمية", 0.01);
      const price = requireNumber("invoicePrice", "ثمن الوحدة", 0);
      const taxRate = requireNumber("invoiceTax", "TVA", 0, 100);

      const subtotal = qty * price;
      const tax = subtotal * taxRate / 100;
      const total = subtotal + tax;

      return [
        "FACTURE / فاتورة",
        `رقم الفاتورة: ${value("invoiceNumber")}`,
        `التاريخ: ${value("invoiceDate")}`,
        `البائع: ${seller}`,
        `الزبون: ${buyer}`,
        `الوصف: ${value("invoiceItem")}`,
        `الكمية: ${qty}`,
        `ثمن الوحدة: ${price.toFixed(2)} DH`,
        `المجموع دون ضريبة: ${subtotal.toFixed(2)} DH`,
        `TVA (${taxRate}%): ${tax.toFixed(2)} DH`,
        `الإجمالي: ${total.toFixed(2)} DH`,
        "",
        "مسودة فاتورة: تحقق من البيانات والالتزامات القانونية قبل اعتمادها."
      ].join("\n");
    };

    onClick("runInvoice", () => setResult("invoiceResult", makeInvoice()));
    onClick("downloadInvoice", () => downloadText(makeInvoice(), "invoice.txt"));

    onClick("printInvoice", () => {
      const popup = window.open("", "_blank");
      if (!popup) throw new Error("السماح بالنافذة المنبثقة ضروري للطباعة.");

      popup.document.write(`
        <!doctype html><html lang="ar" dir="rtl"><head>
        <meta charset="utf-8"><title>فاتورة</title>
        <style>body{font-family:Arial,sans-serif;padding:35px;white-space:pre-wrap;line-height:2}</style>
        </head><body>${escapeHTML(makeInvoice())}<script>window.onload=()=>window.print();<\/script></body></html>
      `);

      popup.document.close();
    });
    return;
  }

  /* PASSWORD STRENGTH */

  if (id === "passStrength") {
    body.innerHTML = box(
      field("strengthInput", "كلمة المرور", "text", "اكتب كلمة المرور") +
      result("strengthResult")
    );

    const updateStrength = () => {
      const password = value("strengthInput");
      let score = 0;

      if (password.length >= 8) score++;
      if (password.length >= 12) score++;
      if (/[a-z]/.test(password)) score++;
      if (/[A-Z]/.test(password)) score++;
      if (/\d/.test(password)) score++;
      if (/[^a-zA-Z0-9]/.test(password)) score++;

      const level = password.length < 1 ? "أدخل كلمة مرور"
        : score <= 2 ? "ضعيفة"
        : score <= 4 ? "متوسطة"
        : "قوية نسبياً";

      setResult("strengthResult",
        `${level}\nالطول: ${password.length} حرفاً\nنصيحة: استعمل كلمة مرور طويلة وفريدة. هذا التقييم تقريبي ولا يضمن الأمان.`
      );
    };

    listen("strengthInput", "input", updateStrength);
    return;
  }

  throw new Error("هذه الأداة لم تتم برمجتها بعد.");
}

/* -------------------- Image tool implementations -------------------- */

async function loadImageTool(id, body) {
  if (id === "imgBase64") {
    body.innerHTML = box(
      filePicker("base64ImageFile", "image/*") +
      button("runImgBase64", "تحويل الصورة إلى Base64") +
      `<div class="field"><label for="imageBase64Result">Base64</label><textarea id="imageBase64Result"></textarea></div>` +
      button("copyImageBase64", "نسخ", true)
    );

    onClick("runImgBase64", async () => {
      const file = $("#base64ImageFile").files[0];
      if (!file) throw new Error("اختر صورة.");

      if (file.size > 5 * 1024 * 1024) {
        throw new Error("اختر صورة أصغر من 5 MB لتجنب استهلاك الذاكرة.");
      }

      $("#imageBase64Result").value = await readFileAsDataURL(file);
    });

    onClick("copyImageBase64", () => copyText(value("imageBase64Result")));
    return;
  }

  if (id === "base64Img") {
    body.innerHTML = box(
      textareaField("base64ImageInput", "Base64 أو Data URL", "الصق بيانات الصورة هنا...") +
      button("runBase64Img", "عرض الصورة") +
      `<div class="preview" id="base64ImagePreview"></div>` +
      button("downloadBase64Img", "تحميل الصورة", true)
    );

    onClick("runBase64Img", () => {
      const input = value("base64ImageInput").trim();
      if (!input) throw new Error("الصق بيانات الصورة.");

      const dataURL = input.startsWith("data:image/")
        ? input
        : "data:image/png;base64," + input.replace(/\s/g, "");

      if (!/^data:image\/(png|jpeg|jpg|webp|gif);base64,[A-Za-z0-9+/=\s]+$/i.test(dataURL)) {
        throw new Error("صيغة Base64 للصورة غير صالحة.");
      }

      const image = new Image();
      image.onload = () => {
        $("#base64ImagePreview").replaceChildren(image);
      };
      image.onerror = () => setStatus("تعذر فتح بيانات الصورة.", "error");
      image.src = dataURL;
    });

    onClick("downloadBase64Img", () => {
      const image = $("#base64ImagePreview img");
      if (!image) throw new Error("اعرض الصورة أولاً.");
      downloadDataURL(image.src, "base64-image.png");
    });
    return;
  }

  if (id === "compareImg") {
    body.innerHTML = box(
      filePicker("compareImageA", "image/*") +
      filePicker("compareImageB", "image/*") +
      button("runCompareImages", "مقارنة الصورتين") +
      `<div class="tool-grid" id="comparePreview"></div>` +
      result("compareResult")
    );

    onClick("runCompareImages", async () => {
      const a = $("#compareImageA").files[0];
      const b = $("#compareImageB").files[0];

      if (!a || !b) throw new Error("اختر الصورتين.");

      const [imgA, imgB] = await Promise.all([readImage(a), readImage(b)]);
      const preview = $("#comparePreview");
      preview.innerHTML = "";

      for (const [image, label] of [[imgA, "الصورة الأولى"], [imgB, "الصورة الثانية"]]) {
        const card = document.createElement("div");
        card.className = "preview-card";
        const title = document.createElement("b");
        title.textContent = label;
        const picture = document.createElement("img");
        picture.src = image.src;
        picture.alt = label;
        card.append(title, picture);
        preview.appendChild(card);
      }

      setResult("compareResult",
        `الأولى: ${imgA.naturalWidth}×${imgA.naturalHeight}\nالثانية: ${imgB.naturalWidth}×${imgB.naturalHeight}\nالمقارنة البصرية متاحة أعلاه.`
      );
    });
    return;
  }

  if (id === "favicon") {
    body.innerHTML = box(
      filePicker("faviconFile", "image/*") +
      button("runFavicon", "إنشاء Favicon") +
      `<div class="preview" id="faviconPreview"></div>` +
      button("downloadFavicon", "تحميل PNG", true)
    );

    onClick("runFavicon", async () => {
      const file = $("#faviconFile").files[0];
      if (!file) throw new Error("اختر صورة.");

      const img = await readImage(file);
      const canvas = makeCanvas(64, 64);
      const ctx = canvas.getContext("2d");

      const side = Math.min(img.naturalWidth, img.naturalHeight);
      const sx = (img.naturalWidth - side) / 2;
      const sy = (img.naturalHeight - side) / 2;

      ctx.drawImage(img, sx, sy, side, side, 0, 0, 64, 64);
      previewImage($("#faviconPreview"), canvas.toDataURL("image/png"));
      $("#faviconPreview").dataset.data = canvas.toDataURL("image/png");
    });

    onClick("downloadFavicon", () => {
      const data = $("#faviconPreview").dataset.data;
      if (!data) throw new Error("أنشئ الأيقونة أولاً.");
      downloadDataURL(data, "favicon.png");
    });
    return;
  }

  if (id === "compressImg" || id === "resizeImg" || id === "convertImg" ||
      id === "watermark" || id === "grayscale" || id === "blurImg" ||
      id === "removeBg" || id === "lightRemove") {

    body.innerHTML = box(
      filePicker("imageInput", "image/*") +
      (id === "compressImg"
        ? `<div class="field"><label for="imageQuality">الجودة: <span id="qualityLabel">75%</span></label><input id="imageQuality" type="range" min="10" max="100" value="75"></div>`
        : "") +
      (id === "resizeImg"
        ? field("resizeWidth", "العرض بالبكسل", "number", "", "800") +
          field("resizeHeight", "الارتفاع بالبكسل", "number", "", "600") +
          `<label><input type="checkbox" id="keepRatio" checked> الحفاظ على النسبة</label>`
        : "") +
      (id === "convertImg"
        ? selectField("convertFormat", "الصيغة الناتجة", [
            ["image/png", "PNG"],
            ["image/jpeg", "JPG"],
            ["image/webp", "WebP"]
          ])
        : "") +
      (id === "watermark"
        ? field("watermarkText", "نص العلامة المائية", "text", "Aadawati") +
          field("watermarkSize", "حجم النص", "number", "", "32")
        : "") +
      (id === "blurImg"
        ? `<div class="field"><label for="blurAmount">قوة التشويش</label><input id="blurAmount" type="range" min="1" max="20" value="5"></div>`
        : "") +
      (id === "removeBg"
        ? `<p class="text-muted">إزالة تقريبية للخلفية البيضاء أو شبه البيضاء. ليست إزالة ذكية للخلفيات المعقدة.</p>` +
          `<div class="field"><label for="bgThreshold">قوة إزالة الأبيض</label><input id="bgThreshold" type="range" min="5" max="100" value="30"></div>`
        : "") +
      (id === "lightRemove"
        ? `<p class="text-muted">تقليل المناطق شديدة السطوع. هذه معالجة بسيطة وليست إزالة احترافية للأضواء السينمائية.</p>` +
          `<div class="field"><label for="lightThreshold">حد السطوع</label><input id="lightThreshold" type="range" min="180" max="255" value="245"></div>`
        : "") +
      button("runImageTool", "تنفيذ المعالجة") +
      `<div class="preview" id="imagePreview"></div>` +
      buttons(button("downloadImage", "تحميل النتيجة") + button("resetImage", "إعادة ضبط", true)) +
      result("imageStatus")
    );

    let original = null;
    let output = null;

    if (id === "compressImg") {
      listen("imageQuality", "input", () => {
        $("#qualityLabel").textContent = value("imageQuality") + "%";
      });
    }

    listen("imageInput", "change", async () => {
      const file = $("#imageInput").files[0];
      if (!file) return;

      original = await readImage(file);
      output = null;
      setResult("imageStatus", `الصورة الأصلية: ${original.naturalWidth}×${original.naturalHeight}`);
      previewImage($("#imagePreview"), original.src);
    });

    onClick("resetImage", () => {
      if (!original) throw new Error("اختر صورة أولاً.");
      output = null;
      previewImage($("#imagePreview"), original.src);
      setResult("imageStatus", "تمت إعادة الصورة الأصلية.");
    });

    onClick("runImageTool", async () => {
      if (!original) throw new Error("اختر صورة أولاً.");

      const width = original.naturalWidth;
      const height = original.naturalHeight;
      const canvas = makeCanvas(width, height);
      const ctx = canvas.getContext("2d", { willReadFrequently: true });

      if (id === "resizeImg") {
        let newWidth = requireNumber("resizeWidth", "العرض", 1, 12000);
        let newHeight = requireNumber("resizeHeight", "الارتفاع", 1, 12000);

        if ($("#keepRatio").checked) {
          const ratio = width / height;
          if (newWidth / newHeight > ratio) newWidth = Math.round(newHeight * ratio);
          else newHeight = Math.round(newWidth / ratio);
        }

        const resized = makeCanvas(newWidth, newHeight);
        resized.getContext("2d").drawImage(original, 0, 0, newWidth, newHeight);
        output = resized;
      } else {
        ctx.drawImage(original, 0, 0);

        if (id === "watermark") {
          const text = value("watermarkText").trim();
          if (!text) throw new Error("أدخل نص العلامة المائية.");

          const fontSize = requireNumber("watermarkSize", "حجم النص", 8, 400);
          ctx.font = `bold ${fontSize}px sans-serif`;
          ctx.fillStyle = "rgba(255,255,255,0.8)";
          ctx.strokeStyle = "rgba(0,0,0,0.6)";
          ctx.lineWidth = Math.max(1, fontSize / 16);
          ctx.textAlign = "end";
          ctx.textBaseline = "bottom";
          ctx.strokeText(text, width - 20, height - 20);
          ctx.fillText(text, width - 20, height - 20);
        }

        if (id === "grayscale") {
          const imageData = ctx.getImageData(0, 0, width, height);
          const data = imageData.data;

          for (let i = 0; i < data.length; i += 4) {
            const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
            data[i] = data[i + 1] = data[i + 2] = gray;
          }

          ctx.putImageData(imageData, 0, 0);
        }

        if (id === "blurImg") {
          const amount = requireNumber("blurAmount", "قوة التشويش", 1, 20);
          const blurred = makeCanvas(width, height);
          const blurCtx = blurred.getContext("2d");
          blurCtx.filter = `blur(${amount}px)`;
          blurCtx.drawImage(original, 0, 0);
          output = blurred;
        }

        if (id === "removeBg") {
          const threshold = requireNumber("bgThreshold", "قوة إزالة الأبيض", 5, 100);
          const imageData = ctx.getImageData(0, 0, width, height);
          const data = imageData.data;

          for (let i = 0; i < data.length; i += 4) {
            if (data[i] > 255 - threshold &&
                data[i + 1] > 255 - threshold &&
                data[i + 2] > 255 - threshold) {
              data[i + 3] = 0;
            }
          }

          ctx.putImageData(imageData, 0, 0);
        }

        if (id === "lightRemove") {
          const threshold = requireNumber("lightThreshold", "حد السطوع", 180, 255);
          const imageData = ctx.getImageData(0, 0, width, height);
          const data = imageData.data;

          for (let i = 0; i < data.length; i += 4) {
            const brightness = (data[i] + data[i + 1] + data[i + 2]) / 3;

            if (brightness > threshold) {
              const factor = threshold / brightness;
              data[i] *= factor;
              data[i + 1] *= factor;
              data[i + 2] *= factor;
            }
          }

          ctx.putImageData(imageData, 0, 0);
        }

        if (id === "blurImg" || id === "resizeImg") {
          // These outputs are handled separately.
        } else {
          output = canvas;
        }
      }

      if (id === "compressImg" || id === "convertImg") {
        const type = id === "compressImg" ? "image/jpeg" : value("convertFormat");
        const quality = id === "compressImg" ? numberValue("imageQuality") / 100 : 0.9;
        const blob = await canvasToBlob(output || canvas, type, quality);
        const url = URL.createObjectURL(blob);
        currentObjectUrls.push(url);
        previewImage($("#imagePreview"), url);
        setResult("imageStatus", `الحجم الناتج: ${(blob.size / 1024).toFixed(1)} KB`);
        return;
      }

      if (!output) output = canvas;
      previewImage($("#imagePreview"), output.toDataURL("image/png"));
      setResult("imageStatus", "تمت المعالجة بنجاح.");
    });

    onClick("downloadImage", () => {
      if (!output) throw new Error("نفّذ المعالجة أولاً.");

      if (id === "compressImg") {
        downloadCanvas(output, "compressed.jpg", "image/jpeg", numberValue("imageQuality") / 100);
      } else if (id === "convertImg") {
        const type = value("convertFormat");
        const ext = type === "image/jpeg" ? "jpg" : type.split("/")[1];
        downloadCanvas(output, `converted.${ext}`, type);
      } else {
        downloadCanvas(output, id === "favicon" ? "favicon.png" : "aadawati-image.png");
      }
    });

    return;
  }
}

/* -------------------- Color helper -------------------- */

function rgbToHsl(r, g, b) {
  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0;
  const l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);

    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      default: h = (r - g) / d + 4;
    }

    h /= 6;
  }

  return [
    Math.round(h * 360),
    Math.round(s * 100) + "%",
    Math.round(l * 100) + "%"
  ];
}

/* -------------------- Safe error reporting -------------------- */

document.addEventListener("click", async event => {
  const buttonElement = event.target.closest("button");

  if (!buttonElement || !viewEl.contains(buttonElement)) return;
  if (buttonElement.id === "backButton") return;

  const toolButtons = [
    "runImgToPdf", "runPdfMerge", "runPdfSplit", "runPdfRotate",
    "runCompressPdf", "runProtectPdf", "runPdfText", "runWordPdf",
    "runImgBase64", "runBase64Img", "runCompareImages", "runFavicon",
    "runImageTool", "runTash", "runReverse", "runSlug", "runLorem",
    "runHashtag", "runLines", "runPassword", "runEmails", "runPercent",
    "runBMI", "runAge", "runTVA", "runLoan", "runDiscount", "runBac",
    "runArea", "runQR", "runJSON", "minJSON", "encodeBase64",
    "decodeBase64", "encodeURL", "decodeURL", "runUUID", "runHash",
    "runRegex", "runUnix", "runBarcode", "runCV", "downloadCV",
    "printCV", "runInvoice", "downloadInvoice", "printInvoice"
  ];

  if (!toolButtons.includes(buttonElement.id)) return;

  // Let the tool's own handler finish; this listener is only a fallback.
}, true);

/* -------------------- Start -------------------- */

initialize();