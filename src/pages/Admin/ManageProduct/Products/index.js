import React, { useEffect, useState } from "react";
import { Card } from 'antd';

import Spinning from "~/components/Spinning";

import { getProducts } from "~/api/product";
import {
    RESPONSE_CODE_SUCCESS,
    PRODUCT_STATUS_ACTIVE,
    PRODUCT_STATUS_HIDE,
    PRODUCT_STATUS_BAN
} from "~/constants";
import TableProduct from "~/components/Tables/TableProduct";


const tabList = [
    {
        label: "Tất cả",
        key: "tab1",
    },
    {
        label: "Đang hoạt động",
        key: "tab2",
    },
    {
        label: "Đã ẩn",
        key: "tab3",
    },
    {
        label: "Vi phạm",
        key: "tab4",
    },
]

function Products() {

    const [loading, setLoading] = useState(false);

    const [searchParams, setSearchParams] = useState({
        shopName: "",
        productName: "",
        productCategory: 0,
        soldMin: 0,
        soldMax: 0,
        page: 1
    })
    const [dataTable, setDataTable] = useState([])
    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: 10,
        },
    });

    useEffect(() => {
        getProducts(searchParams)
            .then((res) => {
                if (res.data.status.responseCode === RESPONSE_CODE_SUCCESS) {
                    setDataTable(res.data.result.products)
                    setTableParams({
                        ...tableParams,
                        pagination: {
                            ...tableParams.pagination,
                            total: res.result.totalPages,
                        },
                    });
                    setLoading(false)
                }
            })
            .catch((err) => {

            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const handleTableChange = (pagination, filters, sorter) => {
        setTableParams({
            pagination,
            filters,
            ...sorter,
        });

        // `dataSource` is useless since `pageSize` changed
        if (pagination.pageSize !== tableParams.pagination?.pageSize) {
            setDataTable([]);
        }
    };

    const [activeTabKey, setActiveTabKey] = useState('tab1');
    const onTabChange = (key) => {
        setActiveTabKey(key);
        setLoading(true);
    };
    const contentList = {
        tab1: <TableProduct tableParams={tableParams} handleTableChange={handleTableChange} data={dataTable} />,
        tab2: <TableProduct tableParams={tableParams} handleTableChange={handleTableChange} data={dataTable.filter(x => x.productStatusId === PRODUCT_STATUS_ACTIVE)} />,
        tab3: <TableProduct tableParams={tableParams} handleTableChange={handleTableChange} data={dataTable.filter(x => x.productStatusId === PRODUCT_STATUS_HIDE)} />,
        tab4: <TableProduct tableParams={tableParams} handleTableChange={handleTableChange} data={dataTable.filter(x => x.productStatusId === PRODUCT_STATUS_BAN)} />
    };

    return (
        <>
            <Card
                style={{
                    width: '100%',
                    minHeight: '100vh'
                }}
                tabList={tabList}
                activeTabKey={activeTabKey}
                onTabChange={onTabChange}
            >

                {contentList[activeTabKey]}
            </Card>
        </>
    );
}

export default Products;