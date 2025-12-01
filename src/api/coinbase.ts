import type { CoinbaseExchangeRatesResponse } from "@/types/coinbase"

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
}
