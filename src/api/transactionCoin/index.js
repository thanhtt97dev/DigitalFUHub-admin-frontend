import { apiPostAuth } from '../defaultApi';

export const getHistoryTransactionCoin = (data) => {
    return apiPostAuth(`api/TransactionCoins/GetHistoryTransactionCoin`, data);
};

export const getDataReportTransactionCoin = (data) => {
    return apiPostAuth(`api/TransactionCoins/GetDataReportTransactionCoin`, data);
};