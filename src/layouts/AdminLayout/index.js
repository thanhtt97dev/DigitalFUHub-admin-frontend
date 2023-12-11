import React, { useState } from 'react';
import classNames from 'classnames/bind';
import styles from './AdminLayout.module.scss';
import logoFPT from '~/assets/images/fpt-logo.jpg';
import { Link, Outlet, useLocation } from 'react-router-dom';
import {
    AreaChartOutlined,
    StockOutlined,
    MenuUnfoldOutlined,
    MenuFoldOutlined,
    ShoppingOutlined,
    ShopOutlined,
    SoundOutlined,
    WarningOutlined
} from '@ant-design/icons';
import { Layout, Menu, Space, Avatar, Button, Row, Col, Dropdown } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping, faUsers } from '@fortawesome/free-solid-svg-icons';
import Message from '~/components/Message';
import Notification from '~/components/Notification';
import logo from '~/assets/images/DIGITALFUHUB.png';
import Logout from '~/components/Logout';
import SignalR from '~/context/SignalR';

const cx = classNames.bind(styles);
const { Content, Sider, Header } = Layout;


const items = [
    {
        key: 'logout',
        label: <Logout />,
    },
];

const menuItems = [
    {
        label: <Link to='/admin/statistic'>Thống kê</Link>,
        key: '/admin/statistic',
        icon: <AreaChartOutlined />,
    },
    {
        label: 'Quản lý tài chính',
        key: '/admin/finance',
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
                key: '/admin/finance/feedbackBenefit',
                label: <Link to={"/admin/finance/feedbackBenefit"}>Lợi ích phản hồi</Link>,
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
        key: '/admin/order',
        icon: <FontAwesomeIcon icon={faCartShopping} />,
    },
    {
        label: <Link to='/admin/product'>Quản lý sản phẩm</Link>,
        key: '/admin/product',
        icon: <ShoppingOutlined />
    },
    {
        label: <Link to='/admin/shop'>Quản lý cửa hàng</Link>,
        key: '/admin/shop',
        icon: <ShopOutlined />
    },
    {
        label: <Link to='/admin/user'>Quản lý người dùng</Link>,
        key: '/admin/user',
        icon: <FontAwesomeIcon icon={faUsers} />
    },
    {
        label: <Link to='/admin/slider'>Quản lý slider</Link>,
        key: '/admin/slider',
        icon: <SoundOutlined />,
    },
    {
        label: 'Quản lý Tố cáo',
        key: '/admin/report',
        icon: <WarningOutlined />,
        children: [
            {
                key: '/admin/report/product',
                label: <Link to={"/admin/report/product"}>Tố cáo sản phẩm</Link>,
            },
            {
                key: '/admin/report/shop',
                label: <Link to={"/admin/report/shop"}>Tố cáo cửa hàng</Link>,
            }
        ],
    },
];

const AdminLayout = () => {
    const [collapsed, setCollapsed] = useState(false);
    const location = useLocation();
    const getSelectedKey = () => {
        const path = location.pathname.replace(/[0-9]+/g, "");
        if (path[path.length - 1] === '/') {
            return [path.slice(0, path.length - 1)]
        } else {
            return [path];
        }
    }
    return (
        <Layout className={cx('container')}>
            <Sider className={cx('sider')} trigger={null} collapsible collapsed={collapsed} width={260} collapsedWidth={100}
                style={{

                }}
            >
                <div className={cx('header-logo')}>
                    <Space>
                        <Link to={'/admin'} className={cx("link")}>
                            <img src={logo} style={{ width: '180px', 'marginTop': '1em' }} alt='logo' />
                        </Link>
                    </Space>
                </div>
                <Menu
                    className={cx("menu")}
                    //defaultOpenKeys={['/admin/finance', '/admin/slider']}
                    defaultSelectedKeys={['admin/dashboard']}
                    selectedKeys={getSelectedKey()}
                    mode="inline"
                    items={menuItems}
                />
            </Sider>
            <Layout>
                <Header id='header' className={cx('header')}>
                    <Row align="middle" justify="center">
                        <Col span={2}>
                            <Button
                                type="text"
                                icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                                onClick={() => setCollapsed(!collapsed)}
                                style={{
                                    fontSize: '16px',
                                    width: 64,
                                    height: 64,
                                }}
                            />
                        </Col>

                        <Col span={22}>
                            <Row gutter={[16, 0]} justify="end" align="middle">
                                <Col >
                                    <Notification />
                                </Col>
                                <Col>
                                    <Message />
                                </Col>
                                <Col align="center" style={{
                                    marginTop: '-0.5rem'
                                }}>
                                    <Dropdown
                                        menu={{ items }}
                                        placement="bottomRight"
                                        arrow={{
                                            pointAtCenter: true,
                                        }}
                                    >
                                        <Avatar src={logoFPT} size="large" />
                                    </Dropdown>
                                </Col>
                            </Row>

                        </Col>
                    </Row>
                </Header>
                <Content className={cx('content')}>
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
};
export default AdminLayout;
