import React, { Component, Fragment } from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import SweetAlert from 'sweetalert2';
import {Helmet} from "react-helmet";
import Calendar from 'react-calendar';

export default class History extends Component {
	constructor(props){
		super(props);
		this.state = {
			items: [],
			product: false,
      date: new Date(),
      toDate: new Date(),
      calType:'',
      orderState: 0,
      toShow: 7,
      currentPage: 1

		}
		this.getItems = this.getItems.bind(this);
	}
	componentDidMount(){
    let tmpDate = new Date();
    let firstDay = new Date(tmpDate.getFullYear(), tmpDate.getMonth(), 1);
    this.setState({date:firstDay});

		let date = firstDay.toLocaleDateString('ru-RU').split('.').join('/');
    let toDate = this.state.toDate.toLocaleDateString('ru-RU').split('.').join('/');
		this.getItems(date,toDate,this.state.orderState);
		setTimeout(() => window.scrollTo(0, 0), 200);


	}
  setPage(currentPage){
		this.setState({currentPage});
		window.scrollTo(0, 0);
	}
  createNewCart(order){
		this.props.simpleClearCart();

		let user = JSON.parse(localStorage.getItem('user'));


    let productsObj = order.Products.HistoryDetaileds;
    productsObj.map((item) => {
      item.CatalogNumber = item.CatalogNum;
    })

    let val = {
     userId: user.Id,
     priceCode: user.PriceList,
     Products: productsObj,
     userExtId: user.ExId
   };
//debugger;
    $.ajax({
			url: globalServer + 'new-api/return_prices_for_products.php',
			type: 'POST',
			data: val,
		}).done(function(order,data) {
      let products = [];
      let product;
      let tmpProd;
      let prodFromDb;
      order.Products.HistoryDetaileds.map((item) => {
        product = this.props.state.products.filter((e,i) => {return e.CatalogNumber == item.CatalogNumber});
        if(product.length && !product[0].SpecialPrice){
          prodFromDb = data.filter((e,i) => {return e.CatalogNumber == item.CatalogNumber});
          product[0].Price = prodFromDb[0].Price;
          product[0].Discount = prodFromDb[0].Discount;
          tmpProd = { 'Id' : parseInt(product[0].Id),
                      "Quantity" : parseFloat(item.Quantity),
                      "Products" : product[0],
                      "UnitChosen": prodFromDb[0].Unit,
                      "CategoryId": product[0].CategoryId,
                    };
          products.push(tmpProd);
        }
      });
      this.props.restoreCart(products);
      this.props.history.push("/cart");
		}.bind(this,order)).fail(function() {	console.log("error"); });
	}

  showInfo(element){
		let html = `
		<div class="info-user">
			<div class="user-comment">
				<p>${element.OrdComment}</p>
			</div>
		</div>
		`;
		SweetAlert({
			html: html,
			showConfirmButton: false,
			showCloseButton: true
		}).catch(SweetAlert.noop);
	}
	getItems(date,toDate,orderState){
    let user = JSON.parse(localStorage.getItem('user'));

    let tmpDate = date.split("/");
    tmpDate = tmpDate[2]+"-"+tmpDate[1]+"-"+tmpDate[0];
    let tmpToDate = toDate.split("/");
    tmpToDate = tmpToDate[2]+"-"+tmpToDate[1]+"-"+tmpToDate[0];

    let val = {
			sess_id: localStorage.sessionId,
			token: localStorage.token,
			id: user.Id,
      date: tmpDate,
      toDate:tmpToDate,
      orderState:orderState
		};

    user ? val.priceFor = user.Type : null;
    user ? val.priceCode = user.PriceList : null;
    user ? val.userId = user.Id : null;

		$.ajax({
			url: globalServer + 'new-api/history.php',
			type: 'POST',
			data: val,
		}).done(function(data) {
			let items = JSON.parse(data).Histories;
			items.map(item => item.Products = JSON.parse(item.Products));
      //debugger;

      this.setState({items});

		}.bind(this)).fail(function() {	console.log("error"); });
	}

  calendarChange(date){
    if(this.state.calType=='from'){
		    this.setState({ date, showCalendar: false });
        this.getItems(date.toLocaleDateString('ru-RU').split('.').join('/'),this.state.toDate.toLocaleDateString('ru-RU').split('.').join('/'),this.state.orderState);
    }else if(this.state.calType=='to'){
        this.setState({ toDate: date, showCalendar: false });
        this.getItems(this.state.toDate.toLocaleDateString('ru-RU').split('.').join('/'),date.toLocaleDateString('ru-RU').split('.').join('/'),this.state.orderState);
    }
	}
	selectDate(calType){
		this.setState({showCalendar: true,calType});
	}
  tabClickFunc(tabIndex){
    this.setState({orderState:tabIndex});
    let date = this.state.date.toLocaleDateString('ru-RU').split('.').join('/');
    let toDate = this.state.toDate.toLocaleDateString('ru-RU').split('.').join('/');
		this.getItems(date,toDate,tabIndex);
  }
	render(){
    let pagination = [...Array(Math.ceil(this.state.items.length / this.state.toShow)).keys()];

		return (
			<div className="page-container history">
				<h1 className="title">היסטוריה הזמנות</h1>
        <Calendar
          onChange={(date) => this.calendarChange(date)}
          value={this.state.date}
          calendarType="Hebrew"
          locale="he-IL"
          className={this.state.showCalendar ? 'active' : null}
        />
        <div className="flex-container for-calendar">

					<div className="col-lg-6">
						<div className="open-calendar">
              <p>מתאריך</p>
							<button onClick={this.selectDate.bind(this,'from')}>
								<img src={globalFileServer + 'icons/calendar.svg'} alt=""/>
								<span>{this.state.date.toLocaleDateString('he-IL').split('.').join('/')}</span>
							</button>
						</div>
					</div>
          <div className="col-lg-6">
						<div className="open-calendar">
              <p>לתאריך</p>
							<button onClick={this.selectDate.bind(this,'to')}>
								<img src={globalFileServer + 'icons/calendar.svg'} alt=""/>
								<span>{this.state.toDate.toLocaleDateString('he-IL').split('.').join('/')}</span>
							</button>
						</div>
					</div>
				</div>
        <div className='order-state-main-cont'>
          <div className='order-state-sub-cont'>
            <ul>
              <li onClick = {this.tabClickFunc.bind(this,0)} className={this.state.orderState == 0 ? 'active':null}>הכל</li>
              <li onClick = {this.tabClickFunc.bind(this,1)} className={this.state.orderState == 1 ? 'active':null}>ממתינות</li>
              <li onClick = {this.tabClickFunc.bind(this,2)} className={this.state.orderState == 2 ? 'active':null}>מאושרות</li>
            </ul>
          </div>
        </div>
        <div className="container items-container">
					<div className="items">
						<div className="heading">
							<div className="flex-container">
								<div className="col-lg-4">
									<div className="wrapp">
										<p>תיאור</p>
									</div>
								</div>
								<div className="col-lg-1 quantity">
									<div className="wrapp">
										<p>כמות</p>
									</div>
								</div>
                <div className="col-lg-2 quantity">
									<div className="wrapp">
										<p>יחידות</p>
									</div>
								</div>
								<div className="col-lg-1">
									<div className="wrapp">
										<p>סה״כ</p>
									</div>
								</div>
								<div className="col-lg-4">
									<div className="wrapp info">
										<p>הערה</p>
									</div>
								</div>
							</div>
						</div>
            <div className="body">
							{!this.state.items.length ? <h1 className="no-products">הזמנות אינו קיימות</h1> : null}
							{this.state.items.map((element, index) => {
								if (index < this.state.toShow * this.state.currentPage && index >= (this.state.currentPage - 1) * this.state.toShow) {
									return(
										<Fragment key={index}>
											<div className="item flex-container">
												<div className="col-lg-2 ordNumCont">
														<span className="black">{"מס' הזמנה: " + element.Id}</span>
												</div>
                        <div className="col-lg-2 date-cont">
													<div className="wrapp">
														<p className="time-ele">{element.OrderDate}</p>
													</div>
												</div>
                        <div className="col-lg-2 time-cont">
													<div className="wrapp">
														<p className="time-ele">{element.Date.split(" |")[1].substring(0,6)}</p>
													</div>
												</div>
												<div className="col-lg-1 quantity">
													<div className="wrapp">
														<p>{element.Products.length}</p>
													</div>
												</div>
												<div className="col-lg-1 price-cont">
													<div className="wrapp">
                            <p className="price">{(parseFloat(element.Total)).toFixed(1)}</p>
													</div>
												</div>
												<div className="col-lg-3">
													<div className="wrapp new-cart head-cart-cont">
														{element.OrdComment ?
															<div className="img" onClick={this.showInfo.bind(this, element)}>
																<img src={globalFileServer + 'icons/info.svg'} alt=""/>
															</div>
														: null}
														<button onClick={this.createNewCart.bind(this, element)}>
															<img src={globalFileServer + "icons/cart_white.svg"} alt=""/>
															<span>שכפול הזמנה</span>
														</button>
													</div>
												</div>
											</div>
											<div className="product">
												{element.Products.HistoryDetaileds.map((el, ind) => {
                          let image = this.props.state.images.length ? this.props.state.images.filter(item => item == el.CatalogNum) : [];
                          let unit = "יחידות";
                          if(el.Unit == "1"){
                            unit = "קופסאות";
                          }else if(el.Unit == "2"){
                            unit = "קילו";
                          }
													return(
														<div key={ind} className="flex-container img-cont">
															<div className="col-lg-4">
																<div className="flex-container">
																	<div className="col-lg-3">
																		<div className="wrapp">
																			<div className="img">
																				<img src={image.length ? globalFileServer + 'products/' + el.CatalogNum+ ".jpg" : globalFileServer + 'placeholder.jpg'} />
																			</div>
																		</div>
																	</div>
																	<div className="col-lg-9 title-cont">
																		<div className="wrapp title">
																			<p>{el.ProdName}</p>
                                      <p className="catalog-cont">{el.CatalogNum}</p>
																		</div>
																	</div>
																</div>
															</div>
															<div className="col-lg-1 quantity">
																<div className="wrapp">
                                  <p>{(el.Quantity).toFixed(2)}</p>
																</div>
															</div>
                              <div className="col-lg-2 quantity unit">
																<div className="wrapp">
                                  <p>{unit}</p>
																</div>
															</div>
															<div className="col-lg-1 total">
																<div className="wrapp">
																	<p className="price">
                                    {el.Total}
																	</p>
																</div>
															</div>
															<div className="col-lg-4">
																{el.OrdComment ?
																	<div className="wrapp comment">
																		<p></p>
																	</div>
																: null}
															</div>
														</div>
													);
												})}
											</div>
											{window.innerWidth < 1000 ?
												<div className="new-cart">
													<button onClick={this.createNewCart.bind(this, element)}>
														<img src={globalFileServer + "icons/cart_white.svg"} alt=""/>
														<span>שכפול הזמנה</span>
													</button>
												</div>
											: null}
										</Fragment>
									)
								}
							})}
						</div>
					</div>
					{pagination.length > 1 ?
						<div className="pagination">
							<ul>
								{this.state.currentPage > 1 ?
									<li onClick={this.setPage.bind(this, this.state.currentPage - 1)}>
										<img src={globalFileServer + 'icons/right-arrow.svg'} alt="back"/>
									</li>
								: null}
								{pagination.map((element, index) => {
									let pageN = element + 1;
									return(
										<li onClick={this.setPage.bind(this, pageN)} key={index} className={pageN == this.state.currentPage ? 'active' : null}>
											<span>{pageN}</span>
										</li>
									);
								})}
								{this.state.currentPage < pagination.length ?
									<li onClick={this.setPage.bind(this, this.state.currentPage + 1)}>
										<img src={globalFileServer + 'icons/left-arrow.svg'} alt="next"/>
									</li>
								: null}
							</ul>
						</div>
					: null}
				</div>
			</div>
		)
	}
}
