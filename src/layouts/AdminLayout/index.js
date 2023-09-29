import React, { useState } from 'react';
import {

    UserOutlined,
    AreaChartOutlined,
    StockOutlined

} from '@ant-design/icons';
import { Layout, Menu, Space, theme, Avatar } from 'antd';
import styles from './AdminLayout.module.scss'
import classNames from 'classnames/bind';
import { Link, Outlet } from 'react-router-dom';
import logo from '~/assets/images/fpt-logo.jpg'

const cx = classNames.bind(styles);
const { Header, Content, Sider } = Layout;

const items = [
    {
        label: <Link to=''>Thống kê</Link>,
        key: 'dashboard',
        icon: <AreaChartOutlined />,
    },
    {
        label: 'Quản lý tài chính',
        key: 'seller/product',
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
                key: '/admin/finance/transaction',
                label: <Link to={"/admin/finance/transaction"}>Lịch sử giao dịch nội bộ</Link>,
            },
        ],
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
                <Header
                    className={cx('header')}
                >
                    <Space size={16} style={{ display: 'flex', margin: '0 16px', alignItems: 'center', justifyContent: 'flex-end' }}>
                        <Avatar size='large' icon={<UserOutlined />} />
                    </Space>
                </Header>
                <Content className={cx("content")}>
                    <div
                        style={{
                            padding: 12,
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
