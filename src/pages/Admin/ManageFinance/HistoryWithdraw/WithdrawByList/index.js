import React, { useEffect, useState } from "react";
import { useLocation } from 'react-router-dom';
import { Card, Table, Tag, Button, Form, Input, Space, notification, Modal, Divider } from "antd";

import { Link } from "react-router-dom";
import {
    DeleteOutlined,
    DownloadOutlined,
    CheckCircleOutlined
} from '@ant-design/icons';

import Spinning from "~/components/Spinning";
import { formatPrice, ParseDateTime } from '~/utils/index'
import BackPreviousPage from "~/components/BackPreviousPage";
import * as ExcelJS from "exceljs"
import saveAs from "file-saver";
import { dowloadFile } from '~/api/storage'
import {
    MB_BANK_TRANFER_BY_LIST_EXCEL_FILE_NAME,
    RESPONSE_CODE_SUCCESS, RESPONSE_CODE_BANK_WITHDRAW_PAID,
    RESPONSE_CODE_FAILD,
    RESPONSE_CODE_DATA_NOT_FOUND
} from '~/constants'
import { confirmListTransferWithdrawSuccess } from '~/api/bank'


function WithdrawByList() {

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
                    <p>{formatPrice(amount)}</p>
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
            dataIndex: 'key',
            width: '6%',
            render: (key, record) => {
                return (
                    <Button type="primary" danger onClick={() => handleOpenModalRemoveRecord(key)} ><DeleteOutlined /></Button>
                )
            }
        },

    ];

    const location = useLocation();
    const [loading, setLoading] = useState(true)
    const [api, contextHolder] = notification.useNotification();
    const openNotification = (type, message) => {
        api[type]({
            message: `Thông báo`,
            description: `${message}`
        });
    };

    const [searchData, setSearchData] = useState({
        withdrawTransactionId: '',
        email: '',
    });

    const [form] = Form.useForm();
    const [openModal, setOpenModal] = useState(false);
    const [loadingBtnConfirmModal, setLoadingBtnConfirmModal] = useState(false)

    const [recordRemove, setRecordRemove] = useState(0)
    const [openModalRemoveRecord, setOpenModalRemoveRecord] = useState(false)

    const [dataTable, setDataTable] = useState([]);
    const [dataTableView, setDataTableView] = useState([]);


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

    const initFormValues = [
        {
            name: 'withdrawTransactionId',
            value: searchData.withdrawTransactionId,
        },
        {
            name: 'email',
            value: searchData.email,
        },
    ];

    const onFinish = (values) => {
        setSearchData({ withdrawTransactionId: values.withdrawTransactionId, email: values.email })
        let data = dataTable;
        if (values.withdrawTransactionId !== '') {
            data = data.filter((x) => String(x.withdrawTransactionId) === values.withdrawTransactionId)
        }
        if (values.email !== '') {
            data = data.filter((x) => x.email.includes(values.email))
        }
        setDataTableView(data)
    };

    const handleOpenModal = (record) => {
        setLoading(true)
        setTimeout(() => {
            setLoading(false)
            setOpenModal(true)
        }, 300)
    }

    const handleOpenModalRemoveRecord = (key) => {
        setRecordRemove(key)
        setOpenModalRemoveRecord(true)
    }

    const handleRemoveRecord = () => {
        let data = dataTable;
        data = dataTable.filter((x) => x.key !== recordRemove)
        setDataTable(data)
        setDataTableView(data)
        setOpenModalRemoveRecord(false)
    }

    const handleDownLoadFile = () => {
        setLoading(true)
        dowloadFile(MB_BANK_TRANFER_BY_LIST_EXCEL_FILE_NAME)
            .then(res => {
                const workbook = new ExcelJS.Workbook();
                workbook.xlsx
                    .load(res.data)
                    .then(async () => {
                        const worksheet = workbook.getWorksheet(1);
                        dataTable.forEach((data) => {
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
        let data = []
        dataTable.forEach((x) => {
            data = [...data, x.withdrawTransactionId]
        })
        confirmListTransferWithdrawSuccess({ ids: data })
            .then(res => {
                if (res.data.status.responseCode === RESPONSE_CODE_SUCCESS) {
                    //update UI
                    data = dataTable.filter((x) => !data.includes(x.withdrawTransactionId))
                    setDataTable(data)
                    setDataTableView(data)
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
                <Card
                    style={{
                        width: '100%',
                        minHeight: "690px"
                    }}
                    title="Chuyển khoản theo lô"
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

                        <Form.Item style={{ position: 'absolute', top: 55, left: 550 }}>
                            <Space>
                                <Button type="primary" htmlType="submit">
                                    Tìm kiếm
                                </Button>
                            </Space>
                        </Form.Item>
                    </Form>
                    <Table columns={columns}
                        pagination={{ pageSize: 10 }}
                        dataSource={dataTableView} size='small'
                        scroll={{ y: 290 }}
                        rowKey={(record, index) => index}
                    />

                    <Space direction="horizontal" style={{ width: '100%', justifyContent: 'end' }}>
                        <Button type="primary" size="large" onClick={handleOpenModal}><CheckCircleOutlined /> Xác nhận đã chuyển khoản</Button>
                        <Button size="large" onClick={handleDownLoadFile}><DownloadOutlined /> Tải file</Button>
                        <BackPreviousPage url={-1} />
                    </Space>
                </Card>
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