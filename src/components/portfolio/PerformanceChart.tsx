import { useEffect, useMemo, useState } from "react"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useCoinbaseStore } from "@/stores/coinbase-store"
type ChartPoint = {
  time: string
  price: number
}

const SYMBOLS = ["Picanha Money Balance", "Crypto Wallet", "Total Value"] as const
type SymbolCode = (typeof SYMBOLS)[number]

const TIME_RANGES = ["1W", "1M", "1Y", "Max"] as const
type TimeRange = (typeof TIME_RANGES)[number]

/**
 * Simple mock intraday series based on the current rate.
 * Used as a fallback when no backend history is available.
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

type UseHistoricalSeriesArgs = {
  symbol: SymbolCode
  baseCurrency: string
  range: TimeRange
  spotRate?: number
}

/**
 * Try to load real historical candles via backend proxy (`/api/history`).
 * If that fails or returns nothing, fall back to a mock series.
 */
function useHistoricalSeries({
  symbol,
  baseCurrency,
  range,
  spotRate,
}: UseHistoricalSeriesArgs) {
  const [series, setSeries] = useState<ChartPoint[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      if (!spotRate || !Number.isFinite(spotRate)) {
        setSeries([])
        setError(null)
        return
      }

      setLoading(true)
      setError(null)

      try {
        const productId = `${symbol}-${baseCurrency}` // e.g. BTC-EUR
        const params = new URLSearchParams({
          productId,
          range,
        }).toString()

        const res = await fetch(`/api/history?${params}`)

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`)
        }

        const json = (await res.json()) as { points?: ChartPoint[] }

        if (!cancelled && Array.isArray(json.points) && json.points.length > 0) {
          setSeries(
            json.points
              .map((p) => ({
                time: p.time,
                price: Number(p.price),
              }))
              .filter((p) => Number.isFinite(p.price)),
          )
          setError(null)
        } else if (!cancelled) {
          // backend returned nothing -> fallback to mock
          setSeries(buildMockSeries(spotRate))
          setError(null)
        }
      } catch (err) {
        console.error("history fetch failed, using mock data", err)
        if (!cancelled) {
          setSeries(buildMockSeries(spotRate))
          setError(
            err instanceof Error ? err.message : "Unknown history fetch error",
          )
        }
      } finally {
        if (!cancelled) {
          setLoading(false)
        }
      }
    }

    void load()

    return () => {
      cancelled = true
    }
  }, [symbol, baseCurrency, range, spotRate])

  return { series, loading, error }
}

export function PerformanceChart() {
  const { t } = useTranslation()

  const rates = useCoinbaseStore((state) => state.rates)
  const baseCurrency = useCoinbaseStore((state) => state.baseCurrency)
  const baseIsLoading = useCoinbaseStore((state) => state.isLoading)
  const baseError = useCoinbaseStore((state) => state.error)

  const [symbol, setSymbol] = useState<SymbolCode>("Crypto Wallet")
  const [range, setRange] = useState<TimeRange>("1W")

  const spotRate = rates[symbol]
  const { series, loading: historyLoading } = useHistoricalSeries({
    symbol,
    baseCurrency,
    range,
    spotRate,
  })

  const effectiveLoading = baseIsLoading || historyLoading

  const currentPrice = useMemo(
    () => (series.length > 0 ? series[series.length - 1]!.price : undefined),
    [series],
  )
  const firstPrice = useMemo(
    () => (series.length > 0 ? series[0]!.price : undefined),
    [series],
  )

  const changePct =
    currentPrice !== undefined &&
      firstPrice !== undefined &&
      firstPrice !== 0
      ? ((currentPrice - firstPrice) / firstPrice) * 100
      : undefined

  return (
    <Card aria-label={t("dashboard.priceChart.ariaLabel", "Price chart")}>
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle className="text-base sm:text-lg">
            {t("portfolio.priceChart.title", "Performance")}
          </CardTitle>

        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Select
            value={symbol}
            onValueChange={(value) => setSymbol(value as SymbolCode)}
          >
            <SelectTrigger className="w-60">
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

          <div className="flex items-center gap-1">
            {TIME_RANGES.map((value) => (
              <Button
                key={value}
                type="button"
                variant={range === value ? "default" : "outline"}
                size="sm"
                onClick={() => setRange(value)}
              >
                {value}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {effectiveLoading && (
          <p className="text-sm text-muted-foreground">
            {t("common.loading", "Loading…")}
          </p>
        )}

        {!effectiveLoading && baseError && (
          <p className="text-sm text-destructive">
            {t("common.errorPrefix", "Error:")} {baseError}
          </p>
        )}

        {!effectiveLoading && !baseError && series.length === 0 && (
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
              "Line chart of price movements over the selected period.",
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
              <p className="text-sm uppercase text-muted-foreground">
                {t("dashboard.priceChart.currentLabel", "Current price")}
              </p>
              <p className="text-base font-semibold tabular-nums">
                {currentPrice.toFixed(4)} {symbol}/{baseCurrency}
              </p>
            </div>

            {changePct !== undefined && (
              <div>
                <p className="text-sm uppercase text-muted-foreground">
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
