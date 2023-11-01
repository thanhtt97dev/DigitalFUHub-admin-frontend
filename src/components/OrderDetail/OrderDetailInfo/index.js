
import React from 'react';
import { Card } from 'antd';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
    faBasketShopping,
} from '@fortawesome/free-solid-svg-icons'

import DescriptionsTableOrderInfo from '~/components/DescriptionsTable/DescriptionsTableOrderInfo'


function OrderDetailInfo({ order, callBack }) {

    return (
        <>
            <Card
                title={<><FontAwesomeIcon icon={faBasketShopping} /> Thông tin đơn hàng </>}
            >
                <DescriptionsTableOrderInfo order={order} callBack={callBack} />
            </Card>
        </>
    );
}

export default OrderDetailInfo;