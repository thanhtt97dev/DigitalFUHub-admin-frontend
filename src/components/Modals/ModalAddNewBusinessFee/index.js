import React, { useLayoutEffect, useState, useContext } from "react";
import { Divider, Modal, Button, Form, Row, Col, InputNumber } from "antd";

import {
    ExclamationCircleFilled,
    PlusOutlined
} from "@ant-design/icons";
import NotificationContext from "~/context/UI/NotificationContext";

import {
    RESPONSE_CODE_NOT_ACCEPT,
    RESPONSE_CODE_SUCCESS,
} from "~/constants";

import { addNewBusinessFee } from '~/api/businessFee'


function ModalAddNewBusinessFee({ style, callBack }) {

    const [form] = Form.useForm();
    const notification = useContext(NotificationContext);
    const [openModal, setOpenModal] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [btnLoading, setBtnLoading] = useState(false)

    useLayoutEffect(() => {

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleSubmit = () => {
        var data = form.getFieldsValue()
        data = { ...data }
        setConfirmLoading(true)
        addNewBusinessFee(data)
            .then((res) => {
                if (res.data.status.responseCode === RESPONSE_CODE_SUCCESS) {
                    setTimeout(() => {
                        setConfirmLoading(false)
                    }, 500)
                    callBack();
                    setOpenModal(false)
                    notification('success', 'Tạo phí kinh doanh mới thành công!')
                } else if (res.data.status.responseCode === RESPONSE_CODE_NOT_ACCEPT) {
                    notification('error', 'Xảy ra một vài vấn đề, hãy thử lại!')
                }
            })
            .catch(() => {

            })
            .finally(() => {
                setTimeout(() => {
                    setConfirmLoading(false)
                }, 500)
            })
    }

    const handleOpenModal = () => {
        setBtnLoading(false)
        setOpenModal(true)
    }

    const initFormValues = [
        {
            name: 'fee',
            value: 5
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
                <PlusOutlined />
                Tạo phí kinh doanh mới
            </Button>

            <Modal
                title={<><ExclamationCircleFilled style={{ color: "#faad14" }} /> Tạo phí kinh doanh mới</>}
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
                            <Col offset={1} span={23}>
                                <p>Bạn đã chắc chắn từ chối yêu cầu rút tiền này không?</p>
                            </Col>
                        </Row>

                        <Row>
                            <Col offset={1} span={8}>
                                <Form.Item name="fee" label="Giá trị">
                                    <InputNumber min={0} max={100} />
                                </Form.Item>
                            </Col>
                            <Col span={1}><p>%</p></Col>
                        </Row>
                    </Form>
                </>

            </Modal>
        </>
    );
}

export default ModalAddNewBusinessFee;