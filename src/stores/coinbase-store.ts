// src/stores/coinbase-store.ts
import { create } from "zustand"

type Rates = Record<string, number>

interface CoinbaseState {
  baseCurrency: string
  rates: Rates
  isLoading: boolean
  error: string | null
  lastUpdated: string | null
  fetchRates: (base?: string) => Promise<void>
  setBaseCurrency: (base: string) => void
}

export const useCoinbaseStore = create<CoinbaseState>((set, get) => ({
  baseCurrency: "EUR",
  rates: {},
  isLoading: false,
  error: null,
  lastUpdated: null,

  setBaseCurrency(baseCurrency) {
    set({ baseCurrency })
  },

  async fetchRates(base = get().baseCurrency) {
    const apiBase =
      import.meta.env.VITE_API_BASE_URL ?? "https://api.coinbase.com/v2"

    set({ isLoading: true, error: null })

    try {
      const res = await fetch(`${apiBase}/exchange-rates?currency=${base}`)

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`)
      }

      const json = (await res.json()) as {
        data?: { currency?: string; rates?: Record<string, string> }
      }

      const rawRates = json.data?.rates ?? {}
      const numericRates: Rates = {}

      for (const [symbol, value] of Object.entries(rawRates)) {
        const num = Number(value)
        if (Number.isFinite(num)) {
          numericRates[symbol] = num
        }
      }

      set({
        baseCurrency: json.data?.currency ?? base,
        rates: numericRates,
        isLoading: false,
        error: null,
        lastUpdated: new Date().toISOString(),
      })
    } catch (err) {
      console.error("Failed to fetch Coinbase rates", err)
      set({
        isLoading: false,
        error: err instanceof Error ? err.message : "Unknown error",
      })
    }
  },
}))
