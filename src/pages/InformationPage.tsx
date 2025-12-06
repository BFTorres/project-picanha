import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { useInfoStore, type Asset, type AssetKind } from "@/stores/info-store";
import { useCoinbaseStore } from "@/stores/coinbase-store";
import { useWatchlistStore } from "@/stores/watchlist-store";

type KindFilter = "all" | AssetKind;

const PAGE_SIZE_OPTIONS = [10, 20, 50] as const;
type PageSizeOption = (typeof PAGE_SIZE_OPTIONS)[number];

export function InformationPage() {
  const { t } = useTranslation();

  const { assets, isLoading, error, lastUpdated, fetchAssets } = useInfoStore();
  const rates = useCoinbaseStore((state) => state.rates);
  const baseCurrency = useCoinbaseStore((state) => state.baseCurrency);
  const { symbols: watchlist, addSymbol, removeSymbol } = useWatchlistStore();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<KindFilter>("all");

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<PageSizeOption>(10);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCode, setSelectedCode] = useState<string | null>(null);

  // Fetch once on mount if nothing has been loaded before
  useEffect(() => {
    if (!isLoading && !lastUpdated && !error) {
      void fetchAssets();
    }
  }, [isLoading, lastUpdated, error, fetchAssets]);

  // Filtering follows the same pattern as query-filtering in RatesTable
  const filteredAssets = useMemo(() => {
    const term = search.trim().toLowerCase();

    return assets.filter((asset) => {
      if (filter !== "all" && asset.kind !== filter) return false;
      if (!term) return true;

      return (
        asset.code.toLowerCase().includes(term) ||
        asset.name.toLowerCase().includes(term)
      );
    });
  }, [assets, search, filter]);

  // Pagination math – identical shape to RatesTable
  const totalItems = filteredAssets.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const safePage = Math.min(page, totalPages);

  const startIndex = (safePage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const pageAssets = filteredAssets.slice(startIndex, endIndex);

  const selectedAsset: Asset | undefined =
    selectedCode != null
      ? assets.find((a) => a.code === selectedCode)
      : undefined;

  const selectedRate =
    selectedAsset != null ? rates[selectedAsset.code] : undefined;

  const isInWatchlist =
    selectedAsset != null &&
    watchlist.includes(selectedAsset.code.toUpperCase());

  function openAssetDialog(code: string) {
    setSelectedCode(code);
    setDialogOpen(true);
  }

  function closeDialog() {
    setDialogOpen(false);
    setSelectedCode(null);
  }

  // Reset page when filters change (same idea as in RatesTable with query)
  function handleSearchChange(value: string) {
    setSearch(value);
    setPage(1);
  }

  function handleFilterChange(next: KindFilter) {
    setFilter(next);
    setPage(1);
  }

  function handlePageSizeChange(next: PageSizeOption) {
    setPageSize(next);
    setPage(1);
  }

  function goToFirstPage() {
    setPage(1);
  }

  function goToPrevPage() {
    setPage((prev) => Math.max(1, prev - 1));
  }

  function goToNextPage() {
    setPage((prev) => Math.min(totalPages, prev + 1));
  }

  function goToLastPage() {
    setPage(totalPages);
  }

  return (
    <div className="flex flex-1 flex-col gap-6">
      <header>
        <h1 className="text-xl font-semibold tracking-tight md:text-2xl">
          {t("info.title", "Assets information")}
        </h1>
        <p className="mt-1 max-w-prose text-sm text-muted-foreground">
          {t(
            "info.subtitle",
            "Browse crypto and fiat assets from the public Coinbase API. You can inspect details, see if a rate is available, and add them to your watchlist."
          )}
        </p>
      </header>

      {/* Toolbar: search, filter, count */}
      <div className="flex flex-col gap-3 rounded-md border bg-card p-3 text-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
          <Input
            type="search"
            value={search}
            onChange={(e) => handleSearchChange(e.target.value)}
            placeholder={t(
              "info.searchPlaceholder",
              "Search by symbol or name, e.g. BTC or Euro"
            )}
            className="h-9 max-w-md text-sm"
            aria-label={t("info.searchLabel", "Search assets")}
          />

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{t("info.filterLabel", "Type")}:</span>
            <div className="inline-flex rounded-md border bg-background p-0.5">
              <FilterChip
                active={filter === "all"}
                onClick={() => handleFilterChange("all")}
              >
                {t("info.filterAll", "All")}
              </FilterChip>
              <FilterChip
                active={filter === "crypto"}
                onClick={() => handleFilterChange("crypto")}
              >
                {t("info.filterCrypto", "Crypto")}
              </FilterChip>
              <FilterChip
                active={filter === "fiat"}
                onClick={() => handleFilterChange("fiat")}
              >
                {t("info.filterFiat", "Fiat")}
              </FilterChip>
            </div>
          </div>
        </div>

        <div className="text-xs text-muted-foreground">
          {t("info.totalLabel", {
            defaultValue: "Showing {{count}} of {{total}} assets",
            count: filteredAssets.length,
            total: assets.length,
          })}
        </div>
      </div>

      {/* Content area */}
      <div className="flex-1 space-y-4">
        {isLoading && (
          <p className="text-sm text-muted-foreground">
            {t("common.loading", "Loading…")}
          </p>
        )}

        {!isLoading && error && (
          <div className="flex flex-wrap items-center gap-3 text-sm text-destructive">
            <p>
              {t("common.errorPrefix", "Error:")} {error}
            </p>
            <Button
              type="button"
              size="sm"
              variant="outline"
              onClick={() => void fetchAssets()}
            >
              {t("info.retry", "Retry")}
            </Button>
          </div>
        )}

        {!isLoading && !error && filteredAssets.length === 0 && (
          <p className="text-sm text-muted-foreground">
            {t(
              "info.empty",
              "No assets match your filters. Try adjusting the search term or type filter."
            )}
          </p>
        )}

        {!isLoading && !error && filteredAssets.length > 0 && (
          <>
            {/* Paginated grid */}
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {pageAssets.map((asset) => {
                const rate = rates[asset.code];
                const hasRate = Number.isFinite(rate);
                const inWatchlist = watchlist.includes(
                  asset.code.toUpperCase()
                );

                return (
                  <Card
                    key={asset.code}
                    className="cursor-pointer transition-colors hover:bg-muted/60"
                    role="button"
                    tabIndex={0}
                    onClick={() => openAssetDialog(asset.code)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        openAssetDialog(asset.code);
                      }
                    }}
                    aria-label={t("info.assetCardLabel", {
                      defaultValue: "Open details for {{code}}",
                      code: asset.code,
                    })}
                  >
                    <CardHeader className="space-y-1">
                      <CardTitle className="flex items-center justify-between gap-2 text-sm">
                        <span className="font-mono text-base">
                          {asset.code}
                        </span>
                        <Badge
                          variant={
                            asset.kind === "crypto" ? "default" : "outline"
                          }
                        >
                          {asset.kind === "crypto"
                            ? t("info.badgeCrypto", "Crypto")
                            : t("info.badgeFiat", "Fiat")}
                        </Badge>
                      </CardTitle>
                      <p className="text-xs text-muted-foreground">
                        {asset.name}
                      </p>
                    </CardHeader>
                    <CardContent className="space-y-2 text-xs">
                      <p className="text-muted-foreground">
                        {hasRate
                          ? t("info.hasRate", {
                              defaultValue:
                                "1 {{base}} = {{value}} {{code}} (from rates)",
                              base: baseCurrency,
                              value: (rates[asset.code] ?? 0).toFixed(6),
                              code: asset.code,
                            })
                          : t(
                              "info.noRate",
                              "No rate available in the current base currency."
                            )}
                      </p>

                      {asset.minSize && (
                        <p className="text-muted-foreground">
                          {t("info.minSize", {
                            defaultValue: "Min. trade size: {{size}}",
                            size: asset.minSize,
                          })}
                        </p>
                      )}

                      {inWatchlist && (
                        <Badge variant="outline">
                          {t("info.inWatchlist", "In watchlist")}
                        </Badge>
                      )}
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Pagination bar – same UX as RatesTable */}
            <div className="mt-4 flex flex-col items-center justify-between gap-3 border-t pt-3 text-xs text-muted-foreground sm:flex-row">
              {/* Page size selector */}
              <div className="flex items-center gap-2">
                <span>{t("info.pageSizeLabel", "Items per page")}:</span>
                <select
                  className="h-8 rounded-md border bg-background px-2 text-xs"
                  value={pageSize}
                  onChange={(e) =>
                    handlePageSizeChange(
                      Number(e.target.value) as PageSizeOption
                    )
                  }
                  aria-label={t("info.pageSizeLabel", "Items per page")}
                >
                  {PAGE_SIZE_OPTIONS.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>

              {/* Page navigation */}
              <div className="flex items-center gap-2">
                <span>
                  {t("info.pageStatus", {
                    defaultValue: "Page {{page}} of {{pages}}",
                    page: safePage,
                    pages: totalPages,
                  })}
                </span>
                <div className="inline-flex gap-1">
                  <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    onClick={goToFirstPage}
                    disabled={safePage === 1}
                    aria-label={t("info.firstPage", "First page")}
                  >
                    «
                  </Button>
                  <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    onClick={goToPrevPage}
                    disabled={safePage === 1}
                    aria-label={t("info.prevPage", "Previous page")}
                  >
                    ‹
                  </Button>
                  <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    onClick={goToNextPage}
                    disabled={safePage === totalPages}
                    aria-label={t("info.nextPage", "Next page")}
                  >
                    ›
                  </Button>
                  <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    onClick={goToLastPage}
                    disabled={safePage === totalPages}
                    aria-label={t("info.lastPage", "Last page")}
                  >
                    »
                  </Button>
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Detail dialog */}
      <AssetDetailDialog
        open={dialogOpen && Boolean(selectedAsset)}
        onOpenChange={(open) => {
          if (!open) {
            closeDialog();
          } else {
            setDialogOpen(true);
          }
        }}
        asset={selectedAsset}
        rate={selectedRate}
        baseCurrency={baseCurrency}
        isInWatchlist={isInWatchlist}
        onAddToWatchlist={() => {
          if (selectedAsset) {
            addSymbol(selectedAsset.code);
          }
        }}
        onRemoveFromWatchlist={() => {
          if (selectedAsset) {
            removeSymbol(selectedAsset.code);
          }
        }}
        onSetBaseCurrency={async () => {
          if (!selectedAsset) return;
          const { setBaseCurrency, fetchRates } = useCoinbaseStore.getState();
          setBaseCurrency(selectedAsset.code);
          await fetchRates(selectedAsset.code);
        }}
      />
    </div>
  );
}

type FilterChipProps = {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
};

function FilterChip({ active, onClick, children }: FilterChipProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={[
        "rounded px-2 py-1 text-xs transition-colors",
        active
          ? "bg-primary text-primary-foreground"
          : "text-muted-foreground hover:bg-muted/60",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

type AssetDetailDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  asset?: Asset;
  rate?: number;
  baseCurrency: string;
  isInWatchlist: boolean;
  onAddToWatchlist: () => void;
  onRemoveFromWatchlist: () => void;
  onSetBaseCurrency: () => void | Promise<void>;
};

function AssetDetailDialog({
  open,
  onOpenChange,
  asset,
  rate,
  baseCurrency,
  isInWatchlist,
  onAddToWatchlist,
  onRemoveFromWatchlist,
  onSetBaseCurrency,
}: AssetDetailDialogProps) {
  const { t } = useTranslation();

  if (!asset) return null;

  const hasRate = rate != null && Number.isFinite(rate);
  const inverse = hasRate && rate !== 0 ? Number((1 / rate).toFixed(6)) : null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {asset.code} — {asset.name}
          </DialogTitle>
          <DialogDescription>
            {asset.kind === "crypto"
              ? t(
                  "info.detailDescriptionCrypto",
                  "Crypto asset from the public Coinbase currencies endpoint."
                )
              : t(
                  "info.detailDescriptionFiat",
                  "Fiat currency from the public Coinbase currencies endpoint."
                )}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-3 text-sm">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant={asset.kind === "crypto" ? "default" : "outline"}>
              {asset.kind === "crypto"
                ? t("info.badgeCrypto", "Crypto")
                : t("info.badgeFiat", "Fiat")}
            </Badge>
            {isInWatchlist && (
              <Badge variant="outline">
                {t("info.inWatchlist", "In watchlist")}
              </Badge>
            )}
            {hasRate && (
              <Badge variant="outline">
                {t("info.hasRateShort", "Rate available")}
              </Badge>
            )}
          </div>

          {hasRate && (
            <div className="space-y-1">
              <p className="text-xs uppercase text-muted-foreground">
                {t("info.detailRateLabel", "Current rate (snapshot)")}
              </p>
              <p className="font-mono text-sm">
                1 {baseCurrency} = {rate!.toFixed(6)} {asset.code}
              </p>
              {inverse != null && (
                <p className="font-mono text-xs text-muted-foreground">
                  1 {asset.code} ≈ {inverse} {baseCurrency}
                </p>
              )}
            </div>
          )}

          {asset.minSize && (
            <div className="space-y-1">
              <p className="text-xs uppercase text-muted-foreground">
                {t("info.detailMinSizeLabel", "Minimum trade size")}
              </p>
              <p className="font-mono text-sm">{asset.minSize}</p>
            </div>
          )}

          <div className="space-y-1">
            <p className="text-xs uppercase text-muted-foreground">
              {t("info.detailNotesLabel", "Notes (local demo)")}
            </p>
            <p className="text-xs text-muted-foreground">
              {t(
                "info.detailNotesBody",
                "In a real application, this is where you would display user-specific notes, risk ratings, or tags for this asset."
              )}
            </p>
          </div>
        </div>

        <DialogFooter className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-between">
          <div className="flex gap-2">
            {!isInWatchlist ? (
              <Button
                type="button"
                size="sm"
                variant="default"
                onClick={onAddToWatchlist}
              >
                {t("info.addToWatchlist", "Add to watchlist")}
              </Button>
            ) : (
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={onRemoveFromWatchlist}
              >
                {t("info.removeFromWatchlist", "Remove from watchlist")}
              </Button>
            )}
          </div>

          <Button
            type="button"
            size="sm"
            variant="outline"
            onClick={onSetBaseCurrency}
          >
            {t("info.setAsBase", {
              defaultValue: "Set {{code}} as base currency",
              code: asset.code,
            })}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
