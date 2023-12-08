import React, { useEffect, useState, useContext } from "react";
import classNames from 'classnames/bind';
import styles from '~/pages/Admin/ManageShop/ShopDetail/ShopDetail.module.scss';
import { NotificationContext } from "~/context/UI/NotificationContext";
import { useAuthUser } from 'react-auth-kit';
import { useNavigate } from 'react-router-dom';
import { getShopDetail } from '~/api/shop';
import { RESPONSE_CODE_SUCCESS, RESPONSE_CODE_DATA_NOT_FOUND } from '~/constants';
import DescriptionsTableShopInfomations from "../DescriptionsTableShopInfomations";

///
const cx = classNames.bind(styles);
///

const ShopInformations = ({ shopId }) => {

    /// states
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
        return shopInfomation.totalRatingStar / shopInfomation.numberFeedback;
    }

    const reloadShopInformations = () => {
        setLoadingShopInfoFlag(!loadingShopInfoFlag);
    }
    ///

    /// useEffects
    useEffect(() => {
        if (user === undefined || user === null) return navigate('/login');

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

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loadingShopInfoFlag])

    return (<div className={cx('margin-bottom-10')}>
        <DescriptionsTableShopInfomations shop={shopInfomation}
            calculatorRatingStarProduct={calculatorRatingStarProduct}
            reloadShopInformations={reloadShopInformations}
            notification={notification} />
    </div>);
}

export default ShopInformations;