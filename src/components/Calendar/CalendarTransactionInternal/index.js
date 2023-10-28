

import React, { useState } from 'react';
import dayjs from 'dayjs';
import { Tag, Calendar } from 'antd';

import {
    TRANSACTION_TYPE_INTERNAL_PAYMENT,
    TRANSACTION_TYPE_INTERNAL_RECEIVE_PAYMENT,
    TRANSACTION_TYPE_INTERNAL_RECEIVE_REFUND,
    TRANSACTION_TYPE_INTERNAL_RECEIVE_PROFIT
} from "~/constants";

const getListData = (value, transactionInternals) => {
    let listData = [];
    const date = value.date();
    const month = value.month();
    const year = value.year();

    transactionInternals.forEach(element => {
        var dateCreate = dayjs(element.dateCreate);
        if (dateCreate.date() === date && dateCreate.month() === month && dateCreate.year() === year) {
            listData.push({
                transactionInternalTypeId: element.transactionInternalTypeId,
                paymentAmount: element.paymentAmount
            },)
        }
    });

    return listData || [];
};


function CalendarTransactionInternal({ transactionInternals }) {

    const lastTimeTransaction = transactionInternals[transactionInternals.length - 1].dateCreate;

    const [value, setValue] = useState(() => dayjs(lastTimeTransaction));
    const [, setSelectedValue] = useState(() => dayjs(lastTimeTransaction));
    const onSelect = (newValue) => {
        setValue(newValue);
        setSelectedValue(newValue);
    };
    const onPanelChange = (newValue) => {
        setValue(newValue);
    };

    const dateCellRender = (value) => {
        const listData = getListData(value, transactionInternals);
        return (
            <>
                {listData.map((item) => (
                    <>
                        {(() => {
                            var transactionInternalTypeId = item.transactionInternalTypeId
                            if (transactionInternalTypeId === TRANSACTION_TYPE_INTERNAL_PAYMENT) {
                                return <Tag color="#108ee9">Thanh toán</Tag>
                            } else if (transactionInternalTypeId === TRANSACTION_TYPE_INTERNAL_RECEIVE_PAYMENT) {
                                return <Tag color="red">Nhận tiền hàng</Tag>
                            } else if (transactionInternalTypeId === TRANSACTION_TYPE_INTERNAL_RECEIVE_REFUND) {
                                return <Tag color="volcano">Nhận tiền hoàn khiếu nại</Tag>
                            } else if (transactionInternalTypeId === TRANSACTION_TYPE_INTERNAL_RECEIVE_PROFIT) {
                                return <Tag color="#87d068">Lợi nhuận</Tag>
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