import { apiPostAuth } from '../defaultApi';

export const getHistoryTransactionCoin = (data) => {
    return apiPostAuth(`api/TransactionCoins/GetHistoryTransactionCoin`, data);
};