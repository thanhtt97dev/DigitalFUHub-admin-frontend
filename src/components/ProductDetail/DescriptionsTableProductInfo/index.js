import React from 'react';
import { Link } from 'react-router-dom';
import { Descriptions, Space, Typography, Rate, Avatar, Tooltip, Tag } from 'antd';

import {
    formatPrice,
    ParseDateTime
} from '~/utils/index'
import {
    PRODUCT_STATUS_ACTIVE,
    PRODUCT_STATUS_HIDE,
    PRODUCT_STATUS_BAN
} from "~/constants";
import ModalUpdateProductStatus from '~/components/Modals/ModalUpdateProductStatus';


const { Text } = Typography;

function DescriptionsTableProductInfo({ product, callBack }) {
    const items = [
        {
            key: '1',
            label: 'Mã sản phẩm',
            labelStyle: { 'text-align': 'left', 'width': "40%" },
            children: <Text>{product.productId}</Text>
            ,
            span: 3
        },
        {
            key: '2',
            label: 'Tên sản phẩm',
            labelStyle: { 'text-align': 'left', 'width': "40%" },
            children: <Text>{product.productName}</Text>
            ,
            span: 3
        },
        {
            key: '3',
            label: 'Thể loại',
            labelStyle: { 'text-align': 'left', 'width': "40%" },
            children: <Text>{product.categoryName}</Text>,
            span: 3
        },
        {
            key: '4',
            label: 'Tên cửa hàng',
            labelStyle: { 'text-align': 'left', 'width': "40%" },
            children: (
                <Link to={`/admin/shop/${product.shopId}`}>
                    <Avatar src={product.shopAvatar} alt='shop avatars' />
                    <span> {product.shopName}</span>
                </Link>
            ),
            span: 3
        },
        {
            key: '5',
            label: 'Giá',
            labelStyle: { 'text-align': 'left', 'width': "40%" },
            children: (
                <>
                    {(() => {
                        var maxPrice = Math.max(...product.productVariants.map(productVariant => productVariant.price))
                        var minPrice = Math.min(...product.productVariants.map(productVariant => productVariant.price))
                        if (product.productVariants.length === 1) {
                            return <span>{formatPrice(maxPrice)}</span>
                        } else {
                            return <span>{formatPrice(minPrice)} - {formatPrice(maxPrice)}</span>
                        }
                    })()}
                </>
            ),
            span: 3
        },
        {
            key: '7',
            label: 'Số lượt xem',
            labelStyle: { 'text-align': 'left', 'width': "40%" },
            children: (
                <>
                    {product.viewCount === 0 ?
                        "Chưa có lượt xem nào"
                        :
                        <p>{product.viewCount} lượt</p>
                    }
                </>

            ),
            span: 3
        },
        {
            key: '8',
            label: 'Số lượt thích',
            labelStyle: { 'text-align': 'left', 'width': "40%" },
            children: (
                <>
                    {product.likeCount === 0 ?
                        "Chưa có lượt thích nào"
                        :
                        <p>{product.likeCount} lượt</p>
                    }
                </>

            ),
            span: 3
        },
        {
            key: '9',
            label: 'Số lượt bán',
            labelStyle: { 'text-align': 'left', 'width': "40%" },
            children: (
                <>
                    {product.soldCount === 0 ?
                        "Chưa bán được sản phẩm nào"
                        :
                        <b>{product.soldCount}</b>
                    }
                </>

            ),
            span: 3
        },
        {
            key: '10',
            label: 'Đánh giá',
            labelStyle: { 'text-align': 'left', 'width': "40%" },
            children: (
                <>
                    {product.numberFeedback === 0 ? "Chưa có đánh giá" :
                        <>
                            <Tooltip placement='top' title={product.totalRatingStar / product.numberFeedback}>
                                <Rate disabled defaultValue={product.totalRatingStar / product.numberFeedback} />
                            </Tooltip>
                            <span> | </span>
                            <b>{product.numberFeedback}</b> lượt
                        </>
                    }
                </>

            ),
            span: 3
        },
        {
            key: '11',
            label: 'Nhãn',
            labelStyle: { 'text-align': 'left', 'width': "40%" },
            children: (
                <>
                    {product.tags.map(tag => {
                        var colors = ['#ff0000', '#00ff00', '#0000ff'];
                        var random_color = colors[Math.floor(Math.random() * colors.length)];
                        return <Tag color={random_color}>{tag}</Tag>
                    })}
                </>
            ),
            span: 3
        },
        {
            key: '12',
            label: 'Ngày tạo',
            labelStyle: { 'text-align': 'left', 'width': "40%" },
            children: (
                <>{ParseDateTime(product.dateCreate)}</>
            ),
            span: 3
        },
        {
            key: '13',
            label: 'Ngày cập nhật gần nhất',
            labelStyle: { 'text-align': 'left', 'width': "40%" },
            children: (
                <>{ParseDateTime(product.dateUpdate)}</>
            ),
            span: 3
        },
        {
            key: '14',
            label: 'Trạng thái',
            labelStyle: { 'text-align': 'left', 'width': "40%" },
            children: (
                <>
                    {(() => {
                        if (product.productStatusId === PRODUCT_STATUS_ACTIVE) {
                            return (
                                <Tag color='#87d068'>Đang hoạt động</Tag>
                            )
                        } else if (product.productStatusId === PRODUCT_STATUS_HIDE) {
                            return (
                                <Tag color='gray'>Đã ẩn</Tag>
                            )
                        } else if (product.productStatusId === PRODUCT_STATUS_BAN) {
                            return (
                                <Space direction='vertical'>
                                    <Tag color='#f50'>Vi phạm</Tag>
                                    <Space direction='vertical'>
                                        <span>Chú thích:</span>
                                        <span>{product.note}</span>
                                    </Space>

                                </Space>

                            )
                        } else {
                            return <></>
                        }
                    })()}
                    <ModalUpdateProductStatus productId={product.productId} callBack={callBack} />
                </>
            ),
            span: 3
        },
    ];



    return (
        <Descriptions size='small' layout="horizontal" bordered items={items} />
    );
}

export default DescriptionsTableProductInfo;