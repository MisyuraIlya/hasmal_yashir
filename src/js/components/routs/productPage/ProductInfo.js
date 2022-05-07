import React, { Component, Fragment } from 'react';
import { NavLink } from "react-router-dom";

let appState;

export default class ProductInfo extends Component {
	constructor(props){
		super(props);
		this.state = {
			id: this.props.state.info,
			products: this.props.state.products.filter(item => item.Id == this.props.state.info),
			categorySales: [],
			productSales: [],
			productsQ: [],
			productsQP: [],
      productsToUse:[],
      allProds: this.props.props.state.products.length > 0 ? this.props.props.state.products : []
		}

	}
	componentDidMount(){
    let categoryId;
    let productSales;
    let productsQP;
    let productsToUse;


    if(this.props.state.products.length){//click on I
      appState = this.props.props.state;
      //categoryId = this.props.state.products[0].CategoryId; //this.props.props.match.params.id;
      productSales = appState.productSales.filter(item => item.ForCatalogNum == this.props.state.info.CatalogNumber);
      productsQP = appState.productSalesDiffQuan.filter(item => item.ProdId == this.props.state.info.Id);
      productsToUse = this.props.state.info;
    }else{//click on prod
      appState = this.props.props.props.state;
      //categoryId = this.props.props.state.products[0].CategoryId; //this.props.props.match.params.id;
      productSales = appState.productSales.filter(item => item.ForCatalogNum == this.props.props.state.selectedProd.CatalogNumber);
      productsQP = appState.productSalesDiffQuan.filter(item => item.ProdId == this.props.props.state.selectedProd.Id);
      productsToUse = this.props.props.state.selectedProd;
    }

    // let categorySales = appState.categorySales.filter(item => item.Id == categoryId);
		// let productsQ = this.props.state.products.filter(item => item.ForId == this.props.state.info && item.Quantity != 1 && item.Code == 90);
		// let productsQP = this.props.state.products.filter(item => item.ForId == this.props.state.info && item.Quantity != 1 && item.Code != 90);

		this.setState({
			// categorySales,
			productSales,
			// productsQ,
			productsQP,
      productsToUse

		});
	}

  goToProdBySale(element){
    if(this.props.state.products.length){
      this.props.goToProdBySale(element);
    }else{
      this.props.props.goToProdBySale(element);
    }

  }
	render(){
		return(
			<div className="wrapper">
        <h3>מחיר עלון מבצעים</h3>
				{this.state.productsToUse && this.state.productsToUse.length && this.state.productsQP && this.state.productsQP.length ?
					this.state.productsQP.map((element, index) => {
						// let image = this.props.props.state.images.filter(item => item.Img == element.ExId);
            // let yuli = JSON.stringify(this.state.productsToUse);
            // console.log('length'+yuli);
						return(
							<div key={index} className="flex-container for-quantity">
								<div className="col-lg-2">
									<div
										className="img"
										style={this.state.productsToUse ? {backgroundImage: 'url(' + globalFileServer + 'products/' + this.state.productsToUse.CatalogNumber + ".jpg" + ')'} : null}
									/>
								</div>
								<div className="col-lg-4">
									<p className="title">{this.state.productsToUse.Title}</p>
								</div>
								<div className="col-lg-2 quantity">
									<p>
										<span></span>
										<span>{element.Quantity}</span>
										<span> ומעלה </span>
									</p>
								</div>
								<div className="col-lg-4 price">
									{element.SpecialPrice ? <p>{element.SpecialPrice}</p> : null}
									{element.Price && !element.SpecialPrice && !element.Discount ?
										<p>{element.Price}</p>
									: null}
									{element.Discount && !element.SpecialPrice ?
										<p>{(parseFloat(element.Price) - (parseFloat(element.Price) * parseFloat(element.Discount)) / 100).toFixed(2)}</p>
									: null}
								</div>
							</div>
						);
					})
				:null}

				{this.state.allProds.length > 0 && this.state.productSales && this.state.productSales.length > 0 ? this.state.productSales.map((element, index) => {
					let products = this.state.allProds.filter(item => item.CatalogNumber == element.ToCatalogNum);
          let imageFor = appState.images.length ? appState.images.filter(item => item == this.state.productsToUse.CatalogNumber) : [];
          let imageTo;
          if(products.length>0){
            imageTo = appState.images.length ? appState.images.filter(item => item == products[0].CatalogNumber) : [];
          }
          let forUnit = ' יחידות';
          let toUnit = ' יחידות';

          if(element.ForUnit == '1'){
            forUnit = " קרטון";
          }else if(element.ForUnit == '2'){
            forUnit = " קילו";
          }

          if(element.ToUnit == '1'){
            toUnit = " קרטון";
          }else if(element.ToUnit == '2'){
            toUnit = " קילו";
          }

          return(
						<div key={index} className="flex-container product-sales">
							<div className="col-lg-5 first-prod-maincont">
                <div>
  								<p className="name">קנה</p>
                  <p className="quanAndUnit">
                    <span className="p">{element.ForQuantity + forUnit}</span>
                  </p>
  								<p className="title">{this.state.productsToUse.Title}</p>
  								<div
  									className="img"
  									style={ {backgroundImage: 'url('+ this.state.productsToUse.Extra1+')'} }
  								/>

                </div>
              {/*
                {this.props.state.products.length ?
                  <div className="goToProdBtn">
                    <p onClick = {this.goToProdBySale.bind(this,this.state.productsToUse)} >לרכישה</p>
                  </div>
                :null}
                */}
							</div>
							{/*<div className="col-lg-2 quantity">

								<p>{element.ForQuantity + 'x'}</p>
							</div>*/}
							<div className="col-lg-2 arrow">
								<img src={globalFileServer + 'icons/fat-arrow.svg'} />
							</div>
              {products.length > 0 ?
  							<div className="col-lg-5 second-prod-maincont">
  								<p className="name">קבל</p>
                  <p className="quanAndUnit">
                    <span className="p">{element.ToQuantity + toUnit}</span>
                  </p>
                  <div className="second-prod-cont">
  									<p className="title">{products.length ? products[0].Title : products[0].Title}</p>
  									<div
  										className="img"
  										style={imageTo.length ? {backgroundImage: 'url(' + globalFileServer + 'products/' + products[0].CatalogNumber + ".jpg" + ')'} : null}
  									/>
                  </div>
  								<div className="price">
  									{element.Price ?
  										<p>
  											<span className="t">במחיר</span>
  											<span className="p">{' ' + element.Price + ' ₪ '}</span>
  										</p>
  									:
  									<p>
  										<span className="t">בהנחה של</span>
  										<span className="d">{' '+element.Discount+'%'}</span>
  									</p>
  									}
  								</div>
                  {/*
                  {this.state.productsToUse.CatalogNumber != products[0].CatalogNumber ?
                    <div className="goToProdBtn">
                      <p onClick = {this.goToProdBySale.bind(this,products[0])} >לרכישה</p>
                    </div>
                  :null}
                  */}
  							</div>
              :
                <div className="col-lg-5 second-prod-maincont">
                  {element.Price ?
                    <h3 className="fixedPrice">{'ב- ' + parseFloat(element.Price).toFixed(2) + ' ₪ בלבד'}</h3>
                  :
                  <h3 className="fixedPrice">{'ב- ' + element.Discount + '% הנחה'}</h3>

                  }
                </div>
              }
						</div>
					)
				}):null}
			</div>
		);
	}
}
