export interface CoinbaseExchangeRatesResponse {
  data: {
    currency: string;
    rates: Record<string, string>;
  };
}
