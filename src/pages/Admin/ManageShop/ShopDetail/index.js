import React from "react";
import { useParams } from 'react-router-dom';
import ShopInformations from "~/components/ShopDetail/ShopInformations";
import ShopOrders from "~/components/ShopDetail/ShopOrders";
import ShopProducts from "~/components/ShopDetail/ShopProducts";

function ShopDetail() {

    /// states
    const { id } = useParams();
    ///

    return (
        <>
            <ShopInformations shopId={id} />
            <ShopProducts />
            <ShopOrders />
        </>
    );
}

export default ShopDetail;