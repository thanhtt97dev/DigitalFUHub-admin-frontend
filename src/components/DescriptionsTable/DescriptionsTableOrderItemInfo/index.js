import React from 'react';
import { Descriptions, Space, Typography, Rate } from 'antd';

import {
    formatPrice,
} from '~/utils/index'

import ModalViewFeedBackDetail from '~/components/Modals/ModalViewFeedBackDetail';

const { Text } = Typography;

function DescriptionsTableOrderItemInfo({ orderDeatail }) {

    const items = [
        {
            key: '1',
            label: 'Giá',
            children: <>
                {
                    orderDeatail.discount === 0 ?
                        <Text>{formatPrice(parseInt(orderDeatail.price))}</Text>
                        :
                        <Space size={[8, 0]}>
                            <Text delete>{formatPrice(parseInt(orderDeatail.price))}</Text>
                            <Text>{formatPrice(parseInt(orderDeatail.price - (orderDeatail.price * orderDeatail.discount / 100)))}</Text>
                        </Space>
                }
            </>
            ,
            span: 3
        },
        {
            key: '2',
            label: 'Số lượng',
            children: `x ${orderDeatail.quantity}`,
            span: 3
        },
        {
            key: '3',
            label: 'Thành tiền',
            children: `${formatPrice(orderDeatail.totalAmount)}`,
            span: 3
        },
        {
            key: '4',
            label: 'Đánh giá',
            children: orderDeatail.isFeedback ?
                <>
                    <Rate disabled defaultValue={orderDeatail.feedbackRate} />
                    <ModalViewFeedBackDetail orderId={orderDeatail.orderDetailId} />
                </>
                :
                "Chưa có đánh giá",
            span: 3
        },
    ];



    return (
        <Descriptions size='small' layout="horizontal" bordered items={items} />
    );
}

export default DescriptionsTableOrderItemInfo;