import { useTranslation } from "react-i18next"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useWatchlistStore } from "@/stores/watchlist-store"
import { useCoinbaseStore } from "@/stores/coinbase-store"

export function WatchlistPanel() {
  const { t } = useTranslation()
  const { symbols, removeSymbol } = useWatchlistStore()
  const { rates, baseCurrency } = useCoinbaseStore()

  const hasItems = Array.isArray(symbols) && symbols.length > 0

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base font-semibold">
          {t("watchlist.title", "Watchlist")}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-sm">
        {!hasItems && (
          <p className="text-sm text-muted-foreground">
            {t(
              "watchlist.empty",
              "No symbols in your watchlist yet. Use the table drawer to add some.",
            )}
          </p>
        )}

        {hasItems && (
          <ul className="space-y-1">
            {symbols.map((symbol) => {
              const rate = rates[symbol]
              return (
                <li
                  key={symbol}
                  className="flex items-center justify-between gap-2"
                >
                  <div>
                    <div className="font-mono text-sm">{symbol}</div>
                    <div className="text-sm text-muted-foreground">
                      {rate != null
                        ? t("watchlist.rate", {
                            defaultValue: "1 {{base}} = {{value}} {{symbol}}",
                            base: baseCurrency,
                            value: rate.toFixed(6),
                            symbol,
                          })
                        : t(
                            "watchlist.noRate",
                            "No current rate available for this symbol.",
                          )}
                    </div>
                  </div>
                  <Button
                    type="button"
                    size="sm"
                    variant="outline"
                    onClick={() => removeSymbol(symbol)}
                    aria-label={t("watchlist.remove", {
                      defaultValue: "Remove {{symbol}} from watchlist",
                      symbol,
                    })}
                  >
                    {t("watchlist.removeShort", "Remove")}
                  </Button>
                </li>
              )
            })}
          </ul>
        )}
      </CardContent>
    </Card>
  )
}