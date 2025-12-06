import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useCoinbaseStore } from "@/stores/coinbase-store";
import { SectionCards } from "@/components/portfolio/SectionCards";
import { PerformanceChart } from "@/components/portfolio/PerformanceChart";
import { HistoryTable } from "@/components/portfolio/HistoryTable";

export function PortfolioPage() {
  const { t } = useTranslation();
  const { fetchRates, lastUpdated } = useCoinbaseStore();

  useEffect(() => {
    if (!lastUpdated) {
      void fetchRates("EUR");
    }
  }, [fetchRates, lastUpdated]);

  return (
    <div className="flex w-full min-w-0 flex-1 flex-col gap-4 md:gap-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight md:text-2xl">
          {t("portfolio.title", "Portfolio")}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {t(
            "portfolio.subtitle",
            "Übersicht über deine Vermögenswerte und letzten Aktivitäten."
          )}
        </p>
      </div>

      <SectionCards />

      <div className="grid gap-4 lg:grid-cols-1">
        <div className="min-w-0 space-y-4">
          <PerformanceChart />
        </div>
      </div>
      <div className="min-w-0">
        <HistoryTable />
      </div>
    </div>
  );
}
