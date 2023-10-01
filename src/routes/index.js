import Login from '~/pages/Login';
import AccessDenied from '~/pages/AccessDenied';

import { ADMIN_ROLE } from '~/constants';
import AdminLayoutDemo from '~/layouts/AdminLayoutDemo';
import DashBoard from '~/pages/AdminDemo/DashBoard';
import Users from '~/pages/AdminDemo/Users';
import Detail from '~/pages/AdminDemo/Users/Detail';
import Notificaion from '~/pages/AdminDemo/Notificaion';

import Verification2FA from '~/pages/Verification2FA';
import AdminLayout from '~/layouts/AdminLayout';
import HistoryDeposit from '~/pages/Admin/ManageFinance/HistoryDeposit';
import HistoryWithdraw from '~/pages/Admin/ManageFinance/HistoryWithdraw';
import WithdrawByList from '~/pages/Admin/ManageFinance/WithdrawByList';
import HistoryTransactionInternal from '~/pages/Admin/ManageFinance/HistoryTransactionInternal';

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
        path: '/admin-demo',
        layout: <AdminLayoutDemo />,
        role: [ADMIN_ROLE],
        component: <DashBoard />,
    },
    {
        path: '/admin-demo/dashboard',
        layout: <AdminLayoutDemo />,
        role: [ADMIN_ROLE],
        component: <DashBoard />,
    },
    {
        path: '/admin-demo/users',
        layout: <AdminLayoutDemo />,
        role: [ADMIN_ROLE],
        component: <Users />,

    },
    {
        path: '/admin-demo/users/:id',
        layout: <AdminLayoutDemo />,
        role: [ADMIN_ROLE],
        component: <Detail />
    },
    {
        path: '/admin-demo/notificaions',
        layout: <AdminLayoutDemo />,
        role: [ADMIN_ROLE],
        component: <Notificaion />,
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
        path: '/admin/finance/transaction',
        layout: <AdminLayout />,
        role: [ADMIN_ROLE],
        component: <HistoryTransactionInternal />
    },
    {
        title: 'verification2FA',
        path: '/verification2FA/:id',
        component: <Verification2FA />,
    },
];

export default routesConfig;
