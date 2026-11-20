// No framework, no hydration: this only enhances the buttons of the static CV page.
window.addEventListener("click", (event) => {
  const target = event.target instanceof Element ? event.target.closest("[data-cv-action]") : null;
  if (!target) return;

  const action = target.getAttribute("data-cv-action");

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
