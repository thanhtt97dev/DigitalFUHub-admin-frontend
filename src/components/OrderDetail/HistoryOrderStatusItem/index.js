import { Tooltip } from "antd";

function HistoryOrderStatusItem({ children, date, note }) {
    return (
        <div
            style={
                {
                    position: "relative",
                    width: "150px"
                }
            }
        >
            <Tooltip placement="top" title={note}>
                {children}
                <p
                    style={
                        {
                            position: "absolute",
                            color: "#00000042",
                            padding: "0px",
                            top: "40px",
                            textAlign: "center",
                            width: "150px"
                        }
                    }
                >
                    {date}
                </p>
            </Tooltip>
        </div>
    );
}

export default HistoryOrderStatusItem;