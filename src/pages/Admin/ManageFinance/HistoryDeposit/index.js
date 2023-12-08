import React, { useEffect, useState, useContext } from "react";
import { Card, Table, Tag, Button, Form, Input, DatePicker, Row, Col, Space } from "antd";
import locale from 'antd/es/date-picker/locale/vi_VN';
import { Link } from "react-router-dom";
import {
    FileExcelOutlined
} from '@ant-design/icons';
import * as ExcelJS from "exceljs"
import saveAs from "file-saver";

import { NotificationContext } from '~/context/UI/NotificationContext';

import {
    getDepositTransaction,
    getDataReportDepositTransaction
} from '~/api/bank'
import {
    dowloadFileDepositTransactionReport
} from '~/api/storage'

import Spinning from "~/components/Spinning";
import { formatPrice, ParseDateTime } from '~/utils/index'
//import dayjs from 'dayjs';
import {
    RESPONSE_CODE_SUCCESS,
    PAGE_SIZE
} from "~/constants";

import classNames from 'classnames/bind';
import styles from './HistoryDeposit.module.scss';
const cx = classNames.bind(styles);

const { RangePicker } = DatePicker;


const columns = [
    {
        title: 'Mã giao dịch',
        dataIndex: 'depositTransactionId',
        width: '9%',
    },
    {
        title: 'Email người tạo yêu cầu',
        dataIndex: 'email',
        width: '20%',
        render: (email, record) => {
            return (
                <Link to={`/admin/user/${record.userId}`}>{email}</Link>
            )
        }
    },
    {
        title: 'Số tiền',
        dataIndex: 'amount',
        width: '15%',
        render: (amount) => {
            return (
                <span>{formatPrice(amount)}</span>
            )
        }
    },
    {
        title: 'Thời gian tạo yêu cầu',
        dataIndex: 'requestDate',
        width: '15%',
        render: (requestDate) => {
            return (
                <span>{ParseDateTime(requestDate)}</span>
            )
        }
    },
    {
        title: 'Thời gian chuyển khoản',
        dataIndex: 'paidDate',
        width: '15%',
        render: (paidDate, record) => {
            return (
                record.isPay ?
                    <span>{ParseDateTime(paidDate)}</span>
                    :
                    <span>TBD</span>
            )
        }
    },
    {
        title: 'Nội dung chuyển khoản',
        dataIndex: 'code',
        width: '15%',
    },
    {
        title: 'Trạng thái',
        dataIndex: 'isPay',
        width: '15%',
        render: (paidDate, record) => {
            return (
                record.isPay ?
                    <Tag color="#52c41a">Thành công</Tag>
                    :
                    <Tag color="#ec0b0b">Đang chờ chuyển khoản</Tag>
            )
        }
    },
];

function HistoryDeposit() {
    const [loading, setLoading] = useState(true)
    const notification = useContext(NotificationContext);

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
        depositTransactionId: '',
        email: '',
        // fromDate: dayjs().subtract(3, 'day').format('M/D/YYYY'),
        // toDate: dayjs().format('M/D/YYYY'),
        fromDate: '',
        toDate: '',
        page: 1
    });
    const [totalRecord, setTotalRecord] = useState(0)

    useEffect(() => {
        setLoading(true)
        getDepositTransaction(searchData)
            .then((res) => {
                if (res.data.status.responseCode === RESPONSE_CODE_SUCCESS) {
                    setDataTable(res.data.result.depositTransactions)
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
            name: 'depositTransactionId',
            value: searchData.depositTransactionId,
        },
        {
            name: 'email',
            value: searchData.email,
        },
        // {
        //     name: 'date',
        //     value: [dayjs(searchData.fromDate, 'M/D/YYYY'), dayjs(searchData.toDate, 'M/D/YYYY')]
        // },
    ];

    const onFinish = (values) => {
        setLoading(true);
        if (values.date === null) {
            notification("error", "Thời gian tạo yêu cầu không được trống!")
            setLoading(false);
            return;
        }

        setSearchData({
            depositTransactionId: values.depositTransactionId,
            email: values.email,
            fromDate: (values.date === undefined) ? '' : values.date[0].$d.toLocaleDateString(),
            toDate: (values.date === undefined) ? '' : values.date[1].$d.toLocaleDateString(),
            //fromDate: values.date[0].$d.toLocaleDateString(),
            //toDate: values.date[1].$d.toLocaleDateString(),
            page: 1
        });
    };

    const onReset = () => {
        form.resetFields();
        form.setFieldsValue({
            depositTransactionId: '',
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
        getDataReportDepositTransaction(searchData)
            .then((response) => {
                var dataOrders = response.data.result
                dowloadFileDepositTransactionReport()
                    .then(res => {
                        const workbook = new ExcelJS.Workbook();
                        workbook.xlsx
                            .load(res.data)
                            .then(async () => {
                                const worksheet = workbook.getWorksheet(1);

                                //data search
                                const cellWithdrawTransactionId = worksheet.getCell('B4');
                                cellWithdrawTransactionId.value = searchData.depositTransactionId;

                                const cellCustomerEmail = worksheet.getCell('E4');
                                cellCustomerEmail.value = searchData.email;

                                const cellRequestDate = worksheet.getCell('B5');
                                cellRequestDate.value = searchData.fromDate + " - " + searchData.toDate;

                                // data table
                                dataOrders.forEach((data) => {
                                    worksheet.addRow(
                                        [
                                            data.depositTransactionId,
                                            data.userId,
                                            data.email,
                                            data.amount,
                                            ParseDateTime(data.requestDate),
                                            ParseDateTime(data.paidDate),
                                            data.code,
                                            "Thành công",
                                        ]);
                                })
                                const bufferhe = await workbook.xlsx.writeBuffer();
                                saveAs(
                                    new Blob([bufferhe], { type: "application/octet-stream" }),
                                    "BaoCaoLichSuNapTien.xlsx"
                                );
                            })
                            .catch((error) => {
                                console.error(error);
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
                                <Row>
                                    <Col span={6} offset={2}>Mã giao dịch:</Col>
                                    <Col span={12}>
                                        <Form.Item name="depositTransactionId" >
                                            <Input />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col span={6} offset={2}>Thời gian tạo yêu cầu:</Col>
                                    <Col span={12}>
                                        <Form.Item name="date" >
                                            <RangePicker locale={locale}
                                                format={"M/D/YYYY"}
                                                placement={"bottomLeft"} />
                                        </Form.Item>
                                    </Col>
                                </Row>
                            </Col>

                            <Col span={12}>
                                <Row >
                                    <Col span={6} offset={2}>Email:</Col>
                                    <Col span={12}>
                                        <Form.Item name="email" >
                                            <Input />
                                        </Form.Item>
                                    </Col>
                                </Row>

                                <Row>
                                    <Col offset={14}>
                                        <Space direction="vertical">
                                            <Space>
                                                <Button htmlType="button" onClick={onReset}>
                                                    Xóa
                                                </Button>
                                                <Button type="primary" htmlType="submit">
                                                    Tìm kiếm
                                                </Button>

                                            </Space>
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
                    {(() => {
                        if (totalRecord > PAGE_SIZE) {
                            return (
                                <Row align="end">
                                    <b>{totalRecord} Kết quả</b>
                                </Row>
                            )
                        } else {
                            return <></>
                        }
                    })()}
                    <Table
                        columns={columns}
                        pagination={tableParams.pagination}
                        dataSource={dataTable}
                        rowKey={(record) => record.depositTransactionId}
                        onChange={handleTableChange}
                        size="middle"
                    />
                </Card>
            </Spinning>
        </>
    )
}

export default HistoryDeposit;