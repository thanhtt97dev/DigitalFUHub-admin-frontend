import React, { useState } from 'react';
import { Link } from 'react-router-dom'
import { Modal, Col, Row, Image, Typography, Rate, Button, Avatar } from 'antd';

import {
    ParseDateTime,
    getUserId
} from '~/utils/index'
import {
    RESPONSE_CODE_SUCCESS
} from '~/constants'

import { getFeedbackDetail } from "~/api/feedback";
import logoFPT from '~/assets/images/fpt-logo.jpg'

const { Text, Title, Paragraph } = Typography;

function ModalViewFeedBackDetail({ orderId }) {

    const [isModalViewFeedbackOpen, setIsModalViewFeedbackOpen] = useState(false);
    const [feedbackDetail, setFeedbackDetail] = useState([]);
    const showModalViewFeedback = () => {
        setIsModalViewFeedbackOpen(true);
    };
    const handleViewFeedbackOk = () => {
        setIsModalViewFeedbackOpen(false);
    }
    const handleViewFeedbackCancel = () => {
        setIsModalViewFeedbackOpen(false);
    }

    const handleCustomerViewFeedback = () => {
        getFeedbackDetail(getUserId(), orderId)
            .then((res) => {
                if (res.data.status.responseCode === RESPONSE_CODE_SUCCESS) {
                    setFeedbackDetail(res.data.result);
                    showModalViewFeedback();
                }
            })
            .catch((err) => {
            })
    }

    return (
        <>
            <Button type="link" onClick={handleCustomerViewFeedback}>Chi tiết</Button>
            <Modal title="Đánh giá cửa hàng" open={isModalViewFeedbackOpen} onOk={handleViewFeedbackOk} onCancel={handleViewFeedbackCancel}
                footer={[
                    <Button key="close" onClick={handleViewFeedbackOk}>
                        Đóng
                    </Button>,
                ]}
            >
                <Row gutter={[0, 16]}>
                    {feedbackDetail.map((v, i) => <>
                        <Col span={24} key={i}>
                            <Row gutter={[8, 8]} wrap={false}>
                                <Col flex={0}>
                                    <Link to={`/product/${v.productId}`}>
                                        <Image
                                            preview={false}
                                            width={60}
                                            src={v.thumbnail}
                                        />
                                    </Link>
                                </Col>
                                <Col flex={5}>
                                    <Row>
                                        <Col span={23}><Title level={5}>{v.productName}</Title></Col>
                                        <Col span={23}><Text>{`Phân loại: ${v.productVariantName} x ${v.quantity}`}</Text></Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Col>
                        <Col span={23} offset={1}>
                            <Row gutter={[8, 8]} wrap={false}>
                                <Col flex={0}>
                                    <Avatar size="large" src={v.avatar || logoFPT} />
                                </Col>
                                <Col flex={5} >
                                    <Row >
                                        <Col span={23}><Text>{v.username}</Text></Col>
                                        <Col span={23}><Rate value={v.rate} disabled style={{ fontSize: "14px" }} /></Col>
                                        <Col span={23}><Paragraph>{v.content}</Paragraph></Col>
                                        <Col span={23} >
                                            <Row gutter={[8, 8]}>
                                                {v?.urlImages?.map((url, i) => <Col>
                                                    <Image
                                                        width={80}
                                                        src={url}
                                                        preview={{
                                                            movable: false,
                                                        }}
                                                    />
                                                </Col>)}
                                            </Row>
                                        </Col>
                                        <Col span={23}><Text>{ParseDateTime(v.date)}</Text></Col>
                                    </Row>
                                </Col>
                            </Row>
                        </Col>
                    </>)}

                </Row>
            </Modal>
        </>
    );
}

export default ModalViewFeedBackDetail;