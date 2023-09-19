import React, { useCallback, useEffect, useState } from 'react';
import { useAuthUser } from 'react-auth-kit';
import { Outlet, Route, Routes } from 'react-router-dom';

import routesConfig from './index';
import NotFound from '~/pages/NotFound';
import Login from '~/pages/Login';

function Routing() {
    const auth = useAuthUser();
    const user = auth();

    const [routesCanVistit, setRoutesCanVistit] = useState([]);

    const getRoutesCanVisit = useCallback(() => {
        setRoutesCanVistit([]);
        routesConfig.forEach((route) => {
            if (route.role === undefined) {
                setRoutesCanVistit((prev) => [...prev, route]);
            } else {
                if (user !== null && route.role.includes(user.roleName)) {
                    setRoutesCanVistit((prev) => [...prev, route]);
                }
            }
        });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    useEffect(() => {
        getRoutesCanVisit();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user]);

    return (
        <>
            <Routes>
                <Route path="" element={<Login />} />
                {routesCanVistit.map((route, index) => {
                    return (
                        <Route key={index} path={route.path} element={route.layout ? route.layout : <Outlet />}>
                            <Route key={route.path} path="" element={route.component} />
                        </Route>
                    )
                })}
                <Route path="*" element={<NotFound />} />
            </Routes>
        </>

    );
}

export default Routing;