import React, { useEffect, useState } from "react";
import { Card, Table, Tag, Button, Form, Input, Space, DatePicker, notification, Select } from "antd";
import locale from 'antd/es/date-picker/locale/vi_VN';
import dayjs from 'dayjs';

import { getWithdrawTransaction } from '~/api/bank'
import Spinning from "~/components/Spinning";
import { formatStringToCurrencyVND, ParseDateTime } from '~/utils/index'
import { RESPONSE_CODE_SUCCESS } from "~/constants";
import DrawerWithdrawTransactionBill from "~/components/Drawers/DrawerWithdrawTransactionBill";

const { RangePicker } = DatePicker;


const columns = [
    {
        title: 'Mã giao dịch',
        dataIndex: 'withdrawTransactionId',
        width: '6%',
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
        title: 'Đơn vị thụ hưởng',
        dataIndex: 'creditAccountName',
        width: '12%',
    },
    {
        title: 'Số tài khoản',
        dataIndex: 'creditAccount',
        width: '10%',
    },
    {
        title: 'Ngân hàng đối tác',
        dataIndex: 'bankName',
        width: '14%',
    },
    {
        title: 'Trạng thái',
        dataIndex: 'isPay',
        width: '5%',
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
        width: '5%',
        render: (isPay, record) => {
            return (
                isPay ?
                    <DrawerWithdrawTransactionBill withdrawTransactionId={record.withdrawTransactionId} />
                    :
                    ""
            )
        }
    },

];

function HistoryWithdraw() {
    const [loading, setLoading] = useState(true)
    const [api, contextHolder] = notification.useNotification();
    const openNotification = (type, message) => {
        api[type]({
            message: `Thông báo`,
            description: `${message}`
        });
    };

    const [form] = Form.useForm();
    const [dataTable, setDataTable] = useState([]);
    const [searchData, setSearchData] = useState({
        depositTransactionId: '',
        fromDate: dayjs().subtract(3, 'day').format('M/D/YYYY'),
        toDate: dayjs().format('M/D/YYYY'),
        status: 0
    });

    useEffect(() => {
        getWithdrawTransaction(searchData)
            .then((res) => {
                if (res.data.status.responseCode === RESPONSE_CODE_SUCCESS) {
                    setDataTable(res.data.result)
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
            name: 'depositTransactionId',
            value: searchData.depositTransactionId,
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
            depositTransactionId: values.depositTransactionId,
            fromDate: values.date[0].$d.toLocaleDateString(),
            toDate: values.date[1].$d.toLocaleDateString(),
            status: values.status
        });
    };



    return (
        <>
            {contextHolder}
            <Spinning spinning={loading}>
                <Card
                    style={{
                        width: '100%',
                        height: "650px"
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
                        <Form.Item label="Mã giao dịch" labelAlign="left" name="depositTransactionId">
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

                        <Form.Item style={{ position: 'absolute', top: 110, left: 550 }}>
                            <Space>
                                <Button type="primary" htmlType="submit">
                                    Tìm kiếm
                                </Button>
                            </Space>
                        </Form.Item>
                    </Form>
                    <Table columns={columns} pagination={{ pageSize: 10 }} dataSource={dataTable} size='small' scroll={{ y: 290 }} />
                </Card>
            </Spinning>
        </>
    )
}

export default HistoryWithdraw;