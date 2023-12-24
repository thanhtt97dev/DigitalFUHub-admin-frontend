import React, { useEffect, useState, useContext } from "react";
import { Card, Table, Tag, Button, Form, Input, Space, DatePicker, Select, Row, Col, } from "antd";
import locale from 'antd/es/date-picker/locale/vi_VN';
import { Link, useLocation } from "react-router-dom";
import {
    FileExcelOutlined
} from '@ant-design/icons';
import * as ExcelJS from "exceljs"
import saveAs from "file-saver";

import { NotificationContext } from "~/context/UI/NotificationContext";

import {
    getOrders,
    getReport
} from '~/api/order'
import { dowloadFileOrderReport } from '~/api/storage'
import Spinning from "~/components/Spinning";
import {
    formatPrice,
    ParseDateTime,
    getOrderStatus,
    sliceText
} from '~/utils/index'
import {
    RESPONSE_CODE_SUCCESS,
    PAGE_SIZE,
    ORDER_WAIT_CONFIRMATION,
    ORDER_CONFIRMED,
    ORDER_COMPLAINT,
    ORDER_SELLER_REFUNDED,
    ORDER_DISPUTE,
    ORDER_REJECT_COMPLAINT,
    ORDER_SELLER_VIOLATES,
    ORDER_REPORT_EXCEL_FILE_NAME,
    ORDER_ALL
} from "~/constants";
import classNames from 'classnames/bind';
import styles from './Orders.module.scss';
const cx = classNames.bind(styles);



const { RangePicker } = DatePicker;


const columns = [
    {
        title: 'Mã đơn hàng',
        dataIndex: 'orderId',
        width: '8%',
        render: (orderId) => {
            return (
                <Link to={`/admin/order/${orderId}`}>{orderId}</Link>
            )
        }
    },
    {
        title: 'Email khách hàng',
        dataIndex: 'customerEmail',
        width: '16%',
        render: (customerEmail, record) => {
            return (
                <Link to={`/admin/user/${record.customerId}`}>{sliceText(customerEmail, 25)}</Link>
            )
        }
    },
    {
        title: 'Tên shop',
        dataIndex: 'shopName',
        width: '14%',
        render: (shopName, record) => {
            return (
                <Link to={`/admin/seller/${record.sellerId}`}>{sliceText(shopName, 20)}</Link>
            )
        }
    },
    {
        title: 'Thời gian mua',
        dataIndex: 'orderDate',
        width: '15%',
        render: (orderDate) => {
            return (
                <span>{ParseDateTime(orderDate)}</span>
            )
        }
    },
    {
        title: 'Giá trị đơn hàng',
        dataIndex: 'totalAmount',
        width: '12%',
        render: (totalAmount) => {
            return (
                <span>{sliceText(formatPrice(totalAmount), 16)}</span>
            )
        }
    },
    {
        title: 'Mã giảm giá sử dụng',
        dataIndex: 'totalCouponDiscount',
        width: '12%',
        render: (totalCouponDiscount) => {
            return (
                <span>{sliceText(formatPrice(totalCouponDiscount), 16)}</span>
            )
        }
    },
    {
        title: 'Xu đã sử dụng',
        dataIndex: 'totalCoinDiscount',
        width: '12%',
        render: (totalCoinDiscount) => {
            return (
                <pspan>{totalCoinDiscount} xu</pspan>
            )
        }
    },
    {
        title: 'Người mua thanh toán',
        dataIndex: 'totalPayment',
        width: '14%',
        render: (totalPayment) => {
            return (
                <span>{sliceText(formatPrice(totalPayment), 20)}</span>
            )
        }
    },
    {
        title: 'Số tiền trả người bán',
        dataIndex: 'totalRefundSeller',
        width: '14%',
        render: (totalRefundSeller) => {
            return (
                <span>{sliceText(formatPrice(totalRefundSeller), 20)}</span>
            )
        }
    },
    {
        title: 'Lợi nhuận',
        dataIndex: 'totalBenefit',
        width: '14%',
        render: (totalBenefit) => {
            return (
                <span>{formatPrice(totalBenefit)}</span>
            )
        }
    },
    {
        title: 'Phí kinh doanh',
        dataIndex: 'businessFee',
        width: '10%',
        render: (businessFee) => {
            return (
                <span>{businessFee} %</span>
            )
        }
    },
    {
        title: 'Trạng thái',
        dataIndex: 'orderStatusId',
        width: '10%',
        render: (orderStatusId) => {
            if (orderStatusId === ORDER_WAIT_CONFIRMATION) {
                return <Tag color="#108ee9">Chờ xác nhận</Tag>
            } else if (orderStatusId === ORDER_CONFIRMED) {
                return <Tag color="#87d068">Đã xác nhận</Tag>
            } else if (orderStatusId === ORDER_COMPLAINT) {
                return <Tag color="#c6e329">Khiếu nại</Tag>
            } else if (orderStatusId === ORDER_SELLER_REFUNDED) {
                return <Tag color="#eab0b0e0">Người bán hoàn tiền</Tag>
            } else if (orderStatusId === ORDER_DISPUTE) {
                return <Tag color="#ffaa01">Tranh chấp</Tag>
            } else if (orderStatusId === ORDER_REJECT_COMPLAINT) {
                return <Tag color="#ca01ff">Từ chối khiếu nại</Tag>
            } else if (orderStatusId === ORDER_SELLER_VIOLATES) {
                return <Tag color="#f50">Người bán vi phạm</Tag>
            }
        },
        fixed: "right"
    },
    {
        dataIndex: 'orderId',
        width: '7%',
        render: (orderId) => {
            return (
                <Link to={`/admin/order/${orderId}`}>
                    <Button size="small" type="link" >Chi tiết</Button>
                </Link>
            )
        },
        fixed: "right"
    },
];

function Orders() {
    const notification = useContext(NotificationContext);
    const [loading, setLoading] = useState(true)
    const location = useLocation();
    const [form] = Form.useForm();
    const [dataTable, setDataTable] = useState([]);
    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: PAGE_SIZE,
            showSizeChanger: false
        },
    });
    const [searchData, setSearchData] = useState({
        orderId: '',
        customerEmail: '',
        shopId: '',
        shopName: '',
        fromDate: '',
        toDate: '',
        status: location?.state?.status ? location?.state?.status : ORDER_ALL,
        page: 1
    });
    const [totalRecord, setTotalRecord] = useState(0)

    useEffect(() => {
        setLoading(true)
        getOrders(searchData)
            .then((res) => {
                if (res.data.status.responseCode === RESPONSE_CODE_SUCCESS) {
                    setDataTable(res.data.result.orders)
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

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchData])

    const initFormValues = [
        {
            name: 'orderId',
            value: searchData.orderId,
        },
        {
            name: 'customerEmail',
            value: searchData.customerEmail,
        },
        {
            name: 'shopName',
            value: searchData.shopName,
        },
        {
            name: 'shopId',
            value: searchData.shopId,
        },
        {
            name: 'status',
            value: searchData.status,
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
            orderId: values.orderId,
            customerEmail: values.customerEmail,
            shopId: values.shopId,
            shopName: values.shopName,
            fromDate: (values.date === undefined) ? '' : values.date[0].$d.toLocaleDateString(),
            toDate: (values.date === undefined) ? '' : values.date[1].$d.toLocaleDateString(),
            status: values.status,
            page: 1
        });
    };

    const onReset = () => {
        form.resetFields();
        form.setFieldsValue({
            orderId: '',
            customerEmail: '',
            shopId: '',
            shopName: '',
            status: 0,
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


    const handleExportExcel = () => {
        setLoading(true);
        getReport(searchData)
            .then((response) => {
                var dataOrders = response.data.result
                dowloadFileOrderReport()
                    .then(res => {
                        const workbook = new ExcelJS.Workbook();
                        workbook.xlsx
                            .load(res.data)
                            .then(async () => {
                                const worksheet = workbook.getWorksheet(1);

                                //data search
                                const cellOrderId = worksheet.getCell('K3');
                                cellOrderId.value = searchData.orderId;

                                const cellCustomerEmail = worksheet.getCell('K4');
                                cellCustomerEmail.value = searchData.customerEmail;

                                const cellOrderDate = worksheet.getCell('K5');
                                cellOrderDate.value = searchData.fromDate + " - " + searchData.toDate;

                                const cellShopId = worksheet.getCell('N3');
                                cellShopId.value = searchData.shopId;

                                const cellShopName = worksheet.getCell('N4');
                                cellShopName.value = searchData.shopName;

                                const cellOrderStatus = worksheet.getCell('N5');
                                cellOrderStatus.value = getOrderStatus(searchData.status);

                                // data table
                                dataOrders.forEach((data) => {
                                    worksheet.addRow(
                                        [
                                            data.orderId,
                                            data.customerId,
                                            data.customerEmail,
                                            data.sellerId,
                                            data.shopName,
                                            ParseDateTime(data.orderDate),
                                            data.totalAmount,
                                            data.totalCouponDiscount,
                                            data.totalCoinDiscount,
                                            data.totalPayment,
                                            data.totalRefundSeller,
                                            data.totalBenefit,
                                            data.businessFee,
                                            getOrderStatus(data.orderStatusId),
                                            data.note
                                        ]);
                                })
                                const bufferhe = await workbook.xlsx.writeBuffer();
                                saveAs(
                                    new Blob([bufferhe], { type: "application/octet-stream" }),
                                    ORDER_REPORT_EXCEL_FILE_NAME
                                );
                            })
                            .catch((error) => {
                                console.error(error.message);
                            });
                    })
                    .catch(() => {
                        notification("error", "Hệ thống đang gặp sự cố! Vui lòng thử lại sau!")
                    })
                    .finally(() => {
                        setTimeout(() => setLoading(false), 500)
                    })
            })
            .catch((err) => {

            })
            .finally(() => {
                setTimeout(() => { setLoading(false) }, 500)
            })
    }

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
                            <Col span={3} offset={1}>Mã hóa đơn:</Col>
                            <Col span={6}>
                                <Form.Item name="orderId" >
                                    <Input />
                                </Form.Item>
                            </Col>

                            <Col span={2} offset={1}>Shop Id:</Col>
                            <Col span={6}>
                                <Form.Item name="shopId" >
                                    <Input />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row>
                            <Col span={3} offset={1}>Email khách hàng:</Col>
                            <Col span={6}>
                                <Form.Item name="customerEmail" >
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={2} offset={1}>Tên shop:</Col>
                            <Col span={6}>
                                <Form.Item name="shopName" >
                                    <Input />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row>
                            <Col span={3} offset={1}>Thời gian đơn hàng:</Col>
                            <Col span={6}>
                                <Form.Item name="date" >
                                    <RangePicker locale={locale}
                                        format={"M/D/YYYY"}
                                        placement={"bottomLeft"} />
                                </Form.Item>
                            </Col>
                            <Col span={2} offset={1}>Trạng thái:</Col>
                            <Col span={6}>
                                <Form.Item name="status" >
                                    <Select >
                                        <Select.Option value={0}>Tất cả</Select.Option>
                                        <Select.Option value={1}>Chờ xác nhận</Select.Option>
                                        <Select.Option value={2}>Đã xác nhận</Select.Option>
                                        <Select.Option value={3}>Khiếu nại</Select.Option>
                                        <Select.Option value={4}>Người bán hoàn tiền</Select.Option>
                                        <Select.Option value={5}>Tranh chấp</Select.Option>
                                        <Select.Option value={6}>Từ chối khiếu nại</Select.Option>
                                        <Select.Option value={7}>Người bán vi phạm</Select.Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col offset={1}>
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
                    </Form>
                    <Row>
                        <Col offset={20}>
                            <Button className={cx('btn-export-excel')} onClick={handleExportExcel} icon={<FileExcelOutlined />} >
                                Xuất báo cáo
                            </Button>
                        </Col>
                    </Row>
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
                            x: 2000,
                        }}
                        size="middle"
                    />
                </Card>

            </Spinning>
        </>
    )
}

export default Orders;