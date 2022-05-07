import ReactDOM from "react-dom";
import React, { Component, Fragment } from 'react';
import { NavLink } from "react-router-dom";
import {Helmet} from "react-helmet";
import Quagga from 'quagga';




export default class ProductAddToCart extends Component {
	constructor(props){
		super(props);
		this.state = {

		}
	}
  selectInput(id){
    //$("#input_"+id).focus();
    setTimeout(() => {
      $("#input_"+id).select();
    }, 300);
    //debugger;
  }

	render(){

    let path;
    !this.props.state.selectedProd ? path = this.props : path = this.props.props;
    let saleProdObj = false;
    if(path.match){
      if(path.match.path == "/sales" || path.match.path == "/cart"){
        let saleProd = path.state.productSales.find((item) => {return item.ForCatalogNum == this.props.element.CatalogNumber});

        if(saleProd){
          if(saleProd.ForUnit == "0"){
            saleProdObj = {'Title': "יחידות", 'Val': 0};
          }else if(saleProd.ForUnit == "1"){
            saleProdObj = {'Title': "מארז", 'Val': 1};
          }else if(saleProd.ForUnit == "2"){
            saleProdObj = {'Title': "יחידות", 'Val': 2};
          }
        }


      }
    }
    return(

			<div className="product-page barcode-pop">
        <div className="wrapp flex-container" onClick={!this.props.inCart.length ? path.addToCart.bind(this, this.props.element, this.props.element.Id, saleProdObj) : null}>
          <div className="col-lg-4 fx-btn" onClick={this.props.inCart.length ? path.increaseCart.bind(this, this.props.element.Id) : null}>
            <img
              src={globalFileServer + 'icons/plus-clean.svg'}
            />
          </div>
          {this.props.inCart.length ?
            <Fragment>
              <div className="col-lg-4">
                <input id={"input_"+this.props.element.Id}
                  type="number"
                  value={this.props.inCart[0].Quantity}
                  onChange={path.changeQuantity.bind(this, this.props.element.Id)}
                  onBlur={path.avoidNullInCart.bind(this, this.props.element.Id)}
                  onClick={this.selectInput.bind(this, this.props.element.Id)}
                />
              </div>
              <div className="col-lg-4 fx-btn" onClick={this.props.inCart.length && this.props.inCart[0].Quantity > 1 ? path.decreaseCart.bind(this, this.props.element.Id) : path.deleteProduct.bind(this, this.props.element.Id)}>
                <img
                  src={globalFileServer + 'icons/cart_minus.svg'}
                />
              </div>
            </Fragment>
          :
          <div className="col-lg-8">
            <p>הוספה לסל</p>
          </div>
          }
        </div>
  {/*
        {this.props.inCart.length && saleProdObj ?
          <div className="unit-cont flex-container">
            <div className={"active col-lg-12"} onClick={path.changeUnit.bind(this, this.props.element.Id, saleProdObj.Val)}>
              <p>{saleProdObj.Title}</p>
            </div>
          </div>
        :null}

        {this.props.inCart.length && parseInt(this.props.element.Unit) == 0 && !saleProdObj ?
          <div className="unit-cont flex-container">
            {parseInt(this.props.element.PackQuan) != 1 ?
            <div className={parseInt(this.props.element.PackQuan) != 1 ? ("UnitChosen" in this.props.inCart[0] && this.props.inCart[0].UnitChosen == 0) ||  (!("UnitChosen" in this.props.inCart[0])) ? "active col-lg-6" : "col-lg-6" : ("UnitChosen" in this.props.inCart[0] && this.props.inCart[0].UnitChosen == 0) ||  (!("UnitChosen" in this.props.inCart[0])) ? "active col-lg-12" : "col-lg-12"  } onClick={path.changeUnit.bind(this, this.props.element.Id, 0)}>
              <p>יחידות</p>
            </div>
            :null}
            {parseInt(this.props.element.PackQuan) != 1 ?
              <div className={"UnitChosen" in this.props.inCart[0] && this.props.inCart[0].UnitChosen == 1 ? "active col-lg-6" : "col-lg-6"} onClick={path.changeUnit.bind(this, this.props.element.Id,1)}>
                <p>מארז</p>
              </div>
            :null}
          </div>
        :null}
        {this.props.inCart.length && parseInt(this.props.element.Unit) == 2 && !saleProdObj ?
          <div className="unit-cont flex-container">
            <div className={parseInt(this.props.element.PackQuan) != 1 ? ("UnitChosen" in this.props.inCart[0] && this.props.inCart[0].UnitChosen == 2) ||  (!("UnitChosen" in this.props.inCart[0])) ? "active col-lg-6" : "col-lg-6" : ("UnitChosen" in this.props.inCart[0] && this.props.inCart[0].UnitChosen == 2) ||  (!("UnitChosen" in this.props.inCart[0])) ? "active col-lg-12" : "col-lg-12"  } onClick={path.changeUnit.bind(this, this.props.element.Id,2)}>
              <p>קילוגרם</p>
            </div>
            {parseInt(this.props.element.PackQuan) != 1 ?
              <div className={"UnitChosen" in this.props.inCart[0] && this.props.inCart[0].UnitChosen == 1 ? "active col-lg-6" : "col-lg-6"} onClick={path.changeUnit.bind(this, this.props.element.Id,1)} onClick={path.changeUnit.bind(this, this.props.element.Id,1)}>
                <p>מארז</p>
              </div>
            :null}
          </div>
        :null}
        */}
			</div>
		)
	}
}
