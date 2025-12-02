import { create } from "zustand";

interface WatchlistState {
  // List of asset symbols the user has added to their personal watchlist.
  // We keep them as uppercased strings for consistency (e.g. "BTC", "ETH")
  symbols: string[];
  // Add a symbol to the watchlist (no duplicates, always uppercased)
  addSymbol: (symbol: string) => void;
  // Remove a symbol from the watchlist
  removeSymbol: (symbol: string) => void;
}

// Simple client-side watchlist store.
//
// This is intentionally minimal: there is no backend persistence.
// The goal is to demonstrate global state with Zustand and how multiple
// components (rates table, watchlist panel, information dialog) can
// subscribe to the same source
export const useWatchlistStore = create<WatchlistState>((set, get) => ({
  // Start with an empty watchlist.
  symbols: [],

  addSymbol(symbol) {
    // Normalize to uppercase so "btc" and "BTC" are treated the same
    const normalized = symbol.toUpperCase();
    const current = get().symbols;

    // Avoid adding duplicates
    if (current.includes(normalized)) return;

    set({ symbols: [...current, normalized] });
  },

  removeSymbol(symbol) {
    const normalized = symbol.toUpperCase();
    set({ symbols: get().symbols.filter((s) => s !== normalized) });
  },
}));
