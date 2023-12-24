import React from "react";
import { Table, Image, Row, Col, Tooltip } from 'antd';

import { Link } from "react-router-dom";
import {
    formatPrice,
    sliceText
} from "~/utils";


const columns = [
    {
        title: 'ID',
        dataIndex: 'shopId',
        width: '7%',
    },
    {
        title: 'Tên shop',
        dataIndex: 'shopName',
        render: (shopName, record) => {
            return (
                <Row>
                    <Col>
                        <Image src={record.avatar} preview={false} width={56} height={56} />
                    </Col>
                    <Col style={{ paddingLeft: "10px" }}>
                        <Row>
                            <b>{sliceText(record.shopName, 35)}</b>
                        </Row>
                    </Col>
                </Row>
            )
        },
        width: '27%',
    },
    {
        title: 'Email người tạo',
        dataIndex: 'shopEmail',
        width: '20%',
        render: (shopEmail, record) => {
            return (
                <Link to={`/admin/user/${record.shopId}`}>{sliceText(shopEmail, 25)}</Link>
            )
        },
    },
    {
        title: 'Tổng số sản phẩm',
        dataIndex: 'totalProduct',
        width: '14%',
        render: (totalProduct) => {
            return (
                <span>{totalProduct}</span>
            )
        },
    },
    {
        title: <Tooltip placement="top" title="Số đơn hàng thành công / Tổng số đơn hàng">Doanh số</Tooltip>,
        dataIndex: 'numberOrderConfirmed',
        width: '10%',
        render: (numberOrderConfirmed, record) => {
            return (
                <span>{numberOrderConfirmed}/{record.totalNumberOrder}</span>
            )
        },
    },
    {
        title: 'Lợi nhuận',
        dataIndex: 'revenue',
        width: '15%',
        render: (revenue) => {
            return (
                <span>{formatPrice(revenue)}</span>
            )
        },
    },
    {
        title: '',
        dataIndex: 'shopId',
        render: (shopId) => {
            return (
                <Link to={`/admin/shop/${shopId}`}>Chi tiết</Link>
            )
        },
        fixed: "right",
        width: '10%',
    },
];


function TableShop({ data, tableParams, handleTableChange }) {

    return (
        <>
            <Table
                columns={columns}
                rowKey={(record, index) => index}
                dataSource={data}
                pagination={tableParams.pagination}
                onChange={handleTableChange}
            />
        </>
    );
}

export default TableShop;