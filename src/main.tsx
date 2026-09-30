// Development entry. Production builds prerender every page to static HTML
// (see scripts/prerender.mjs); only release pages get a small script.
import { StrictMode } from "react";
import { flushSync } from "react-dom";
import { createRoot } from "react-dom/client";
import { findPage } from "./routes";
import "./styles.css";

const page = findPage(location.pathname);
document.title = page.meta.title;

const root = createRoot(document.getElementById("root")!);
flushSync(() => root.render(<StrictMode>{page.element}</StrictMode>));

if (import.meta.env.DEV && page.scripts.includes("copy-link")) {
  void import("./client/copy-link");
}
