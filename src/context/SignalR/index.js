import React, { useState, useEffect } from "react";

import { Chat } from "~/context/SignalR/ChatContext";
import { UserOnlineStatus } from "~/context/SignalR/UserOnlineStatusContext";
import { Notification as NotificationSignalR } from '~/context/SignalR/NotificationContext';

import { URL_LOGIN_PAGE } from "~/constants/index"


function SignalR({ children }) {

    const [url, setUrl] = useState("");

    useEffect(() => {
        setInterval(() => {
            var newUrl = window.location.pathname
            if (url !== newUrl) {
                setUrl(newUrl)
            }
        }, 1000)
    }, [url])

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