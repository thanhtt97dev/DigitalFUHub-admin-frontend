import React, { useState } from "react";
import { Tooltip, Modal, Button, Divider } from "antd";
import { WarningOutlined } from '@ant-design/icons';

function HistoryOrderStatusItem({ children, date, note }) {


    const [isOpenModalViewNote, setIsOpenModalViewNote] = useState(false);

    const handleOpenModalViewNote = () => {
        if (note === "") return;
        setIsOpenModalViewNote(true)
    }

    const handleCloseModalViewNote = () => {
        setIsOpenModalViewNote(false)
    }



    return (
        <>
            <div
                style={
                    {
                        position: "relative",
                        width: "150px"
                    }
                }
                onClick={handleOpenModalViewNote}
            >
                <Tooltip
                    placement="top"
                    title={note === "" ? "" : "Bấm để xem chi tiết lý do"}
                >
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
            <Modal
                title={
                    <>
                        <WarningOutlined style={{ fontSize: 20, color: "#faad14" }} />
                        <b> Lý do</b>
                    </>
                }
                open={isOpenModalViewNote}
                onCancel={handleCloseModalViewNote}
                footer={[
                    <Button onClick={handleCloseModalViewNote}>
                        Đóng
                    </Button>,
                ]}
            >
                <Divider />
                <p>
                    {note}
                </p>
            </Modal>
        </>
    );
}

export default HistoryOrderStatusItem;