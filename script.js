const works = [
  { src: "assets/art/building.jpg", titleKey: "work_building", year: "2026" },
  { src: "assets/art/work-02.jpg", titleKey: "work_children", year: "2026" },
  { src: "assets/art/work-04.jpg", titleKey: "work_n", year: "2026" },
  { src: "assets/art/work-05.jpg", titleKey: "work_n", year: "2026" },
  { src: "assets/art/work-07.jpg", titleKey: "work_n", year: "2026" },
  { src: "assets/art/work-08.jpg", titleKey: "work_n", year: "2026" },
  { src: "assets/art/work-09.jpg", titleKey: "work_n", year: "2026" },
  { src: "assets/art/work-10.jpg", titleKey: "work_n", year: "2026" },
  { src: "assets/art/work-11.jpg", titleKey: "work_n", year: "2026" },
  { src: "assets/art/work-12.jpg", titleKey: "work_n", year: "2026" },
];

const i18n = {
  ru: {
    brand: "Гарягды",
    nav_portfolio: "Портфолио",
    nav_author: "Гарягды",
    author_lead: "Художник",
    socials_label: "Соцсети",
    socials_soon: "скоро",
    work_building: "Здание",
    work_children: "С детьми",
    work_n: "Работа",
    title: "Гарягды — Портфолио",
  },
  en: {
    brand: "Garyagdy",
    nav_portfolio: "Projects",
    nav_author: "Garyagdy",
    author_lead: "Artist",
    socials_label: "Social",
    socials_soon: "coming soon",
    work_building: "Building",
    work_children: "With children",
    work_n: "Work",
    title: "Garyagdy — Portfolio",
  },
  az: {
    brand: "Qaryağdı",
    nav_portfolio: "Layihələr",
    nav_author: "Qaryağdı",
    author_lead: "Rəssam",
    socials_label: "Sosial şəbəkələr",
    socials_soon: "tezliklə",
    work_building: "Bina",
    work_children: "Uşaqlarla",
    work_n: "İş",
    title: "Qaryağdı — Portfolio",
  },
};

const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

let lang = localStorage.getItem("garyagdy-lang") || "ru";
if (!i18n[lang]) lang = "ru";

let activeIndex = 0;

function titleFor(work, index) {
  const t = i18n[lang];
  if (work.titleKey === "work_n") return `${t.work_n} ${index + 1}`;
  return t[work.titleKey] || t.work_n;
}

function applyLang(next) {
  lang = next;
  localStorage.setItem("garyagdy-lang", lang);
  document.documentElement.lang = lang;
  document.title = i18n[lang].title;

  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (i18n[lang][key] != null) el.textContent = i18n[lang][key];
  });

  document.querySelectorAll(".lang-btn").forEach((btn) => {
    btn.classList.toggle("is-active", btn.dataset.lang === lang);
  });

  renderGrid();
}

document.querySelectorAll(".lang-btn").forEach((btn) => {
  btn.addEventListener("click", () => applyLang(btn.dataset.lang));
});

const grid = document.getElementById("projectsGrid");

function renderGrid() {
  if (!grid) return;
  grid.innerHTML = "";

  works.forEach((work, index) => {
    const card = document.createElement("button");
    card.type = "button";
    card.className = "project-card";
    card.setAttribute("aria-label", titleFor(work, index));

    const thumb = document.createElement("div");
    thumb.className = "project-thumb";
    const img = document.createElement("img");
    img.src = work.src;
    img.alt = "";
    img.loading = index < 3 ? "eager" : "lazy";
    img.decoding = "async";
    thumb.appendChild(img);

    const meta = document.createElement("div");
    meta.className = "project-meta";
    const title = document.createElement("span");
    title.className = "project-title";
    title.textContent = titleFor(work, index);
    const year = document.createElement("span");
    year.className = "project-year";
    year.textContent = work.year;
    meta.append(title, year);

    card.append(thumb, meta);
    card.addEventListener("click", () => openLightbox(index));
    grid.appendChild(card);
  });
}

/* Always start at the top */
if ("scrollRestoration" in history) history.scrollRestoration = "manual";
window.scrollTo(0, 0);
window.addEventListener("load", () => window.scrollTo(0, 0));

applyLang(lang);

/* Mobile menu */
const menuBtn = document.getElementById("menuBtn");
const nav = document.getElementById("nav");

menuBtn?.addEventListener("click", () => {
  const open = nav.classList.toggle("is-open");
  menuBtn.setAttribute("aria-expanded", String(open));
});

nav?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    nav.classList.remove("is-open");
    menuBtn?.setAttribute("aria-expanded", "false");
  });
});

const sections = ["projects", "author"]
  .map((id) => document.getElementById(id))
  .filter(Boolean);

function updateActiveNav() {
  const y = window.scrollY + 140;
  let current = "";
  sections.forEach((sec) => {
    if (sec.offsetTop <= y) current = sec.id;
  });
  document.querySelectorAll(".nav a").forEach((a) => {
    a.classList.toggle("is-active", a.getAttribute("href") === `#${current}`);
  });
}

window.addEventListener("scroll", updateActiveNav, { passive: true });
updateActiveNav();

/* Lightbox */
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");

function openLightbox(index) {
  activeIndex = (index + works.length) % works.length;
  const work = works[activeIndex];
  lightboxImg.src = work.src;
  lightboxImg.alt = titleFor(work, activeIndex);
  lightbox.hidden = false;
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  lightbox.hidden = true;
  document.body.style.overflow = "";
  lightboxImg.src = "";
}

function lightboxStep(delta) {
  openLightbox(activeIndex + delta);
}

document.getElementById("lightboxClose")?.addEventListener("click", closeLightbox);
document.getElementById("lightboxPrev")?.addEventListener("click", () => lightboxStep(-1));
document.getElementById("lightboxNext")?.addEventListener("click", () => lightboxStep(1));

lightbox?.addEventListener("click", (e) => {
  if (e.target === lightbox) closeLightbox();
});

document.addEventListener("keydown", (e) => {
  if (lightbox.hidden) return;
  if (e.key === "Escape") closeLightbox();
  if (e.key === "ArrowLeft") lightboxStep(-1);
  if (e.key === "ArrowRight") lightboxStep(1);
});

bindSwipe(lightbox, (dir) => {
  if (!lightbox.hidden) lightboxStep(dir);
});

function bindSwipe(el, onSwipe) {
  if (!el) return;
  let x0 = null;
  let y0 = null;

  el.addEventListener(
    "touchstart",
    (e) => {
      x0 = e.changedTouches[0].screenX;
      y0 = e.changedTouches[0].screenY;
    },
    { passive: true }
  );

  el.addEventListener(
    "touchend",
    (e) => {
      if (x0 == null) return;
      const dx = e.changedTouches[0].screenX - x0;
      const dy = e.changedTouches[0].screenY - y0;
      if (Math.abs(dx) > 45 && Math.abs(dx) > Math.abs(dy)) {
        onSwipe(dx < 0 ? 1 : -1);
      }
      x0 = null;
      y0 = null;
    },
    { passive: true }
  );
}
