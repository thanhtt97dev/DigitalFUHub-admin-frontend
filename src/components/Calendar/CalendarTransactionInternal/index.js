

import React, { useState } from 'react';
import dayjs from 'dayjs';
import { Tag, Calendar, Tooltip } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faMoneyBill1Wave,
    faCoins
} from '@fortawesome/free-solid-svg-icons'

import {
    TRANSACTION_TYPE_INTERNAL_PAYMENT,
    TRANSACTION_TYPE_INTERNAL_RECEIVE_PAYMENT,
    TRANSACTION_TYPE_INTERNAL_RECEIVE_REFUND,
    TRANSACTION_TYPE_INTERNAL_RECEIVE_PROFIT,
    TRANSACTION_COIN_TYPE_RECEIVE,
    TRANSACTION_COIN_TYPE_USE,
    TRANSACTION_COIN_TYPE_REFUND
} from "~/constants";

import { formatStringToCurrencyVND } from '~/utils/index'

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
    let lastTimeTransaction = "";
    if (transactionInternals.length !== 0 && transactionCoins.length !== 0) {
        const maxDateTransactionInternal = transactionInternals[transactionInternals.length - 1]?.dateCreate;
        const maxDateTransactionCoin = transactionCoins[transactionCoins.length - 1]?.dateCreate;
        if (dayjs(maxDateTransactionCoin).isAfter(dayjs(maxDateTransactionCoin))) {
            lastTimeTransaction = maxDateTransactionInternal
        } else {
            lastTimeTransaction = maxDateTransactionCoin
        }
    } else if (transactionInternals.length !== 0 && transactionCoins.length === 0) {
        const maxDateTransactionInternal = transactionInternals[transactionInternals.length - 1]?.dateCreate;
        lastTimeTransaction = maxDateTransactionInternal
    } else if (transactionInternals.length === 0 && transactionCoins.length !== 0) {
        const maxDateTransactionCoin = transactionCoins[transactionCoins.length - 1]?.dateCreate;
        lastTimeTransaction = maxDateTransactionCoin
    } else {
        lastTimeTransaction = dayjs(new Date())
    }

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
        if (transactionInternals.length === 0 && transactionCoins.length === 0) return <></>
        const listData = getListData(value, transactionInternals, transactionCoins);
        return (
            <>
                {listData.map((item) => (
                    <>
                        {(() => {
                            var transactionInternalTypeId = item.transactionInternalTypeId
                            var transactionCoinTypeId = item.transactionCoinTypeId
                            if (transactionInternalTypeId !== null) {
                                if (transactionInternalTypeId === TRANSACTION_TYPE_INTERNAL_PAYMENT) {
                                    return (
                                        <Tooltip title={<>{formatStringToCurrencyVND(item.paymentAmount)} đ</>} color="#3b7be2" >
                                            <Tag color="#3b7be2">
                                                <FontAwesomeIcon icon={faMoneyBill1Wave} /> Thanh toán
                                            </Tag>
                                        </Tooltip>
                                    )
                                } else if (transactionInternalTypeId === TRANSACTION_TYPE_INTERNAL_RECEIVE_PAYMENT) {
                                    return (
                                        <Tooltip title={<>{formatStringToCurrencyVND(item.paymentAmount)} đ</>} color="#cf1322" >
                                            <Tag color="#cf1322">
                                                <FontAwesomeIcon icon={faMoneyBill1Wave} /> Trả tiền hàng
                                            </Tag>
                                        </Tooltip>
                                    )
                                } else if (transactionInternalTypeId === TRANSACTION_TYPE_INTERNAL_RECEIVE_REFUND) {
                                    return (
                                        <Tooltip title={<>{formatStringToCurrencyVND(item.paymentAmount)} đ</>} color="#8c66c8" >
                                            <Tag color="#8c66c8">
                                                <FontAwesomeIcon icon={faMoneyBill1Wave} /> Hoàn tiền
                                            </Tag>
                                        </Tooltip>
                                    )
                                } else if (transactionInternalTypeId === TRANSACTION_TYPE_INTERNAL_RECEIVE_PROFIT) {
                                    return (
                                        <Tooltip title={<>{formatStringToCurrencyVND(item.paymentAmount)} đ</>} color="#4ea927" >
                                            <Tag color="#4ea927">
                                                <FontAwesomeIcon icon={faMoneyBill1Wave} /> Lợi nhuận
                                            </Tag>
                                        </Tooltip>
                                    )
                                }
                            }
                            if (transactionCoinTypeId !== null) {
                                if (transactionCoinTypeId === TRANSACTION_COIN_TYPE_RECEIVE) {
                                    return (
                                        <Tooltip title={<>{item.amount} xu</>} color="#108ee9" >
                                            <Tag color="#108ee9">
                                                <FontAwesomeIcon icon={faCoins} /> Nhận xu
                                            </Tag>
                                        </Tooltip>
                                    )
                                } else if (transactionCoinTypeId === TRANSACTION_COIN_TYPE_USE) {
                                    return (
                                        <Tooltip title={<>{item.amount} xu</>} color="red" >
                                            <Tag color="red">
                                                <FontAwesomeIcon icon={faCoins} /> Sử dụng xu
                                            </Tag>
                                        </Tooltip>
                                    )
                                } else if (transactionCoinTypeId === TRANSACTION_COIN_TYPE_REFUND) {
                                    return (
                                        <Tooltip title={<>{item.amount} xu</>} color="volcano" >
                                            <Tag color="volcano">
                                                <FontAwesomeIcon icon={faCoins} /> Hoàn xu
                                            </Tag>
                                        </Tooltip>
                                    )
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