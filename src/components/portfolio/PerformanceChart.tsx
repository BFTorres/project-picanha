import { useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import dayjs from "dayjs"
import ReactECharts from "echarts-for-react"
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

const TIME_RANGES = ["1M", "1Y", "Max"] as const

type TimeRange = (typeof TIME_RANGES)[number]

const CATEGORIES = ["Picanha Money Balance", "Crypto Wallet", "Total Value"] as const

export function PerformanceChart() {
  const { t } = useTranslation()
  const [selectedRange, setSelectedRange] = useState<TimeRange>("1Y")
  const type = usePrices((s) => s.type)
  const setType = usePrices((s) => s.setType)
  const getSeries = usePrices((s) => s.getSeries)
  const allSeries = useMemo(() => getSeries(), [type, getSeries])
  // Filtert die Transaktionen nach Zeitbereich
  const filteredSeries = useMemo(() => {
    if (selectedRange === "Max" || allSeries.length === 0) {
      return allSeries
    }
    const now = dayjs()
    let cutoffDate: dayjs.Dayjs

    switch (selectedRange) {
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

  // Konfiguration ECharts
  const echartsOption = useMemo(() => {
    return {
      title: {
        text: 'Apache ECharts Beispiel - echarts-for-react',
        left: 'center',
        textStyle: {
          fontSize: 14,
          fontWeight: 'normal'
        }
      },
      tooltip: {
        trigger: 'axis',
        formatter: (params: any) => {
          const item = params[0];
          const date = dayjs(item.name).format("DD.MM.YYYY HH:mm:ss");
          return `
            <div style="padding: 3px;">
              <div style="font-weight: bold; ">${type}</div>
              <div style="font-size: 12px; ">${date}</div>
              <div style="font-size: 14px; font-weight: 500;">${t("portfolio.priceChart.value", "Value")}: ${item.value.toFixed(2)}€</div>
            </div>
          `;
        }
      },
      legend: {
        data: [type],
        bottom: -5
      },
      grid: {
        left: '3%',
        right: '4%',
        bottom: '15%',
        containLabel: true
      },
      xAxis: {
        type: 'category',
        boundaryGap: false,
        data: filteredSeries.map(item => item.date),
        axisLabel: {
          formatter: (value: string) => dayjs(value).format("DD.MM")
        }
      },
      yAxis: {
        type: 'value',
        axisLabel: {
          formatter: '{value} €'
        },
        splitLine: {
        }
      },
      dataZoom: [
        {
          type: 'inside',
          start: 0,
          end: 100
        },
        {
          start: 0,
          end: 100
        }
      ],
      series: [
        {
          name: type,
          type: 'line',
          smooth: true,
          symbol: 'none',
          areaStyle: {
            opacity: 0.18
          },
          lineStyle: {
            width: 2
          },
          data: filteredSeries.map(item => item.value)
        }
      ]
    };
  }, [filteredSeries, type, t]);

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

      <CardContent className="space-y-8">
        {filteredSeries.length > 0 ? (
          <>
            <div className="h-[400px] w-full pt-4 border-t">
              <ReactECharts
                option={echartsOption}
                style={{ height: '100%', width: '100%' }}
              />
            </div>
          </>
        ) : (
          <div className="flex h-56 items-center justify-center text-muted-foreground">
            <p>{t("portfolio.priceChart.noData", "Keine Daten verfügbar")}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}