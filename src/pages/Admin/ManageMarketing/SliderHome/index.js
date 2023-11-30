import React, { useEffect, useState, useContext } from "react";
import { Card, Form, Row, Col, Space, Input, Button, InputNumber } from 'antd';

import Spinning from "~/components/Spinning";

import { getSliders } from "~/api/slider";

import {
    RESPONSE_CODE_SUCCESS,
    RESPONSE_CODE_NOT_ACCEPT,
    STATUS_ALL_SLIDER_FOR_FILTER,
    STATUS_ACTIVE_SLIDER_FOR_FILTER,
    STATUS_UN_ACTIVE_SLIDER_FOR_FILTER,
    PAGE_SIZE_SLIDER
} from "~/constants";
import TableSlider from "~/components/Tables/TableSlider";
import { NotificationContext } from "~/context/UI/NotificationContext";


const tabList = [
    {
        label: "Tất cả",
        key: "tab1",
    },
    {
        label: "Đang hiển thị",
        key: "tab2",
    },
    {
        label: "Đang ẩn",
        key: "tab3",
    }
]

const initFormValues = [
    {
        name: 'nameSlider',
        value: "",
    },
    {
        name: 'linkProduct',
        value: "",
    },
    {
        name: 'startDate',
        value: "",
    },
    {
        name: 'endDate',
        value: "",
    }
];

function SliderHome() {

    /// states
    const [dataTable, setDataTable] = useState([]);
    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: PAGE_SIZE_SLIDER,
        },
    });
    const [searchParams, setSearchParams] = useState({
        name: "",
        link: "",
        startDate: null,
        endDate: null,
        statusActive: STATUS_ALL_SLIDER_FOR_FILTER,
        page: 1
    });
    const [loading, setLoading] = useState(false);
    const [form] = Form.useForm();
    const [activeTabKey, setActiveTabKey] = useState('tab1');

    ///

    /// contexts
    const notification = useContext(NotificationContext);
    ///

    /// useEffects
    useEffect(() => {
        setLoading(true);

        getSliders(searchParams)
            .then((res) => {
                if (res.status === 200) {
                    const data = res.data;
                    const status = data.status;
                    if (status.responseCode === RESPONSE_CODE_SUCCESS) {
                        const result = data.result;
                        setDataTable(result.sliders);

                        setTableParams({
                            ...tableParams,
                            pagination: {
                                ...tableParams.pagination,
                                total: result.totalSlider,
                            },
                        });
                    } else if (status.responseCode === RESPONSE_CODE_NOT_ACCEPT) {
                        notification('error', "Tham số tìm kiếm không hợp lệ!");
                    }
                }

                setLoading(false);
            })
            .catch((err) => {
                console.log(err);
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams])
    ///

    /// handles
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
    ///

    const onTabChange = (key) => {
        switch (key) {
            case 'tab1':
                setSearchParams({
                    ...searchParams,
                    page: 1,
                    statusActive: STATUS_ALL_SLIDER_FOR_FILTER
                })
                break;
            case 'tab2':
                setSearchParams({
                    ...searchParams,
                    page: 1,
                    statusActive: STATUS_ACTIVE_SLIDER_FOR_FILTER
                })
                break;
            case 'tab3':
                setSearchParams({
                    ...searchParams,
                    page: 1,
                    statusActive: STATUS_UN_ACTIVE_SLIDER_FOR_FILTER
                })
                break;
            default: return;
        }

        setTableParams({
            ...tableParams,
            pagination: {
                current: 1,
                pageSize: PAGE_SIZE_SLIDER,
            },
        });

        setActiveTabKey(key);

    };
    const contentList = {
        tab1: <TableSlider tableParams={tableParams} handleTableChange={handleTableChange} data={dataTable} />,
        tab2: <TableSlider tableParams={tableParams} handleTableChange={handleTableChange} data={dataTable} />,
        tab3: <TableSlider tableParams={tableParams} handleTableChange={handleTableChange} data={dataTable} />
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
        form.setFieldsValue({ statusSlider: STATUS_ALL_SLIDER_FOR_FILTER });
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
                                <Col span={6} offset={2}>Tên Slider:</Col>
                                <Col span={12}>
                                    <Form.Item name="nameSlider" >
                                        <Input />
                                    </Form.Item>
                                </Col>
                            </Row>
                            <Row >
                                <Col span={6} offset={2}>Link sản phẩm:</Col>
                                <Col span={12}>
                                    <Form.Item name="linkProduct" >
                                        <Input />
                                    </Form.Item>
                                </Col>
                            </Row>
                        </Col>
                        <Col span={12}>
                            <Row >
                                <Col span={6} offset={2}>Ngày tạo:</Col>
                                <Col span={5}>
                                    <Form.Item name="startDate" >
                                        <InputNumber placeholder="Tối thiểu" />
                                    </Form.Item>
                                </Col>
                                <Col offset={1}>-</Col>
                                <Col offset={1} span={5}>
                                    <Form.Item name="endDate" >
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

export default SliderHome;