import { apiPostAuth } from '../defaultApi';

export const getProducts = (data) => {
    return apiPostAuth(`api/products/admin/getProducts`, data);
};
