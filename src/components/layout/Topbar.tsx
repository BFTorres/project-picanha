import React from "react"
import { useTranslation } from "react-i18next"
import type { ViewId } from "@/App"
import { useThemeSettings } from "@/context/theme-context"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { cn } from "@/lib/utils"

interface TopbarProps {
  currentView: ViewId
  onNavigate: (view: ViewId) => void
}

export const Topbar: React.FC<TopbarProps> = ({
  currentView,
  onNavigate,
}) => {
  const { t, i18n } = useTranslation()
  const { theme, setTheme } = useThemeSettings()

  const handleLangChange = (value: string) => {
    i18n.changeLanguage(value)
  }

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  return (
    <header className="flex items-center justify-between border-b border-slate-200 bg-slate-100/70 px-4 py-2 text-sm dark:border-slate-800 dark:bg-slate-900/70">
      <div className="flex items-center gap-4">
        <span className="text-base font-semibold">{t("appTitle")}</span>
        <nav className="flex gap-2" aria-label="Hauptnavigation">
          <Button
            variant={currentView === "dashboard" ? "default" : "outline"}
            size="sm"
            onClick={() => onNavigate("dashboard")}
            className={cn("text-xs")}
          >
            {t("nav.dashboard")}
          </Button>
          <Button
            variant={currentView === "imprint" ? "default" : "outline"}
            size="sm"
            onClick={() => onNavigate("imprint")}
            className={cn("text-xs")}
          >
            {t("nav.imprint")}
          </Button>
        </nav>
      </div>

      <div className="flex items-center gap-4">
        {/* Language */}
        <div className="flex items-center gap-2">
          <span className="sr-only">{t("settings.languageLabel")}</span>
          <Select
            value={i18n.language.startsWith("de") ? "de" : "en"}
            onValueChange={handleLangChange}
          >
            <SelectTrigger className="h-8 w-[110px] text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="de">Deutsch</SelectItem>
              <SelectItem value="en">English</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Theme */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-500">
            {t("settings.themeLight")}
          </span>
          <Switch
            checked={theme === "dark"}
            onCheckedChange={toggleTheme}
            aria-label={t("settings.themeLabel")}
          />
          <span className="text-xs text-slate-500">
            {t("settings.themeDark")}
          </span>
        </div>
      </div>
    </header>
  )
}
