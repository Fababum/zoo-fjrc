// src/main.tsx
import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import "./index.css"   // <- sehr wichtig!
import { BrowserRouter } from "react-router-dom"
import { TranslationsProvider } from "./components/TranslationsContext";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <TranslationsProvider>
        <App />
      </TranslationsProvider>
    </BrowserRouter>
  </React.StrictMode>
)
