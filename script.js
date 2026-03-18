const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");
const revealElements = document.querySelectorAll(".reveal");
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

const contactForm = document.getElementById("contactForm");
const whatsappNumber = "5535984280114";

contactForm?.addEventListener("submit", (event) => {
  event.preventDefault();
  if (!contactForm.reportValidity()) return;

  const nome = document.getElementById("nome")?.value?.trim() || "";
  const idade = document.getElementById("idade")?.value?.trim() || "";
  const peso = document.getElementById("peso")?.value?.trim() || "";
  const altura = document.getElementById("altura")?.value?.trim() || "";
  const dias = document.getElementById("dias")?.value?.trim() || "";
  const horario = document.getElementById("horario")?.value?.trim() || "";
  const objetivo = document.getElementById("objetivo")?.value?.trim() || "";

  const mensagem = [
    "Ola! Quero iniciar acompanhamento.",
    `Nome: ${nome}`,
    `Idade: ${idade}`,
    `Peso: ${peso} kg`,
    `Altura: ${altura} m`,
    `Dias livres: ${dias}`,
    `Horario: ${horario}`,
    `Objetivo: ${objetivo}`,
  ].join("\n");

  const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(mensagem)}`;
  const popup = window.open(url, "_blank", "noopener");
  if (!popup) window.location.href = url;
});
