// DESIGN PREVIEW only (/preview/noctera-theme/). Loads the preview stylesheet and
// turns each [data-nx-tabs] group into tabs: the release covers switch the stage,
// the artist names switch the portrait. Without this script every tab is a plain
// link to its own page and the first panel stays visible.
import "./theme.css";

for (const group of document.querySelectorAll<HTMLElement>("[data-nx-tabs]")) {
  const list = group.querySelector<HTMLElement>("[data-nx-tablist]");
  const tabs = [...group.querySelectorAll<HTMLAnchorElement>("[data-nx-tab]")];
  const panelOf = (tab: HTMLElement) => document.getElementById(tab.getAttribute("aria-controls") ?? "");
  if (!list || tabs.length < 2 || tabs.some((tab) => !panelOf(tab))) continue;

  list.setAttribute("role", "tablist");
  list.setAttribute("aria-orientation", list.dataset.nxOrientation ?? "vertical");
  for (const item of list.children) item.setAttribute("role", "presentation");

  const select = (next: HTMLAnchorElement, focus: boolean) => {
    for (const tab of tabs) {
      const on = tab === next;
      const panel = panelOf(tab)!;
      tab.setAttribute("aria-selected", String(on));
      tab.tabIndex = on ? 0 : -1;
      tab.toggleAttribute("data-active", on);
      panel.toggleAttribute("data-active", on);
    }
    if (focus) next.focus();
  };

  tabs.forEach((tab, i) => {
    tab.setAttribute("role", "tab");
    tab.id ||= `${tab.getAttribute("aria-controls")}-tab`;
    const panel = panelOf(tab)!;
    panel.setAttribute("role", "tabpanel");
    panel.setAttribute("aria-labelledby", tab.id);

    tab.addEventListener("click", (event) => {
      event.preventDefault();
      select(tab, false);
    });
    tab.addEventListener("keydown", (event) => {
      const last = tabs.length - 1;
      const target = {
        ArrowDown: i + 1,
        ArrowRight: i + 1,
        ArrowUp: i - 1,
        ArrowLeft: i - 1,
        Home: 0,
        End: last,
      }[event.key];
      if (target === undefined) return;
      event.preventDefault();
      select(tabs[(target + tabs.length) % tabs.length], true);
    });
  });

  select(tabs.find((tab) => tab.hasAttribute("data-active")) ?? tabs[0], false);
  group.setAttribute("data-nx-ready", "");
}

export {};
