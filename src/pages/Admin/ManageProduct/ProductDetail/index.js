import React, { useEffect, useContext, useState } from "react";
import { useParams } from 'react-router-dom';
import { Card, Divider } from "antd";


import Spinning from "~/components/Spinning";
import ProductDetailInfo from "~/components/ProductDetail/ProductDetailInfo";
import ProductVariants from "~/components/ProductDetail/ProductVariants";

import { NotificationContext } from "~/context/UI/NotificationContext";
import { getProductDetail } from '~/api/product'
import {
    RESPONSE_CODE_SUCCESS,
} from "~/constants";
import ReportProducts from "~/components/ProductDetail/ReportProducts";




function ProductDetail() {

    const { id } = useParams();
    const notification = useContext(NotificationContext);

    const [loading, setLoading] = useState(false);
    const [product, setProduct] = useState(null)

    useEffect(() => {
        setLoading(true)
        getProductDetail(id)
            .then((res) => {
                if (res.data.status.responseCode === RESPONSE_CODE_SUCCESS) {
                    setProduct(res.data.result)
                }
                setTimeout(() => {
                    setLoading(false)
                }, 500)
            })
            .catch((err) => {
                notification('error', "Tham số tìm kiếm không hợp lệ!");
                setLoading(false)
            })
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const getData = () => {
        setLoading(true)
        getProductDetail(id)
            .then((res) => {
                if (res.data.status.responseCode === RESPONSE_CODE_SUCCESS) {
                    setProduct(res.data.result)
                }
                setTimeout(() => {
                    setLoading(false)
                }, 500)
            })
            .catch((err) => {
                notification('error', "Tham số tìm kiếm không hợp lệ!");
                setLoading(false)
            })
    }

    return (
        <>
            {product === null ?
                <></>
                :
                <Spinning spinning={loading}>
                    <ProductDetailInfo product={product} callBack={getData} />
                    <Divider />

                    <Card
                        title="Mô tả sản phẩm"
                    >
                        <div dangerouslySetInnerHTML={{ __html: product.description }} />
                    </Card>

                    <Divider />

                    <ProductVariants productVariants={product.productVariants} />

                    <Divider />

                    <ReportProducts reportProducts={product.reportProducts} callBack={getData} />

                </Spinning>
            }
        </>
    );
}

export default ProductDetail;