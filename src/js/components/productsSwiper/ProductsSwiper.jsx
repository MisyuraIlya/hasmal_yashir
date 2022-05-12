import React, { useRef, useState } from 'react';

import { Swiper, SwiperSlide } from 'swiper/react/swiper-react';

import { Navigation, Thumbs } from 'swiper'


const ProductsSwiper = ({mainImg, variaionData}) => {

  const [activeThumb, setActiveThumb] = useState()

  return (
    <div>
      <Swiper
            modules={[ Thumbs]}
            thumbs={{ swiper: activeThumb }}
      >
        {variaionData.map((i, index) => 
        <SwiperSlide key={index}><img src={i.ImgLink}/></SwiperSlide>
        )}
      </Swiper>

      <Swiper
            onSwiper={setActiveThumb}
            spaceBetween={10}
            slidesPerView={4}
            modules={[ Thumbs]}
      >
        {variaionData.map((i, index) => 
        <SwiperSlide key={index} ><img src={i.ImgLink}/></SwiperSlide>
        )}
        <SwiperSlide> <img  src={mainImg} onError={(e) => e.target.src = globalFileServer + 'placeholder.jpg'} /></SwiperSlide>

      </Swiper>
    </div>
  );
};

export default ProductsSwiper;