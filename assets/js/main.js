(() => {
  "use strict";

  const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------------- theme toggle ---------------- */
  const root = document.documentElement;
  const themeToggle = document.getElementById("themeToggle");
  const THEME_KEY = "mmu-theme";

  function applyTheme(theme){
    root.setAttribute("data-theme", theme);
    if (themeToggle) themeToggle.setAttribute("aria-pressed", theme === "dark" ? "true" : "false");
  }

  (function initTheme(){
    const saved = localStorage.getItem(THEME_KEY);
    if (saved) {
      applyTheme(saved);
      return;
    }
    applyTheme("dark");
  })();

  themeToggle && themeToggle.addEventListener("click", () => {
    const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
    applyTheme(next);
    localStorage.setItem(THEME_KEY, next);
  });

  /* ---------------- mobile nav ---------------- */
  const navToggle = document.getElementById("navToggle");
  const siteNav = document.getElementById("siteNav");

  function closeNav(){
    siteNav.classList.remove("is-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Open menu");
  }

  navToggle && navToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  });

  siteNav && siteNav.querySelectorAll("a").forEach(a => a.addEventListener("click", closeNav));

  /* ---------------- active nav link + stage activation + reveal ---------------- */
  const navLinks = Array.from(document.querySelectorAll("[data-nav]"));
  const stages = Array.from(document.querySelectorAll(".stage"));

  const stageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        const id = entry.target.id;
        navLinks.forEach(link => {
          link.classList.toggle("is-active", link.getAttribute("href") === "#" + id);
        });
      }
    });
  }, { rootMargin: "-45% 0px -45% 0px", threshold: 0 });

  stages.forEach(s => stageObserver.observe(s));

  /* reveal-on-scroll for cards */
  const revealTargets = document.querySelectorAll(
    ".stat-strip, .mini-card, .timeline__item, .exp-project, .project-card, .badge, .skill-group, .cred-list li, .contact-form, .contact__info"
  );
  revealTargets.forEach(el => el.setAttribute("data-reveal", ""));

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  revealTargets.forEach(el => revealObserver.observe(el));

  /* ---------------- skill bar fill ---------------- */
  const skillBars = document.querySelectorAll(".skill-bar");
  const skillObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting){
        const bar = entry.target;
        const value = bar.getAttribute("data-value") || "0";
        const fill = bar.querySelector(".skill-bar__fill");
        if (fill) fill.style.width = value + "%";
        skillObserver.unobserve(bar);
      }
    });
  }, { threshold: 0.4 });
  skillBars.forEach(b => skillObserver.observe(b));

  /* ---------------- pipeline rail fill (scroll progress) ---------------- */
  const pipeline = document.getElementById("pipeline");
  const railFill = document.getElementById("railFill");

  function updateRail(){
    if (!pipeline || !railFill) return;
    const rect = pipeline.getBoundingClientRect();
    const viewportH = window.innerHeight;
    const total = rect.height;
    const scrolled = Math.min(Math.max(viewportH * 0.5 - rect.top, 0), total);
    const pct = total > 0 ? (scrolled / total) * 100 : 0;
    railFill.style.height = pct + "%";
  }

  let ticking = false;
  window.addEventListener("scroll", () => {
    if (!ticking){
      window.requestAnimationFrame(() => { updateRail(); ticking = false; });
      ticking = true;
    }
  }, { passive: true });
  window.addEventListener("resize", updateRail);
  updateRail();

  /* ---------------- top scroll-progress bar ---------------- */
  const scrollProgress = document.getElementById("scrollProgress");
  function updateScrollProgress(){
    if (!scrollProgress) return;
    const doc = document.documentElement;
    const scrollable = doc.scrollHeight - doc.clientHeight;
    const pct = scrollable > 0 ? (window.scrollY / scrollable) * 100 : 0;
    scrollProgress.style.width = pct + "%";
  }
  window.addEventListener("scroll", updateScrollProgress, { passive: true });
  window.addEventListener("resize", updateScrollProgress);
  updateScrollProgress();

  /* ---------------- floating back-to-top button ---------------- */
  const fabTop = document.getElementById("fabTop");
  function updateFab(){
    if (!fabTop) return;
    fabTop.classList.toggle("is-visible", window.scrollY > window.innerHeight * 0.6);
  }
  fabTop && fabTop.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: prefersReduced ? "auto" : "smooth" });
  });
  window.addEventListener("scroll", updateFab, { passive: true });
  updateFab();

  /* ---------------- query card pointer tilt ---------------- */
  const queryCard = document.querySelector(".query-card");
  const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

  if (queryCard && canHover && !prefersReduced){
    const maxTilt = 8;

    queryCard.addEventListener("mouseenter", () => {
      queryCard.classList.add("is-tilting");
    });

    queryCard.addEventListener("mousemove", (e) => {
      const rect = queryCard.getBoundingClientRect();
      const px = (e.clientX - rect.left) / rect.width;
      const py = (e.clientY - rect.top) / rect.height;
      const rotateY = (px - 0.5) * maxTilt * 2;
      const rotateX = (0.5 - py) * maxTilt * 2;
      queryCard.style.transform =
        `rotate(0.6deg) perspective(900px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.015)`;
    });

    queryCard.addEventListener("mouseleave", () => {
      queryCard.classList.remove("is-tilting");
      queryCard.style.transform = "rotate(0.6deg)";
    });
  }

  /* ---------------- header shadow on scroll ---------------- */
  const header = document.getElementById("siteHeader");
  function updateHeader(){
    if (window.scrollY > 8) header.style.boxShadow = "var(--shadow-sm)";
    else header.style.boxShadow = "none";
  }
  window.addEventListener("scroll", updateHeader, { passive: true });
  updateHeader();

  /* ---------------- footer year ---------------- */
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------------- contact form (mailto handoff) ---------------- */
  const form = document.getElementById("contactForm");
  const status = document.getElementById("formStatus");

  function setFieldError(field, isInvalid){
    field.classList.toggle("is-invalid", isInvalid);
  }

  form && form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = form.querySelector("#name");
    const email = form.querySelector("#email");
    const message = form.querySelector("#message");

    const nameValid = name.value.trim().length >= 2;
    const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim());
    const messageValid = message.value.trim().length >= 10;

    setFieldError(name.closest(".field"), !nameValid);
    setFieldError(email.closest(".field"), !emailValid);
    setFieldError(message.closest(".field"), !messageValid);

    if (!(nameValid && emailValid && messageValid)){
      status.textContent = "Please fix the highlighted fields.";
      status.classList.add("is-error");
      return;
    }

    status.classList.remove("is-error");

    const subject = encodeURIComponent(`Portfolio enquiry from ${name.value.trim()}`);
    const body = encodeURIComponent(
      `${message.value.trim()}\n\n— ${name.value.trim()} (${email.value.trim()})`
    );
    const mailto = `mailto:mohsinnuddin@gmail.com?subject=${subject}&body=${body}`;

    window.location.href = mailto;
    status.textContent = "Opening your email client to send this message…";
    form.reset();
  });
})();

/* project tabs (progressive enhancement: without JS every project stays visible) + copy-email */
(() => {
  const wrap = document.querySelector(".exp-projects");
  if (wrap) {
    const items = Array.from(wrap.querySelectorAll(".exp-project"));
    const tabs = document.createElement("div");
    tabs.className = "exp-tabs"; tabs.setAttribute("role", "tablist");
    const show = (n) => {
      items.forEach((it, i) => { it.hidden = i !== n; });
      Array.from(tabs.children).forEach((b, i) => {
        b.classList.toggle("is-active", i === n); b.setAttribute("aria-selected", String(i === n));
      });
    };
    items.forEach((it, i) => {
      const b = document.createElement("button");
      b.type = "button"; b.className = "exp-tab"; b.setAttribute("role", "tab");
      b.textContent = it.querySelector("h4").textContent;
      b.addEventListener("click", () => show(i));
      tabs.appendChild(b);
    });
    wrap.before(tabs); show(0);
  }
  document.querySelectorAll("[data-copy]").forEach((b) => b.addEventListener("click", async () => {
    try { await navigator.clipboard.writeText(b.dataset.copy); const t = b.textContent; b.textContent = "Copied"; setTimeout(() => { b.textContent = t; }, 1600); } catch (e) {}
  }));
})();

/* animated background: drifting data nodes linked by faint pipeline lines */
(() => {
  const cv = document.getElementById("bgCanvas");
  if (!cv) return;
  const ctx = cv.getContext("2d");
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const root = document.documentElement;
  let w = 0, h = 0, dpr = 1, nodes = [], rgb = [20, 122, 92], raf = 0;
  const LINK = 150;

  function readColor() {
    const hex = getComputedStyle(root).getPropertyValue("--accent").trim().replace("#", "");
    if (hex.length === 6) rgb = [0, 2, 4].map((i) => parseInt(hex.slice(i, i + 2), 16));
  }
  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = window.innerWidth; h = window.innerHeight;
    cv.width = w * dpr; cv.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const n = Math.min(60, Math.round((w * h) / 24000));
    nodes = Array.from({ length: n }, () => ({
      x: Math.random() * w, y: Math.random() * h,
      vx: (Math.random() - 0.5) * 0.28, vy: (Math.random() - 0.5) * 0.28,
      r: 1.2 + Math.random() * 1.6,
    }));
  }
  function frame() {
    ctx.clearRect(0, 0, w, h);
    const [r, g, b] = rgb;
    for (const p of nodes) {
      if (!reduce) {
        p.x += p.vx; p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;
      }
    }
    for (let i = 0; i < nodes.length; i++) {
      const a = nodes[i];
      for (let k = i + 1; k < nodes.length; k++) {
        const c = nodes[k], d = Math.hypot(a.x - c.x, a.y - c.y);
        if (d < LINK) {
          ctx.strokeStyle = `rgba(${r},${g},${b},${0.16 * (1 - d / LINK)})`;
          ctx.lineWidth = 1;
          ctx.beginPath(); ctx.moveTo(a.x, a.y); ctx.lineTo(c.x, c.y); ctx.stroke();
        }
      }
      ctx.fillStyle = `rgba(${r},${g},${b},0.35)`;
      ctx.beginPath(); ctx.arc(a.x, a.y, a.r, 0, Math.PI * 2); ctx.fill();
    }
    if (!reduce && !document.hidden) raf = requestAnimationFrame(frame);
  }
  const start = () => { cancelAnimationFrame(raf); frame(); };
  readColor(); resize(); start();
  window.addEventListener("resize", () => { resize(); start(); });
  document.addEventListener("visibilitychange", () => { if (!document.hidden) start(); });
  new MutationObserver(() => { readColor(); if (reduce) frame(); }).observe(root, { attributes: true, attributeFilter: ["data-theme"] });
})();

/* dots follow scroll position in BOTH directions: filled only once the dot is above the
   same line the side rail fills to (middle of the viewport) */
(() => {
  const stages = Array.from(document.querySelectorAll(".stage"));
  const items = Array.from(document.querySelectorAll(".cred-list li"));
  let ticking = false;
  function update() {
    const doc = document.documentElement;
    const atBottom = window.scrollY + window.innerHeight >= doc.scrollHeight - 2;
    const line = atBottom ? window.innerHeight : window.innerHeight * 0.5;
    stages.forEach((st) => {
      const node = st.querySelector(".stage-node");
      if (!node) return;
      const r = node.getBoundingClientRect();
      st.classList.toggle("is-active", r.top + r.height / 2 < line);
    });
    items.forEach((li) => {
      li.classList.toggle("is-reached", li.getBoundingClientRect().top + 10 < line);
    });
    ticking = false;
  }
  const request = () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } };
  window.addEventListener("scroll", request, { passive: true });
  window.addEventListener("resize", request);
  update();
})();
