/* eslint-disable react-hooks/exhaustive-deps */
import { Avatar, Card, Descriptions, Tag } from "antd";
import { useContext, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getUserInfoById } from "~/api/user";
import Spinning from "~/components/Spinning";
import { RESPONSE_CODE_SUCCESS, SELLER_ROLE } from "~/constants";
import { NotificationContext } from "~/context/UI/NotificationContext";
import avatarFPT from "~/assets/images/fpt-logo.jpg"
import moment from "moment";
import { ParseDateTime } from "~/utils";
import { LeftOutlined } from "@ant-design/icons";
function UserInfo() {
    const notification = useContext(NotificationContext)
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [userData, setUserData] = useState();
    useEffect(() => {
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
    return (
        <Card title={<div><Link to={"/admin/user"}> <LeftOutlined /> Trở lại</Link> Thông tin người dùng</div>} style={{ height: '100vh' }}>
            <Spinning spinning={loading}>
                {!loading ?
                    userData ?
                        <Descriptions bordered >
                            <Descriptions.Item label="Ảnh đại diện" span={3}>
                                <Avatar size={60} src={userData?.avatar ? userData?.avatar : avatarFPT} />
                            </Descriptions.Item>
                            <Descriptions.Item label="Tên tài khoản" span={3}>{userData?.username}</Descriptions.Item>
                            <Descriptions.Item label="Email" span={3}>{userData?.email}</Descriptions.Item>
                            <Descriptions.Item label="Họ và tên" span={3}>{userData?.fullname}</Descriptions.Item>
                            <Descriptions.Item label="Xác thực tài khoản" span={3}>
                                <Tag color={userData?.isConfirm ? 'green' : 'volcano'}>{userData?.isConfirm ? 'Đã xác thực' : 'Chưa xác thực'}</Tag>
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
                                {userData?.roleId === SELLER_ROLE
                                    ?
                                    <Tag color="orange">Người bán hàng</Tag>
                                    :
                                    <Tag color="blue">Khách hàng</Tag>
                                }
                            </Descriptions.Item>
                            <Descriptions.Item label="Trạng thái tài khoản" span={3}>
                                <Tag color={userData?.status ? 'green' : 'volcano'}>{userData?.status ? 'Hoạt động' : 'Bị khóa'}</Tag>
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
                        : null
                    :
                    null
                }
            </Spinning>
        </Card>
    );
}

export default UserInfo;