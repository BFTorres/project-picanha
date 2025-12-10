import { create } from "zustand"
import dayjs from "dayjs"
import { HistoryData, type Transaktion } from "@/data/HistoryData"

export type SeriesType = "Picanha Money Balance" | "Crypto Wallet" | "Total Value"

export interface ChartPoint {
  date: string
  value: number
}
// TODO: Liste FIAT oder isFiat() muss mit der API abgestimmt werden
const FIAT_CURRENCIES = ["EUR", "USD", "GBP", "CHF", "JPY", "CNY"] as const

export type fiat = (typeof FIAT_CURRENCIES)[number]

export function isFiat(asset: string): asset is fiat {
  return FIAT_CURRENCIES.includes(asset as fiat)
}

interface GroupedTransactionData {
  amount: number
  transactionType: "buy" | "sell"
}

interface PriceState {
  raw: readonly Transaktion[]
  type: SeriesType
  assetsInTransaktionen: readonly string[]
  setType: (type: SeriesType) => void
  getSeries: () => ChartPoint[]
}

const assetsInTransaktionen = Array.from(
  new Set(HistoryData.map((transaction) => transaction.asset))
)

export const usePrices = create<PriceState>()((set, get) => ({
  raw: HistoryData,
  assetsInTransaktionen,
  type: "Total Value",
  setType: (type) => set({ type }),

  getSeries: () => {
    const { raw, type } = get()

    const grouped: Record<string, Record<string, GroupedTransactionData>> = {}

    raw.forEach((transaction: Transaktion) => {
      const date = dayjs(transaction.date).format("YYYY-MM-DD HH:mm:ss")
      const amount = transaction.total
      const assetName = transaction.asset

      if (!grouped[date]) {
        grouped[date] = {}
      }

      grouped[date][assetName] = {
        amount,
        transactionType: transaction.type,
      }
    })

    let valueTotal = 0
    let cryptoValue = 0
    let fiatValue = 0
    return Object.entries(grouped).map(([date, values]) => {
      let valueTemp = 0
      const firstAsset = Object.keys(values)[0]
      const assetData = values[firstAsset]

      switch (type) {
        case "Picanha Money Balance":
          // Berechne Fiat-Guthaben (EUR oder USD)
          if (isFiat(firstAsset)) {
            // Verkauf reduziert Fiat-Guthaben
            // Kauf erhöht Fiat-Guthaben
            if (assetData.transactionType === "sell") {
              fiatValue -= assetData.amount
            } else {
              fiatValue += assetData.amount
            }
            valueTemp = fiatValue
          } else {
            // Bei Crypto-Transaktionen: Verkauf bringt Fiat rein, Kauf kostet Fiat
            if (assetData.transactionType === "sell") {
              fiatValue += assetData.amount
            } else {
              fiatValue -= assetData.amount
            }
            valueTemp = fiatValue
          }
          break

        case "Crypto Wallet":
          if (!isFiat(firstAsset)) {
            if (assetData.transactionType === "sell") {
              // Verkauf: Crypto-Wert sinkt, Fiat-Wert steigt
              fiatValue += assetData.amount
              cryptoValue -= assetData.amount
            } else {
              // Kauf: Crypto-Wert steigt
              cryptoValue += assetData.amount
            }
            valueTemp = cryptoValue
          }
          break

        case "Total Value":
          // Berechne Gesamtwert (Fiat + Crypto)
          if (isFiat(firstAsset)) {
            if (assetData.transactionType === "sell") {
              valueTotal -= assetData.amount
            } else {
              valueTotal += assetData.amount
            }
            valueTemp = valueTotal
          } else {
            // Bei Crypto-Transaktionen bleibt der Gesamtwert gleich
            // Crypto-Wert ändert sich, aber Fiat-Wert ändert sich entgegen
            valueTemp = valueTotal
          }
          break
      }

      return {
        date,
        value: valueTemp,
        assetName: firstAsset,
        transactionType: assetData.transactionType,
      }
    })
  },
}))
