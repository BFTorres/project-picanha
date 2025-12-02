import { useTranslation } from "react-i18next"

export function DashboardWatchlistPage() {
  const { t } = useTranslation()

  return (
    <section className="space-y-2">
      <h1 className="text-xl font-semibold tracking-tight md:text-2xl">
        {t("dashboard.watchlist.heading", "Dashboard – Watchlist overview")}
      </h1>
      <p className="max-w-prose text-sm text-muted-foreground">
        {t(
          "dashboard.watchlist.body",
          "Placeholder page for a more detailed watchlist view. Later, you can move or extend the current watchlist functionality here.",
        )}
      </p>
    </section>
  )
}