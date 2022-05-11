import React, { useRef, useState } from 'react';

import { Swiper, SwiperSlide } from 'swiper/react'
import { Thumbs } from 'swiper'


import 'swiper/swiper-bundle.min.css'
import 'swiper/swiper.min.css'


const ProductsSwiper = ({variaionData}) => {

  const [activeThumb, setActiveThumb] = useState({})

  console.log(typeof(activeThumb),activeThumb)
  return (
    <div>
      <Swiper
            loop={true}
            spaceBetween={10}
            modules={[Thumbs]}
            thumbs={{ swiper: activeThumb }}
            onSlideChange={() => console.log('slide change')}
      >
        {variaionData.map((i, index) => 
        <SwiperSlide key={index}><img src={i.ImgLink}/></SwiperSlide>
        )}
      </Swiper>

      <Swiper
            onSwiper={setActiveThumb}
            loop={true}
            spaceBetween={10}
            slidesPerView={4}
            modules={[Thumbs]}
      >
        {variaionData.map((i, index) => 
        <SwiperSlide key={index} ><img src={i.ImgLink}/></SwiperSlide>
        )}
      </Swiper>
    </div>
  );
};

export default ProductsSwiper;