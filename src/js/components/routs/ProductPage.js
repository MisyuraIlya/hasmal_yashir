import ReactDOM from "react-dom";
import React, { Component, Fragment } from 'react';
import { NavLink } from "react-router-dom";
import {Helmet} from "react-helmet";
import ProductInfo from "./productPage/ProductInfo";

export default class ProductPage extends Component {
	constructor(props){
		super(props);
		this.state = {
			products: [],
			info: false
		}
		this.close = this.close.bind(this);
	}
	componentDidMount(){
		this.getProduct(this.props.match.params.id);
	}
	componentWillReceiveProps(nextProps) {
		if (this.props.match.params.id != nextProps.match.params.id) {
			this.setState({info: false});
			this.getProduct(nextProps.match.params.id);
		}
	}
	componentWillUnmount(){
		let tmpParams = {
			Id: false,
			SubId: false
		};
		this.props.setMatch(tmpParams);
	}
	getProduct(id){
		let user = false;
		localStorage.user ? user = JSON.parse(localStorage.user) : null;
		let val = { 'id': id };
		user ? val.priceFor = user.PriceFor : null;
		$.ajax({
			url: globalServer + 'new-api/product_view.php',
			type: 'POST',
			data: val,
		}).done(function(data) {
			let parent = this.props.state.categories.filter(item => item.ParentId == data.Productss[0].CategoryId);
			if (parent.length) {
				let tmpParams = {
					Id: data.Productss[0].CategoryId,
					SubId: parent[0].Id
				};
				this.props.setMatch(tmpParams);
			}
			this.setState({
				products: data.Productss,
				info: data.Productss[0].ExId
			});
			// setTimeout(() => window.scrollTo(0, 0), 100);
		}.bind(this)).fail(function() {	console.log("error"); });
	}
	getPrice(element, lowPrice){
		let price = 0;

		if (lowPrice.length) {

			if (lowPrice[0].SpecialPrice) {

				price = lowPrice[0].SpecialPrice;

			} else {

				if (lowPrice[0].Discount) {

					let percent = lowPrice[0].Discount;
					let p = lowPrice[0].Price;
					price = (p - ((p * percent) / 100)).toFixed(2);

				} else {

					price = lowPrice[0].Price;

				}

			}

		} else {

			if (element.SpecialPrice) {

				price = element.SpecialPrice;

			} else {

				if (element.Discount) {

					let percent = element.Discount;
					let p = element.Price;
					price = (p - ((p * percent) / 100)).toFixed(2);

				} else {

					price = element.Price;

				}

			}

		}

		return price;
	}
	close(){/*do nothing, for component woking */}
	render(){
		return(
			<div className="product-page">
				{this.state.products.map((element, index) => {
					let allProducts = this.state.products.filter(item => item.ExId == element.ExId);
					let productLowPrice = this.state.products.filter(item => item.ExId == element.ExId && item.Code != '90');
					let inCart = this.props.state.productsInCart.filter(item => item.Id == element.ExId);
					let image = this.props.state.images.length ? this.props.state.images.filter(item => item.Img == element.ExId) : [];
					let inWishList = this.props.state.wishList.filter(item => item.ExId == element.ExId);
					let maam = parseFloat('1.' + this.props.state.maam);
					if (allProducts.length > 1 && element.Code == 90 && element.Quantity == 1 || allProducts.length == 1 && element.Quantity == 1) {
						return(
							<div key={index} className="product-wrapper flex-container">
								<Helmet>
									<title>{element.Title}</title>
									<meta name="description" content={element.Description} />
									<meta name="keywords" content={element.Title} />
									<link rel="canonical" href={entry + '/product/' + element.Id} />
									<link rel="alternate" href={entry + '/product/' + element.Id} hreflang="he-il" />
								</Helmet>
								<div className="col-lg-6 info-p">
									<div className="product-details">
										<div className="share"></div>
										<div className="name">
											<div className="catalog-number">
												<p>
													<span className="c-title">מספר קטלוגי:</span>
													<span className="c-nomber">{element.ExId}</span>
												</p>
											</div>
											<h2>{element.Title}</h2>
										</div>
										<div className="price">
											{this.getPrice(element, element) == element.Price ?
												<h3 className="price">{(parseFloat(element.Price) * maam).toFixed(2)}</h3>
											:
											<div className="price-widh-discount">
												<h3 className="price">{(this.getPrice(element, element) * maam).toFixed(2)}</h3>
												<h3 className="old-price">{(parseFloat(element.OrgPrice) * maam).toFixed(2)}</h3>
											</div>
											}
										</div>
										{element.Description ?
											<div className="details">
												<p>{element.Description}</p>
											</div>
										: null}
										<div className="actions flex-container">
											<div className={inCart.length ? "add-to-cart" : "add-to-cart not-in-cart"}>
												<div className="wrapp flex-container" onClick={!inCart.length ? this.props.addToCart.bind(this, productLowPrice.length ? productLowPrice : allProducts, element.ExId) : null}>
													<div className="col-lg-4 fx-btn">
														<img onClick={inCart.length ? this.props.increaseCart.bind(this, element.ExId) : null} src={globalFileServer + 'icons/cart_plus.svg'} />
													</div>
													{inCart.length ?
														<Fragment>
															<div className="col-lg-4">
																<input
																	type="text"
																	value={inCart[0].Quantity}
																	onChange={this.props.changeQuantity.bind(this, element.ExId)}
																/>
															</div>
															<div className="col-lg-4 fx-btn" onClick={inCart.length && inCart[0].Quantity > 1 ? this.props.decreaseCart.bind(this, element.ExId) : this.props.deleteProduct.bind(this, element.ExId)}>
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
											</div>
											<div className="icons">
												{inWishList.length ?
													<div onClick={() => this.props.history.push('/wishlist')} className="wrapper">
														<img src={globalFileServer + 'icons/hf.svg'} />
														<p>עבור למועדפים</p>
													</div>
												:
												<div onClick={this.props.addToWish.bind(this, element)} className="wrapp">
													<img src={globalFileServer + 'icons/h.svg'} />
													<p>הוספה למועדפים</p>
												</div>
												}
											</div>
										</div>
										<div className="sales-info">
											{this.props.state.productSales.length && this.props.state.images.length && this.state.info ?
												<ProductInfo {...this} />
											: null}
										</div>
									</div>
								</div>
								<div className="col-lg-6 image">
									{image.length ?
										<img
											onLoad={(e) => e.target.width / e.target.height >= 1 ? e.target.style.width = '100%' : e.target.style.height = '60vh'}
											src={globalFileServer + 'products/' + element.ExId + ".jpg"}
										/>
									:
									<img src={globalFileServer + 'products/product.jpg'} alt=""/>
									}
								</div>
							</div>
						)
					}
				})}
			</div>
		)
	}
}
