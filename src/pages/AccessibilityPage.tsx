import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { useAccessibilityStore } from "@/stores/accessibility-store"

export function AccessibilityPage() {
  const { t } = useTranslation()
  const { theme, fontSize, fontFamily, setTheme, setFontSize, setFontFamily } =
    useAccessibilityStore()

  return (
    <div className="flex flex-1 flex-col gap-6">
      <header>
        <h1 className="text-xl font-semibold tracking-tight md:text-2xl">
          {t("a11y.pageTitle", "Accessibility & appearance")}
        </h1>
        <p className="mt-1 max-w-prose text-sm text-muted-foreground">
          {t(
            "a11y.pageSubtitle",
            "Adjust theme, font size and font family to improve readability. These settings apply only to this demo application.",
          )}
        </p>
      </header>

      {/* Theme section */}
      <section className="space-y-3">
        <h2 className="text-sm font-medium">
          {t("a11y.themeLabel", "Theme")}
        </h2>
        <p className="max-w-prose text-xs text-muted-foreground">
          {t(
            "a11y.themeDescription",
            "Choose between light, dark and high-contrast variants. High-contrast modes are optimized for users with reduced vision.",
          )}
        </p>
        <div className="flex flex-wrap gap-2">
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
      </section>

      {/* Font size section */}
      <section className="space-y-3">
        <h2 className="text-sm font-medium">
          {t("a11y.fontSizeLabel", "Font size")}
        </h2>
        <p className="max-w-prose text-xs text-muted-foreground">
          {t(
            "a11y.fontSizeDescription",
            "Change the base font size. All text and numbers scale because the app uses relative units (rem).",
          )}
        </p>
        <div className="flex flex-wrap gap-2">
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
      </section>

      {/* Font family section */}
      <section className="space-y-3">
        <h2 className="text-sm font-medium">
          {t("a11y.fontFamilyLabel", "Font family")}
        </h2>
        <p className="max-w-prose text-xs text-muted-foreground">
          {t(
            "a11y.fontFamilyDescription",
            "Pick the font style that is easiest for you to read.",
          )}
        </p>
        <div className="flex flex-wrap gap-2">
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
      </section>
    </div>
  )
}