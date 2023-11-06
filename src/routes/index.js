import Login from '~/pages/Login';
import AccessDenied from '~/pages/AccessDenied';
import { ADMIN_ROLE } from '~/constants';

import Users from '~/pages/Admin/ManageUsers/Users';
import Verification2FA from '~/pages/Verification2FA';
import AdminLayout from '~/layouts/AdminLayout';
import HistoryDeposit from '~/pages/Admin/ManageFinance/HistoryDeposit';
import HistoryWithdraw from '~/pages/Admin/ManageFinance/HistoryWithdraw';
import WithdrawByList from '~/pages/Admin/ManageFinance/HistoryWithdraw/WithdrawByList';
import HistoryTransactionInternal from '~/pages/Admin/ManageFinance/HistoryTransactionInternal';
import Orders from '~/pages/Admin/ManageOrders/Orders';
import OrderDetail from '~/pages/Admin/ManageOrders/OrderDetail';
import UserInfo from '~/pages/Admin/ManageUsers/UserInfo';
import BusinessFee from '~/pages/Admin/ManageFinance/BusinessFee';
import HistoryTransactionCoin from '~/pages/Admin/ManageFinance/HistoryTransactionCoin';

const routesConfig = [
    {
        title: 'login',
        path: '/login',
        component: <Login />,
    },
    {
        title: 'accessDenied',
        path: '/accessDenied',
        component: <AccessDenied />,
    },
    {
        path: '/admin',
        layout: <AdminLayout />,
        role: [ADMIN_ROLE],
        component: <></>,
    },
    {
        path: '/admin/finance/deposit',
        layout: <AdminLayout />,
        role: [ADMIN_ROLE],
        component: <HistoryDeposit />
    },
    {
        path: '/admin/finance/withdraw',
        layout: <AdminLayout />,
        role: [ADMIN_ROLE],
        component: <HistoryWithdraw />
    },
    {
        path: '/admin/finance/withdraw/tranfer-bylist',
        layout: <AdminLayout />,
        role: [ADMIN_ROLE],
        component: <WithdrawByList />
    },
    {
        path: '/admin/finance/businessFee',
        layout: <AdminLayout />,
        role: [ADMIN_ROLE],
        component: <BusinessFee />
    },
    {
        path: '/admin/finance/transactionInternal',
        layout: <AdminLayout />,
        role: [ADMIN_ROLE],
        component: <HistoryTransactionInternal />
    },
    {
        path: '/admin/finance/transactionCoin',
        layout: <AdminLayout />,
        role: [ADMIN_ROLE],
        component: <HistoryTransactionCoin />
    },
    {
        path: '/admin/order',
        layout: <AdminLayout />,
        role: [ADMIN_ROLE],
        component: <Orders />
    },
    {
        path: '/admin/order/:id',
        layout: <AdminLayout />,
        role: [ADMIN_ROLE],
        component: <OrderDetail />
    },
    {
        path: '/admin/user',
        layout: <AdminLayout />,
        role: [ADMIN_ROLE],
        component: <Users />
    },
    {
        path: '/admin/user/:id',
        layout: <AdminLayout />,
        role: [ADMIN_ROLE],
        component: <UserInfo />
    },
    {
        title: 'verification2FA',
        path: '/verification2FA/:id',
        component: <Verification2FA />,
    },
];

export default routesConfig;
