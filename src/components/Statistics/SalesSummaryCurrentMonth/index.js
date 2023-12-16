import { QuestionCircleOutlined } from "@ant-design/icons";
import { Card, Col, Row, Statistic, Tooltip } from "antd";
import { useEffect, useState } from "react";
import { getStatisticSalesSummaryCurrentMonth } from "~/api/statistic";
import { RESPONSE_CODE_SUCCESS } from "~/constants";
import { formatPrice } from "~/utils";


const stylesCard = { width: '100%', height: '100%' };
function SalesSummaryCurrentMonth() {
    const [data, setData] = useState();
    useEffect(() => {
        getStatisticSalesSummaryCurrentMonth()
            .then(res => {
                if (res.data.status.responseCode === RESPONSE_CODE_SUCCESS) {
                    setData(res.data.result);
                }
            })
            .catch(err => {

            })
    }, [])
    return (<>
        <Row gutter={[16, 16]}>
            <Col span={6}>
                <Card style={stylesCard}>
                    <Statistic
                        title={<div><span>Doanh thu toàn cửa hàng</span> <Tooltip title="Tổng giá trị các đơn hàng trong tháng hiện tại (bao gồm tất cả các trạng thái đơn hàng)"><QuestionCircleOutlined /></Tooltip></div>}
                        value={formatPrice(data?.revenueAllShop ? data?.revenueAllShop : 0)}
                        valueStyle={{
                            color: '#3f8600',
                        }}
                    />
                </Card>
            </Col>
            <Col span={6}>
                <Card style={stylesCard}>
                    <Statistic
                        title={<div><span>Lợi nhuận quản trị viên</span> <Tooltip title="Tổng lợi nhuận của quản trị viên từ các đơn hàng trong tháng hiện tại (bao gồm tất cả các trạng thái đơn hàng) và đã trừ phí dịch vụ"><QuestionCircleOutlined /></Tooltip></div>}
                        value={formatPrice(data?.profitAdmin ? data?.profitAdmin : 0)}
                        valueStyle={{
                            color: '#3f8600',
                        }}
                    />
                </Card>
            </Col>
            <Col span={6}>
                <Card style={stylesCard}>
                    <Statistic
                        title={<div><span>Lợi nhuận toàn cửa hàng</span> <Tooltip title="Tổng lợi nhuận các đơn hàng trong tháng hiện tại (bao gồm tất cả các trạng thái đơn hàng) và đã trừ phí dịch vụ"><QuestionCircleOutlined /></Tooltip></div>}
                        value={formatPrice(data?.profitAllShop ? data?.profitAllShop : 0)}
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
            <Col span={6}>
                <Card style={stylesCard}>
                    <Statistic
                        title={<div><span>Tổng số xu sử dụng</span> <Tooltip title="Tổng số xu sử dụng trong tháng hiện tại"><QuestionCircleOutlined /></Tooltip></div>}
                        value={(() => {
                            var coinString = formatPrice(data?.totalCoinUsedOrders ? data?.totalCoinUsedOrders : 0);
                            return coinString.slice(0, coinString.length - 1) + ' xu';
                        })()}
                        valueStyle={{
                            color: '#3f8600',
                        }}
                    />
                </Card>
            </Col>
            <Col span={6}>
                <Card style={stylesCard}>
                    <Statistic
                        title={<div><span>Tổng số xu tặng khách hàng</span> <Tooltip title="Tổng số xu đã tặng cho khách hàng đánh giá sản phẩm trong tháng hiện tại"><QuestionCircleOutlined /></Tooltip></div>}
                        value={(() => {
                            var coinString = formatPrice(data?.totalCoinReceive ? data?.totalCoinReceive : 0);
                            return coinString.slice(0, coinString.length - 1) + ' xu';
                        })()}
                        valueStyle={{
                            color: '#3f8600',
                        }}
                    />
                </Card>
            </Col>
            <Col span={6}>
                <Card style={stylesCard}>
                    <Statistic
                        title={<div><span>Phí dịch vụ</span> <Tooltip title="Áp dụng cho mỗi đơn hàng"><QuestionCircleOutlined /></Tooltip></div>}
                        value={`${data?.businessFee ? data?.businessFee : 0}%/đơn hàng`}
                        valueStyle={{
                            color: '#3f8600',
                        }}
                    />
                </Card>
            </Col>
        </Row>
    </>);
}

export default SalesSummaryCurrentMonth;