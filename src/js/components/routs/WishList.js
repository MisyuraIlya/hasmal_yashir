import ReactDOM from "react-dom";
import React, { Component, Fragment, useState, useEffect, useContext} from 'react';

import { NavLink } from "react-router-dom";
import {Helmet} from "react-helmet";
import ProductInfo from "./productPage/ProductInfo";
import Parallax from './Parallax';
import BarcodeReader from "./productPage/BarcodeReader";
import SweetAlert from 'sweetalert2';
import Quagga from 'quagga';
import ProductPopUp from "./productPage/ProductPopUp";
import ProductAddToCart from "./productPage/ProductAddToCart";
import ProductAddToCartCatalog from "./productPage/ProductAddToCartCatalog";

let products = [];
let arrayGLB = [];
let timeoutId;
const SearchHook= params => {
	const [search, setSearch] = useState('');
  const [searchMode, setSearchMode] = useState(0);

	useEffect(() => {
    return () => {
      clearTimeout(timeoutId);
    }
  }, []);

	const goInactive = word => {
		params.searchPhpFunc(word, searchMode);
	}

	const setWord = word => {
    clearTimeout(timeoutId);
		setSearch(word);
		//timeoutId = setTimeout(() => goInactive(word), 500);
    if(word==""){
      goInactive(word);
    }
	}

  const setMode = mode => {
    setSearchMode(mode);
    setSearch("");
  }

  const searchCheckEnter = (e) => {
    if(e.charCode==13){
      goInactive(search);
    }
  }

	return(
		<div className="search-cont-main">
      <div className="select-cont flex-container">
        <div className="select-btn col-lg-3">
          <p onClick={()=>setMode(0)} className={searchMode == 0 ? 'active' : null}>שם</p>
        </div>
        <div className="select-btn  col-lg-3">
          <p onClick={()=>setMode(1)} className={searchMode == 1 ? 'active' : null}>מק״ט</p>
        </div>
        <div className="select-btn  col-lg-3">
          <p onClick={()=>setMode(2)} className={searchMode == 2 ? 'active' : null}>ברקוד</p>
        </div>
        <div className="select-btn  col-lg-3">
          <p onClick={()=>setMode(3)} className={searchMode == 3 ? 'active' : null}>מותג</p>
        </div>
      </div>
			<div className="search-cont">
				<div className="input">
					<input
						onChange={ e => setWord(e.target.value) }
						value={search}
						type="text"
						placeholder="חיפוש מוצר..."
            onKeyPress={e => searchCheckEnter(e)}

					/>
          <div className="search-btn-cont" onClick={()=> params.searchPhpFunc(search, searchMode)}>
            <p>חיפוש</p>
            <img src={globalFileServer + "icons/search-gray.svg"} alt=""/>
          </div>
				</div>
			</div>
		</div>
	);
}

export default class WishList extends Component {
	constructor(props){
		super(props);
		this.state = {
      products:[],
      info:false,
      toShow: 24,
      ProductPopUp: false,
      barcodeReader: false,
      selectedProd:[],
      searchString: "",
      preload: false,
      lang: 'he',
      searchString:"",
      showNotFound:false
    }
    this.close = this.close.bind(this);
    this.closePropdPop = this.closePropdPop.bind(this);

    this.handleScroll = this.handleScroll.bind(this);
    this.goToProdBySale = this.goToProdBySale.bind(this);
    this.removeFromWishList = this.removeFromWishList.bind(this);

	}
  goToProdBySale(element){
    this.setState({info:false,ProductPopUp:true,selectedProd:element});
  }
	componentDidMount(){
    let lang = this.props.state.lang;
    this.setState({lang});

    let products = localStorage.categoryProducts ? JSON.parse(localStorage.categoryProducts) : [];
    if(!this.props.state.searchMode && localStorage.user){
      if (products.length) {
        this.setState({
  				products: products,
  				toShow: localStorage.toShow
  			});
        let scrollVal = localStorage.scrollVal;
        setTimeout(() => {
          window.scrollTo(0, scrollVal);
        }, 50);
        localStorage.removeItem('categoryProducts');
        localStorage.removeItem('categoryId');
        localStorage.removeItem('toShow');
        localStorage.removeItem('scrollVal');
        window.addEventListener('scroll', this.handleScroll, true);
      }else{
        this.getProducts();
        setTimeout(() => {
          window.scrollTo(0, 0);
          window.addEventListener('scroll', this.handleScroll, true);
        }, 100);
      }
    }else{
      this.props.toggleSearch(true);
      setTimeout(() => {
        $("#scanner_input").focus();
        window.scrollTo(0, 0);
      }, 100);

    }


  }
  componentWillUnmount(){
		window.removeEventListener('scroll', this.handleScroll, true);
    if (location.hash.includes('/cart')) {
			localStorage.setItem('categoryProducts', JSON.stringify(this.state.products));
			localStorage.setItem('categoryId', this.props.match.params.id);
			localStorage.setItem('toShow', this.state.toShow);
		}
  }
  componentWillReceiveProps(nextProps){
    //debugger;
     if(!this.props.state.searchMode && nextProps.state.searchMode){
        this.setState({products:[]});

        setTimeout(() => {
         window.scrollTo(0, 0);
         $("#scanner_input").focus();
        }, 100);
     }else if(this.props.state.searchMode && !nextProps.state.searchMode){
       this.getProducts();
     }
	}

  handleScroll(e) {
		var parallax = document.getElementsByClassName("parallax");
		let wh = window.innerHeight
		if (e.currentTarget.pageYOffset + wh > parallax[0].offsetTop) {
			if (this.state.toShow <= this.state.products.length) {
				this.setState({toShow: this.state.toShow + 24});
			}
		}
    localStorage.setItem('scrollVal', e.currentTarget.pageYOffset);

	}

  getProducts = async () => {

    this.setState({preload:true});

		let user = false;
		localStorage.user ? user = JSON.parse(localStorage.user) : null;
		let val = {
      'b2cPriceCode': this.props.state.b2cPriceCode,
      'priceNoLogin': this.props.state.priceNoLogin
    };
		user ? val.priceFor = user.Type : null;
    user ? val.priceCode = user.PriceList : null;
    user ? val.userId = user.Id : null;
    user ? val.userExtId = user.ExId : null;

    const valAjax = {
      funcName: '',
      point: 'products_regular_per_user',
      val: val
    };

    try {
      const data = await this.props.ajax(valAjax);

      let products = data;
			products.map(item => {
				item.Price ? item.Price = parseFloat(item.Price) : null;
				item.Discount ? item.Discount = parseFloat(item.Discount) : null;
				item.SpecialPrice ? item.SpecialPrice = parseFloat(item.SpecialPrice) : null;
			});
			this.setState({ products });
      this.setState({preload:false});
    } catch(err) {
      console.log('connection error products_regular_per_user');
      this.setState({preload:false});

    }

	}

  close(){
    this.setState({info: false});
  }
  closePropdPop(){
    this.setState({ProductPopUp: false});
  }

  searchPhpFunc = async (value, mode) => {

    this.setState({searchString: value})

    if (value && value!="") {

      this.setState({preload: true, showNotFound:false})

      let user = false;
      localStorage.user ? user = JSON.parse(localStorage.user) : null;

      let wordArr = [];
      let split = value.split(" ");
      if(split.length && split[1] != ""){
        wordArr = split;
      }else{
        wordArr.push(value);
      }

      let val = {
        'wordArr': wordArr,
        'b2cPriceCode': this.props.state.b2cPriceCode,
        'priceNoLogin': this.props.state.priceNoLogin,
        'mode': mode
      };
      debugger;
      user ? val.priceFor = user.Type : null;
      user ? val.priceCode = user.PriceList : null;
      user ? val.userId = user.Id : null;
      user ? val.userExtId = user.ExId : null;

      const valAjax = {
        funcName: '',
        point: 'product_search',
        val: val
      };

      try {
        const data = await this.props.ajax(valAjax);
        this.setState({preload: false})

        let products = data;
        products.map(item => {
          item.Price ? item.Price = parseFloat(item.Price) : null;
          item.Discount ? item.Discount = parseFloat(item.Discount) : null;
          item.SpecialPrice ? item.SpecialPrice = parseFloat(item.SpecialPrice) : null;
        });
        this.setState({ products , showNotFound:true});
      } catch(err) {
        console.log('connection error docs');
        this.setState({preload:false});
      }

		} else {
			this.setState({ products:[] });
      this.setState({preload: false})

		}
  }

  removeFromWishList(catalogNum){
    SweetAlert({
			title: 'מחק מוצר מרשימת המוצרים הקבועים?',
			type: 'info',
			showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: 'אשר',
      cancelButtonText: 'בטל'
		}).then(function (catalogNum,res) {
      if (res.value) {
        let user = false;
        localStorage.user ? user = JSON.parse(localStorage.user) : null;
        let val = {
          'catalogNum': catalogNum,
          'userId': user.Id,
          'ExId':user.ExId
        };

        $.ajax({
          url: globalServer + 'removeFromRegular.php',
          type: 'POST',
          data: val,
        }).done(function(data) {
          let products = this.state.products;
          products = products.filter((ele,ind) => {return ele.CatalogNumber != catalogNum});
          this.setState({ products });
        }.bind(this)).fail(function() {	console.log("error"); });
      }
    }.bind(this,catalogNum)).catch(SweetAlert.noop);



  }
  searchBarcode(){
    this.setState({barcodeReader: true});
  }

  goToProductParent = (element) => {
    this.props.history.push("/productParent/" + element.PrimaryMenuItemId + "/" + element.SecondaryMenuItemId + "/" + element.ThirdMenuItemId + "/" + element.CatalogNumber + "/" + this.props.state.lang);
  }

	render(){
    let props = Object.assign({}, this.props);
    let lang = this.props.state.lang;

		return (
			<div className="page-container wish-list">
        {this.state.preload ?
          <div className="spinner-wrapper">
            <div className="spinner">
              <div className="bounce1"></div>
              <div className="bounce2"></div>
              <div className="bounce3"></div>
            </div>
          </div>
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
							<ProductPopUp {...this}/>
						</div>
						<div onClick={this.close} className="overflow"></div>
					</div>,
					document.getElementById('modal-root')
				) : null}

        <div className="header-img">
          <img src={globalFileServer + 'home/banner/1.png'} alt=""/>
        </div>
				<div className="container">
          {!this.props.state.searchMode?
					<h1 className="title">סל מוצרים קבוע</h1>
          :
          <div>
            <div className="search-wrapp">
              <h1 className="title">חיפוש מוצרים</h1>
            </div>
            <SearchHook searchPhpFunc={this.searchPhpFunc}/>

          </div>
        }
					<div className="flex-container main-prod-cont">
            {this.state.products && this.state.products.length == 0 && this.state.searchString != "" && this.state.showNotFound ?
              <p className="not-found-p">לא נמצאו מוצרים</p>
            :null}
            {this.state.products.map((element, index) => {
              let inCart = this.props.state.productsInCart.filter(item => item.Products.CatalogNumber == element.CatalogNumber);
              let productSales = this.props.state.productSales.length ? this.props.state.productSales.filter(item => item.ForCatalogNum == element.CatalogNumber) : [];
              let diffQuantity = this.props.state.productSalesDiffQuan.filter(item => item.ProdId == element.Id && item.Quantity != null);

							let maam = this.props.state.user.Type == 2 ? 1 : 1;
              let image = this.props.state.images.length ? this.props.state.images.filter(item => item == element.CatalogNumber) : [];
              let type;

              if((inCart.length && !("UnitChosen" in inCart[0])) ||  (inCart.length == 0)){
                element.Unit == 2 ? type = "/יח" : type = "/יח'";
              }else if((inCart.length && (("UnitChosen" in inCart[0] && inCart[0].UnitChosen == 0)))){
                type = "/יח'";
              }else if((inCart.length && (("UnitChosen" in inCart[0] && inCart[0].UnitChosen == 1)))){
                type = "/אריזה";
              }else if((inCart.length && (("UnitChosen" in inCart[0] && inCart[0].UnitChosen == 2)))){
                type = "/אריזה";
              }

              if(index <= this.state.toShow && element.Price){
  							return(
  								<div key={index} className="col-lg-2 prod_sub-cont">
                  {/*
                    <div onClick={this.removeFromWishList.bind(this, element.CatalogNumber)} className="delete">
                      <img src={globalFileServer + 'icons/delete.svg'} />
                    </div>
                    */}
  									<div className={!element.ActualQuan ? "wrapper" : "wrapper disable"}>
                      {(productSales.length || diffQuantity.length) && this.props.state.user.Type && !element.Status ?
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
                      {element.Discount ?
                        <div className="discount-cont">
                          <p>הנחה</p>
                        </div>
                      :null}

                      <div onClick = {!element.Extra3 ? () => this.setState({selectedProd:element, ProductPopUp:true}) : ()=> this.goToProductParent(element)}>
                        <div className="img-cont">
                          <img className="img" src={element.Extra1} onError={(e) => e.target.src = globalFileServer + 'placeholder.jpg'} />

                        </div>
                        <div className="prod-data-cont">
    											<h3 className="p-title">{element.Title}</h3>
                          <div className="barcode-cont">
                            <p>{"מק״ט: " + element.CatalogNumber}</p>
                            {element.Barcode ?
                              <p>{"ברקוד: " + element.Barcode}</p>
                            :null}
                          </div>
                          <div>
                            {(this.props.state.user && this.props.state.user.Id) ||  (!this.props.state.user && this.props.state.priceNoLogin == "1") ?
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
                      {(this.props.state.user.Type || this.props.state.b2cAvailiable) && !element.ActualQuan && element.Price && element.Price != 0 && !element.Extra3 ?
                        <div className={inCart.length ? "add-to-cart in-cart catalog after-add" : "add-to-cart not-in-cart catalog before-add"}>
                        <ProductAddToCartCatalog
                          inCart={inCart}
                          element={element}
                          price={(parseFloat(element.Price) * maam)}

                          {...props}
                        />
                        </div>
                      :null}

                      {this.props.state.user && element.Extra3 ?
                        <NavLink className={"meaged-nav"} to={"/productParent/" + element.PrimaryMenuItemId + "/" + element.SecondaryMenuItemId + "/" + element.ThirdMenuItemId + "/" + element.CatalogNumber + "/" + lang}>
                          <div className={"meaged-main"}>
                            <p>{lang == "he" ? "צפה במוצרים" : "View Products"}</p>
                          </div>
                        </NavLink>
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
		)
	}
}
