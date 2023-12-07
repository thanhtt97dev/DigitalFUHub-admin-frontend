import { QuestionCircleOutlined } from "@ant-design/icons";
import { Card, Col, Row, Statistic, Tooltip } from "antd";
import { useEffect, useState } from "react";
import { formatPrice } from "~/utils";


const stylesCard = { width: '100%' };
function SalesSummary() {
    const [data, setData] = useState();
    // useEffect(() => {
    //     getStatisticSalesCurrentMonth()
    //         .then(res => {
    //             if (res.data.status.responseCode === RESPONSE_CODE_SUCCESS) {
    //                 setData(res.data.result);
    //             }
    //         })
    //         .catch(err => {

    //         })
    // }, [])
    return (<>
        <Row gutter={[16, 16]}>
            <Col span={6}>
                <Card style={stylesCard}>
                    <Statistic
                        title={<div><span>Doanh thu</span> <Tooltip title="Tổng giá trị các đơn hàng trong tháng hiện tại (bao gồm tất cả các trạng thái đơn hàng)"><QuestionCircleOutlined /></Tooltip></div>}
                        value={formatPrice(data?.revenue ? data?.revenue : 0)}
                        valueStyle={{
                            color: '#3f8600',
                        }}
                    />
                </Card>
            </Col>
            <Col span={6}>
                <Card style={stylesCard}>
                    <Statistic
                        title={<div><span>Lợi nhuận</span> <Tooltip title="Tổng lợi nhuận các đơn hàng trong tháng hiện tại (bao gồm tất cả các trạng thái đơn hàng) và đã trừ phí dịch vụ"><QuestionCircleOutlined /></Tooltip></div>}
                        value={formatPrice(data?.profit ? data?.profit : 0)}
                        valueStyle={{
                            color: '#3f8600',
                        }}
                    />
                </Card>
            </Col>
            <Col span={6}>
                <Card style={stylesCard}>
                    <Statistic
                        title={<div><span>Tổng số đơn hàng</span> <Tooltip title="Tổng số đơn hàng trong tháng hiện tại"><QuestionCircleOutlined /></Tooltip></div>}
                        value={data?.totalOrders ? data?.totalOrders : 0}
                        valueStyle={{
                            color: '#3f8600',
                        }}
                    />
                </Card>
            </Col>
            <Col span={6}>
                <Card style={stylesCard}>
                    <Statistic
                        title={<div><span>Người dùng mới</span> <Tooltip title="Tổng số người dùng đăng ký trong tháng hiện tại"><QuestionCircleOutlined /></Tooltip></div>}
                        value={data?.numberNewUserInCurrentMonth ? data?.numberNewUserInCurrentMonth : 0}
                        valueStyle={{
                            color: '#3f8600',
                        }}
                    />
                </Card>
            </Col>
        </Row>
    </>);
}

export default SalesSummary;