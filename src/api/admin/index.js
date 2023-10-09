import { apiPostAuth } from '../defaultApi';


export const getOrders = (data) => {
    return apiPostAuth(`api/admins/GetOrders`, data);
};

export const getOrder = (id) => {
    return apiPostAuth(`api/admins/GetOrder/${id}`);
};


export const updateOrderStatus = (data) => {
    return apiPostAuth(`api/admins/UpdateOrderStatus`, data);
};

export const rejectWithdrawTransaction = (data) => {
    return apiPostAuth(`api/admins/RejectWithdrawTransaction`, data);
};





