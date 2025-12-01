// src/pages/InformationPage.tsx
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

export function InformationPage() {
  const { t } = useTranslation();
  const { assets, isLoading, error, fetchAssets } = useInfoStore();
  const rates = useCoinbaseStore((state) => state.rates);
  const baseCurrency = useCoinbaseStore((state) => state.baseCurrency);
  const { symbols: watchlist, addSymbol, removeSymbol } = useWatchlistStore();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<KindFilter>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCode, setSelectedCode] = useState<string | null>(null);

  // Fetch once on first mount if we have no assets yet
  useEffect(() => {
    if (assets.length === 0) {
      void fetchAssets();
    }
  }, [assets.length, fetchAssets]);

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

      <div className="flex flex-col gap-3 rounded-md border bg-card p-3 text-sm sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 flex-col gap-2 sm:flex-row sm:items-center">
          <Input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
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
                onClick={() => setFilter("all")}
              >
                {t("info.filterAll", "All")}
              </FilterChip>
              <FilterChip
                active={filter === "crypto"}
                onClick={() => setFilter("crypto")}
              >
                {t("info.filterCrypto", "Crypto")}
              </FilterChip>
              <FilterChip
                active={filter === "fiat"}
                onClick={() => setFilter("fiat")}
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
          <p className="text-sm text-destructive">
            {t("common.errorPrefix", "Error:")} {error}
          </p>
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
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredAssets.map((asset) => {
              const rate = rates[asset.code];
              const hasRate = Number.isFinite(rate);
              const inWatchlist = watchlist.includes(asset.code.toUpperCase());

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
                      <span className="font-mono text-base">{asset.code}</span>
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

  if (!asset) {
    return null;
  }

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

          {/* Placeholder for future CRUD: local notes, tags, etc. */}
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
