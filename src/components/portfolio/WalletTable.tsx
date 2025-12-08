import { useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
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

type Transaction = {
  id: string
  date: string
  type: "buy" | "sell"
  asset: "BTC" | "SOL" | "EUR" | "USD"
  amount: number
  price: number
  total: number
  status: "completed" | "pending"
}

const PAGE_SIZE_OPTIONS = [5, 10, 20] as const

export function WalletTable() {
  const { t } = useTranslation()
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState<number>(10)
  const [detailsOpen, setDetailsOpen] = useState(false)
  const [selectedAsset, setSelectedAsset] = useState<{ asset: string; amount: number; total: number } | null>(null)

  const { rowsForPage, totalItems, pageCount, safePage } = useMemo(() => {


    function groupAndSumByAsset(history: Transaction[]) {
      // filter Währungen
      const filtered = history.filter((tx) => tx.asset !== "EUR" && tx.asset !== "USD")

      // addieren der amount und total
      const grouped = filtered.reduce<Record<string, { amount: number; total: number }>>((asset, tx) => {
        if (!asset[tx.asset]) {
          asset[tx.asset] = { amount: 0, total: 0 }
        }
        if (tx.type === "sell" && tx.status === "completed") {
          asset[tx.asset].amount -= tx.amount
          asset[tx.asset].total -= tx.total
        } else if (tx.type === "buy" && tx.status === "completed") {
          asset[tx.asset].amount += tx.amount
          asset[tx.asset].total += tx.total
        }
        return asset
      }, {})

      // umwandeln in array
      return Object.entries(grouped).map(([asset, { amount, total }]) => ({
        asset,
        amount,
        total,
      }))
    }
    const filtered = groupAndSumByAsset(HistoryData)
    console.log(filtered)

    const total = filtered.length
    const pages = Math.max(1, Math.ceil(total / pageSize))
    const current = Math.min(Math.max(page, 1), pages)
    const start = (current - 1) * pageSize
    const pageSlice = filtered.slice(start, start + pageSize)

    return {
      rowsForPage: pageSlice,
      totalItems: total,
      pageCount: pages,
      safePage: current,
    }
  }, [page, pageSize])

  return (
    <Card>
      <CardHeader className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <CardTitle className="text-base font-semibold">
          {t("dashboard.table.title", "Crypto wallet")}
        </CardTitle>

        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{t("dashboard.table.pageSizeLabel", "Rows per page")}</span>
            <Select
              value={String(pageSize)}
              onValueChange={(value) => {
                setPageSize(parseInt(value, 5))
                setPage(1)
              }}
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
            {t("dashboard.table.noResults", "No Assets found.")}
          </p>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse text-sm">
                <thead>
                  <tr className="border-b bg-muted/40">
                    <th className="py-2 pl-2 pr-4 text-left font-medium">Asset</th>
                    <th className="py-2 pl-2 pr-4 text-center font-medium">Amount</th>
                    <th className="py-2 pl-2 pr-4 text-right font-medium">Value</th>
                  </tr>
                </thead>
                <tbody>
                  {rowsForPage.map((asset) => (
                    <tr
                      key={asset.asset}
                      className="cursor-pointer border-b last:border-0 hover:bg-muted"
                      onClick={() => {
                        setSelectedAsset(asset)
                        setDetailsOpen(true)
                      }}
                    >
                      <td className="py-2 pl-2 pr-4">
                        {asset.asset}
                      </td>
                      <td className="py-2 pl-2 pr-4 text-center font-mono">
                        {asset.amount}
                      </td>
                      <td className="py-2 pl-2 pr-4 text-right font-mono font-medium">
                        EUR {asset.total.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
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
                          if (safePage > 1) setPage(safePage - 1)
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
                                setPage(p)
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
                          if (safePage < pageCount) setPage(safePage + 1)
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

        <AssetDetails
          open={detailsOpen}
          onOpenChange={setDetailsOpen}
          asset={selectedAsset}
        />
      </CardContent>
    </Card>
  )
}

type AssetDetailsProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  asset: { asset: string; amount: number; total: number } | null
}

function AssetDetails({
  open,
  onOpenChange,
  asset,
}: AssetDetailsProps) {
  if (!asset) return null

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right">
        <SheetHeader>
          <SheetTitle>Asset Details</SheetTitle>
          <SheetDescription>ID: {asset.asset}</SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          <div className="grid grid-cols-2 gap-4 text-sm">

          </div>

          <div className="rounded-lg border p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Amount</span>
              <span className="font-mono">{asset.amount.toFixed(8)} {asset.asset}</span>
            </div>

            <div className="border-t pt-2 mt-2 flex justify-between font-medium">
              <span>Total</span>
              <span className="font-mono">EUR {asset.total.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}