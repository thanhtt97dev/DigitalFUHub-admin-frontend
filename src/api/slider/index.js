import { apiPostAuth, apiPostAuthForm, apiGetAuth, apiPutAuthForm } from '../defaultApi';

export const getSliders = (data) => {
    return apiPostAuth(`api/Sliders/admin/getSliders`, data);
};

export const addSlider = (data) => {
    return apiPostAuthForm(`api/Sliders/admin/addSlider`, data);
};

export const getSlider = (id) => {
    return apiGetAuth(`api/Sliders/admin/getById/${id}`);
};

export const updateSlider = (data) => {
    return apiPutAuthForm(`api/Sliders/admin/updateSlider`, data);
};

export const deleteSlider = (sliderId) => {
    return apiPostAuth(`api/Sliders/admin/delete?sliderId=${sliderId}`);
};

