export interface Transaktion {
    id: string
    dbId?: number
    date: string
    type: "buy" | "sell"
    asset: string
    amount: number
    price: number
    total: number
    status: "completed" | "pending"
}