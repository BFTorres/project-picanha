// src/components/dashboard/SectionCards.tsx
import { useTranslation } from "react-i18next"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useCoinbaseStore } from "@/stores/coinbase-store"

export function SectionCards() {
  const { t } = useTranslation()
  const { baseCurrency, rates, lastUpdated, isLoading, error } = useCoinbaseStore()

  const totalCurrencies = Object.keys(rates).length

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">
            {t("dashboard.cards.baseCurrency", "Base currency")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-semibold">{baseCurrency || "—"}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {t(
              "dashboard.cards.baseCurrencyDescription",
              "Rates are normalized against this currency.",
            )}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">
            {t("dashboard.cards.totalCurrencies", "Tracked currencies")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-semibold">
            {isLoading ? "…" : totalCurrencies || "—"}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {t(
              "dashboard.cards.totalCurrenciesDescription",
              "Number of currencies returned by the Coinbase endpoint.",
            )}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">
            {t("dashboard.cards.status", "Status")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-semibold">
            {error ? t("dashboard.cards.error", "Error") : isLoading ? "…" : "OK"}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {lastUpdated
              ? t("dashboard.cards.lastUpdated", {
                  defaultValue: "Last updated at {{time}}",
                  time: new Date(lastUpdated).toLocaleTimeString(),
                })
              : t(
                  "dashboard.cards.fetching",
                  "Fetching latest data from Coinbase…",
                )}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}