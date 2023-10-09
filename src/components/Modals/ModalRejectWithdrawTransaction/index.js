import React, { useLayoutEffect, useState } from "react";
import { Divider, Modal, Button, Form, Row, Col, Input } from "antd";

import { ExclamationCircleFilled } from "@ant-design/icons";

import {
    RESPONSE_CODE_SUCCESS,
} from "~/constants";

import { rejectWithdrawTransaction } from '~/api/admin'

const { TextArea } = Input;


function ModalRejectWithdrawTransaction({ withdrawTransactionId, style, callBack }) {

    const [form] = Form.useForm();
    const [openModal, setOpenModal] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [btnLoading, setBtnLoading] = useState(false)


    useLayoutEffect(() => {

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleSubmit = () => {
        var data = form.getFieldsValue()
        data = { ...data, withdrawTransactionId }
        setConfirmLoading(true)
        rejectWithdrawTransaction(data)
            .then((res) => {
                if (res.data.status.responseCode === RESPONSE_CODE_SUCCESS) {
                    setConfirmLoading(false)
                    callBack()
                    setTimeout(() => {
                        setOpenModal(false)
                    }, 200)
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
                danger
            >
                Từ chối
            </Button>

            <Modal
                title={<><ExclamationCircleFilled style={{ color: "#faad14" }} /> Từ chối yêu cầu rút tiền</>}
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
                            <Col offset={1} span={22}>
                                <Form.Item name="note" label="Lý do">
                                    <TextArea rows={4} placeholder="Lý do từ chối yêu cầu rút tiền"
                                        maxLength={200}
                                        rules={[
                                            {
                                                required: true,
                                                message: 'Lý do từ chối yêu cầu không được để trống ',
                                            },
                                        ]}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </>

            </Modal>
        </>
    );
}

export default ModalRejectWithdrawTransaction;