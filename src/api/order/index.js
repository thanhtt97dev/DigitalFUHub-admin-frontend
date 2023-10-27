import { apiPostAuth } from '../defaultApi';

export const getOrders = (data) => {
    return apiPostAuth(`api/orders/admin/all`, data);
};

export const getOrder = (id) => {
    return apiPostAuth(`api/orders/admin/GetOrder/${id}`);
};

export const updateOrderStatus = (data) => {
    return apiPostAuth(`api/orders/admin/UpdateOrderStatus`, data);
};