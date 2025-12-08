import { useState } from "react";
import { DashboardPage } from "./pages/DashboardPage";
import { ImprintPage } from "./pages/ImprintPage";
import { AppLayout } from "./components/layout/AppLayout";
import type { ViewId } from "@/types/view";
import { useAccessibilityEffects } from "@/hooks/useAccessibilityEffects";
import { AccessibilityPage } from "./pages/AccessibilityPage";
import { InformationPage } from "./pages/InformationPage";
import { DashboardAnalyticsPage } from "./pages/DashboardAnalyticsPage";
import { DashboardWatchlistPage } from "./pages/DashboardWatchlistPage";
import { AssetsCryptoPage } from "./pages/AssetsCryptoPage";
import { AssetsFiatPage } from "./pages/AssetsFiatPage";
import { LegalPrivacyPage } from "./pages/LegalPrivacyPage";
import { LegalTermsPage } from "./pages/LegalTermsPage";
import { AdamSandboxPage } from "./pages/AdamSandboxPage";

// Root React component of the application.
// This is basically our “router” for the different views (dashboard, info, etc.),
// but implemented with local state instead of React Router.
export function App() {
  // `route` holds the currently active view.
  // The union type `ViewId` ensures we only use valid view names.
  const [route, setRoute] = useState<ViewId>("dashboard-overview");

  // Apply global accessibility / theme / font-size effects to the <html> element.
  // This hook syncs the accessibility store (Zustand) with the real DOM.
  useAccessibilityEffects();

  let content;
  // Decide which page component to render based on the current route.
  switch (route) {
    // Dashboard group
    case "dashboard-overview":
      content = <DashboardPage />;
      break;
    case "dashboard-analytics":
      content = <DashboardAnalyticsPage />;
      break;
    case "dashboard-watchlist":
      content = <DashboardWatchlistPage />;
      break;

    // Assets group
    case "assets-overview":
      content = <InformationPage />;
      break;
    case "assets-crypto":
      content = <AssetsCryptoPage />;
      break;
    case "assets-fiat":
      content = <AssetsFiatPage />;
      break;

    // Legal group
    case "legal-imprint":
      content = <ImprintPage />;
      break;
    case "legal-privacy":
      content = <LegalPrivacyPage />;
      break;
    case "legal-terms":
      content = <LegalTermsPage />;
      break;

    // Accessibility (no sub-pages)
    case "accessibility":
    default:
      content = <AccessibilityPage />;
      break;
    // Adam Sandbox
    case "adamsandbox":
      content = <AdamSandboxPage />;
      break;
  }

  // AppLayout renders the shared shell (sidebar, topbar, etc.)
  // and receives the active route + a navigation callback.
  // Child pages are injected via the `children` prop.
  return (
    <AppLayout activeRoute={route} onNavigate={setRoute}>
      {content}
    </AppLayout>
  );
}
