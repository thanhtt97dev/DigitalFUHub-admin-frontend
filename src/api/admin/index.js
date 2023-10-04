import { apiPostAuth } from '../defaultApi';


export const getOrders = (data) => {
    return apiPostAuth(`api/admins/GetOrders`, data);
};


