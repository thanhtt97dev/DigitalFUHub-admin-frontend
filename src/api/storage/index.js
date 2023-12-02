import {
    apiGetFile,
    apiPostForm,
} from '../defaultApi';

export const dowloadFile = (url) => {
    return apiGetFile("api/Storages/GetFile/" + url);
    //return apiGet(`https://fptu.blob.core.windows.net/test/${url}`)
};

export const uploadFile = (url, data) => {
    return apiPostForm(url, data);
}

export const dowloadFileWithdrawByList = () => {
    return apiGetFile("api/Files/getWithdrawBuyListMbBank");
};

export const dowloadFileOrderReport = () => {
    return apiGetFile("api/Files/OrderReportFile");
};

export const dowloadFileWithdrawReport = () => {
    return apiGetFile("api/Files/WithdrawTransactionReportFile");
};

export const dowloadFileTransactionInternalReport = () => {
    return apiGetFile("api/Files/TransactionInternalReportFile");
};

export const dowloadFileTransactionCoinReport = () => {
    return apiGetFile("api/Files/TransactionCoinReportFile");
};

export const dowloadFileDepositTransactionReport = () => {
    return apiGetFile("api/Files/DepositTransactionReportFile");
};