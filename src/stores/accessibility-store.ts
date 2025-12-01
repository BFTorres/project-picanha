import { create } from "zustand"

export type ThemeMode = "light" | "dark" | "contrast" | "contrastLight"
export type FontSize = "sm" | "md" | "lg"
export type FontFamily = "sans" | "serif" | "mono"

interface AccessibilityState {
  theme: ThemeMode
  fontSize: FontSize
  fontFamily: FontFamily
  setTheme: (theme: ThemeMode) => void
  setFontSize: (size: FontSize) => void
  setFontFamily: (family: FontFamily) => void
}

export const useAccessibilityStore = create<AccessibilityState>((set) => ({
  theme: "light",
  fontSize: "md",
  fontFamily: "sans",
  setTheme(theme) {
    set({ theme })
  },
  setFontSize(fontSize) {
    set({ fontSize })
  },
  setFontFamily(fontFamily) {
    set({ fontFamily })
  },
}))
