import React, { useState } from 'react';
import classNames from 'classnames/bind';
import styles from './AdminLayout.module.scss';
import logo from '~/assets/images/fpt-logo.jpg';
import { Link, Outlet } from 'react-router-dom';
import { AreaChartOutlined, StockOutlined, MenuUnfoldOutlined, MenuFoldOutlined } from '@ant-design/icons';
import { Layout, Menu, Space, Avatar, Button, Row, Col, Dropdown } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCartShopping, faUsers, faVault } from '@fortawesome/free-solid-svg-icons';
import Message from '~/components/Message';
const cx = classNames.bind(styles);
const { Content, Sider, Header } = Layout;


const items = [

    // {
    //     key: 'account',
    //     label: <Link to={"/settings"}>Tài khoản</Link>,
    //     icon: <UserOutlined />,
    // },
    // {
    //     key: 'history transaction',
    //     label: <Link to={"/historyTransaction"}>Lịch sử giao dịch</Link>,
    //     icon: <CreditCardOutlined />,
    // },
    // {
    //     key: 'logout',
    //     label: <Logout />,
    // },
];

const menuItems = [
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
        key: 'admin/product',
        icon: <FontAwesomeIcon icon={faVault} spin />
    },
    {
        label: <Link to='/admin/user'>Quản lý người dùng</Link>,
        key: 'admin/user',
        icon: <FontAwesomeIcon icon={faUsers} />
    },
];

// const AdminLayout = () => {
//     const [collapsed, setCollapsed] = useState(false);

//     const {
//         token: { colorBgContainer },
//     } = theme.useToken();
//     return (
//         <Layout className={cx('container')}
//         >
//             <Sider className={cx('sidebar')}
//                 collapsible
//                 collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}
//                 style={{ background: "#f1f1f1" }}
//             >
//                 <div className={cx('header-logo')}>
//                     <Space>
//                         <Avatar src={logo} size="large" />
//                         <Link to={'/admin'} className={cx("link")}>
//                             <h3>DigitalFUHub</h3>
//                         </Link>
//                     </Space>
//                 </div>
//                 <Menu
//                     className={cx("menu")}
//                     defaultSelectedKeys={['dashboard']}
//                     mode="inline" items={items} />
//             </Sider>
//             <Layout>

//                 <Content className={cx("content")}>
//                     <div
//                         style={{
//                             padding: 5,
//                             minHeight: 650,
//                             background: colorBgContainer,
//                         }}
//                     >
//                         <Outlet />
//                     </div>
//                 </Content>
//             </Layout>
//         </Layout >
//     );
// };
// export default AdminLayout;


const AdminLayout = () => {
    const [collapsed, setCollapsed] = useState(false);

    return (
        <Layout className={cx('container')}>
            <Sider className={cx('sider')} trigger={null} collapsible collapsed={collapsed} width={260} collapsedWidth={100}
                style={{

                }}
            >
                <div className={cx('header-logo')}>
                    <Space>
                        <Link to={'/home'} className={cx("link")}>
                            <h3>DigitalFUHub</h3>
                        </Link>
                    </Space>
                </div>
                <Menu
                    className={cx("menu")}
                    defaultOpenKeys={['seller/product', 'seller/order']}
                    defaultSelectedKeys={['dashboard']}
                    mode="inline" items={menuItems} />
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
                                    {/* <Notification /> */}
                                </Col>
                                <Col>
                                    {/* <Link to="/chatBox">
                                        <Badge count={<ClockCircleOutlined style={{ paddingTop: '30px', color: '#f5222d' }} />} size="small">
                                            <MessageOutlined style={{
                                                fontSize: '25px',
                                                paddingTop: '20px'
                                            }} />
                                        </Badge>
                                    </Link> */}
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
                                        <Avatar src={logo} size="large" />
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
