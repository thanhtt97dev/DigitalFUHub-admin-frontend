import { apiPostAuth } from '../defaultApi';

export const getShopRegisterFees = (data) => {
    return apiPostAuth(`api/shopRegisterFees/GetFees`, data);
};

export const addNewShopRegisterFee = (data) => {
    return apiPostAuth(`api/shopRegisterFees/addNew`, data);
};