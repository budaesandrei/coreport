import "@config/amplify";
import React from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import WebFont from "webfontloader";

WebFont.load({
  google: {
    families: ["Inter:400,500,600,700", "Roboto:400,500,600,700", "Righteous:400,500,600,700"],
  },
});

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
