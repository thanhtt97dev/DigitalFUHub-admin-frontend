/* eslint-disable react-hooks/exhaustive-deps */
import { Avatar, Button, Card, Descriptions, Space, Tag, Tooltip } from "antd";
import { useCallback, useContext, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { editStatusUser, getUserInfoById } from "~/api/user";
import Spinning from "~/components/Spinning";
import { RESPONSE_CODE_SUCCESS, SELLER_ROLE } from "~/constants";
import { NotificationContext } from "~/context/UI/NotificationContext";
import avatarFPT from "~/assets/images/fpt-logo.jpg"
import moment from "moment";
import { ParseDateTime, formatPrice, getUserId } from "~/utils";
import { LeftOutlined, MessageOutlined, QuestionCircleOutlined } from "@ant-design/icons";
import EditStatusUserModal from "~/components/EditStatusUserModal";
import { getConversation } from "~/api/chat";
function UserInfo() {
    const navigate = useNavigate();
    const notification = useContext(NotificationContext)
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [userData, setUserData] = useState();
    const [openModal, setOpenModal] = useState(false);
    const [buttonLoading, setButtonLoading] = useState(false);
    const getUserInfo = useCallback(() => {
        setLoading(true);
        getUserInfoById(id)
            .then((res) => {
                if (res.data.status.responseCode === RESPONSE_CODE_SUCCESS) {
                    setUserData(res.data.result);
                } else {
                    notification("error", "Đã có lỗi xảy ra, vui lòng thử lại sau.");
                }
            })
            .catch((err) => {
                notification("error", "Đã có lỗi xảy ra, vui lòng thử lại sau.");
            })
            .finally(() => {
                const idTimeout = setTimeout(() => {
                    setLoading(false);
                    clearTimeout(idTimeout);
                }, 500)
            })
    }, [])
    useEffect(() => {
        getUserInfo();
    }, [])
    const handleCloseEditStatusUserModal = () => {
        setOpenModal(false);
    }
    const handleOpenEditStatusUserModal = () => {
        setOpenModal(true);
    }
    const handleSubmitEditStatusUser = ({ status, note }) => {
        const data = {
            status,
            note: note ? note : '',
            userId: id
        }
        setButtonLoading(true);
        editStatusUser(data)
            .then(res => {
                if (res.data.status.responseCode === RESPONSE_CODE_SUCCESS) {
                    notification("success", "Cập nhật thành công.")
                } else {
                    notification("error", "Vui lòng kiểm tra lại.")
                }
            })
            .catch(err => {
                notification("error", "Vui lòng kiểm tra lại.")
            })
            .finally(() => {
                getUserInfo();
                setButtonLoading(false);
                handleCloseEditStatusUserModal();
            })
    }
    const handleOpenChatSeller = () => {
        var data = { shopId: id, userId: getUserId() }
        getConversation(data)
            .then((res) => {
                if (res.data.status.responseCode === RESPONSE_CODE_SUCCESS) {
                    navigate('/chatBox', { state: { data: res.data.result } })
                }
            })
            .catch(() => {

            })
    }
    return (
        <Card title={<div><Link to={"/admin/user"}> <LeftOutlined /> Trở lại</Link> Thông tin người dùng</div>} style={{ minHeight: '100vh' }}>

            <Spinning spinning={loading}>
                {!loading ?
                    userData ?
                        <>
                            {openModal
                                &&
                                <EditStatusUserModal buttonLoading={buttonLoading} open={openModal} currentStatus={userData?.status} onClose={handleCloseEditStatusUserModal} onSubmit={handleSubmitEditStatusUser} />
                            }
                            <Descriptions bordered >
                                <Descriptions.Item label="Ảnh đại diện" span={3}>
                                    <Avatar size={60} src={userData?.avatar ? userData?.avatar : avatarFPT} />
                                </Descriptions.Item>
                                <Descriptions.Item label="Tên tài khoản" span={3}>{userData?.username}</Descriptions.Item>
                                <Descriptions.Item label="Email" span={3}>{userData?.email}</Descriptions.Item>
                                <Descriptions.Item label="Họ và tên" span={3}>{userData?.fullname}</Descriptions.Item>
                                <Descriptions.Item label="Số dư hiện tại" span={3}>{formatPrice(userData?.accountBalance ? userData?.accountBalance : 0)}</Descriptions.Item>
                                <Descriptions.Item label="Số xu hiện tại" span={3}>{(() => {
                                    var coinString = formatPrice(userData?.coin ? userData?.coin : 0);
                                    return coinString.slice(0, coinString.length - 1) + ' xu';
                                })()}</Descriptions.Item>
                                <Descriptions.Item label="Xác thực tài khoản" span={3}>
                                    <Tag color={userData?.isConfirm ? 'green' : 'volcano'}>{userData?.isConfirm ? 'Đã xác thực' : 'Chưa xác thực'}</Tag>
                                </Descriptions.Item>
                                <Descriptions.Item label="Xác thực 2 yếu tố" span={3}>
                                    <Tag color={userData?.TwoFactorAuthentication ? 'green' : 'volcano'}>{userData?.TwoFactorAuthentication ? 'Đã bật' : 'Đã tắt'}</Tag>
                                </Descriptions.Item>
                                <Descriptions.Item label="Trạng thái hoạt động" span={3}>
                                    {userData?.isOnline
                                        ?
                                        "Đang hoạt động"
                                        :
                                        (userData?.lastTimeOnline
                                            ?
                                            moment(userData?.lastTimeOnline).fromNow()
                                            :
                                            "Chưa hoạt động")
                                    }
                                </Descriptions.Item>
                                <Descriptions.Item label="Vai trò" span={3}>
                                    {userData?.role === SELLER_ROLE
                                        ?
                                        <Tag color="orange">Người bán hàng</Tag>
                                        :
                                        <Tag color="blue">Khách hàng</Tag>
                                    }
                                </Descriptions.Item>
                                <Descriptions.Item label="Số đơn hàng đã mua" span={3}>
                                    {userData?.numberOrdersBuyed ? userData?.numberOrdersBuyed : 0} đơn hàng
                                </Descriptions.Item>
                                <Descriptions.Item label="Tổng số tiền đã mua hàng" span={3}>
                                    {formatPrice(userData?.totalAmountOrdersBuyed ? userData?.totalAmountOrdersBuyed : 0)}
                                </Descriptions.Item>
                                {
                                    userData?.role === SELLER_ROLE &&
                                    <>
                                        <Descriptions.Item label="Tên cửa hàng" span={3}>
                                            <Space size={16}>
                                                <span>{userData?.shopName} </span>
                                                <Button icon={<MessageOutlined />} onClick={handleOpenChatSeller}>Nhắn tin với cửa hàng</Button>
                                            </Space>
                                        </Descriptions.Item>
                                        <Descriptions.Item label="Trạng thái cửa hàng" span={3}>
                                            <Tag color={userData?.isActive ? 'green' : 'volcano'}>{userData?.isActive ? 'Hoạt động' : 'Bị khóa'}</Tag>
                                        </Descriptions.Item>
                                        <Descriptions.Item label={<div>Số đơn hàng đã bán <Tooltip title="Tổng số tất cả các đơn hàng đã bán"><QuestionCircleOutlined /></Tooltip></div>} span={3}>
                                            {userData?.numberOrderSold ? userData?.numberOrderSold : 0} đơn hàng
                                        </Descriptions.Item>
                                        <Descriptions.Item label={<div>Lợi nhuận <Tooltip title="Lợi nhuận (đã trừ phí dịch vụ) của tất cả các đơn hàng đã bán"><QuestionCircleOutlined /></Tooltip></div>} span={3}>
                                            {formatPrice(userData?.profit ? userData?.profit : 0)}
                                        </Descriptions.Item>
                                    </>
                                }
                                <Descriptions.Item label="Trạng thái tài khoản" span={3}>
                                    <Tag color={userData?.status ? 'green' : 'volcano'}>{userData?.status ? 'Hoạt động' : 'Bị khóa'}</Tag>
                                    <Button type="link" onClick={handleOpenEditStatusUserModal}>chỉnh sửa</Button>
                                </Descriptions.Item>
                                {
                                    userData?.status
                                        ?
                                        null
                                        :
                                        <>
                                            <Descriptions.Item label="Ngày bị khóa" span={3}>
                                                {ParseDateTime(userData?.banDate)}
                                            </Descriptions.Item>
                                            <Descriptions.Item label="Lý do khóa" span={3}>
                                                {userData?.note}
                                            </Descriptions.Item>
                                        </>
                                }
                            </Descriptions>
                        </>
                        : null
                    :
                    null
                }
            </Spinning>
        </Card>
    );
}

export default UserInfo;