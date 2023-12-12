import React, { useState } from "react";

import { Chat } from "~/context/SignalR/ChatContext";
import { UserOnlineStatus } from "~/context/SignalR/UserOnlineStatusContext";
import { Notification as NotificationSignalR } from '~/context/SignalR/NotificationContext';

import { URL_LOGIN_PAGE } from "~/constants/index"


function SignalR({ children }) {

    const [url, setUrl] = useState("");

    setInterval(() => {
        setUrl(window.location.pathname)
    }, 10000)

    return (
        <>
            {url === URL_LOGIN_PAGE ?
                <>{children}</>
                :
                <>
                    <NotificationSignalR>
                        <UserOnlineStatus>
                            <Chat>
                                {children}
                            </Chat>
                        </UserOnlineStatus>
                    </NotificationSignalR>
                </>
            }

        </>
    );
}

export default SignalR;