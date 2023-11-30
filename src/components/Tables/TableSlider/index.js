import React from "react";
import { Table, Image, Row, Col, Tooltip } from 'antd';
import classNames from 'classnames/bind';

import styles from './TableSlider.module.scss';
import { Link } from "react-router-dom";
import { formatPrice } from "~/utils";

const cx = classNames.bind(styles);

const columns = [
    {
        title: 'Tên Slider',
        dataIndex: 'name',
        render: (name) => {
            return (
                <Row>
                    <b>{name}</b>
                </Row>
            )
        },
        width: '30%',
        fixed: 'left',
    },
    {
        title: 'Link sản phẩm',
        dataIndex: 'link',
        render: (link) => {
            return (
                <Row>
                    {link}
                </Row>
            )
        },
        width: '20%',
    },
    {
        title: 'Ngày tạo',
        dataIndex: 'dateCreate',
        render: (dateCreate) => {
            return (
                <Row>
                    {dateCreate}
                </Row>
            )
        },
        width: '20%',
    },
    {
        title: 'Trạng thái',
        dataIndex: 'isActive',
        render: (isActive) => {
            return (
                <Row>
                    {isActive ? <p style={{ color: "green" }}>Đang hiển thị</p> : <p style={{ color: "red" }}>Đang ẩn</p>}
                </Row>
            )
        },
        width: '10%',
    },
];


function TableSlider({ data, tableParams, handleTableChange }) {

    return (
        <>
            <Table
                columns={columns}
                rowKey={(record, index) => index}
                dataSource={data}
                pagination={tableParams.pagination}
                onChange={handleTableChange}
            />
        </>
    );
}

export default TableSlider;