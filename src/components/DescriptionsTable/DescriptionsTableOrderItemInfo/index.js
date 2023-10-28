import React from 'react';
import { Descriptions, Space, Typography, Rate, Button } from 'antd';

import { formatStringToCurrencyVND } from '~/utils/index'


const { Text } = Typography;

function DescriptionsTableOrderItemInfo({ orderDeatail }) {
    const items = [
        {
            key: '1',
            label: 'Giá',
            children: <>
                {
                    orderDeatail.discount === 0 ?
                        <Text>{formatStringToCurrencyVND(orderDeatail.price)}₫</Text>
                        :
                        <Space size={[8, 0]}>
                            <Text delete>{formatStringToCurrencyVND(orderDeatail.price)}₫</Text>
                            <Text>{formatStringToCurrencyVND(orderDeatail.price - (orderDeatail.price * orderDeatail.discount / 100))}₫</Text>
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
            children: `${formatStringToCurrencyVND(orderDeatail.totalAmount)}đ`,
            span: 3
        },
        {
            key: '4',
            label: 'Đánh giá',
            children: orderDeatail.isFeedback ?
                <>
                    <Rate disabled defaultValue={orderDeatail.feedbackRate} />
                    <Button type='link' >Chi tiết</Button>
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