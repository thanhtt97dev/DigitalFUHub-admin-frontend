import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Divider, Modal, Button, Form, Select, Row, Col, Input } from "antd";
import { ExclamationCircleFilled } from "@ant-design/icons";
import { RESPONSE_CODE_SUCCESS, RESPONSE_CODE_NOT_ACCEPT } from "~/constants"
import { updateShop } from '~/api/shop'
import { useAuthUser } from 'react-auth-kit';
const { TextArea } = Input;

const ModalUpdateShopStatus = ({ shopId, reloadShopInformations, notification }) => {

    /// states
    const [form] = Form.useForm();
    const [openModal, setOpenModal] = useState(false);
    const [btnLoading, setBtnLoading] = useState(false);
    ///

    /// variables
    const auth = useAuthUser();
    const user = auth();
    ///

    /// router
    const navigate = useNavigate();
    ///

    /// handles
    const handleSubmit = () => {

        if (user === undefined || user === null) return navigate('/login');
        var { status, note } = form.getFieldsValue();
        // request dto
        const dataRequest = {
            ShopId: shopId,
            IsActive: status,
            Note: note
        }

        updateShop(dataRequest)
            .then((res) => {
                if (res.status === 200) {
                    const data = res.data;
                    const status = data.status;
                    if (status.responseCode === RESPONSE_CODE_SUCCESS) {
                        reloadShopInformations();
                        setOpenModal(false);
                        notification("success", "Cập nhật trạng thái cửa hàng thành công");
                    } else if (status.responseCode === RESPONSE_CODE_NOT_ACCEPT) {
                        notification("error", "Yêu cầu không hợp lệ, vui lòng thử lại");
                    } else {
                        notification("error", "Lỗi từ hệ thống, vui lòng thử lại sau");
                    }
                } else {
                    notification("error", "Lỗi từ hệ thống, vui lòng thử lại sau");
                }
            })
            .catch(() => { })
    }

    const handleOpenModal = () => {
        setBtnLoading(false)
        setOpenModal(true)
    }
    ///

    // initials
    const initFormValues = [
        {
            name: 'status',
            value: true
        },
        {
            name: 'note',
            value: ''
        },
    ];
    ///


    return (
        <>
            <Button
                onClick={handleOpenModal}
                type="link"
                loading={btnLoading}
            >
                Chỉnh sửa
            </Button>

            <Modal
                title={<><ExclamationCircleFilled style={{ color: "#faad14" }} /> Chỉnh sửa trạng thái cửa hàng</>}
                open={openModal}
                onOk={handleSubmit}
                onCancel={() => setOpenModal(false)}
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
                                Trạng thái cửa hàng:
                            </Col>
                            <Col offset={1} span={12}>
                                <Form.Item name="status" >
                                    <Select >
                                        <Select.Option value={true}>Hoạt động</Select.Option>
                                        <Select.Option value={false}>Đình chỉ</Select.Option>
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
                                    <TextArea rows={4} placeholder="Nhập thông tin lý do chỉnh sửa trạng thái cửa hàng" maxLength={200} />
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </>

            </Modal>
        </>)
}

export default ModalUpdateShopStatus;