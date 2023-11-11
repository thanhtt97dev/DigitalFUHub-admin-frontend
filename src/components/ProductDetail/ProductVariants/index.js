import React, { useEffect } from "react";
import { Card, Table } from "antd"

import {
    formatPrice,
} from '~/utils/index'

const columns = [
    {
        title: 'STT',
        dataIndex: 'index',
        width: '5%',
    },
    {
        title: 'Tên phân loại',
        dataIndex: 'name',
        width: '30%',
    },
    {
        title: 'Giá',
        dataIndex: 'price',
        width: '30%',
        render: (price) => {
            return (
                <span>{formatPrice(price)}</span>
            )
        }
    },
    {
        title: 'Giảm giá',
        dataIndex: 'discount',
        width: '30%',
        render: (discount) => {
            return (
                <span>{discount} %</span>
            )
        }
    },
];

function ProductVariants({ productVariants }) {

    useEffect(() => {
        for (let index = 0; index < productVariants.length; index++) {
            productVariants[index].key = index + 1
            productVariants[index].index = index + 1
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <>
            <Card
                title="Danh sách phân loại sản phẩm"
            >
                <Table
                    columns={columns}
                    pagination={false}
                    dataSource={productVariants}
                    rowKey={(record, index) => index}
                />
            </Card>
        </>
    );
}

export default ProductVariants;