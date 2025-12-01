import { useAccessibilityStore } from "@/stores/accessibility-store"

export function useAccessibilityClasses() {
  const { theme, fontFamily } = useAccessibilityStore()

  // Only contrast needs an extra class; light/dark are driven by .dark on <html>
  let contrastClass = ""
  if (theme === "contrast") {
    contrastClass = "app-theme-contrast"
  } else if (theme === "contrastLight") {
    contrastClass = "app-theme-contrast-light"
  }

  const fontFamilyClass =
    fontFamily === "serif"
      ? "app-font-serif"
      : fontFamily === "mono"
        ? "app-font-mono"
        : "app-font-sans"

  return { contrastClass, fontFamilyClass }
}
