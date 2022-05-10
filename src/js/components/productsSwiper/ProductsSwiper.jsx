import React, { useRef, useState } from 'react';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Controller } from 'swiper';

import 'swiper/swiper-bundle.min.css'
import 'swiper/swiper.min.css'


const ProductsSwiper = ({variaionData}) => {

  const ref = useRef(null);

  return (
    <div>
      <Swiper ref={ref}>
        {variaionData.map((i, index) => 
        <SwiperSlide key={index}><img src={i.ImgLink}/></SwiperSlide>
        )}
      </Swiper>
      <Swiper
        // onSwiper={(swiper) => console.log(swiper)}
        spaceBetween={50}
        slidesPerView={4}
      >
        {variaionData.map((i, index) => 
        <SwiperSlide key={index}><img src={i.ImgLink}/></SwiperSlide>
        )}
      </Swiper>
    </div>
  );
};

export default ProductsSwiper;