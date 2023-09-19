import Login from '~/pages/Login';
import AccessDenied from '~/pages/AccessDenied';

import { ADMIN_ROLE } from '~/constants';
import AdminLayout from '~/layouts/AdminLayout';
import DashBoard from '~/pages/Admin/DashBoard';
import Users from '~/pages/Admin/Users';
import Detail from '~/pages/Admin/Users/Detail';
import Notificaion from '~/pages/Admin/Notificaion';

import Verification2FA from '~/pages/Verification2FA';

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
        title: 'admin',
        path: '/admin',
        layout: <AdminLayout />,
        role: [ADMIN_ROLE],
        component: <DashBoard />,
    },
    {
        title: 'admin',
        path: '/admin/dashboard',
        layout: <AdminLayout />,
        role: [ADMIN_ROLE],
        component: <DashBoard />,
    },
    {
        title: 'admin',
        path: '/admin/users',
        layout: <AdminLayout />,
        role: [ADMIN_ROLE],
        component: <Users />,

    },
    {
        title: 'admin',
        path: '/admin/users/:id',
        layout: <AdminLayout />,
        role: [ADMIN_ROLE],
        component: <Detail />
    },
    {
        title: 'admin',
        path: '/admin/notificaions',
        layout: <AdminLayout />,
        role: [ADMIN_ROLE],
        component: <Notificaion />,
    },
    {
        title: 'verification2FA',
        path: '/verification2FA/:id',
        component: <Verification2FA />,
    },
];

export default routesConfig;
