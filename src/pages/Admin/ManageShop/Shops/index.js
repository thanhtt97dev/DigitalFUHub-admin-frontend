import React, { useEffect, useState, useContext } from "react";
import { Card, Form, Row, Col, Space, InputNumber, Input, Button } from 'antd';

import Spinning from "~/components/Spinning";

import { getShops } from "~/api/shop";
import {
    RESPONSE_CODE_SUCCESS,
    RESPONSE_CODE_NOT_ACCEPT,
    SHOP_STATUS_ALL,
    SHOP_STATUS_ACTIVATE,
    SHOP_STATUS_DEACTIVATE
} from "~/constants";
import TableShop from "~/components/Tables/TableShop";
import { NotificationContext } from "~/context/UI/NotificationContext";


const tabList = [
    {
        label: "Tất cả",
        key: "tab1",
    },
    {
        label: "Đang hoạt động",
        key: "tab2",
    },
    {
        label: "Vi phạm",
        key: "tab3",
    },
]

const initFormValues = [
    {
        name: 'productId',
        value: "",
    },
    {
        name: 'shopName',
        value: "",
    },
    {
        name: 'productName',
        value: "",
    },
    {
        name: 'productCategory',
        value: 0,
    },
    {
        name: 'soldMin',
        value: "",
    },
    {
        name: 'soldMax',
        value: "",
    },

];

function Shops() {

    const [loading, setLoading] = useState(false);
    const notification = useContext(NotificationContext);
    const [form] = Form.useForm();

    const [searchParams, setSearchParams] = useState({
        shopId: 0,
        shopName: "",
        shopEmail: "",
        shopStatusId: 0,
        page: 1
    })
    const [dataTable, setDataTable] = useState([])
    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 10,
        },
    });


    useEffect(() => {
        setLoading(true)
        getShops(searchParams)
            .then((res) => {
                if (res.data.status.responseCode === RESPONSE_CODE_SUCCESS) {
                    setDataTable(res.data.result)
                    setTableParams({
                        ...tableParams,
                        pagination: {
                            ...tableParams.pagination,
                            total: res.data.result.totalProduct,
                        },
                    });
                    setTimeout(() => {
                        setLoading(false)
                    }, 500)
                } else if (res.data.status.responseCode === RESPONSE_CODE_NOT_ACCEPT) {
                    notification('error', "Tham số tìm kiếm không hợp lệ!");
                    setLoading(false)
                }

            })
            .catch((err) => {

            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams])

    const handleTableChange = (pagination, filters, sorter) => {
        setSearchParams({
            ...searchParams,
            page: pagination.current
        })
        setTableParams({
            pagination,
            filters,
            ...sorter,
        });

        // `dataSource` is useless since `pageSize` changed
        if (pagination.pageSize !== tableParams.pagination?.pageSize) {
            setDataTable([]);
        }
    };

    const [activeTabKey, setActiveTabKey] = useState('tab1');
    const onTabChange = (key) => {
        switch (key) {
            case 'tab1':
                setSearchParams({
                    ...searchParams,
                    page: 1,
                    shopStatusId: SHOP_STATUS_ALL
                })
                break;
            case 'tab2':
                setSearchParams({
                    ...searchParams,
                    page: 1,
                    shopStatusId: SHOP_STATUS_ACTIVATE
                })
                break;
            case 'tab3':
                setSearchParams({
                    ...searchParams,
                    page: 1,
                    shopStatusId: SHOP_STATUS_DEACTIVATE
                })
                break;
            default: return;
        }
        setTableParams({
            ...tableParams,
            pagination: {
                current: 1,
                pageSize: 10,
            },
        });
        setActiveTabKey(key);
    };
    const contentList = {
        tab1: <TableShop tableParams={tableParams} handleTableChange={handleTableChange} data={dataTable} />,
        tab2: <TableShop tableParams={tableParams} handleTableChange={handleTableChange} data={dataTable} />,
        tab3: <TableShop tableParams={tableParams} handleTableChange={handleTableChange} data={dataTable} />,
    };


    const onFinish = (values) => {
        var shopId = values.shopId
        var shopName = values.shopName;
        var shopEmail = values.shopEmail;
        setSearchParams({
            ...searchParams,
            shopId,
            shopName,
            shopEmail,
        })
    };
    const onReset = () => {
        form.resetFields();
        form.setFieldsValue({ productCategory: 0 });
    };
    return (
        <Spinning spinning={loading}>
            <Card
                style={{
                    width: '100%',
                    minHeight: '200px',
                    marginBottom: "20px"
                }}
            >

                <Form
                    form={form}
                    onFinish={onFinish}
                    fields={initFormValues}
                >
                    <Row>
                        <Col span={12}>
                            <Row >
                                <Col span={6} offset={2}><label>Mã cửa hàng: </label></Col>
                                <Col span={12}>
                                    <Form.Item name="shopId" >
                                        <Input />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row >
                                <Col span={6} offset={2}><label>Tên cửa hàng: </label></Col>
                                <Col span={12}>
                                    <Form.Item name="shopName" >
                                        <Input />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Col>
                        <Col span={12}>
                            <Row >
                                <Col span={6} offset={2}><label>Email cửa hàng: </label></Col>
                                <Col span={12}>
                                    <Form.Item name="shopEmail" >
                                        <Input />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row>
                                <Col span={6} offset={2}>
                                    <Space>
                                        <Button type="primary" htmlType="submit">
                                            Tìm kiếm
                                        </Button>
                                        <Button htmlType="button" onClick={onReset}>
                                            Xóa
                                        </Button>
                                    </Space>
                                </Col>
                            </Row>
                        </Col>
                    </Row>

                </Form>
            </Card>
            <Card
                style={{
                    width: '100%',
                    minHeight: '100vh'
                }}
                tabList={tabList}
                activeTabKey={activeTabKey}
                onTabChange={onTabChange}
            >

                {contentList[activeTabKey]}
            </Card>
        </Spinning>
    );
}

export default Shops;