import { create } from "zustand"

// High-level theme modes supported by the app.
// "contrastLight" is a high-contrast light variant for better readability.
export type ThemeMode = "light" | "dark" | "contrast" | "contrastLight"

// Global font-size presets for the UI (affect body text and numbers).
export type FontSize = "sm" | "md" | "lg"

// Global font-family options; the concrete stacks are defined in CSS.
export type FontFamily = "sans" | "serif" | "mono"

interface AccessibilityState {
  theme: ThemeMode
  fontSize: FontSize
  fontFamily: FontFamily

  // New phase 1 toggles
  reducedMotion: boolean
  highVisibilityLinks: boolean
  strongFocusOutline: boolean

  setTheme: (theme: ThemeMode) => void
  setFontSize: (size: FontSize) => void
  setFontFamily: (family: FontFamily) => void

  setReducedMotion: (enabled: boolean) => void
  setHighVisibilityLinks: (enabled: boolean) => void
  setStrongFocusOutline: (enabled: boolean) => void
}

// Central store for accessibility-related UI preferences.
//
// This state is read by the Accessibility page and applied globally via
// the useAccessibilityEffects hook (which syncs values to <html> / CSS).
export const useAccessibilityStore = create<AccessibilityState>((set) => ({
  // Theme + typography defaults
  theme: "light",
  fontSize: "md",
  fontFamily: "sans",

  // Phase 1 extras: all off by default
  reducedMotion: false,
  highVisibilityLinks: false,
  strongFocusOutline: false,

  setTheme(theme) {
    set({ theme })
  },

  setFontSize(fontSize) {
    set({ fontSize })
  },

  setFontFamily(fontFamily) {
    set({ fontFamily })
  },

  setReducedMotion(reducedMotion) {
    set({ reducedMotion })
  },

  setHighVisibilityLinks(highVisibilityLinks) {
    set({ highVisibilityLinks })
  },

  setStrongFocusOutline(strongFocusOutline) {
    set({ strongFocusOutline })
  },
}))
