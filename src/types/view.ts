export const VIEWS = [
  "dashboard-overview",
  "dashboard-analytics",
  "dashboard-watchlist",
  "portfolio",
  "assets-overview",
  "assets-crypto",
  "assets-fiat",
  "legal-imprint",
  "legal-privacy",
  "legal-terms",
  "accessibility",
] as const;

export type ViewId = (typeof VIEWS)[number];