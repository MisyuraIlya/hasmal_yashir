import ReactDOM from "react-dom";
import { NavLink } from "react-router-dom";
import {Helmet} from "react-helmet";
import React, { Component, Fragment } from 'react';
import ProductInfo from "./productPage/ProductInfo";
import Parallax from './Parallax';
import SweetAlert from 'sweetalert2';
import ProductPopUp from "./productPage/ProductPopUp";
import ProductAddToCart from "./productPage/ProductAddToCart";
import SalePage from "./SalePage";

let products = [];
let userDiscountObj = [];
export default class ForSale extends Component {
	constructor(props){
		super(props);
		this.state = {
      sales:[],
      info:false,
      toShow: 24,
      ProductPopUp: false,
      barcodeReader: false,
      selectedProd:[],
      pageNum:0,
      pCounter: [],
      pFrom: 0,
      pTo: 24,
      cFrom: 0,
      cTo: 5,
      chosenPage: 1,
      active:false,
      preload: false,
      products: []

		}
    this.close = this.close.bind(this);
    this.closePropdPop = this.closePropdPop.bind(this);
    this.handleScroll = this.handleScroll.bind(this);
    this.goToProdBySale = this.goToProdBySale.bind(this);
    this.UpPaggination = this.UpPaggination.bind(this);
		this.downPaggination = this.downPaggination.bind(this);
	}
	componentDidMount(){
    setTimeout(() => window.scrollTo(0, 0), 100);

    this.getProducts(this.props.match.params.id);
    if(this.props.match.params.id){
      this.setState({chosenPage: parseInt(this.props.match.params.id)});
    }
	}


  getProducts = async(id) => {
    this.setState({preload: true});

		let user = false;
		localStorage.user ? user = JSON.parse(localStorage.user) : null;

    const valAjax = {
      funcName: 'getAllSales',
      point: 'products_on_sale_per_user',
      'id': id,

    };

    try {
      const data = await this.props.ajax(valAjax);
      let sales = JSON.parse(data.sales);
      let products = JSON.parse(data.products);
      let pageNum = parseInt(data.pageNum[0].PageNum);

      this.setState({ sales , pageNum, products});
      this.setState({preload: false});


    } catch(err) {
      //this.props.connectionError('connection error GetSales');
      console.log('connection error GetSales');
      this.setState({preload:false});
    }


	}

  close(){
    this.setState({info: false});
  }
  closePropdPop(){
    this.setState({ProductPopUp: false});
  }
  componentWillReceiveProps(nextProps) {
//this.props.match.params.id
    if(this.props.match.params.id != nextProps.match.params.id){
      this.getProducts(nextProps.match.params.id);
      if(nextProps.match.params.id){
        this.setState({chosenPage: parseInt(nextProps.match.params.id)});
      }
    }
  }

  componentWillUnmount(){

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

  goToProdBySale(element){
    this.setState({info:false,ProductPopUp:true,selectedProd:element});
  }

  showPaggination(number) {
		let val = number * this.state.toShow;
		this.setState({
			cFrom: number,
			cTo: number + 5,
			pFrom: val,
			pTo: val + this.state.toShow,
      chosenPage: number+1
		});
		window.scrollTo(0, 0);

    if(!this.props.adminSales){
      this.props.history.push('/sales/'+(parseInt(number)+1));
    }
	}
	UpPaggination(){
		this.setState({
			cFrom: this.state.cFrom + 1,
			cTo: this.state.cTo + 1,
			pFrom: this.state.pFrom + this.state.toShow,
			pTo: this.state.pTo + this.state.toShow,
      chosenPage: this.state.chosenPage+1
		});
		window.scrollTo(0, 0);
	}
	downPaggination(){
		this.setState({
			cFrom: this.state.cFrom - 1,
			cTo: this.state.cTo - 1,
			pFrom: this.state.pFrom - this.state.toShow,
			pTo: this.state.pTo - this.state.toShow,
      chosenPage: this.state.chosenPage-1

		});
		window.scrollTo(0, 0);
	}

  setActive = (id) => {
    this.setState({ active: id });
  };
  closeModal = () => {
    this.setState({ active: false });
  };

  render(){
    //let props = Object.assign({}, this.props);

    let sales = [];
    let pageNum = 0;
    let chosenPage = 1;
    if(this.props.adminSales && this.props.adminSales.length > 0){
      //debugger;
      sales = JSON.stringify(this.props.adminSales);
      sales = JSON.parse(sales);
      pageNum = this.props.pageNum;
      chosenPage = parseInt(this.state.chosenPage);
      //debugger;
    }else{
      sales = this.state.sales;
      pageNum = this.state.pageNum;
      chosenPage = parseInt(this.props.match.params.id);
    }
    sales.sort((a, b) => ( a.Orden > b.Orden) ? 1 : -1)
    let salesFilter = sales.filter((item) => {return item.PageNum == chosenPage && !item.Unpublished})
    let lang = this.props.state.lang;

		return (
			<div className="page-container forSalePage">
        {this.state.preload ?
          <div className="spinner-wrapper">
            <div className="spinner">
              <div className="bounce1"></div>
              <div className="bounce2"></div>
              <div className="bounce3"></div>
            </div>
          </div>
        : null}
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
				<div className={!this.props.adminSales ? "container userInterface" : "container"}>
          <div className="page-container">
            <div className="arrow-right-main" onClick={()=> (parseInt(this.state.chosenPage)-2) >= 0 ? this.showPaggination(parseInt(this.state.chosenPage)-2) : null}>
              <img src={globalFileServer + 'icons/arrow-backward.svg'} />
            </div>
            <div className="arrow-left-main" onClick={()=> parseInt(this.state.chosenPage) < this.state.pageNum ? this.showPaggination(parseInt(this.state.chosenPage)) : null}>
              <img src={globalFileServer + 'icons/arrow-forward.svg'} />
            </div>
            <div className="page-sub-container">
              <div className="flex-container main-prod-cont">
                {salesFilter.map((ele, ind) => {

                  let colCls="img-cont col-lg-3 sqaure";

                  if(ind == 0 || ind == 9){
                    colCls="img-cont col-lg-6 third";
                  }

                  //let price = (ele.OrgPrice - (ele.OrgPrice*parseFloat(ele.Discount)/100)).toFixed(2);

                  let price = parseFloat(ele.Price).toFixed(2);
                  let productEle = this.state.products.filter((item) => {return item.CatalogNumber == ele.ForCatalogNum});
                  if(productEle.length){
                    productEle = productEle[0];
                    productEle.Price = price;
                    productEle.OrgPrice = ele.OrgPrice;
                  }

                  price = price.split('.');
                  if(!productEle.Extra3){
                    return(
                      <div key={ind} className={colCls}>
                        {/*<div onClick={()=>this.setActive(ele.Id)} className='img-sub-cont'>*/}
                        <div className='img-sub-cont' onClick = {() => this.setState({selectedProd:productEle, ProductPopUp:true})}>
                          <div className="sale-title-cont">
                            <p>{ele.Title ? ele.Title : "תיאור המבצע"}</p>
                          </div>
                          <img
                            className="main-img"
                            src={ele.Img ? ele.Img.includes("smartsale") ? ele.Img : globalFileServer + "sales/" + ele.Img : globalFileServer + "placeholder.jpg"}
                          />
                          <div className="discount-cont">
                            <div className="final-price price-block">
                              <p className="second">{price[1]}</p>
                              <p className="first">{price[0]}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  }else{
                    return(
                      <div key={ind} className={colCls}>
                        <NavLink className={"meaged-nav"} to={"/productParent/" + productEle.PrimaryMenuItemId + "/" + productEle.SecondaryMenuItemId + "/" + productEle.ThirdMenuItemId + "/" + productEle.CatalogNumber + "/" + lang}>
                          <div className='img-sub-cont'>
                            <div className="sale-title-cont">
                              <p>{ele.Title ? ele.Title : "תיאור המבצע"}</p>
                            </div>
                            <img
                              className="main-img"
                              src={ele.Img ? ele.Img.includes("smartsale") ? ele.Img : globalFileServer + "sales/" + ele.Img : globalFileServer + "placeholder.jpg"}
                            />
                            <div className="discount-cont">
                              <div className="final-price price-block">
                                <p className="second">{price[1]}</p>
                                <p className="first">{price[0]}</p>
                              </div>
                            </div>
                          </div>
                        </NavLink>
                      </div>
                    );
                  }
                })}
              </div>
            </div>
          </div>

          {pageNum > 0 ?
            <div className="pagination">
              <div className="flex-container">
                <div className="col-lg-12">
                  <div className="wrapp menu-paggination">
                    <ul>
                    {/*
                      {this.state.cFrom > 0 ? <li onClick={this.downPaggination}><span>{"<"}</span></li> : null}
                      */}
                      {[...Array(pageNum).keys()].map((element, index) => {
                        //if (index >= this.state.cFrom - 2 && index < this.state.cTo - 2) {
                          return (
                            <li
                              key={index}
                              onClick={() => this.state.chosenPage !== index+1 ? this.showPaggination(element) : null}
                              className={this.state.chosenPage == index+1 ? 'active' : ''}
                            >
                              <span>{element + 1}</span>
                            </li>
                          )
                        //}
                      })}
                      {/*
                      {this.state.cTo < this.state.pCounter.length ? <li onClick={this.UpPaggination}><span>{">"}</span></li> : null}
                      */}
                    </ul>
                  </div>
                </div>
              </div>
              <ul>

              </ul>
            </div>
          : null }

				</div>
        <Parallax img="parrallax_5.jpg" />
			</div>
		)
	}
}
