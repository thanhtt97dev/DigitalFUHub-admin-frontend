import React from "react";
import { useParams } from 'react-router-dom';
import ShopInformations from "~/components/ShopDetail/ShopInformations";

function ShopDetail() {

    /// states
    const { id } = useParams();
    ///

    return (<ShopInformations shopId={id} />);
}

export default ShopDetail;