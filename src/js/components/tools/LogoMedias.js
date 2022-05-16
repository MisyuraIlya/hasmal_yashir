import React, { Component, Fragment, useState, useEffect, useContext  } from 'react';
import { NavLink, useParams } from "react-router-dom";
import UserContext from '../../UserContext';
import { Swiper, SwiperSlide } from 'swiper/react/swiper-react';

import { Pagination, Navigation, Thumbs } from 'swiper'

const LogoMedias = res => {

	const [swiper, updateSwiper] = useState(null);


	let toShow = window.innerWidth > 1200 ? 8 : 2;


	const medias = [...Array(7).keys()];
	return(
		<div className="logos logos_container">
			<div className="images images-slider">
			{medias.length ?
			<Swiper
			loop={true}
			grabCursor={true}
			spaceBetween={50}
      slidesPerView={7}
			>
				{medias.map((element, index) => {
          let counter = element+1;
					return (
					<SwiperSlide>
						<div key={index} className="item">
							<div className="wrapper">
								<img src={globalFileServer + 'home/manufacturers/' + (counter) + '.png'} />
							</div>
						</div>
					</SwiperSlide>
					)
				})}
			</Swiper>
			: null}
      {/*
			<Fragment>
				<button className="prev" onClick={goPrev}>
					<img src={globalFileServer + 'icons/arrow-backward.svg'} />
				</button>
				<button className="next" onClick={goNext}>
					<img src={globalFileServer + 'icons/arrow-forward.svg'} />
				</button>
			</Fragment>
      */}
		</div>
		</div>
	);
}

export default LogoMedias;
