import { useState } from "react"
import { DashboardPage } from "./pages/DashboardPage"
import { ImprintPage } from "./pages/ImprintPage"
import { AppLayout } from "./components/layout/AppLayout"
import type { ViewId } from "@/types/view"
import { useAccessibilityEffects } from "@/hooks/useAccessibilityEffects"
import { AccessibilityPage } from "./pages/AccessibilityPage"
import { InformationPage } from "./pages/InformationPage"

// Root React component of the application.
// This is basically our “router” for the different views (dashboard, info, etc.),
// but implemented with local state instead of React Router.
export function App() {
  // `route` holds the currently active view.
  // The union type `ViewId` ensures we only use valid view names.
  const [route, setRoute] = useState<ViewId>("dashboard")

  // Apply global accessibility / theme / font-size effects to the <html> element.
  // This hook syncs the accessibility store (Zustand) with the real DOM.
  useAccessibilityEffects()

  // Decide which page component to render based on the current route.
  let content
  if (route === "dashboard") {
    content = <DashboardPage />
  } else if (route === "information") {
    content = <InformationPage />
  } else if (route === "accessibility") {
    content = <AccessibilityPage />
  } else {
    // Fallback route: imprint / legal page.
    content = <ImprintPage />
  }

  // AppLayout renders the shared shell (sidebar, topbar, etc.)
  // and receives the active route + a navigation callback.
  // Child pages are injected via the `children` prop.
  return (
    <AppLayout activeRoute={route} onNavigate={setRoute}>
      {content}
    </AppLayout>
  )
}
