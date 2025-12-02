import { create } from "zustand";

// High-level theme modes supported by the app.
// "contrastLight" is a high-contrast light variant for better readability.
export type ThemeMode = "light" | "dark" | "contrast" | "contrastLight";

// Global font-size presets for the UI (affect body text and numbers).
export type FontSize = "sm" | "md" | "lg";

// Global font-family options; the concrete stacks are defined in CSS.
export type FontFamily = "sans" | "serif" | "mono";

interface AccessibilityState {
  theme: ThemeMode;
  fontSize: FontSize;
  fontFamily: FontFamily;
  setTheme: (theme: ThemeMode) => void;
  setFontSize: (size: FontSize) => void;
  setFontFamily: (family: FontFamily) => void;
}

// Central store for accessibility-related UI preferences.
//
// This state is read by the Accessibility page and applied globally via
// the useAccessibilityEffects hook (which syncs values to <html> / CSS).
export const useAccessibilityStore = create<AccessibilityState>((set) => ({
  // Default theme is light; dark/contrast variants can be enabled by the user.
  theme: "light",
  // Medium font-size is the default; users can increase/decrease for readability.
  fontSize: "md",
  // Default font stack is sans-serif; others can be selected on the Accessibility page.
  fontFamily: "sans",

  setTheme(theme) {
    set({ theme });
  },

  setFontSize(fontSize) {
    set({ fontSize });
  },

  setFontFamily(fontFamily) {
    set({ fontFamily });
  },
}));
