(function () {
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  if (prefersReducedMotion) {
    document.body.classList.add("is-entered");
  } else {
    requestAnimationFrame(() => {
      document.body.classList.add("is-entered");
    });
  }

  const timeEl = document.getElementById("status-time");
  if (timeEl) {
    function updateTime() {
      const now = new Date();
      const formatted = now.toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });
      timeEl.textContent = formatted;
      timeEl.setAttribute("datetime", now.toISOString());
    }

    updateTime();
    setInterval(updateTime, 30_000);
  }

  const focusItems = document.querySelectorAll(".focus-item");
  if (!focusItems.length) return;

  function setActiveFocus(id) {
    focusItems.forEach((item) => {
      item.classList.toggle("is-active", item.dataset.focus === id);
    });
  }

  focusItems.forEach((item) => {
    item.addEventListener("mouseenter", () => {
      setActiveFocus(item.dataset.focus);
    });

    item.addEventListener("focusin", () => {
      setActiveFocus(item.dataset.focus);
    });
  });

  document.querySelector(".panel-focus")?.addEventListener("mouseleave", () => {
    focusItems.forEach((item) => item.classList.remove("is-active"));
  });
})();
