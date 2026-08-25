(() => {
  "use strict";

  const root = document.documentElement;
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const header = document.querySelector(".site-header");
  const menuButton = document.querySelector(".menu-button");
  const navigation = document.querySelector(".main-navigation");
  const navigationLinks = [...document.querySelectorAll(".main-navigation a")];
  const revealItems = [...document.querySelectorAll("[data-reveal]")];
  const heroVisual = document.querySelector("[data-parallax]");
  const tiltCards = [...document.querySelectorAll("[data-tilt]")];
  const contactForm = document.querySelector(".contact-form");
  const formMessage = document.querySelector(".form-message");

  root.classList.add("motion-ready");

  let scrollFrame = 0;
  const updateScroll = () => {
    const scrollable = root.scrollHeight - window.innerHeight;
    const progress = scrollable > 0 ? Math.min(window.scrollY / scrollable, 1) : 0;
    root.style.setProperty("--scroll-progress", progress.toString());
    header?.classList.toggle("is-scrolled", window.scrollY > 18);
    scrollFrame = 0;
  };

  const queueScrollUpdate = () => {
    if (!scrollFrame) scrollFrame = window.requestAnimationFrame(updateScroll);
  };

  updateScroll();
  window.addEventListener("scroll", queueScrollUpdate, { passive: true });
  window.addEventListener("resize", queueScrollUpdate, { passive: true });

  const setMenu = (open) => {
    if (!menuButton || !navigation) return;
    navigation.classList.toggle("is-open", open);
    menuButton.classList.toggle("is-open", open);
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute("aria-label", open ? "Close navigation" : "Open navigation");
  };

  menuButton?.addEventListener("click", () => {
    setMenu(menuButton.getAttribute("aria-expanded") !== "true");
  });

  navigationLinks.forEach((link) => link.addEventListener("click", () => setMenu(false)));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setMenu(false);
  });

  if (reducedMotion || !("IntersectionObserver" in window)) {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8%" },
    );
    revealItems.forEach((item) => revealObserver.observe(item));
  }

  if ("IntersectionObserver" in window) {
    const sections = navigationLinks
      .map((link) => document.querySelector(link.getAttribute("href")))
      .filter(Boolean);
    const sectionObserver = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        const activeId = `#${visible.target.id}`;
        navigationLinks.forEach((link) => {
          const active = link.getAttribute("href") === activeId;
          link.classList.toggle("is-active", active);
          if (active) link.setAttribute("aria-current", "page");
          else link.removeAttribute("aria-current");
        });
      },
      { threshold: [0.12, 0.35, 0.58], rootMargin: "-32% 0px -52%" },
    );
    sections.forEach((section) => sectionObserver.observe(section));
  }

  const resetHero = () => {
    if (!heroVisual) return;
    [
      "--photo-x",
      "--photo-y",
      "--violet-x",
      "--violet-y",
      "--coral-x",
      "--coral-y",
      "--aqua-x",
      "--aqua-y",
    ].forEach((property) => heroVisual.style.setProperty(property, "0px"));
  };

  if (heroVisual && !reducedMotion) {
    heroVisual.addEventListener("pointermove", (event) => {
      if (event.pointerType === "touch") return;
      const bounds = heroVisual.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - 0.5;
      const y = (event.clientY - bounds.top) / bounds.height - 0.5;
      heroVisual.style.setProperty("--photo-x", `${(-x * 16).toFixed(2)}px`);
      heroVisual.style.setProperty("--photo-y", `${(-y * 16).toFixed(2)}px`);
      heroVisual.style.setProperty("--violet-x", `${(x * 24).toFixed(2)}px`);
      heroVisual.style.setProperty("--violet-y", `${(y * 24).toFixed(2)}px`);
      heroVisual.style.setProperty("--coral-x", `${(x * 34).toFixed(2)}px`);
      heroVisual.style.setProperty("--coral-y", `${(-y * 24).toFixed(2)}px`);
      heroVisual.style.setProperty("--aqua-x", `${(-x * 30).toFixed(2)}px`);
      heroVisual.style.setProperty("--aqua-y", `${(y * 30).toFixed(2)}px`);
    });
    heroVisual.addEventListener("pointerleave", resetHero);
  }

  tiltCards.forEach((card) => {
    const reset = () => {
      card.style.setProperty("--tilt-x", "0deg");
      card.style.setProperty("--tilt-y", "0deg");
    };
    card.addEventListener("pointermove", (event) => {
      if (reducedMotion || event.pointerType === "touch") return;
      const bounds = card.getBoundingClientRect();
      const rotateY = ((event.clientX - bounds.left) / bounds.width - 0.5) * 5;
      const rotateX = ((event.clientY - bounds.top) / bounds.height - 0.5) * -5;
      card.style.setProperty("--tilt-x", `${rotateX.toFixed(2)}deg`);
      card.style.setProperty("--tilt-y", `${rotateY.toFixed(2)}deg`);
    });
    card.addEventListener("pointerleave", reset);
  });

  contactForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    if (formMessage) {
      formMessage.textContent =
        "Thanks—your project brief is ready. Connect this form to your email or booking service before launch.";
    }
  });
})();
