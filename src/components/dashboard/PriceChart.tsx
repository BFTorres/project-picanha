import { useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { useCoinbaseStore } from "@/stores/coinbase-store"

type ChartPoint = {
  time: string
  price: number
}

const SYMBOLS = ["BTC", "ETH", "SOL", "USD"] as const
type SymbolCode = (typeof SYMBOLS)[number]

/**
 * Build a simple mock intraday series based on the current rate.
 * This keeps everything public / client-only, no private Coinbase endpoints.
 */
function buildMockSeries(rate: number | undefined, points = 24): ChartPoint[] {
  if (!rate || !Number.isFinite(rate)) return []

  const now = Date.now()
  const data: ChartPoint[] = []
  let price = rate

  for (let i = points - 1; i >= 0; i -= 1) {
    const ts = new Date(now - i * 60 * 60 * 1000) // last X hours

    // small pseudo-random drift – deterministic enough for a demo
    const delta = (Math.sin(i) + Math.cos(i * 0.5)) * 0.01
    price = price * (1 + delta)

    data.push({
      time: ts.toISOString(),
      price: Number(price.toFixed(4)),
    })
  }

  return data
}

function formatHour(value: string) {
  const date = new Date(value)
  return date.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
  })
}

export function PriceChart() {
  const { t } = useTranslation()

  const rates = useCoinbaseStore((state) => state.rates)
  const baseCurrency = useCoinbaseStore((state) => state.baseCurrency)
  const isLoading = useCoinbaseStore((state) => state.isLoading)
  const error = useCoinbaseStore((state) => state.error)

  const [symbol, setSymbol] = useState<SymbolCode>("BTC")

  const series = useMemo(
    () => buildMockSeries(rates[symbol]),
    [rates, symbol],
  )

  const currentPrice =
    series.length > 0 ? series[series.length - 1]!.price : undefined
  const firstPrice = series.length > 0 ? series[0]!.price : undefined

  const changePct =
    currentPrice !== undefined && firstPrice !== undefined && firstPrice !== 0
      ? ((currentPrice - firstPrice) / firstPrice) * 100
      : undefined

  return (
    <Card aria-label={t("dashboard.priceChart.ariaLabel", "Price chart")}>
      <CardHeader className="flex flex-row items-center justify-between gap-2">
        <div>
          <CardTitle className="text-base sm:text-lg">
            {t("dashboard.priceChart.title", "Selected asset")}
          </CardTitle>
          <p className="mt-1 text-xs text-muted-foreground">
            {t(
              "dashboard.priceChart.subtitle",
              "Mock intraday series based on current Coinbase rate.",
            )}
          </p>
        </div>

        <Select
          value={symbol}
          onValueChange={(value) => setSymbol(value as SymbolCode)}
        >
          <SelectTrigger className="w-[120px]">
            <SelectValue
              placeholder={t(
                "dashboard.priceChart.selectPlaceholder",
                "Symbol",
              )}
            />
          </SelectTrigger>
          <SelectContent>
            {SYMBOLS.map((code) => (
              <SelectItem key={code} value={code}>
                {code}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </CardHeader>

      <CardContent className="space-y-4">
        {isLoading && (
          <p className="text-sm text-muted-foreground">
            {t("common.loading", "Loading…")}
          </p>
        )}

        {error && (
          <p className="text-sm text-destructive">
            {t("common.errorPrefix", "Error:")} {error}
          </p>
        )}

        {!isLoading && !error && series.length === 0 && (
          <p className="text-sm text-muted-foreground">
            {t(
              "dashboard.priceChart.noData",
              "No data available for this symbol.",
            )}
          </p>
        )}

        {series.length > 0 && (
          <div
            className="h-56 w-full"
            role="img"
            aria-label={t(
              "dashboard.priceChart.chartAria",
              "Line chart of simulated intraday price movements.",
            )}
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={series}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="time"
                  tickFormatter={formatHour}
                  minTickGap={16}
                />
                <YAxis
                  tickFormatter={(v) => v.toFixed(2)}
                  width={60}
                />
                <Tooltip
                  labelFormatter={(value) =>
                    new Date(value as string).toLocaleString()
                  }
                  formatter={(value: number) => [
                    value.toFixed(4),
                    `${symbol}/${baseCurrency}`,
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="price"
                  stroke="var(--chart-1)"
                  fill="var(--chart-1)"
                  fillOpacity={0.18}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}

        {currentPrice !== undefined && (
          <div className="flex flex-wrap items-baseline justify-between gap-3 text-sm">
            <div>
              <p className="text-xs uppercase text-muted-foreground">
                {t("dashboard.priceChart.currentLabel", "Current price")}
              </p>
              <p className="text-base font-semibold tabular-nums">
                {currentPrice.toFixed(4)} {symbol}/{baseCurrency}
              </p>
            </div>

            {changePct !== undefined && (
              <div>
                <p className="text-xs uppercase text-muted-foreground">
                  {t(
                    "dashboard.priceChart.changeLabel",
                    "Change over period",
                  )}
                </p>
                <p
                  className={cn(
                    "text-base font-semibold tabular-nums",
                    changePct >= 0
                      ? "text-emerald-600 dark:text-emerald-400"
                      : "text-red-600 dark:text-red-400",
                  )}
                >
                  {changePct >= 0 ? "+" : ""}
                  {changePct.toFixed(2)}%
                </p>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
