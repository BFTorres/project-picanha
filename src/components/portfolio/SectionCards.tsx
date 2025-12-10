import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useCoinbaseStore } from "@/stores/coinbase-store"
import { HistoryData } from "@/data/HistoryData"

// TODO: Liste FIAT muss mit der API abgestimmt werden
const FIAT_CURRENCIES = ["EUR", "USD", "GBP", "CHF", "JPY", "CNY"] as const

export function SectionCards() {
  const { t } = useTranslation()
  const { baseCurrency } = useCoinbaseStore()

  const histData = HistoryData

  let picanhaBalance = 0
  let cryptoWalletBalance = 0

  for (const tx of histData) {
    const { asset, type, total } = tx
    const isBuy = type === "buy"

    const isFiat = FIAT_CURRENCIES.includes(asset as any)

    // Picanha Money balance (nur FIAT Währungen)
    if (isFiat) {
      picanhaBalance += isBuy ? total : -total
    } else {
      picanhaBalance += isBuy ? -total : total
    }

    // Crypto balance (nur Crypto)
    if (!isFiat) {
      cryptoWalletBalance += isBuy ? total : -total
    }
  }

  const totalValue = picanhaBalance + cryptoWalletBalance

  const formatter = new Intl.NumberFormat("de-DE", {
    style: "currency",
    currency: baseCurrency,
  })

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {/* Picanha Money card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">
            {t("portfolio.cards.picanhaBalance", "Picanha Money Balance")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xl font-semibold sm:text-2xl">
            {formatter.format(picanhaBalance)}
          </p>

          <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-1 xl:grid-cols-2">
            <Button variant="outline" className="w-full">
              {t("portfolio.cards.addFunds", "Add funds")}
            </Button>
            <Button variant="default" className="w-full">
              {t("portfolio.cards.withdrawFunds", "Withdraw funds")}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Crypto wallet card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">
            {t("portfolio.cards.cryptoWallet", "Crypto wallet")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xl font-semibold sm:text-2xl">
            {formatter.format(cryptoWalletBalance)}
          </p>
          <Button variant="outline" className="mt-3 w-full sm:w-auto">
            {t("portfolio.cards.toTrading", "To Picanha Trading")}
          </Button>
        </CardContent>
      </Card>

      {/* Total value card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">
            {t("portfolio.cards.totalValue", "Total value")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-xl font-semibold sm:text-2xl">
            {formatter.format(totalValue)}
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
