
const langBtn = document.getElementById("langBtn");
let lang = "en";

langBtn.addEventListener("click", () => {
  lang = lang === "en" ? "ar" : "en";
  document.documentElement.lang = lang;
  document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
  document.body.classList.toggle("rtl", lang === "ar");
  langBtn.textContent = lang === "en" ? "AR" : "EN";

  document.querySelectorAll("[data-en]").forEach(el => {
    el.textContent = el.dataset[lang];
  });
});

const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");
menuBtn.addEventListener("click", () => navLinks.classList.toggle("open"));
navLinks.querySelectorAll("a").forEach(a => a.addEventListener("click", () => navLinks.classList.remove("open")));

document.getElementById("contactForm").addEventListener("submit", (e) => {
  e.preventDefault();
  document.getElementById("formMsg").textContent =
    lang === "ar"
      ? "تم تجهيز النموذج كواجهة تجريبية. بنقدر نربطه لاحقاً بواتساب أو الإيميل."
      : "The form is currently a front-end demo. It can later be connected to WhatsApp or email.";
});
