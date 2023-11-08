import { apiPost, apiGetAuth, apiPostAuth, apiPostAuthForm } from '../defaultApi';

export const GetConversations = (userId) => {
    return apiGetAuth(`api/Conversations/getConversations?userId=${userId}`);
};

export const GetMessages = (conversationId) => {
    return apiGetAuth(`api/Conversations/getMessages?conversationId=${conversationId}`);
};

export const sendMessage = (data) => {
    return apiPostAuthForm('api/Conversations/SendMessage', data);
};

export const addConversation = (data) => {
    return apiPost('api/Conversations/add', data);
};

export const updateUserConversation = (data) => {
    return apiPostAuth('api/UserConversations/update', data);
};

export const getConversation = (data) => {
    return apiPostAuth('api/Conversations/GetConversation', data);
};

export const getConversationsUnRead = (userId) => {
    return apiGetAuth(`api/Conversations/GetConversationsUnRead/${userId}`);
};

