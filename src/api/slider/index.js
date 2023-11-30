import { apiPostAuth } from '../defaultApi';

export const getSliders = (data) => {
    return apiPostAuth(`api/Sliders/admin/getSliders`, data);
};