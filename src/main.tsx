
import { createRoot } from "react-dom/client";
import { posthog } from "posthog-js";
import App from "./app/App.tsx";
import "./styles/index.css";

posthog.init("phc_yZronDsSBUe4Tep683sYAURMqwZp6Kdaog3if7n8C8b5", {
  api_host: "https://eu.i.posthog.com",
  autocapture: true,
  capture_pageview: true,
});

createRoot(document.getElementById("root")!).render(<App />);
  