// src/types/view.ts

// All views in the app, including sub-pages under each main section.
//
// - Dashboard has three sub-pages
// - Assets has three sub-pages
// - Legal has three sub-pages
// - Accessibility is a single page (no sub-pages)
export type ViewId =
  | "dashboard-overview"
  | "dashboard-analytics"
  | "dashboard-watchlist"
  | "assets-overview"
  | "assets-crypto"
  | "assets-fiat"
  | "legal-imprint"
  | "legal-privacy"
  | "legal-terms"
  | "accessibility"
