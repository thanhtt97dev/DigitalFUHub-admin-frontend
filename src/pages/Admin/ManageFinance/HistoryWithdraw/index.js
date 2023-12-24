import React, { useEffect, useState } from "react";
import { Card, Table, Tag, Button, Form, Input, DatePicker, Select, Modal, Divider, Row, Col, Space, notification } from "antd";
import locale from 'antd/es/date-picker/locale/vi_VN';
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
    SwapOutlined,
    FileExcelOutlined
} from '@ant-design/icons';
import * as ExcelJS from "exceljs"
import saveAs from "file-saver";

import {
    getWithdrawTransaction,
    confirmTransferWithdrawSuccess,
    getDataReportWithdrawTransaction
} from '~/api/bank'

import {
    dowloadFileWithdrawReport
} from '~/api/storage'
import Spinning from "~/components/Spinning";
import {
    formatPrice,
    ParseDateTime,
    getVietQrImgSrc,
    getBankName,
    getWithdrawTransactionStatus,
    sliceText
} from '~/utils/index'
import {
    RESPONSE_CODE_BANK_WITHDRAW_PAID,
    RESPONSE_CODE_SUCCESS,
    WITHDRAW_TRANSACTION_IN_PROCESSING,
    WITHDRAW_TRANSACTION_PAID,
    WITHDRAW_TRANSACTION_REJECT,
    WITHDRAW_TRANSACTION_CANCEL,
    PAGE_SIZE,
    BANKS_INFO
} from "~/constants";
import DrawerWithdrawTransactionBill from "~/components/Drawers/DrawerWithdrawTransactionBill";

import classNames from 'classnames/bind';
import ModalRejectWithdrawTransaction from "~/components/Modals/ModalRejectWithdrawTransaction";

import styles from './HistoryWithdraw.module.scss';
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

function HistoryWithdraw() {

    const columns = [
        {
            title: 'Mã giao dịch',
            dataIndex: 'withdrawTransactionId',
            width: '7%',
        },
        {
            title: 'Email người tạo yêu cầu',
            dataIndex: 'email',
            width: '15%',
            render: (email, record) => {
                return (
                    <Link to={`/admin/user/${record.userId}`}>{sliceText(email, 25)}</Link>
                )
            }
        },
        {
            title: 'Số tiền',
            dataIndex: 'amount',
            width: '10%',
            render: (amount) => {
                return (
                    <span>{formatPrice(amount)}</span>
                )
            }
        },
        {
            title: 'Thời gian yêu cầu',
            dataIndex: 'requestDate',
            width: '10%',
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
            render: (paidDate) => {
                if (paidDate === null) {
                    return "N/A"
                } else {
                    return <span>{ParseDateTime(paidDate)}</span>
                }
            }
        },
        {
            title: 'Đơn vị thụ hưởng',
            dataIndex: 'creditAccountName',
            width: '10%',
            render: (creditAccountName) => {
                return (
                    <span>{sliceText(creditAccountName, 15)}</span>
                )
            }
        },
        {
            title: 'Số tài khoản',
            dataIndex: 'creditAccount',
            width: '10%',
            render: (creditAccount) => {
                return (
                    <span>{creditAccount}</span>
                )
            }
        },
        {
            title: 'Ngân hàng đối tác',
            dataIndex: 'bankName',
            width: '14%',
            render: (bankName) => {
                return (
                    <span>{sliceText(bankName, 20)}</span>
                )
            }

        },
        {
            title: 'Trạng thái',
            dataIndex: 'withdrawTransactionStatusId',
            width: '6%',
            fixed: "right",
            render: (withdrawTransactionStatusId, record) => {
                if (withdrawTransactionStatusId === WITHDRAW_TRANSACTION_IN_PROCESSING) {
                    return <Tag color="#ecc30b">Chưa xử lý</Tag>
                } else if (withdrawTransactionStatusId === WITHDRAW_TRANSACTION_PAID) {
                    return <Tag color="#52c41a">Thành công</Tag>
                } else if (withdrawTransactionStatusId === WITHDRAW_TRANSACTION_REJECT) {
                    return <Tag color="red">Từ chối</Tag>
                } else if (withdrawTransactionStatusId === WITHDRAW_TRANSACTION_CANCEL) {
                    return <Tag color="gray">Đã hủy</Tag>
                }
            }
        },
        {
            title: '',
            dataIndex: 'withdrawTransactionStatusId',
            width: '7%',
            fixed: "right",
            render: (withdrawTransactionStatusId, record) => {
                if (withdrawTransactionStatusId === WITHDRAW_TRANSACTION_PAID ||
                    withdrawTransactionStatusId === WITHDRAW_TRANSACTION_REJECT) {
                    return <DrawerWithdrawTransactionBill userId={record.userId} withdrawTransactionId={record.withdrawTransactionId} />
                } else if (withdrawTransactionStatusId === WITHDRAW_TRANSACTION_IN_PROCESSING) {
                    return (
                        <Space direction="horizontal" align="center">
                            <Button onClick={() => handleOpenModal(record)} size="small">Chuyển khoản</Button>
                            <ModalRejectWithdrawTransaction withdrawTransactionId={record.withdrawTransactionId} callBack={GetWithdrawTransactions} />
                        </Space>
                    )
                } else {
                    return <></>
                }
            }
        },

    ];

    const [api, contextHolder] = notification.useNotification();
    const openNotification = (type, message) => {
        api[type]({
            message: `Thông báo`,
            description: `${message}`
        });
    };
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true)
    const location = useLocation();
    const [form] = Form.useForm();
    const [openModal, setOpenModal] = useState(false);
    const [qrCode, setQrCode] = useState("");
    const [dataModal, setDataModal] = useState({})
    const [loadingBtnConfirmModal, setLoadingBtnConfirmModal] = useState(false)


    const [dataTable, setDataTable] = useState([]);
    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: PAGE_SIZE,
            showSizeChanger: false
        },
    });
    const [searchData, setSearchData] = useState({
        withdrawTransactionId: '',
        email: '',
        fromDate: '',
        toDate: '',
        bankId: 0,
        creditAccount: '',
        status: location?.state?.status ? location?.state?.status : 0,
        page: 1
    });
    const [totalRecord, setTotalRecord] = useState(0)

    const filterOptions = (inputValue, option) => {
        return option.props.name.toLowerCase().indexOf(inputValue.toLowerCase()) !== -1;
    }

    useEffect(() => {
        setLoading(true)
        GetWithdrawTransactions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchData])

    const GetWithdrawTransactions = () => {
        getWithdrawTransaction(searchData)
            .then((res) => {
                if (res.data.status.responseCode === RESPONSE_CODE_SUCCESS) {
                    setDataTable(res.data.result.withdrawTransactions)
                    setTableParams({
                        ...tableParams,
                        pagination: {
                            ...tableParams.pagination,
                            total: res.data.result.total,
                        },
                    });
                    setTotalRecord(res.data.result.total)
                } else {
                    openNotification("error", "Đang có chút sự cố! Hãy vui lòng thử lại!")
                }
            })
            .catch((err) => {
                openNotification("error", "Chưa thể đáp ứng yêu cầu! Hãy thử lại!")
            })
            .finally(() => {
                setTimeout(() => { setLoading(false) }, 500)
            })
    }

    const initFormValues = [
        {
            name: 'withdrawTransactionId',
            value: searchData.withdrawTransactionId,
        },
        {
            name: 'email',
            value: searchData.email,
        },
        {
            name: 'bankId',
            value: searchData.bankId
        },
        {
            name: 'creditAccount',
            value: searchData.creditAccount
        },
        {
            name: 'status',
            value: searchData.status
        },
    ];

    const onFinish = (values) => {
        setLoading(true);
        if (values.date === null) {
            openNotification("error", "Thời gian tạo yêu cầu không được trống!")
            setLoading(false);
            return;
        }

        setSearchData({
            withdrawTransactionId: values.withdrawTransactionId,
            email: values.email,
            fromDate: (values.date === undefined) ? '' : values.date[0].$d.toLocaleDateString(),
            toDate: (values.date === undefined) ? '' : values.date[1].$d.toLocaleDateString(),
            bankId: values.bankId,
            creditAccount: values.creditAccount,
            status: values.status,
            page: 1
        });
    };

    const onReset = () => {
        form.resetFields();
        form.setFieldsValue({
            depositTransactionId: '',
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

    const handleOpenModal = (record) => {
        setLoading(true)
        setDataModal(record)
        setTimeout(() => {
            setLoading(false)
            setOpenModal(true)
            setQrCode(getVietQrImgSrc(record.bankCode, record.creditAccount, record.creditAccountName, record.amount, record.code))
        }, 1000)
    }

    const handleConfirmTransfer = (withdrawTransactionId) => {
        setLoadingBtnConfirmModal(true)
        confirmTransferWithdrawSuccess({ id: withdrawTransactionId })
            .then((res) => {
                if (res.data.status.responseCode === RESPONSE_CODE_SUCCESS) {
                    //render UI
                    let newDataTable = dataTable;
                    var index = dataTable.findIndex((x) => x.withdrawTransactionId === withdrawTransactionId)
                    newDataTable[index].withdrawTransactionStatusId = WITHDRAW_TRANSACTION_PAID
                    setDataTable(newDataTable)
                    openNotification("success", "Xác nhận chuyển khoản thành công!")
                } else if (res.data.status.responseCode === RESPONSE_CODE_BANK_WITHDRAW_PAID) {
                    openNotification("error", `Mã hóa đơn này đã được xác nhận trước đó!`)
                }

            })
            .catch(() => {
                openNotification("error", "Hệ thống đang gặp sự cố! Vui lòng thử lại sau!")
            })
            .finally(() => {
                setLoadingBtnConfirmModal(false)
                setOpenModal(false)
            })

    }

    const handleNavigateToWithdrawByList = () => {
        let dataTableRecordsUnPay = dataTable.filter(x => x.withdrawTransactionStatusId === WITHDRAW_TRANSACTION_IN_PROCESSING);
        return navigate("tranfer-bylist", { state: { dataTable: dataTableRecordsUnPay } })
    }

    const handleExportExcel = () => {
        setLoading(true);
        getDataReportWithdrawTransaction(searchData)
            .then((response) => {
                var dataOrders = response.data.result
                dowloadFileWithdrawReport()
                    .then(res => {
                        const workbook = new ExcelJS.Workbook();
                        workbook.xlsx
                            .load(res.data)
                            .then(async () => {
                                const worksheet = workbook.getWorksheet(1);

                                //data search
                                const cellWithdrawTransactionId = worksheet.getCell('B4');
                                cellWithdrawTransactionId.value = searchData.withdrawTransactionId;

                                const cellCustomerEmail = worksheet.getCell('B5');
                                cellCustomerEmail.value = searchData.email;

                                const cellRequestDate = worksheet.getCell('B6');
                                cellRequestDate.value = searchData.fromDate + " - " + searchData.toDate;

                                const cellBank = worksheet.getCell('E4');
                                cellBank.value = getBankName(searchData.bankId);

                                const cellCreditAccount = worksheet.getCell('E5');
                                cellCreditAccount.value = searchData.creditAccount;

                                const cellStatus = worksheet.getCell('E6');
                                cellStatus.value = getWithdrawTransactionStatus(searchData.status);

                                // data table
                                dataOrders.forEach((data) => {
                                    worksheet.addRow(
                                        [
                                            data.withdrawTransactionId,
                                            data.userId,
                                            data.email,
                                            data.amount,
                                            ParseDateTime(data.requestDate),
                                            data.paidDate === null ? "N/A" : ParseDateTime(data.paidDate),
                                            data.creditAccountName,
                                            data.creditAccount,
                                            data.bankName,
                                            getWithdrawTransactionStatus(data.withdrawTransactionStatusId),
                                        ]);
                                })
                                const bufferhe = await workbook.xlsx.writeBuffer();
                                saveAs(
                                    new Blob([bufferhe], { type: "application/octet-stream" }),
                                    "BaoCaoLichSuRutTien.xlsx"
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
            {contextHolder}
            <Spinning spinning={loading}>
                <Card>
                    <Form
                        form={form}
                        onFinish={onFinish}
                        fields={initFormValues}
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

                            <Col span={2} offset={1}>Trạng thái: </Col>
                            <Col span={6}>
                                <Form.Item name="status" >
                                    <Select >
                                        <Select.Option value={0}>Tất cả</Select.Option>
                                        <Select.Option value={WITHDRAW_TRANSACTION_IN_PROCESSING}>Chưa xử lý	</Select.Option>
                                        <Select.Option value={WITHDRAW_TRANSACTION_PAID}>Thành công</Select.Option>
                                        <Select.Option value={WITHDRAW_TRANSACTION_REJECT}>Từ chối</Select.Option>
                                        <Select.Option value={WITHDRAW_TRANSACTION_CANCEL}>Đã hủy</Select.Option>
                                    </Select>
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


                    <Row>
                        <Col offset={1} span={11}>
                            <Button type="primary" onClick={handleNavigateToWithdrawByList}>
                                <SwapOutlined /> Chuyển khoản theo lô
                            </Button>
                        </Col>

                        <Col offset={8}>
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
                        rowKey={(record) => record.withdrawTransactionId}
                        onChange={handleTableChange}
                        scroll={{
                            x: 1500,
                        }}
                        size="small"
                    />
                </Card>
            </Spinning>

            <Modal
                title="Chuyển khoản"
                centered
                open={openModal}
                onOk={() => handleConfirmTransfer(dataModal.withdrawTransactionId)}
                onCancel={() => setOpenModal(false)}
                width={500}
                footer={[
                    <Button key="back" onClick={() => setOpenModal(false)}>
                        Hủy
                    </Button>,
                    <Button key="submit" type="primary" loading={loadingBtnConfirmModal} onClick={() => handleConfirmTransfer(dataModal.withdrawTransactionId)}>
                        Xác nhận đã chuyển khoản
                    </Button>,
                ]}
            >
                <Divider />
                <div className={cx("modal-container")}>
                    <img src={qrCode} alt="payment" className={cx("qr-image")} />
                    <div>
                        <p><b>Người thụ hưởng: </b>{dataModal.creditAccountName}</p>
                        <p><b>Số tài khoản: </b>{dataModal.creditAccount}</p>
                        <p><b>Ngân hàng: </b>{dataModal.bankName}</p>
                        <p><b>Số tiền: </b>{dataModal.amount}</p>
                    </div>
                    <div className={cx("warning")}>
                        <h3>Lưu ý:</h3>
                        <p>- Khi chuyển khoản thành công hãy bấm "Xác nhận đã chuyển khoản"</p>
                        <p>- Trong trường hợp bạn chưa chuyển khoản hãy bấm "Hủy bỏ"</p>
                    </div>
                </div>
            </Modal>
        </>
    )
}

export default HistoryWithdraw;