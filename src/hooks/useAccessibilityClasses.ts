import { useAccessibilityStore } from "@/stores/accessibility-store"

export function useAccessibilityClasses() {
  const { theme, fontFamily } = useAccessibilityStore()

  // Only contrast needs an extra class; light/dark are driven by .dark on <html>
  const contrastClass = theme === "contrast" ? "app-theme-contrast" : ""

  const fontFamilyClass =
    fontFamily === "serif"
      ? "app-font-serif"
      : fontFamily === "mono"
        ? "app-font-mono"
        : "app-font-sans"

  return { contrastClass, fontFamilyClass }
}
