// The only JavaScript the site ships, loaded on release pages only:
// reveals the "Copy link" button and copies the release URL.

const RESET_AFTER_MS = 2000;

function copyWithSelection(text: string): boolean {
  const field = document.createElement("textarea");
  field.value = text;
  field.setAttribute("readonly", "");
  field.style.position = "fixed";
  field.style.opacity = "0";
  document.body.append(field);
  field.select();
  const ok = document.execCommand("copy");
  field.remove();
  return ok;
}

async function copy(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return copyWithSelection(text);
  }
}

for (const button of document.querySelectorAll<HTMLButtonElement>("[data-copy-link]")) {
  const status = button.parentElement?.querySelector<HTMLElement>("[data-copy-status]");
  const idle = button.textContent;
  let timer: number | undefined;

  button.hidden = false;
  button.addEventListener("click", async () => {
    const ok = await copy(button.dataset.copyLink ?? location.href);
    button.textContent = ok ? "Copied" : "Copy failed";
    if (status) status.textContent = ok ? "Link copied to clipboard" : "Could not copy the link";

    window.clearTimeout(timer);
    timer = window.setTimeout(() => {
      button.textContent = idle;
      if (status) status.textContent = "";
    }, RESET_AFTER_MS);
  });
}

export {};
