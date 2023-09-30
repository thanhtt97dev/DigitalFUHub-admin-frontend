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

export const getWithdrawTransactionBill = (id) => {
    return apiGetAuth(`api/banks/WithdrawTransactionBill/${id}`);
};

export const confirmTransferWithdrawSuccess = (data) => {
    return apiPostAuth(`api/banks/ConfirmTransfer`, data);
};


