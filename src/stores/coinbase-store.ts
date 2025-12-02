// src/stores/coinbase-store.ts
import { create } from "zustand";

type Rates = Record<string, number>;

interface CoinbaseState {
  // Base currency for all stored rates (e.g. "EUR").
  // The rates map stores how much of each symbol you get for 1 unit of this base.
  baseCurrency: string;
  // Map from symbol -> numeric rate, parsed from Coinbase's string values.
  rates: Rates;
  // True while we are fetching new rates from the API.
  isLoading: boolean;
  // Error message if the last fetch failed (null if OK).
  error: string | null;
  // ISO timestamp string of the last successful update.
  lastUpdated: string | null;
  // Fetch rates for the given base currency (or current base if none provided).
  fetchRates: (base?: string) => Promise<void>;
  // Update the base currency in the store (does not automatically refetch).
  setBaseCurrency: (base: string) => void;
}

// Global store for Coinbase exchange rates.
//
// The goal is to have a single source of truth for pricing data that can be
// used by the dashboard cards, tables, charts, and information dialog.
export const useCoinbaseStore = create<CoinbaseState>((set, get) => ({
  baseCurrency: "EUR",
  rates: {},
  isLoading: false,
  error: null,
  lastUpdated: null,

  setBaseCurrency(baseCurrency) {
    set({ baseCurrency });
  },

  async fetchRates(base = get().baseCurrency) {
    // Allow overriding the API base via Vite env var so we can point to a
    // mock server or proxy in the future. Defaults to Coinbase's public API.
    const apiBase =
      import.meta.env.VITE_API_BASE_URL ?? "https://api.coinbase.com/v2";

    set({ isLoading: true, error: null });

    try {
      const res = await fetch(`${apiBase}/exchange-rates?currency=${base}`);

      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }

      // We only care about the nested "data.rates" object.
      const json = (await res.json()) as {
        data?: { currency?: string; rates?: Record<string, string> };
      };

      const rawRates = json.data?.rates ?? {};
      const numericRates: Rates = {};

      // Parse stringified rates into numbers, ignoring invalid values.
      for (const [symbol, value] of Object.entries(rawRates)) {
        const num = Number(value);
        if (Number.isFinite(num)) {
          numericRates[symbol] = num;
        }
      }

      set({
        // If Coinbase echoes the base currency, use that, otherwise fall back to the requested base.
        baseCurrency: json.data?.currency ?? base,
        rates: numericRates,
        isLoading: false,
        error: null,
        lastUpdated: new Date().toISOString(),
      });
    } catch (err) {
      console.error("Failed to fetch Coinbase rates", err);
      set({
        isLoading: false,
        error: err instanceof Error ? err.message : "Unknown error",
      });
    }
  },
}));
