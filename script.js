const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");
const revealElements = document.querySelectorAll(".reveal");
const framesTrack = document.getElementById("framesTrack");
const framesSection = document.getElementById("frames");
const themeToggle = document.getElementById("themeToggle");

menuToggle?.addEventListener("click", () => {
  navMenu?.classList.toggle("show");
});

navMenu?.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => navMenu.classList.remove("show"));
});

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add("visible");
      observer.unobserve(entry.target);
    });
  },
  { threshold: 0.15 }
);

revealElements.forEach((element) => observer.observe(element));

const setTheme = (theme) => {
  if (theme === "light") {
    document.documentElement.setAttribute("data-theme", "light");
    themeToggle?.setAttribute("aria-label", "Tema claro ativo");
    if (themeToggle) themeToggle.dataset.theme = "light";
  } else {
    document.documentElement.removeAttribute("data-theme");
    themeToggle?.setAttribute("aria-label", "Tema escuro ativo");
    if (themeToggle) themeToggle.dataset.theme = "dark";
  }
  localStorage.setItem("pt_theme", theme);
};

const savedTheme = localStorage.getItem("pt_theme");
setTheme(savedTheme === "light" ? "light" : "dark");

themeToggle?.addEventListener("click", () => {
  const isLight = document.documentElement.getAttribute("data-theme") === "light";
  setTheme(isLight ? "dark" : "light");
});

let isDragging = false;
let startX = 0;
let scrollLeft = 0;
let autoPaused = false;
let inView = false;
let autoActive = false;
let lastFrame = null;
const autoSpeed = 0.06; // px per ms (~60px/s)

framesTrack?.addEventListener("pointerdown", (event) => {
  isDragging = true;
  autoPaused = true;
  framesTrack.setPointerCapture(event.pointerId);
  startX = event.pageX - framesTrack.offsetLeft;
  scrollLeft = framesTrack.scrollLeft;
});

framesTrack?.addEventListener("pointermove", (event) => {
  if (!isDragging) return;
  const x = event.pageX - framesTrack.offsetLeft;
  const walk = (x - startX) * 1.2;
  framesTrack.scrollLeft = scrollLeft - walk;
});

const stopDragging = () => {
  isDragging = false;
  if (inView) autoPaused = false;
};

framesTrack?.addEventListener("pointerup", stopDragging);
framesTrack?.addEventListener("pointerleave", stopDragging);

framesTrack?.addEventListener("mouseenter", () => {
  autoPaused = true;
});

framesTrack?.addEventListener("mouseleave", () => {
  if (inView && !isDragging) autoPaused = false;
});

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const autoScrollStep = (timestamp) => {
  if (!autoActive || autoPaused || isDragging || prefersReducedMotion) {
    lastFrame = timestamp;
    requestAnimationFrame(autoScrollStep);
    return;
  }

  if (lastFrame != null) {
    const delta = timestamp - lastFrame;
    framesTrack.scrollLeft += delta * autoSpeed;
    const maxScroll = framesTrack.scrollWidth - framesTrack.clientWidth;
    if (framesTrack.scrollLeft >= maxScroll - 1) {
      framesTrack.scrollLeft = 0;
    }
  }
  lastFrame = timestamp;
  requestAnimationFrame(autoScrollStep);
};

if (framesTrack) {
  requestAnimationFrame(autoScrollStep);
}

const framesObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      inView = entry.isIntersecting;
      autoActive = inView;
      if (!inView) {
        autoPaused = true;
      } else {
        autoPaused = false;
      }
    });
  },
  { threshold: 0.35 }
);

if (framesSection) framesObserver.observe(framesSection);
