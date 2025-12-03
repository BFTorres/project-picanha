// src/components/dashboard/SectionCards.tsx
import { useTranslation } from "react-i18next"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useCoinbaseStore } from "@/stores/coinbase-store"

export function SectionCards() {
  const { t } = useTranslation()
  const { baseCurrency } = useCoinbaseStore()



  return (
    <div className="grid gap-4 md:grid-cols-3">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">
            {t("portfolio.cards.picanhaBalance", "Picanha Money Balance")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-semibold">5,700.00 {baseCurrency || "—"}</p>
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
          <p className="text-2xl font-semibold">4,300.00 {baseCurrency || "—"}</p>
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
          <p className="text-2xl font-semibold">10,000.00 {baseCurrency || "—"}</p>

        </CardContent>
      </Card>
    </div>
  )
}