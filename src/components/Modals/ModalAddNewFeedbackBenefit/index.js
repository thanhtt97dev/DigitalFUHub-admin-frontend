import React, { useLayoutEffect, useState } from "react";
import { addNewFeedbackBenefit } from '~/api/feedbackBenefit';
import { ExclamationCircleFilled, PlusOutlined } from "@ant-design/icons";
import { Divider, Modal, Button, Form, Row, Col, InputNumber } from "antd";
import { RESPONSE_CODE_NOT_ACCEPT, RESPONSE_CODE_SUCCESS } from "~/constants";


function ModalAddNewFeedbackBenefit({ reloadFeedbackBenefits, notification }) {

    /// states
    const [form] = Form.useForm();
    const [openModal, setOpenModal] = useState(false);
    const [confirmLoading, setConfirmLoading] = useState(false);
    const [btnLoading, setBtnLoading] = useState(false);
    ///

    useLayoutEffect(() => {

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    /// handles
    const handleSubmit = () => {
        var data = form.getFieldsValue()
        data = { ...data }
        setConfirmLoading(true)
        addNewFeedbackBenefit(data)
            .then((res) => {
                if (res.status === 200) {
                    if (res.data.status.responseCode === RESPONSE_CODE_SUCCESS) {
                        reloadFeedbackBenefits();
                        notification('success', 'Tạo lợi ích phản hồi mới thành công!');
                    } else if (res.data.status.responseCode === RESPONSE_CODE_NOT_ACCEPT) {
                        notification('error', 'Yêu cầu không hợp lệ, vui lòng thử lại!');
                    } else {
                        notification('error', 'Lỗi xảy ra từ hệ thống, vui lòng thử lại sau!');
                    }
                } else {
                    notification('error', 'Lỗi xảy ra từ hệ thống, vui lòng thử lại sau!');
                }

                setOpenModal(false);

            })
            .catch(() => { })
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
    ///

    const initFormValues = [
        {
            name: 'coin',
            value: 50
        },
    ];

    return (
        <>
            <Button
                onClick={handleOpenModal}
                type="primary"
                loading={btnLoading}
            >
                <PlusOutlined />
                Tạo lợi ích đánh giá mới
            </Button>

            <Modal
                title={<><ExclamationCircleFilled style={{ color: "#faad14" }} /> Tạo lợi ích phản hồi mới</>}
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
                        name="add-new-feedback-benefit"
                        form={form}
                        fields={initFormValues}
                    >
                        <Row>
                            <Col offset={1} span={23}>
                                <p>Bạn đã chắc chắn tạo mới với giá trị Xu này không?</p>
                            </Col>
                        </Row>

                        <Row>
                            <Col offset={1} span={8}>
                                <Form.Item name="coin" label="Xu">
                                    <InputNumber min={0} />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </>

            </Modal>
        </>
    );
}

export default ModalAddNewFeedbackBenefit;