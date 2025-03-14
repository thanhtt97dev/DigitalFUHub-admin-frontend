import { createContext, useEffect, useState } from "react";

import connectionHub from '~/api/signalr/connectionHub';
import { SIGNAL_R_USER_ONLINE_STATUS_HUB_RECEIVE_ONLINE_STATUS } from '~/constants';
import { getUserId } from '~/utils';

export const UserOnlineStatusContext = createContext();

export function UserOnlineStatus({ children }) {
    const [userOnlineData, setuserOnlineData] = useState("");
    useEffect(() => {
        var userId = getUserId();
        if (userId === undefined || userId === null) return;

        // Create a new SignalR connection with the token
        const connection = connectionHub(`hubs/userOnlineStatus?userId=${userId}`);

        // Start the connection
        connection.start().catch((err) => console.error(err));

        connection.on(SIGNAL_R_USER_ONLINE_STATUS_HUB_RECEIVE_ONLINE_STATUS, (response) => {
            setuserOnlineData(response)
        });

        return () => {
            // Clean up the connection when the component unmounts
            connection.stop();
        };

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    return (
        <UserOnlineStatusContext.Provider value={userOnlineData}>
            {children}
        </UserOnlineStatusContext.Provider>
    );
}
