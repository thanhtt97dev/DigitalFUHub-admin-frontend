import { apiPostAuth, apiGetAuth } from '../defaultApi';

export const getShops = (data) => {
    return apiPostAuth(`api/shops/admin/all`, data);
};

export const getShopDetail = (id) => {
    return apiGetAuth(`api/shops/admin/getById/${id}`);
};

