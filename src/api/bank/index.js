import { apiGetAuth, apiPostAuth } from '../defaultApi';


export const getUserBankAccount = (id) => {
    return apiGetAuth(`api/banks/user/${id}`);
};

export const getAllBankInfo = () => {
    return apiGetAuth('api/banks/getAll');
};

export const inquiryAccountName = (data) => {
    return apiPostAuth('api/banks/inquiryAccountName', data);
};

export const addBankAccount = (data) => {
    return apiPostAuth('api/banks/addBankAccount', data);
};

export const updateBankAccount = (data) => {
    return apiPostAuth('api/banks/updateBankAccount', data);
};

export const createDepositTransaction = (data) => {
    return apiPostAuth('api/banks/CreateDepositTransaction', data);
};

export const createWithdrawTransaction = (data) => {
    return apiPostAuth('api/banks/CreateWithdrawTransaction', data);
};

export const getDepositTransaction = (data) => {
    return apiPostAuth(`api/banks/HistoryDeposit`, data);
};

export const getWithdrawTransaction = (data) => {
    return apiPostAuth(`api/banks/HistoryWithdrawAll`, data);
};

export const getWithdrawTransactionBill = (data) => {
    return apiPostAuth(`api/banks/WithdrawTransactionBillAdmin`, data);
};

export const confirmTransferWithdrawSuccess = (data) => {
    return apiPostAuth(`api/banks/ConfirmTransfer`, data);
};

export const confirmListTransferWithdrawSuccess = (data) => {
    return apiPostAuth(`api/banks/ConfirmListTransfer`, data);
};

// withdraw transactionn
export const rejectWithdrawTransaction = (data) => {
    return apiPostAuth(`api/banks/RejectWithdrawTransaction`, data);
};

export const getAllWithdrawUnPay = (data) => {
    return apiPostAuth(`api/banks/GetAllWithdrawUnPay`, data);
};

export const getDataReportWithdrawTransaction = (data) => {
    return apiPostAuth(`api/banks/GetDataReportWithdrawTransaction`, data);
};

export const getDataReportDepositTransaction = (data) => {
    return apiPostAuth(`api/banks/ReportHistoryDeposit`, data);
};
