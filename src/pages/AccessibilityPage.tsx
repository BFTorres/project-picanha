import { useTranslation } from "react-i18next"
import { useAccessibilityStore } from "@/stores/accessibility-store"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"

export function AccessibilityPage() {
  const { t, i18n } = useTranslation()

  const {
    theme,
    fontSize,
    fontFamily,
    reducedMotion,
    highVisibilityLinks,
    strongFocusOutline,
    setTheme,
    setFontSize,
    setFontFamily,
    setReducedMotion,
    setHighVisibilityLinks,
    setStrongFocusOutline,
  } = useAccessibilityStore()

  const currentLang = i18n.language?.startsWith("de") ? "de" : "en"

  function handleLanguageChange(lang: "de" | "en") {
    if (lang === currentLang) return
    void i18n.changeLanguage(lang)
    // html lang will be synced by useAccessibilityEffects
  }

  return (
    <div className="flex flex-1 flex-col gap-6">
      <header>
        <h1 className="text-xl font-semibold tracking-tight md:text-2xl">
          {t("accessibility.title", "Accessibility & display settings")}
        </h1>
        <p className="mt-1 max-w-prose text-sm text-muted-foreground">
          {t(
            "accessibility.subtitle",
            "Adjust theme, typography, motion and language to make the interface more comfortable and accessible.",
          )}
        </p>
      </header>

      <div className="grid gap-4 lg:grid-cols-2">
        {/* Language settings -------------------------------------------------- */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {t("accessibility.languageTitle", "Language")}
            </CardTitle>
            <CardDescription>
              {t(
                "accessibility.languageDescription",
                "Switch the interface language. This affects all labels and content in the app.",
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="inline-flex gap-2 rounded-md border bg-background p-1 text-sm">
              <Button
                type="button"
                size="sm"
                variant={currentLang === "de" ? "default" : "ghost"}
                onClick={() => handleLanguageChange("de")}
              >
                Deutsch
              </Button>
              <Button
                type="button"
                size="sm"
                variant={currentLang === "en" ? "default" : "ghost"}
                onClick={() => handleLanguageChange("en")}
              >
                English
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              {t(
                "accessibility.languageHint",
                "We also update the page language (lang attribute) to support assistive technologies.",
              )}
            </p>
          </CardContent>
        </Card>

        {/* Theme & contrast --------------------------------------------------- */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {t("accessibility.themeTitle", "Theme & contrast")}
            </CardTitle>
            <CardDescription>
              {t(
                "accessibility.themeDescription",
                "Choose a theme that works best for your eyes. High-contrast modes improve legibility.",
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <RadioGroup
              value={theme}
              onValueChange={(value) =>
                setTheme(value as Parameters<typeof setTheme>[0])
              }
              className="grid gap-2 sm:grid-cols-2"
            >
              <ThemeOption
                id="theme-light"
                value="light"
                label={t("accessibility.themeLight", "Light")}
                description={t(
                  "accessibility.themeLightDesc",
                  "Standard light theme.",
                )}
              />
              <ThemeOption
                id="theme-dark"
                value="dark"
                label={t("accessibility.themeDark", "Dark")}
                description={t(
                  "accessibility.themeDarkDesc",
                  "Dark theme for low-light environments.",
                )}
              />
              <ThemeOption
                id="theme-contrast"
                value="contrast"
                label={t(
                  "accessibility.themeContrast",
                  "High contrast (dark)",
                )}
                description={t(
                  "accessibility.themeContrastDesc",
                  "Stronger contrast on a dark background.",
                )}
              />
              <ThemeOption
                id="theme-contrast-light"
                value="contrastLight"
                label={t(
                  "accessibility.themeContrastLight",
                  "High contrast (light)",
                )}
                description={t(
                  "accessibility.themeContrastLightDesc",
                  "Stronger contrast on a light background.",
                )}
              />
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Typography --------------------------------------------------------- */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {t("accessibility.typographyTitle", "Typography")}
            </CardTitle>
            <CardDescription>
              {t(
                "accessibility.typographyDescription",
                "Control font size and typeface. These settings affect both text and numbers.",
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Font size */}
            <div className="space-y-2">
              <Label className="text-xs uppercase text-muted-foreground">
                {t("accessibility.fontSizeLabel", "Font size")}
              </Label>
              <RadioGroup
                value={fontSize}
                onValueChange={(value) =>
                  setFontSize(value as Parameters<typeof setFontSize>[0])
                }
                className="flex gap-2"
              >
                <SizeOption
                  id="font-size-sm"
                  value="sm"
                  label={t("accessibility.fontSizeSmall", "Small")}
                />
                <SizeOption
                  id="font-size-md"
                  value="md"
                  label={t("accessibility.fontSizeMedium", "Medium")}
                />
                <SizeOption
                  id="font-size-lg"
                  value="lg"
                  label={t("accessibility.fontSizeLarge", "Large")}
                />
              </RadioGroup>
            </div>

            {/* Font family */}
            <div className="space-y-2">
              <Label className="text-xs uppercase text-muted-foreground">
                {t("accessibility.fontFamilyLabel", "Font family")}
              </Label>
              <RadioGroup
                value={fontFamily}
                onValueChange={(value) =>
                  setFontFamily(value as Parameters<typeof setFontFamily>[0])
                }
                className="flex flex-wrap gap-2"
              >
                <FamilyOption
                  id="font-family-sans"
                  value="sans"
                  label={t("accessibility.fontFamilySans", "Sans-serif")}
                  sample="Aa"
                />
                <FamilyOption
                  id="font-family-serif"
                  value="serif"
                  label={t("accessibility.fontFamilySerif", "Serif")}
                  sample="Aa"
                />
                <FamilyOption
                  id="font-family-mono"
                  value="mono"
                  label={t("accessibility.fontFamilyMono", "Monospace")}
                  sample="Aa"
                />
              </RadioGroup>
            </div>
          </CardContent>
        </Card>

        {/* Interaction & focus ------------------------------------------------ */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">
              {t("accessibility.interactionTitle", "Interaction & focus")}
            </CardTitle>
            <CardDescription>
              {t(
                "accessibility.interactionDescription",
                "Control motion, link appearance and focus outlines to better suit your needs.",
              )}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Reduced motion */}
            <ToggleRow
              id="reduced-motion"
              label={t("accessibility.reducedMotionLabel", "Reduce motion")}
              description={t(
                "accessibility.reducedMotionDesc",
                "Minimise animations and transitions. Useful if motion is distracting or uncomfortable.",
              )}
              checked={reducedMotion}
              onCheckedChange={setReducedMotion}
            />

            {/* High-visibility links */}
            <ToggleRow
              id="high-vis-links"
              label={t(
                "accessibility.highVisLinksLabel",
                "Underline all links",
              )}
              description={t(
                "accessibility.highVisLinksDesc",
                "Always underline links and increase their visibility, not only through color.",
              )}
              checked={highVisibilityLinks}
              onCheckedChange={setHighVisibilityLinks}
            />

            {/* Strong focus outline */}
            <ToggleRow
              id="strong-focus"
              label={t(
                "accessibility.strongFocusLabel",
                "Strong focus outline",
              )}
              description={t(
                "accessibility.strongFocusDesc",
                "Use a thicker focus outline to better see where the keyboard focus currently is.",
              )}
              checked={strongFocusOutline}
              onCheckedChange={setStrongFocusOutline}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

interface ThemeOptionProps {
  id: string
  value: string
  label: string
  description: string
}

function ThemeOption({
  id,
  value,
  label,
  description,
}: ThemeOptionProps) {
  return (
    <div className="flex items-start gap-2 rounded-md border bg-card px-3 py-2 text-sm">
      <RadioGroupItem id={id} value={value} />
      <div className="space-y-1">
        <Label htmlFor={id} className="font-medium">
          {label}
        </Label>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
    </div>
  )
}

interface SizeOptionProps {
  id: string
  value: string
  label: string
}

function SizeOption({ id, value, label }: SizeOptionProps) {
  return (
    <div className="flex items-center gap-2 rounded-md border bg-card px-3 py-2 text-sm">
      <RadioGroupItem id={id} value={value} />
      <Label htmlFor={id}>{label}</Label>
    </div>
  )
}

interface FamilyOptionProps {
  id: string
  value: string
  label: string
  sample: string
}

function FamilyOption({ id, value, label, sample }: FamilyOptionProps) {
  return (
    <div className="flex items-center gap-3 rounded-md border bg-card px-3 py-2 text-sm">
      <RadioGroupItem id={id} value={value} />
      <div className="flex flex-1 items-center justify-between gap-3">
        <Label htmlFor={id}>{label}</Label>
        <span
          className="rounded border px-2 py-0.5 text-xs"
          aria-hidden="true"
        >
          {sample}
        </span>
      </div>
    </div>
  )
}

interface ToggleRowProps {
  id: string
  label: string
  description: string
  checked: boolean
  onCheckedChange: (value: boolean) => void
}

function ToggleRow({
  id,
  label,
  description,
  checked,
  onCheckedChange,
}: ToggleRowProps) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="space-y-1">
        <Label htmlFor={id}>{label}</Label>
        <p className="max-w-sm text-xs text-muted-foreground">
          {description}
        </p>
      </div>
      <Switch
        id={id}
        checked={checked}
        onCheckedChange={onCheckedChange}
        aria-label={label}
      />
    </div>
  )
}
