import React from 'react';
import { Link } from 'react-router-dom';
import { Descriptions, Space, Typography, Rate, Avatar, Tooltip, Tag, Card } from 'antd';

import {
    formatNumber,
    ParseDateTime
} from '~/utils/index'
import {
    PRODUCT_STATUS_ACTIVE,
    PRODUCT_STATUS_HIDE,
    PRODUCT_STATUS_BAN
} from "~/constants";
import ModalUpdateShopStatus from '~/components/Modals/ModalUpdateShopStatus';

///
require('moment/locale/vi');
const { Text } = Typography;
const moment = require('moment');
///


function DescriptionsTableShopInfomations({ shop, calculatorRatingStarProduct, reloadShopInformations, notification }) {
    const items = [
        {
            key: '1',
            label: 'Mã cửa hàng',
            labelStyle: { 'text-align': 'left', 'width': "40%" },
            children: <Text>{shop.userId}</Text>,
            span: 3
        },
        {
            key: '2',
            label: 'Tên cửa hàng',
            labelStyle: { 'text-align': 'left', 'width': "40%" },
            children: (
                <Link to={`/admin/shop/${shop.userId}`}>
                    <Space align='center' size={10}>
                        <Avatar size="large" src={shop.avatar} alt='shop avatars' />
                        <span> {shop.shopName}</span>
                    </Space>
                </Link>
            ),
            span: 3
        },
        {
            key: '3',
            label: 'Email',
            labelStyle: { 'text-align': 'left', 'width': "40%" },
            children: <Text>{shop.shopEmail}</Text>,
            span: 3
        },
        {
            key: '4',
            label: 'Ngày tạo',
            labelStyle: { 'text-align': 'left', 'width': "40%" },
            children: <Text>{ParseDateTime(shop.dateCreate)}</Text>,
            span: 3
        },
        {
            key: '5',
            label: 'Ngày đình chỉ hoạt động:',
            labelStyle: { 'text-align': 'left', 'width': "40%" },
            children: <Text>{shop.isActive === false ? ParseDateTime(shop.dateBan) : "---"}</Text>,
            span: 3
        },
        {
            key: '6',
            label: 'Mô tả',
            labelStyle: { 'text-align': 'left', 'width': "40%" },
            children: <Text>{shop.description}</Text>,
            span: 3
        },
        {
            key: '7',
            label: 'Đánh giá',
            labelStyle: { 'text-align': 'left', 'width': "40%" },
            children: <Text>{calculatorRatingStarProduct() ? calculatorRatingStarProduct().toFixed(1) : 0} ({shop.numberFeedback ? formatNumber(shop.numberFeedback) : 0} Đánh giá)</Text>,
            span: 3
        },
        {
            key: '8',
            label: 'Trạng thái hoạt động',
            labelStyle: { 'text-align': 'left', 'width': "40%" },
            children: (<>
                {shop.user?.isOnline ? <Text>Đang hoạt động</Text> : <Text>Hoạt động {moment(shop.user?.lastTimeOnline).fromNow()}</Text>}
            </>),
            span: 3
        },
        {
            key: '9',
            label: 'Trạng thái cửa hàng',
            labelStyle: { 'text-align': 'left', 'width': "40%" },
            children: (
                <>
                    {(() => {
                        if (shop.isActive === true) {
                            return (
                                <Tag color='#87d068'>Đang hoạt động</Tag>
                            )
                        } else {
                            return (
                                <Space direction='vertical'>
                                    <Tag color='#f50'>Vi phạm</Tag>
                                    <Space direction='vertical'>
                                        <Card bodyStyle={{ padding: 6, backgroundColor: 'lightblue' }}>
                                            <span>Chú thích: {shop.note}</span>
                                        </Card>
                                    </Space>

                                </Space>

                            )
                        }
                    })()}
                    <ModalUpdateShopStatus shopId={shop.userId} reloadShopInformations={reloadShopInformations} notification={notification} />
                </>
            ),
            span: 3
        },
    ];



    return (<Card title="Thông tin chi tiết cửa hàng">
        <Descriptions size='small' layout="horizontal" bordered items={items} />
    </Card>
    );
}

export default DescriptionsTableShopInfomations;