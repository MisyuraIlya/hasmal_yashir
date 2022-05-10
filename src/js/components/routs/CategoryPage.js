import ReactDOM from "react-dom";
import React, { Component, Fragment, useState, useEffect, useContext  } from 'react';
import { NavLink } from "react-router-dom";
import {Helmet} from "react-helmet";
import ProductInfo from "./productPage/ProductInfo";
import Parallax from './Parallax';
import ProductPopUp from "./productPage/ProductPopUp";
import ProductAddToCart from "./productPage/ProductAddToCart";
import ProductAddToCartCatalog from "./productPage/ProductAddToCartCatalog";
import ProductAddToCartCatalogList from "./productPage/ProductAddToCartCatalogList";
import HasmalCategoryBanner from '../hasmalCategory/HasmalCategoryBanner';
import UserContext from '../../UserContext';
import CategorySlide from '../tools/CategorySlide';

let arrayGLB = [];
let glbCatObj = {
  'Id': -1
};


export default class CategoryPage extends Component {
	constructor(props){
		super(props);
		this.state = {
			products: [],
      tmpProducts:[],
      variationData:[],
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
      openFilter: false,
      backToInventory:false,
      newInStock: false,
      inAlon: false,
      searchString:"",
      brandsArr:[],
      filteredBrandsArr:[],
      chosenBrand:false,
      morePop: false,
      brandSearchString:"",
		}
		this.handleScroll = this.handleScroll.bind(this);
		this.close = this.close.bind(this);
    this.closePropdPop = this.closePropdPop.bind(this);

		this.sortProducts = this.sortProducts.bind(this);
		this.autoScroll = this.autoScroll.bind(this);
    this.goToProdBySale = this.goToProdBySale.bind(this);


	}
  goToProdBySale(element){
    let selectedProdArr = this.props.state.products.filter((ele,itm) => {return ele.Id == element.Id});

    this.setState({info:false,ProductPopUp:true,selectedProd:selectedProdArr[0]});
  }
	componentDidMount(){

    let products = localStorage.categoryProducts ? JSON.parse(localStorage.categoryProducts) : [];
    if (localStorage.categoryId == this.props.match.params.lvl1 + "/" + this.props.match.params.lvl2 + "/" + this.props.match.params.lvl2 && products.length) {
			this.setState({
				products: products,
        tmpProducts: products,
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

      let match;
      let brandsArr = [];
      products.map(item => {
        item.Price ? item.Price = parseFloat(item.Price) : null;
        item.Discount ? item.Discount = parseFloat(item.Discount) : null;
        item.SpecialPrice ? item.SpecialPrice = parseFloat(item.SpecialPrice) : null;

        match = false;
        if(item.Extra5 && item.Extra5!=""){
          for (let i = 0; i < brandsArr.length; i++) {
            if (brandsArr[i] == item.Extra5) {
              match = true;
              break;
            }
          }
          if(!match){
            brandsArr.push(item.Extra5);
          }
        }
      });
      brandsArr.sort();
      brandsArr.unshift("כל המותגים");

      this.setState({brandsArr, filteredBrandsArr:brandsArr});
      if(this.props.match.params.id != '0'){
        this.openProductPage(this.props.match.params.id);
      }
		}
		else {
      let tmpParams = {
  			Id: this.props.match.params.id,
  			SubId: this.props.match.params.subId
  		};

  		this.props.setMatch(tmpParams);
  		this.getProducts(this.props.match.params);
  		setTimeout(() => {
  			window.scrollTo(0, 0);
  			window.addEventListener('scroll', this.handleScroll, true);
  		}, 100);
		}

    

  }
  componentWillReceiveProps(nextProps){
		if (this.props.match.params.lvl1 != nextProps.match.params.lvl1 || this.props.match.params.lvl2 != nextProps.match.params.lvl2 || this.props.match.params.lvl3 != nextProps.match.params.lvl3 || this.props.match.params.id != nextProps.match.params.id) {
      if(this.props.match.params.id != nextProps.match.params.id && nextProps.match.params.id !='0'){
        this.openProductPage(nextProps.match.params.id);
      }else if(this.props.match.params.id != nextProps.match.params.id && nextProps.match.params.id =='0'){
        //debugger;

      }else{
        window.scrollTo(0, 0);
        //debugger;
        this.resetSearch();
        this.resetCheckBox('','','mount');
        this.resetBrand();
        this.getProducts(nextProps.match.params);
      }
		}
	}

  // filteredVatiation = (productId) => {
  //   const filteredData = this.state.tmpProducts.filter((i) => {return i.VariationOf == productId})
    
  //   return filteredData
  // }

  openProductPage = (encodedCatalog) =>{
    let selectedProd;
    let variationData;
    let catalogNumber = decodeURIComponent(encodedCatalog);

    let tmpProducts = this.state.tmpProducts;

    selectedProd = tmpProducts.filter((item)=> {return item.CatalogNumber == catalogNumber})[0];
    variationData = tmpProducts.filter((item) => {return item.VariationOf == encodedCatalog})
    
    this.setState({ProductPopUp:true, selectedProd, variationData});
  }

	componentWillUnmount(){
		window.removeEventListener('scroll', this.handleScroll, true);
		let tmpParams = {
			Id: false,
			SubId: false
		};
		this.props.setMatch(tmpParams);
    if (location.hash.includes('/cart') || location.hash.includes('/productParent')) {
			localStorage.setItem('categoryProducts', JSON.stringify(this.state.products));
      localStorage.setItem('categoryId', this.props.match.params.lvl1 + "/" + this.props.match.params.lvl2 + "/" + this.props.match.params.lvl2);
			localStorage.setItem('toShow', this.state.toShow);
		}
	}
	sortProducts(){
		let products = this.state.products;
		products.sort((a, b) => parseFloat(a.Price) - parseFloat(b.Price));
		this.setState({products, tmpProducts:products});
	}
	close(){
		this.setState({info: false});
	}
  closePropdPop(){
    this.props.history.push("/category/" + this.props.match.params.lvl1 + "/" + this.props.match.params.lvl2 + "/" + this.props.match.params.lvl3 + "/0");

    this.setState({ProductPopUp: false, selectedProd:[]});
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
	componentWillUpdate(nextProps, nextState) {
    /*
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
    */
	}

	getProducts = async (param) => {
    this.setState({preload:true});

		let user = false;
		localStorage.user ? user = JSON.parse(localStorage.user) : null;
		let val = {
      'id': param.subId ? param.subId : param.id,
      'b2cPriceCode': this.props.state.b2cPriceCode,
      'priceNoLogin': this.props.state.priceNoLogin,
      'lvl1id': param.lvl1 ? param.lvl1 : null,
      'lvl2id': param.lvl2 ? param.lvl2 : null,
      'lvl3id': param.lvl3 ? param.lvl3 : null
    };

		user ? val.priceFor = user.Type : null;
    user ? val.priceCode = user.PriceList : null;
    user ? val.userId = user.Id : null;
    user ? val.userExtId = user.ExId : null;
    localStorage.role ? val.admin = true : null;

    const valAjax = {
      funcName: '',
      point: 'products_per_category_view',
      val: val
    };

    try {
      const data = await this.props.ajax(valAjax);
      let products = data.products;
      let match;

      let brandsArr = [];
			products.map(item => {
				item.Price ? item.Price = parseFloat(item.Price) : null;
				item.Discount ? item.Discount = parseFloat(item.Discount) : null;
				item.SpecialPrice ? item.SpecialPrice = parseFloat(item.SpecialPrice) : null;

        match = false;
        if(item.Extra5 && item.Extra5!=""){
          for (let i = 0; i < brandsArr.length; i++) {
            if (brandsArr[i] == item.Extra5) {
              match = true;
              break;
            }
          }
          if(!match){
            brandsArr.push(item.Extra5);
          }
        }
			});
      brandsArr.sort();
      brandsArr.unshift("כל המותגים");

			this.setState({ products, tmpProducts: products, brandsArr, filteredBrandsArr:brandsArr});
      
      this.setState({preload:false});
      if(this.props.match.params.id != '0'){
        this.openProductPage(this.props.match.params.id);
      }
    } catch(err) {
      //this.props.connectionError('connection error GetSales');
      console.log('connection error GetSales');
      this.setState({preload:false});
    }

	}
	autoScroll(ind){
		// setTimeout(() => {


			let children = this.props.state.categories.filter(item => item.ParentId == this.props.match.params.id);

			let fix = ind + 1;
			let val = ((children.length - fix) * this.state.catWidth)+70;
			// $('.cats-scroll')[0].scrollLeft = val;
//      debugger;
      $('#cats-scroll').animate({
        scrollLeft: val
      }, 0);



		// }, 100);
	}
  setUnpublish(id,unpublished){
    let newVal;
    if(unpublished){
      newVal = null;
    }else{
      newVal = "1";
    }


    let val = {
      'itemId': id,
      'value': newVal,
      'token': localStorage.token,
      'role': localStorage.role,
      'paramName': "Unpublished"
    };

    $.ajax({
      url: globalServer + 'new-api/items_edit.php',
      type: 'POST',
      data: val,
    }).done(function(data) {
      if(data.result=="success"){
        let products = this.state.products;
        products.find(item => item.Id == id).Unpublished = newVal;
        this.setState({products, tmpProducts:products });
      }
    }.bind(this)).fail(function() {	console.log("error"); });
  }

  sortProducts = (val) => {

    let tmpProducts = this.state.products;
    if(val != 'כל המוצרים'){
      tmpProducts = tmpProducts.filter((item) => {return item.Code ? item.Code.includes(val) : null})
    }
    this.setState({tmpProducts, filterChosen:val, openFilter:false});

  }

  goToProductParent = (catalgNumber) => {
    this.props.history.push("/productParent/" + this.props.match.params.lvl1 + "/" + this.props.match.params.lvl2 + "/" + this.props.match.params.lvl3 + "/" + catalgNumber + "/" + this.props.state.lang);
  }

  getSubProds = async (myElement) => {


    if(myElement.Extra3 && !myElement.SubProducts ||  (myElement.SubProducts && myElement.SubProducts.length == 0)){
      this.setState({preload:true});

      let user = false;
      localStorage.user ? user = JSON.parse(localStorage.user) : null;
      let val = {
        'b2cPriceCode': this.props.state.b2cPriceCode,
        'priceNoLogin': this.props.state.priceNoLogin,
        'id': myElement.CatalogNumber
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

        let productsSet = this.state.products;
        productsSet.find(item => item.Id == myElement.Id).SubProducts = products;

        let tmpProductsSet = this.state.tmpProducts;
        tmpProductsSet.find(item => item.Id == myElement.Id).SubProducts = products;

        this.setState({ products : productsSet, tmpProducts: tmpProductsSet});

        this.setState({preload:false});

      } catch(err) {
        console.log('connection error GetSales');
        this.setState({preload:false});
      }

    }else{

      let productsSet = this.state.products;
      productsSet.find(item => item.Id == myElement.Id).SubProducts = [];

      let tmpProductsSet = this.state.tmpProducts;
      tmpProductsSet.find(item => item.Id == myElement.Id).SubProducts = [];
      this.setState({ products : productsSet, tmpProducts: tmpProductsSet});

    }

  }
  searchProducts = (e) => {

    this.resetCheckBox('','','search');
    this.resetBrand();

    let val = e.target.value;
    this.setState({searchString: e.target.value});

    let productsSet = this.state.products;

    if(val!=""){
      productsSet = productsSet.filter((item) => {return (item.Title && item.Title.toLowerCase().includes(val.toLowerCase())) || (item.Barcode && item.Barcode.includes(val)) || (item.Extra5 && item.Extra5.toLowerCase().includes(val.toLowerCase())) })
    }

    this.setState({tmpProducts: productsSet});
  }


  resetSearch = () =>{
    let productsSet = this.state.products;
    this.setState({searchString: ""});
    this.setState({tmpProducts: productsSet});
  }

  searchBrand = (e) => {
    let val = e.target.value;
    this.setState({brandSearchString: e.target.value});

    let filteredBrandsArr = this.state.brandsArr;

    if(val!=""){
      filteredBrandsArr = filteredBrandsArr.filter((item) => {return item.toLowerCase().includes(val.toLowerCase())})
    }

    this.setState({filteredBrandsArr});

  }

  resetSearchBrand = () =>{
    let filteredBrandsArr = this.state.brandsArr;
    this.setState({brandSearchString: ""});
    this.setState({filteredBrandsArr});
  }

  checkBoxSet = (param, value) =>{

    this.resetSearch();
    this.resetBrand();
    this.resetCheckBox(param, value, 'checkbox');

    let productsSet = this.state.products;
    if(value){
      if(param=="backToInventory"){
        if(this.state.newInStock){
          productsSet = productsSet.filter((item) => {return item.IsBack || item.IsNew})
        }else{
          productsSet = productsSet.filter((item) => {return item.IsBack})
        }
        this.setState({backToInventory:true})
      }else if(param=="newInStock"){
        if(this.state.backToInventory){
          productsSet = productsSet.filter((item) => {return item.IsNew || item.IsBack})

        }else{
          productsSet = productsSet.filter((item) => {return item.IsNew})

        }
        this.setState({newInStock:true})
      }else if(param=="inAlon"){
        productsSet = productsSet.filter((item) => {return item.IsAlon})
        this.setState({inAlon:true})
      }
    }else{
      if(param=="backToInventory" && this.state.newInStock){
        productsSet = productsSet.filter((item) => {return item.IsNew})
      }else if(param=="newInStock" && this.state.backToInventory){
        productsSet = productsSet.filter((item) => {return item.IsBack})
      }
    }

    this.setState({tmpProducts: productsSet});

  }

  resetCheckBox = (param, value, origin) =>{
    if(origin == 'checkbox'){
      if(param=="inAlon" || this.state.inAlon){
        let productsSet = this.state.products;
        this.setState({tmpProducts: productsSet, backToInventory:false, newInStock:false, inAlon:false})
      }else if(param=="backToInventory" && !value){
        this.setState({backToInventory:false})
      }else if(param=="newInStock" && !value){
        this.setState({newInStock:false})
      }
    }else{
      let productsSet = this.state.products;
      this.setState({tmpProducts: productsSet, backToInventory:false, newInStock:false, inAlon:false});
    }

  }

  selectBrand = (val) => {

    this.setState({openFilter:false});
    this.resetSearch();
    this.resetCheckBox('','','brand');

    if(val != "כל המותגים"){
      let productsSet = this.state.products;
      productsSet = productsSet.filter((item) => {return item.Extra5 == val});

      this.setState({chosenBrand: val, tmpProducts: productsSet})
    }else{
      this.resetBrand();
    }

  }

  resetBrand = () => {

    let productsSet = this.state.products;
    this.setState({tmpProducts: productsSet,chosenBrand:false});

  }

  downloadExcel = async(funcString) => {

    this.setState({preload:true, morePop: false});


    let val = {
      lvl1: this.props.match.params.lvl1,
      lvl2: this.props.match.params.lvl2,
      lvl3: this.props.match.params.lvl3,
      funcString: funcString
    }

    const valAjax = {
      funcName: 'GetProducts',
      point: 'download_xls',
      val: val
    };

    try {
      const data = await this.props.ajax(valAjax);
      if (data.result == "success") {

        var win = window.open(entry + '/output/' + data.link, '_blank');
        SweetAlert({
          title: 'אקסל הופק בהצלחה',
          type: 'success',
          timer: 3000,
          showConfirmButton: false,
        }).then(function () {
          //location.reload();
        }.bind(this)).catch(SweetAlert.noop);
      }

      this.setState({preload:false});

    } catch(err) {
      //this.props.connectionError('connection error GetSales');
      console.log('connection error GetSales');
      this.setState({preload:false});
    }

  }

  goToProductPage = (element) => {
    let catalgNumber = encodeURI(element.CatalogNumber);
  
    let catlaogNumberAfter = encodeURIComponent(element.CatalogNumber)
    this.props.history.push("/category/" + this.props.match.params.lvl1 + "/" + this.props.match.params.lvl2 + "/" + this.props.match.params.lvl3 + "/" + catlaogNumberAfter);

  }



  
	render(){
		let parentCategory = this.props.state.categories.filter(item => item.Id == this.props.match.params.lvl1)[0];
    let childCategory = this.props.state.categories.filter(item => item.Id == this.props.match.params.lvl2)[0];
    let subChildCategory = this.props.state.categories.filter(item => item.Id == this.props.match.params.lvl3)[0];
    let props = Object.assign({}, this.props);
    let lang = this.props.state.lang;


    // this.filteredVatiation('a9f73101')
		return (
      <>
      <HasmalCategoryBanner categories={this.props.state.categories} parentCategory={parentCategory}/>
			<div className="page-container category-page">
        <div className="flex-container">
          <div className=" right_category">
            
            <CategorySlide />
          
          </div>
          <div className="left_category">
            <div className={this.state.categorySlide ? "category-page-sub small" : "category-page-sub"}>

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
                    <div onClick={() => this.closePropdPop()} className="close">
                      <img src={globalFileServer + 'icons/close.svg'} />
                    </div>
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
                                <span>{subChildCategory.Title}</span>
                              </li>
                            :null}
                          </ul>
                        </div>
                      </div>
                      :null}
                    </div>
                  </div>
                  <ProductPopUp variationData={this.state.variationData}  {...this} lang={lang}/>
                </div>
                <div  className="overflow" onClick={() => this.closePropdPop()}></div>
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
                        <span>{subChildCategory.Title}</span>
                      </li>
                    :null}
                  </ul>
                </div>
              </div>
              :null}
            </div>

              <div className="category-wrapper">
                <div id="navFix" className={"flex-container products-view"}>
                  {!this.state.tmpProducts.length ? <h1 className="hide-on-desctop no-product">לא קיימים מוצרים</h1> : null}
                  {this.state.tmpProducts.map((element, index) => {
                    let inCart = this.props.state.productsInCart.filter(item => item.Products.CatalogNumber == element.CatalogNumber);
                    let productSales = this.props.state.productSales.length ? this.props.state.productSales.filter(item => item.ForCatalogNum == element.CatalogNumber) : [];
                    let diffQuantity = this.props.state.productSalesDiffQuan.filter(item => item.ProdId == element.Id && item.Quantity != null);
                    let maam = this.props.state.user.Type == 2 ? 1 : 1;
                    let type;

                    if((inCart.length && !("UnitChosen" in inCart[0])) ||  (inCart.length == 0)){
                      element.Unit == 2 ? type = "/יח" : type = "/יח'";
                    }else if((inCart.length && (("UnitChosen" in inCart[0] && inCart[0].UnitChosen == 0)))){
                      type = "/יח'";
                    }else if((inCart.length && (("UnitChosen" in inCart[0] && inCart[0].UnitChosen == 1)))){
                      type = "/אריזה";
                    }else if((inCart.length && (("UnitChosen" in inCart[0] && inCart[0].UnitChosen == 2)))){
                      type = "/יח";
                    }

                    if(index <= this.state.toShow && !element.VariationOf ){
                      return(
                        <div key={index} className={element.Unpublished ? "col-lg-3 wrapper-cont unpublished" : "wrapper-cont col-lg-3"}>
                          <div className={!element.ActualQuan ? "wrapper" : "wrapper disable"}>
                            {localStorage.user && (productSales.length || diffQuantity.length) && !element.Status && !element.Extra3 ?
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

                            <div onClick = {()=>this.goToProductPage(element)}>
                              <div className="img-cont">
                                <img src={globalFileServer + 'category/data/love.png'}  className='love_image'/>
                                <img className="img" src={element.ImgLink} onError={(e) => e.target.src = globalFileServer + 'placeholder.jpg'} />
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

                            {(this.props.state.user || this.props.state.b2cAvailiable)  && element.Price && element.Price != 0 && !element.Extra3 ?
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

        </div>

			</div>
      </>
		)
	}
}
