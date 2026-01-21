export const VIEWS = [
  // Dashboard
  "dashboard-overview",
  "dashboard-analytics",
  "dashboard-watchlist",

  // Portfolio
  "portfolio",
  "portfolio-wallet",
  "portfolio-history",

  // Assets
  "assets-overview",
/*   "assets-crypto",
  "assets-fiat", */

  // Legal
  "legal-imprint",
  "legal-privacy",
  "legal-terms",

  // Accessibility
  "accessibility",
] as const;

export type ViewId = (typeof VIEWS)[number];