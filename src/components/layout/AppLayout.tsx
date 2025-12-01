import type { ReactNode } from "react"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
/* import type { ViewId } from "@/types/view" */
import { useAccessibilityStore } from "@/stores/accessibility-store"
import { useUiStore } from "@/stores/ui-store"
import { useAccessibilityClasses } from "@/hooks/useAccessibilityClasses"


/* type AppLayoutProps = {
  activeRoute: ViewId
  onNavigate: (route: ViewId) => void
  children: React.ReactNode
} */

  type AppLayoutProps = {
  children: ReactNode
  activeRoute: "dashboard" | "imprint"
  onNavigate: (route: "dashboard" | "imprint") => void
}


export function AppLayout({ children, activeRoute, onNavigate }: AppLayoutProps) {
  const { t } = useTranslation()
  const { mobileSidebarOpen, toggleMobileSidebar, closeMobileSidebar } =
    useUiStore()

  const { contrastClass, fontFamilyClass } = useAccessibilityClasses()

  const rootClasses = cn(
    "app-root flex min-h-screen bg-background text-foreground",
    contrastClass,
    fontFamilyClass,
    fontFamilyClass,
  )

  function handleNavigate(route: "dashboard" | "imprint") {
    onNavigate(route)
    closeMobileSidebar()
  }

  return (
    <div className={rootClasses}>
      {/* Desktop sidebar */}
      <aside className="hidden w-56 flex-col border-r bg-muted/40 p-4 md:flex lg:w-64">
        <SidebarContent activeRoute={activeRoute} onNavigate={onNavigate} />
      </aside>

      {/* Main content */}
      <div className="flex min-h-screen flex-1 flex-col">
        <header className="flex h-14 items-center justify-between border-b bg-background/80 px-4 backdrop-blur md:h-16 md:px-6">
          {/* Mobile: burger + logo */}
          <div className="flex items-center gap-2 md:hidden">
            <Button
              variant="outline"
              size="icon"
              type="button"
              onClick={toggleMobileSidebar}
              aria-label={t("nav.openSidebar", "Open navigation")}
            >
              <span className="text-lg">☰</span>
            </Button>
            <span className="text-sm font-semibold">Project Picanha</span>
          </div>

          {/* Desktop: logo + subtitle */}
          <div className="hidden items-center gap-2 md:flex">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <span className="text-sm font-bold">PP</span>
            </div>
            <div>
              <p className="text-sm font-semibold">Project Picanha</p>
              <p className="text-sm text-muted-foreground">
                {t("nav.subtitle", "React + Coinbase sandbox")}
              </p>
            </div>
          </div>

          <div className="flex flex-1 justify-end">
            <HeaderLanguageToggle />
          </div>
        </header>

        <main className="flex-1 space-y-4 p-4 md:p-6">{children}</main>
      </div>

      {/* Mobile sidebar overlay */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div className="flex w-64 flex-col border-r bg-muted/40 p-4">
            <SidebarContent
              activeRoute={activeRoute}
              onNavigate={handleNavigate}
            />
          </div>
          <button
            type="button"
            className="flex-1 bg-black/40"
            onClick={closeMobileSidebar}
            aria-label={t("nav.closeSidebar", "Close navigation")}
          />
        </div>
      )}
    </div>
  )
}

type SidebarContentProps = {
  activeRoute: "dashboard" | "imprint"
  onNavigate: (route: "dashboard" | "imprint") => void
}

function SidebarContent({ activeRoute, onNavigate }: SidebarContentProps) {
  const { t } = useTranslation()

  return (
    <>
      <nav className="mb-6 space-y-1">
        <SidebarItem
          label={t("nav.dashboard", "Dashboard")}
          active={activeRoute === "dashboard"}
          onClick={() => onNavigate("dashboard")}
        />
        <SidebarItem
          label={t("nav.imprint", "Imprint")}
          active={activeRoute === "imprint"}
          onClick={() => onNavigate("imprint")}
        />
      </nav>

      <AccessibilitySection />

      <div className="mt-auto space-y-2 border-t pt-4 text-sm text-muted-foreground">
        <p className="font-medium">
          {t("nav.infoTitle", "Sandbox only")}
        </p>
        <p>
          {t(
            "nav.infoBody",
            "No real customer data. Public Coinbase API only.",
          )}
        </p>
      </div>
    </>
  )
}

type SidebarItemProps = {
  label: string
  active?: boolean
  onClick?: () => void
}

function SidebarItem({ label, active, onClick }: SidebarItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center rounded-md px-2 py-1.5 text-sm transition hover:bg-accent hover:text-accent-foreground",
        active && "bg-accent text-accent-foreground",
      )}
    >
      <span className="truncate">{label}</span>
    </button>
  )
}

function HeaderLanguageToggle() {
  const { i18n } = useTranslation()
  const isDe = i18n.language.startsWith("de")
  const currentLang = isDe ? "de" : "en"

  function toggleLanguage() {
    void i18n.changeLanguage(currentLang === "de" ? "en" : "de")
  }

  return (
    <Button
      variant="outline"
      size="sm"
      type="button"
      onClick={toggleLanguage}
      aria-label={currentLang === "de" ? "Switch to English" : "Auf Deutsch umschalten"}
    >
      {currentLang === "de" ? "DE" : "EN"}
    </Button>
  )
}

function AccessibilitySection() {
  const { t } = useTranslation()
  const { theme, fontSize, fontFamily, setTheme, setFontSize, setFontFamily } =
    useAccessibilityStore()

  return (
    <section aria-label={t("a11y.sectionTitle", "Accessibility settings")}>
      <h2 className="mb-2 text-sm font-semibold uppercase text-muted-foreground">
        {t("a11y.title", "Accessibility")}
      </h2>

      <div className="mb-3 space-y-1">
        <p className="text-sm font-medium">
          {t("a11y.themeLabel", "Theme")}
        </p>
        <div className="flex gap-1">
          <Button
            type="button"
            variant={theme === "light" ? "default" : "outline"}
            size="sm"
            onClick={() => setTheme("light")}
          >
            {t("a11y.themeLight", "Light")}
          </Button>
          <Button
            type="button"
            variant={theme === "dark" ? "default" : "outline"}
            size="sm"
            onClick={() => setTheme("dark")}
          >
            {t("a11y.themeDark", "Dark")}
          </Button>
          <Button
            type="button"
            variant={theme === "contrast" ? "default" : "outline"}
            size="sm"
            onClick={() => setTheme("contrast")}
          >
            {t("a11y.themeContrast", "High contrast")}
          </Button>
        </div>
      </div>

      <div className="mb-3 space-y-1">
        <p className="text-sm font-medium">
          {t("a11y.fontSizeLabel", "Font size")}
        </p>
        <div className="flex gap-1">
          <Button
            type="button"
            variant={fontSize === "sm" ? "default" : "outline"}
            size="sm"
            onClick={() => setFontSize("sm")}
          >
            A-
          </Button>
          <Button
            type="button"
            variant={fontSize === "md" ? "default" : "outline"}
            size="sm"
            onClick={() => setFontSize("md")}
          >
            A
          </Button>
          <Button
            type="button"
            variant={fontSize === "lg" ? "default" : "outline"}
            size="sm"
            onClick={() => setFontSize("lg")}
          >
            A+
          </Button>
        </div>
      </div>

      <div className="space-y-1">
        <p className="text-sm font-medium">
          {t("a11y.fontFamilyLabel", "Font family")}
        </p>
        <div className="flex flex-wrap gap-1">
          <Button
            type="button"
            variant={fontFamily === "sans" ? "default" : "outline"}
            size="sm"
            onClick={() => setFontFamily("sans")}
          >
            {t("a11y.fontSystem", "Sans")}
          </Button>
          <Button
            type="button"
            variant={fontFamily === "serif" ? "default" : "outline"}
            size="sm"
            onClick={() => setFontFamily("serif")}
          >
            {t("a11y.fontSerif", "Serif")}
          </Button>
          <Button
            type="button"
            variant={fontFamily === "mono" ? "default" : "outline"}
            size="sm"
            onClick={() => setFontFamily("mono")}
          >
            {t("a11y.fontMono", "Mono")}
          </Button>
        </div>
      </div>
    </section>
  )
}