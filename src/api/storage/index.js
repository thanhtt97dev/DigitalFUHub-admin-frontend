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