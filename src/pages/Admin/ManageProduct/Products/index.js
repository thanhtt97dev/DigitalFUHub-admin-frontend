import React, { useEffect, useState } from "react";
import { Table } from 'antd';

import Spinning from "~/components/Spinning";

import { getProducts } from "~/api/product";
import { RESPONSE_CODE_SUCCESS } from "~/constants";

const columns = [
    {
        title: 'Name',
        dataIndex: 'name',
        sorter: true,
        render: (name) => `${name.first} ${name.last}`,
        width: '20%',
    },
    {
        title: 'Gender',
        dataIndex: 'gender',
        filters: [
            {
                text: 'Male',
                value: 'male',
            },
            {
                text: 'Female',
                value: 'female',
            },
        ],
        width: '20%',
    },
    {
        title: 'Email',
        dataIndex: 'email',
    },
];

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
                    setDataTable(res.result.products)
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

    return (
        <>
            <Spinning spinning={loading}>
                <Table
                    columns={columns}
                    rowKey={(record) => record.login.uuid}
                    dataSource={dataTable}
                    pagination={tableParams.pagination}
                    loading={loading}
                    onChange={handleTableChange}
                />
            </Spinning>
        </>
    );
}

export default Products;