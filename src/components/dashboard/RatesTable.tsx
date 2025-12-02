// src/components/dashboard/RatesTable.tsx
import { useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"

import { useCoinbaseStore } from "@/stores/coinbase-store"
import { useWatchlistStore } from "@/stores/watchlist-store"

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100] as const

export function RatesTable() {
  const { t } = useTranslation()
  const { baseCurrency, rates, isLoading, error, fetchRates, setBaseCurrency } =
    useCoinbaseStore()
  const { symbols: watchlist, addSymbol } = useWatchlistStore()

  const [query, setQuery] = useState("")
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState<number>(10) // default: 10 rows per page

  const [detailsOpen, setDetailsOpen] = useState(false)
  const [selectedSymbol, setSelectedSymbol] = useState<string | null>(null)
  const [selectedRate, setSelectedRate] = useState<number | null>(null)

  // Keyboard shortcuts: ← and → for previous / next page
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null
      const tag = target?.tagName
      const role = target?.getAttribute("role")

      if (
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        tag === "SELECT" ||
        role === "combobox"
      ) {
        return
      }

      if (e.key === "ArrowLeft") {
        setPage((prev) => (prev > 1 ? prev - 1 : prev))
      } else if (e.key === "ArrowRight") {
        setPage((prev) => prev + 1)
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [])

  const { rowsForPage, totalItems, pageCount, safePage } = useMemo(() => {
    const entries = Object.entries(rates)
      .filter(([symbol]) => symbol.length <= 5)
      .sort(([a], [b]) => a.localeCompare(b))

    const filtered =
      query.trim().length > 0
        ? entries.filter(([symbol]) =>
            symbol.toLowerCase().includes(query.trim().toLowerCase()),
          )
        : entries

    const total = filtered.length
    const pages = Math.max(1, Math.ceil(total / pageSize))

    const current = Math.min(Math.max(page, 1), pages)

    const start = (current - 1) * pageSize
    const end = start + pageSize
    const pageSlice = filtered.slice(start, end)

    return {
      rowsForPage: pageSlice,
      totalItems: total,
      pageCount: pages,
      safePage: current,
    }
  }, [rates, query, page, pageSize])

  function handlePageChange(nextPage: number) {
    const clamped = Math.min(Math.max(nextPage, 1), pageCount)
    setPage(clamped)
  }

  function handlePageSizeChange(value: string) {
    const next = parseInt(value, 10)
    if (!Number.isNaN(next)) {
      setPageSize(next)
      setPage(1)
    }
  }

  function handleQueryChange(value: string) {
    setQuery(value)
    setPage(1)
  }

  function openDetails(symbol: string, rate: number) {
    setSelectedSymbol(symbol)
    setSelectedRate(rate)
    setDetailsOpen(true)
  }

  const isInWatchlist =
    selectedSymbol != null &&
    watchlist.includes(selectedSymbol.toUpperCase())

  return (
    <Card>
      <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle className="text-base font-semibold">
            {t("dashboard.table.title", "Exchange rates table")}
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            {t("dashboard.table.subtitle", {
              defaultValue: "Base: {{base}}",
              base: baseCurrency,
            })}
          </p>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <Input
            type="search"
            value={query}
            onChange={(e) => handleQueryChange(e.target.value)}
            placeholder={t(
              "dashboard.table.searchPlaceholder",
              "Filter by symbol, e.g. BTC",
            )}
            className="h-8 max-w-xs text-xs"
            aria-label={t("dashboard.table.searchLabel", "Filter currencies")}
          />

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{t("dashboard.table.pageSizeLabel", "Rows per page")}</span>
            <Select
              value={String(pageSize)}
              onValueChange={handlePageSizeChange}
            >
              <SelectTrigger className="h-8 w-[90px] text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PAGE_SIZE_OPTIONS.map(
                  (size: (typeof PAGE_SIZE_OPTIONS)[number]) => (
                    <SelectItem key={size} value={String(size)}>
                      {size}
                    </SelectItem>
                  ),
                )}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {isLoading && (
          <p className="text-sm text-muted-foreground">
            {t("dashboard.table.loading", "Loading rates…")}
          </p>
        )}

        {!isLoading && error && (
          <p className="text-sm text-destructive">
            {t("dashboard.table.error", {
              defaultValue: "Could not load rates: {{message}}",
              message: error,
            })}
          </p>
        )}

        {!isLoading && !error && totalItems === 0 && (
          <p className="text-sm text-muted-foreground">
            {query.trim()
              ? t(
                  "dashboard.table.noResults",
                  "No currencies match your filter.",
                )
              : t(
                  "dashboard.table.empty",
                  "No rates available. Try fetching data from Coinbase.",
                )}
          </p>
        )}

        {!isLoading && !error && totalItems > 0 && (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b bg-muted/40">
                    <th className="py-2 pl-2 pr-4 text-left font-medium">
                      {t("dashboard.table.symbol", "Symbol")}
                    </th>
                    <th className="py-2 px-4 text-right font-medium">
                      {t("dashboard.table.rate", "1 {{base}} =", {
                        base: baseCurrency,
                      })}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rowsForPage.map(([symbol, value]) => (
                    <tr
                      key={symbol}
                      className="cursor-pointer border-b last:border-0 hover:bg-muted"
                      onClick={() => openDetails(symbol, value)}
                      tabIndex={0}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault()
                          openDetails(symbol, value)
                        }
                      }}
                    >
                      <td className="py-1.5 pl-2 pr-4 font-mono">{symbol}</td>
                      <td className="py-1.5 px-4 text-right">
                        {value.toFixed(6)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {pageCount > 1 && (
              <div className="flex flex-col items-center justify-between gap-2 pt-2 text-xs text-muted-foreground sm:flex-row">
                <span>
                  {t("dashboard.table.paginationInfo", {
                    defaultValue:
                      "Showing {{from}}–{{to}} of {{total}} symbols (page {{page}} of {{pages}})",
                    from: (safePage - 1) * pageSize + 1,
                    to: Math.min(safePage * pageSize, totalItems),
                    total: totalItems,
                    page: safePage,
                    pages: pageCount,
                  })}
                </span>

                <Pagination>
                  <PaginationContent>
                    {/* First page */}
                    <PaginationItem>
                      <PaginationLink
                        href="#"
                        aria-label={t(
                          "dashboard.table.firstPage",
                          "Go to first page",
                        )}
                        onClick={(e) => {
                          e.preventDefault()
                          if (safePage > 1) handlePageChange(1)
                        }}
                        className={
                          safePage === 1
                            ? "pointer-events-none opacity-50"
                            : undefined
                        }
                      >
                        «
                      </PaginationLink>
                    </PaginationItem>

                    {/* Previous */}
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          if (safePage > 1) handlePageChange(safePage - 1)
                        }}
                        aria-disabled={safePage === 1}
                        className={
                          safePage === 1
                            ? "pointer-events-none opacity-50"
                            : undefined
                        }
                      />
                    </PaginationItem>

                    {/* Numeric page links */}
                    {Array.from({ length: pageCount }).map((_, index) => {
                      const p = index + 1

                      if (
                        p === 1 ||
                        p === pageCount ||
                        Math.abs(p - safePage) <= 1
                      ) {
                        return (
                          <PaginationItem key={p}>
                            <PaginationLink
                              href="#"
                              isActive={p === safePage}
                              onClick={(e) => {
                                e.preventDefault()
                                handlePageChange(p)
                              }}
                            >
                              {p}
                            </PaginationLink>
                          </PaginationItem>
                        )
                      }

                      if (p === 2 && safePage > 3) {
                        return (
                          <PaginationItem key="start-ellipsis">
                            <span className="px-2">…</span>
                          </PaginationItem>
                        )
                      }

                      if (p === pageCount - 1 && safePage < pageCount - 2) {
                        return (
                          <PaginationItem key="end-ellipsis">
                            <span className="px-2">…</span>
                          </PaginationItem>
                        )
                      }

                      return null
                    })}

                    {/* Next */}
                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          if (safePage < pageCount) {
                            handlePageChange(safePage + 1)
                          }
                        }}
                        aria-disabled={safePage === pageCount}
                        className={
                          safePage === pageCount
                            ? "pointer-events-none opacity-50"
                            : undefined
                        }
                      />
                    </PaginationItem>

                    {/* Last page */}
                    <PaginationItem>
                      <PaginationLink
                        href="#"
                        aria-label={t(
                          "dashboard.table.lastPage",
                          "Go to last page",
                        )}
                        onClick={(e) => {
                          e.preventDefault()
                          if (safePage < pageCount) {
                            handlePageChange(pageCount)
                          }
                        }}
                        className={
                          safePage === pageCount
                            ? "pointer-events-none opacity-50"
                            : undefined
                        }
                      >
                        »
                      </PaginationLink>
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        )}

        {/* Symbol detail drawer */}
        <SymbolDetailsSheet
          open={detailsOpen}
          onOpenChange={setDetailsOpen}
          baseCurrency={baseCurrency}
          symbol={selectedSymbol}
          rate={selectedRate}
          isInWatchlist={Boolean(isInWatchlist)}
          onAddToWatchlist={() => {
            if (selectedSymbol) {
              addSymbol(selectedSymbol)
            }
          }}
          onSetBaseCurrency={async () => {
            if (!selectedSymbol) return
            setBaseCurrency(selectedSymbol)
            await fetchRates(selectedSymbol)
          }}
        />
      </CardContent>
    </Card>
  )
}

type SymbolDetailsSheetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  baseCurrency: string
  symbol: string | null
  rate: number | null
  isInWatchlist: boolean
  onAddToWatchlist: () => void
  onSetBaseCurrency: () => void | Promise<void>
}

function SymbolDetailsSheet({
  open,
  onOpenChange,
  baseCurrency,
  symbol,
  rate,
  isInWatchlist,
  onAddToWatchlist,
  onSetBaseCurrency,
}: SymbolDetailsSheetProps) {
  const { t } = useTranslation()

  // If nothing is selected, keep sheet hidden even if 'open' is true by mistake
  const effectiveOpen = open && symbol != null && rate != null

  const inverse =
    rate != null && rate !== 0 ? 1 / rate : null

  return (
    <Sheet open={effectiveOpen} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full max-w-md">
        <SheetHeader>
          <SheetTitle>
            {symbol ? `${symbol} / ${baseCurrency}` : t("drawer.title", "Details")}
          </SheetTitle>
          <SheetDescription>
            {t(
              "drawer.description",
              "Quick details and actions for the selected currency pair.",
            )}
          </SheetDescription>
        </SheetHeader>

        {symbol != null && rate != null && (
          <div className="mt-4 space-y-4 text-sm">
            <div>
              <p className="text-xs font-medium text-muted-foreground">
                {t("drawer.currentRateLabel", "Current rate")}
              </p>
              <p className="mt-1 font-mono text-base">
                1 {baseCurrency} = {rate.toFixed(6)} {symbol}
              </p>
              {inverse != null && (
                <p className="mt-1 font-mono text-xs text-muted-foreground">
                  1 {symbol} ≈ {inverse.toFixed(6)} {baseCurrency}
                </p>
              )}
            </div>

            <div>
              <p className="text-xs font-medium text-muted-foreground">
                {t("drawer.actionsLabel", "Actions")}
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                {t(
                  "drawer.actionsHint",
                  "You can add this symbol to your watchlist or use it as the base currency for all rates.",
                )}
              </p>
            </div>
          </div>
        )}

        <SheetFooter className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-between">
          <Button
            type="button"
            variant={isInWatchlist ? "outline" : "default"}
            size="sm"
            disabled={isInWatchlist || !symbol}
            onClick={onAddToWatchlist}
          >
            {isInWatchlist
              ? t("drawer.inWatchlist", "Already in watchlist")
              : t("drawer.addToWatchlist", "Add to watchlist")}
          </Button>

          <Button
            type="button"
            variant="outline"
            size="sm"
            disabled={!symbol}
            onClick={onSetBaseCurrency}
          >
            {t(
              "drawer.setAsBase",
              "Set {{symbol}} as base currency",
              { symbol: symbol ?? "" },
            )}
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}