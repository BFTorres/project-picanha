import { useEffect } from "react"
import { useTranslation } from "react-i18next"
import { useCoinbaseStore } from "@/stores/coinbase-store"
import { SectionCards } from "@/components/dashboard/SectionCards"
import { ChartArea } from "@/components/dashboard/ChartArea"
import { RatesTable } from "@/components/dashboard/RatesTable"

export function DashboardPage() {
  const { t } = useTranslation()
  const { fetchRates, lastUpdated } = useCoinbaseStore()

  useEffect(() => {
    if (!lastUpdated) {
      void fetchRates("EUR")
    }
  }, [fetchRates, lastUpdated])

  return (
    <div className="flex flex-1 flex-col gap-4 md:gap-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight md:text-2xl">
          {t("dashboard.title", "Crypto overview")}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {t(
            "dashboard.subtitle",
            "Live Coinbase EUR exchange rates, demo charts and a simple data table.",
          )}
        </p>
      </div>

      <SectionCards />

      <div className="grid gap-4 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ChartArea />
        </div>
        <div className="lg:col-span-1">
          {/* re-use existing card  */}
          {/* keep just ChartArea + RatesTable */}
        </div>
      </div>

      <RatesTable />
    </div>
  )
}
