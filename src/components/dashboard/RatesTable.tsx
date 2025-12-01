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
import { useCoinbaseStore } from "@/stores/coinbase-store"

const PAGE_SIZE_OPTIONS = [10, 25, 50, 100] as const

export function RatesTable() {
  const { t } = useTranslation()
  const { baseCurrency, rates, isLoading, error } = useCoinbaseStore()

  const [query, setQuery] = useState("")
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState<number>(10) // default: 10 rows per page

  // Keyboard shortcuts: ← and → for previous / next page
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      // Ignore when typing in inputs, textareas, selects, or comboboxes
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
        setPage((prev) => prev + 1) // clamped later in memo
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
      setPage(1) // reset to first page when page size changes
    }
  }

  function handleQueryChange(value: string) {
    setQuery(value)
    setPage(1) // reset to first page when filter changes
  }

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
                    <tr key={symbol} className="border-b last:border-0">
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
      </CardContent>
    </Card>
  )
}
