import { useLayoutEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, Row, Col, Button, Typography, Divider, Image, Tooltip } from "antd";
import {
    ShopOutlined,
    MessageOutlined,
} from "@ant-design/icons";


import { getConversation } from '~/api/chat'
import {
    RESPONSE_CODE_SUCCESS,
} from '~/constants'
import DescriptionsTableOrderItemInfo from "~/components/DescriptionsTable/DescriptionsTableOrderItemInfo";

const { Text, Title } = Typography;

function OrderItemProducts({ order }) {
    const navigate = useNavigate()

    const handleOpenChatWithSeller = () => {
        var data = { shopId: order.shopId, userId: order.customerId }
        getConversation(data)
            .then((res) => {
                if (res.data.status.responseCode === RESPONSE_CODE_SUCCESS) {
                    navigate('/chatBox', { state: { data: res.data.result } })
                }
            })
            .catch(() => {

            })
    }

    useLayoutEffect(() => {
        if (order.orderDetails === null || order.orderDetails === undefined) {
            order.orderDetails = []
        }
    }, [order])

    return (
        <>
            <Card
                title={<Row gutter={[8, 0]} align="bottom">
                    <Col>
                        <Title level={5}><ShopOutlined style={{ fontSize: '18px' }} /></Title>
                    </Col>
                    <Col>
                        <Title level={5}>{order.shopName}</Title>
                    </Col>
                    <Col>
                        <Title level={5}>
                            <Button
                                type="default"
                                size="small"
                                icon={<ShopOutlined />}
                            >
                                Xem cửa hàng
                            </Button></Title>
                    </Col>
                    <Col>
                        <Title level={5}>
                            <Button
                                type="default"
                                size="small"
                                icon={<MessageOutlined />}
                                onClick={handleOpenChatWithSeller}
                            >
                                Nhắn tin
                            </Button></Title>
                    </Col>
                </Row>}
                hoverable
            >
                <Row gutter={[0, 16]}>
                    {order.orderDetails.map((v, i) => {
                        return (<Col span={24}>
                            <Row gutter={[8, 8]}>
                                <Col flex={0} span={3}>
                                    <Link to={`/product/${v.productId}`}>
                                        <Image
                                            width={120}
                                            height={75}
                                            src={v.productThumbnail}
                                            preview={false}
                                        />
                                    </Link>
                                </Col>
                                <Col span={8} style={{ borderRight: "1px solid gray" }}>
                                    <Row>
                                        <h3 style={{ margin: "0px" }}>
                                            {v.productName.length > 70 ? <Tooltip title={v.productName}>{v.productName.slice(0, 70)}...</Tooltip> : v.productName}
                                        </h3>
                                    </Row>
                                    <Row>
                                        <Text>{`Phân loại hàng: ${v.productVariantName}`}</Text>
                                    </Row>
                                </Col>
                                <Col span={12}>
                                    <DescriptionsTableOrderItemInfo orderDeatail={v} />
                                </Col>
                            </Row>
                            {(() => {
                                if (i === order.orderDetails.length - 1) {
                                    return (<></>)
                                } else {
                                    return (<Divider />)
                                }
                            })()}
                        </Col>
                        )
                    })}
                </Row>
            </Card>


        </>
    );
}

export default OrderItemProducts;