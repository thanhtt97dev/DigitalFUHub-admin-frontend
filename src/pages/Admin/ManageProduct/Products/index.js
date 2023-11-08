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
        productStatusId: 0,
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
                            total: res.data.result.totalProduct,
                        },
                    });
                }
            })
            .catch((err) => {

            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams])

    const handleTableChange = (pagination, filters, sorter) => {
        setSearchParams({
            ...searchParams,
            page: pagination.current
        })
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
        switch (key) {
            case 'tab1':
                setSearchParams({
                    ...searchParams,
                    page: 1,
                    productStatusId: 0
                })
                break;
            case 'tab2':
                setSearchParams({
                    ...searchParams,
                    page: 1,
                    productStatusId: PRODUCT_STATUS_ACTIVE
                })
                break;
            case 'tab3':
                setSearchParams({
                    ...searchParams,
                    page: 1,
                    productStatusId: PRODUCT_STATUS_HIDE
                })
                break;
            case 'tab4':
                setSearchParams({
                    ...searchParams,
                    page: 1,
                    productStatusId: PRODUCT_STATUS_BAN
                })
                break;
            default: return;
        }
        setActiveTabKey(key);
    };
    const contentList = {
        tab1: <TableProduct tableParams={tableParams} handleTableChange={handleTableChange} data={dataTable} />,
        tab2: <TableProduct tableParams={tableParams} handleTableChange={handleTableChange} data={dataTable} />,
        tab3: <TableProduct tableParams={tableParams} handleTableChange={handleTableChange} data={dataTable} />,
        tab4: <TableProduct tableParams={tableParams} handleTableChange={handleTableChange} data={dataTable} />,
    };

    return (
        <>
            <Card
                style={{
                    width: '100%',
                    minHeight: '200px',
                    marginBottom: "20px"
                }}
            >


            </Card>
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