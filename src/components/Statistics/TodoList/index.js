import { Card, Col, Row } from "antd";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getTodoList } from "~/api/statistic";
import { ORDER_DISPUTE, REPORT_PRODUCT_STATUS_VERIFYING, RESPONSE_CODE_SUCCESS, WITHDRAW_TRANSACTION_IN_PROCESSING } from "~/constants";

function TodoList() {
    const [data, setData] = useState();
    useEffect(() => {
        getTodoList()
            .then(res => {
                if (res.data.status.responseCode === RESPONSE_CODE_SUCCESS) {
                    setData(res.data.result);
                }
            })
            .catch(err => {
            })
    }, [])
    return (<>
        <Card title="Những việc cần làm" style={{ width: '100%' }}>
            <Row gutter={[16, 16]}>
                <Col span={8}>
                    <Link to={"/admin/order"} state={{ status: ORDER_DISPUTE }}>
                        <Card
                            bodyStyle={{
                                textAlign: 'center'
                            }}
                            hoverable
                        >
                            <div style={{ fontSize: '24px', color: 'red', height: '100%' }}>{data?.numberOrdersDispute ? data?.numberOrdersDispute : 0}</div>
                            <div>Đơn hàng đang tranh chấp</div>
                        </Card>
                    </Link>
                </Col>
                <Col span={8}>
                    <Link to={"/admin/finance/withdraw"} state={{ status: WITHDRAW_TRANSACTION_IN_PROCESSING }}>
                        <Card
                            bodyStyle={{
                                textAlign: 'center'
                            }}
                            hoverable
                        >
                            <div style={{ fontSize: '24px', color: 'red', height: '100%' }}>{data?.numberRequestWithdrawnMoney ? data?.numberRequestWithdrawnMoney : 0}</div>
                            <div>Yêu cầu rút tiền</div>
                        </Card>
                    </Link>
                </Col >
                <Col span={8}>
                    <Link to={"/admin/report/product"} state={{ status: REPORT_PRODUCT_STATUS_VERIFYING }}>
                        <Card
                            bodyStyle={{
                                textAlign: 'center'
                            }}
                            hoverable
                        >
                            <div style={{ fontSize: '24px', color: 'red', height: '100%' }}>{data?.numberUnprocessedReportProducts ? data?.numberUnprocessedReportProducts : 0}</div>
                            <div>Báo cáo sản phẩm chưa xử lý</div>
                        </Card>
                    </Link>
                </Col >
            </Row>
        </Card >
    </>);
}

export default TodoList;