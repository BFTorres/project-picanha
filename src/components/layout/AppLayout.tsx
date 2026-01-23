import { useState, type ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useAccessibilityStore } from "@/stores/accessibility-store";
import { useUiStore } from "@/stores/ui-store";
import { useAccessibilityClasses } from "@/hooks/useAccessibilityClasses";
import type { ViewId } from "@/types/view";
import type { LucideIcon } from "lucide-react";
/* import { Languages } from 'lucide-react'; */
import {
  LayoutDashboard,
  Coins,
  Scale,
  Accessibility as AccessibilityIcon,
  ChevronRight,
  Wallet,
  ShieldBan
} from "lucide-react";

type AppLayoutProps = {
  children: ReactNode;
  activeRoute: ViewId;
  onNavigate: (route: ViewId) => void;
};

export function AppLayout({
  children,
  activeRoute,
  onNavigate,
}: AppLayoutProps) {
  const { t } = useTranslation();
  const { mobileSidebarOpen, toggleMobileSidebar, closeMobileSidebar } =
    useUiStore();

  const { contrastClass, fontFamilyClass } = useAccessibilityClasses();

  const rootClasses = cn(
    "app-root flex min-h-screen bg-background text-foreground",
    contrastClass,
    fontFamilyClass
  );

  function handleNavigate(route: ViewId) {
    onNavigate(route);
    closeMobileSidebar();
  }

  return (
    <div className={rootClasses}>
      {/* Desktop sidebar */}
      <aside className="hidden w-56 flex-col border-r bg-muted/40 p-4 md:flex lg:w-64">
        <SidebarContent activeRoute={activeRoute} onNavigate={onNavigate} />
      </aside>

      {/* Main content */}
      <div className="flex min-h-screen flex-1 min-w-0 flex-col">
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

          <div className="flex flex-1 justify-end gap-2">
            <ThemeToggleButtonVariant3 />
            <HeaderLanguageToggle />
          </div>
        </header>

        <main className="flex-1 min-w-0 w-full max-w-full space-y-4 p-4 md:p-6">
          {children}
        </main>
      </div>

      {/* Mobile sidebar overlay */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div className="flex w-64 flex-col border-r bg-background p-4 shadow-lg">
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
  );
}

type SidebarContentProps = {
  activeRoute: ViewId;
  onNavigate: (route: ViewId) => void;
};

function SidebarContent({ activeRoute, onNavigate }: SidebarContentProps) {
  const { t } = useTranslation();

  type NavSectionId =
    | "dashboard"
    | "portfolio"
    | "assets"
    | "legal"
    | "auth"
    | "accessibility";

  interface NavItemConfig {
    id: ViewId;
    label: string;
  }

  interface NavSectionConfig {
    id: NavSectionId;
    label: string;
    icon: LucideIcon;
    collapsible: boolean;
    items: NavItemConfig[];
  }

  const sections: NavSectionConfig[] = [
    {
      id: "dashboard",
      label: t("nav.dashboard", "Dashboard"),
      icon: LayoutDashboard,
      collapsible: true,
      items: [
        {
          id: "dashboard-overview" as ViewId,
          label: t("nav.dashboardOverview", "Overview"),
        },
/*         {
          id: "dashboard-analytics" as ViewId,
          label: t("nav.dashboardAnalytics", "Analytics"),
        },
        {
          id: "dashboard-watchlist" as ViewId,
          label: t("nav.dashboardWatchlist", "Watchlist"),
        }, */
      ],
    },
    {
      id: "portfolio",
      label: t("nav.portfolio", "Portfolio"),
      icon: Wallet,
      collapsible: true,
      items: [
        {
          id: "portfolio-wallet" as ViewId,
          label: t("nav.portfolioWallet", "Wallet"),
        },
        {
          id: "portfolio-history" as ViewId,
          label: t("nav.portfolioHistory", "History"),
        },
      ],
    },
    {
      id: "assets",
      label: t("nav.assets", "Assets"),
      icon: Coins,
      collapsible: true,
      items: [
        {
          id: "assets-overview" as ViewId,
          label: t("nav.assetsOverview", "Overview"),
        },
/*         {
          id: "assets-crypto" as ViewId,
          label: t("nav.assetsCrypto", "Crypto"),
        },
        {
          id: "assets-fiat" as ViewId,
          label: t("nav.assetsFiat", "Fiat"),
        }, */
      ],
    },
    {
      id: "legal",
      label: t("nav.legal", "Legal"),
      icon: Scale,
      collapsible: true,
      items: [
        {
          id: "legal-imprint" as ViewId,
          label: t("nav.legalImprint", "Imprint"),
        },
        {
          id: "legal-privacy" as ViewId,
          label: t("nav.legalPrivacy", "Privacy"),
        },
        {
          id: "legal-terms" as ViewId,
          label: t("nav.legalTerms", "Terms & conditions"),
        },
      ],
    },
    {
      id: "auth",
      label: t("nav.auth", "Auth"),
      icon: ShieldBan,
      collapsible: true,
      items: [
        {
          id: "login" as ViewId,
          label: t("nav.login", "Login"),
        }
      ],
    },
    {
      id: "accessibility",
      label: t("nav.accessibility", "Accessibility"),
      icon: AccessibilityIcon,
      collapsible: false,
      items: [
        {
          id: "accessibility" as ViewId,
          label: t("nav.accessibility", "Accessibility"),
        },
      ],
    },
    
  ];

  const [openSections, setOpenSections] = useState<Record<NavSectionId, boolean>>({
    dashboard: true,
    portfolio: true,
    assets: false,
    legal: false,
    auth: false,
    accessibility: true,
  });

  function toggleSection(id: NavSectionId) {
    setOpenSections((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  }

  return (
    <>
      <nav className="mb-6 space-y-1">
        {sections.map((section) => {
          const Icon = section.icon;

          if (!section.collapsible) {
            const item = section.items[0];
            const isActive = activeRoute === item.id;

            return (
              <div key={section.id} className="space-y-0.5">
                <SidebarItem
                  label={section.label}
                  active={isActive}
                  onClick={() => onNavigate(item.id)}
                  icon={<Icon className="h-4 w-4" aria-hidden="true" />}
                />
              </div>
            );
          }

          const isAnyChildActive = section.items.some(
            (item) => item.id === activeRoute
          );
          const isOpen = openSections[section.id];

          return (
            <div key={section.id} className="space-y-0.5">
              {/* Section header with icon + chevron */}
              <button
                type="button"
                onClick={() => toggleSection(section.id)}
                className={cn(
                  "flex w-full items-center rounded-md px-2 py-1.5 text-sm transition hover:bg-accent hover:text-accent-foreground",
                  isAnyChildActive && "bg-accent text-accent-foreground"
                )}
                aria-expanded={isOpen}
              >
                <Icon className="mr-2 h-4 w-4" aria-hidden="true" />
                <span className="flex-1 text-left">{section.label}</span>
                <ChevronRight
                  className={cn(
                    "h-3 w-3 transition-transform",
                    isOpen && "rotate-90"
                  )}
                  aria-hidden="true"
                />
              </button>

              {/* Sub-items */}
              {isOpen && (
                <div className="mt-0.5 space-y-0.5">
                  {section.items.map((item) => {
                    const isActive = activeRoute === item.id;
                    return (
                      <SidebarItem
                        key={item.id}
                        label={item.label}
                        active={isActive}
                        onClick={() => onNavigate(item.id)}
                        className="pl-7 text-sm"
                      />
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      <div className="mt-auto space-y-2 border-t pt-4 text-xs text-muted-foreground">
        <p className="font-medium">{t("nav.infoTitle", "Sandbox only")}</p>
        <p>
          {t(
            "nav.infoBody",
            "No real customer data. Public Coinbase API only."
          )}
        </p>
      </div>
    </>
  );
}

type SidebarItemProps = {
  label: string;
  active?: boolean;
  onClick?: () => void;
  className?: string;
  icon?: ReactNode;
};

function SidebarItem({
  label,
  active,
  onClick,
  className,
  icon,
}: SidebarItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center rounded-md px-2 py-1.5 text-sm transition hover:bg-accent hover:text-accent-foreground",
        active && "bg-accent text-accent-foreground",
        className
      )}
    >
      {icon && (
        <span className="mr-2 inline-flex h-4 w-4 items-center justify-center">
          {icon}
        </span>
      )}
      <span className="truncate">{label}</span>
    </button>
  );
}

function HeaderLanguageToggle() {
  const { i18n } = useTranslation();
  const isDe = i18n.language.startsWith("de");
  const currentLang = isDe ? "de" : "en";

  function toggleLanguage() {
    void i18n.changeLanguage(currentLang === "de" ? "en" : "de");
  }

  return (
    <Button
      variant="ghost"
      size="sm"
      type="button"
      onClick={toggleLanguage}
      aria-label={
        currentLang === "de" ? "Switch to English" : "Auf Deutsch umschalten"
      }
    >
      {currentLang === "de" ? "DE" : "EN"}
    </Button>/* <Languages /> */
  );
}

function ThemeToggleButtonVariant3() {
  const { t } = useTranslation();
  const { theme, setTheme } = useAccessibilityStore();

  function handleClick() {
    const next =
      theme === "light"
        ? "dark"
        : theme === "dark"
          ? "contrast"
          : theme === "contrast"
            ? "contrastLight"
            : "light";
    setTheme(next);
  }

  const srLabel =
    theme === "light"
      ? t("a11y.toggleThemeToDark", "Switch to dark mode")
      : theme === "dark"
        ? t("a11y.toggleThemeToContrastDark", "Switch to high contrast dark mode")
        : theme === "contrast"
          ? t(
            "a11y.toggleThemeToContrastLight",
            "Switch to high contrast light mode"
          )
          : t("a11y.toggleThemeToLight", "Switch to light mode");

  const Icon =
    theme === "light" ? SunIcon : theme === "dark" ? MoonIcon : ContrastIcon;

  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      onClick={handleClick}
      title={t("a11y.themeToggleTitle", "Toggle theme")}
      className="relative"
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
      {theme === "contrast" && (
        <span
          className="absolute right-0.5 top-0.5 inline-flex h-1.5 w-1.5 rounded-full bg-primary"
          aria-hidden="true"
        />
      )}
      <span className="sr-only">{srLabel}</span>
    </Button>
  );
}

// Simple inline icons

function SunIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      {...props}
    >
      <circle cx="12" cy="12" r="4" />
      <path d="M12 3v2" />
      <path d="M12 19v2" />
      <path d="M5 5l1.5 1.5" />
      <path d="M17.5 17.5L19 19" />
      <path d="M3 12h2" />
      <path d="M19 12h2" />
      <path d="M5 19l1.5-1.5" />
      <path d="M17.5 6.5L19 5" />
    </svg>
  );
}

function MoonIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      {...props}
    >
      <path d="M21 12.79A9 9 0 0 1 12 3a7 7 0 0 0 0 14 9 9 0 0 0 9-4.21Z" />
    </svg>
  );
}

function ContrastIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      {...props}
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 3v18" />
    </svg>
  );
}
