export const HistoryData = [
  {
    "id": "tx-1",
    "date": "2025-01-01T14:03:22.852Z",
    "type": "buy",
    "asset": "EUR",
    "amount": 10000,
    "price": 1,
    "total": 10000,
    "status": "completed"
  },
  {
    "id": "tx-2",
    "date": "2025-02-06T13:04:10.852Z",
    "type": "buy",
    "asset": "SOL",
    "amount": 54.81955795934622,
    "price": 140.87660422940456,
    "total": 5.793170669723,
    "status": "completed"
  },
  {
    "id": "tx-3",
    "date": "2025-05-05T18:08:10.852Z",
    "type": "buy",
    "asset": "EUR",
    "amount": 10000,
    "price": 1,
    "total": 10000,
    "status": "completed"
  },
  {
    "id": "tx-4",
    "date": "2025-06-05T13:04:10.852Z",
    "type": "buy",
    "asset": "BTC",
    "amount": 0.01,
    "price": 100000,
    "total": 10000,
    "status": "completed"
  },
  {
    "id": "tx-5",
    "date": "2025-10-05T05:04:10.852Z",
    "type": "sell",
    "asset": "BTC",
    "amount": 0.01,
    "price": 100000,
    "total": 10000,
    "status": "completed"
  }
] satisfies readonly {
  id: string
  date: string
  type: "buy" | "sell"
  asset: "BTC" | "SOL" | "EUR"
  amount: number
  price: number
  total: number
  status: "completed" | "pending"
}[];