import React, { useEffect, useState, useContext } from "react";
import { Card, Table, Tag, Button, Form, Input, DatePicker, Select, Modal, Divider, Row, Col, Space } from "antd";
import locale from 'antd/es/date-picker/locale/vi_VN';
import dayjs from 'dayjs';
import { Link, useNavigate } from "react-router-dom";
import {
    SwapOutlined
} from '@ant-design/icons';

import { getWithdrawTransaction, confirmTransferWithdrawSuccess } from '~/api/bank'
import Spinning from "~/components/Spinning";
import { formatPrice, ParseDateTime, getVietQrImgSrc } from '~/utils/index'
import {
    RESPONSE_CODE_BANK_WITHDRAW_PAID,
    RESPONSE_CODE_SUCCESS,
    WITHDRAW_TRANSACTION_IN_PROCESSING,
    WITHDRAW_TRANSACTION_PAID,
    WITHDRAW_TRANSACTION_REJECT,
    BANKS_INFO
} from "~/constants";
import DrawerWithdrawTransactionBill from "~/components/Drawers/DrawerWithdrawTransactionBill";
import NotificationContext from "~/context/UI/NotificationContext";

import classNames from 'classnames/bind';
import styles from './HistoryWithdraw.module.scss';
import ModalRejectWithdrawTransaction from "~/components/Modals/ModalRejectWithdrawTransaction";

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
            width: '4%',
        },
        {
            title: 'Email người tạo yêu cầu',
            dataIndex: 'email',
            width: '15%',
            render: (email, record) => {
                return (
                    <Link to={`/admin/user/${record.userId}`}>{email}</Link>
                )
            }
        },
        {
            title: 'Số tiền',
            dataIndex: 'amount',
            width: '10%',
            render: (amount) => {
                return (
                    <p>{formatPrice(amount)}</p>
                )
            }
        },
        {
            title: 'Thời gian tạo yêu cầu',
            dataIndex: 'requestDate',
            width: '12%',
            render: (requestDate) => {
                return (
                    <p>{ParseDateTime(requestDate)}</p>
                )
            }
        },
        {
            title: 'Số tài khoản',
            dataIndex: 'creditAccount',
            width: '12%',
        },
        {
            title: 'Ngân hàng đối tác',
            dataIndex: 'bankName',
            width: '14%',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'withdrawTransactionStatusId',
            width: '6%',
            render: (withdrawTransactionStatusId, record) => {
                if (withdrawTransactionStatusId === WITHDRAW_TRANSACTION_IN_PROCESSING) {
                    return <Tag color="#ecc30b">Chưa xử lý</Tag>
                } else if (withdrawTransactionStatusId === WITHDRAW_TRANSACTION_PAID) {
                    return <Tag color="#52c41a">Thành công</Tag>
                } else if (withdrawTransactionStatusId === WITHDRAW_TRANSACTION_REJECT) {
                    return <Tag color="red">Từ chối</Tag>
                }
            }
        },
        {
            title: '',
            dataIndex: 'withdrawTransactionStatusId',
            width: '16%',
            render: (withdrawTransactionStatusId, record) => {
                if (withdrawTransactionStatusId === WITHDRAW_TRANSACTION_PAID ||
                    withdrawTransactionStatusId === WITHDRAW_TRANSACTION_REJECT) {
                    return <DrawerWithdrawTransactionBill userId={record.userId} withdrawTransactionId={record.withdrawTransactionId} />
                } else {
                    return (
                        <Space>
                            <Button onClick={() => handleOpenModal(record)} size="middle">Chuyển khoản</Button>
                            <ModalRejectWithdrawTransaction withdrawTransactionId={record.withdrawTransactionId} callBack={GetWithdrawTransactions} />
                        </Space>
                    )
                }
            }
        },

    ];

    const notification = useContext(NotificationContext);
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true)

    const [form] = Form.useForm();
    const [openModal, setOpenModal] = useState(false);
    const [qrCode, setQrCode] = useState("");
    const [dataModal, setDataModal] = useState({})
    const [loadingBtnConfirmModal, setLoadingBtnConfirmModal] = useState(false)


    const [dataTable, setDataTable] = useState([]);
    const [searchData, setSearchData] = useState({
        withdrawTransactionId: '',
        email: '',
        fromDate: dayjs().subtract(3, 'day').format('M/D/YYYY'),
        toDate: dayjs().format('M/D/YYYY'),
        bankId: 0,
        creditAccount: '',
        status: 0
    });

    const filterOptions = (inputValue, option) => {
        return option.props.name.toLowerCase().indexOf(inputValue.toLowerCase()) !== -1;
    }

    useEffect(() => {

        GetWithdrawTransactions();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchData])

    const GetWithdrawTransactions = () => {
        getWithdrawTransaction(searchData)
            .then((res) => {
                if (res.data.status.responseCode === RESPONSE_CODE_SUCCESS) {
                    let data = []
                    res.data.result.forEach((x, index) => {
                        data = [...data, { key: index, ...x }]
                    })
                    setDataTable(data)
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
            name: 'date',
            value: [dayjs(searchData.fromDate, 'M/D/YYYY'), dayjs(searchData.toDate, 'M/D/YYYY')]
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
            notification("error", "Thời gian tạo yêu cầu không được trống!")
            setLoading(false);
            return;
        }

        setSearchData({
            withdrawTransactionId: values.withdrawTransactionId,
            email: values.email,
            fromDate: values.date[0].$d.toLocaleDateString(),
            toDate: values.date[1].$d.toLocaleDateString(),
            bankId: values.bankId,
            creditAccount: values.creditAccount,
            status: values.status
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
                    notification("success", "Xác nhận chuyển khoản thành công!")
                } else if (res.data.status.responseCode === RESPONSE_CODE_BANK_WITHDRAW_PAID) {
                    notification("error", `Mã hóa đơn này đã được xác nhận trước đó!`)
                }

            })
            .catch(() => {
                notification("error", "Hệ thống đang gặp sự cố! Vui lòng thử lại sau!")
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

    return (
        <>
            <Spinning spinning={loading}>
                <Card
                    style={{
                        width: '100%',
                        minHeight: "690px"
                    }}
                    title="Danh sách rút tiền"
                    hoverable
                >
                    <Form
                        name="basic"
                        form={form}
                        onFinish={onFinish}
                        fields={initFormValues}
                    >
                        <Row>
                            <Col span={3} offset={1}><label>Mã giao dịch: </label></Col>
                            <Col span={6}>
                                <Form.Item name="withdrawTransactionId" >
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={2} offset={1}><label>Ngân hàng: </label></Col>
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
                            <Col span={3} offset={1}><label>Email người tạo yêu cầu: </label></Col>
                            <Col span={6}>
                                <Form.Item name="email" >
                                    <Input />
                                </Form.Item>
                            </Col>

                            <Col span={2} offset={1}><label>Số tài khoản: </label></Col>
                            <Col span={6}>
                                <Form.Item name="creditAccount" >
                                    <Input />
                                </Form.Item>
                            </Col>

                        </Row>

                        <Row>
                            <Col span={3} offset={1}><label>Thời gian tạo yêu cầu: </label></Col>
                            <Col span={6}>
                                <Form.Item name="date" >
                                    <RangePicker locale={locale}
                                        format={"M/D/YYYY"}
                                        placement={"bottomLeft"} />
                                </Form.Item>
                            </Col>

                            <Col span={2} offset={1}><label>Trạng thái: </label></Col>
                            <Col span={6}>
                                <Form.Item name="status" >
                                    <Select >
                                        <Select.Option value={0}>Tất cả</Select.Option>
                                        <Select.Option value={1}>Chưa xử lý	</Select.Option>
                                        <Select.Option value={2}>Thành công</Select.Option>
                                        <Select.Option value={3}>Từ chối</Select.Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col offset={1} span={1}>
                                <Button type="primary" htmlType="submit">
                                    Tìm kiếm
                                </Button>
                            </Col>
                        </Row>
                    </Form>

                    <Button type="primary" onClick={handleNavigateToWithdrawByList}>
                        <SwapOutlined /> Chuyển khoản theo lô
                    </Button>

                    <Table columns={columns}
                        pagination={{ pageSize: 10 }}
                        dataSource={dataTable} size='small'
                        scroll={{ y: 290 }}
                        rowKey={(record, index) => index}
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