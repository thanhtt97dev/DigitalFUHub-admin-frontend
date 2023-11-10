import React from "react";
import { Card, Row, Col } from "antd";

import CarouselCustom from "~/components/Carousels/CarouselCustom";
import DescriptionsTableProductInfo from "~/components/ProductDetail/DescriptionsTableProductInfo";



function ProductDetailInfo({ product, callBack }) {

    return (
        <Card
            title="Thông tin sản phẩm"
        >
            <Row>
                <Col offset={1} span={10}>
                    <CarouselCustom
                        data={[product.thumbnail, ...product.productMedias]}
                        styleCarousel={{ with: "450px", height: "450px" }}
                        styleImage={{ with: "450px", height: "450px" }}
                    />
                </Col>
                <Col offset={1} span={10}>
                    <DescriptionsTableProductInfo product={product} callBack={callBack} />
                </Col>
            </Row>
        </Card>
    );
}

export default ProductDetailInfo;