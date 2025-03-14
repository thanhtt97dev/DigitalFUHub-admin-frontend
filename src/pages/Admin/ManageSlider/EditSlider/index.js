import React, { useState, useContext, useEffect } from "react";
import validator from 'validator';
import classNames from 'classnames/bind';
import Spinning from "~/components/Spinning";
import BoxImage from "~/components/BoxImage";
import styles from './EditSlider.module.scss';
import ModelConfirmation from "~/components/Modals/ModalConfirmation";
import { useAuthUser } from 'react-auth-kit';
import { UPLOAD_FILE_SIZE_LIMIT } from '~/constants';
import { getSlider, updateSlider } from "~/api/slider";
import { useNavigate, useParams } from 'react-router-dom';
import { NotificationContext } from "~/context/UI/NotificationContext";
import { QuestionCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { Col, Row, Form, Input, Button, Upload, Card, Tooltip, Modal, Space, Switch } from 'antd';
import { RESPONSE_CODE_SUCCESS, RESPONSE_CODE_NOT_ACCEPT, RESPONSE_CODE_DATA_NOT_FOUND } from '~/constants';


///
const cx = classNames.bind(styles);
///

/// styles
const styleCardEditSlider = { width: '100%' }
///

const EditSlider = () => {
    /// states
    const { id } = useParams();
    const navigate = useNavigate();
    const [isOpenModalEditSlider, setIsOpenModalEditSlider] = useState(false);
    const [slider, setSlider] = useState({});
    const [isLoadingButtonEditSlider, setIsLoadingButtonEditSlider] = useState(false);
    const [isLoadingSpinning, setIsLoadingSpinning] = useState(false);
    const [previewImage, setPreviewImage] = useState('');
    const [sliderSrc, setsliderSrc] = useState([]);
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

    /// useEffects
    useEffect(() => {
        if (user === undefined || user === null) return navigate('/login');
        if (id === 0) return;

        setIsLoadingSpinning(true);

        getSlider(id)
            .then(res => {
                if (res.status === 200) {
                    const data = res.data;
                    const status = data.status;
                    if (status.responseCode === RESPONSE_CODE_SUCCESS) {
                        const result = data.result;
                        setSlider(result);
                        setsliderSrc([{ src: result.url, file: null }]);

                        form.setFieldValue("name", result.name);
                        form.setFieldValue("link", result.link);
                        form.setFieldValue("isActive", result.isActive);

                    } else if (status.responseCode === RESPONSE_CODE_DATA_NOT_FOUND) {
                        notification("error", "Slider không tồn tại");
                    }
                }
            })
            .catch(err => { })
            .finally(() => {
                setTimeout(() => {
                    setIsLoadingSpinning(false);
                }, 500);
            })

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id])
    ///

    /// handles
    const handleOkEditSlider = () => {
        if (user === undefined || user === null) return navigate('/login');
        form.submit();
    }


    const handleCancelEditSlider = () => {
        setIsOpenModalEditSlider(false);
    }

    const handleCancelPage = () => {
        return navigate('/admin/slider');
    }

    const getBase64 = (file) =>
        new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
        });

    const onFinish = (values) => {
        if (user === undefined || user === null) return navigate('/login');
        if (id === 0) return;

        setIsLoadingButtonEditSlider(true);

        const { name, link, isActive } = values;

        // request dto
        const requestDto = {
            SliderId: id,
            Name: name,
            Image: sliderSrc[0]?.file ? sliderSrc[0]?.file : null,
            link: link,
            IsActive: isActive
        }

        updateSlider(requestDto)
            .then((res) => {
                if (res.status === 200) {
                    const data = res.data;
                    if (data.status.responseCode === RESPONSE_CODE_SUCCESS) {
                        notification("success", "Cập nhật slider thành công");
                        setIsLoadingButtonEditSlider(false);
                        navigate('/admin/slider');
                    } else if (
                        data.status.responseCode === RESPONSE_CODE_NOT_ACCEPT
                        ||
                        data.status.responseCode === RESPONSE_CODE_DATA_NOT_FOUND) {
                        notification("error", "Yêu cầu không hợp lệ. Vui lòng thử lại!");
                        setIsLoadingButtonEditSlider(false);
                    }
                }
            })
            .catch((error) => {
                notification("error", "Có lỗi xảy ra từ hệ thống. Vui lòng thử lại sau!");
                setIsLoadingButtonEditSlider(false);
            })
    }

    const handleSliderChange = async (info) => {
        if (info.file.size > UPLOAD_FILE_SIZE_LIMIT) {
            setMsgNotificationFileExceedLimit([`"${info.file.name}" không thể được tải lên.`])
            setOpenNotificationFileExceedLimit(true);
        } else {
            const urlBase64 = await getBase64(info.file.originFileObj);
            setsliderSrc([{ src: urlBase64, file: info.file.originFileObj }])
        }
    };

    const handleCancel = () => setPreviewOpen(false);

    const handleEditSlider = () => {
        if (user === undefined || user === null) return navigate('/login');

        setIsOpenModalEditSlider(true);
    }

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

    const linkProductValidator = (value) => {
        let linkProduct = form.getFieldValue(value.field);
        if (linkProduct === undefined || linkProduct === "") {
            return Promise.reject('Link sản phẩm không được để trống');
        }

        const trimmedValue = linkProduct.replace(/\s+/g, ' ');

        if (!validator.isURL(trimmedValue, { protocols: ["http", "https"], require_tld: false, require_protocol: true })) {
            return Promise.reject('Link không hợp lệ');
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
        <Modal open={previewOpen} title={previewImageTitle} footer={null} onCancel={handleCancel}>
            <img
                alt="thumbnail"
                style={{
                    width: '100%',
                }}
                src={previewImage}
            />
        </Modal >
        <Card title="Cập nhật Slider" style={styleCardEditSlider} bodyStyle={{ padding: '20px 20%' }} type="inner">
            <Form
                layout="vertical"
                name="control-hooks"
                form={form}
                onFinish={onFinish}
                labelWrap >
                <Form.Item name='name' label={<lable style={{ fontSize: 14 }}>Tên Slider <Tooltip title="Tên Slider được hiển thị trong phần quản lý"><QuestionCircleOutlined /></Tooltip></lable>} style={{ width: '100%' }}
                    rules={[
                        {
                            required: true,
                            message: 'Tên slider không được để trống'
                        },
                        {
                            validator: nameSliderValidator
                        }
                    ]}
                >
                    <Row>
                        <Input style={{ width: '100%' }} value={slider.name} onChange={(e) => setSlider({ ...slider, name: e.target.value })} />
                    </Row>

                </Form.Item>

                <Form.Item
                    name='imageSlider'
                    label={<label style={{ fontSize: 14 }}>Ảnh slider (Hình ảnh tỷ lệ 1:3) <Tooltip title="Ảnh được hiển thị tại trang chủ"><QuestionCircleOutlined /></Tooltip></label>}

                    validateTrigger={["onBlur", "onChange", "onFocus", "onMouseEnter", "onMouseLeave", "onKeyDown"]}
                    rules={[
                        (getFieldValue) => ({
                            validator(_, value) {
                                if (sliderSrc[0] !== undefined) {
                                    return Promise.resolve();
                                }
                                return Promise.reject('Ảnh slider không để trống');
                            },
                        }),
                    ]}>
                    <Space direction="horizontal" style={{ marginTop: `${sliderSrc[0] === undefined ? '0px' : '8px'}` }}>
                        {
                            sliderSrc[0] !== undefined
                            && <BoxImage src={sliderSrc[0].src}
                                onPreview={() => {
                                    var filename = sliderSrc[0].file !== null ?
                                        sliderSrc[0].file.name :
                                        sliderSrc[0].src.substring(sliderSrc[0].src.lastIndexOf('/') + 1);
                                    setPreviewImage(sliderSrc[0].src);
                                    setPreviewImageTitle(filename);
                                    setPreviewOpen(true);
                                }} onRemove={() => setsliderSrc([])} />
                        }

                        {
                            sliderSrc[0] === undefined
                            && <Upload
                                beforeUpload={false}
                                listType="picture-card"
                                fileList={sliderSrc}
                                onPreview={handlePreviewImage}
                                onChange={handleSliderChange}
                                maxCount={1}
                                accept=".png, .jpeg, .jpg"
                            >
                                <div style={{ marginTop: 8 }}>
                                    <PlusOutlined />&nbsp;
                                    Tải lên
                                </div>
                            </Upload>
                        }

                    </Space>
                </Form.Item>
                <Form.Item name='link'
                    label={<lable style={{ fontSize: 14 }}>Link sản phẩm liên quan <Tooltip title="Link sản phẩm liên quan đến slider"><QuestionCircleOutlined /></Tooltip></lable>}
                    style={{ width: '100%' }}
                    rules={[
                        {
                            validator: linkProductValidator
                        }
                    ]}>
                    <Row>
                        <Input value={slider.link} style={{ width: '100%' }} onChange={(e) => setSlider({ ...slider, link: e.target.value })} />
                    </Row>
                </Form.Item>
                <Row gutter={8}>
                    <Col span={17}>
                        <Form.Item name="isActive" label={<lable style={{ fontSize: 14 }}>Trạng thái <Tooltip title="Trạng thái hiển thị slider trên trang chủ"><QuestionCircleOutlined /></Tooltip></lable>} labelAlign="left" valuePropName="checked" style={{ width: '100%' }}>
                            <Switch
                                checkedChildren="Hiển thị"
                                unCheckedChildren="Ẩn"
                            />
                        </Form.Item>
                    </Col>
                </Row>

                <Form.Item>
                    <Row className={cx('flex-item-center')}>
                        <Space align="center">
                            <Button type="primary" danger ghost onClick={handleCancelPage}>Quay lại danh sách</Button>
                            <Button type="primary" onClick={handleEditSlider} ghost >Cập nhật</Button>
                        </Space>
                    </Row>
                </Form.Item>
            </Form>
        </Card >
        <ModelConfirmation title="Chỉnh sửa slider"
            isOpen={isOpenModalEditSlider}
            onOk={handleOkEditSlider}
            onCancel={handleCancelEditSlider}
            contentModal="Bạn có chắc chắn muốn chỉnh sửa thông tin của slider này không?"
            contentButtonCancel="Không"
            contentButtonOk="Có"
            isLoading={isLoadingButtonEditSlider} />
    </Spinning>)
}

export default EditSlider;