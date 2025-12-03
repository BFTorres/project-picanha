// src/components/dashboard/SectionCards.tsx
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useCoinbaseStore } from "@/stores/coinbase-store"
import { HistoryData } from "../data/HistoryData"
export function SectionCards() {
  const { t } = useTranslation()
  const { baseCurrency } = useCoinbaseStore()

  let histData = HistoryData
  const total = histData.length
  let picanhaBalance = 0
  let cryptoWalletBalance = 0

  const formatter = new Intl.NumberFormat("de-DE", {
    style: 'currency',
    currency: baseCurrency,
  });

  for (let i = 0; i < total; i++) {
    if (histData[i].asset === "EUR") {
      if (histData[i].type === "buy") {
        picanhaBalance += histData[i].total
      } else {
        picanhaBalance -= histData[i].total
      }
    }
    else if (histData[i].type === "buy") {
      picanhaBalance -= histData[i].total
    } else {
      picanhaBalance += histData[i].total
    }
  }
  for (let i = 0; i < total; i++) {
    if (histData[i].asset !== "EUR") {
      if (histData[i].type === "buy") {
        cryptoWalletBalance += histData[i].total
      } else {
        cryptoWalletBalance -= histData[i].total
      }
    }
  }


  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">
            {t("portfolio.cards.picanhaBalance", "Picanha Money Balance")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-semibold">{formatter.format(picanhaBalance)}</p>
          <thead>
            <div className="flex items-center gap-2">
              <Button variant="default" >
                Add Funds
              </Button>

              <Button variant="default" >
                Withdraw Funds
              </Button>
            </div>
          </thead>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">
            {t("portfolio.cards.picanhaBalance", "Crypto Wallet")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-semibold">{formatter.format(cryptoWalletBalance)} </p>
          <Button variant="default">
            To Picanha Trading
          </Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">
            {t("portfolio.cards.picanhaBalance", "Total Value")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-semibold">{formatter.format(picanhaBalance + cryptoWalletBalance)}</p>

        </CardContent>
      </Card>
    </div>
  )
}