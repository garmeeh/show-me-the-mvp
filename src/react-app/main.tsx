import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { PrototypeHost } from "./prototype/prototype-host.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    {/* PROTOTYPE, throw away: theme variants in dev only. */}
    {import.meta.env.DEV ? <PrototypeHost /> : <App />}
  </StrictMode>,
);
