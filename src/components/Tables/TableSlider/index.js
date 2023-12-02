import React from "react";
import { Table, Image, Row } from 'antd';
import classNames from 'classnames/bind';
import {
    ParseDateTime
} from '~/utils/index'

import styles from './TableSlider.module.scss';
import { Link } from "react-router-dom";

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
        width: '15%',
        fixed: 'left',
    },
    {
        title: 'Ảnh',
        dataIndex: 'url',
        render: (url) => {
            return (
                <Row>
                    <Image src={url} />
                </Row>
            )
        },
        width: '25%',
        fixed: 'left',
    },
    {
        title: 'Link sản phẩm',
        dataIndex: 'link',
        render: (link) => {
            return (
                <Row>
                    <Link>{link}</Link>
                </Row>
            )
        },
        width: '10%',
    },
    {
        title: 'Ngày tạo',
        dataIndex: 'dateCreate',
        render: (dateCreate) => {
            return (
                <Row>
                    {ParseDateTime(dateCreate)}
                </Row>
            )
        },
        width: '15%',
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