(() => {
  const form = document.getElementById("auth-smoke-form");
  const log = document.getElementById("event-log");
  const params = new URLSearchParams(window.location.search);
  const prefillLogin = (params.get("login") || "").trim().toLowerCase();
  const loginInput = document.getElementById("login");

  if (prefillLogin && loginInput instanceof HTMLInputElement) {
    loginInput.value = prefillLogin;
  }

  function append(message) {
    const time = new Date().toLocaleTimeString("pt-BR", { hour12: false });
    const previous = log.textContent === "aguardando foco..." ? "" : `${log.textContent}\n`;
    log.textContent = `${previous}${time} ${message}`;
  }

  document.addEventListener(
    "focusin",
    (event) => {
      const target = event.target;
      if (target instanceof HTMLElement) {
        append(`focusin ${target.tagName.toLowerCase()}#${target.id || target.getAttribute("name") || "sem-id"}`);
      }
    },
    { passive: true },
  );

  document.addEventListener(
    "input",
    (event) => {
      const target = event.target;
      if (target instanceof HTMLElement) {
        append(`input ${target.tagName.toLowerCase()}#${target.id || target.getAttribute("name") || "sem-id"}`);
      }
    },
    { passive: true },
  );

  form?.addEventListener("submit", (event) => {
    event.preventDefault();
    append("submit interceptado pelo script isolado");
  });
})();
