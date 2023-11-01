
import React from 'react';
import { Card, Row, Space } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faCalendarDays,
    faArrowRightLong
} from '@fortawesome/free-solid-svg-icons'

import HistoryOrderStatusItem from "~/components/OrderDetail/HistoryOrderStatusItem"

import {
    ORDER_WAIT_CONFIRMATION,
    ORDER_COMPLAINT,
    ORDER_DISPUTE,
    ORDER_SELLER_REFUNDED,
    ORDER_REJECT_COMPLAINT,
    ORDER_SELLER_VIOLATES,
    ORDER_CONFIRMED
} from "~/constants";

import { ParseDateTime } from '~/utils/index'


const styleBoxOrderStatus = { width: "fit-content", padding: "1px 10px", margin: "0 auto", borderRadius: "10px" }
const styleTextOrderStatus = { backgroundColor: "black", color: "white", padding: "0px 5px", borderRadius: "2px" }

const TagOrderStatusBought = (
    <div style={{ ...styleBoxOrderStatus, backgroundColor: "#d9d9d9" }}>
        <p style={{ ...styleTextOrderStatus }}>Mua hàng</p>
    </div>
)

const TagOrderStatusWaitConfirm = (
    <div style={{ ...styleBoxOrderStatus, backgroundColor: "#DAE8FC" }}>
        <p style={{ ...styleTextOrderStatus }}>Chờ xác nhận</p>
    </div>
)

const TagOrderStatusConfirmed = (
    <div style={{ ...styleBoxOrderStatus, backgroundColor: "#D5E8D4" }}>
        <p style={{ ...styleTextOrderStatus }}>Đã xác nhận</p>
    </div>
)

const TagOrderStatusComplaint = (
    <div style={{ ...styleBoxOrderStatus, backgroundColor: "#FFF2CC" }}>
        <p style={{ ...styleTextOrderStatus }}>Khiếu nại</p>
    </div>
)

const TagOrderStatusSellerRefunded = (
    <div style={{ ...styleBoxOrderStatus, backgroundColor: "#FAD9D5" }}>
        <p style={{ ...styleTextOrderStatus }}>Người bán hoàn tiền</p>
    </div>
)

const TagOrderStatusDispute = (
    <div style={{ ...styleBoxOrderStatus, backgroundColor: "#FFCC99" }}>
        <p style={{ ...styleTextOrderStatus }}>Tranh chấp</p>
    </div>
)

const TagOrderStatusRejectComplaint = (
    <div style={{ ...styleBoxOrderStatus, backgroundColor: "#E1D5E7" }}>
        <p style={{ ...styleTextOrderStatus }}>Từ chối khiếu nại</p>
    </div>
)

const TagOrderStatusSellerViolates = (
    <div style={{ ...styleBoxOrderStatus, backgroundColor: "#FF0000" }}>
        <p style={{ ...styleTextOrderStatus }}>Người bán vi phạm</p>
    </div>
)

function HistoryOrderStatus({ historyOrderStatus }) {


    return (
        <>
            <Card
                title={<><FontAwesomeIcon icon={faCalendarDays} /> Lịch sử trạng thái đơn hàng </>}
                style={{ paddingBottom: "20px" }}
            >
                <Row justify="center">
                    <Space
                        split={<FontAwesomeIcon icon={faArrowRightLong} fontSize={35} />}
                    >
                        {historyOrderStatus.map((item, index) => {
                            return (
                                (() => {
                                    var date = ParseDateTime(item.dateCreate)
                                    var note = item.note
                                    if (item.orderStatusId === ORDER_WAIT_CONFIRMATION) {
                                        return (
                                            <>
                                                <HistoryOrderStatusItem children={TagOrderStatusBought} date={date} note={note} />
                                                <HistoryOrderStatusItem children={TagOrderStatusWaitConfirm} date={date} note={note} />
                                            </>

                                        )
                                    }
                                    else if (item.orderStatusId === ORDER_COMPLAINT) {
                                        return <HistoryOrderStatusItem children={TagOrderStatusComplaint} date={date} note={note} />
                                    }
                                    else if (item.orderStatusId === ORDER_SELLER_REFUNDED) {
                                        return <HistoryOrderStatusItem children={TagOrderStatusSellerRefunded} date={date} note={note} />
                                    }
                                    else if (item.orderStatusId === ORDER_DISPUTE) {
                                        return <HistoryOrderStatusItem children={TagOrderStatusDispute} date={date} note={note} />
                                    }
                                    else if (item.orderStatusId === ORDER_REJECT_COMPLAINT) {
                                        return <HistoryOrderStatusItem children={TagOrderStatusRejectComplaint} date={date} note={note} />
                                    }
                                    else if (item.orderStatusId === ORDER_SELLER_VIOLATES) {
                                        return <HistoryOrderStatusItem children={TagOrderStatusSellerViolates} date={date} note={note} />
                                    }
                                    else if (item.orderStatusId === ORDER_CONFIRMED) {
                                        return <HistoryOrderStatusItem children={TagOrderStatusConfirmed} date={date} note={note} />
                                    }
                                })()
                            )
                        })}

                    </Space>
                </Row>
            </Card>
        </>
    );
}

export default HistoryOrderStatus;