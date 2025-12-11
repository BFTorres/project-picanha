/* import type { CoinbaseExchangeRatesResponse } from "@/types/coinbase"

const BASE_URL = "https://api.coinbase.com/v2"

export async function fetchExchangeRates(
  baseCurrency: string,
): Promise<CoinbaseExchangeRatesResponse> {
  const url = `${BASE_URL}/exchange-rates?currency=${encodeURIComponent(
    baseCurrency,
  )}`

  const response = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
    },
  })

  if (!response.ok) {
    throw new Error(`Coinbase API error: ${response.status}`)
  }

  return (await response.json()) as CoinbaseExchangeRatesResponse
} */

  // src/api/coinbase.ts
export interface CoinbaseExchangeRatesResponse {
  data?: {
    currency?: string;
    rates?: Record<string, string>;
  };
}

export interface CoinbaseCurrencyDto {
  id?: string;
  code?: string;
  name?: string;
  min_size?: string;
  [key: string]: unknown;
}

export interface CoinbaseCurrenciesResponse {
  data?: CoinbaseCurrencyDto[];
}

const API_BASE = "https://api.coinbase.com/v2";

async function safeJson<T>(res: Response): Promise<T> {
  // Small helper so debugging / error handling is in one place
  const text = await res.text();
  try {
    return JSON.parse(text) as T;
  } catch {
    throw new Error(`Invalid JSON from Coinbase: ${text.slice(0, 200)}`);
  }
}

export async function fetchExchangeRates(
  base: string,
): Promise<CoinbaseExchangeRatesResponse> {
  const res = await fetch(`${API_BASE}/exchange-rates?currency=${base}`);

  if (!res.ok) {
    throw new Error(`Coinbase rates HTTP ${res.status}`);
  }

  return safeJson<CoinbaseExchangeRatesResponse>(res);
}

export async function fetchCryptoCurrencies(): Promise<CoinbaseCurrenciesResponse> {
  const res = await fetch(`${API_BASE}/currencies/crypto`);

  if (!res.ok) {
    throw new Error(`Coinbase crypto HTTP ${res.status}`);
  }

  return safeJson<CoinbaseCurrenciesResponse>(res);
}

export async function fetchFiatCurrencies(): Promise<CoinbaseCurrenciesResponse> {
  const res = await fetch(`${API_BASE}/currencies`);

  if (!res.ok) {
    throw new Error(`Coinbase fiat HTTP ${res.status}`);
  }

  return safeJson<CoinbaseCurrenciesResponse>(res);
}
