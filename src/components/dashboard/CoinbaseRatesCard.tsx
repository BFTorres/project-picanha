import { useEffect } from "react"
import { useTranslation } from "react-i18next"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"
import { useCoinbaseStore } from "@/stores/coinbase-store"

const DISPLAY_SYMBOLS = ["BTC", "ETH", "USD", "EUR"] as const

export function CoinbaseRatesCard() {
  const { t } = useTranslation()

  const {
    baseCurrency,
    rates,
    isLoading,
    error,
    lastUpdated,
    fetchRates,
  } = useCoinbaseStore()

  useEffect(() => {
    if (!lastUpdated && !isLoading && !error) {
      void fetchRates("EUR")
    }
  }, [fetchRates, lastUpdated, isLoading, error])

  const rows = DISPLAY_SYMBOLS.map((symbol) => ({
    symbol,
    rate: rates[symbol],
  }))

  return (
    <Card aria-busy={isLoading} aria-live="polite">
      <CardHeader>
        <CardTitle className="flex items-center justify-between gap-2">
          <span>{t("dashboard.coinbase.title", "Coinbase rates")}</span>
          <span className="text-xs text-muted-foreground">
            {t("dashboard.coinbase.base", {
              defaultValue: "Base: {{currency}}",
              currency: baseCurrency,
            })}
          </span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading && (
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-3/4" />
          </div>
        )}

        {!isLoading && error && (
          <p className="text-sm text-destructive">
            {t("dashboard.coinbase.error", {
              defaultValue: "Could not load exchange rates: {{message}}",
              message: error,
            })}
          </p>
        )}

        {!isLoading && !error && (
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b">
                <th className="py-2 text-left font-medium">
                  {t("dashboard.coinbase.symbol", "Currency")}
                </th>
                <th className="py-2 text-right font-medium">
                  {t("dashboard.coinbase.rate", "1 {{base}} =", {
                    base: baseCurrency,
                  })}
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row) => (
                <tr key={row.symbol} className="border-b last:border-0">
                  <td className="py-1 pr-2 font-mono">{row.symbol}</td>
                  <td className="py-1 text-right">
                    {row.rate ? row.rate.toFixed(6) : "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {lastUpdated && (
          <p className="mt-2 text-xs text-muted-foreground">
            {t("dashboard.coinbase.lastUpdated", {
              defaultValue: "Last updated: {{time}}",
              time: new Date(lastUpdated).toLocaleTimeString(),
            })}
          </p>
        )}
      </CardContent>
    </Card>
  )
}