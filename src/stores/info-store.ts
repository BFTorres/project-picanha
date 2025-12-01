import { create } from "zustand"

export type AssetKind = "crypto" | "fiat"

export interface Asset {
  code: string
  name: string
  kind: AssetKind
  minSize?: string
}

interface InfoState {
  assets: Asset[]
  isLoading: boolean
  error: string | null
  lastUpdated: string | null
  fetchAssets: () => Promise<void>
}

// Types matching Coinbase v2 currencies responses (simplified)
interface CoinbaseCurrency {
  id?: string
  code?: string
  name?: string
  min_size?: string
  // We don’t care about the other properties here, keep them flexible:
  [key: string]: unknown
}

interface CoinbaseCurrenciesResponse {
  data?: CoinbaseCurrency[]
}

export const useInfoStore = create<InfoState>((set, get) => ({
  assets: [],
  isLoading: false,
  error: null,
  lastUpdated: null,

  async fetchAssets() {
    // Optional: skip refetch if we already loaded once
    if (get().assets.length > 0) return

    set({ isLoading: true, error: null })

    try {
      const [cryptoRes, fiatRes] = await Promise.all([
        fetch("https://api.coinbase.com/v2/currencies/crypto"),
        fetch("https://api.coinbase.com/v2/currencies"),
      ])

      if (!cryptoRes.ok || !fiatRes.ok) {
        throw new Error(
          `HTTP ${cryptoRes.status}/${fiatRes.status} when loading currencies`,
        )
      }

      const cryptoJson =
        (await cryptoRes.json()) as CoinbaseCurrenciesResponse
      const fiatJson = (await fiatRes.json()) as CoinbaseCurrenciesResponse

      const cryptoData: CoinbaseCurrency[] = cryptoJson.data ?? []
      const fiatData: CoinbaseCurrency[] = fiatJson.data ?? []

      // Map helpers returning Asset | null, then filter nulls
      const cryptoMapped: Array<Asset | null> = cryptoData.map(
        (item): Asset | null => {
          const code = String(item.id ?? item.code ?? "").toUpperCase()
          const name = String(item.name ?? code)
          const minSize =
            item.min_size != null ? String(item.min_size) : undefined
          if (!code) return null
          return {
            code,
            name,
            kind: "crypto",
            minSize,
          }
        },
      )

      const fiatMapped: Array<Asset | null> = fiatData.map(
        (item): Asset | null => {
          const code = String(item.id ?? item.code ?? "").toUpperCase()
          const name = String(item.name ?? code)
          const minSize =
            item.min_size != null ? String(item.min_size) : undefined
          if (!code) return null
          return {
            code,
            name,
            kind: "fiat",
            minSize,
          }
        },
      )

      const cryptoAssets = cryptoMapped.filter(
        (a): a is Asset => a !== null,
      )
      const fiatAssets = fiatMapped.filter(
        (a): a is Asset => a !== null,
      )

      const assets: Asset[] = [...cryptoAssets, ...fiatAssets].sort((a, b) =>
        a.code.localeCompare(b.code),
      )

      set({
        assets,
        isLoading: false,
        error: null,
        lastUpdated: new Date().toISOString(),
      })
    } catch (err) {
      console.error("Failed to fetch currencies", err)
      set({
        isLoading: false,
        error: err instanceof Error ? err.message : "Unknown error",
      })
    }
  },
}))
