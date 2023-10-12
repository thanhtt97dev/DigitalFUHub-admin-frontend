import React, { useLayoutEffect, useState, useContext } from "react";
import { Divider, Modal, Button, Row, Col, Table } from "antd";

import {
    ExclamationCircleFilled,
} from "@ant-design/icons";
import { NotificationContext } from '~/context/NotificationContext';

import { getOrderCoupons } from '~/api/admin'
import {
    RESPONSE_CODE_NOT_ACCEPT,
    RESPONSE_CODE_SUCCESS,
} from "~/constants";

import { formatStringToCurrencyVND } from "~/utils";



const columns = [
    {
        title: 'Tên mã giảm giá',
        dataIndex: 'couponName',
        width: '50%',
    },
    {
        title: 'Số tiền giảm',
        dataIndex: 'priceDiscount',
        width: '50%',
        render: (priceDiscount) => {
            return <p>{formatStringToCurrencyVND(priceDiscount)}đ</p>
        }
    },

];

function ModalShowOrderCoupons({ orderId, style, callBack }) {

    const notification = useContext(NotificationContext);
    const [openModal, setOpenModal] = useState(false);
    const [btnLoading, setBtnLoading] = useState(false)
    const [dataTable, setDataTable] = useState([])


    useLayoutEffect(() => {
        getOrderCoupons(orderId)
            .then((res) => {
                if (res.data.status.responseCode === RESPONSE_CODE_SUCCESS) {
                    setDataTable(res.data.result)
                } else if (res.data.status.responseCode === RESPONSE_CODE_NOT_ACCEPT) {
                    notification('error', 'Xảy ra một vài vấn đề, hãy thử lại!')
                }
            })
            .catch(() => {

            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    const handleOpenModal = () => {
        setBtnLoading(false)
        setOpenModal(true)
    }

    return (
        <>
            <Button
                onClick={handleOpenModal}
                type="link"
                style={style}
                loading={btnLoading}
            >
                Chi tiết
            </Button>

            <Modal
                title={<><ExclamationCircleFilled style={{ color: "#faad14" }} /> Danh sách các mã giảm giá đã sử dụng</>}
                open={openModal}
                onCancel={() => setOpenModal(false)}
                okText={"Xác nhận"}
                cancelText={"Hủy"}
                width={"35%"}
            >
                <>
                    <Divider />
                    <Row>
                        <Col offset={1} span={22}>
                            <Table columns={columns} pagination={{ pageSize: 10 }}
                                dataSource={dataTable} size='small' scroll={{ y: 290 }}
                            />
                        </Col>
                    </Row>
                    <Divider />
                    <Row>
                        <Col offset={1} span={10}>
                            <h2>Tổng:</h2>
                        </Col>
                        <Col offset={1}>
                            <h2>{formatStringToCurrencyVND(dataTable.reduce((accumulator, currentValue) => accumulator + currentValue.priceDiscount, 0))} đ</h2>
                        </Col>
                    </Row>
                </>

            </Modal>
        </>
    );
}

export default ModalShowOrderCoupons;