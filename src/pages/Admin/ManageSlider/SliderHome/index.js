import React, { useEffect, useState, useContext } from "react";
import { Card } from 'antd';

import Spinning from "~/components/Spinning";

import { getSliders } from "~/api/slider";

import {
    RESPONSE_CODE_SUCCESS,
    RESPONSE_CODE_NOT_ACCEPT,
    STATUS_ALL_SLIDER_FOR_FILTER,
    STATUS_ACTIVE_SLIDER_FOR_FILTER,
    STATUS_UN_ACTIVE_SLIDER_FOR_FILTER,
    PAGE_SIZE_SLIDER
} from "~/constants";
import TableSlider from "~/components/Tables/TableSlider";
import { NotificationContext } from "~/context/UI/NotificationContext";


const tabList = [
    {
        label: "Tất cả",
        key: "tab1",
    },
    {
        label: "Đang hiển thị",
        key: "tab2",
    },
    {
        label: "Đang ẩn",
        key: "tab3",
    }
]
function SliderHome() {

    /// states
    const [dataTable, setDataTable] = useState([]);
    const [tableParams, setTableParams] = useState({
        pagination: {
            current: 1,
            pageSize: PAGE_SIZE_SLIDER,
            showSizeChanger: false
        },
    });
    const [searchParams, setSearchParams] = useState({
        name: "",
        link: "",
        startDate: null,
        endDate: null,
        statusActive: STATUS_ALL_SLIDER_FOR_FILTER,
        page: 1
    });
    const [loading, setLoading] = useState(false);
    const [activeTabKey, setActiveTabKey] = useState('tab1');

    ///

    /// contexts
    const notification = useContext(NotificationContext);
    ///

    /// useEffects
    useEffect(() => {
        setLoading(true);

        getSliders(searchParams)
            .then((res) => {
                if (res.status === 200) {
                    const data = res.data;
                    const status = data.status;
                    if (status.responseCode === RESPONSE_CODE_SUCCESS) {
                        const result = data.result;
                        setDataTable(result.sliders);

                        setTableParams({
                            ...tableParams,
                            pagination: {
                                ...tableParams.pagination,
                                total: result.totalSlider,
                            },
                        });
                    } else if (status.responseCode === RESPONSE_CODE_NOT_ACCEPT) {
                        notification('error', "Tham số tìm kiếm không hợp lệ!");
                    }
                }

            })
            .catch((err) => { })
            .finally(() => {
                setTimeout(() => {
                    setLoading(false);
                }, 500);
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams])
    ///

    /// handles
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
    ///

    const onTabChange = (key) => {
        switch (key) {
            case 'tab1':
                setSearchParams({
                    ...searchParams,
                    page: 1,
                    statusActive: STATUS_ALL_SLIDER_FOR_FILTER
                })
                break;
            case 'tab2':
                setSearchParams({
                    ...searchParams,
                    page: 1,
                    statusActive: STATUS_ACTIVE_SLIDER_FOR_FILTER
                })
                break;
            case 'tab3':
                setSearchParams({
                    ...searchParams,
                    page: 1,
                    statusActive: STATUS_UN_ACTIVE_SLIDER_FOR_FILTER
                })
                break;
            default: return;
        }

        setTableParams({
            ...tableParams,
            pagination: {
                current: 1,
                pageSize: PAGE_SIZE_SLIDER,
            },
        });

        setActiveTabKey(key);

    };
    const contentList = {
        tab1: <TableSlider tableParams={tableParams} handleTableChange={handleTableChange} data={dataTable} />,
        tab2: <TableSlider tableParams={tableParams} handleTableChange={handleTableChange} data={dataTable} />,
        tab3: <TableSlider tableParams={tableParams} handleTableChange={handleTableChange} data={dataTable} />
    };

    return (
        <Spinning spinning={loading}>
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
        </Spinning>
    );
}

export default SliderHome;