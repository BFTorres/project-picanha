import React from "react"
import { useTranslation } from "react-i18next"
import { useThemeSettings } from "@/context/theme-context"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

export const AccessibilityPanel: React.FC = () => {
  const { t } = useTranslation()
  const { theme, fontSize, fontFamily, setTheme, setFontFamily, setFontSize } =
    useThemeSettings()

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("settings.heading")}</CardTitle>
      </CardHeader>
      <CardContent className="grid gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="theme-select">{t("settings.themeLabel")}</Label>
          <Select
            value={theme}
            onValueChange={(value) =>
              setTheme(value as "light" | "dark" | "contrast")
            }
          >
            <SelectTrigger id="theme-select">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="light">
                {t("settings.themeLight")}
              </SelectItem>
              <SelectItem value="dark">
                {t("settings.themeDark")}
              </SelectItem>
              <SelectItem value="contrast">
                {t("settings.themeContrast")}
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="font-size-select">
            {t("settings.fontSizeLabel")}
          </Label>
          <Select
            value={fontSize}
            onValueChange={(value) =>
              setFontSize(value as "sm" | "md" | "lg")
            }
          >
            <SelectTrigger id="font-size-select">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sm">Small</SelectItem>
              <SelectItem value="md">Medium</SelectItem>
              <SelectItem value="lg">Large</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="font-family-select">
            {t("settings.fontFamilyLabel")}
          </Label>
          <Select
            value={fontFamily}
            onValueChange={(value) =>
              setFontFamily(value as "sans" | "serif" | "mono")
            }
          >
            <SelectTrigger id="font-family-select">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sans">Sans</SelectItem>
              <SelectItem value="serif">Serif</SelectItem>
              <SelectItem value="mono">Monospace</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  )
}
