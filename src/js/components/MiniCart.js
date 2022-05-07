import React, { Component, Fragment } from "react";
import { NavLink } from "react-router-dom";

export default class MiniCart extends Component {
	constructor(props){
		super(props);
		this.state = {
			currentProduct: false
		}
		this.reducePrice = this.reducePrice.bind(this);
		this.animateProduct = this.animateProduct.bind(this);
	}
	componentDidMount(){}
	componentWillReceiveProps(nextProps){
		if (JSON.stringify(this.props.state.productsInCart) != JSON.stringify(nextProps.state.productsInCart)) {

			if (this.props.state.productsInCart.length != nextProps.state.productsInCart.length) {

				if (nextProps.state.productsInCart.length > this.props.state.productsInCart.length && nextProps.state.productsInCart.length > 1) {

					let cP = this.props.state.productsInCart[this.props.state.productsInCart.length - 1];

					let currentProduct = nextProps.state.productsInCart[nextProps.state.productsInCart.length - 1];

					if (cP) {

						this.animateProduct(currentProduct);

					}

				}

			} else {

				if (nextProps.state.productsInCart.length > 1) {

					let currProduct = false;

					nextProps.state.productsInCart.map(item => {

						let exist = this.props.state.productsInCart.filter( i => JSON.stringify(item) == JSON.stringify(i) );

						!exist.length ? currProduct = item : null;

					});

					this.animateProduct(currProduct);

				}

			}

		}
	}
	animateProduct(currentProduct){
		this.setState({currentProduct});
		setTimeout(() => {
			let element = document.getElementById(currentProduct.Products.Id);
      if(element){
        element.scrollIntoView({block: "center"});
      }
		}, 200);
		setTimeout(() => this.setState({currentProduct: false}), 3000);
	}
	reducePrice(){
		let priceArray = [];
		this.props.state.productsInCart.map((element, index) => {
				if (element.Products.Quantity != 1) {
					priceArray.push(this.props.globalPriceCalc(element.Products, element.Quantity));
				}
		});
		const reducer = (accumulator, currentValue) => accumulator + currentValue;
    debugger;
		return (priceArray.reduce(reducer)).toFixed(2);
	}

	render(){
    let maam = !this.props.state.user.Type ? parseFloat('1.' + this.props.state.defaults.Maam) : 1;

		return (
      <div className="cart-main">
        {/*{this.props.state.openCart ? <div onClick={this.props.toggleCart.bind(this)} className="fake-click"></div> : null}*/}
  			<div className={this.props.state.openCart ? "header-cart opened" : "header-cart closed"}>
  				<div className="header-cart-wrapp">
  					<img onClick={this.props.toggleCart.bind(this)} className="close-cart" src={globalFileServer + 'icons/cross-grey.svg'} />
  					<div className="header">
  						<h3>{'עגלה קניות (' + this.props.state.productsInCart.length + ') מוצרים'}</h3>
  					</div>
  					<div className="products">
  						{this.props.state.productSales.length ? this.props.state.productsInCart.map((element, index) => {
  							let image = this.props.state.images.length ? this.props.state.images.filter(item => item == element.Products.CatalogNumber) : [];
                return (
  								<div id={element.Id} className={this.state.currentProduct && this.state.currentProduct.Id == element.Id ? "item animated active-prod" : "item"} key={index}>
  									<img onClick={this.props.deleteProduct.bind(this, element.Id)} className="delete-product" src={globalFileServer + 'icons/cross-white.svg'} />

  										<div className="flex-container">
  											<div className="col-lg-2">
  												<div className="quantity">
  													<div className="wrapp increase" onClick={this.props.increaseCart.bind(this, element.Id)}>
  														<img src={globalFileServer + 'icons/plus-white.svg'} />
  													</div>
  													<div className="wrapp input">
  														<input
  															type="text"
  															value={element.Quantity}
  															onChange={this.props.changeQuantity.bind(this, element.Id)}
  														/>
  													</div>
  													<div className="wrapp decrease" onClick={element.Quantity > 1 ? this.props.decreaseCart.bind(this, element.Id) : this.props.deleteProduct.bind(this, element.Id)}>
  														<img src={globalFileServer + 'icons/minus-white.svg'} />
  													</div>
  												</div>
  											</div>
  											<div className="col-lg-3">
  												<div
  													className="img"
  													style={image.length ? {backgroundImage: 'url(' + globalFileServer + 'products/' + element.Products.CatalogNumber + ".jpg" + ')'} : null}
  												/>
  											</div>
  											<div className="col-lg-7">
  												{this.props.state.openCart ?
  													<div className="details">
  														{/*{this.props.globalPriceCalc(element.Products, element.Quantity) == element.Products.Price * element.Quantity ?
  															<p className="price">{((parseFloat(element.Products.Price) * element.Quantity) * maam).toFixed(2)}</p>
  														:
  														<div className="price-widh-discount">
  															<p className="price">{(this.props.globalPriceCalc(element.Products, element.Quantity) * maam).toFixed(2)}</p>
  															<p className="old-price">{((parseFloat(element.Products.Price) * element.Quantity) * maam).toFixed(2)}</p>
  														</div>
                            }*/}
                              <p className="price">{(this.props.globalPriceCalc(element.Products, element.Quantity) * maam).toFixed(2)}</p>
  														<p className="title">{element.Products.Title}</p>
  													</div>
  												: null}
  											</div>
  										</div>

  								</div>
  							);
  						}) : null}
  					</div>
  				</div>
  				<div className="footer">
  					<p className="to-pay">
  						<span className="title">מחיר לתשלום: </span>
  						{this.props.state.productsInCart.length && this.props.state.productSales.length ?
  							<span className="price">{(parseFloat(this.reducePrice()) * maam).toFixed(2)}</span>
  						:
  						<span className="price">0</span>
  						}
  					</p>
  					<NavLink onClick={this.props.toggleCart.bind(this)} className="cart-button" to="/cart">לסל קניות</NavLink>
  					{/*<h3>או</h3>
  					<a className="continue" onClick={this.props.toggleCart.bind(this)}>להמשך קניות</a>*/}
  				</div>
  			</div>
      </div>
		)
	}
}
