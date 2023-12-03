import React from "react";
import { Table, Image, Row, Button } from 'antd';
import classNames from 'classnames/bind';
import { ParseDateTime } from '~/utils/index'
import { useAuthUser } from 'react-auth-kit';
import styles from './TableSlider.module.scss';
import { Link } from "react-router-dom";
import { useNavigate } from 'react-router-dom';
import { EditOutlined } from '@ant-design/icons';

const cx = classNames.bind(styles);

function TableSlider({ data, tableParams, handleTableChange }) {

    /// states
    const navigate = useNavigate();
    ///

    /// variables
    const auth = useAuthUser();
    const user = auth();
    ///

    /// cols
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
                        <Link to={`/admin${link}`}>{link}</Link>
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
        {
            dataIndex: 'sliderId',
            render: (sliderId) => {
                return (
                    <Row>
                        <Button type="primary" ghost icon={<EditOutlined />} onClick={() => navigate(`/admin/slider/edit/${sliderId}`)}>
                            Chỉnh sửa
                        </Button>
                    </Row>
                )
            },
            width: '10%',
        },
    ];
    ///

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