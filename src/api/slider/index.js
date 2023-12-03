import { apiPostAuth, apiPostAuthForm, apiGetAuth } from '../defaultApi';

export const getSliders = (data) => {
    return apiPostAuth(`api/Sliders/admin/getSliders`, data);
};

export const addSlider = (data) => {
    return apiPostAuthForm(`api/Sliders/admin/addSlider`, data);
};

export const getSlider = (id) => {
    return apiGetAuth(`api/Sliders/admin/getById/${id}`);
};