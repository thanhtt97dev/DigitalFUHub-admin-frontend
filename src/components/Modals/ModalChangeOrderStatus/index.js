import React, { useLayoutEffect, useState, useContext } from "react";
import { Divider, Modal, Button, Form, Select, Row, Col, Input } from "antd";

import { ExclamationCircleFilled } from "@ant-design/icons";

import { NotificationContext } from "~/context/UI/NotificationContext";

import {
    RESPONSE_CODE_SUCCESS,
    ORDER_REJECT_COMPLAINT,
    ORDER_SELLER_VIOLATES,
    RESPONSE_CODE_ORDER_STATUS_CHANGED_BEFORE
} from "~/constants";

import { updateOrderStatus } from '~/api/order'

const { TextArea } = Input;


function ModalChangeOrderStatus({ orderId, style, callBack }) {

    const notification = useContext(NotificationContext);
    const [form] = Form.useForm();
    const [openModal, setOpenModal] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [btnLoading, setBtnLoading] = useState(false)


    useLayoutEffect(() => {

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleSubmit = () => {
        var data = form.getFieldsValue()
        data = { ...data, orderId }
        setConfirmLoading(true)
        updateOrderStatus(data)
            .then((res) => {
                if (res.data.status.responseCode === RESPONSE_CODE_SUCCESS) {
                    setConfirmLoading(false)
                    callBack()
                    setTimeout(() => {
                        setOpenModal(false)
                    }, 200)
                } else if (res.data.status.responseCode === RESPONSE_CODE_ORDER_STATUS_CHANGED_BEFORE) {
                    notification("info", "Trạng thái đơn hàng đã được thay đổi trước đó! Vui lòng tải lại trang!")
                } else {
                    notification("error", "Đã có lỗi xảy ra.")
                }
            })
            .catch(() => {

            })
            .finally(() => {
                setTimeout(() => {
                    setConfirmLoading(false)
                    setOpenModal(false)
                }, 500)
            })
    }

    const handleOpenModal = () => {
        setBtnLoading(false)
        setOpenModal(true)
        //checking user has been linked bank account

    }

    const initFormValues = [
        {
            name: 'status',
            value: ORDER_REJECT_COMPLAINT
        },
        {
            name: 'note',
            value: ''
        },
    ];


    return (
        <>
            <Button
                onClick={handleOpenModal}
                type="primary"
                style={style}
                loading={btnLoading}
            >
                Chỉnh sửa trạng thái đơn hàng
            </Button>

            <Modal
                title={<><ExclamationCircleFilled style={{ color: "#faad14" }} /> Chỉnh sửa trạng thái đơn hàng</>}
                open={openModal}
                onOk={handleSubmit}
                onCancel={() => setOpenModal(false)}
                confirmLoading={confirmLoading}
                okText={"Xác nhận"}
                cancelText={"Hủy"}
                width={"35%"}
            >
                <>
                    <Divider />
                    <Form
                        name="basic"
                        form={form}
                        fields={initFormValues}
                    >
                        <Row>
                            <Col span={7}>
                                Trạng thái đơn hàng:
                            </Col>
                            <Col offset={1} span={16}>
                                <Form.Item name="status" >
                                    <Select >
                                        <Select.Option value={ORDER_REJECT_COMPLAINT}>Từ chối khiếu nại</Select.Option>
                                        <Select.Option value={ORDER_SELLER_VIOLATES}>Người bán vi phạm</Select.Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row>
                            <Col span={7}>
                                Thông tin:
                            </Col>
                            <Col offset={1} span={16}>
                                <Form.Item name="note" >
                                    <TextArea rows={4} placeholder="Nhập thông tin lý do chỉnh sửa trạng thái đơn hàng" maxLength={200} />
                                </Form.Item>
                            </Col>
                        </Row>


                        <Form.Item style={{ position: 'absolute', top: 180, left: 550 }}>

                        </Form.Item>
                    </Form>
                </>

            </Modal>
        </>)
}

export default ModalChangeOrderStatus;
