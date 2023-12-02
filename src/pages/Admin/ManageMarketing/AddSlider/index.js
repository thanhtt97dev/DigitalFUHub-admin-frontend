import React, { useEffect, useState, useContext } from "react";
import validator from 'validator';
import classNames from 'classnames/bind';
import styles from './AddSlider.module.scss';
import { addSlider } from "~/api/slider";
import Spinning from "~/components/Spinning";
import { useAuthUser } from 'react-auth-kit';
import { useNavigate } from 'react-router-dom';
import { UserOutlined, PlusOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { RESPONSE_CODE_SUCCESS, RESPONSE_CODE_NOT_ACCEPT, RESPONSE_CODE_DATA_NOT_FOUND } from '~/constants';
import { NotificationContext } from "~/context/UI/NotificationContext";
import { Col, Row, Form, Input, Button, Upload, Card, Tooltip, Modal, Switch } from 'antd';
import { UPLOAD_FILE_SIZE_LIMIT } from '~/constants';


/// styles
const styleCardAddSlider = { width: '100%' }
///

const AddSlider = () => {

    /// states
    const navigate = useNavigate();
    const [isLoadingSpinning, setIsLoadingSpinning] = useState(false);
    const [isLoadingButtonAdd, setIsLoadingButtonAdd] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [sliderFile, setSliderFile] = useState([]);
    const [openNotificationFileExceedLimit, setOpenNotificationFileExceedLimit] = useState(false);
    const [msgNotificationFileExceedLimit, setMsgNotificationFileExceedLimit] = useState([]);
    const [previewImageTitle, setPreviewImageTitle] = useState('');
    const [previewOpen, setPreviewOpen] = useState(false);

    const [form] = Form.useForm();
    ///

    /// contexts
    const notification = useContext(NotificationContext)
    ///

    /// variables
    const auth = useAuthUser();
    const user = auth();
    ///

    /// handles
    const getBase64 = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });

    const onFinish = (values) => {
        debugger
        if (user === undefined || user === null) return navigate('/login');

        setIsLoadingSpinning(true);

        const { name, imageSlider, isActive, productId } = values;

        // request dto
        const requestDto = {
            Name: name,
            Image: imageSlider.file.originFileObj,
            ProductId: productId,
            IsActive: isActive
        }

        addSlider(requestDto)
            .then((res) => {
                if (res.status === 200) {
                    const data = res.data;
                    if (data.status.responseCode === RESPONSE_CODE_SUCCESS) {
                        notification("success", "Thêm mới slider thành công");
                        setIsLoadingSpinning(false);
                    } else if (
                        data.status.responseCode === RESPONSE_CODE_NOT_ACCEPT
                        ||
                        data.status.responseCode === RESPONSE_CODE_DATA_NOT_FOUND) {
                        notification("error", "Yêu cầu không hợp lệ. Vui lòng thử lại!");
                        setIsLoadingSpinning(false);
                    }
                }
            })
            .catch((error) => {
                notification("error", "Có lỗi xảy ra. Vui lòng thử lại!");
                setIsLoadingSpinning(false);
            })
    }

    const handleSliderChange = (info) => {
        let newFileList = [...info.fileList];
        newFileList = newFileList.slice(-1);
        const lsFileExist = newFileList.filter(v => v.size > UPLOAD_FILE_SIZE_LIMIT)
        if (lsFileExist.length > 0) {
            newFileList = newFileList.filter(v => v.size <= UPLOAD_FILE_SIZE_LIMIT);
            var msgFileExceedLimit = `"${lsFileExist[0].name}" không thể được tải lên.`;
            setMsgNotificationFileExceedLimit([msgFileExceedLimit])
            setOpenNotificationFileExceedLimit(true);
            return;
        }
        newFileList = newFileList.map((file) => {
            if (file.response) {
                file.url = file.response.url;
            }
            file.response = '';
            file.status = 'done';
            return file;
        });
        setSliderFile(newFileList);
    };

    const handlePreviewImage = async (file) => {
        if (!file.url && !file.preview) {
            file.preview = await getBase64(file.originFileObj);
        }
        setPreviewImage(file.url || file.preview);
        setPreviewOpen(true);
        setPreviewImageTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1));
    };

    const handleCloseNotificationFileExceedLimit = () => {
        setMsgNotificationFileExceedLimit([]);
        setOpenNotificationFileExceedLimit(false);
    }

    ///

    /// validators
    const nameSliderValidator = (value) => {
        let nameSlider = form.getFieldValue(value.field);
        if (nameSlider === undefined || nameSlider === "") {
            return Promise.reject('Tên Slider phải có từ 10-50 ký tự');
        }

        const trimmedValue = nameSlider.replace(/\s+/g, ' ');

        if (!validator.isLength(trimmedValue, { min: 10, max: 50 })) {
            return Promise.reject('Tên Slider phải có từ 10-50 ký tự');
        } else {
            return Promise.resolve();
        }
    }
    ///

    return (<Spinning spinning={isLoadingSpinning}>
        <Modal
            open={openNotificationFileExceedLimit}
            footer={null}
            onCancel={handleCloseNotificationFileExceedLimit}
            title="Lưu ý"
        >
            <div>
                {msgNotificationFileExceedLimit.map((v, i) => <div key={i}>{v}</div>)}
                <div>- Kích thước tập tin vượt quá 2.0 MB.</div>
                <Row justify="end">
                    <Col>
                        <Button type="primary" danger onClick={handleCloseNotificationFileExceedLimit}>Xác nhận</Button>
                    </Col>
                </Row>
            </div>
        </Modal>
        <Card title="Thông tin Slider" style={styleCardAddSlider} type="inner">
            <Row>
                <Form
                    labelCol={{
                        flex: '110px',
                    }}
                    name="control-hooks"
                    form={form}
                    onFinish={onFinish}
                    labelWrap >
                    <Form.Item name='name' label="Tên Slider" labelAlign="left" style={{ width: '100%' }}
                        rules={[
                            {
                                validator: nameSliderValidator
                            }
                        ]}
                    >
                        <Row gutter={8}>
                            <Col span={17}>
                                <Input style={{ width: '100%' }} />
                            </Col>
                        </Row>

                    </Form.Item>

                    <Form.Item name='imageSlider' label={<lable style={{ fontSize: 14 }}>Ảnh slider (Hình ảnh tỷ lệ 1:3) <Tooltip title="Ảnh đại diện sản phẩm."><QuestionCircleOutlined /></Tooltip></lable>}
                        rules={[
                            {
                                required: true,
                                message: 'Ảnh slider không để trống.'
                            }
                        ]}
                    >
                        <Upload
                            beforeUpload={false}
                            listType="picture-card"
                            fileList={sliderFile}
                            onPreview={handlePreviewImage}
                            onChange={handleSliderChange}
                            maxCount={1}
                            accept=".png, .jpeg, .jpg"
                        >
                            {sliderFile.length < 1 ? <div>
                                <PlusOutlined />
                                <div
                                    style={{
                                        marginTop: 8,
                                    }}
                                >
                                    Tải lên
                                </div>
                            </div> : null}
                        </Upload>
                    </Form.Item>

                    <Form.Item name='productId' label="Id sản phẩm liên quan" labelAlign="left" style={{ width: '100%' }}>
                        <Row gutter={8}>
                            <Col span={17}>
                                <Input style={{ width: '100%' }} />
                            </Col>
                        </Row>
                    </Form.Item>
                    <Row gutter={8}>
                        <Col span={17}>
                            <Form.Item name="isActive" label="Trạng thái" labelAlign="left" style={{ width: '100%' }}>
                                <Switch checkedChildren="Hiển thị" unCheckedChildren="Ẩn" />
                            </Form.Item>
                        </Col>
                    </Row>

                    <Form.Item>
                        <Row>
                            <Col offset={4}>
                                <Button type="primary" htmlType="submit" loading={isLoadingButtonAdd}>Thêm mới</Button>
                            </Col>
                        </Row>
                    </Form.Item>
                </Form>

            </Row >
        </Card >
    </Spinning>)
}

export default AddSlider;