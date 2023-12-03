import React, { useState, useContext } from "react";
import ModelConfirmation from "~/components/Modals/ModalConfirmation";
import { Link } from "react-router-dom";
import { deleteSlider } from "~/api/slider";
import { useAuthUser } from 'react-auth-kit';
import { ParseDateTime } from '~/utils/index';
import { useNavigate } from 'react-router-dom';
import { EditOutlined } from '@ant-design/icons';
import { Table, Image, Row, Button, Space } from 'antd';
import { NotificationContext } from "~/context/UI/NotificationContext";
import { RESPONSE_CODE_SUCCESS, RESPONSE_CODE_DATA_NOT_FOUND } from '~/constants';

/// styles
const styleImageSlider = { width: 270, height: 90, borderRadius: 2 }
///
function TableSlider({ data, tableParams, handleTableChange, handleReloadSliders }) {

    /// states
    const navigate = useNavigate();
    const [sliderIdSelected, setSliderIdSelected] = useState(0);
    const [isOpenModalDelete, setIsOpenModalDelete] = useState(false);
    const [isLoadingButtonDelete, setIsLoadingButtonDelete] = useState(false);
    ///

    /// variables
    const auth = useAuthUser();
    const user = auth();
    ///

    /// contexts
    const notification = useContext(NotificationContext)
    ///

    /// handles
    const handleOkDeleteSlider = () => {
        if (user === undefined || user === null) return navigate('/login');

        setIsLoadingButtonDelete(true);

        deleteSlider(sliderIdSelected)
            .then((res) => {
                if (res.status === 200) {
                    const data = res.data;
                    const status = data.status;
                    if (status.responseCode === RESPONSE_CODE_SUCCESS) {
                        notification('success', "Xóa slider thành công!");

                        // reload sliders
                        handleReloadSliders();

                    } else if (status.responseCode === RESPONSE_CODE_DATA_NOT_FOUND) {
                        notification('error', "Slider không tồn tại");
                    }

                } else {
                    notification('error', "Có lỗi xảy ra, vui lòng thử lại");
                }

                setIsLoadingButtonDelete(false);
                setIsOpenModalDelete(false);
            })
            .catch((err) => { })
    }

    const handleCancelDeleteSlider = () => {
        setIsOpenModalDelete(false);
    }
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
                        <Image src={url} style={styleImageSlider} />
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
                        <Link to={link}>{link}</Link>
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
                        <Space align="center">
                            <Button type="primary" ghost icon={<EditOutlined />} onClick={() => navigate(`/admin/slider/edit/${sliderId}`)}>
                                Chỉnh sửa
                            </Button>
                            <Button type="primary" ghost danger icon={<EditOutlined />} onClick={() => { setSliderIdSelected(sliderId); setIsOpenModalDelete(true) }}>
                                Xóa
                            </Button>
                        </Space>
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
            <ModelConfirmation
                title="Xóa slider"
                contentModal="Bạn có đồng ý xóa slider này không?"
                isOpen={isOpenModalDelete}
                onOk={handleOkDeleteSlider}
                onCancel={handleCancelDeleteSlider}
                contentButtonCancel="Không"
                contentButtonOk="Đồng ý"
                isLoading={isLoadingButtonDelete}
            />
        </>
    );
}

export default TableSlider;