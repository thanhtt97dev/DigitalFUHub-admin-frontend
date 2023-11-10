import React, { useEffect } from "react";
import { Avatar, Card, Table, Tooltip, Tag, Space } from "antd"
import { Link } from "react-router-dom";

import {
    REPORT_PRODUCT_STATUS_VERIFYING,
    REPORT_PRODUCT_STATUS_REJECT,
    REPORT_PRODUCT_STATUS_ACCEPT,
    REASON_REPORT_PRODUCT_STATUS_OTHER
} from "~/constants"
import { ParseDateTime } from "~/utils";
import ModalUpdateReportProduct from "~/components/Modals/ModalUpdateReportProduct";


function ReportProducts({ reportProducts, callBack }) {


    const columns = [
        {
            title: 'STT',
            dataIndex: 'index',
            width: '7%',
            fixed: 'left'
        },
        {
            title: 'Người tố cáo',
            dataIndex: 'userId',
            width: '28%',
            fixed: 'left',
            render: (userId, record) => {
                return (
                    <>
                        <Avatar src={record.avatar} alt="user avatar" />
                        <Link to={`/admin/user/${userId}`}>
                            <span> {record.email}</span>
                        </Link>
                    </>
                )
            }
        },
        {
            title: 'Nguyên nhân',
            dataIndex: 'viName',
            width: '30%',
            render: (viName, record) => {
                return (
                    <Tooltip placement="top" title={record.viExplanation}>
                        <span>{viName}</span>
                    </Tooltip>
                )
            }
        },
        {
            title: 'Thời gian tạo',
            dataIndex: 'dateCreate',
            width: '30%',
            render: (dateCreate) => {
                return (
                    <span>{ParseDateTime(dateCreate)}</span>
                )
            }
        },
        {
            title: 'Thông tin khác từ người tố cáo',
            dataIndex: 'description',
            width: '25%',
            render: (description) => {
                return (
                    <>
                        {description === "" ?
                            "Trống"
                            :
                            <span>{description}</span>
                        }
                    </>
                )
            }
        },
        {
            title: 'Trạng thái',
            dataIndex: 'reportProductStatusId',
            width: '12%',
            fixed: 'right',
            render: (reportProductStatusId, record) => {
                return (
                    <>
                        {(() => {
                            if (reportProductStatusId === REPORT_PRODUCT_STATUS_VERIFYING) {
                                return (
                                    <Tag color='#eeda49'>Chưa xử lý</Tag>
                                )
                            } else if (reportProductStatusId === REPORT_PRODUCT_STATUS_REJECT) {
                                return (
                                    <Space direction='vertical'>
                                        <Tooltip placement="top" title={record.note}>
                                            <Tag color='#87d068'>Từ chối</Tag>
                                        </Tooltip>
                                    </Space>
                                )
                            } else if (reportProductStatusId === REPORT_PRODUCT_STATUS_ACCEPT) {
                                return (
                                    <Space direction='vertical'>
                                        <Tooltip placement="top" title={record.note}>
                                            <Tag color='#f50'>Xác nhận vi phạm</Tag>
                                        </Tooltip>
                                    </Space>
                                )
                            } else {
                                return <></>
                            }
                        })()}
                    </>
                )
            }
        },
        {
            title: '',
            dataIndex: 'reportProductId',
            width: '10%',
            fixed: 'right',
            render: (reportProductId) => {
                return (
                    <ModalUpdateReportProduct reportProductId={reportProductId} callBack={callBack} />
                )
            }
        },
    ];

    useEffect(() => {
        for (let index = 0; index < reportProducts.length; index++) {
            reportProducts[index].key = index + 1
            reportProducts[index].index = index + 1
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <>
            <Card
                title="Danh sách thông tin tố cáo"
            >
                <Table
                    columns={columns}
                    dataSource={reportProducts}
                    scroll={{
                        x: 1500,
                        y: 500
                    }}
                />
            </Card>
        </>
    );
}

export default ReportProducts;