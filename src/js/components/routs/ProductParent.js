import ReactDOM from "react-dom";
import React, { Component, Fragment, useState, useEffect, useContext  } from 'react';
import { NavLink } from "react-router-dom";
import {Helmet} from "react-helmet";
import ProductInfo from "./productPage/ProductInfo";
import Parallax from './Parallax';
import ProductPopUp from "./productPage/ProductPopUp";
import ProductAddToCart from "./productPage/ProductAddToCart";
import ProductAddToCartCatalog from "./productPage/ProductAddToCartCatalog";

import UserContext from '../../UserContext';
import CategorySlide from '../tools/CategorySlide';

let arrayGLB = [];
let glbCatObj = {
  'Id': -1
};


export default class ProductParent extends Component {
	constructor(props){
		super(props);
		this.state = {
			products: [],
      tmpProducts:[],
			toShow: 24,
			info: false,
			viewMode: window.innerWidth > 1000 ? false : true,
			catWidth: 180,
      ProductPopUp: false,
      selectedProd:[],
      dateNew:"",
      openFilter: false,
      filterChosen:false,
      distinctVol:[],
      preload: false,
      categorySlide: true,
      parentProd:[]
		}
		this.close = this.close.bind(this);
    this.closePropdPop = this.closePropdPop.bind(this);



	}

	componentDidMount(){
		this.getProducts(this.props.match.params);
		setTimeout(() => {
			window.scrollTo(0, 0);
		}, 100);
  }
  componentWillReceiveProps(nextProps){
		if (this.props.match.params.id != nextProps.match.params.id ) {
			window.scrollTo(0, 0);
      this.getProducts(nextProps.match.params);
		}
	}

	close(){
		this.setState({info: false});
	}
  closePropdPop(){
    this.setState({ProductPopUp: false});
  }


	componentWillUpdate(nextProps, nextState) {
		if (nextProps.match.params.id !== this.props.match.params.id || nextProps.match.params.subId !== this.props.match.params.subId ) {
			this.setState({toShow: 24});
      let tmpParams = {
				Id: nextProps.match.params.id,
				SubId: nextProps.match.params.subId
			};
			this.props.setMatch(tmpParams);
      setTimeout(() => {
				window.scrollTo(0, 0);
			}, 100);
			this.getProducts(nextProps.match.params);
		}
	}
	getProducts = async(param) => {
    this.setState({preload:true});

		let user = false;
		localStorage.user ? user = JSON.parse(localStorage.user) : null;
		let val = {
      'b2cPriceCode': this.props.state.b2cPriceCode,
      'priceNoLogin': this.props.state.priceNoLogin,
      'id': param.id ? param.id : null
    };

		user ? val.priceFor = user.Type : null;
    user ? val.priceCode = user.PriceList : null;
    user ? val.userId = user.Id : null;
    user ? val.userExtId = user.ExId : null;
    localStorage.role ? val.admin = true : null;

    val.lvl1 = this.props.match.params.lvl1;

    const valAjax = {
      funcName: '',
      point: 'sub_products_per_category_view',
      val: val
    };

    try {
      const data = await this.props.ajax(valAjax);


      let products = data.products;
      let parentProd = data.parentProd;
      let tmpDistinctVol = [];
      let match;

      this.setState({ products, tmpProducts: products, parentProd});

      this.setState({preload:false});

    } catch(err) {
      console.log('connection error GetSales');
      this.setState({preload:false});
    }

	}



	render(){
		let parentCategory = this.props.state.categories.filter(item => item.Id == this.props.match.params.lvl1)[0];
    let childCategory = this.props.state.categories.filter(item => item.Id == this.props.match.params.lvl2)[0];
    let subChildCategory = this.props.state.categories.filter(item => item.Id == this.props.match.params.lvl3)[0];

    let props = Object.assign({}, this.props);
    let lang = this.props.state.lang;

		return (

			<div className="page-container category-page productParent">
        <CategorySlide />

        <div className={"productParent-sub"}>

          {this.state.preload ?
            <div className="spinner-wrapper">
              <div className="spinner">
                <div className="bounce1"></div>
                <div className="bounce2"></div>
                <div className="bounce3"></div>
              </div>
            </div>
          : null}
  				{parentCategory ?
  					<Helmet>
  						<title>{parentCategory.Title}</title>
  						<meta name="keywords" content={parentCategory.Title} />
  						<link rel="canonical" href={entry + '/category/' + parentCategory.ParentId + '/' + parentCategory.Id} />
  						<link rel="alternate" href={entry + '/category/' + parentCategory.ParentId + '/' + parentCategory.Id} hreflang="he-il" />
  					</Helmet>
  				: null}
  				{this.state.info ? ReactDOM.createPortal(
  					<div className="my-modal prod-info">
  						<div className="modal-wrapper animated">
                <div className="close-cont">
    							<div onClick={this.close} className="close">
    								<img src={globalFileServer + 'icons/close.svg'} />
    							</div>
                </div>
  							<ProductInfo {...this}/>
  						</div>
  						<div onClick={this.close} className="overflow"></div>
  					</div>,
  					document.getElementById('modal-root')
  				) : null}
          {this.state.ProductPopUp ? ReactDOM.createPortal(
  					<div className="my-modal prod-info">
  						<div className="modal-wrapper animated">
                <div className="close-cont">
    							<div onClick={() => this.setState({ProductPopUp: !this.state.ProductPopUp})} className="close">
    								<img src={globalFileServer + 'icons/close.svg'} />
    							</div>
                </div>
  							<ProductPopUp {...this} lang={lang}/>
  						</div>
  						<div onClick={this.close} className="overflow"></div>
  					</div>,
  					document.getElementById('modal-root')
  				) : null}

          <div className="title-breadcrumbs">
            {parentCategory ?
            <div className="container flex-container">
              <div className="col-lg-6 breadcrumbs">
                <ul>
                  <li>
                    <NavLink to={"/home/" + lang}>בית</NavLink>
                  </li>
                  <li>
                    <NavLink to={"/category-page/" + parentCategory.Id + "/0/0/" + lang}>{parentCategory.Title}</NavLink>
                  </li>
                  {childCategory ?
                    <li>
                      <NavLink to={'/category/'+parentCategory.Id + "/" + childCategory.Id + "/0/" + lang}>
                        <span>{childCategory.Title}</span>
                      </NavLink>
                    </li>
                  :
                    <li>
                      <span>{parentCategory.Title}</span>
                    </li>
                  }
                  {subChildCategory ?
                    <li>
                      <NavLink to={'/category/'+parentCategory.Id + "/" + childCategory.Id  + "/" + subChildCategory.Id + "/" + lang}>
                        <span>{subChildCategory.Title}</span>
                      </NavLink>
                    </li>
                  :null}
                </ul>
              </div>
            </div>
            :null}
          </div>
          {parentCategory ?
            <div className="category-header-cont">
              <div className="row-cont flex-container">

                  <div className="h1-cont col-lg-8">
                    <h1>{Object.keys(this.state.parentProd).length ? this.state.parentProd.Title : null}</h1>
                  </div>
              </div>
            </div>
          :null}

          <div className="category-wrapper">
  					<div id="navFix" className={this.state.viewMode ? "flex-container products-view list-view" : "flex-container products-view"}>
  						{!this.state.tmpProducts.length ? <h1 className="hide-on-desctop no-product">לא קיימים מוצרים</h1> : null}
  						{this.state.tmpProducts.map((element, index) => {
  							let inCart = this.props.state.productsInCart.filter(item => item.Products.CatalogNumber == element.CatalogNumber);
  							let productSales = this.props.state.productSales.length ? this.props.state.productSales.filter(item => item.ForCatalogNum == element.CatalogNumber) : [];
                let diffQuantity = this.props.state.productSalesDiffQuan.filter(item => item.ProdId == element.Id && item.Quantity != null);
  							let maam = this.props.state.user.Type == 2 ? 1 : 1;
                let image = this.props.state.images.length ? this.props.state.images.filter(item => item == element.CatalogNumber) : [];
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

                if(index <= this.state.toShow){
                  return(
                    <div key={index} className={element.Unpublished ? "col-lg-2 wrapper-cont unpublished" : "col-lg-2 wrapper-cont"}>
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
                            <img className="img" src={element.Extra1} onError={(e) => e.target.src = globalFileServer + 'placeholder.jpg'} />
                          </div>
                          <div className={this.props.state.user ? "prod-data-cont user" : "prod-data-cont"}>
      											<h3 className="p-title">{lang=="he" ? element.Title : element.TitleEng}</h3>
                            <div className="barcode-cont">
                              <p>{"מק״ט: " + element.CatalogNumber}</p>
                              {element.Barcode ?
                                <p>{"ברקוד: " + element.Barcode}</p>
                              :null}
                            </div>
                            <div>
                              {(this.props.state.user && this.props.state.user.Id) ||  (!this.props.state.user && !localStorage.role && this.props.state.priceNoLogin == "1") ?
          											<div className="price-main-cont">
                                  {element.Price && element.Price != '0' ?
                                    <div className="price-cont">
                                      <div className="price-subCont">
                                        {(inCart.length && (("UnitChosen" in inCart[0] && (inCart[0].UnitChosen == 0 || inCart[0].UnitChosen == 2)) ||  (!("UnitChosen" in inCart[0])))) || (inCart.length == 0) ?
                                          <h3 className="price">{(parseFloat(element.Price) * maam).toFixed(2)}</h3>
                                        :
                                          <h3 className="price">{(parseFloat(element.Price) * parseInt(element.PackQuan) * maam).toFixed(2)}</h3>
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
                        {this.props.state.user && element.Price && element.Price != 0 ?
                          <div className={inCart.length ? "add-to-cart in-cart catalog after-add" : "add-to-cart not-in-cart catalog before-add"}>
                            <ProductAddToCartCatalog
                              inCart={inCart}
                              element={element}
                              price={(parseFloat(element.Price) * maam)}
                              {...props}
                            />
    											</div>
                        :null}

  										</div>
  									</div>
  								);
                }
  						})}
  					</div>
  				</div>
          <Parallax img="parrallax_5.jpg" />
        </div>
			</div>
		)
	}
}
