import React, { useState } from 'react';
import {

    AreaChartOutlined,
    StockOutlined

} from '@ant-design/icons';
import { Layout, Menu, Space, theme, Avatar } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faCartShopping,
    faUsers,
    faVault
} from '@fortawesome/free-solid-svg-icons'

import styles from './AdminLayout.module.scss'
import classNames from 'classnames/bind';
import { Link, Outlet } from 'react-router-dom';
import logo from '~/assets/images/fpt-logo.jpg'

const cx = classNames.bind(styles);
const { Content, Sider } = Layout;

const items = [
    {
        label: <Link to=''>Thống kê</Link>,
        key: 'dashboard',
        icon: <AreaChartOutlined />,
    },
    {
        label: 'Quản lý tài chính',
        key: 'admin/finance',
        icon: <StockOutlined />,
        children: [
            {
                key: '/admin/finance/deposit',
                label: <Link to={"/admin/finance/deposit"}>Danh sách nạp tiền</Link>,
            },
            {
                key: '/admin/finance/withdraw',
                label: <Link to={"/admin/finance/withdraw"}>Danh sách rút tiền</Link>,
            },
            {
                key: '/admin/finance/businessFee',
                label: <Link to={"/admin/finance/businessFee"}>Phí kinh doanh</Link>,
            },
            {
                key: '/admin/finance/transactionInternal',
                label: <Link to={"/admin/finance/transactionInternal"}>Giao dịch nội bộ</Link>,
            },
            {
                key: '/admin/finance/transactionCoin',
                label: <Link to={"/admin/finance/transactionCoin"}>Giao dịch xu</Link>,
            },
        ],
    },
    {
        label: <Link to='/admin/order'>Quản lý đơn hàng</Link>,
        key: 'admin/order',
        icon: <FontAwesomeIcon icon={faCartShopping} />,
    },
    {
        label: <Link to='/admin/product'>Quản lý sản phẩm</Link>,
        key: 'admin/user',
        icon: <FontAwesomeIcon icon={faVault} spin />
    },
    {
        label: <Link to='/admin/user'>Quản lý người dùng</Link>,
        key: 'admin/user',
        icon: <FontAwesomeIcon icon={faUsers} />
    },
];
const AdminLayout = () => {
    const [collapsed, setCollapsed] = useState(false);

    const {
        token: { colorBgContainer },
    } = theme.useToken();
    return (
        <Layout className={cx('container')}
        >
            <Sider className={cx('sidebar')}
                collapsible
                collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}
                style={{ background: "#f1f1f1" }}
            >
                <div className={cx('header-logo')}>
                    <Space>
                        <Avatar src={logo} size="large" />
                        <Link to={'/admin'} className={cx("link")}>
                            <h3>DigitalFUHub</h3>
                        </Link>
                    </Space>
                </div>
                <Menu
                    className={cx("menu")}
                    defaultSelectedKeys={['dashboard']}
                    mode="inline" items={items} />
            </Sider>
            <Layout>

                <Content className={cx("content")}>
                    <div
                        style={{
                            padding: 5,
                            minHeight: 650,
                            background: colorBgContainer,
                        }}
                    >
                        <Outlet />
                    </div>
                </Content>
            </Layout>
        </Layout >
    );
};
export default AdminLayout;
