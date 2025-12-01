import { create } from "zustand"

export interface WatchlistItem {
  id: string
  symbol: string
  note: string
  createdAt: string
}

interface WatchlistState {
  items: WatchlistItem[]
  addItem: (symbol: string, note?: string) => void
  updateItem: (
    id: string,
    partial: Partial<Pick<WatchlistItem, "symbol" | "note">>,
  ) => void
  removeItem: (id: string) => void
  clear: () => void
}

export const useWatchlistStore = create<WatchlistState>((set) => ({
  items: [],
  addItem(symbol, note = "") {
    const id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now()}-${Math.random()}`

    set((state) => ({
      items: [
        ...state.items,
        {
          id,
          symbol: symbol.toUpperCase(),
          note,
          createdAt: new Date().toISOString(),
        },
      ],
    }))
  },
  updateItem(id, partial) {
    set((state) => ({
      items: state.items.map((item) =>
        item.id === id
          ? {
              ...item,
              ...partial,
              symbol:
                partial.symbol !== undefined
                  ? partial.symbol.toUpperCase()
                  : item.symbol,
            }
          : item,
      ),
    }))
  },
  removeItem(id) {
    set((state) => ({
      items: state.items.filter((item) => item.id !== id),
    }))
  },
  clear() {
    set({ items: [] })
  },
}))
