import { apiGetAuth, apiPost, apiPostAuth, apiPut } from '../defaultApi';

export const login = (data) => {
    return apiPost('api/users/signIn', data);
};

export const generateAccessToken = (id, data) => {
    return apiPost(`api/users/GenerateAccessToken/${id}`, data);
}

export const refreshToken = (accessToken, refreshToken) => {
    const data = {
        refreshToken,
        accessToken,
    };
    return apiPost('api/users/refreshToken', data);
};

export const revokeToken = (data) => {
    return apiPostAuth('api/users/revokeToken', data);
};

export const getUsersByCondition = (data) => {
    if (data === undefined) {
        data = {
            email: '',
            roleId: '0',
            status: '-1',
        };
    }
    return apiGetAuth(`api/users/GetUsers?email=${data.email}&role=${data.roleId}&status=${data.status}`);
};

export const getUserByIdForAuth = (id) => {
    return apiGetAuth(`api/users/GetUser/${id}`);
};

export const getUserById = (id) => {
    return apiGetAuth(`api/users/GetUserById/${id}`);
};

export const editUserInfo = (id, data) => {
    return apiPut(`api/users/EditUserInfo/${id}`, data);
};

export const postUserInfo = (id, data) => {
    return apiPut(`api/users/EditUserInfo/${id}`, data);
};

export const getUsers = (data) => {
    return apiPostAuth(`api/users/GetUsers`, data);
};
export const getUserInfoById = (id) => {
    return apiGetAuth(`api/users/Admin/UserInfo/${id}`)
}
export const editStatusUser = (data) => {
    return apiPostAuth(`api/users/Admin/EditStatus`, data);
};