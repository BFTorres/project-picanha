import type { FormEvent } from "react"
import { useState } from "react"
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { useCoinbaseStore } from "@/stores/coinbase-store"
import { useWatchlistStore } from "@/stores/watchlist-store"

export function WatchlistPanel() {
  const { t } = useTranslation()
  const { rates } = useCoinbaseStore()
  const { items, addItem, removeItem, updateItem, clear } = useWatchlistStore()

  const [symbol, setSymbol] = useState("")
  const [note, setNote] = useState("")
  const [error, setError] = useState<string | null>(null)

  function handleAdd(e: FormEvent) {
    e.preventDefault()
    const trimmed = symbol.trim().toUpperCase()

    if (!trimmed) {
      setError(
        t("watchlist.error.emptySymbol", "Please enter a currency symbol."),
      )
      return
    }

    if (!(trimmed in rates)) {
      setError(
        t(
          "watchlist.error.unknownSymbol",
          "Symbol {{symbol}} is not in the current rates list.",
          { symbol: trimmed },
        ),
      )
      return
    }

    addItem(trimmed, note.trim())
    setSymbol("")
    setNote("")
    setError(null)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between gap-2 text-base">
          <span>{t("watchlist.title", "Watchlist")}</span>
          {items.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              type="button"
              onClick={clear}
            >
              {t("watchlist.clear", "Clear")}
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <form
          onSubmit={handleAdd}
          className="grid grid-cols-1 gap-2 sm:grid-cols-[120px,1fr,auto]"
        >
          <Input
            value={symbol}
            onChange={(e) => setSymbol(e.target.value)}
            placeholder={t("watchlist.symbolPlaceholder", "e.g. BTC")}
            className="h-8 text-sm"
            aria-label={t("watchlist.symbolLabel", "Currency symbol")}
          />
          <Input
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder={t("watchlist.notePlaceholder", "Optional note")}
            className="h-8 text-sm"
            aria-label={t("watchlist.noteLabel", "Note")}
          />
          <Button type="submit" size="sm" className="h-8">
            {t("watchlist.add", "Add")}
          </Button>
        </form>

        {error && (
          <p className="text-xs text-destructive" role="alert">
            {error}
          </p>
        )}

        {items.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            {t(
              "watchlist.empty",
              "No items yet. Add symbols from the current rates.",
            )}
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse text-xs sm:text-sm">
              <thead>
                <tr className="border-b bg-muted/40">
                  <th className="py-1.5 pl-2 pr-4 text-left font-medium">
                    {t("watchlist.table.symbol", "Symbol")}
                  </th>
                  <th className="py-1.5 px-2 text-left font-medium">
                    {t("watchlist.table.note", "Note")}
                  </th>
                  <th className="py-1.5 px-2 text-right font-medium">
                    {t("watchlist.table.actions", "Actions")}
                  </th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item.id} className="border-b last:border-0">
                    <td className="py-1.5 pl-2 pr-4 font-mono">
                      {item.symbol}
                    </td>
                    <td className="py-1.5 px-2">
                      <Input
                        value={item.note}
                        onChange={(e) =>
                          updateItem(item.id, { note: e.target.value })
                        }
                        className="h-7 text-xs sm:text-sm"
                        aria-label={t("watchlist.noteEditLabel", {
                          defaultValue: "Edit note for {{symbol}}",
                          symbol: item.symbol,
                        })}
                      />
                    </td>
                    <td className="py-1.5 px-2 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        type="button"
                        onClick={() => removeItem(item.id)}
                        aria-label={t("watchlist.remove", {
                          defaultValue: "Remove {{symbol}} from watchlist",
                          symbol: item.symbol,
                        })}
                      >
                        {t("watchlist.removeShort", "Remove")}
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

