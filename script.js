const works = [
  {
    src: "assets/art/work-01.jpg",
    titles: { ru: "Вертикаль", en: "Vertical", az: "Vertikal" },
  },
  {
    src: "assets/art/work-02.jpg",
    titles: { ru: "Тень", en: "Shadow", az: "Kölgə" },
  },
  {
    src: "assets/art/work-03.jpg",
    titles: { ru: "Стол с бокалами", en: "Table with glasses", az: "Stəkanlı masa" },
  },
  {
    src: "assets/art/work-04.jpg",
    titles: { ru: "Маки и глаза", en: "Poppies and eyes", az: "Lalələr və gözlər" },
  },
  {
    src: "assets/art/work-05.jpg",
    titles: { ru: "Стол и стулья", en: "Table and chairs", az: "Masa və stullar" },
  },
  {
    src: "assets/art/work-06.jpg",
    titles: { ru: "Синий крест", en: "Blue cross", az: "Mavi xaç" },
  },
  {
    src: "assets/art/work-07.jpg",
    titles: { ru: "Красный стул", en: "Red chair", az: "Qırmızı stul" },
  },
  {
    src: "assets/art/work-08.jpg",
    titles: { ru: "Пляж", en: "Beach", az: "Çimərlik" },
  },
];

const i18n = {
  ru: {
    brand: "Гарягды",
    nav_portfolio: "Портфолио",
    nav_author: "Гарягды",
    author_lead: "Художник",
    socials_label: "Соцсети",
    socials_soon: "скоро",
    roulette_hint: "листайте мышкой",
    title: "Гарягды — Портфолио",
  },
  en: {
    brand: "Garyagdy",
    nav_portfolio: "Projects",
    nav_author: "Garyagdy",
    author_lead: "Artist",
    socials_label: "Social",
    socials_soon: "coming soon",
    roulette_hint: "drag to scroll",
    title: "Garyagdy — Portfolio",
  },
  az: {
    brand: "Qaryağdı",
    nav_portfolio: "Layihələr",
    nav_author: "Qaryağdı",
    author_lead: "Rəssam",
    socials_label: "Sosial şəbəkələr",
    socials_soon: "tezliklə",
    roulette_hint: "siçan ilə sürüşdürün",
    title: "Qaryağdı — Portfolio",
  },
};

const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

let lang = localStorage.getItem("garyagdy-lang") || "ru";
if (!i18n[lang]) lang = "ru";

let activeIndex = 0;

function titleFor(work) {
  return work.titles[lang] || work.titles.ru;
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

  renderRoulette();
}

document.querySelectorAll(".lang-btn").forEach((btn) => {
  btn.addEventListener("click", () => applyLang(btn.dataset.lang));
});

const roulette = document.getElementById("roulette");
const track = document.getElementById("rouletteTrack");

function renderRoulette() {
  if (!track) return;
  track.innerHTML = "";

  // Repeat once so the roulette feels fuller when scrolling
  const deck = [...works, ...works];

  deck.forEach((work, index) => {
    const realIndex = index % works.length;
    const card = document.createElement("button");
    card.type = "button";
    card.className = "roulette-card";
    card.dataset.index = String(realIndex);
    card.setAttribute("aria-label", titleFor(work));

    const thumb = document.createElement("div");
    thumb.className = "roulette-thumb";
    const img = document.createElement("img");
    img.src = work.src;
    img.alt = "";
    img.loading = index < 4 ? "eager" : "lazy";
    img.decoding = "async";
    img.draggable = false;
    thumb.appendChild(img);

    const title = document.createElement("span");
    title.className = "roulette-title";
    title.textContent = titleFor(work);

    card.append(thumb, title);
    card.addEventListener("click", (e) => {
      if (roulette?.dataset.dragged === "1") {
        e.preventDefault();
        return;
      }
      openLightbox(realIndex);
    });
    track.appendChild(card);
  });

  requestAnimationFrame(() => {
    updateActiveCards();
    // Start near the middle of the first set
    if (roulette && track.children.length) {
      const first = track.children[Math.min(2, track.children.length - 1)];
      const left = first.offsetLeft - (roulette.clientWidth - first.clientWidth) / 2;
      roulette.scrollLeft = Math.max(0, left);
      updateActiveCards();
    }
  });
}

function updateActiveCards() {
  if (!roulette || !track) return;
  const center = roulette.scrollLeft + roulette.clientWidth / 2;
  let best = null;
  let bestDist = Infinity;

  [...track.children].forEach((card) => {
    const mid = card.offsetLeft + card.offsetWidth / 2;
    const dist = Math.abs(mid - center);
    card.classList.toggle("is-active", false);
    if (dist < bestDist) {
      bestDist = dist;
      best = card;
    }
  });
  best?.classList.add("is-active");
}

roulette?.addEventListener("scroll", () => updateActiveCards(), { passive: true });

/* Mouse drag to scroll roulette */
(() => {
  if (!roulette) return;
  let down = false;
  let startX = 0;
  let startScroll = 0;
  let moved = 0;

  const onDown = (x) => {
    down = true;
    moved = 0;
    startX = x;
    startScroll = roulette.scrollLeft;
    roulette.classList.add("is-dragging");
    roulette.dataset.dragged = "0";
  };

  const onMove = (x) => {
    if (!down) return;
    const dx = x - startX;
    moved = Math.max(moved, Math.abs(dx));
    roulette.scrollLeft = startScroll - dx;
    if (moved > 6) roulette.dataset.dragged = "1";
  };

  const onUp = () => {
    if (!down) return;
    down = false;
    roulette.classList.remove("is-dragging");
    window.setTimeout(() => {
      roulette.dataset.dragged = "0";
    }, 40);
  };

  roulette.addEventListener("mousedown", (e) => {
    if (e.button !== 0) return;
    e.preventDefault();
    onDown(e.clientX);
  });
  window.addEventListener("mousemove", (e) => onMove(e.clientX));
  window.addEventListener("mouseup", onUp);

  roulette.addEventListener(
    "wheel",
    (e) => {
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        roulette.scrollLeft += e.deltaY;
      }
    },
    { passive: false }
  );
})();

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
  lightboxImg.alt = titleFor(work);
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
