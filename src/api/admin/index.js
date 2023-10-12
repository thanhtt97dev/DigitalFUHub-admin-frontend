import { apiPostAuth } from '../defaultApi';

//order
export const getOrders = (data) => {
    return apiPostAuth(`api/admins/GetOrders`, data);
};

export const getOrder = (id) => {
    return apiPostAuth(`api/admins/GetOrder/${id}`);
};

export const getOrderCoupons = (id) => {
    return apiPostAuth(`api/admins/OrderCoupon/${id}`);
};

//order coupons
export const updateOrderStatus = (data) => {
    return apiPostAuth(`api/admins/UpdateOrderStatus`, data);
};


//transaction
export const getHistoryTransactionInternal = (data) => {
    return apiPostAuth(`api/admins/HistoryTransactionInternal`, data);
};

// withdraw transactionn
export const rejectWithdrawTransaction = (data) => {
    return apiPostAuth(`api/admins/RejectWithdrawTransaction`, data);
};

//Business Fee
export const getBusinessFee = (data) => {
    return apiPostAuth(`api/admins/GetBusinessFee`, data);
};

export const addNewBusinessFee = (data) => {
    return apiPostAuth(`api/admins/AddNewBusinessFee`, data);
};

//user
export const getUsers = (data) => {
    return apiPostAuth(`api/admins/GetUsers`, data);
};







