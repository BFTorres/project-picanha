import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import "./i18n"
import { ThemeProvider } from "@/context/theme-context"
import App from "./App"



ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider>
        <App />
    </ThemeProvider>
  </React.StrictMode>,
)
