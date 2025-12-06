import { create } from "zustand";

// Distinguishes between crypto assets and fiat currencies returned by Coinbase.
export type AssetKind = "crypto" | "fiat";

// Normalised asset model used in the app.
//
// We deliberately only keep the fields we actually need for the UI.
// Additional raw fields from the Coinbase API are ignored.
export interface Asset {
  // Symbol / currency code, e.g. "BTC", "EUR".
  code: string;
  // Human-readable name, e.g. "Bitcoin", "Euro".
  name: string;
  // High-level classification: "crypto" or "fiat".
  kind: AssetKind;
  // Minimum trade size (if provided by the API).
  minSize?: string;
}

interface InfoState {
  // Combined list of crypto + fiat assets from Coinbase.
  assets: Asset[];
  // True while we are fetching data from the public Coinbase endpoints.
  isLoading: boolean;
  // Error message if the last fetch failed (null if OK).
  error: string | null;
  // ISO timestamp string of the last successful update.
  lastUpdated: string | null;
  // Trigger a fetch of assets if we do not have them yet.
  fetchAssets: () => Promise<void>;
}

// Types matching Coinbase v2 currencies responses (simplified).
// We only model what we actually use in this app.
interface CoinbaseCurrency {
  id?: string;
  code?: string;
  name?: string;
  min_size?: string;
  // We don’t care about the other properties here, so keep the rest flexible.
  [key: string]: unknown;
}

interface CoinbaseCurrenciesResponse {
  data?: CoinbaseCurrency[];
}

// Global store for asset metadata coming from public Coinbase endpoints.
//
// This powers the "Information" page where we can list and inspect assets.
// We combine crypto and fiat currencies into a single Asset list, which
// the UI can then filter, search and enrich with local actions (e.g. watchlist).
export const useInfoStore = create<InfoState>((set, get) => ({
  assets: [],
  isLoading: false,
  error: null,
  lastUpdated: null,

  async fetchAssets() {
    // Optional: skip refetch if we already loaded once
    if (get().assets.length > 0) return;

    set({ isLoading: true, error: null });

    try {
      const [cryptoRes, fiatRes] = await Promise.all([
        fetch("https://api.coinbase.com/v2/currencies/crypto"),
        fetch("https://api.coinbase.com/v2/currencies"),
      ]);

      let cryptoData: CoinbaseCurrency[] = [];
      let fiatData: CoinbaseCurrency[] = [];

      // Handle crypto response (may fail)
      if (cryptoRes.ok) {
        const cryptoJson =
          (await cryptoRes.json()) as CoinbaseCurrenciesResponse;
        cryptoData = cryptoJson.data ?? [];
      } else {
        console.warn(
          "[info-store] Crypto currencies request failed",
          cryptoRes.status
        );
      }

      // Handle fiat response (may fail)
      if (fiatRes.ok) {
        const fiatJson = (await fiatRes.json()) as CoinbaseCurrenciesResponse;
        fiatData = fiatJson.data ?? [];
      } else {
        console.warn(
          "[info-store] Fiat currencies request failed",
          fiatRes.status
        );
      }

      // If BOTH failed, that's a real error
      if (!cryptoRes.ok && !fiatRes.ok) {
        throw new Error(
          `Both crypto and fiat currency requests failed: ` +
            `${cryptoRes.status}/${fiatRes.status}`
        );
      }

      // Map helpers returning Asset | null, then filter nulls
      const cryptoMapped: Array<Asset | null> = cryptoData.map(
        (item): Asset | null => {
          const code = String(item.id ?? item.code ?? "").toUpperCase();
          const name = String(item.name ?? code);
          const minSize =
            item.min_size != null ? String(item.min_size) : undefined;
          if (!code) return null;
          return {
            code,
            name,
            kind: "crypto",
            minSize,
          };
        }
      );

      const fiatMapped: Array<Asset | null> = fiatData.map(
        (item): Asset | null => {
          const code = String(item.id ?? item.code ?? "").toUpperCase();
          const name = String(item.name ?? code);
          const minSize =
            item.min_size != null ? String(item.min_size) : undefined;
          if (!code) return null;
          return {
            code,
            name,
            kind: "fiat",
            minSize,
          };
        }
      );

      const cryptoAssets = cryptoMapped.filter((a): a is Asset => a !== null);
      const fiatAssets = fiatMapped.filter((a): a is Asset => a !== null);

      const assets: Asset[] = [...cryptoAssets, ...fiatAssets].sort((a, b) =>
        a.code.localeCompare(b.code)
      );

      set({
        assets,
        isLoading: false,
        error: null,
        lastUpdated: new Date().toISOString(),
      });
    } catch (err) {
      console.error("Failed to fetch currencies", err);
      set({
        isLoading: false,
        error: err instanceof Error ? err.message : "Unknown error",
      });
    }
  },
}));
