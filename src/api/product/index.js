import { apiPostAuth, apiGetAuth } from '../defaultApi';

export const getProducts = (data) => {
    return apiPostAuth(`api/products/admin/getProducts`, data);
};

export const getProductDetail = (id) => {
    return apiGetAuth(`api/products/admin/${id}`);
};

export const updateReportProduct = (data) => {
    return apiPostAuth(`api/reportProducts/admin/update`, data);
};
