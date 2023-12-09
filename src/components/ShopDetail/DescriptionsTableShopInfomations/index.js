import React, { useState } from 'react';
import ModalUpdateShopStatus from '~/components/Modals/ModalUpdateShopStatus';
import { Link } from 'react-router-dom';
import { LeftOutlined } from "@ant-design/icons";
import { formatPrice, formatLargeNumber } from "~/utils";
import { formatNumber, ParseDateTime } from '~/utils/index';
import { Descriptions, Space, Typography, Rate, Avatar, Tag, Card, Button } from 'antd';

///
require('moment/locale/vi');
const { Text } = Typography;
const moment = require('moment');
///

/// styles
const styleRatingStar = { color: '#ee4d2d', fontSize: '.925rem', borderBottom: '1px solid white' };
const styleRevenue = {
    whiteSpace: 'nowrap',
    fontSize: '20px',
    color: '#007bff',
    maxWidth: '130px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
};
///


function DescriptionsTableShopInfomations({ shop, calculatorRatingStarProduct, reloadShopInformations, notification, }) {
    /// states
    const [openModal, setOpenModal] = useState(false);
    ///

    /// handles
    const handleOpenModal = () => {
        setOpenModal(true);
    }
    ///

    const items = [
        {
            key: '1',
            label: 'Ảnh đại diện',
            labelStyle: { 'text-align': 'left', 'width': "40%" },
            children: (
                <Avatar size={60} src={shop.avatar} alt='shop avatars' />
            ),
            span: 4
        },
        {
            key: '2',
            label: 'Mã cửa hàng',
            labelStyle: { 'text-align': 'left', 'width': "40%" },
            children: <Text>{shop.userId}</Text>,
            span: 3
        },
        {
            key: '3',
            label: 'Tên cửa hàng',
            labelStyle: { 'text-align': 'left', 'width': "40%" },
            children: (
                <span> {shop.shopName}</span>
            ),
            span: 3
        },
        {
            key: '4',
            label: 'Email',
            labelStyle: { 'text-align': 'left', 'width': "40%" },
            children: <Text>{shop.shopEmail}</Text>,
            span: 3
        },
        {
            key: '5',
            label: 'Ngày tạo',
            labelStyle: { 'text-align': 'left', 'width': "40%" },
            children: <Text>{ParseDateTime(shop.dateCreate)}</Text>,
            span: 3
        },
        {
            key: '6',
            label: 'Ngày đình chỉ hoạt động:',
            labelStyle: { 'text-align': 'left', 'width': "40%" },
            children: <Text>{shop.isActive === false ? ParseDateTime(shop.dateBan) : "---"}</Text>,
            span: 3
        },
        {
            key: '8',
            label: 'Đánh giá',
            labelStyle: { 'text-align': 'left', 'width': "40%" },
            children: <Space align='center'><Rate disabled value={calculatorRatingStarProduct()} style={styleRatingStar} /><Text>({shop.numberFeedback ? formatNumber(shop.numberFeedback) : 0} Đánh giá)</Text></Space>,
            span: 3
        },
        {
            key: '9',
            label: 'Trạng thái hoạt động',
            labelStyle: { 'text-align': 'left', 'width': "40%" },
            children: (<>
                {shop.user?.isOnline ? <Text>Đang hoạt động</Text> : <Text>Hoạt động {moment(shop.user?.lastTimeOnline).fromNow()}</Text>}
            </>),
            span: 3
        },
        {
            key: '10',
            label: 'Tổng số lượng đơn hàng',
            labelStyle: { 'text-align': 'left', 'width': "40%" },
            children: (<Text>{shop.totalNumberOrder}</Text>),
            span: 3
        },
        {
            key: '11',
            label: 'Tổng số lượng sản phẩm',
            labelStyle: { 'text-align': 'left', 'width': "40%" },
            children: (<Text>{shop.totalNumberProduct}</Text>),
            span: 3
        },
        {
            key: '12',
            label: 'Số lượng sản phẩm đã bán',
            labelStyle: { 'text-align': 'left', 'width': "40%" },
            children: (<Text>{formatLargeNumber(shop.numberProductsSold ? shop.numberProductsSold : 0)}</Text>),
            span: 3
        },
        {
            key: '13',
            label: 'Số lượng đơn hàng đang chờ xác nhận',
            labelStyle: { 'text-align': 'left', 'width': "40%" },
            children: (<Text>{shop.numberOrderWaitConfirmation}</Text>),
            span: 3
        },
        {
            key: '14',
            label: 'Số lượng đơn hàng đã xác nhận',
            labelStyle: { 'text-align': 'left', 'width': "40%" },
            children: (<Text>{shop.numberOrderConfirmed}</Text>),
            span: 3
        },
        {
            key: '15',
            label: 'Số lượng đơn hàng đã vi phạm',
            labelStyle: { 'text-align': 'left', 'width': "40%" },
            children: (<Text>{shop.numberOrderViolated}</Text>),
            span: 3
        },
        {
            key: '16',
            label: 'Doanh thu',
            labelStyle: { 'text-align': 'left', 'width': "40%" },
            children: (<p style={styleRevenue} title={formatPrice(shop.revenue)}>
                {formatPrice(shop.revenue)}
            </p>),
            span: 3
        },
        {
            key: '17',
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
                                <Tag color='#f50'>Vi phạm</Tag>
                            )
                        }
                    })()}
                    <Button
                        onClick={handleOpenModal}
                        type="link">
                        Chỉnh sửa
                    </Button>
                    {
                        !shop.isActive ? (<Card bodyStyle={{ padding: 6, backgroundColor: 'lightblue' }}>
                            <span>Chú thích: {shop.note}</span>
                        </Card>) : (<></>)
                    }

                    <ModalUpdateShopStatus shopId={shop.userId} reloadShopInformations={reloadShopInformations} notification={notification} openModal={openModal} setOpenModal={setOpenModal} />
                </>
            ),
            span: 3
        },
    ];



    return (<Card title={<Space align='center' size={20}><Link to={"/admin/shop"}> <LeftOutlined /> Trở lại</Link><p style={{ fontSize: '0.985rem' }}>Thông tin chi tiết cửa hàng</p></Space>}>
        <Descriptions size='small' layout="horizontal" bordered items={items} />
    </Card>
    );
}

export default DescriptionsTableShopInfomations;