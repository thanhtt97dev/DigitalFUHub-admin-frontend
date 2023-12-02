import React, { useContext, useEffect, useState } from "react";
import { useParams } from 'react-router-dom';

import { NotificationContext } from "~/context/UI/NotificationContext";

import {
    getShopDetail
} from '~/api/shop'
import Spinning from "~/components/Spinning";

function ShopDetail() {

    const { id } = useParams();
    const notification = useContext(NotificationContext);

    const [loading, setLoading] = useState(false);

    useEffect(() => {
        setLoading(true)
        getShopDetail(id)
            .then((res) => {

            })
            .catch(() => {
                notification('error', "Hệ thống lỗi! Thử lại sau!");
            })
            .finally(() => {
                setTimeout(() => {
                    setLoading(false)
                }, 500)
            })

    }, [])

    return (
        <Spinning spinning={loading}>

        </Spinning>
    );
}

export default ShopDetail;