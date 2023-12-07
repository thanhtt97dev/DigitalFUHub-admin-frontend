import { Card, Col, Row } from "antd";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getTodoList } from "~/api/statistic";
import { ORDER_DISPUTE, RESPONSE_CODE_SUCCESS } from "~/constants";

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
                <Col span={6}>
                    {/* <Link to={"/seller/order/list"} state={{ status: ORDER_DISPUTE }}> */}
                    <Card
                        bodyStyle={{
                            textAlign: 'center'
                        }}
                        hoverable
                    >
                        <div style={{ fontSize: '24px', color: 'rgb(63, 134, 0)', height: '100%' }}>{data?.numberOrdersDispute ? data?.numberOrdersDispute : 0}</div>
                        <div>Đơn hàng đang tranh chấp</div>
                    </Card>
                    {/* </Link> */}
                </Col>
                <Col span={6}>
                    {/* <Link to={"/seller/product/list"}> */}
                    <Card
                        bodyStyle={{
                            textAlign: 'center'
                        }}
                        hoverable
                    >
                        <div style={{ fontSize: '24px', color: 'rgb(63, 134, 0)', height: '100%' }}>{data?.numberRequestWithdrawnMoney ? data?.numberRequestWithdrawnMoney : 0}</div>
                        <div>Yêu cầu rút tiền</div>
                    </Card>
                    {/* </Link> */}
                </Col >
                <Col span={6}>
                    <Link to={"/seller/product/list"}>
                        <Card
                            bodyStyle={{
                                textAlign: 'center'
                            }}
                            hoverable
                        >
                            <div style={{ fontSize: '24px', color: 'rgb(63, 134, 0)', height: '100%' }}>{data?.numberUnprocessedReportProducts ? data?.numberUnprocessedReportProducts : 0}</div>
                            <div>Báo cáo sản phẩm chưa xử lý</div>
                        </Card>
                    </Link>
                </Col >
            </Row>
        </Card >
    </>);
}

export default TodoList;