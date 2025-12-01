import { useState } from "react"
import { DashboardPage } from "./pages/DashboardPage"
import { ImprintPage } from "./pages/ImprintPage"
import { AppLayout } from "./components/layout/AppLayout"
import type { ViewId } from "@/types/view"
import { useAccessibilityEffects } from "@/hooks/useAccessibilityEffects"
import { AccessibilityPage } from "./pages/AccessibilityPage"

/* export type AppRoute = ViewId */

function App() {
  const [route, setRoute] = useState<ViewId>("dashboard")

  useAccessibilityEffects()

  let content
  if (route === "dashboard") {
    content = <DashboardPage />
  } else if (route === "imprint") {
    content = <ImprintPage />
  } else {
    // "accessibility"
    content = <AccessibilityPage />
  }

  return (
    <AppLayout activeRoute={route} onNavigate={setRoute}>
      {content}
    </AppLayout>
  )
}

export default App