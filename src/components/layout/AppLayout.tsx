import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
/* import type { ViewId } from "@/types/view" */
import { useAccessibilityStore } from "@/stores/accessibility-store";
import { useUiStore } from "@/stores/ui-store";
import { useAccessibilityClasses } from "@/hooks/useAccessibilityClasses";

/* type AppLayoutProps = {
  activeRoute: ViewId
  onNavigate: (route: ViewId) => void
  children: React.ReactNode
} */

type AppLayoutProps = {
  children: ReactNode;
  activeRoute: "dashboard" | "imprint";
  onNavigate: (route: "dashboard" | "imprint") => void;
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

  function handleNavigate(route: "dashboard" | "imprint") {
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

          <div className="flex flex-1 justify-end gap-2">
            {/* <ThemeToggleButton /> */}
            <ThemeToggleButtonVariant3 />
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
  );
}

type SidebarContentProps = {
  activeRoute: "dashboard" | "imprint";
  onNavigate: (route: "dashboard" | "imprint") => void;
};

function SidebarContent({ activeRoute, onNavigate }: SidebarContentProps) {
  const { t } = useTranslation();

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
};

function SidebarItem({ label, active, onClick }: SidebarItemProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex w-full items-center rounded-md px-2 py-1.5 text-sm transition hover:bg-accent hover:text-accent-foreground",
        active && "bg-accent text-accent-foreground"
      )}
    >
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
      variant="outline"
      size="sm"
      type="button"
      onClick={toggleLanguage}
      aria-label={
        currentLang === "de" ? "Switch to English" : "Auf Deutsch umschalten"
      }
    >
      {currentLang === "de" ? "DE" : "EN"}
    </Button>
  );
}

function ThemeToggleButton() {
  const { t } = useTranslation();
  const { theme, setTheme } = useAccessibilityStore();

  function handleClick() {
    const next =
      theme === "light" ? "dark" : theme === "dark" ? "contrast" : "light";
    setTheme(next);
  }

  // We keep the title static and make the sr-only text dynamic for a11y
  const srLabel =
    theme === "light"
      ? t("a11y.toggleThemeToDark", "Switch to dark mode")
      : theme === "dark"
      ? t("a11y.toggleThemeToContrast", "Switch to high contrast mode")
      : t("a11y.toggleThemeToLight", "Switch to light mode");

  return (
    <button
      type="button"
      onClick={handleClick}
      title={t("a11y.themeToggleTitle", "Toggle theme")}
      className="inline-flex size-8 shrink-0 items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50 group/toggle"
    >
      {/* Shadcn-like icon SVG */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-6"
        aria-hidden="true"
      >
        <path d="M0 0h24v24H0z" fill="none" />
        <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
        <path d="M12 3l0 18" />
        <path d="M12 9l4.65 -4.65" />
        <path d="M12 14.3l7.37 -7.37" />
        <path d="M12 19.6l8.85 -8.85" />
      </svg>
      <span className="sr-only">{srLabel}</span>
    </button>
  );
}

function ThemeToggleButtonVariant1() {
  const { t } = useTranslation();
  const { theme, setTheme } = useAccessibilityStore();

  function handleClick() {
    const next =
      theme === "light" ? "dark" : theme === "dark" ? "contrast" : "light";
    setTheme(next);
  }

  const srLabel =
    theme === "light"
      ? t("a11y.toggleThemeToDark", "Switch to dark mode")
      : theme === "dark"
      ? t("a11y.toggleThemeToContrast", "Switch to high contrast mode")
      : t("a11y.toggleThemeToLight", "Switch to light mode");

  const Icon =
    theme === "light" ? SunIcon : theme === "dark" ? MoonIcon : ContrastIcon;

  return (
    <Button
      type="button"
      variant="outline"
      size="icon"
      onClick={handleClick}
      title={t("a11y.themeToggleTitle", "Toggle theme")}
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
      <span className="sr-only">{srLabel}</span>
    </Button>
  );
}

function ThemeToggleButtonVariant2() {
  const { t } = useTranslation();
  const { theme, setTheme } = useAccessibilityStore();

  function handleClick() {
    const next =
      theme === "light" ? "dark" : theme === "dark" ? "contrast" : "light";
    setTheme(next);
  }

  const srLabel =
    theme === "light"
      ? t("a11y.toggleThemeToDark", "Switch to dark mode")
      : theme === "dark"
      ? t("a11y.toggleThemeToContrast", "Switch to high contrast mode")
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
      className="hover:bg-accent hover:text-accent-foreground"
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
      <span className="sr-only">{srLabel}</span>
    </Button>
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
            : "light" // contrastLight -> light
    setTheme(next)
  }

  const srLabel =
    theme === "light"
      ? t("a11y.toggleThemeToDark", "Switch to dark mode")
      : theme === "dark"
        ? t("a11y.toggleThemeToContrastDark", "Switch to high contrast dark mode")
        : theme === "contrast"
          ? t(
              "a11y.toggleThemeToContrastLight",
              "Switch to high contrast light mode",
            )
          : t("a11y.toggleThemeToLight", "Switch to light mode")

  const Icon =
    theme === "light" ? SunIcon : theme === "dark" ? MoonIcon : ContrastIcon;

  return (
    <Button
      type="button"
      variant="outline"
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
  )
}

function AccessibilitySection() {
  const { t } = useTranslation();
  const { theme, fontSize, fontFamily, setTheme, setFontSize, setFontFamily } =
    useAccessibilityStore();

  return (
    <section aria-label={t("a11y.sectionTitle", "Accessibility settings")}>
      <h2 className="mb-2 text-sm font-semibold uppercase text-muted-foreground">
        {t("a11y.title", "Accessibility")}
      </h2>

      <div className="mb-3 space-y-1">
        <p className="text-xs font-medium">{t("a11y.themeLabel", "Theme")}</p>
        <div className="flex flex-wrap gap-1">
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
            {t("a11y.themeContrastDark", "High contrast (dark)")}
          </Button>
          <Button
            type="button"
            variant={theme === "contrastLight" ? "default" : "outline"}
            size="sm"
            onClick={() => setTheme("contrastLight")}
          >
            {t("a11y.themeContrastLight", "High contrast (light)")}
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
  );
}
