import { create } from "zustand";
import type { CoinbaseExchangeRatesResponse } from "@/api/coinbase";
import { fetchExchangeRates } from "@/api/coinbase";

type Rates = Record<string, number>;

interface CoinbaseState {
  baseCurrency: string;
  rates: Rates;
  isLoading: boolean;
  error: string | null;
  lastUpdated: string | null;
  fetchRates: (base?: string) => Promise<void>;
  setBaseCurrency: (base: string) => void;
}

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
    set({ isLoading: true, error: null });

    try {
      const json: CoinbaseExchangeRatesResponse = await fetchExchangeRates(base);
      const rawRates = json.data?.rates ?? {};
      const numericRates: Rates = {};

      for (const [symbol, value] of Object.entries(rawRates)) {
        const num = Number(value);
        if (Number.isFinite(num)) {
          numericRates[symbol] = num;
        }
      }

      set({
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
