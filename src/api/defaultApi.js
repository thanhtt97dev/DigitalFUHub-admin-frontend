import axios from 'axios';
import { getTokenInCookies } from '~/utils';

axios.defaults.baseURL = process.env.REACT_APP_API_BASE_URL;
axios.defaults.headers.common['Content-Type'] = 'application/json';

const getHeaderConfig = () => {
    return {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${getTokenInCookies()}`,
        },
    };
};

export const apiGet = async (url) => {
    const response = axios.get(url);
    return response;
};
export const apiGetFile = async (url) => {
    const response = axios.get(url, { responseType: 'blob' });
    return response;
};

export const apiGetAuth = async (url) => {
    const response = axios.get(url, getHeaderConfig());
    return response;
};

export const apiPut = async (url, data) => {
    const response = axios.put(url, data, getHeaderConfig());
    return response;
};

export const apiPost = async (url, data) => {
    const response = axios.post(url, data);
    return response;
};

export const apiPostAuth = async (url, data) => {
    const response = axios.post(url, data, getHeaderConfig());
    return response;
};

export const apiDelete = async (url, data) => {
    const response = axios.delete(url, data, getHeaderConfig());
    return response;
};

export const apiPostDownloadFile = async (url, data) => {

    const response = axios.post(url, data, {
        responseType: 'blob'
    });
    return response;
};
