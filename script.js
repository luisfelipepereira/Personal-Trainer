const navMenu = document.getElementById("navMenu");
const menuToggle = document.getElementById("menuToggle");
const themeToggle = document.getElementById("themeToggle");
const framesTrack = document.getElementById("framesTrack");
const framesSection = document.getElementById("frames");
const hero = document.querySelector(".hero");
const heroBg = document.querySelector(".hero-parallax");
const heroProfile = document.querySelector(".hero-profile");
const contactForm = document.getElementById("contactForm");

/* ----------------------------- Navegação ----------------------------- */
menuToggle?.addEventListener("click", () => {
  const isOpen = navMenu?.classList.toggle("show");
  menuToggle.classList.toggle("is-open", Boolean(isOpen));
});

navMenu?.querySelectorAll("a").forEach((link) =>
  link.addEventListener("click", () => {
    navMenu.classList.remove("show");
    menuToggle.classList.remove("is-open");
  })
);

/* --------------------------- Alternar tema --------------------------- */
const setTheme = (theme) => {
  if (theme === "light") {
    document.documentElement.setAttribute("data-theme", "light");
    themeToggle?.setAttribute("aria-label", "Tema claro ativo");
  } else {
    document.documentElement.removeAttribute("data-theme");
    themeToggle?.setAttribute("aria-label", "Tema escuro ativo");
  }
  localStorage.setItem("pt_theme", theme);
};

const savedTheme = localStorage.getItem("pt_theme");
setTheme(savedTheme === "light" ? "light" : "dark");

themeToggle?.addEventListener("click", () => {
  const isLight = document.documentElement.getAttribute("data-theme") === "light";
  setTheme(isLight ? "dark" : "light");
});

/* ---------------------------- Scroll Reveal -------------------------- */
if (typeof ScrollReveal !== "undefined") {
  const sr = ScrollReveal({
    distance: "40px",
    duration: 900,
    easing: "cubic-bezier(0.22, 1, 0.36, 1)",
    opacity: 0,
    interval: 90,
  });

  sr.reveal('[data-reveal="up"]', { origin: "bottom" });
  sr.reveal('[data-reveal="left"]', { origin: "left" });
  sr.reveal('[data-reveal="right"]', { origin: "right" });
  sr.reveal('[data-reveal="zoom"]', { origin: "bottom", scale: 0.92 });
} else {
  document.querySelectorAll("[data-reveal]").forEach((el) => {
    el.style.opacity = "1";
    el.style.transform = "none";
  });
}

/* ------------------------- Parallax e Hero --------------------------- */
const parallax = () => {
  const scroll = window.scrollY || 0;
  if (heroBg) heroBg.style.transform = `translateY(${scroll * 0.18}px) scale(1.08)`;
};

window.addEventListener("scroll", parallax);
parallax();

hero?.addEventListener("mousemove", (event) => {
  if (!heroProfile) return;
  const rect = hero.getBoundingClientRect();
  const x = (event.clientX - rect.left) / rect.width - 0.5;
  const y = (event.clientY - rect.top) / rect.height - 0.5;
  heroProfile.style.transform = `translateY(-6px) rotateX(${y * 7}deg) rotateY(${x * 7}deg)`;
});

hero?.addEventListener("mouseleave", () => {
  if (heroProfile) heroProfile.style.transform = "";
});

/* ----------------------------- Partículas ---------------------------- */
const canvas = document.getElementById("particles");
if (canvas) {
  const ctx = canvas.getContext("2d");
  const particles = [];
  const count = 38;

  const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = hero?.offsetHeight || window.innerHeight;
  };

  const createParticles = () => {
    particles.length = 0;
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 2 + 1,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        alpha: Math.random() * 0.6 + 0.2,
      });
    }
  };

  const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      ctx.beginPath();
      ctx.fillStyle = `rgba(255,255,255,${p.alpha})`;
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    });
    requestAnimationFrame(draw);
  };

  resize();
  createParticles();
  draw();
  window.addEventListener("resize", () => {
    resize();
    createParticles();
  });
}

/* ----------------------- Frames: auto-scroll suave ------------------- */
let isDragging = false;
let startX = 0;
let scrollLeft = 0;
let autoPaused = false;
let inView = false;
let autoActive = false;
let lastFrame = null;
const autoSpeed = 0.06;
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

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

const autoScrollStep = (timestamp) => {
  if (!framesTrack) return;
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

if (framesTrack) requestAnimationFrame(autoScrollStep);

const framesObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      inView = entry.isIntersecting;
      autoActive = inView;
      autoPaused = !inView;
    });
  },
  { threshold: 0.35 }
);

if (framesSection) framesObserver.observe(framesSection);

/* ------------------------- Microinterações btn ----------------------- */
document.querySelectorAll(".btn").forEach((btn) => {
  btn.addEventListener("pointerdown", (event) => {
    const rect = btn.getBoundingClientRect();
    const ripple = document.createElement("span");
    ripple.className = "ripple";
    ripple.style.left = `${event.clientX - rect.left}px`;
    ripple.style.top = `${event.clientY - rect.top}px`;
    btn.appendChild(ripple);
    setTimeout(() => ripple.remove(), 650);
  });
});

/* ----------------------------- Formulário ---------------------------- */
contactForm?.addEventListener("submit", (e) => {
  e.preventDefault();
  const nome = document.getElementById("nome").value.trim();
  const idade = document.getElementById("idade").value.trim();
  const peso = document.getElementById("peso").value.trim();
  const altura = document.getElementById("altura").value.trim();
  const dias = document.getElementById("dias").value.trim();
  const horario = document.getElementById("horario").value.trim();
  const objetivo = document.getElementById("objetivo").value.trim();

  const numero = "553584280114";
  const mensagem = encodeURIComponent(
    `Olá Henrique! 🚀\n\nNovo formulário de treino:\n` +
      `👤 Nome: ${nome}\n` +
      `🎂 Idade: ${idade}\n` +
      `⚖️ Peso: ${peso} kg\n` +
      `📏 Altura: ${altura} cm\n` +
      `📅 Dias livres: ${dias}\n` +
      `⏰ Horário: ${horario}\n` +
      `🎯 Objetivo: ${objetivo}`
  );

  const url = `https://wa.me/${numero}?text=${mensagem}`;
  window.open(url, "_blank");
});
