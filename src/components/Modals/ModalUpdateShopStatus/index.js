import React, { useState } from "react";
import { updateShop } from '~/api/shop';
import { useAuthUser } from 'react-auth-kit';
import { useNavigate } from 'react-router-dom';
import { ExclamationCircleFilled } from "@ant-design/icons";
import { Divider, Modal, Form, Select, Row, Col, Input } from "antd";
import { RESPONSE_CODE_SUCCESS, RESPONSE_CODE_NOT_ACCEPT } from "~/constants";

///
const { TextArea } = Input;
///

const ModalUpdateShopStatus = ({ shopId, reloadShopInformations, notification, openModal, setOpenModal }) => {

    /// states
    const [form] = Form.useForm();
    const [isLoadingButtonUpdate, setIsLoadingButtonUpdate] = useState(false);
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

        setIsLoadingButtonUpdate(true);

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
                        notification("success", "Cập nhật trạng thái cửa hàng thành công");
                    } else if (status.responseCode === RESPONSE_CODE_NOT_ACCEPT) {
                        notification("error", "Yêu cầu không hợp lệ, vui lòng thử lại");
                    } else {
                        notification("error", "Lỗi từ hệ thống, vui lòng thử lại sau");
                    }
                } else {
                    notification("error", "Lỗi từ hệ thống, vui lòng thử lại sau");
                }

                setIsLoadingButtonUpdate(false);
                setOpenModal(false);
            })
            .catch(() => { })
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


    return (<Modal
        title={<><ExclamationCircleFilled style={{ color: "#faad14" }} /> Chỉnh sửa trạng thái cửa hàng</>}
        open={openModal}
        onOk={handleSubmit}
        onCancel={() => setOpenModal(false)}
        okText={"Xác nhận"}
        cancelText={"Hủy"}
        width={"35%"}
        maskClosable={!isLoadingButtonUpdate}
        confirmLoading={isLoadingButtonUpdate}
    >
        <>
            <Divider />
            <Form
                name="basic"

                form={form}
                fields={initFormValues}
            >
                <Row>
                    <Col offset={1} span={4}>
                        Trạng thái:
                    </Col>
                    <Col offset={1} span={18}>
                        <Form.Item name="status" >
                            <Select >
                                <Select.Option value={true}>Hoạt động</Select.Option>
                                <Select.Option value={false}>Đình chỉ</Select.Option>
                            </Select>
                        </Form.Item>
                    </Col>
                </Row>

                <Row>
                    <Col offset={1} span={4}>
                        Lý do:
                    </Col>
                    <Col offset={1} span={18}>
                        <Form.Item name="note" >
                            <TextArea rows={4} placeholder="Nhập lý do chỉnh sửa trạng thái cửa hàng" maxLength={200} />
                        </Form.Item>
                    </Col>
                </Row>

            </Form>
        </>

    </Modal>)
}

export default ModalUpdateShopStatus;