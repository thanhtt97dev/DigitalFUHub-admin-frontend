import React from "react";

import { Chat } from "~/context/SignalR/ChatContext";
import { UserOnlineStatus } from "~/context/SignalR/UserOnlineStatusContext";
import { Notification as NotificationSignalR } from '~/context/SignalR/NotificationContext';


function SignalR({ children }) {

    return (
        <>
            <NotificationSignalR>
                <UserOnlineStatus>
                    <Chat>
                        {children}
                    </Chat>
                </UserOnlineStatus>
            </NotificationSignalR>
        </>
    );
}

export default SignalR;