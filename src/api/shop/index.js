import { apiPostAuth } from '../defaultApi';

export const getShops = (data) => {
    return apiPostAuth(`api/shops/admin/all`, data);
};
