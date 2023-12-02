import { apiPostAuth } from '../defaultApi';

export const getHistoryTransactionInternal = (data) => {
    return apiPostAuth(`api/TransactionInternals/All`, data);
};

export const getDataReportTransactionInternal = (data) => {
    return apiPostAuth(`api/TransactionInternals/GetDataReportTransactionInternal`, data);
};