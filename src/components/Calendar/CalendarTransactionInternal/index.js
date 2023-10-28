

import React, { useState } from 'react';
import dayjs from 'dayjs';
import { Tag, Calendar } from 'antd';

import {
    TRANSACTION_TYPE_INTERNAL_PAYMENT,
    TRANSACTION_TYPE_INTERNAL_RECEIVE_PAYMENT,
    TRANSACTION_TYPE_INTERNAL_RECEIVE_REFUND,
    TRANSACTION_TYPE_INTERNAL_RECEIVE_PROFIT,
    TRANSACTION_COIN_TYPE_RECEIVE,
    TRANSACTION_COIN_TYPE_USE,
    TRANSACTION_COIN_TYPE_REFUND
} from "~/constants";

const getListData = (value, transactionInternals, transactionCoins) => {
    let listData = [];
    const date = value.date();
    const month = value.month();
    const year = value.year();

    transactionCoins.forEach(element => {
        var dateCreate = dayjs(element.dateCreate);
        if (dateCreate.date() === date && dateCreate.month() === month && dateCreate.year() === year) {
            listData.push({
                transactionCoinTypeId: element.transactionCoinTypeId,
                amount: element.amount,
                dateCreate: dateCreate
            },)
        }
    });

    transactionInternals.forEach(element => {
        var dateCreate = dayjs(element.dateCreate);
        if (dateCreate.date() === date && dateCreate.month() === month && dateCreate.year() === year) {
            listData.push({
                transactionInternalTypeId: element.transactionInternalTypeId,
                paymentAmount: element.paymentAmount,
                dateCreate: dateCreate
            },)
        }
    });



    return listData || [];
};


function CalendarTransactionInternal({ transactionInternals, transactionCoins }) {

    const lastTimeTransaction = transactionInternals[transactionInternals.length - 1]?.dateCreate;

    const [value, setValue] = useState(() => dayjs(lastTimeTransaction ?? new Date()));
    const [, setSelectedValue] = useState(() => dayjs(lastTimeTransaction ?? new Date()));
    const onSelect = (newValue) => {
        setValue(newValue);
        setSelectedValue(newValue);
    };
    const onPanelChange = (newValue) => {
        setValue(newValue);
    };

    const dateCellRender = (value) => {
        if (transactionInternals.length === 0) return <></>
        const listData = getListData(value, transactionInternals, transactionCoins);
        return (
            <>
                {listData.map((item) => (
                    <>
                        {(() => {
                            var transactionInternalTypeId = item.transactionInternalTypeId
                            var transactionCoinTypeId = item.transactionCoinTypeId
                            if (transactionInternalTypeId !== null && transactionCoinTypeId !== null) {
                                return (
                                    <>
                                        {(() => {
                                            if (transactionInternalTypeId === TRANSACTION_TYPE_INTERNAL_PAYMENT) {
                                                return <Tag color="#108ee9">Thanh toán</Tag>
                                            } else if (transactionInternalTypeId === TRANSACTION_TYPE_INTERNAL_RECEIVE_PAYMENT) {
                                                return <Tag color="red">Nhận tiền hàng</Tag>
                                            } else if (transactionInternalTypeId === TRANSACTION_TYPE_INTERNAL_RECEIVE_REFUND) {
                                                return <Tag color="volcano">Nhận tiền hoàn khiếu nại</Tag>
                                            } else if (transactionInternalTypeId === TRANSACTION_TYPE_INTERNAL_RECEIVE_PROFIT) {
                                                return <Tag color="#87d068">Lợi nhuận</Tag>
                                            }

                                            if (transactionCoinTypeId === TRANSACTION_COIN_TYPE_RECEIVE) {
                                                return <Tag color="#108ee9">Nhận xu</Tag>
                                            } else if (transactionCoinTypeId === TRANSACTION_COIN_TYPE_USE) {
                                                return <Tag color="red">Sử dụng xu</Tag>
                                            } else if (transactionCoinTypeId === TRANSACTION_COIN_TYPE_REFUND) {
                                                return <Tag color="volcano">Hoàn xu</Tag>
                                            }
                                        })()}
                                    </>
                                )
                            } else if (transactionInternalTypeId !== null) {
                                if (transactionInternalTypeId === TRANSACTION_TYPE_INTERNAL_PAYMENT) {
                                    return <Tag color="#108ee9">Thanh toán</Tag>
                                } else if (transactionInternalTypeId === TRANSACTION_TYPE_INTERNAL_RECEIVE_PAYMENT) {
                                    return <Tag color="red">Nhận tiền hàng</Tag>
                                } else if (transactionInternalTypeId === TRANSACTION_TYPE_INTERNAL_RECEIVE_REFUND) {
                                    return <Tag color="volcano">Nhận tiền hoàn khiếu nại</Tag>
                                } else if (transactionInternalTypeId === TRANSACTION_TYPE_INTERNAL_RECEIVE_PROFIT) {
                                    return <Tag color="#87d068">Lợi nhuận</Tag>
                                }
                            } else if (transactionCoinTypeId !== null) {
                                if (transactionCoinTypeId === TRANSACTION_COIN_TYPE_RECEIVE) {
                                    return <Tag color="#108ee9">Nhận xu</Tag>
                                } else if (transactionCoinTypeId === TRANSACTION_COIN_TYPE_USE) {
                                    return <Tag color="red">Sử dụng xu</Tag>
                                } else if (transactionCoinTypeId === TRANSACTION_COIN_TYPE_REFUND) {
                                    return <Tag color="volcano">Hoàn xu</Tag>
                                }
                            }

                        })()}
                    </>
                ))}
            </>
        );
    };
    const cellRender = (current, info) => {
        if (info.type === 'date') return dateCellRender(current);
        return info.originNode;
    };
    return (
        <Calendar
            value={value}
            onSelect={onSelect}
            onPanelChange={onPanelChange}
            cellRender={cellRender}
        />
    );
}

export default CalendarTransactionInternal;