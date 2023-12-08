import Login from '~/pages/Login';
import AccessDenied from '~/pages/AccessDenied';
import { ADMIN_ROLE } from '~/constants';

import Users from '~/pages/Admin/ManageUsers/Users';
import Verification2FA from '~/pages/Verification2FA';
import AdminLayout from '~/layouts/AdminLayout';
import HistoryDeposit from '~/pages/Admin/ManageFinance/HistoryDeposit';
import HistoryWithdraw from '~/pages/Admin/ManageFinance/HistoryWithdraw';
import SliderHome from '~/pages/Admin/ManageSlider/SliderHome';
import WithdrawByList from '~/pages/Admin/ManageFinance/HistoryWithdraw/WithdrawByList';
import HistoryTransactionInternal from '~/pages/Admin/ManageFinance/HistoryTransactionInternal';
import Orders from '~/pages/Admin/ManageOrders/Orders';
import OrderDetail from '~/pages/Admin/ManageOrders/OrderDetail';
import UserInfo from '~/pages/Admin/ManageUsers/UserInfo';
import BusinessFee from '~/pages/Admin/ManageFinance/BusinessFee';
import ChatBox from '~/pages/ChatBox';
import HistoryTransactionCoin from '~/pages/Admin/ManageFinance/HistoryTransactionCoin';
import Products from '~/pages/Admin/ManageProduct/Products';
import ProductDetail from '~/pages/Admin/ManageProduct/ProductDetail';
import ShopDetail from '~/pages/Admin/ManageShop/ShopDetail';
import Shops from '~/pages/Admin/ManageShop/Shops';
import AddSlider from '~/pages/Admin/ManageSlider/AddSlider';
import EditSlider from '~/pages/Admin/ManageSlider/EditSlider';
import Statistics from '~/pages/Admin/Statistics';
import NotFound from '~/pages/NotFound';

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
        path: '/admin/statistic',
        layout: <AdminLayout />,
        role: [ADMIN_ROLE],
        component: <Statistics />,
    },
    {
        path: '/admin/finance/deposit',
        layout: <AdminLayout />,
        role: [ADMIN_ROLE],
        component: <HistoryDeposit />
    },
    {
        path: '/admin/chatBox',
        layout: <AdminLayout />,
        component: <ChatBox />
    },
    {
        path: '/admin/finance/withdraw',
        layout: <AdminLayout />,
        role: [ADMIN_ROLE],
        component: <HistoryWithdraw />
    },
    {
        path: '/admin/slider',
        layout: <AdminLayout />,
        role: [ADMIN_ROLE],
        component: <SliderHome />
    },
    {
        path: '/admin/slider/add',
        layout: <AdminLayout />,
        role: [ADMIN_ROLE],
        component: <AddSlider />
    },
    {
        path: '/admin/slider/edit/:id',
        layout: <AdminLayout />,
        role: [ADMIN_ROLE],
        component: <EditSlider />
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
        path: '/admin/product',
        layout: <AdminLayout />,
        role: [ADMIN_ROLE],
        component: <Products />
    },
    {
        path: '/admin/product/:id',
        layout: <AdminLayout />,
        role: [ADMIN_ROLE],
        component: <ProductDetail />
    },
    {
        path: '/admin/shop',
        layout: <AdminLayout />,
        role: [ADMIN_ROLE],
        component: <Shops />
    },
    {
        path: '/admin/shop/:id',
        layout: <AdminLayout />,
        role: [ADMIN_ROLE],
        component: <ShopDetail />
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
    {
        title: 'chatbox',
        path: '/chatBox',
        component: <ChatBox />,
    },
    {
        title: 'not found',
        path: '/notFound',
        component: <NotFound />,
    },
];

export default routesConfig;
