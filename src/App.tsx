import { useState } from "react"
import { DashboardPage } from "./pages/DashboardPage"
import { ImprintPage } from "./pages/ImprintPage"
import { AppLayout } from "./components/layout/AppLayout"

export type AppRoute = "dashboard" | "imprint"

export default function App() {
  const [route, setRoute] = useState<AppRoute>("dashboard")

  return (
    <AppLayout activeRoute={route} onNavigate={setRoute}>
      {route === "dashboard" ? <DashboardPage /> : <ImprintPage />}
    </AppLayout>
  )
}
/* export type ViewId = "dashboard" | "imprint"

export const App: React.FC = () => {
  const [view, setView] = useState<ViewId>("dashboard")
  const { theme, fontFamily, fontSize } = useThemeSettings()

  const themeClass =
    theme === "light"
      ? "app-theme-light"
      : theme === "dark"
      ? "app-theme-dark"
      : "app-theme-contrast"

  const fontFamilyClass =
    fontFamily === "sans"
      ? "app-font-sans"
      : fontFamily === "serif"
      ? "app-font-serif"
      : "app-font-mono"

  const fontSizeClass =
    fontSize === "sm"
      ? "app-font-size-sm"
      : fontSize === "lg"
      ? "app-font-size-lg"
      : "app-font-size-md"

  return (
    <div className={cn("app-root", themeClass, fontFamilyClass, fontSizeClass)}>
      <AppShell currentView={view} onNavigate={setView}>
        {view === "dashboard" ? <DashboardPage /> : <ImprintPage />}
      </AppShell>
    </div>
  )
} */
