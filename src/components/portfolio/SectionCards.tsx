// src/components/dashboard/SectionCards.tsx
import { useTranslation } from "react-i18next"

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
          <p className="mt-1 text-xs text-muted-foreground">
            {t(
              "portfolio.cards.addFunds",
              "-Add Funds- ",
            )}
            {t(
              "portfolio.cards.withdrawFunds",
              " -Withdraw Funds-",
            )}
          </p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">
            {t("portfolio.cards.picanhaBalance", "Crypto Wallet")}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-2xl font-semibold">3,300.00 {baseCurrency || "—"}</p>
          <p className="mt-1 text-xs text-muted-foreground">
            {t(
              "portfolio.cards.manageWallet",
              "Picanha Trading",
            )}
          </p>
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