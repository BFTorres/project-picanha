import React from "react"
import { useQuery } from "@tanstack/react-query"
import { useTranslation } from "react-i18next"
import { fetchExchangeRates } from "@/api/coinbase"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

const IMPORTANT_CODES = ["BTC", "ETH", "EUR", "USD"]

export const CoinbaseRatesCard: React.FC = () => {
  const { t } = useTranslation()
  const baseCurrency = "EUR"

  const { data, isLoading, isError } = useQuery({
    queryKey: ["exchange-rates", baseCurrency],
    queryFn: () => fetchExchangeRates(baseCurrency),
    staleTime: 60_000,
  })

  if (isLoading) {
    return (
      <Card aria-busy="true" aria-live="polite">
        <CardHeader>
          <CardTitle>
            {t("dashboard.coinbaseCardTitle", { currency: baseCurrency })}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-4 w-32 mb-2" />
          <Skeleton className="h-4 w-24 mb-2" />
          <Skeleton className="h-4 w-20" />
        </CardContent>
      </Card>
    )
  }

  if (isError || !data) {
    return (
      <Card role="alert">
        <CardHeader>
          <CardTitle>
            {t("dashboard.coinbaseCardTitle", { currency: baseCurrency })}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-red-500">
            {t("dashboard.coinbaseCardError")}
          </p>
        </CardContent>
      </Card>
    )
  }

  const { rates } = data.data

  const entries = IMPORTANT_CODES.filter((code) => rates[code]).map(
    (code) => ({
      code,
      value: rates[code],
    }),
  )

  return (
    <Card>
      <CardHeader>
        <CardTitle>
          {t("dashboard.coinbaseCardTitle", { currency: baseCurrency })}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="grid grid-cols-2 gap-3 text-sm md:grid-cols-4">
          {entries.map((item) => (
            <div key={item.code} className="space-y-1">
              <dt className="text-slate-500">{item.code}</dt>
              <dd className="font-semibold">{item.value}</dd>
            </div>
          ))}
        </dl>
      </CardContent>
    </Card>
  )
}
