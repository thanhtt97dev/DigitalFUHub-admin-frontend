import { apiGetAuth } from '../defaultApi';

export const getAllCategory = (data) => {
    return apiGetAuth(`api/Categories/GetAll`, data);
};