/* import type { ReactNode } from "react" */
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { ViewId } from "@/types/view"

type AppLayoutProps = {
  activeRoute: ViewId
  onNavigate: (route: ViewId) => void
  children: React.ReactNode
}

export function AppLayout({ children, activeRoute, onNavigate }: AppLayoutProps) {
  const { t } = useTranslation()

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      {/* Sidebar */}
      <aside className="hidden w-56 flex-col border-r bg-muted/40 p-4 md:flex lg:w-64">
        <div className="mb-6 flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <span className="text-xs font-bold">PP</span>
          </div>
          <div>
            <p className="text-sm font-semibold">Project Picanha</p>
            <p className="text-xs text-muted-foreground">
              {t("nav.subtitle", "React + Coinbase sandbox")}
            </p>
          </div>
        </div>

        <nav className="space-y-1">
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

        <div className="mt-auto space-y-2 text-xs text-muted-foreground">
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
      </aside>

      {/* Main content */}
      <div className="flex min-h-screen flex-1 flex-col">
        <SiteHeader />
        <main className="flex-1 space-y-4 p-4 md:p-6">{children}</main>
      </div>
    </div>
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

function SiteHeader() {
  const { i18n } = useTranslation()

  const isDe = i18n.language.startsWith("de")
  const currentLang = isDe ? "de" : "en"

  function toggleLanguage() {
    void i18n.changeLanguage(currentLang === "de" ? "en" : "de")
  }

  return (
    <header className="flex h-14 items-center justify-between border-b bg-background/80 px-4 backdrop-blur md:h-16 md:px-6">
      <div className="flex items-center gap-2 md:hidden">
        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary text-primary-foreground">
          <span className="text-xs font-bold">PP</span>
        </div>
        <span className="text-sm font-semibold">Project Picanha</span>
      </div>

      <div className="flex-1" />

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          type="button"
          onClick={toggleLanguage}
          aria-label={currentLang === "de" ? "Switch to English" : "Auf Deutsch umschalten"}
        >
          {currentLang === "de" ? "DE" : "EN"}
        </Button>
      </div>
    </header>
  )
}
