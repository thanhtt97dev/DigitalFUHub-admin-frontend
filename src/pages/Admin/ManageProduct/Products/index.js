import React, { useEffect, useState, useContext } from "react";
import { Card, Form, Row, Col, Space, Select, Input, Button, InputNumber } from 'antd';

import Spinning from "~/components/Spinning";

import { getProducts } from "~/api/product";
import { getAllCategory } from "~/api/category"
import {
    RESPONSE_CODE_SUCCESS,
    RESPONSE_CODE_NOT_ACCEPT,
    PRODUCT_STATUS_ACTIVE,
    PRODUCT_STATUS_HIDE,
    PRODUCT_STATUS_BAN
} from "~/constants";
import TableProduct from "~/components/Tables/TableProduct";
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
        label: "Đã ẩn",
        key: "tab3",
    },
    {
        label: "Vi phạm",
        key: "tab4",
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

function Products() {

    const [loading, setLoading] = useState(false);
    const notification = useContext(NotificationContext);
    const [form] = Form.useForm();

    const [searchParams, setSearchParams] = useState({
        productId: 0,
        shopId: 0,
        shopName: "",
        productName: "",
        productCategory: 0,
        soldMin: 0,
        soldMax: 0,
        productStatusId: 0,
        page: 1
    })
    const [dataTable, setDataTable] = useState([])
    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 10,
            showSizeChanger: false
        },
    });

    const [categories, setCategories] = useState([])

    useEffect(() => {
        getAllCategory()
            .then((res) => {
                if (res.data.status.responseCode === RESPONSE_CODE_SUCCESS) {
                    setCategories(res.data.result)
                }
            })
            .catch((err) => {

            })
    }, [])

    useEffect(() => {
        setLoading(true)
        getProducts(searchParams)
            .then((res) => {
                if (res.data.status.responseCode === RESPONSE_CODE_SUCCESS) {
                    setDataTable(res.data.result.products)
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
                    productStatusId: 0
                })
                break;
            case 'tab2':
                setSearchParams({
                    ...searchParams,
                    page: 1,
                    productStatusId: PRODUCT_STATUS_ACTIVE
                })
                break;
            case 'tab3':
                setSearchParams({
                    ...searchParams,
                    page: 1,
                    productStatusId: PRODUCT_STATUS_HIDE
                })
                break;
            case 'tab4':
                setSearchParams({
                    ...searchParams,
                    page: 1,
                    productStatusId: PRODUCT_STATUS_BAN
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
        tab1: <TableProduct tableParams={tableParams} handleTableChange={handleTableChange} data={dataTable} />,
        tab2: <TableProduct tableParams={tableParams} handleTableChange={handleTableChange} data={dataTable} />,
        tab3: <TableProduct tableParams={tableParams} handleTableChange={handleTableChange} data={dataTable} />,
        tab4: <TableProduct tableParams={tableParams} handleTableChange={handleTableChange} data={dataTable} />,
    };


    const onFinish = (values) => {
        var productId = values.productId === "" ? 0 : values.productId
        var shopId = values.shopId
        var shopName = values.shopName;
        var productName = values.productName;
        var productCategory = values.productCategory
        var soldMin = values.soldMin === "" ? 0 : values.soldMin
        var soldMax = values.soldMax === "" ? 0 : values.soldMax
        setSearchParams({
            ...searchParams,
            shopId,
            productId,
            shopName,
            productName,
            productCategory,
            soldMin,
            soldMax
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
                                <Col span={6} offset={2}>Mã sản phẩm:</Col>
                                <Col span={12}>
                                    <Form.Item name="productId" >
                                        <Input />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row >
                                <Col span={6} offset={2}>Tên sản phẩm:</Col>
                                <Col span={12}>
                                    <Form.Item name="productName" >
                                        <Input />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row >
                                <Col span={6} offset={2}>Mã cửa hàng:</Col>
                                <Col span={12}>
                                    <Form.Item name="shopId" >
                                        <Input />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row >
                                <Col span={6} offset={2}>Tên cửa hàng:</Col>
                                <Col span={12}>
                                    <Form.Item name="shopName" >
                                        <Input />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Col>
                        <Col span={12}>
                            <Row >
                                <Col span={6} offset={2}>Thể loại:</Col>
                                <Col span={12}>
                                    <Form.Item name="productCategory" >
                                        <Select >
                                            <Select.Option value={0}>Tất cả</Select.Option>
                                            {categories.map((category, index) => {
                                                return (
                                                    <>
                                                        <Select.Option key={index} value={category.categoryId}>{category.categoryName}</Select.Option>
                                                    </>
                                                )
                                            })}
                                        </Select>
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row >
                                <Col span={6} offset={2}>Doanh số</Col>
                                <Col span={5}>
                                    <Form.Item name="soldMin" >
                                        <InputNumber placeholder="Tối thiểu" />
                                    </Form.Item>
                                </Col>
                                <Col offset={1}>-</Col>
                                <Col offset={1} span={5}>
                                    <Form.Item name="soldMax" >
                                        <InputNumber placeholder="Tối đa" />
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
                style={{ marginTop: "20px", minHeight: "80vh" }}
                tabList={tabList}
                activeTabKey={activeTabKey}
                onTabChange={onTabChange}
            >

                {contentList[activeTabKey]}
            </Card>
        </Spinning>
    );
}

export default Products;