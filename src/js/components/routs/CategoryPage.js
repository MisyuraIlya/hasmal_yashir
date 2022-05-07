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
      brandSearchString:""
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
		if (this.props.match.params.lvl1 != nextProps.match.params.lvl1 || this.props.match.params.lvl2 != nextProps.match.params.lvl2 || this.props.match.params.lvl3 != nextProps.match.params.lvl3) {
			window.scrollTo(0, 0);
      //debugger;
      this.resetSearch();
      this.resetCheckBox('','','mount');
      this.resetBrand();
      this.getProducts(nextProps.match.params);
		}
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
    this.setState({ProductPopUp: false});
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
	render(){
		let parentCategory = this.props.state.categories.filter(item => item.Id == this.props.match.params.lvl1)[0];
    let childCategory = this.props.state.categories.filter(item => item.Id == this.props.match.params.lvl2)[0];
    let subChildCategory = this.props.state.categories.filter(item => item.Id == this.props.match.params.lvl3)[0];

    let props = Object.assign({}, this.props);
    let lang = this.props.state.lang;

		return (

			<div className="page-container category-page">
        <CategorySlide />
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
                      <span>{subChildCategory.Title}</span>
                    </li>
                  :null}
                </ul>
              </div>
            </div>
            :null}
          </div>

          <div className="view-mode-cont">
            <div className="view-mode-rightcont">
              <div className="check-box-sub-cont check-row">
                <div className={this.props.state.listView == 'true' ? "view-img-cont actice" : "view-img-cont not-active"} onClick={()=> this.props.setView("true")}>
                  <img src={globalFileServer + 'icons/list-view.svg'} />
                </div>
                <div className={this.props.state.listView == 'false' ? "view-img-cont actice" : "view-img-cont  not-active"} onClick={()=> this.props.setView("false")}>
                  <img src={globalFileServer + 'icons/grid-view.svg'} />
                </div>
              </div>
              <div className="freeSearch-cont">
                  <input
                    type="text"
                    placeholder="חיפוש חופשי..."
                    onChange={(e)=> this.searchProducts(e)}
                    value={this.state.searchString}
                  />
                  {this.state.searchString != "" ?
                    <img onClick={ ()=>this.resetSearch() } src={globalFileServer + 'icons/cross-grey.svg'} />
                  :null}

              </div>
              <div className={this.state.openFilter ? "brandFilter-cont select active padding" : "brandFilter-cont select padding"}>
                <div onClick={this.state.openFilter ? () => this.setState({openFilter:false}): () => this.setState({openFilter:true})} className="headind-cat">
                  <p>{!this.state.chosenBrand ? 'סינון לפי מותג' : this.state.chosenBrand}</p>
                  <div className="img">
                    <img src={globalFileServer + "icons/down-chevron.svg"} alt=""/>
                  </div>
                </div>
                <div className={this.state.openFilter ? "masc active" : "masc"}>
                  <div className="brand_search-cont">
                    <input
                      type="text"
                      placeholder="חפש מותג.."
                      onChange={(e)=> this.searchBrand(e)}
                      value={this.state.brandSearchString}
                    />
                    {this.state.brandSearchString != "" ?
                      <img onClick={ ()=>this.resetSearchBrand() } src={globalFileServer + 'icons/cross-grey.svg'} />
                    :null}
                  </div>
                  <ul>
                    {this.state.filteredBrandsArr.length ? this.state.filteredBrandsArr.map((ele,ind) => {
                      return(
                        <li key={ind} onClick={()=>this.selectBrand(ele)}>
                          <div className="mask-li-cls">
                            <span>{ele}</span>
                            <div className="img">
                              <img src={globalFileServer + 'icons/back-select.svg'} alt=""/>
                            </div>
                          </div>
                        </li>
                      )
                    }):null}

                  </ul>
                </div>
              </div>
            </div>
            <div className="view-mode-subcont">
              <div className="check-box-main-cont">
                <div className="check-box-sub-cont check-row status sale">
                  {this.state.backToInventory ?
                    <div onClick={()=> this.checkBoxSet("backToInventory", false)} className="input active">
                      <img src={globalFileServer + "icons/done.svg"} alt=""/>
                    </div>
                  :
                  <div onClick={()=> this.checkBoxSet("backToInventory", true)} className="input">
                    <img src={globalFileServer + "icons/cross-bold.svg"} alt=""/>
                  </div>
                  }
                  <p>חזר למלאי</p>
                </div>
                <div className="check-box-sub-cont check-row status sale">
                  {this.state.newInStock ?
                    <div onClick={()=> this.checkBoxSet("newInStock", false)} className="input active">
                      <img src={globalFileServer + "icons/done.svg"} alt=""/>
                    </div>
                  :
                  <div onClick={()=> this.checkBoxSet("newInStock", true)} className="input">
                    <img src={globalFileServer + "icons/cross-bold.svg"} alt=""/>
                  </div>
                  }
                  <p>חדש במלאי</p>
                </div>
                <div className="check-box-sub-cont check-row status sale">
                  {this.state.inAlon ?
                    <div onClick={()=> this.checkBoxSet("inAlon", false)} className="input active">
                      <img src={globalFileServer + "icons/done.svg"} alt=""/>
                    </div>
                  :
                  <div onClick={()=> this.checkBoxSet("inAlon", true)} className="input">
                    <img src={globalFileServer + "icons/cross-bold.svg"} alt=""/>
                  </div>
                  }
                  <p>עלון מבצעים</p>
                </div>
                <div className="xls-btn-main-cont">

                  <div className="xls-btn-small-cont" onClick={()=> this.setState({morePop: true})}>
                    <img className="info-icon-img xls-btn-icon" src={globalFileServer + 'icons/excel.svg'} />
                  </div>
                  {this.state.morePop ?
                    <div className="more_cont">
                      <div className="more_cont-header flex-container">
                        <div className="col-lg-10" >
                          <p></p>
                        </div>
                        <div className="close-popup col-lg-2">
                          <div className="close-popup-cont" onClick={()=> this.setState({morePop: false})}>
                            <img src={globalFileServer + 'icons/close_purple.svg'} />
                            </div>
                        </div>
                      </div>

                      <div className="flex-container row" >
                        <div className="col-lg-2">
                          <img src={globalFileServer + 'icons/wheel1.svg'} />
                        </div>
                        <div className="col-lg-10" onClick={()=>this.downloadExcel('category')}>
                          <p>מוצרים בקטגוריה</p>
                        </div>
                      </div>
                      <div className="flex-container row">
                        <div className="col-lg-2">
                          <img src={globalFileServer + 'icons/wheel1.svg'} />
                        </div>
                        <div className="col-lg-10" onClick={()=>this.downloadExcel('all')}>
                          <p>כל הקטלוג</p>
                        </div>
                      </div>

                    </div>
                  :null}
                </div>

              </div>


            </div>
          </div>

          <div className="category-header-cont">
            <div className="row-cont flex-container">
                <div className="img-cont col-lg-2">
                  <img src={childCategory ? globalFileServer + 'categories/' + childCategory.Img : parentCategory ? globalFileServer + 'categories/' + parentCategory.Img :  globalFileServer + 'placeholder.jpg'} onError={(e) => e.target.src = globalFileServer + 'placeholder.jpg'}/>
                </div>
                <div className="h1-cont col-lg-8">
                  <h1>{subChildCategory ? subChildCategory.Title : childCategory ? childCategory.Title : parentCategory ? parentCategory.Title : null}</h1>
                </div>
            </div>
          </div>
          {this.props.state.listView != 'true' ?
            <div className="category-wrapper">
    					<div id="navFix" className={"flex-container products-view"}>
    						{!this.state.tmpProducts.length ? <h1 className="hide-on-desctop no-product">לא קיימים מוצרים</h1> : null}
    						{this.state.tmpProducts.map((element, index) => {
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
                    type = "/יח";
                  }

                  if(index <= this.state.toShow && !element.Extra2 ){
                    return(
                      <div key={index} className={element.Unpublished ? "col-lg-2 wrapper-cont unpublished" : "wrapper-cont col-lg-2"}>
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

                          <div onClick = {!element.Extra3 ? () => this.setState({selectedProd:element, ProductPopUp:true}) : ()=> this.goToProductParent(element.CatalogNumber)}>
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
                          {/*.Type || this.props.state.b2cAvailiable*/}
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

                          {this.props.state.user && element.Extra3 ?
                            <NavLink className={"meaged-nav"} to={"/productParent/" + this.props.match.params.lvl1 + "/" + this.props.match.params.lvl2 + "/" + this.props.match.params.lvl3 + "/" + element.CatalogNumber + "/" + lang}>
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
          :
          <div className="category-wrapper-list">
            <div className="products-view-header flex-container">
              <div className="flex-container col-lg-10">

                <div className="col-lg-1 center">
                  <p>חזר</p>
                </div>
                <div className="col-lg-1">
                  <p>קטגוריה</p>
                </div>
                <div className="col-lg-1 center">
                  <p>תמונה</p>
                </div>
                <div className="col-lg-3">
                  <p>שם</p>
                </div>
                <div className="col-lg-1">
                  <p>מותג</p>
                </div>
                <div className="col-lg-2">
                  <p>ברקוד</p>
                </div>

                <div className="col-lg-1">
                  <p>מלאי</p>
                </div>
                <div className="col-lg-1">
                  <p>מחיר</p>
                </div>
              </div>
              <div className="col-lg-1 center">
                <p>כמות</p>
              </div>
              <div className="col-lg-1 center">
                <p>סה״כ</p>
              </div>
            </div>
            <ul id="navFix" className={"flex-container products-view"}>
              {!this.state.tmpProducts.length ? <h1 className="hide-on-desctop no-product">לא קיימים מוצרים</h1> : null}
              {this.state.tmpProducts.map((element, index) => {
                let inCart = this.props.state.productsInCart.filter(item => item.Products.CatalogNumber == element.CatalogNumber);
                let productSales = this.props.state.productSales.length ? this.props.state.productSales.filter(item => item.ForCatalogNum == element.CatalogNumber) : [];
                let diffQuantity = this.props.state.productSalesDiffQuan.filter(item => item.ProdId == element.Id && item.Quantity != null);
                let maam = this.props.state.user.Type == 2 ? 1 : 1;
                let image = this.props.state.images.length ? this.props.state.images.filter(item => item == element.CatalogNumber) : [];
                let type;

                if((inCart.length && !("UnitChosen" in inCart[0])) ||  (inCart.length == 0)){
                  element.Unit == 2 ? type = " /יח" : type = " /יח'";
                }else if((inCart.length && (("UnitChosen" in inCart[0] && inCart[0].UnitChosen == 0)))){
                  type = " /יח'";
                }else if((inCart.length && (("UnitChosen" in inCart[0] && inCart[0].UnitChosen == 1)))){
                  type = " /אריזה";
                }else if((inCart.length && (("UnitChosen" in inCart[0] && inCart[0].UnitChosen == 2)))){
                  type = " /יח";
                }
                let thirdMenuTitle = "";
                if(this.props.state.categories && this.props.state.categories.length>0){
                  thirdMenuTitle = this.props.state.categories.filter((item) => {return item.Id == element.ThirdMenuItemId})[0].Title;
                }


                if(index <= this.state.toShow && !element.Extra2 ){

                  let ttlRow = 0;
                  if((inCart.length && (("UnitChosen" in inCart[0] && (inCart[0].UnitChosen == 0 || inCart[0].UnitChosen == 2)) ||  (!("UnitChosen" in inCart[0])))) || (inCart.length == 0)){
                    if(inCart.length){
                      ttlRow = ((parseFloat(element.Price) * maam) * inCart[0].Quantity).toFixed(2);
                    }
                  }else{
                    if(inCart.length){
                      ttlRow = (((parseFloat((parseFloat(element.Price) * maam)))) * inCart[0].Quantity * parseFloat(element.PackQuan)).toFixed(2);
                    }
                  }
                  return(
                    <li key={index} className={element.Extra3 && element.SubProducts && element.SubProducts.length > 0 ? element.Unpublished ? "wrapper-cont unpublished color-block" : "wrapper-cont  color-block" : element.Unpublished ? "wrapper-cont unpublished" : "wrapper-cont"}>
                      <div className={!element.ActualQuan ? "wrapper flex-container" : "wrapper disable flex-container"}>

                        <div className="flex-container right-side-cont col-lg-10" onClick = {!element.Extra3 ? () => this.setState({selectedProd:element, ProductPopUp:true}) : ()=> this.getSubProds(element)}>
                          <div className="backInventory-cont col-lg-1">
                            {element.Extra3 && !element.SubProducts ||  (element.SubProducts && element.SubProducts.length == 0) ?
                              <div className="sub-prod_trigger">
                                <img src={globalFileServer + 'icons/down-pink.svg'} alt=""/>
                              </div>
                            :null}
                            {element.Extra3 && element.SubProducts && element.SubProducts.length > 0 ?
                              <div className="sub-prod_trigger">
                                <img src={globalFileServer + 'icons/up-pink.svg'} alt=""/>
                              </div>
                            :null}
                            {!element.Extra3 && element.IsBack?
                              <img className="img star" src={globalFileServer + "icons/star.png"} />
                            :null}
                          </div>
                          <div className="cat-cont col-lg-1">
                            <p className='row-list-p'>{thirdMenuTitle}</p>
                          </div>

                          <div className="img-cont col-lg-1">
                            <img className="img" src={element.Extra1} onError={(e) => e.target.src = globalFileServer + 'placeholder.jpg'} />
                          </div>
                          <div className="title-cont col-lg-3">
                            {element.IsNew ?
                              <div className="new-p">חדש</div>
                            :null}
                            <p className='row-list-p'>{element.Title}</p>
                          </div>
                          <div className="mutag-cont col-lg-1">
                            <p className='row-list-p'>{element.Extra5}</p>
                          </div>
                          <div className="barcode-list-cont col-lg-2">
                            {element.Barcode ?
                              <p className='row-list-p'>{element.Barcode}</p>
                            :null}
                          </div>
                          <div className="mlay-cont col-lg-1">
                            <p className='row-list-p'>{element.Extra4 != "0" ? element.Extra4 : null}</p>
                          </div>
                          <div className="price-cont col-lg-1">
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

                                  </div>
                                :null}
                              </div>
                            :null}
                          </div>
                        </div>
                        <div className="col-lg-1">
                          {(this.props.state.user || this.props.state.b2cAvailiable)  && element.Price && element.Price != 0 && !element.Extra3 ?
                          <div className={inCart.length ? "add-to-cart list-view in-cart catalog after-add" : "add-to-cart list-view not-in-cart catalog before-add"}>
                            <ProductAddToCartCatalogList
                              inCart={inCart}
                              element={element}
                              price={(parseFloat(element.Price) * maam)}
                              {...props}
                            />
                          </div>
                          :null}
                        </div>
                        <div className="col-lg-1">
                          <div className="sum-cont add-to">
                            <p className="h3-2">{ttlRow != 0 ? ttlRow + ' ₪': ""}</p>
                          </div>
                        </div>
                      </div>

                      {element.SubProducts && element.SubProducts.length > 0 ? element.SubProducts.map((ele, ind) => {
                        let inCartSubProd = this.props.state.productsInCart.filter(item => item.Products.CatalogNumber == ele.CatalogNumber);

                        let ttlRowSubProd = 0;
                        if((inCartSubProd.length && (("UnitChosen" in inCartSubProd[0] && (inCartSubProd[0].UnitChosen == 0 || inCartSubProd[0].UnitChosen == 2)) ||  (!("UnitChosen" in inCartSubProd[0])))) || (inCartSubProd.length == 0)){
                          if(inCartSubProd.length){
                            ttlRowSubProd = ((parseFloat(ele.Price) * maam) * inCartSubProd[0].Quantity).toFixed(2);
                          }
                        }else{
                          if(inCartSubProd.length){
                            ttlRowSubProd = (((parseFloat((parseFloat(ele.Price) * maam)))) * inCartSubProd[0].Quantity * parseFloat(ele.PackQuan)).toFixed(2);
                          }
                        }
                        return(
                          <div key={ind} className={!element.ActualQuan ? "wrapper flex-container subProd" : "wrapper disable flex-container subProd"}>
                            <div className="flex-container right-side-cont col-lg-10" onClick = {() => this.setState({selectedProd:ele, ProductPopUp:true})}>
                              <div className="backInventory-cont col-lg-1">
                                {ele.isBack ?
                                  <img className="img" src={globalFileServer + "icons/star.png"} />
                                :null}
                              </div>
                              <div className="cat-cont col-lg-1">
                                <p className='row-list-p'>{thirdMenuTitle}</p>
                              </div>

                              <div className="img-cont col-lg-1">
                                <img className="img" src={ele.Extra1} onError={(e) => e.target.src = globalFileServer + 'placeholder.jpg'} />
                              </div>
                              <div className="title-cont col-lg-3">
                                {ele.IsNew ?
                                  <div className="new-p">חדש</div>
                                :null}
                                <p className='row-list-p'>{ele.Title}</p>
                              </div>
                              <div className="mutag-cont col-lg-1">
                                <p className='row-list-p'>{ele.Extra5}</p>
                              </div>
                              <div className="barcode-list-cont col-lg-2">
                                {ele.Barcode ?
                                  <p className='row-list-p'>{ele.Barcode}</p>
                                :null}
                              </div>
                              <div className="mlay-cont col-lg-1">
                                <p className='row-list-p'>{ele.Extra4 != "0" ? ele.Extra4 : null}</p>
                              </div>
                              <div className="price-cont col-lg-1">
                                {(this.props.state.user && this.props.state.user.Id) ||  (!this.props.state.user && !localStorage.role && this.props.state.priceNoLogin == "1") ?
                                  <div className="price-main-cont">
                                    {ele.Price && ele.Price != '0' ?
                                      <div className="price-cont">
                                        <div className="price-subCont">
                                          {(inCart.length && (("UnitChosen" in inCart[0] && (inCart[0].UnitChosen == 0 || inCart[0].UnitChosen == 2)) ||  (!("UnitChosen" in inCart[0])))) || (inCart.length == 0) ?
                                            <h3 className="price">{(parseFloat(ele.Price) * maam).toFixed(2) + type}</h3>
                                          :
                                            <h3 className="price">{(parseFloat(ele.Price) * parseInt(ele.PackQuan) * maam).toFixed(2) + type}</h3>
                                          }
                                        </div>

                                      </div>
                                    :null}
                                  </div>
                                :null}
                              </div>
                            </div>
                            <div className="col-lg-1">
                              {(this.props.state.user || this.props.state.b2cAvailiable)  && ele.Price && ele.Price != 0 ?
                              <div className={inCartSubProd.length ? "add-to-cart list-view in-cart catalog after-add" : "add-to-cart list-view not-in-cart catalog before-add"}>
                                <ProductAddToCartCatalogList
                                  inCart={inCartSubProd}
                                  element={ele}
                                  price={(parseFloat(ele.Price) * maam)}
                                  {...props}
                                />
                              </div>
                              :null}
                            </div>
                            <div className="col-lg-1">
                              <div className="sum-cont add-to">
                                <p className="h3-2">{ttlRowSubProd != 0 ? ttlRowSubProd + ' ₪': ""}</p>
                              </div>
                            </div>

                          </div>

                        )

                      }):null}
                    </li>
                  );
                }
              })}
            </ul>
          </div>
          }
          <Parallax img="parrallax_5.jpg" />
        </div>
			</div>
		)
	}
}
