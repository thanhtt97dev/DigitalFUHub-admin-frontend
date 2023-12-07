
import { useEffect, useMemo, useRef, useState } from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
    BarElement,
} from 'chart.js';
import {
    Line
} from 'react-chartjs-2';
import locale from 'antd/es/date-picker/locale/vi_VN';
import { Card, DatePicker, Select, Space, Spin } from "antd";
import dayjs from "dayjs";
import { formatPrice } from "~/utils";
import { ORDER_COMPLAINT, ORDER_CONFIRMED, ORDER_DISPUTE, ORDER_REJECT_COMPLAINT, ORDER_SELLER_REFUNDED, ORDER_SELLER_VIOLATES, ORDER_WAIT_CONFIRMATION, RESPONSE_CODE_SUCCESS, STATISTIC_BY_MONTH, STATISTIC_BY_YEAR } from "~/constants";
import { getStatisticDepositAndWithdrawnMoney } from "~/api/statistic";
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    BarElement,
    Title,
    Tooltip,
    Legend
);
export const options = {
    responsive: true,
    interaction: {
        mode: 'index',
        intersect: false,
    },
    stacked: false,
    plugins: {
        title: {
            display: true,
            text: '',
        },
    },
    locale: 'vi-vn',
    scales: {
        y: {
            type: 'linear',
            display: true,
            position: 'left',
            ticks: {
                callback: function (value, index, ticks) {
                    if (value >= 1) {
                        return formatPrice(value);
                    } else {
                        return value.toString().replace('.', ',') + ' ₫'
                    }
                }
            }
        },
        y1: {
            type: 'linear',
            display: true,
            position: 'right',
            grid: {
                drawOnChartArea: true,
            },
            ticks: {
                callback: function (value, index, ticks) {
                    if (value >= 1) {
                        return formatPrice(value);
                    } else {
                        return value.toString().replace('.', ',') + ' ₫'
                    }
                }
            }
        },
    },
};

const labels = ['Tháng 1', 'Tháng 2', 'Tháng 3', 'Tháng 4', 'Tháng 5', 'Tháng 6', 'Tháng 7', 'Tháng 8', 'Tháng 9', 'Tháng 10', 'Tháng 11', 'Tháng 12'];

function DepositAndWithdrawnAnalysisChart() {
    const [typeSearch, setTypeSearch] = useState(STATISTIC_BY_YEAR);
    const [dateSelected, setDateSelected] = useState(dayjs())
    const [dataStatistic, setDataStatistic] = useState([])
    const [loading, setLoading] = useState(false);
    const labelsChartRef = useRef([]);
    const dataChart = useMemo(() => {
        if (typeSearch === STATISTIC_BY_MONTH) {
            let dayOfMonth = [];
            for (let i = 1; i <= dataStatistic.length; i++) {
                dayOfMonth.push(`${i}/${dateSelected.month() + 1}`);
            }
            labelsChartRef.current = dayOfMonth;
        } else {
            labelsChartRef.current = labels;
        }
        return {
            labels: labelsChartRef.current,
            datasets: [
                {
                    label: 'Tổng số tiền đã nạp',
                    data: dataStatistic.map((value, index) => value.totalAmountDeposit),
                    borderColor: 'rgb(255, 99, 132)',
                    backgroundColor: 'rgba(255, 99, 132, 0.5)',
                    yAxisID: 'y',
                },
                {
                    label: 'Tổng số tiền đã rút',
                    data: dataStatistic.map((value, index) => value.totalAmountWithdrawn),
                    borderColor: 'rgb(53, 162, 235)',
                    backgroundColor: 'rgba(53, 162, 235, 0.5)',
                    yAxisID: 'y1',
                },
            ],
        }
    }, [typeSearch, dateSelected, dataStatistic])
    useEffect(() => {
        const data = typeSearch === STATISTIC_BY_YEAR
            ?
            {
                month: 0,
                year: dateSelected.year(),
            }
            :
            {
                month: dateSelected.month() + 1,
                year: dateSelected.year(),
            }
        setLoading(true);
        getStatisticDepositAndWithdrawnMoney(data)
            .then(res => {
                if (res.data.status.responseCode === RESPONSE_CODE_SUCCESS) {
                    const { dataStatistics } = res.data.result;
                    setDataStatistic(dataStatistics)
                } else {
                    setDataStatistic([])
                }
            })
            .catch(err => {
                setDataStatistic([])
            })
            .finally(() => {
                const idTimeout = setTimeout(() => {
                    setLoading(false);
                    clearTimeout(idTimeout);
                }, 500)
            })
    }, [typeSearch, dateSelected])
    const handleSelectTypeSearch = (value) => {
        setTypeSearch(value);
        setDateSelected(dayjs())
    }
    const handleSelectDate = (value, dateString) => {
        setDateSelected(value ? value : dayjs())
    }
    return (<>
        <Card title="Biểu đồ phân tích nạp/rút tiền">
            <Spin spinning={loading}>
                <Space>
                    <Space wrap={true}>
                        <div style={{ marginInlineEnd: '1em' }}>Khung thời gian</div>
                        <Select style={{ width: '8em' }} onChange={handleSelectTypeSearch} value={typeSearch}>
                            <Select.Option value={STATISTIC_BY_MONTH}>Theo tháng</Select.Option>
                            <Select.Option value={STATISTIC_BY_YEAR}>Theo năm</Select.Option>
                        </Select>
                        {typeSearch === STATISTIC_BY_MONTH ?
                            <DatePicker onChange={handleSelectDate} locale={locale} value={dateSelected} picker="month" />
                            :
                            <DatePicker onChange={handleSelectDate} locale={locale} value={dateSelected} picker="year" />
                        }
                    </Space>
                </Space>
                <Line options={options} data={dataChart} />
            </Spin>
        </Card >
    </>);
}

export default DepositAndWithdrawnAnalysisChart;