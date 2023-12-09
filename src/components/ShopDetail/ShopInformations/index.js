import React, { useEffect, useState, useContext } from "react";
import Spinning from "~/components/Spinning";
import DescriptionsTableShopInfomations from "../DescriptionsTableShopInfomations";
import { getShopDetail } from '~/api/shop';
import { useAuthUser } from 'react-auth-kit';
import { useNavigate } from 'react-router-dom';
import { NotificationContext } from "~/context/UI/NotificationContext";
import { RESPONSE_CODE_SUCCESS, RESPONSE_CODE_DATA_NOT_FOUND } from '~/constants';

const ShopInformations = ({ shopId }) => {

    /// states
    const [isloadingSpinningShopInfo, setIsloadingSpinningShopInfo] = useState(false);
    const [loadingShopInfoFlag, setLoadingShopInfoFlag] = useState(false);
    const [shopInfomation, setShopInfomation] = useState({});
    const notification = useContext(NotificationContext);
    ///

    /// variables
    const auth = useAuthUser();
    const user = auth();
    ///


    /// router
    const navigate = useNavigate();
    ///

    /// handles
    const calculatorRatingStarProduct = () => {
        if (!shopInfomation) return 0;
        var rating = shopInfomation.numberFeedback !== 0 ? shopInfomation.totalRatingStar / shopInfomation.numberFeedback : 0;
        return rating !== 0 ? rating.toFixed(1) : 0;
    }

    const reloadShopInformations = () => {
        setLoadingShopInfoFlag(!loadingShopInfoFlag);
    }
    ///

    /// useEffects
    useEffect(() => {
        if (user === undefined || user === null) return navigate('/login');

        setIsloadingSpinningShopInfo(true);

        getShopDetail(shopId)
            .then((res) => {
                if (res.status === 200) {
                    const data = res.data;
                    const status = data.status;
                    if (status.responseCode === RESPONSE_CODE_SUCCESS) {
                        const result = data.result;

                        // set result
                        setShopInfomation(result);
                    } else if (status.responseCode === RESPONSE_CODE_DATA_NOT_FOUND) {
                        navigate("/notFound");
                    } else {
                        notification('error', "Hệ thống lỗi, vui lòng thử lại sau");
                    }
                } else {
                    notification('error', "Hệ thống lỗi, vui lòng thử lại sau");
                }
            })
            .catch(() => {
                notification('error', "Hệ thống lỗi, vui lòng thử lại sau");
            })
            .finally(() => {
                setTimeout(() => {
                    setIsloadingSpinningShopInfo(false);
                }, 500)
            })

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loadingShopInfoFlag])

    return (<Spinning spinning={isloadingSpinningShopInfo}>
        <DescriptionsTableShopInfomations shop={shopInfomation}
            calculatorRatingStarProduct={calculatorRatingStarProduct}
            reloadShopInformations={reloadShopInformations}
            notification={notification} />
    </Spinning>);
}

export default ShopInformations;