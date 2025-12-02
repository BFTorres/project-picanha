import { useTranslation } from "react-i18next"

export function DashboardAnalyticsPage() {
  const { t } = useTranslation()

  return (
    <section className="space-y-2">
      <h1 className="text-xl font-semibold tracking-tight md:text-2xl">
        {t("dashboard.analytics.heading", "Dashboard – Analytics")}
      </h1>
      <p className="max-w-prose text-sm text-muted-foreground">
        {t(
          "dashboard.analytics.body",
          "Placeholder page for analytics views. Use this area to explore charts, KPIs and performance indicators based on your data.",
        )}
      </p>
    </section>
  )
}