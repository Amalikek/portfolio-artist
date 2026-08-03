const works = [
  { src: "assets/art/work-02.png", altKey: "work_children" },
  { src: "assets/art/work-04.png", altKey: "work_n" },
  { src: "assets/art/work-05.png", altKey: "work_n" },
  { src: "assets/art/work-07.png", altKey: "work_n" },
  { src: "assets/art/work-08.png", altKey: "work_n" },
  { src: "assets/art/work-09.png", altKey: "work_n" },
  { src: "assets/art/work-10.png", altKey: "work_n" },
  { src: "assets/art/work-11.png", altKey: "work_n" },
  { src: "assets/art/work-12.png", altKey: "work_n" },
];

const i18n = {
  ru: {
    brand: "Гарягды",
    nav_portfolio: "Портфолио",
    nav_author: "Гарягды",
    portfolio_title: "Портфолио",
    author_title: "Гарягды",
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
    nav_portfolio: "Portfolio",
    nav_author: "Garyagdy",
    portfolio_title: "Portfolio",
    author_title: "Garyagdy",
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
    nav_portfolio: "Portfolio",
    nav_author: "Qaryağdı",
    portfolio_title: "Portfolio",
    author_title: "Qaryağdı",
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

let slideIndex = 0;

function altFor(work, index) {
  const t = i18n[lang];
  if (work.altKey === "work_n") return `${t.work_n} ${index + 1}`;
  return t[work.altKey] || t.work_n;
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

  renderSlide(slideIndex, false);
}

document.querySelectorAll(".lang-btn").forEach((btn) => {
  btn.addEventListener("click", () => applyLang(btn.dataset.lang));
});

/* ——— Slider ——— */
const slideImg = document.getElementById("slideImg");
const slideStage = document.getElementById("sliderStage");
const slideCurrent = document.getElementById("slideCurrent");
const slideTotal = document.getElementById("slideTotal");
const thumbs = document.getElementById("thumbs");
const heroImg = document.getElementById("heroImg");

slideTotal.textContent = String(works.length);

works.forEach((work, index) => {
  const btn = document.createElement("button");
  btn.type = "button";
  btn.className = "thumb";
  btn.dataset.index = String(index);
  btn.setAttribute("aria-label", `Work ${index + 1}`);
  const img = document.createElement("img");
  img.src = work.src;
  img.alt = "";
  img.loading = "lazy";
  btn.appendChild(img);
  btn.addEventListener("click", () => goTo(index));
  thumbs.appendChild(btn);
});

function renderSlide(index, animate = true) {
  slideIndex = (index + works.length) % works.length;
  const work = works[slideIndex];

  if (animate) slideStage.classList.add("is-fading");

  const apply = () => {
    slideImg.src = work.src;
    slideImg.alt = altFor(work, slideIndex);
    slideCurrent.textContent = String(slideIndex + 1);
    slideStage.classList.remove("is-fading");

    document.querySelectorAll(".thumb").forEach((el, i) => {
      el.classList.toggle("is-active", i === slideIndex);
    });

    const activeThumb = thumbs.querySelector(".thumb.is-active");
    activeThumb?.scrollIntoView({ behavior: "smooth", inline: "center", block: "nearest" });
  };

  if (animate) {
    window.setTimeout(apply, 120);
  } else {
    apply();
  }

  if (heroImg) heroImg.alt = i18n[lang].work_building || "";
}

function goTo(index) {
  renderSlide(index, true);
}

function step(delta) {
  goTo(slideIndex + delta);
}

document.getElementById("slidePrev")?.addEventListener("click", () => step(-1));
document.getElementById("slideNext")?.addEventListener("click", () => step(1));

slideStage?.addEventListener("click", () => openLightbox(slideIndex));
document.getElementById("heroOpen")?.addEventListener("click", () => {
  openHeroLightbox();
});

/* Always start at the top when the page opens */
if ("scrollRestoration" in history) history.scrollRestoration = "manual";
window.scrollTo(0, 0);
window.addEventListener("load", () => window.scrollTo(0, 0));

/* Swipe on slider */
bindSwipe(document.getElementById("slider"), (dir) => step(dir));

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

const sections = ["portfolio", "author"]
  .map((id) => document.getElementById(id))
  .filter(Boolean);

function updateActiveNav() {
  const y = window.scrollY + 120;
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
let lightboxIndex = 0;
let lightboxMode = "works"; // "works" | "hero"

function openLightbox(index) {
  lightboxMode = "works";
  lightboxIndex = (index + works.length) % works.length;
  const work = works[lightboxIndex];
  lightboxImg.src = work.src;
  lightboxImg.alt = altFor(work, lightboxIndex);
  lightbox.hidden = false;
  document.body.style.overflow = "hidden";
  goTo(lightboxIndex);
}

function openHeroLightbox() {
  lightboxMode = "hero";
  lightboxImg.src = "assets/art/building.png";
  lightboxImg.alt = i18n[lang].work_building || "";
  lightbox.hidden = false;
  document.body.style.overflow = "hidden";
}

function closeLightbox() {
  lightbox.hidden = true;
  document.body.style.overflow = "";
  lightboxImg.src = "";
  lightboxMode = "works";
}

function lightboxStep(delta) {
  if (lightboxMode === "hero") {
    openLightbox(delta > 0 ? 0 : works.length - 1);
    return;
  }
  openLightbox(lightboxIndex + delta);
}

document.getElementById("lightboxClose")?.addEventListener("click", closeLightbox);
document.getElementById("lightboxPrev")?.addEventListener("click", () => lightboxStep(-1));
document.getElementById("lightboxNext")?.addEventListener("click", () => lightboxStep(1));

lightbox?.addEventListener("click", (e) => {
  if (e.target === lightbox) closeLightbox();
});

document.addEventListener("keydown", (e) => {
  if (!lightbox.hidden) {
    if (e.key === "Escape") closeLightbox();
    if (e.key === "ArrowLeft") lightboxStep(-1);
    if (e.key === "ArrowRight") lightboxStep(1);
    return;
  }
  if (e.key === "ArrowLeft") step(-1);
  if (e.key === "ArrowRight") step(1);
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
