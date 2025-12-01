import { useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useCoinbaseStore } from "@/stores/coinbase-store"

export function RatesTable() {
  const { t } = useTranslation()
  const { baseCurrency, rates, isLoading, error } = useCoinbaseStore()
  const [query, setQuery] = useState("")

  const rows = useMemo(() => {
    const entries = Object.entries(rates)
      .filter(([symbol]) => symbol.length <= 5) // ignore crazy long keys
      .slice(0, 200) // hard cap

    if (!query.trim()) return entries

    const q = query.trim().toLowerCase()
    return entries.filter(([symbol]) => symbol.toLowerCase().includes(q))
  }, [rates, query])

  return (
    <Card>
      <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <CardTitle className="text-base font-semibold">
          {t("dashboard.table.title", "Exchange rates table")}
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          {t("dashboard.table.subtitle", {
            defaultValue: "Base: {{base}}",
            base: baseCurrency,
          })}
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          <Input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t(
              "dashboard.table.searchPlaceholder",
              "Filter by symbol, e.g. BTC",
            )}
            className="h-8 max-w-xs text-xs"
            aria-label={t("dashboard.table.searchLabel", "Filter currencies")}
          />
        </div>

        {isLoading && (
          <p className="text-sm text-muted-foreground">
            {t("dashboard.table.loading", "Loading rates…")}
          </p>
        )}

        {!isLoading && error && (
          <p className="text-sm text-destructive">
            {t("dashboard.table.error", {
              defaultValue: "Could not load rates: {{message}}",
              message: error,
            })}
          </p>
        )}

        {!isLoading && !error && (
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse text-sm">
              <thead>
                <tr className="border-b bg-muted/40">
                  <th className="py-2 pl-2 pr-4 text-left font-medium">
                    {t("dashboard.table.symbol", "Symbol")}
                  </th>
                  <th className="py-2 px-4 text-right font-medium">
                    {t("dashboard.table.rate", "1 {{base}} =", {
                      base: baseCurrency,
                    })}
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map(([symbol, value]) => (
                  <tr key={symbol} className="border-b last:border-0">
                    <td className="py-1.5 pl-2 pr-4 font-mono">{symbol}</td>
                    <td className="py-1.5 px-4 text-right">
                      {value.toFixed(6)}
                    </td>
                  </tr>
                ))}
                {rows.length === 0 && (
                  <tr>
                    <td
                      colSpan={2}
                      className="py-4 text-center text-xs text-muted-foreground"
                    >
                      {t(
                        "dashboard.table.noResults",
                        "No currencies match your filter.",
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
