export interface Transaktion {
  id: string
  date: string
  type: "buy" | "sell"
  asset: string
  amount: number
  price: number
  total: number
  status: "completed" | "pending"
}

export const HistoryData = [
  {
    "id": "tx-1",
    "date": "2025-01-01T14:03:22.852Z",
    "type": "buy",
    "asset": "EUR",
    "amount": 15000,
    "price": 1,
    "total": 15000,
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
    "amount": 15000,
    "price": 1,
    "total": 15000,
    "status": "completed"
  },
  {
    "id": "tx-4",
    "date": "2025-05-05T19:04:10.852Z",
    "type": "buy",
    "asset": "BTC",
    "amount": 0.02,
    "price": 100000,
    "total": 20000,
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
  },
  {
    "id": "tx-6",
    "date": "2025-10-05T06:03:22.852Z",
    "type": "sell",
    "asset": "EUR",
    "amount": 15000,
    "price": 1,
    "total": 15000,
    "status": "completed"
  },
  {
    "id": "tx-7",
    "date": "2025-12-10T06:03:22.852Z",
    "type": "sell",
    "asset": "EUR",
    "amount": 1000,
    "price": 1,
    "total": 1000,
    "status": "completed"
  },
  {
    "id": "tx-8",
    "date": "2025-12-10T07:03:22.852Z",
    "type": "buy",
    "asset": "SOL",
    "amount": 54.81955795934622,
    "price": 140.87660422940456,
    "total": 2300,
    "status": "completed"
  },
  {
    "id": "tx-9",
    "date": "2025-12-11T07:03:22.852Z",
    "type": "buy",
    "asset": "DOGE",
    "amount": 666,
    "price": 1,
    "total": 666,
    "status": "completed"
  }
] satisfies readonly Transaktion[];