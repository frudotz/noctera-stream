// Development entry. Production builds prerender the page to static HTML
// (see scripts/prerender.mjs) and ship no client-side JavaScript.
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import "./styles.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
