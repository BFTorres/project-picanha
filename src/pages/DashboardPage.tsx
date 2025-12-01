import React from "react"
import { useTranslation } from "react-i18next"
import { CoinbaseRatesCard } from "@/components/dashboard/CoinbaseRatesCard"
import { AccessibilityPanel } from "@/components/settings/AccessibilityPanel"

export const DashboardPage: React.FC = () => {
  const { t } = useTranslation()

  return (
    <section aria-labelledby="dashboard-heading" className="space-y-4">
      <header>
        <h1
          id="dashboard-heading"
          className="text-xl font-semibold tracking-tight"
        >
          {t("dashboard.heading")}
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {t("dashboard.description")}
        </p>
      </header>

      <div className="grid gap-4 md:grid-cols-[2fr,1.4fr]">
        <CoinbaseRatesCard />
        <AccessibilityPanel />
      </div>
    </section>
  )
}
