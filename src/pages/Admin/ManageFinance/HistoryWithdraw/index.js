import React, { useEffect, useState } from "react";
import { Card, Table, Tag, Button, Form, Input, Space, DatePicker, notification, Select, Modal, Divider } from "antd";
import locale from 'antd/es/date-picker/locale/vi_VN';
import dayjs from 'dayjs';
import { Link, useNavigate } from "react-router-dom";
import {
    SwapOutlined
} from '@ant-design/icons';

import { getWithdrawTransaction, confirmTransferWithdrawSuccess } from '~/api/bank'
import Spinning from "~/components/Spinning";
import { formatStringToCurrencyVND, ParseDateTime, getVietQrImgSrc } from '~/utils/index'
import { RESPONSE_CODE_BANK_WITHDRAW_PAID, RESPONSE_CODE_SUCCESS } from "~/constants";
import DrawerWithdrawTransactionBill from "~/components/Drawers/DrawerWithdrawTransactionBill";

import classNames from 'classnames/bind';
import styles from './HistoryWithdraw.module.scss';

const cx = classNames.bind(styles);
const { RangePicker } = DatePicker;

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
                    <p>{formatStringToCurrencyVND(amount)} VND</p>
                )
            }
        },
        {
            title: 'Thời gian tạo yêu cầu',
            dataIndex: 'requestDate',
            width: '10%',
            render: (requestDate) => {
                return (
                    <p>{ParseDateTime(requestDate)}</p>
                )
            }
        },
        {
            title: 'Số tài khoản',
            dataIndex: 'creditAccount',
            width: '13%',
        },
        {
            title: 'Ngân hàng đối tác',
            dataIndex: 'bankName',
            width: '12%',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'isPay',
            width: '6%',
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
            dataIndex: 'isPay',
            width: '9%',
            render: (isPay, record) => {
                return (
                    isPay ?
                        <DrawerWithdrawTransactionBill userId={record.userId} withdrawTransactionId={record.withdrawTransactionId} />
                        :
                        <Button onClick={() => handleOpenModal(record)} size="middle">Chuyển khoản</Button>
                )
            }
        },

    ];

    const navigate = useNavigate();
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
    const [qrCode, setQrCode] = useState("");
    const [dataModal, setDataModal] = useState({})
    const [loadingBtnConfirmModal, setLoadingBtnConfirmModal] = useState(false)


    const [dataTable, setDataTable] = useState([]);
    const [searchData, setSearchData] = useState({
        withdrawTransactionId: '',
        email: '',
        fromDate: dayjs().subtract(3, 'day').format('M/D/YYYY'),
        toDate: dayjs().format('M/D/YYYY'),
        status: 0
    });

    useEffect(() => {
        getWithdrawTransaction(searchData)
            .then((res) => {
                if (res.data.status.responseCode === RESPONSE_CODE_SUCCESS) {
                    let data = []
                    res.data.result.forEach((x, index) => {
                        data = [...data, { key: index, ...x }]
                    })
                    setDataTable(data)
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

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchData])

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
            fromDate: values.date[0].$d.toLocaleDateString(),
            toDate: values.date[1].$d.toLocaleDateString(),
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
                    console.log(dataTable)
                    newDataTable[index].isPay = true
                    setDataTable(newDataTable)
                    openNotification("success", "Xác nhận chuyển khoản thành công!")
                } else if (res.data.status.responseCode === RESPONSE_CODE_BANK_WITHDRAW_PAID) {
                    openNotification("error", `Mã hóa đơn này đã được xác nhận trước đó! Vui lòng vào "Lịch sử giao dịch nội bộ" để kiểm tra!`)
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
        let dataTableRecordsUnPay = dataTable.filter(x => x.isPay === false);
        return navigate("tranfer-bylist", { state: { dataTable: dataTableRecordsUnPay } })
    }

    return (
        <>
            {contextHolder}
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
                        labelCol={{
                            span: 8,
                        }}
                        wrapperCol={{
                            span: 0,
                        }}
                        style={{
                            maxWidth: 500,
                            marginLeft: "30px",
                            position: 'relative',
                        }}
                        form={form}
                        onFinish={onFinish}
                        fields={initFormValues}
                    >
                        <Form.Item label="Mã giao dịch" labelAlign="left" name="withdrawTransactionId">
                            <Input />
                        </Form.Item>

                        <Form.Item label="Email người tạo yêu cầu" labelAlign="left" name="email">
                            <Input />
                        </Form.Item>

                        <Form.Item label="Thời gian tạo yêu cầu" labelAlign="left" name="date">
                            <RangePicker locale={locale}
                                format={"M/D/YYYY"}
                                placement={"bottomLeft"} />
                        </Form.Item>

                        <Form.Item label="Trạng thái" labelAlign="left" name="status">
                            <Select >
                                <Select.Option value={0}>Tất cả</Select.Option>
                                <Select.Option value={1}>Thành công</Select.Option>
                                <Select.Option value={2}>Chưa xử lý	</Select.Option>
                            </Select>
                        </Form.Item>

                        <Form.Item style={{ position: 'absolute', top: 145, left: 550 }}>
                            <Space>
                                <Button type="primary" htmlType="submit">
                                    Tìm kiếm
                                </Button>
                            </Space>
                        </Form.Item>
                    </Form>

                    <Button type="primary" onClick={handleNavigateToWithdrawByList}>
                        <SwapOutlined /> Chuyển khoản theo lô
                    </Button>

                    <Table columns={columns}
                        pagination={{ pageSize: 10 }}
                        dataSource={dataTable} size='small'
                        scroll={{ y: 290 }}
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