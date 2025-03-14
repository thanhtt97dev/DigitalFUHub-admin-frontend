import React, { useLayoutEffect, useState, useContext } from "react";
import { Divider, Modal, Button, Form, Select, Row, Col, Input } from "antd";

import { ExclamationCircleFilled } from "@ant-design/icons";

import { NotificationContext } from "~/context/UI/NotificationContext";

import {
    RESPONSE_CODE_SUCCESS,
    REPORT_PRODUCT_STATUS_REJECT,
    REPORT_PRODUCT_STATUS_ACCEPT,
} from "~/constants"

import { updateReportProduct } from '~/api/product'

const { TextArea } = Input;


function ModalUpdateReportProduct({ reportProductId, style, callBack }) {

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
        data = { ...data, reportProductId }
        setConfirmLoading(true)
        updateReportProduct(data)
            .then((res) => {
                if (res.data.status.responseCode === RESPONSE_CODE_SUCCESS) {
                    setConfirmLoading(false)
                    callBack()
                    setTimeout(() => {
                        setOpenModal(false)
                    }, 200)
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
            value: REPORT_PRODUCT_STATUS_REJECT
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
                type="link"
                style={style}
                loading={btnLoading}
            >
                Chỉnh sửa
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
                            <Col offset={1} span={8}>
                                Trạng thái đơn hàng:
                            </Col>
                            <Col offset={1} span={12}>
                                <Form.Item name="status" >
                                    <Select >
                                        <Select.Option value={REPORT_PRODUCT_STATUS_REJECT}>Từ chối</Select.Option>
                                        <Select.Option value={REPORT_PRODUCT_STATUS_ACCEPT}>Xác nhận vi phạm</Select.Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                        </Row>

                        <Row>
                            <Col offset={1} span={23}>
                                Thông tin:
                            </Col>

                        </Row>
                        <Row>
                            <Col offset={1} span={23}>
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

export default ModalUpdateReportProduct;
