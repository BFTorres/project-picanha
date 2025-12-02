import React from "react"
import ReactDOM from "react-dom/client"
import "./index.css"
import "./i18n"
import { ThemeProvider } from "./context/theme-context"
import { App } from "./App"

// Entry point for the React application.
//
// Vite injects a <div id="root"> into index.html.
// Here we tell React to take over that element and render our component tree into it.
ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  // StrictMode enables additional checks and warnings in development.
  // It does not affect production builds but helps catch bad patterns early.
  <React.StrictMode>
    {/* ThemeProvider exposes the current theme + setters via React context.
        This wraps the entire app, so every component can read theme settings. */}
    <ThemeProvider>
      {/* App contains the actual application shell and all pages (dashboard, info, etc.). */}
      <App />
    </ThemeProvider>
  </React.StrictMode>,
)
