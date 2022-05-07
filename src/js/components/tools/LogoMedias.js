import React, { Component, Fragment, useState, useEffect, useContext  } from 'react';
import { NavLink, useParams } from "react-router-dom";
import UserContext from '../../UserContext';
import Swiper from 'react-id-swiper';

const LogoMedias = res => {

	const [swiper, updateSwiper] = useState(null);

  const goNext = () => {
		if (swiper !== null) {
			swiper.slideNext();
		}
  };

  const goPrev = () => {
		if (swiper !== null) {
			swiper.slidePrev();
		}
  };

	let toShow = window.innerWidth > 1200 ? 8 : 2;

	let params = {
		slidesPerView: 6,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false
    },
    breakpoints: {
      1400: {
        slidesPerView: 6,
        slidesPerColumn: 1
      },
      1000: {
        slidesPerView: 4,
        slidesPerColumn: 1
      },
      600: {
        slidesPerView: 2,
        slidesPerColumn: 1
      },
      0: {
        slidesPerView: 2,
        slidesPerColumn: 1
      }
    }
	};
	const medias = [...Array(7).keys()];
	return(
		<div className="logos">
			<div className="images images-slider">
			{medias.length ?
			<Swiper getSwiper={updateSwiper} {...params}>
				{medias.map((element, index) => {
          let counter = element+1;
					return (
						<div key={index} className="item">
							<div className="wrapper">
								<img src={globalFileServer + 'home/manufacturers/' + (counter) + '.png'} />
							</div>
						</div>
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
