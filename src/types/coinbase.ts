// Minimal type definition for the Coinbase "exchange-rates" endpoint.
//
// Example response shape:
// {
//   "data": {
//     "currency": "EUR",
//     "rates": {
//       "BTC": "0.000024",
//       "USD": "1.08",
//       ...
//     }
//   }
// }
//
// Note: rates are returned as strings, so we parse them into numbers
// when storing them in our Zustand coinbase store.
export interface CoinbaseExchangeRatesResponse {
  data: {
    // Base currency for the returned rates (e.g. "EUR", "USD").
    currency: string;
    // Map from symbol -> stringified rate (e.g. { "BTC": "0.000024" }).
    rates: Record<string, string>;
  };
}
