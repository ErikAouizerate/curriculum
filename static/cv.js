// No framework, no hydration: this only enhances the buttons of the static CV page.

// Coming back to the CV (`/`) resets the portfolio assistant: its next load starts from a blank
// prompt. This file is loaded on every page, hence the path check.
if (window.location.pathname === "/") {
  try {
    sessionStorage.removeItem("portfolio:ask:v1");
  } catch {
    // Storage unavailable: nothing was saved either.
  }

  // On narrow screens (see `portfolio-link` in app.css) the portfolio link appears once the
  // phone number reaches the top of the screen, i.e. after the title has scrolled away.
  const anchor = document.querySelector('[data-cv-anchor="portfolio-link"]');
  if (anchor) {
    const root = document.documentElement;
    let pending = false;
    const update = () => {
      pending = false;
      const reached = anchor.getBoundingClientRect().top < window.innerHeight * 0.2;
      root.classList.toggle("cv-portfolio-link-shown", reached);
    };
    root.classList.add("cv-portfolio-link");
    update();
    window.addEventListener(
      "scroll",
      () => {
        if (pending) return;
        pending = true;
        requestAnimationFrame(update);
      },
      { passive: true },
    );
  }
}
// Project dialogs form a carousel in CV order: only the jobs shown on the CV render one.
function projectDialogs() {
  return [...document.querySelectorAll("dialog.project-dialog")];
}

function showSiblingDialog(current, step) {
  const dialogs = projectDialogs();
  const index = dialogs.indexOf(current);
  if (index === -1 || dialogs.length < 2) return;
  current.close();
  dialogs[(index + step + dialogs.length) % dialogs.length].showModal();
}

window.addEventListener("keydown", (event) => {
  if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
  const open = projectDialogs().find((dialog) => dialog.open);
  if (!open) return;
  event.preventDefault();
  showSiblingDialog(open, event.key === "ArrowRight" ? 1 : -1);
});

window.addEventListener("click", (event) => {
  // A click on the backdrop of a modal dialog targets the dialog itself: close it.
  if (event.target instanceof HTMLDialogElement && event.target.open) {
    event.target.close();
    return;
  }

  const target = event.target instanceof Element ? event.target.closest("[data-cv-action]") : null;
  if (!target) return;

  const action = target.getAttribute("data-cv-action");

  if (action === "open-dialog") {
    const dialog = document.getElementById(target.getAttribute("data-dialog") ?? "");
    if (dialog instanceof HTMLDialogElement) {
      event.preventDefault();
      const alone = projectDialogs().length < 2;
      for (const nav of document.querySelectorAll(".dialog-nav")) nav.hidden = alone;
      dialog.showModal();
    }
    return;
  }

  if (action === "close-dialog") {
    target.closest("dialog")?.close();
    return;
  }

  if (action === "dialog-prev" || action === "dialog-next") {
    showSiblingDialog(target.closest("dialog"), action === "dialog-next" ? 1 : -1);
    return;
  }

  if (action === "print") {
    window.print();
    return;
  }

  if (action === "share") {
    event.preventDefault();
    const url = window.location.href;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).catch(() => window.prompt("Copiez ce lien", url));
    } else {
      window.prompt("Copiez ce lien", url);
    }
  }
});
