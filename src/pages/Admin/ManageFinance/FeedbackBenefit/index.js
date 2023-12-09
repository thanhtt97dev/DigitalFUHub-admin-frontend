import React, { useEffect, useState, useContext } from "react";
import Spinning from "~/components/Spinning";
import locale from 'antd/es/date-picker/locale/vi_VN';
import { NotificationContext } from "~/context/UI/NotificationContext";
import ModalAddNewFeedbackBenefit from "~/components/Modals/ModalAddNewFeedbackBenefit";
import { ParseDateTime, } from '~/utils/index';
import { getFeedbackBenefits } from '~/api/feedbackBenefit';
import { RESPONSE_CODE_SUCCESS, RESPONSE_CODE_NOT_ACCEPT } from "~/constants";
import { Card, Table, Button, Form, Input, DatePicker, Row, Col, InputNumber, Space } from "antd";


const { RangePicker } = DatePicker;

function FeedbackBenefit() {
    /// states
    const [isLoadingSpinningPage, setIsLoadingSpinningPage] = useState(true);
    const [form] = Form.useForm();
    const [reloadFeedbackBenefitFlag, setReloadFeedbackBenefitFlag] = useState(false);
    const [dataTable, setDataTable] = useState([]);
    const [searchData, setSearchData] = useState({
        feedbackBenefitId: '',
        coin: 1000,
        fromDate: '',
        toDate: '',
    });
    const notification = useContext(NotificationContext);
    ///

    const columns = [
        {
            title: 'Id',
            dataIndex: 'feedbackBenefitId',
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
            title: 'Coin',
            dataIndex: 'coin',
            width: '10%',
            render: (coin) => {
                return (
                    <span>{coin}</span>
                )
            }
        },
        {
            title: 'Tổng số đánh giá đã áp dụng',
            dataIndex: 'totalFeedbackUsed',
            width: '15%',
        },

    ];

    /// useEffects
    useEffect(() => {
        const getFeedbackBenefitWithCondition = () => {
            setIsLoadingSpinningPage(true);

            getFeedbackBenefits(searchData)
                .then((res) => {
                    if (res.status === 200) {
                        const data = res.data;
                        const status = data.status;
                        if (status.responseCode === RESPONSE_CODE_SUCCESS) {
                            setDataTable(data.result);
                        } else if (status.responseCode === RESPONSE_CODE_NOT_ACCEPT) {
                            notification("error", "Yêu cầu không hợp lệ, vui lòng thử lại");
                        } else {
                            notification("error", "Có lỗi từ hệ thống, vui lòng thử lại sau");
                        }
                    } else {
                        notification("error", "Có lỗi từ hệ thống, vui lòng thử lại sau");
                    }
                })
                .catch((err) => { })
                .finally(() => {
                    setTimeout(() => { setIsLoadingSpinningPage(false) }, 500)
                })
        }

        getFeedbackBenefitWithCondition();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchData, reloadFeedbackBenefitFlag])
    ///

    /// init
    const initFormValues = [
        {
            name: 'feedbackBenefitId',
            value: searchData.feedbackBenefitId,
        },
        {
            name: 'coin',
            value: searchData.coin,
        },
    ];
    ///

    /// handles
    const reloadFeedbackBenefits = () => {
        setReloadFeedbackBenefitFlag(!reloadFeedbackBenefitFlag);
    }

    const onFinish = (values) => {
        debugger
        if (values.date === null) {
            notification("error", "Thời gian tạo yêu cầu không được trống!")
            return;
        }

        setIsLoadingSpinningPage(true);

        setSearchData({
            feedbackBenefitId: values.feedbackBenefitId,
            coin: values.coin,
            fromDate: (values.date === undefined) ? '' : values.date[0].$d.toLocaleDateString(),
            toDate: (values.date === undefined) ? '' : values.date[1].$d.toLocaleDateString(),
        });
    };

    const onReset = () => {
        form.resetFields();
        form.setFieldsValue({
            feedbackBenefitId: '',
            coin: 1000,
        });
    };
    ///

    return (
        <>
            <Spinning spinning={isLoadingSpinningPage}>
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
                                <Form.Item name="feedbackBenefitId" >
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
                            <Col span={2} offset={1}>{"Coin:"}</Col>
                            <Col offset={1} span={2}>
                                <Form.Item name="coin" >
                                    <InputNumber min={0} />
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

                    <ModalAddNewFeedbackBenefit reloadFeedbackBenefits={reloadFeedbackBenefits} notification={notification} />

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

export default FeedbackBenefit;