import { apiGetAuth, apiPostAuth } from '../defaultApi';

export const getStatisticSales = (data) => {
    return apiPostAuth(`api/Statistics/Admin/Sales`, data);
};
export const getStatisticDepositAndWithdrawnMoney = (data) => {
    return apiPostAuth(`api/Statistics/Admin/DepositAndWithdrawnMoney`, data);
};
export const getTodoList = () => {
    return apiGetAuth(`api/Statistics/Admin/TodoList`);
};
export const getStatisticSalesSummaryCurrentMonth = () => {
    return apiGetAuth(`api/Statistics/Admin/CurrentMonth`);
};
