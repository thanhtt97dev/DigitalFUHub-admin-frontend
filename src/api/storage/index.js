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

export const dowloadFileWithdrawByList = (url) => {
    return apiGetFile("api/Files/getWithdrawBuyListMbBank");
};

export const dowloadFileOrderReport = (url) => {
    return apiGetFile("api/Files/OrderReportFile");
};

export const dowloadFileWithdrawReport = (url) => {
    return apiGetFile("api/Files/WithdrawTransactionReportFile");
};

export const dowloadFileTransactionInternalReport = (url) => {
    return apiGetFile("api/Files/TransactionInternalReportFile");
};

export const dowloadFileTransactionCoinReport = (url) => {
    return apiGetFile("api/Files/TransactionCoinReportFile");
};