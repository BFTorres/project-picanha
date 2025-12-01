import { useEffect } from "react"
import { useAccessibilityStore } from "@/stores/accessibility-store"

export function useAccessibilityEffects() {
  const { theme, fontSize } = useAccessibilityStore()

  // Light / Dark / Contrast -> control Tailwind's .dark class
  useEffect(() => {
    const root = document.documentElement

    if (theme === "dark" || theme === "contrast") {
      root.classList.add("dark")
    } else {
      root.classList.remove("dark")
    }
  }, [theme])

  // Font size -> change <html> font-size so rem-based text & numbers scale
  useEffect(() => {
    const root = document.documentElement

    if (fontSize === "sm") {
      root.style.fontSize = "14px"
    } else if (fontSize === "lg") {
      root.style.fontSize = "18px"
    } else {
      root.style.fontSize = "16px"
    }
  }, [fontSize])
}
