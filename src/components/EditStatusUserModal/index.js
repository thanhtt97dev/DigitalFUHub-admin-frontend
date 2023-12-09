import { Form, Modal, Select, Input, Button, Row, Col } from "antd";
import { STATUS_USER_ACTIVE, STATUS_USER_BAN } from "~/constants";
const { TextArea } = Input;
function EditStatusUserModal({ buttonLoading = false, open = false, currentStatus = true, onClose = () => { }, onSubmit = () => { } }) {
    return (<>
        <Modal open={open} title="Chỉnh sửa trạng thái người dùng"
            onCancel={onClose}
            onClose={onClose}
            footer={null}
        >
            <Form
                onFinish={onSubmit}
                fields={[
                    {
                        name: 'status',
                        value: !currentStatus
                    },
                    {
                        name: 'note',
                        value: ''
                    }
                ]}
            >
                <Form.Item name="status" labelAlign="left" labelCol={{ span: 5 }} label="Trạng thái" required
                    rules={[
                        {
                            required: true,
                            message: 'Trạng thái người dùng không để trống.'
                        },
                    ]}
                >
                    <Select>
                        <Select.Option value={currentStatus ? STATUS_USER_BAN : STATUS_USER_ACTIVE}>
                            {currentStatus ? "Khóa tài khoản" : "Hoạt động"}
                        </Select.Option>
                    </Select>
                </Form.Item>
                {currentStatus &&
                    <Form.Item name="note" labelAlign="left" label="Lý do" labelCol={{ span: 5 }} required
                        rules={[
                            (getFieldValue) => ({
                                validator(_, value) {
                                    const data = value === undefined ? '' : value.trim();
                                    if (data.trim()) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject(new Error('Lý do khóa tài khoản không để trống.'));
                                },
                            }),
                        ]}
                    >
                        <TextArea />
                    </Form.Item>
                }
                <Form.Item>
                    <Row justify="end" gutter={16}>
                        <Col>
                            <Button danger onClick={onClose}>Hủy</Button>
                        </Col>
                        <Col>
                            <Button loading={buttonLoading} type="primary" htmlType="submit">Xác nhận</Button>
                        </Col>
                    </Row>
                </Form.Item>
            </Form>
        </Modal>
    </>);
}

export default EditStatusUserModal;