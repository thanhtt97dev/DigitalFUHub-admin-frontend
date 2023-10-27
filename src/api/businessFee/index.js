import { apiPostAuth } from '../defaultApi';

export const getBusinessFee = (data) => {
    return apiPostAuth(`api/businessFees/GetBusinessFee`, data);
};

export const addNewBusinessFee = (data) => {
    return apiPostAuth(`api/businessFees/AddNewBusinessFee`, data);
};