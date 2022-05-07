import ReactDOM from "react-dom";
import React, { Component, Fragment, useState, useEffect, useRef } from 'react';
import Preload from "../tools/Preload";
import Modal from "../tools/Modal";
import SweetAlert from 'sweetalert2';
import ProductAddToCart from "./productPage/ProductAddToCart";

//import ProductCard from "../tools/ProductCard";
//import AddToCart from "../tools/AddToCart";


const ListHeadTitle = (params) => {
  return(
    <div className="ListHeadTitle flex-container">
      <div className="col-lg-2">
        <p></p>
      </div>
      <div className="col-lg-4">
        <p>פירוט</p>
      </div>
      <div className="col-lg-2">
        <p>מחיר</p>
      </div>
      <div className="col-lg-3">
      {/*
        <p>כמות</p>
      */}
      </div>
    </div>
  )
};


export default class SalePage extends Component {
	state = {
		items: [],
    forProd:false,
    toProd:false
	};
	componentDidMount(){
    this.getProducts();
	}
	componentWillUnmount(){
	}

  getProducts = (id) => {
		let user = false;
		localStorage.user ? user = JSON.parse(localStorage.user) : null;
		let val = {
      'saleElement': this.props.saleElement,
      'funcName': 'getSaleProducts'
    };

		$.ajax({
			url: globalServer + 'products_on_sale_per_user.php',
			type: 'POST',
			data: val,
		}).done(function(data) {
			//debugger;
      if(data.result=="success"){
        let forProd = data.ForProd;
        let toProd = data.ToProd;
        this.setState({ forProd , toProd});
      }
		}.bind(this)).fail(function() {	console.log("error"); });
	}

	render(){
    let props = Object.assign({}, this.props);

    let forProdinCart = false;
    if(this.state.forProd){
      forProdinCart = this.props.appProps.state.productsInCart.filter(item => item.Products.CatalogNumber == this.state.forProd.CatalogNumber);
    }

    let toProdinCart = false;
    if(this.state.toProd){
      toProdinCart = this.props.appProps.state.productsInCart.filter(item => item.Products.CatalogNumber == this.state.toProd.CatalogNumber);
    }

		return (
			<div className="product-page sale-pop">
				<div className="product-wrapper animated">

          <div className="pop-header">
            <h1>{this.props.saleElement.Title}</h1>
          </div>
					<div className="main-cont">
            <h2>קנה מוצר</h2>
            <ListHeadTitle />
            <div className="list-main-cont">
              {this.state.forProd ?
                <div className="list-row-cont flex-container">
                  <div className="img col-lg-2">
                    {this.state.forProd.Extra1 ? <img src={this.state.forProd.Extra1} onError={(e) => e.target.src = globalFileServer + 'placeholder.jpg'}/> : <img src={globalFileServer + 'placeholder.jpg'} />}
                  </div>
                  <div className="title col-lg-4">
                    <p>{this.state.forProd.Title}</p>
                  </div>
                  <div className="col-lg-2 price">
                    <p>{this.state.forProd.Price}</p>
                  </div>
                  {this.state.forProd.Price.Price && (this.props.appProps.state.user || this.props.appProps.state.b2cAvailiable) ?
                    <div className="col-lg-3">
                      <div className={forProdinCart.length ? "add-to-cart in-cart" : "add-to-cart not-in-cart"}>
                        <ProductAddToCart
                          inCart={forProdinCart}
                          element={this.state.forProd}
                          salePage={true}
                          {...props}
                        />
                      </div>
                    </div>
                  :null}
                </div>
              :null}


              <h2>קבל מוצר בהנחה</h2>
              <ListHeadTitle />
              <div className="list-main-cont">
                {this.state.toProd ?
                  <div className="list-row-cont flex-container">
                    <div className="img col-lg-2">
                      {this.state.toProd.Extra1 ? <img src={this.state.toProd.Extra1} onError={(e) => e.target.src = globalFileServer + 'placeholder.jpg'}/> : <img src={globalFileServer + 'placeholder.jpg'} />}
                    </div>
                    <div className="title col-lg-4">
                      <p>{this.state.toProd.Title}</p>
                    </div>
                    <div className="col-lg-2 price">
                      <p>{this.state.toProd.Price}</p>
                    </div>
                    {this.state.forProd.Price.Price && (this.props.appProps.state.user || this.props.appProps.state.b2cAvailiable) ?
                      <div className="col-lg-3">
                        <div className={toProdinCart.length ? "add-to-cart in-cart" : "add-to-cart not-in-cart"}>
                          <ProductAddToCart
                            inCart={toProdinCart}
                            element={this.state.toProd}
                            salePage={true}
                            {...props}
                          />
                        </div>
                      </div>
                    :null}
                  </div>
                :null}
              </div>
            </div>
          </div>
        </div>
			</div>
		)
	}
}
