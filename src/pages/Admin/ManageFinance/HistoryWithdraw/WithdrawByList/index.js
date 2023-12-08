import React, { useEffect, useState } from "react";
import { Card, Table, Tag, Button, Form, Input, Space, notification, Modal, Divider, Row, Col, Select, DatePicker } from "antd";
import locale from 'antd/es/date-picker/locale/vi_VN';

import { Link } from "react-router-dom";
import {
    DeleteOutlined,
    DownloadOutlined,
    CheckCircleOutlined
} from '@ant-design/icons';
import dayjs from 'dayjs';

import Spinning from "~/components/Spinning";
import {
    formatPrice,
    ParseDateTime,
} from '~/utils/index'
import BackPreviousPage from "~/components/BackPreviousPage";
import * as ExcelJS from "exceljs"
import saveAs from "file-saver";
import { dowloadFileWithdrawByList } from '~/api/storage'
import {
    MB_BANK_TRANFER_BY_LIST_EXCEL_FILE_NAME,
    RESPONSE_CODE_SUCCESS, RESPONSE_CODE_BANK_WITHDRAW_PAID,
    RESPONSE_CODE_FAILD,
    RESPONSE_CODE_DATA_NOT_FOUND,
    BANKS_INFO
} from '~/constants'
import {
    confirmListTransferWithdrawSuccess,
    getAllWithdrawUnPay
} from '~/api/bank'
import styles from '../HistoryWithdraw.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);
const { RangePicker } = DatePicker;


const bankOptions = [{ value: 0, name: "All", label: <>Tất cả</> }]
BANKS_INFO.forEach((bank) => {
    let bankOption = {
        value: bank.id,
        name: bank.name,
        label: <div><img src={bank.image} className={cx("option-images-display")} alt={bank.name} /> <p className={cx("option-text-display")}>{bank.name}</p></div>
    }
    bankOptions.push(bankOption)
})

const filterOptions = (inputValue, option) => {
    return option.props.name.toLowerCase().indexOf(inputValue.toLowerCase()) !== -1;
}


function WithdrawByList() {

    const columns = [
        {
            title: 'Mã giao dịch',
            with: "5%",
            dataIndex: 'withdrawTransactionId',
        },
        {
            title: 'Email người tạo yêu cầu',
            dataIndex: 'email',
            with: "12%",
            render: (email, record) => {
                return (
                    <Link to={`/admin/user/${record.userId}`}>{email}</Link>
                )
            }
        },
        {
            title: 'Số tiền',
            dataIndex: 'amount',
            render: (amount) => {
                return (
                    <span>{formatPrice(amount)}</span>
                )
            }
        },
        {
            title: 'Thời gian tạo yêu cầu',
            dataIndex: 'requestDate',
            render: (requestDate) => {
                return (
                    <span>{ParseDateTime(requestDate)}</span>
                )
            }
        },
        {
            title: 'Đơn vị thụ hưởng',
            dataIndex: 'creditAccountName',
        },
        {
            title: 'Số tài khoản',
            dataIndex: 'creditAccount',
        },
        {
            title: 'Ngân hàng đối tác',
            dataIndex: 'bankName',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'isPay',
            render: (paidDate, record) => {
                return (
                    record.isPay ?
                        <Tag color="#52c41a">Thành công</Tag>
                        :
                        <Tag color="#ecc30b">Chưa xử lý</Tag>
                )
            }
        },
        {
            title: '',
            dataIndex: 'withdrawTransactionId',
            fixed: "right",
            width: "5%",
            render: (withdrawTransactionId, record) => {
                return (
                    <Button type="primary" danger onClick={() => handleOpenModalRemoveRecord(withdrawTransactionId)} ><DeleteOutlined /></Button>
                )
            }
        },

    ];
    const [loading, setLoading] = useState(true)
    const [api, contextHolder] = notification.useNotification();
    const openNotification = (type, message) => {
        api[type]({
            message: `Thông báo`,
            description: `${message}`
        });
    };



    const [form] = Form.useForm();
    const [openModal, setOpenModal] = useState(false);
    const [loadingBtnConfirmModal, setLoadingBtnConfirmModal] = useState(false)

    const [recordRemove, setRecordRemove] = useState(0)
    const [openModalRemoveRecord, setOpenModalRemoveRecord] = useState(false)

    const [openModalRemoveRecords, setOpenModalRemoveRecords] = useState(false)

    const [dataTable, setDataTable] = useState([]);
    const [dataTableView, setDataTableView] = useState([]);
    const [listRecordSelected, setListRecordSelected] = useState([]);

    const rowSelection = {
        onChange: (selectedRowKeys, selectedRows) => {
            setListRecordSelected([...selectedRows])
        },
    };

    /*
    const location = useLocation();
    useEffect(() => {
        if (location.state === null) {
            alert("Xảy ra sự cố! Hãy thử lại sau!");
        }
        setTimeout(() => {
            setDataTable(location.state.dataTable)
            setDataTableView(location.state.dataTable)
            setLoading(false)
        }, 500)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])
    */

    useEffect(() => {
        const body = {
            withdrawTransactionId: '',
            email: '',
            fromDate: '',
            toDate: '',
            bankId: 0,
            creditAccount: '',
        }
        getAllWithdrawUnPay(body)
            .then((res) => {
                setDataTable(res.data.result)
                setDataTableView(res.data.result)
            })
        setTimeout(() => {

            setLoading(false)
        }, 500)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const onFinish = (values) => {
        let data = dataTable;
        if (values.withdrawTransactionId !== undefined) {
            data = data.filter((x) => String(x.withdrawTransactionId) === values.withdrawTransactionId)
        }
        if (values.email !== undefined) {
            data = data.filter((x) => x.email.includes(values.email))
        }
        if (values.creditAccountName !== undefined) {
            data = data.filter((x) => x.creditAccountName.includes(values.creditAccountName))
        }
        if (values.creditAccount !== undefined) {
            data = data.filter((x) => x.creditAccount.includes(values.creditAccount))
        }
        if (values.date !== undefined) {
            var startDate = dayjs(values.date[0].$d)
            var endDate = dayjs(values.date[1].$d)
            data = data.filter((x) => dayjs(x.requestDate) >= startDate && dayjs(x.requestDate) <= endDate)
        }
        setDataTableView(data)
    };

    const onReset = () => {
        form.resetFields();
        setDataTableView(dataTable)
    };

    const handleOpenModal = (record) => {
        setLoading(true)
        setTimeout(() => {
            setLoading(false)
            setOpenModal(true)
        }, 300)
    }

    const handleOpenModalRemoveRecord = (withdrawTransactionId) => {
        setRecordRemove(withdrawTransactionId)
        setOpenModalRemoveRecord(true)
    }

    const handleRemoveRecord = () => {
        var data = dataTable.filter((x) => x.withdrawTransactionId !== recordRemove)
        var dataView = dataTableView.filter((x) => x.withdrawTransactionId !== recordRemove)
        var selectedRecords = listRecordSelected.filter((x) => x.withdrawTransactionId !== recordRemove)
        setDataTable(data)
        setDataTableView(dataView)
        setListRecordSelected(selectedRecords)
        setOpenModalRemoveRecord(false)
    }

    const handleOpenModalRemoveRecords = (record) => {
        setLoading(true)
        setTimeout(() => {
            setLoading(false)
            setOpenModalRemoveRecords(true)
        }, 300)
    }

    const handleRemoveRecords = () => {
        var arr = GetListSelectedWithdrawKey()
        var data = dataTable.filter((x) => !arr.includes(x.withdrawTransactionId))
        var selectedRecords = listRecordSelected.filter((x) => !arr.includes(x.withdrawTransactionId))
        setDataTable(data)
        setDataTableView(data)
        setListRecordSelected(selectedRecords)
        setListRecordSelected([])
        setOpenModalRemoveRecords(false)
    }

    const GetListSelectedWithdrawKey = () => {
        var arr = [];
        listRecordSelected.forEach(x => {
            arr.push(x.withdrawTransactionId)
        })
        return arr;
    }

    const handleDownLoadFile = () => {
        setLoading(true)
        dowloadFileWithdrawByList()
            .then(res => {
                const workbook = new ExcelJS.Workbook();
                workbook.xlsx
                    .load(res.data)
                    .then(async () => {
                        const worksheet = workbook.getWorksheet(1);
                        listRecordSelected.forEach((data) => {
                            worksheet.addRow([data.key, data.creditAccount, data.creditAccountName, data.bankName, data.amount, data.code]);
                        })
                        const bufferhe = await workbook.xlsx.writeBuffer();
                        saveAs(
                            new Blob([bufferhe], { type: "application/octet-stream" }),
                            MB_BANK_TRANFER_BY_LIST_EXCEL_FILE_NAME
                        );
                    })
                    .catch((error) => {
                        console.error(error.message);
                    });
                setTimeout(() => {
                    setOpenModal(true)
                }, 500)
            })
            .catch(() => {
                openNotification("error", "Hệ thống đang gặp sự cố! Vui lòng thử lại sau!")
            })
            .finally(() => {
                setTimeout(() => setLoading(false), 500)
            })
    };


    const handleConfirmTransfer = () => {
        setLoadingBtnConfirmModal(true)
        var data = GetListSelectedWithdrawKey()
        confirmListTransferWithdrawSuccess({ ids: data })
            .then(res => {
                if (res.data.status.responseCode === RESPONSE_CODE_SUCCESS) {
                    //update UI
                    data = dataTable.filter((x) => !data.includes(x.withdrawTransactionId))
                    setDataTable(data)
                    setDataTableView(data)
                    setListRecordSelected([])
                    openNotification("success", "Xác nhận chuyển khoản thành công!")
                } else if (res.data.status.responseCode === RESPONSE_CODE_BANK_WITHDRAW_PAID) {
                    openNotification("error", `Mã hóa đơn này đã được xác nhận trước đó!`)
                } else if (res.data.status.responseCode === RESPONSE_CODE_DATA_NOT_FOUND) {
                    openNotification("error", `Mã hóa đơn không tồn tại!`)
                } else if (res.data.status.responseCode === RESPONSE_CODE_FAILD) {
                    openNotification("error", "Hệ thống đang gặp sự cố! Vui lòng thử lại sau!")
                }
            })
            .catch(() => {
                openNotification("error", "Hệ thống đang gặp sự cố! Vui lòng thử lại sau!")
            })
            .finally(() => {
                setTimeout(() => {
                    setLoadingBtnConfirmModal(false)
                    setOpenModal(false)
                }, 500)
            })
    }



    return (
        <>
            {contextHolder}
            <Spinning spinning={loading}>
                <Card>
                    <Form
                        form={form}
                        onFinish={onFinish}
                    >
                        <Row>
                            <Col span={3} offset={1}>Mã giao dịch: </Col>
                            <Col span={6}>
                                <Form.Item name="withdrawTransactionId" >
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={2} offset={1}>Ngân hàng: </Col>
                            <Col span={6}>
                                <Form.Item name="bankId" >
                                    <Select
                                        showSearch
                                        placeholder="Ngân hàng thụ hưởng"
                                        optionFilterProp="children"
                                        Select={Select}
                                        options={bankOptions}
                                        filterOption={filterOptions}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row>
                            <Col span={3} offset={1}>Email người tạo yêu cầu: </Col>
                            <Col span={6}>
                                <Form.Item name="email" >
                                    <Input />
                                </Form.Item>
                            </Col>

                            <Col span={2} offset={1}>Số tài khoản: </Col>
                            <Col span={6}>
                                <Form.Item name="creditAccount" >
                                    <Input />
                                </Form.Item>
                            </Col>

                        </Row>

                        <Row>
                            <Col span={3} offset={1}>Thời gian tạo yêu cầu: </Col>
                            <Col span={6}>
                                <Form.Item name="date" >
                                    <RangePicker locale={locale}
                                        format={"M/D/YYYY"}
                                        placement={"bottomLeft"} />
                                </Form.Item>
                            </Col>

                            <Col span={2} offset={1}>Người thụ hưởng </Col>
                            <Col span={6}>
                                <Form.Item name="creditAccountName" >
                                    <Input />
                                </Form.Item>
                            </Col>

                            <Col offset={1} span={1}>
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
                </Card>

                <Card style={{ marginTop: "20px", minHeight: "80vh" }}>
                    <Row align="end">
                        <b>{dataTableView.length} Kết quả</b>
                    </Row>
                    <Table
                        columns={columns}
                        dataSource={dataTableView}
                        rowKey={(record) => record.withdrawTransactionId}
                        size="small"
                        pagination={{
                            pageSize: 100000,
                            showSizeChanger: false
                        }}
                        rowSelection={{
                            type: "checkbox",
                            ...rowSelection,
                        }}
                    />
                </Card>
                <Space direction="horizontal" style={{ width: '100%', justifyContent: 'end', marginTop: "10px" }}>
                    <Button
                        type="primary"
                        size="large"
                        onClick={handleOpenModal}
                        disabled={listRecordSelected.length === 0}
                    >
                        <CheckCircleOutlined /> Xác nhận đã chuyển khoản ({listRecordSelected.length})
                    </Button>
                    <Button
                        size="large"
                        danger
                        onClick={handleOpenModalRemoveRecords}
                        disabled={listRecordSelected.length === 0}
                    >
                        <DeleteOutlined />Xóa ({listRecordSelected.length})
                    </Button>
                    <Button
                        size="large"
                        onClick={handleDownLoadFile}
                        disabled={listRecordSelected.length === 0}
                    >
                        <DownloadOutlined /> Tải file ({listRecordSelected.length})
                    </Button>
                    <BackPreviousPage url={-1} />
                </Space>

            </Spinning>

            <Modal
                title="Chú ý"
                open={openModalRemoveRecord}
                onCancel={() => setOpenModalRemoveRecord(false)}
                onOk={handleRemoveRecord}
                width={500}
                okText="Đồng ý"
                cancelText="Hủy"
            >
                <Divider />
                <p>Bạn có chắc chắn muốn xóa bản ghi đó không ?</p>
            </Modal>

            <Modal
                title="Chú ý"
                open={openModalRemoveRecords}
                onCancel={() => setOpenModalRemoveRecords(false)}
                onOk={handleRemoveRecords}
                width={500}
                okText="Đồng ý"
                cancelText="Hủy"
            >
                <Divider />
                <p>Bạn có chắc chắn muốn các xóa bản ghi đó không ?</p>
            </Modal>

            <Modal
                title="Chú ý"
                open={openModal}
                onCancel={() => setOpenModal(false)}
                width={500}
                footer={[
                    <Button key="back" onClick={() => setOpenModal(false)}>
                        Hủy
                    </Button>,
                    <Button key="submit" type="primary" loading={loadingBtnConfirmModal} onClick={() => handleConfirmTransfer()}>
                        Xác nhận đã chuyển khoản
                    </Button>,
                ]}
            >
                Bạn đã có chắn rằng đã chuyển khoản thành công?
            </Modal>
        </>
    )
}

export default WithdrawByList;