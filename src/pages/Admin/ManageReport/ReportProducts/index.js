import React, { useEffect, useState, useContext } from "react";
import { Card, Table, Tag, Button, Form, Input, Space, DatePicker, Select, Row, Col, Image, Tooltip, } from "antd";
import locale from 'antd/es/date-picker/locale/vi_VN';
import { Link, useLocation } from "react-router-dom";

import NotificationContext from "~/context/UI/NotificationContext";

import {
    getReportProducts,
    getAllReasonReportProduct
} from '~/api/reportProduct'

import Spinning from "~/components/Spinning";
import {
    ParseDateTime,
} from '~/utils/index'
import {
    RESPONSE_CODE_SUCCESS,
    PAGE_SIZE,
    REPORT_PRODUCT_STATUS_ALL,
    REPORT_PRODUCT_STATUS_VERIFYING,
    REPORT_PRODUCT_STATUS_REJECT,
    REPORT_PRODUCT_STATUS_ACCEPT
} from "~/constants";
import ModalUpdateReportProduct from "~/components/Modals/ModalUpdateReportProduct";

const { RangePicker } = DatePicker;


function ReportProducts() {



    const columns = [
        {
            title: 'ID',
            dataIndex: 'reportProductId',
            width: '5%',
        },
        {
            title: 'Tên sản phẩm',
            dataIndex: 'productId',
            width: '20%',
            render: (productId, record) => {
                return (
                    <Link to={`/admin/product/${productId}`}>
                        <Space>
                            <Image src={record.productThumbnail} width={80} height={80} />
                            {record.productName}
                        </Space>
                    </Link>
                )
            }
        },
        {
            title: 'Tên cửa hàng',
            dataIndex: 'shopId',
            width: '15%',
            render: (shopId, record) => {
                return (
                    <Link to={`/admin/shop/${record.shopId}`}>{record.shoptName}</Link>
                )
            }
        },
        {
            title: 'Email người tố cáo',
            dataIndex: 'customerEmail',
            width: '15%',
            render: (customerEmail, record) => {
                return (
                    <Link to={`/admin/user/${record.customerId}`}>{customerEmail}</Link>
                )
            }
        },
        {
            title: 'Thời gian tạo',
            dataIndex: 'dateCreate',
            width: '8%',
            render: (dateCreate) => {
                return (
                    <span>{ParseDateTime(dateCreate)}</span>
                )
            }
        },
        {
            title: 'Lý do',
            dataIndex: 'reasonReportProductViName',
            width: '20%',
            render: (reasonReportProductViName, record) => {
                return (
                    <Tooltip
                        title={record.reasonReportProductViExplanation}
                    >
                        {reasonReportProductViName}
                    </Tooltip>
                )
            }
        },
        {
            title: 'Mô tả từ người tố cáo',
            dataIndex: 'description',
            width: '20%',
            render: (description, record) => {
                return (
                    <span>{description}</span>
                )
            }
        },
        {
            title: 'Ghi chú',
            dataIndex: 'reportProductStatusId',
            width: '15%',
            render: (reportProductStatusId, record) => {
                if (reportProductStatusId === REPORT_PRODUCT_STATUS_VERIFYING) {
                    return (
                        <Space>
                            <ModalUpdateReportProduct reportProductId={record.reportProductId} callBack={loadDataTable} />
                        </Space>

                    )
                } else if (reportProductStatusId === REPORT_PRODUCT_STATUS_REJECT) {
                    return <span>{record.note}</span>
                } else if (reportProductStatusId === REPORT_PRODUCT_STATUS_ACCEPT) {
                    return <span>{record.note}</span>
                }
            }
        },
        {
            title: 'Trạng thái',
            dataIndex: 'reportProductStatusId',
            width: '10%',
            render: (reportProductStatusId) => {
                if (reportProductStatusId === REPORT_PRODUCT_STATUS_VERIFYING) {
                    return <Tag color="#eeda49">Chưa xử lý</Tag>
                } else if (reportProductStatusId === REPORT_PRODUCT_STATUS_REJECT) {
                    return <Tag color="#87d068">Từ chối tố cáo</Tag>
                } else if (reportProductStatusId === REPORT_PRODUCT_STATUS_ACCEPT) {
                    return <Tag color="#f50">Xác nhận vi phạm</Tag>
                }
            },
            fixed: "right"
        },
    ];



    const notification = useContext(NotificationContext);
    const [loading, setLoading] = useState(true)
    const location = useLocation();
    const [form] = Form.useForm();

    const [reasonReports, setReasonReports] = useState([]);
    const [dataTable, setDataTable] = useState([]);
    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: PAGE_SIZE,
            showSizeChanger: false
        },
    });
    const [searchData, setSearchData] = useState({
        email: '',
        productId: '',
        productName: '',
        shopName: '',
        fromDate: '',
        toDate: '',
        reasonReportProductId: 0,
        reportProductStatusId: location?.state?.status ? location?.state?.status : 0,
        page: 1
    });
    const [totalRecord, setTotalRecord] = useState(0)

    useEffect(() => {
        getAllReasonReportProduct()
            .then((res) => {
                setReasonReports(res.data.result)
                console.log(reasonReports)
            })
            .catch(() => {

            })
    }, [])

    useEffect(() => {
        loadDataTable();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchData])



    const loadDataTable = () => {
        setLoading(true)
        getReportProducts(searchData)
            .then((res) => {
                if (res.data.status.responseCode === RESPONSE_CODE_SUCCESS) {
                    var data = res.data.result.reportProducts
                    setDataTable(data)
                    console.log(data)
                    setTableParams({
                        ...tableParams,
                        pagination: {
                            ...tableParams.pagination,
                            total: res.data.result.total,
                        },
                    });
                    setTotalRecord(res.data.result.total)
                } else {
                    notification("error", "Đang có chút sự cố! Hãy vui lòng thử lại!")
                }
            })
            .catch((err) => {
                console.log(err)
            })
            .finally(() => {
                setTimeout(() => { setLoading(false) }, 500)
            })
    }

    const initFormValues = [
        {
            name: 'email',
            value: searchData.email,
        },
        {
            name: 'productId',
            value: searchData.productId,
        },
        {
            name: 'productName',
            value: searchData.productName,
        },
        {
            name: 'shopName',
            value: searchData.shopName,
        },
        {
            name: 'fromDate',
            value: searchData.fromDate,
        },
        {
            name: 'toDate',
            value: searchData.toDate,
        },
        {
            name: 'reasonReportProductId',
            value: searchData.reasonReportProductId,
        },
        {
            name: 'reportProductStatusId',
            value: searchData.reportProductStatusId,
        },
    ];

    const onFinish = (values) => {
        setLoading(true);
        if (values.date === null) {
            notification("error", "Thời gian đơn hàng không được trống!")
            setLoading(false);
            return;
        }

        setSearchData({
            email: values.email,
            productId: values.productId,
            productName: values.productName,
            shopName: values.shopName,
            fromDate: (values.date === undefined) ? '' : values.date[0].$d.toLocaleDateString(),
            toDate: (values.date === undefined) ? '' : values.date[1].$d.toLocaleDateString(),
            reasonReportProductId: values.reasonReportProductId,
            reportProductStatusId: values.reportProductStatusId,
            page: 1
        });
    };

    const onReset = () => {
        form.resetFields();
        form.setFieldsValue({
            reasonReportProductId: 0,
            reportProductStatusId: REPORT_PRODUCT_STATUS_ALL,
        });
    };

    const handleTableChange = (pagination, filters, sorter) => {
        setSearchData({
            ...searchData,
            page: pagination.current
        })
        setTableParams({
            pagination,
            filters,
            ...sorter,
        });
    };

    return (
        <>
            <Spinning spinning={loading}>
                <Card>
                    <Form
                        name="basic"
                        form={form}
                        onFinish={onFinish}
                        fields={initFormValues}
                    >
                        <Row>
                            <Col span={12}>
                                <Row >
                                    <Col span={6} offset={2}>Email người tố cáo:</Col>
                                    <Col span={12}>
                                        <Form.Item name="email" >
                                            <Input />
                                        </Form.Item>
                                    </Col>
                                </Row>

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
                                    <Col span={6} offset={2}>Thời gian tạo:</Col>
                                    <Col span={12}>
                                        <Form.Item name="date" >
                                            <RangePicker locale={locale}
                                                format={"M/D/YYYY"}
                                                placement={"bottomLeft"} />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Row >
                                    <Col span={6} offset={2}>Nguyên nhân: </Col>
                                    <Col span={12}>
                                        <Form.Item name="reasonReportProductId" >
                                            <Select >
                                                <Select.Option value={0}>Tất cả</Select.Option>
                                                {reasonReports.map((value) => {
                                                    return (
                                                        <Select.Option
                                                            key={value.reasonReportProductId}
                                                            value={value.reasonReportProductId}
                                                        >
                                                            {value.viName}
                                                        </Select.Option>
                                                    )
                                                })}

                                            </Select>
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Row >
                                    <Col span={6} offset={2}>Trạng thái: </Col>
                                    <Col span={12}>
                                        <Form.Item name="reportProductStatusId" >
                                            <Select >
                                                <Select.Option value={REPORT_PRODUCT_STATUS_ALL}>Tất cả</Select.Option>
                                                <Select.Option value={REPORT_PRODUCT_STATUS_VERIFYING}>Chưa xử lý</Select.Option>
                                                <Select.Option value={REPORT_PRODUCT_STATUS_REJECT}>Từ chối tố cáo</Select.Option>
                                                <Select.Option value={REPORT_PRODUCT_STATUS_ACCEPT}>Xác nhận vi phạm</Select.Option>
                                            </Select>
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col span={2} offset={8}>
                                        <Space>
                                            <Button htmlType="button" onClick={onReset}>
                                                Xóa
                                            </Button>
                                            <Button type="primary" htmlType="submit">
                                                Tìm kiếm
                                            </Button>
                                        </Space>

                                    </Col>
                                </Row>
                            </Col>
                        </Row>
                    </Form>
                </Card>

                <Card style={{ marginTop: "20px", minHeight: "80vh" }}>
                    <Row align="end">
                        <b>{totalRecord} Kết quả</b>
                    </Row>
                    <Table
                        columns={columns}
                        pagination={tableParams.pagination}
                        dataSource={dataTable}
                        rowKey={(record) => record.orderId}
                        onChange={handleTableChange}
                        scroll={{
                            x: 1800,
                        }}
                        size="middle"
                    />
                </Card>

            </Spinning>
        </>
    )
}

export default ReportProducts;