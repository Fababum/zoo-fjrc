// src/main.tsx
import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"
import "./index.css"   // <- sehr wichtig!
import { BrowserRouter } from "react-router-dom"
import { TranslationsProvider } from "./components/TranslationsContext";
import { AuthProvider } from "./components/AuthContext";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <TranslationsProvider>
          <App />
        </TranslationsProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
)
