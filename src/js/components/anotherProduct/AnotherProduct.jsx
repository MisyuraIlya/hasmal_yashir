import React from 'react';
import { NavLink } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react/swiper-react';
const AnotherProduct = ({getRandomProduct}) => {

  let random1 = getRandomProduct()
  let random2 = getRandomProduct()
  let random3 = getRandomProduct()
  let random4 = getRandomProduct()
  let random5 = getRandomProduct()
  let random6 = getRandomProduct()
  let randomArrayOne = [random1, random2, random3]
  let randomArraySecond = [random4, random5, random6]
  return (
    <div className='another_container'>
      <div className='another_container_banner_image'>
        <img src={globalFileServer + 'category/modal/anotherProductBanner.png'} className='right_modal_lupa_image'/>
      </div>
      <div className='abother_container_content_card'>
        <div className='another_title'>
          <h1>עוד ממשפחת המוצר</h1>
        </div>
        <div className='another_product_card_container'>
          <Swiper 
            spaceBetween={35}
            slidesPerView={3}
            >
            {randomArrayOne.map((i,index) => 

            <SwiperSlide key={index}>
              <NavLink to={i.CatalogNumber}>
                <div className='another_product_card' >
                  <div className='annother_product_img_cont'>
                    {i.ImgLink ? <img src={i.ImgLink} /> : <img src={ globalFileServer + 'placeholder.jpg'} />}
                  </div>
                  <div className='another_prodcut_card_cont'>
                    <div className='another_product_card_font'>
                    <h2>{i.Title}</h2>
                    <h2>{i.EngDesc}</h2>
                    </div>
                  </div>
                </div>
              </NavLink>
            </SwiperSlide>
            )}
          </Swiper>
        </div>
        <div className='another_title'>
          <h1>יכול להיות שגם אחד מהמוצרים הללו יעניין אותך</h1>
        </div>
        <div className='another_product_card_container'>
          <Swiper 
            spaceBetween={35}
            slidesPerView={3}
            >
            {randomArraySecond.map((i,index) => 
            
            <SwiperSlide key={index}>
              <NavLink to={i.CatalogNumber}>
                <div className='another_product_card' >
                  <div className='annother_product_img_cont'>
                  {i.ImgLink ? <img src={i.ImgLink} /> : <img src={ globalFileServer + 'placeholder.jpg'} />}
                  </div>
                  <div className='another_prodcut_card_cont'>
                    <div className='another_product_card_font'>
                    <h2>{i.Title}</h2>
                    <h2>{i.EngDesc}</h2>
                    </div>
                  </div>
                </div>
              </NavLink>
            </SwiperSlide>
            )}
          </Swiper>
        </div>
      </div>
    </div>
  );
};

export default AnotherProduct;