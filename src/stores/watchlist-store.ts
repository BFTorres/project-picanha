// src/stores/watchlist-store.ts
import { create } from "zustand"

interface WatchlistState {
  symbols: string[]
  addSymbol: (symbol: string) => void
  removeSymbol: (symbol: string) => void
}

export const useWatchlistStore = create<WatchlistState>((set, get) => ({
  symbols: [],
  addSymbol(symbol) {
    const normalized = symbol.toUpperCase()
    const current = get().symbols
    if (current.includes(normalized)) return
    set({ symbols: [...current, normalized] })
  },
  removeSymbol(symbol) {
    const normalized = symbol.toUpperCase()
    set({ symbols: get().symbols.filter((s) => s !== normalized) })
  },
}))
