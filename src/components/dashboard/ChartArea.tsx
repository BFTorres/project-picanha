import { useTranslation } from "react-i18next"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useCoinbaseStore } from "@/stores/coinbase-store"

// we'll just visualize a few major pairs
const SYMBOLS = ["BTC", "ETH", "SOL", "USD"] as const

export function ChartArea() {
  const { t } = useTranslation()
  const { rates, baseCurrency, isLoading, error } = useCoinbaseStore()

  const maxRate = Math.max(
    ...SYMBOLS.map((s) => rates[s] ?? 0).filter((n) => Number.isFinite(n)),
    0,
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>
            {t("dashboard.chart.title", "Relative rates")}
          </span>
          <span className="text-xs text-muted-foreground">
            {t("dashboard.chart.subtitle", {
              defaultValue: "Normalized per 1 {{base}}",
              base: baseCurrency,
            })}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {isLoading && (
          <p className="text-sm text-muted-foreground">
            {t("dashboard.chart.loading", "Loading chart data…")}
          </p>
        )}

        {!isLoading && error && (
          <p className="text-sm text-destructive">
            {t("dashboard.chart.error", {
              defaultValue: "Could not render chart: {{message}}",
              message: error,
            })}
          </p>
        )}

        {!isLoading && !error && (
          <div className="mt-4 flex h-48 items-end gap-4">
            {SYMBOLS.map((symbol) => {
              const value = rates[symbol]
              if (!value || !Number.isFinite(value) || !maxRate) {
                return (
                  <div key={symbol} className="flex flex-1 flex-col items-center gap-1">
                    <div className="flex h-full w-full items-end justify-center rounded-md bg-muted" />
                    <span className="text-xs font-mono text-muted-foreground">
                      {symbol}
                    </span>
                    <span className="text-[10px] text-muted-foreground">—</span>
                  </div>
                )
              }

              const height = (value / maxRate) * 100

              return (
                <div key={symbol} className="flex flex-1 flex-col items-center gap-1">
                  <div className="flex h-full w-full items-end justify-center rounded-md bg-muted">
                    <div
                      className="w-3 rounded-t-md bg-primary"
                      style={{ height: `${height}%` }}
                      aria-hidden="true"
                    />
                  </div>
                  <span className="text-xs font-mono text-muted-foreground">
                    {symbol}
                  </span>
                  <span className="text-[10px] text-muted-foreground">
                    {value.toFixed(6)}
                  </span>
                </div>
              )
            })}
          </div>
        )}
      </CardContent>
    </Card>
  )
}