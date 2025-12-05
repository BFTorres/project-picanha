import { useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { format, isWithinInterval, parseISO, startOfDay, endOfDay } from "date-fns"
import { CalendarIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { HistoryData } from "../data/HistoryData"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
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
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

// JSON Data
type Transaction = {
  id: string
  date: string
  type: "buy" | "sell"
  asset: "BTC" | "SOL" | "EUR"
  amount: number
  price: number
  total: number
  status: "completed" | "pending"
}

const PAGE_SIZE_OPTIONS = [5, 10, 20] as const

export function HistoryTable() {
  const { t } = useTranslation()

  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState<number>(10)
  const [from, setFrom] = useState<Date>()
  const [to, setTo] = useState<Date>()

  const [detailsOpen, setDetailsOpen] = useState(false)
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null)

  const { rowsForPage, totalItems, pageCount, safePage } = useMemo(() => {
    let filtered = HistoryData

    if (from || to) {
      filtered = filtered.filter((tx) => {
        const txDate = parseISO(tx.date)
        return isWithinInterval(txDate, {
          start: from ? startOfDay(from) : new Date(0),
          end: to ? endOfDay(to) : new Date(),
        })
      })
    }

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
  }, [from, to, page, pageSize])

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

  function openDetails(tx: Transaction) {
    setSelectedTx(tx)
    setDetailsOpen(true)
  }

  return (
    <Card>
      <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <CardTitle className="text-base font-semibold">
            {t("dashboard.table.title", "Transaction History")}
          </CardTitle>
        </div>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          {/* FROM PICKER */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "h-8 px-2 text-xs justify-start text-left font-normal",
                  !from && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-3 w-3" />
                {from ? format(from, "dd/MM/yyyy") : "From"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={from}
                onSelect={setFrom}
                className="rounded-md border shadow-sm"
                captionLayout="dropdown"
              />
            </PopoverContent>
          </Popover>

          {/* TO PICKER */}
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className={cn(
                  "h-8 px-2 text-xs justify-start text-left font-normal",
                  !to && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-3 w-3" />
                {to ? format(to, "dd/MM/yyyy") : "To"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={to}
                onSelect={setTo}
                className="rounded-md border shadow-sm"
                captionLayout="dropdown"
              />
            </PopoverContent>
          </Popover>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{t("dashboard.table.pageSizeLabel", "Rows per page")}</span>
            <Select
              value={String(pageSize)}
              onValueChange={handlePageSizeChange}
            >
              <SelectTrigger className="h-8 w-[70px] text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PAGE_SIZE_OPTIONS.map((size) => (
                  <SelectItem key={size} value={String(size)}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        {totalItems === 0 ? (
          <p className="text-sm text-muted-foreground py-8 text-center">
            {t("dashboard.table.noResults", "No transactions found for the selected period.")}
          </p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b bg-muted/40">
                    <th className="py-2 pl-2 pr-4 text-left font-medium">Date</th>
                    <th className="py-2 px-4 text-left font-medium">Type</th>
                    <th className="py-2 px-4 text-left font-medium">Asset</th>
                    <th className="py-2 px-4 text-right font-medium">Amount</th>
                    <th className="py-2 px-4 text-right font-medium">Price</th>
                    <th className="py-2 px-4 text-right font-medium">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {rowsForPage.map((tx) => (
                    <tr
                      key={tx.id}
                      className="cursor-pointer border-b last:border-0 hover:bg-muted"
                      onClick={() => openDetails(tx)}
                    >
                      <td className="py-2 pl-2 pr-4">
                        {format(parseISO(tx.date), "dd/MM/yyyy HH:mm")}
                      </td>
                      <td className="py-2 px-4 capitalize">
                        <span className={cn(
                          "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                          tx.type === "buy"
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                        )}>
                          {tx.type}
                        </span>
                      </td>
                      <td className="py-2 px-4 font-medium">{tx.asset}</td>
                      <td className="py-2 px-4 text-right font-mono">
                        {tx.amount.toFixed(6)}
                      </td>
                      <td className="py-2 px-4 text-right font-mono">
                        EUR {tx.price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                      <td className="py-2 px-4 text-right font-mono font-medium">
                        EUR {tx.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {pageCount > 1 && (
              <div className="flex flex-col items-center justify-between gap-2 pt-2 text-xs text-muted-foreground sm:flex-row">
                <span>
                  Showing {(safePage - 1) * pageSize + 1}–
                  {Math.min(safePage * pageSize, totalItems)} of {totalItems} transactions
                </span>

                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          if (safePage > 1) handlePageChange(safePage - 1)
                        }}
                        className={safePage === 1 ? "pointer-events-none opacity-50" : undefined}
                      />
                    </PaginationItem>

                    {Array.from({ length: pageCount }).map((_, i) => {
                      const p = i + 1
                      if (p === 1 || p === pageCount || Math.abs(p - safePage) <= 1) {
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
                      if (p === 2 && safePage > 3) return <PaginationItem key="start-ellipsis"><span className="px-2">…</span></PaginationItem>
                      if (p === pageCount - 1 && safePage < pageCount - 2) return <PaginationItem key="end-ellipsis"><span className="px-2">…</span></PaginationItem>
                      return null
                    })}

                    <PaginationItem>
                      <PaginationNext
                        href="#"
                        onClick={(e) => {
                          e.preventDefault()
                          if (safePage < pageCount) handlePageChange(safePage + 1)
                        }}
                        className={safePage === pageCount ? "pointer-events-none opacity-50" : undefined}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            )}
          </>
        )}

        <TransactionDetailsSheet
          open={detailsOpen}
          onOpenChange={setDetailsOpen}
          transaction={selectedTx}
        />
      </CardContent>
    </Card>
  )
}

type TransactionDetailsSheetProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  transaction: Transaction | null
}

function TransactionDetailsSheet({
  open,
  onOpenChange,
  transaction,
}: TransactionDetailsSheetProps) {
  if (!transaction) return null

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Transaction Details</SheetTitle>
          <SheetDescription>
            ID: {transaction.id}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">Date</p>
              <p className="font-medium">{format(parseISO(transaction.date), "PPP p")}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Type</p>
              <p className="font-medium capitalize">{transaction.type}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Asset</p>
              <p className="font-medium">{transaction.asset}</p>
            </div>
            <div>
              <p className="text-muted-foreground">Status</p>
              <p className="font-medium capitalize">{transaction.status}</p>
            </div>
          </div>

          <div className="rounded-lg border p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Amount</span>
              <span className="font-mono">{transaction.amount.toFixed(8)} {transaction.asset}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Price per unit</span>
              <span className="font-mono">EUR {transaction.price.toLocaleString()}</span>
            </div>
            <div className="border-t pt-2 mt-2 flex justify-between font-medium">
              <span>Total</span>
              <span className="font-mono">EUR {transaction.total.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}