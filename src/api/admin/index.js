import { apiPostAuth } from '../defaultApi';

//order
export const getOrders = (data) => {
    return apiPostAuth(`api/admins/GetOrders`, data);
};

export const getOrder = (id) => {
    return apiPostAuth(`api/admins/GetOrder/${id}`);
};


export const updateOrderStatus = (data) => {
    return apiPostAuth(`api/admins/UpdateOrderStatus`, data);
};

// withdraw transactionn
export const rejectWithdrawTransaction = (data) => {
    return apiPostAuth(`api/admins/RejectWithdrawTransaction`, data);
};

//user
export const getUsers = (data) => {
    return apiPostAuth(`api/admins/GetUsers`, data);
};





