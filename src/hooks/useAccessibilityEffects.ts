// src/hooks/useAccessibilityEffects.ts
import { useEffect } from "react"
import { useTranslation } from "react-i18next"
import { useAccessibilityStore } from "@/stores/accessibility-store"

// Syncs accessibility preferences from Zustand to the real DOM.
//
// This hook is called once in App.tsx, and then reacts whenever accessibility
// state or the active language changes.
export function useAccessibilityEffects() {
  const {
    theme,
    fontSize,
    fontFamily,
    lineHeight,
    reducedMotion,
    highVisibilityLinks,
    strongFocusOutline,
    highlightHeadings,
  } = useAccessibilityStore()

  const { i18n } = useTranslation()

  useEffect(() => {
    const root = document.documentElement

    // --- Theme --------------------------------------------------------------
    root.classList.remove(
      "app-theme-light",
      "app-theme-dark",
      "app-theme-contrast",
      "app-theme-contrast-light",
    )

    const themeClass =
      theme === "light"
        ? "app-theme-light"
        : theme === "dark"
        ? "app-theme-dark"
        : theme === "contrast"
        ? "app-theme-contrast"
        : "app-theme-contrast-light"

    root.classList.add(themeClass)

    // Tailwind dark tokens flag
    const shouldUseDarkTokens =
      theme === "dark" || theme === "contrast"
    root.classList.toggle("dark", shouldUseDarkTokens)

    // --- Font size ----------------------------------------------------------
    root.classList.remove(
      "app-font-size-sm",
      "app-font-size-md",
      "app-font-size-lg",
    )
    root.classList.add(`app-font-size-${fontSize}`)

    // --- Font family --------------------------------------------------------
    root.classList.remove(
      "app-font-sans",
      "app-font-serif",
      "app-font-mono",
      "app-font-highLegibility",
    )
    root.classList.add(`app-font-${fontFamily}`)

    // --- Line height / text spacing ----------------------------------------
    root.classList.remove(
      "app-line-normal",
      "app-line-relaxed",
      "app-line-loose",
    )
    root.classList.add(`app-line-${lineHeight}`)

    // --- Reduced motion -----------------------------------------------------
    root.classList.toggle("app-reduced-motion", reducedMotion)

    // --- High-visibility links ---------------------------------------------
    root.classList.toggle("app-high-vis-links", highVisibilityLinks)

    // --- Strong focus outline ----------------------------------------------
    root.classList.toggle("app-strong-focus", strongFocusOutline)

    // --- Highlight headings -------------------------------------------------
    root.classList.toggle("app-highlight-headings", highlightHeadings)

    // --- Language of page (WCAG 3.1.1) -------------------------------------
    const lang =
      i18n.language && i18n.language.length > 1
        ? i18n.language.slice(0, 2)
        : "de"
    root.setAttribute("lang", lang)
  }, [
    theme,
    fontSize,
    fontFamily,
    lineHeight,
    reducedMotion,
    highVisibilityLinks,
    strongFocusOutline,
    highlightHeadings,
    i18n.language,
  ])
}
