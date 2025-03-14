import React, { useEffect, useState, useContext } from "react";
import { Card, Table, Button, Form, Input, DatePicker, Row, Col, InputNumber, Space } from "antd";
import locale from 'antd/es/date-picker/locale/vi_VN';
import { getBusinessFee } from '~/api/businessFee'
import Spinning from "~/components/Spinning";
import { ParseDateTime, } from '~/utils/index'
import {
    RESPONSE_CODE_SUCCESS,
    BANKS_INFO,
} from "~/constants";
import { NotificationContext } from "~/context/UI/NotificationContext";

import classNames from 'classnames/bind';
import styles from './BusinessFee.module.scss';
import ModalAddNewBusinessFee from "~/components/Modals/ModalAddNewBusinessFee";

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

function BusinessFee() {

    const columns = [
        {
            title: 'Id',
            dataIndex: 'businessFeeId',
            width: '5%',
        },
        {
            title: 'Thời gian bắt đầu áp dụng',
            dataIndex: 'startDate',
            width: '15%',
            render: (startDate) => {
                return (
                    <span>{ParseDateTime(startDate)}</span>
                )
            }
        },
        {
            title: 'Thời gian kết thúc áp dụng',
            dataIndex: 'endDate',
            width: '15%',
            render: (endDate) => {
                return (
                    <>
                        {endDate === null ?
                            <span style={{ color: "red" }}>Đang được áp dụng</span>
                            :
                            <span>{ParseDateTime(endDate)}</span>
                        }
                    </>

                )
            }
        },
        {
            title: 'Giá trị',
            dataIndex: 'fee',
            width: '10%',
            render: (fee) => {
                return (
                    <span>{fee}%</span>
                )
            }
        },
        {
            title: 'Tổng số đơn hàng đã áp dụng',
            dataIndex: 'totalOrderUsed',
            width: '15%',
        },

    ];

    const notification = useContext(NotificationContext);
    const [loading, setLoading] = useState(true)

    const [form] = Form.useForm();

    const [dataTable, setDataTable] = useState([]);
    const [searchData, setSearchData] = useState({
        businessFeeId: '',
        maxFee: 100,
        fromDate: '',
        toDate: '',
    });

    useEffect(() => {
        getBusinessFeeWithCondition();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchData])

    const getBusinessFeeWithCondition = () => {
        getBusinessFee(searchData)
            .then((res) => {
                if (res.data.status.responseCode === RESPONSE_CODE_SUCCESS) {
                    setDataTable(res.data.result)
                } else {
                    notification("error", "Đang có chút sự cố! Hãy vui lòng thử lại!")
                }
            })
            .catch((err) => {
            })
            .finally(() => {
                setTimeout(() => { setLoading(false) }, 500)
            })
    }

    const initFormValues = [
        {
            name: 'businessFeeId',
            value: searchData.businessFeeId,
        },
        {
            name: 'maxFee',
            value: searchData.maxFee,
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
            businessFeeId: values.businessFeeId + "",
            maxFee: values.maxFee,
            fromDate: (values.date === undefined) ? '' : values.date[0].$d.toLocaleDateString(),
            toDate: (values.date === undefined) ? '' : values.date[1].$d.toLocaleDateString(),
        });
    };

    const onReset = () => {
        form.resetFields();
        form.setFieldsValue({
            businessFeeId: '',
            maxFee: 100,
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
                            <Col span={3} offset={1}>Id: </Col>
                            <Col span={6}>
                                <Form.Item name="businessFeeId" >
                                    <Input />
                                </Form.Item>
                            </Col>
                        </Row>



                        <Row>
                            <Col span={3} offset={1}><label>Thời gian áp dụng: </label></Col>
                            <Col span={6}>
                                <Form.Item name="date" >
                                    <RangePicker locale={locale}
                                        format={"M/D/YYYY"}
                                        placement={"bottomLeft"} />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={2} offset={1}>{"Giá trị"}</Col>
                            <Col offset={1} span={2}>
                                <Form.Item name="maxFee" >
                                    <InputNumber max={100} min={0} />
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

                    <ModalAddNewBusinessFee callBack={getBusinessFeeWithCondition} />

                </Card>
                <Card style={{ marginTop: "20px" }}>
                    <Table columns={columns}
                        pagination={{ pageSize: 10 }}
                        dataSource={dataTable} size='middle'
                        rowKey={(record, index) => index}
                    />
                </Card>
            </Spinning>

        </>
    )
}

export default BusinessFee;