import React, { useEffect, useState, useContext } from "react";
import { Card, Table, Select, Button, Form, Input, DatePicker, Tag, Row, Col, Space } from "antd";
import locale from 'antd/es/date-picker/locale/vi_VN';
import { Link } from "react-router-dom";
import {
    FileExcelOutlined
} from '@ant-design/icons';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWallet, faUserShield } from "@fortawesome/free-solid-svg-icons"
import * as ExcelJS from "exceljs"
import saveAs from "file-saver";

import NotificationContext from "~/context/UI/NotificationContext";

import {
    dowloadFileTransactionInternalReport
} from '~/api/storage'
import {
    getHistoryTransactionInternal,
    getDataReportTransactionInternal
} from '~/api/transactionInternal'

import Spinning from "~/components/Spinning";
import { formatPrice, ParseDateTime } from '~/utils/index'
import {
    RESPONSE_CODE_SUCCESS,
    PAGE_SIZE,
    TRANSACTION_TYPE_INTERNAL_PAYMENT,
    TRANSACTION_TYPE_INTERNAL_RECEIVE_PAYMENT,
    TRANSACTION_TYPE_INTERNAL_RECEIVE_REFUND,
    TRANSACTION_TYPE_INTERNAL_RECEIVE_PROFIT
} from "~/constants";


import classNames from 'classnames/bind';
import styles from './HistoryTransactionInternal.module.scss';
const cx = classNames.bind(styles);


const { RangePicker } = DatePicker;


const columns = [
    {
        title: 'Mã đơn hàng',
        dataIndex: 'orderId',
        width: '9%',
        render: (orderId,) => {
            return (
                <Link to={`/admin/order/${orderId}`}>{orderId}</Link>
            )
        }
    },
    {
        title: 'Email',
        dataIndex: 'email',
        width: '20%',
        render: (email, record) => {
            if (record.transactionInternalTypeId === TRANSACTION_TYPE_INTERNAL_RECEIVE_PROFIT) {
                return <><FontAwesomeIcon icon={faUserShield} /> <b>Administrator</b></>
            }
            return (
                <Link to={`/admin/user/${record.userId}`}>{email}</Link>
            )
        }
    },
    {
        title: 'Số tiền',
        dataIndex: 'paymentAmount',
        width: '15%',
        render: (paymentAmount, record) => {
            if (record.transactionInternalTypeId === TRANSACTION_TYPE_INTERNAL_PAYMENT) {
                return <span style={{ color: "#3b7be2" }}>+ {formatPrice(paymentAmount)}</span>
            } else if (record.transactionInternalTypeId === TRANSACTION_TYPE_INTERNAL_RECEIVE_PAYMENT) {
                return <span style={{ color: "#cf1322" }}>- {formatPrice(paymentAmount)}</span>
            } else if (record.transactionInternalTypeId === TRANSACTION_TYPE_INTERNAL_RECEIVE_REFUND) {
                return <span style={{ color: "#8c66c8" }}>- {formatPrice(paymentAmount)}</span>
            } else if (record.transactionInternalTypeId === TRANSACTION_TYPE_INTERNAL_RECEIVE_PROFIT) {
                return <span style={{ color: "#4ea927" }}> <FontAwesomeIcon icon={faWallet} /> {formatPrice(paymentAmount)}</span>
            }
        }
    },
    {
        title: 'Thời gian tạo',
        dataIndex: 'dateCreate',
        width: '15%',
        render: (dateCreate) => {
            return (
                <span>{ParseDateTime(dateCreate)}</span>
            )
        }
    },
    {
        title: 'Trạng thái',
        dataIndex: 'transactionInternalTypeId',
        width: '15%',
        render: (transactionInternalTypeId) => {
            if (transactionInternalTypeId === TRANSACTION_TYPE_INTERNAL_PAYMENT) {
                return <Tag color="#3b7be2">Thanh toán</Tag>
            } else if (transactionInternalTypeId === TRANSACTION_TYPE_INTERNAL_RECEIVE_PAYMENT) {
                return <Tag color="#cf1322">Nhận tiền hàng</Tag>
            } else if (transactionInternalTypeId === TRANSACTION_TYPE_INTERNAL_RECEIVE_REFUND) {
                return <Tag color="#8c66c8">Nhận tiền hoàn khiếu nại</Tag>
            } else if (transactionInternalTypeId === TRANSACTION_TYPE_INTERNAL_RECEIVE_PROFIT) {
                return <Tag color="#4ea927">Lợi nhuận</Tag>
            }
        }
    },
];

function HistoryTransactionInternal() {
    const notification = useContext(NotificationContext);
    const [loading, setLoading] = useState(true)

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
        email: '',
        fromDate: '',
        toDate: '',
        transactionInternalTypeId: 0,
        page: 1
    });
    const [totalRecord, setTotalRecord] = useState(0)

    useEffect(() => {
        setLoading(true)
        getHistoryTransactionInternal(searchData)
            .then((res) => {
                if (res.data.status.responseCode === RESPONSE_CODE_SUCCESS) {
                    setDataTable(res.data.result.transactionInternals)
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
                notification("error", "Chưa thể đáp ứng yêu cầu! Hãy thử lại!")
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
            name: 'email',
            value: searchData.email,
        },
        {
            name: 'transactionInternalTypeId',
            value: searchData.transactionInternalTypeId,
        },
    ];

    const onFinish = (values) => {
        setLoading(true);
        if (values.date === null) {
            notification("error", "Thời gian tạo yêu cầu không được trống!")
            setLoading(false);
            return;
        }

        setSearchData({
            orderId: values.orderId,
            email: values.email,
            fromDate: (values.date === undefined) ? '' : values.date[0].$d.toLocaleDateString(),
            toDate: (values.date === undefined) ? '' : values.date[1].$d.toLocaleDateString(),
            transactionInternalTypeId: values.transactionInternalTypeId,
            page: 1
        });
    };

    const onReset = () => {
        form.resetFields();
        form.setFieldsValue({
            orderId: '',
            email: '',
            transactionInternalTypeId: 0,
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
        getDataReportTransactionInternal(searchData)
            .then((response) => {
                var dataOrders = response.data.result
                dowloadFileTransactionInternalReport()
                    .then(res => {
                        const workbook = new ExcelJS.Workbook();
                        workbook.xlsx
                            .load(res.data)
                            .then(async () => {
                                const worksheet = workbook.getWorksheet(1);

                                //data search
                                const cellOrderId = worksheet.getCell('B4');
                                cellOrderId.value = searchData.orderId;

                                const cellCustomerEmail = worksheet.getCell('B5');
                                cellCustomerEmail.value = searchData.email;

                                const cellDate = worksheet.getCell('E4');
                                cellDate.value = searchData.fromDate + " - " + searchData.toDate;

                                const cellStatus = worksheet.getCell('E5');
                                cellStatus.value = searchData.status;

                                // data table
                                dataOrders.forEach((data) => {
                                    worksheet.addRow(
                                        [
                                            data.orderId,
                                            data.userId,
                                            (data.transactionInternalTypeId === TRANSACTION_TYPE_INTERNAL_RECEIVE_PROFIT ? "Admin" : data.email),
                                            data.paymentAmount,
                                            ParseDateTime(data.dateCreate),
                                            data.transactionInternalTypeId
                                        ]);
                                })
                                const bufferhe = await workbook.xlsx.writeBuffer();
                                saveAs(
                                    new Blob([bufferhe], { type: "application/octet-stream" }),
                                    "BaoCaoLichSuGiaoDichNoiBo.xlsx"
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
                        form={form}
                        onFinish={onFinish}
                        fields={initFormValues}
                    >
                        <Row>
                            <Col span={12}>
                                <Row >
                                    <Col span={6} offset={2}>Mã hóa đơn:</Col>
                                    <Col span={12}>
                                        <Form.Item name="orderId" >
                                            <Input />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Row >
                                    <Col span={6} offset={2}>Email:</Col>
                                    <Col span={12}>
                                        <Form.Item name="email" >
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
                                    <Col span={6} offset={2}>Trạng thái: </Col>
                                    <Col span={12}>
                                        <Form.Item name="transactionInternalTypeId" >
                                            <Select >
                                                <Select.Option value={0}>Tất cả</Select.Option>
                                                <Select.Option value={1}>Thanh toán</Select.Option>
                                                <Select.Option value={2}>Nhận tiền hàng</Select.Option>
                                                <Select.Option value={3}>Nhận tiền hoàn khiếu nại</Select.Option>
                                                <Select.Option value={4}>Lợi nhuận</Select.Option>
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
                                            <Button className={cx('btn-export-excel')} onClick={handleExportExcel} icon={<FileExcelOutlined />} >
                                                Xuất báo cáo
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
                        rowKey={(record, index) => index}
                        onChange={handleTableChange}
                        size="middle"
                    />
                </Card>
            </Spinning>
        </>
    )
}

export default HistoryTransactionInternal;



