import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { useCoinbaseStore } from "@/stores/coinbase-store";
import { HistoryTable } from "@/components/portfolio/HistoryTable";

export function PortfolioHistoryPage() {
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
            "Übersicht über deine Transaktionen."
          )}
        </p>
      </div>

      <HistoryTable />
    </div>
  );
}
