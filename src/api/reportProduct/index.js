import { apiPostAuth, apiGet } from '../defaultApi';

export const getReportProducts = (data) => {
    return apiPostAuth(`api/reportProducts/admin/all`, data);
};


export const getAllReasonReportProduct = (data) => {
    return apiGet(`api/reasonReportProducts/GetAll`, data);
};
