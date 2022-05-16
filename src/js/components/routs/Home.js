import ReactDOM from "react-dom";
import React, { Component, Fragment, useState, useEffect, useRef, useContext } from 'react';
import { NavLink, useParams } from "react-router-dom";
import { Parallax, Background } from 'react-parallax';
import UserContext from '../../UserContext';
import SweetAlert from 'sweetalert2';
import ContactUs from './Contacts.js'
import LogoMedias from '../tools/LogoMedias.js';
import ContactFooter from '../tools/ContactFooter.js';
import ProductAddToCartCatalog from "./productPage/ProductAddToCartCatalog";

import { Swiper, SwiperSlide } from 'swiper/react/swiper-react';

import { Pagination, Navigation, Thumbs } from 'swiper'
//SwiperCore.use([Autoplay]);

import SecondBanner from "../header/SecondBanner.jsx";
import RecommendedMonth from "../header/RecommendedMonth.jsx";
import HasmalFooter from "../footer/HasmalFooter";
import SearchModal from "../searchModal/SearchModal";
import CategoryModal from "../categoryModal/CategoryModal";

import 'swiper/swiper-bundle.min.css'
import 'swiper/swiper.min.css'
import SearchMobileInput from "../searchMobileInput/SearchMobileInput";
import DesktopFilterInput from "../desktopFilterInput/DesktopFilterInput";


const ShowCase = res => {

	const [activeIndex, setActiveIndex] = useState(0);
  const [active, setActive] = useState(false);
	const items = [
		{
			Img: '1.png'
		}
	];

	useEffect(() => {
    setTimeout(() => {
      ref.current.swiper.update();
      ref.current.swiper.autoplay.start();
    }, 350);
  }, [res.app.state.cart]);

  const ref = useRef(null);

  let settings = {
    slidesPerView: 1,
    slidesPerView: 1,
    loop: true,
    speed: 1000/*,
    autoplay: true*/
  };
  let toShow = 1;
  const goNext = () => {
    if (ref.current !== null && ref.current.swiper !== null) {
      ref.current.swiper.slideNext();
      ref.current.swiper.autoplay.start();
    }
  };
  const goPrev = () => {
    if (ref.current !== null && ref.current.swiper !== null) {
      ref.current.swiper.slidePrev();
      ref.current.swiper.autoplay.start();
    }
  };

	return(
		<div className="showcase">
			<div className="images images-slider">
	      <Swiper ref={ref} {...settings}>
	        {items.map((element, index) => {
	          return (
	            <SwiperSlide key={index} className="item">
								<div className="wrapper">
									<img src={globalFileServer + 'home/banner/' + element.Img} />
								</div>
                {/*
								<div className="masc">
                  <div className="img">
                    <img src={globalFileServer + 'logo.png'} />
                  </div>
								</div>
                */}
	            </SwiperSlide>
	          );
	        })}
	      </Swiper>
				<Fragment>
					<button className="prev" onClick={goPrev}>
						<img src={globalFileServer + 'icons/arrow-backward.svg'} />
					</button>
					<button className="next" onClick={goNext}>
						<img src={globalFileServer + 'icons/arrow-forward.svg'} />
					</button>
				</Fragment>
			</div>
    </div>
	);
}

const ProductsSale = res => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [active, setActive] = useState(false);

  const ref = useRef(null);

  //const app = useContext(UserContext);

  useEffect(() => {
    setTimeout(() => {
      ref.current.swiper.update();
    }, 350);
  }, [res.appState.cart]);

  const goNext = () => {
    if (ref.current !== null && ref.current.swiper !== null) {
      ref.current.swiper.slideNext();
      setActiveIndex(ref.current.swiper.activeIndex);
    }
  };
  const goPrev = () => {
    if (ref.current !== null && ref.current.swiper !== null) {
      ref.current.swiper.slidePrev();
      setActiveIndex(ref.current.swiper.activeIndex);
    }
  };

  const getLowPrice = (price) => {
    let total = parseFloat(price) / 10;
    let val = "גרם 100 / " + total.toFixed(2);
    return val;
  };
  const getWeightPrice = (price) => {
    let total = parseFloat(price);
    let val = 'ק"ג / ' + total.toFixed(2);
    return val;
  };

  const setActiveProduct = id => {
    setActive(id);
  };

  let width = window.innerWidth;
  let toShow = 6;
  let column = 2;
  // this.props.desktopRightSideBar
 
	let lang = res.appState.lang;
  return (
    
    <div className="products-sale product-list">
      <div className="title-wrapper">
        <h1 className="title">
          <span>מוצרים מומלצים</span>
        </h1>
      </div>
      <div className="items images images-slider-cont">
        <Swiper ref={ref}  >
          {res.items.map((element, index) => {

						let inCart = res.appState.productsInCart.filter(item => item.Products.CatalogNumber == element.CatalogNumber);
						let productSales = res.appState.productSales.length ? res.appState.productSales.filter(item => item.ForCatalogNum == element.CatalogNumber) : [];
						let diffQuantity = res.appState.productSalesDiffQuan.filter(item => item.ProdId == element.Id && item.Quantity != null);
						let maam = res.appState.user.Type == 2 ? 1 : 1;
						let image = res.appState.images.length ? res.appState.images.filter(item => item == element.CatalogNumber) : [];
						let type;

						if((inCart.length && !("UnitChosen" in inCart[0])) ||  (inCart.length == 0)){
							element.Unit == 2 ? type = " לק״ג" : type = " ליחידה"
						}else if((inCart.length && (("UnitChosen" in inCart[0] && inCart[0].UnitChosen == 0)))){
							type = " ליחידה";
						}else if((inCart.length && (("UnitChosen" in inCart[0] && inCart[0].UnitChosen == 1)))){
							type = " לקרטון"
						}else if((inCart.length && (("UnitChosen" in inCart[0] && inCart[0].UnitChosen == 2)))){
							type = " לק״ג";
						}

            return (
              <SwiperSlide key={index} className="product-item">
								<div className={!element.ActualQuan ? "wrapper" : "wrapper disable"}>
									{(productSales.length || diffQuantity.length) && !element.Status ?
										<div onClick={() => this.setState({info: element})} className="flip-card">
											<div className="flip-card-inner">
												<div className="flip-card-front">
													<img src={globalFileServer + 'icons/percent.svg'} />
												</div>
												<div className="flip-card-back">
													<img src={globalFileServer + 'icons/info-white.svg'} />
												</div>
											</div>
										</div>
									: null}
									<div onClick = {() => this.setState({selectedProd:element, ProductPopUp:true})}>
										<div className="img-cont">
											<img className="img" src={element.Extra1 ? element.Extra1 : globalFileServer + 'placeholder-1.jpg'} />
										</div>
										<div className="prod-data-cont">
											<h3 className="p-title">{lang=="he" ? element.Title : element.TitleEng}</h3>
											<div>
												{(res.appState.user && res.appState.user.Id) ||  (!res.appState.user && !localStorage.role && res.appState.priceNoLogin == "1") ?
													<div className="price-main-cont">
														{element.Price && element.Price != '0' ?
															<div className="price-cont">
																<div className="price-subCont">
																	{(inCart.length && (("UnitChosen" in inCart[0] && (inCart[0].UnitChosen == 0 || inCart[0].UnitChosen == 2)) ||  (!("UnitChosen" in inCart[0])))) || (inCart.length == 0) ?
																		<h3 className="price">{(parseFloat(element.Price) * maam).toFixed(2) + type}</h3>
																	:
																		<h3 className="price">{(parseFloat(element.Price) * parseInt(element.PackQuan) * maam).toFixed(2) + type}</h3>
																	}
																</div>
																{parseFloat(element.OrgPrice) > element.Price ?
																<div className="orgPrice-subCont">
																	<div className="price-widh-discount">
																		{(inCart.length && (("UnitChosen" in inCart[0] && (inCart[0].UnitChosen == 0 || inCart[0].UnitChosen == 2)) ||  (!("UnitChosen" in inCart[0])))) || (inCart.length == 0) ?
																			<h3 className="old-price">{(parseFloat(element.OrgPrice) * maam).toFixed(2)}</h3>
																		:
																			<h3 className="old-price">{(parseFloat(element.OrgPrice) * parseInt(element.PackQuan) * maam).toFixed(2)}</h3>
																		}
																	</div>
																</div>
															:null}
															</div>
														:null}
													</div>
												:null}
											</div>
										</div>
									</div>
									{/*.Type || res.appState.b2cAvailiable*/}
									{(res.appState.user || res.appState.b2cAvailiable)  && !element.ActualQuan && element.Price != 0 ?
									<div className={inCart.length ? "add-to-cart in-cart catalog after-add" : "add-to-cart not-in-cart catalog before-add"}>
										<ProductAddToCartCatalog
											inCart={inCart}
											element={element}
											{...res.appProps}
										/>
									</div>
									:null}
								</div>
              </SwiperSlide>
            );
          })}
        </Swiper>
        {res.items.length > toShow ? (
          <div className="swiper-navigation">
            <button
              className="swiper-nav prev"
              onClick={goPrev}
              data-disabled={activeIndex == 0 ? true : false}
            >
              <img src={globalFileServer + "icons/arrow-backward.svg"} />
            </button>
            <button
              className="swiper-nav next"
              onClick={goNext}
              data-disabled={
                activeIndex == res.items.length - (toShow * column) - 2 ? true : false
              }
            >
              <img src={globalFileServer + "icons/arrow-forward.svg"} />
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );
};


const CategorySale = res => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [active, setActive] = useState(false);

  const ref = useRef(null);

  //const app = useContext(UserContext);

  useEffect(() => {
    setTimeout(() => {
      ref.current.swiper.update();
    }, 350);
  }, [res.appState.cart]);

  const goNext = () => {
    if (ref.current !== null && ref.current.swiper !== null) {
      ref.current.swiper.slideNext();
      setActiveIndex(ref.current.swiper.activeIndex);
    }
  };
  const goPrev = () => {
    if (ref.current !== null && ref.current.swiper !== null) {
      ref.current.swiper.slidePrev();
      setActiveIndex(ref.current.swiper.activeIndex);
    }
  };



  let width = window.innerWidth;
  let toShow = 5;
  let column = 1;


	let lang = res.appState.lang;
  let catsLvl1 = res.items.filter((item) => {return item.LvlNumber == "1"});

  return (
    res.desktopRightSideBar ? null
    :
    <div className="products-sale product-list">
      <div className="title-wrapper">
        <h1 className="title">
          <span>קטגוריות מוצרים</span>
          <div>
            <div className="arrow_down selected_down "></div>
          </div>
        </h1>
      </div>
      <div className="items images images-slider images-slider-cont">
        <Swiper  
          loop={true}
          pagination={{clickable:true}}
          grabCursor={true}
          modules={[Navigation, Pagination, Thumbs]}
          ref={ref} 
          slidesPerView={3}
          >
          {catsLvl1.map((element, index) => {

            return (
              <SwiperSlide key={index} className="product-item">
                
								<div className={!element.ActualQuan ? "wrapper" : "wrapper disable"}>
                  <NavLink to={"/category/" + element.Id + "/0/0/0" }>
										<div className="img-cont">
											{element.Img ? <img className="img" src={element.Img} /> : <img src={globalFileServer + 'placeholder.jpg'} />}
										</div>
										<div className="prod-data-cont">
                      <div>
                        <h3 className="p-title">{lang=="he" ? element.Title : element.TitleEng}</h3>
                        <div className="product_number"><p>פריטים 312</p></div> 
                      </div>
                      {/* <div className="sub_category flex-container">
                        <div className="col-lg-6 right_category"> 
                          <li>במאוס אובר</li>
                          <li>תת קגוריה 1</li>
                          <li>תת קגוריה 2</li>
                          <li>תת קגוריה 3</li>

                        </div>
                        <div className="col-lg-6 left_categoty"> 
                          <li>תת קגוריה 4</li>
                          <li>תת קגוריה 5</li>
                          <li>תת קגוריה 6</li>
                          <li>תת קגוריה 7</li>
                        </div>
                      </div> */}
										</div>
									</NavLink>
								</div>
              </SwiperSlide>
            );
          })}


        </Swiper>
        {catsLvl1.length > toShow ? (
          <div className="swiper-navigation">
            <button
              className="swiper-nav prev"
              onClick={goPrev}
              data-disabled={activeIndex == 0 ? true : false}
            >
              <img src={globalFileServer + "icons/arrow-backward.svg"} />
            </button>
            <button
              className="swiper-nav next"
              onClick={goNext}
              data-disabled={
                activeIndex == catsLvl1.length - (toShow * column) - 2 ? true : false
              }
            >
              <img src={globalFileServer + "icons/arrow-forward.svg"} />
            </button>
          </div>
        ) : null}
      </div>
    </div>
  );

}



export default class Home extends Component {
	state = {
		showCase: [],
		products: [],
		parallax: [],
		departments: [],
		imageText: [],
		contacts: [],
    ContactBtm: [],
    ContactFormInputs: [],
		about: [],
    name:"",
    mail:"",
    phone:"",
    msg:"",
    preload: false,
    filteredProducts:[],
    loader:false,
    promotedData:[],
    randomPromotedData:[],
	};

	componentDidMount = () => {
		setTimeout(() => window.scrollTo(0, 0), 100);
		this.getItems();
	}



	getItems = async () => {
      let random = []
      const val = {
  			funcName: 'getPromotedProduct',
  	    point: 'products'
  		};

  		try {
  	    const data = await this.props.ajax(val);
        this.setState({
          promotedData:data
        });

      for(let i = 0; i < 6; i++){
        let randomized = data[Math.floor(Math.random() * data.length)];
        random.push(randomized)
      }

      this.setState({randomPromotedData: random})
  	  } catch(err) {
  	    //this.props.connectionError('connection error GetSales');
        console.log('connection error getPromotedProduct');
  	  }
  };

	getFilteredProducts = async (e) => {
    if(e != '') {
      let array = e.split(' ');
			let val = { 'wordArr': array };
      const valAjax = {
        funcName: '',
        point: 'product_search',
        val: val
      };

      this.setState({loader:true})
      try {
        const data = await this.props.ajax(valAjax);
        this.setState({filteredProducts:data})
        
      } catch(err) {
        console.log('connection error GetSales');
        this.setState({preload:false});
      } finally{
        this.setState({loader:false})
      }
    } else {
      this.setState({filteredProducts:[]})
    }
	}

	setType = () => {}

	render(){
		let lang;
    if(this.props.state.lang){
      lang = this.props.state.lang;
    }
		let appState = this.props.state;
    let props = this.props;
		let constant = this.props.returnConstant;

    let categories = [];
    if(this.props.state.categories.length>0){
			categories = this.props.state.categories.filter(item => !item.ParentId && !item.SubParentId);
    }



		return (
			<div className="home-page">
        <div className="mobile_showcase">
          <SearchMobileInput loader={this.state.loader} filteredProducts={this.state.filteredProducts} getFilteredProducts={this.getFilteredProducts}/>
        </div>

        <div className="showcase">
          <div className="wrapper no-slider">
            <img src={globalFileServer + 'home/banner/1.png'} />
          </div>
          <div className='title-cont'>
          <DesktopFilterInput loader={this.state.loader} filteredProducts={this.state.filteredProducts} getFilteredProducts={this.getFilteredProducts}/>
          </div>
        </div>

        {/* <LogoMedias /> */}


{/*
				<ShowCase app={this.props} />

        <LogoMedias />

				{this.state.products.length ? (
          <ProductsSale
            items={this.state.products}
            appProps={this.props}
            appState={appState}
            products={appState.products}
            increaseCart={this.props.increaseCart}
            decreaseCart={this.props.decreaseCart}
            addToCart={this.props.addToCart}
            setType={this.setType}
          />
        ) : null}
*/}
        { this.props.state.categories.length ?
          <CategorySale
            items={this.props.state.categories}
            appProps={this.props}
            appState={appState}
            products={appState.products}
            increaseCart={this.props.increaseCart}
            decreaseCart={this.props.decreaseCart}
            addToCart={this.props.addToCart}
            setType={this.setType}
            desktopRightSideBar={this.props.desktopRightSideBar}
          />
        :null}
        
        <SecondBanner globalFileServer={globalFileServer} />
        <div className="recomendedMonthTitle">
         <h1>המומלצים של החודש</h1>
        </div>

        <RecommendedMonth randomPromotedData={this.state.randomPromotedData} globalFileServer={globalFileServer}/>
        <LogoMedias />
        <HasmalFooter/>
				{/* <ContactFooter lang={lang} props={this.props}/> */}

    	</div>
		)
	}
}
