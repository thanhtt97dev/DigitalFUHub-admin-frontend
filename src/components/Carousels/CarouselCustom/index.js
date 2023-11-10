import React, { useRef } from 'react';
import { Carousel, Image } from 'antd';
import classNames from 'classnames/bind';

import styles from './CarouselCustom.module.scss';
const cx = classNames.bind(styles);

function CarouselCustom({ data, styleCarousel, styleImage, callback }) {

    const slider = useRef(null);

    return (
        <div className={cx("container")}>
            <button
                className={cx("btn-navigation-prev")}
                onClick={() => slider.current.prev()}
            >
                <div className={cx("btn-navigation-prev_img")} />
            </button>
            <Carousel
                className={cx("carousel")}
                ref={slider}
                style={styleCarousel}
            >
                {data.map((x) => {
                    return <Image style={styleImage} src={x} alt='product-img' />
                })}
            </Carousel>
            <button
                className={cx("btn-navigation-next")}
                onClick={() => slider.current.next()}
            >
                <div className={cx("btn-navigation-next_img")} />
            </button>
        </div>
    );
}

export default CarouselCustom;