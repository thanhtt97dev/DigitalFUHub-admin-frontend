import Login from '~/pages/Login';
import Register from '~/pages/Register';
import AccessDenied from '~/pages/AccessDenied';

import Home from '~/pages/Home';

import { ADMIN_ROLE, USER_ROLE } from '~/constants';
import AdminLayout from '~/components/AdminLayout';
import DashBoard from '~/pages/Admin/DashBoard';
import Users from '~/pages/Admin/Users';
import Detail from '~/pages/Admin/Users/Detail';
import Notificaion from '~/pages/Admin/Notificaion';
import NormalLayout from '~/components/NormalLayout';
import UploadFile from '~/pages/UploadFile';
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
        layout: <NormalLayout />,
        component: <AccessDenied />,
    },
    {
        title: 'home',
        path: '/home',
        layout: <NormalLayout />,
        component: <Home />,
    },
    {
        title: 'admin',
        path: '/admin',
        layout: <AdminLayout />,
        role: [ADMIN_ROLE, USER_ROLE],
        routes: [
            {
                path: 'dashboard',
                component: <DashBoard />,
            },
            {
                path: 'users',
                component: <Users />,
            },
            {
                path: 'users/:id',
                component: <Detail />,
            },
            {
                path: 'notificaions',
                component: <Notificaion />,
            },
        ],
    },
    {
        title: 'register',
        path: '/register',
        component: <Register />,
    },
    {
        title: 'upload',
        path: '/upload',
        layout: <NormalLayout />,
        component: <UploadFile />,
    },
    {
        title: 'verification2FA',
        path: '/verification2FA/:id',
        component: <Verification2FA />,
    },
];

export default routesConfig;
