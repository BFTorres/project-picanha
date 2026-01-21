import type { Transaktion } from '../interfaces/Transaktion';

const API_URL = 'https://chimichurri.mokican.com/api/transactions';

interface TransactionResponse {
    transactions: Transaktion[];
    summary: Record<string, unknown>;
}

export const fetchTransactions = async (): Promise<Transaktion[]> => {
    const response = await fetch(API_URL);

    if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data: TransactionResponse = await response.json();
    return data.transactions;
};

export const transactionsPromise = fetchTransactions();