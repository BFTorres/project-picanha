import { useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import dayjs from "dayjs"
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
import { usePrices } from "@/stores/usePrices"
import { Button } from "@/components/ui/button"

const TIME_RANGES = ["1W", "1M", "1Y", "Max"] as const

type TimeRange = (typeof TIME_RANGES)[number]

const CATEGORIES = ["Picanha Money Balance", "Crypto Wallet", "Total Value"] as const

interface TooltipProps {
  active?: boolean
  payload?: readonly {
    payload: {
      date: string
      value: number
      assetName?: string
      transactionType?: string
    }
  }[]
}

export function PerformanceChart() {
  const { t } = useTranslation()
  const [selectedRange, setSelectedRange] = useState<TimeRange>("1Y")
  const type = usePrices((s) => s.type)
  const setType = usePrices((s) => s.setType)
  const getSeries = usePrices((s) => s.getSeries)
  const allSeries = useMemo(() => getSeries(), [type, getSeries])
  const filteredSeries = useMemo(() => {
    if (selectedRange === "Max" || allSeries.length === 0) {
      return allSeries
    }

    const now = dayjs()
    let cutoffDate: dayjs.Dayjs

    switch (selectedRange) {
      case "1W":
        cutoffDate = now.subtract(7, "day")
        break
      case "1M":
        cutoffDate = now.subtract(1, "month")
        break
      case "1Y":
        cutoffDate = now.subtract(1, "year")
        break
      default:
        return allSeries
    }

    return allSeries.filter((item) => dayjs(item.date).isAfter(cutoffDate))
  }, [allSeries, selectedRange])

  const renderTooltip = ({ active, payload }: TooltipProps) => {
    if (!active || !payload || !payload.length) return null

    const data = payload[0].payload
    const formattedDate = dayjs(data.date).format("DD.MM.YYYY HH:mm:ss")

    return (
      <div className="rounded-lg border bg-background p-3 shadow-md">
        <div className="flex flex-col gap-1">
          <p className="text-sm font-semibold text-foreground">{type}</p>
          <p className="text-xs text-muted-foreground">{formattedDate}</p>
          {(data.transactionType || data.assetName) && (
            <p className="text-xs text-muted-foreground">
              {data.transactionType} {data.assetName}
            </p>
          )}
          <p className="text-sm font-medium text-foreground">
            {t("portfolio.priceChart.value", "Value")}: {data.value.toFixed(2)}€
          </p>
        </div>
      </div>
    );
  };

  return (
    <Card aria-label={t("dashboard.priceChart.ariaLabel", "Price chart")}>
      <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle className="text-base sm:text-lg">
            {t("portfolio.priceChart.title", "Performance")}
          </CardTitle>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Select value={type} onValueChange={setType}>
            <SelectTrigger className="w-60">
              <SelectValue
                placeholder={t(
                  "dashboard.priceChart.selectPlaceholder",
                  "Symbol"
                )}
              />
            </SelectTrigger>
            <SelectContent>
              {CATEGORIES.map((category) => (
                <SelectItem key={category} value={category}>
                  {category}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <div className="flex items-center gap-1">
            {TIME_RANGES.map((range) => (
              <Button
                key={range}
                type="button"
                variant={selectedRange === range ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedRange(range)}
                className="min-w-[3rem]"
                aria-label={`${range} Zeitbereich auswählen`}
              >
                {range}
              </Button>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {filteredSeries.length > 0 ? (
          <div
            className="h-56 w-full"
            role="img"
            aria-label={t(
              "dashboard.priceChart.chartAria",
              "Line chart of price movements over the selected period."
            )}
          >
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={filteredSeries}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  minTickGap={16}
                  tick={{ fontSize: 12 }}
                />
                <YAxis
                  tickFormatter={(value) => value.toFixed(2)}
                  width={60}
                  tick={{ fontSize: 12 }}
                />
                <Tooltip content={renderTooltip} />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="var(--chart-1)"
                  fill="var(--chart-1)"
                  fillOpacity={0.18}
                  strokeWidth={2}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        ) : (
          <div className="flex h-56 items-center justify-center text-muted-foreground">
            <p>{t("portfolio.priceChart.noData", "Keine Daten verfügbar")}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}