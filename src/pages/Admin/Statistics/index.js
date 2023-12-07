import { Col, Row } from "antd";
import { DepositAndWithdrawnAnalysisChart, OrderAnalysisChart, SalesSummary, TodoList } from "~/components/Statistics"
function Statistics() {
    return (<>
        <Row gutter={[8, 16]}>
            <Col span={24}>
                <SalesSummary />
            </Col>
            <Col span={24}>
                <TodoList />
            </Col>
            <Col span={24}>
                <OrderAnalysisChart />
            </Col>
            <Col span={24}>
                <DepositAndWithdrawnAnalysisChart />
            </Col>
        </Row>
    </>);
}

export default Statistics;