import React, { Component } from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import SweetAlert from 'sweetalert2';
import {Helmet} from "react-helmet";

export default class OrderHistory extends Component {
	constructor(props){
		super(props);
		this.state = {
			orderList: [],
			status: 0,
			viewAll: true,
			tax: 17,
			moment: moment(),
			startDate: '',
			endDate: '',
			openTooltip: false,
			openTooltipInfo: false,
			mobile: false,
			openDetails: false
		}
		this.getUserOrderList = this.getUserOrderList.bind(this);
		this.getOrderList = this.getOrderList.bind(this);
		this.selectStatus = this.selectStatus.bind(this);
		this.save = this.save.bind(this);
		this.saveHistory = this.saveHistory.bind(this);
		this.createUserMessages = this.createUserMessages.bind(this);
		this.handleResize = this.handleResize.bind(this);
		this.dateFocus = this.dateFocus.bind(this);
		this.getUserAppId = this.getUserAppId.bind(this);
		this.sendNotification = this.sendNotification.bind(this);
	}
	componentDidMount(){
		if (localStorage.userId && localStorage.user_name && localStorage.token) {
			this.getUserOrderList();
		}
		if (localStorage.role) {
			this.getOrderList();
		}
		if (window.innerWidth < 1000) {
			this.setState({mobile: true});
		}
		window.addEventListener('resize', this.handleResize);
		this.interval = setInterval(() => {
			if (localStorage.userId && localStorage.user_name && localStorage.token) {
				this.getUserOrderList();
			}
			if (localStorage.role) {
				this.getOrderList();
			}
		}, 3000);
	}
	componentWillUnmount(){
		clearInterval(this.interval);
	}
	getUserAppId(data) {
		let val = {	userId: data.userId };
		$.ajax({
			url: globalServer + 'get_user_app_id.php',
			type: 'POST',
			data: val,
		}).done(function(d, data) {
			if (data.result == "success") {
				this.sendNotification(data.data, d);
			}
		}.bind(this, data)).fail(function() { console.log('error'); });
	}
	sendNotification(id, msgTitle){
		let player_ids = [];
		player_ids.push(id);
		let val = {
			from: 'LFA your shop',
			message: msgTitle.msgTitle,
			img: null,
			link: 'history',
			player_ids: player_ids
		}
		$.ajax({
			url: globalServer + 'send_push_notification.php',
			type: 'POST',
			data: val,
		}).done(function(data) {
		}.bind(this)).fail(function() { console.log('error'); });
	}
	dateFocus(e){
		e.target.setAttribute("readonly", true);
	}
	handleResize(e) {
		if (e.target.innerWidth < 1000) {
			!this.state.mobile ? this.setState({mobile: true}) : null;
		} else {
			this.state.mobile ?	this.setState({mobile: false}) : null;
		}
	}
	getOrderList(){
		let val = {
			role: localStorage.role,
			token: localStorage.token
		};
		$.ajax({
			url: globalServer + 'admin_order_list.php',
			type: 'POST',
			data: val,
		}).done(function(data) {
			this.createOrderList(data);
		}.bind(this)).fail(function() { console.log('error'); });
	}
	getUserOrderList(){
		let val = {	UserId: localStorage.userId };
		$.ajax({
			url: globalServer + 'user_order_list.php',
			type: 'POST',
			data: val,
		}).done(function(data) {
			this.createOrderList(data);
		}.bind(this)).fail(function() { console.log('error'); });
	}
	createOrderList(data){
		let orderList = data;
		orderList.map((element, index) => {
			let price = 0;
			let discount = 0;
			element.histor.map((elem, ind) => {
				if (elem.DiscountType == 1) {
					price += ((parseInt(elem.Price) - parseInt(elem.DiscountVal)) * parseInt(elem.Quantity));
					discount += parseInt(elem.DiscountVal) * parseInt(elem.Quantity);
				} else if (elem.DiscountType == 2) {
					let percent = ((parseInt(elem.Price) * parseInt(elem.Quantity)) * parseInt(elem.DiscountVal) / 100);
					price += ((parseInt(elem.Price) - percent) * parseInt(elem.Quantity));
					discount += percent;
				} else {
					price += parseInt(elem.Price) * parseInt(elem.Quantity);
				}
			});
			element.order.Price = price;
			element.order.DiscountVal = discount;
		});
		this.setState({orderList: orderList});
	}
	toggleDetails(id, e){
		//$(e.target.parentNode.parentElement.parentElement.nextElementSibling).slideToggle(400);
		if (this.state.openDetails == id) {
			this.setState({openDetails: false});
			this.interval = setInterval(() => {
				if (localStorage.userId && localStorage.user_name && localStorage.token) {
					this.getUserOrderList();
				}
				if (localStorage.role) {
					this.getOrderList();
				}
			}, 3000);
		} else {
			this.setState({openDetails: id});
			clearInterval(this.interval);
		}
	}
	changeStatus(val, id, event){
		var data = this.state.orderList;
		data.find(x=> x.order.Id == id).order.Status = val;
		this.setState({orderList: data});
		$(event.target.parentNode).slideUp(400);
		this.save(id, 'Status', val);
	}
	selectStatus(e){
		$(e.target.parentNode.nextElementSibling).slideToggle(400);
	}
	startDateChange(id, date){
		var data = this.state.orderList;
		data.find(x=> x.order.Id == id).order.StartDate = date;
		this.setState({	orderList: data });
		let startDate = date.format("DD/MM/YYYY");
		this.save(id, 'OrderDate', startDate);
	}
	endDateChange(id, date){
		var data = this.state.orderList;
		data.find(x=> x.order.Id == id).order.EndDate = date;
		this.setState({	orderList: data });
		let endDate = date.format("DD/MM/YYYY");
		this.save(id, 'DeliveryDate', endDate);
	}
	increaseQuantity(id, ind, index){
		var data = this.state.orderList;
		let val = data[index].histor[ind].Quantity -= 1;
		data[index].histor[ind].Quantity = val;
		this.setState({orderList: data});
		this.createOrderList(data);
		this.saveHistory(id, 'Quantity', val);
	}
	decreaseQuantity(id, ind, index){
		let data = this.state.orderList;
		let val = data[index].histor[ind].Quantity += 1;
		data[index].histor[ind].Quantity = val;
		this.setState({orderList: data});
		this.createOrderList(data);
		this.saveHistory(id, 'Quantity', val);
	}
	changeDiscount(id, index, ind, e) {
		let data = this.state.orderList;
		data[index].histor[ind].Appointed = 0;
		if (this.isANumber(e.target.value)) {
			data[index].histor[ind].DiscountVal = e.target.value;
		}
		this.setState({orderList: data});
		e.target.parentNode.previousElementSibling.children[1].style.display = "block";
	}
	saveDiscount(id, index, ind, e) {
		let data = this.state.orderList;
		if (this.isANumber(e.target.value)) {
			if (e.target.value == "") {
				data[index].histor[ind].DiscountVal = 0;
			}
		}
		this.setState({orderList: data});
		this.createOrderList(data);
		this.saveHistory(id, 'DiscountVal', e.target.value);
	}
	isANumber(str){
		if(/^\d+$/.test(str) || str == "") { return true; } else { return false; }
	}
	saveUserDiscount(index, ind, e) {
		let data = this.state.orderList;
		let discVal = data[index].histor[ind].DiscountVal;
		let id = data[index].histor[ind].ProdId;
		let historyId = data[index].histor[ind].Id;
		let userId = data[index].order.UserId;
		data[index].histor[ind].Appointed = 1;
		this.setState({orderList: data});
		let val = {
			prodId: id,
			discountVal: parseInt(discVal),
			userId: parseInt(userId),
			role: localStorage.role,
			token: localStorage.token
		};
		$.ajax({
			url: globalServer + 'user_discount.php',
			type: 'POST',
			data: val,
		}).done(function(historyId, data) {
			if (data.result == "success") {
				this.saveHistory(historyId, 'Appointed', 1);
			}
		}.bind(this, historyId)).fail(function() { console.log('error'); });
	}
	saveHistory(id, paramName, data){
		let val = {
			id: id,
			paramName: paramName,
			val: data,
			role: localStorage.role,
			token: localStorage.token
		}
		$.ajax({
			url: globalServer + 'edit_history.php',
			type: 'POST',
			data: val,
		}).done(function(data) {
		}.bind(this)).fail(function() { console.log('error'); });
	}
	save(id, paramName, data){
		let val = {
			id: id,
			paramName: paramName,
			val: data,
			role: localStorage.role,
			token: localStorage.token
		}
		if (paramName == "Status") {
			let orderList = this.state.orderList;
			let order = orderList.filter((element) => { return element.order.Id == val.id });
			let prodIds = order[0].histor.map((element, index) => {
				return element.ProdId;
			});
			let msgTitle;
			let toSend;
			let msgText;
			if (data == 3) {
				msgTitle = 'הזמנה מס\' #100' + order[0].order.Id + ' אושרה';
				msgText = order[0].order.DeliveryDate ? 'זמן משוער לאספקה - ' + order[0].order.DeliveryDate : null;
				toSend = {
					prodIds: prodIds.join(),
					msgTitle: msgTitle,
					msgText: msgText,
					userId: order[0].order.UserId,
					img: 'success.jpg'
				}
				this.createUserMessages(toSend);
				this.getUserAppId(toSend);
			}
			if (data == 1) {
				msgTitle = 'הזמנה מס\' #100' + order[0].order.Id + ' לא אושרה';
				toSend = {
					prodIds: prodIds.join(),
					msgTitle: msgTitle,
					userId: order[0].order.UserId,
					img: 'cancel.jpg'
				}
				this.createUserMessages(toSend);
				this.getUserAppId(toSend);
			}
		}
		$.ajax({
			url: globalServer + 'edit_order.php',
			type: 'POST',
			data: val,
		}).done(function(data) {
			if (data.result == "success") {}
		}.bind(this)).fail(function() { console.log('error'); });
	}
	createUserMessages(toSend) {
		let val = {
			role: localStorage.role,
			token: localStorage.token,
			userId: toSend.userId,
			messageId: null,
			title: toSend.msgTitle,
			message: toSend.msgText ? toSend.msgText : null,
			ProductIds: toSend.prodIds,
			link: null,
			img: toSend.img,
			creationDate: this.state.moment.format("H:s DD/MM/YYYY")
		}
		$.ajax({
			url: globalServer + 'create_users_messages.php',
			type: 'POST',
			data: val,
		}).done(function(d) {
			if (d.result == "success") {
				SweetAlert({
					title: 'ההודעה נשלחה בהצלחה',
					type: 'success',
					timer: 3000,
					showConfirmButton: false,
				}).then(function () {}.bind(this)).catch(SweetAlert.noop);
			} else { console.log('error') }

		}.bind(this)).fail(function(d) { console.log("error"); });
	}
	render(){
		return (
			<div className="page-container history">
				<Helmet>
					<title>היסטוריה הזמנות</title>
				</Helmet>
				{!this.state.mobile ?
				<div className="container desctop">
					<h1 className="title">היסטוריה הזמנות</h1>
					<div className="navigation">
						<ul>
							<li onClick={ ()=> this.setState({ status: 0, viewAll: true }) } className={this.state.status == 0 ? "active" : null}>
								<img src={globalFileServer + 'icons/30.svg'} alt="" />
								<span>כל ההזמנות</span>
							</li>
							<li onClick={ ()=> this.setState({ status: 3, viewAll: false }) } className={this.state.status == 3 ? "active" : null}>
								<img src={globalFileServer + 'icons/31.svg'} alt="" />
								<span>ההזמנות מאושרות</span>
							</li>
							<li onClick={ ()=> this.setState({ status: 2, viewAll: false }) } className={this.state.status == 2 ? "active" : null}>
								<img src={globalFileServer + 'icons/32.svg'} alt="" />
								<span>ממתינות לאישור</span>
							</li>
							<li onClick={ ()=> this.setState({ status: 1, viewAll: false }) } className={this.state.status == 1 ? "active" : null}>
								<img src={globalFileServer + 'icons/33.svg'} alt="" />
								<span>לא מאושרות</span>
							</li>
						</ul>
					</div>
					<div className="order-list">
						{this.state.orderList.map((element, index) => {
							if (element.order.Status == this.state.status || this.state.viewAll) {
							return(
								<div key={index}>
									{index % 5 == 0 ?
									<div className="flex-container list-title">
										<div className="col-lg-1"><p className="status">סטאטוס</p></div>
										<div className="col-lg-1"><p>מספר הזמנה</p></div>
										<div className="col-lg-1"><p>תאריך רכישה</p></div>
										<div className="col-lg-1"><p>תאריך אספקה</p></div>
										<div className="col-lg-1"><p>סה”כ פריטים</p></div>
										<div className="col-lg-2"><p>הערות</p></div>
										<div className="col-lg-1"><p>הנחה</p></div>
										<div className="col-lg-2"><p>סה”כ סכום רכישה</p></div>
									</div> : null}
									{localStorage.role ?
									<div className="user-info">
										<div className="name"><img src={globalFileServer + 'icons/user-shape.svg'}/></div>
										<div className="info">
											<p><span>{element.user.BusinessName} / </span><span>{element.user.UserName}</span></p>
										</div>
										<div className="tooltip">
											<ul>
												<li><span className="tit">ח.פ/ע.מ/ת.ז:</span><span>{element.user.UserName}</span></li>
												<li><span className="tit">שם העסק:</span><span>{element.user.BusinessName}</span></li>
												<li><span className="tit">איש קשר:</span><span>{element.user.ContactName}</span></li>
												<li><span className="tit">דוא"ל:</span><span>{element.user.Email}</span></li>
												<li><span className="tit">טלפון:</span><span>{element.user.Phone}</span></li>
											</ul>
										</div>
									</div> : null}
									<div className="flex-container list-desc">
										<div className="col-lg-1">
											<div className="wrapp status">
												{!localStorage.role ?
												<div className="img">
													{element.order.Status == 3 ? <img src={globalFileServer + 'icons/31.svg'} alt="" /> : null}
													{element.order.Status == 2 ? <img src={globalFileServer + 'icons/32.svg'} alt="" /> : null}
													{element.order.Status == 1 ? <img src={globalFileServer + 'icons/33.svg'} alt="" /> : null}
												</div>
												:
												<div className="status-container">
													<div className="img">
														{element.order.Status == 3 ? <img onClick={this.selectStatus} src={globalFileServer + 'icons/31.svg'} alt="" /> : null}
														{element.order.Status == 2 ? <img onClick={this.selectStatus} src={globalFileServer + 'icons/32.svg'} alt="" /> : null}
														{element.order.Status == 1 ? <img onClick={this.selectStatus} src={globalFileServer + 'icons/33.svg'} alt="" /> : null}
													</div>
													<div className="select-status">
														<img onClick={this.changeStatus.bind(this, 3, element.order.Id)} src={globalFileServer + 'icons/31.svg'} />
														<img onClick={this.changeStatus.bind(this, 2, element.order.Id)} src={globalFileServer + 'icons/32.svg'} />
														<img onClick={this.changeStatus.bind(this, 1, element.order.Id)} src={globalFileServer + 'icons/33.svg'} />
													</div>
												</div>
												}
											</div>
										</div>
										<div className="col-lg-1">
											<div className="wrapp order">
												<p className={this.state.openDetails == element.order.Id ? "open" : null} onClick={this.toggleDetails.bind(this, element.order.Id)}>{'#100' + element.order.Id}</p>
											</div>
										</div>
										<div className="col-lg-1">
											<div className="wrapp date-picker">
												<p>{element.order.OrderDate}</p>
											</div>
										</div>
										<div className="col-lg-1">
											<div className="wrapp date-picker">
											{!localStorage.role ?
												<p>{element.order.DeliveryDate ? element.order.DeliveryDate : null}</p>
											:
												<DatePicker
													dateFormat="DD/MM/YYYY"
													locale="he-il"
													placeholderText={element.order.DeliveryDate ? element.order.DeliveryDate : "בחר תאריך"}
													selected={element.order.EndDate ? element.order.EndDate : null}
													onChange={this.endDateChange.bind(this, element.order.Id)} />
											}
											</div>
										</div>
										<div className="col-lg-1">
											<div className="wrapp quantity"><p><span>{element.histor.length}</span></p></div>
										</div>
										<div className="col-lg-2">
											<div className="wrapp message">
												<p><span>{element.order.Message && element.order.Message.length > 70 ? element.order.Message.substring(0,70) + " ..." : element.order.Message}</span>
													{element.order.Message && element.order.Message.length > 70 ?
													<span className="tooltip">{element.order.Message}</span> : null}
												</p>

											</div>
										</div>
										<div className="col-lg-1">
											<div className="wrapp">{element.order.DiscountVal ? <p>{element.order.DiscountVal} ₪ -</p> : null}</div>
										</div>
										<div className="col-lg-2">
											<div className="wrapp price">
											<p className="payment-method">{element.order.PaymentMethod ? "(" + element.order.PaymentMethod + ")" : null}</p>
												<p>
													<span className="base-price">
														<span>מחיר אחרי הנחה</span>
														<span>{element.order.Price} ₪ </span>
													</span>
													<span className="tax">
														<span>מע”מ (% 17) </span>
														<span>{element.order.Price * this.state.tax / 100} ₪ </span>
													</span>
													<span className="last-price">
														<span>סה"כ</span>
														<span>{element.order.Price + (element.order.Price * this.state.tax / 100)} ₪ </span>
													</span>
												</p>
											</div>
										</div>
									</div>
									<div className={this.state.openDetails == element.order.Id ? "products-main-wrapp open" : "products-main-wrapp"}>
									<div className={localStorage.role && element.order.Status == 3 || localStorage.role && element.order.Status == 1 ? "products-wrapper disable" : "products-wrapper"}>
										{element.histor.map((elem, ind) => {
											let perc = (parseInt(elem.Price) * parseInt(elem.DiscountVal) / 100);
											return (
												<div key={ind} className="products-container flex-container">
													<div className="product-name">
														<p>{elem.ProdName + " / " + elem.ProdValue + " " + elem.ProdUnit}</p>
													</div>
													<div className={!localStorage.role ? "product-quantity" : "product-quantity edit"}>
													{!localStorage.role ?
														<p>{elem.Quantity}</p>
														:
														<div className="quantity">
															<div className="quantity-wrapp">
															{elem.Quantity > 1 ?
																<span onClick={this.increaseQuantity.bind(this, elem.Id, ind, index)} className="increase">&ndash;</span>
																:
																<span className="increase disabled">&ndash;</span>
															}
																<p>{elem.Quantity}</p>
																<span onClick={this.decreaseQuantity.bind(this, elem.Id, ind, index)} className="decrease">+</span>
															</div>
														</div>
													}
													</div>
													{localStorage.role ?
													<div className="user-discount">
														<p></p>
														<div className={elem.Appointed ? 'appointed' : null} onClick={this.saveUserDiscount.bind(this, index, ind)}>
															{!elem.Appointed ?
																<div>
																	<img src={globalFileServer + 'icons/save.svg'} alt="" />
																	<span>הגדר מחיר קבוע ללקוח</span>
																</div>
															:
																<div>
																	<img src={globalFileServer + 'icons/checked.svg'} alt="" />
																	<span>דיסקונט מוקצה</span>
																</div>
															}
														</div>
													</div> : null}
													{!localStorage.role ?
														<div className="discount">
														{elem.DiscountType && elem.DiscountVal ?
															<div>
																{elem.DiscountType == 2 ?
																	<p className="percent">% {elem.DiscountVal}</p>
																	:
																	<div>
																		<p className="per-product"><span className="name">יחידה</span><span>{elem.DiscountVal} ₪ -</span></p>
																		<p>
																		<span className="name">סה"כ</span><span>{parseInt(elem.DiscountVal) * parseInt(elem.Quantity)} ₪ -</span>
																		</p>
																	</div>
																}
															</div>
															:
															<p className="percent">הנחה 0</p>
														}
														</div>
														:
														<div className="discount">
															<input type="text" placeholder="0"
																value={elem.DiscountVal ? elem.DiscountVal : ""}
																onChange={this.changeDiscount.bind(this, elem.Id, index, ind)}
																onBlur={this.saveDiscount.bind(this, elem.Id, index, ind)}
															/>
														{elem.DiscountType && elem.DiscountVal ?
															<div className="edit">
																{elem.DiscountType == 2 ?
																	<p className="single-percent">
																		<span>% </span>
																	</p>
																	:
																	<div>
																		<p>
																			<span className="name">סה"כ</span>
																			<span>{parseInt(elem.DiscountVal) * parseInt(elem.Quantity)} ₪ -</span>
																		</p>
																	</div>
																}
															</div>
															:
															<div className="edit">
																<p className="percent">
																	<span> ₪ -</span>
																</p>
															</div>
														}
														</div>
													}
													<div className="price">
														{elem.DiscountType && elem.DiscountVal ?
															<div>
																{elem.DiscountType == 2 ?
																<p>{(parseInt(elem.Price) - perc) * parseInt(elem.Quantity)}  ₪</p>
																:
																<p>{(parseInt(elem.Price) - parseInt(elem.DiscountVal)) * parseInt(elem.Quantity)} ₪</p>
																}
															</div>
														:
															<p>{parseInt(elem.Price) * parseInt(elem.Quantity)} ₪</p>
														}
													</div>
												</div>
											)
										})}
									</div>
									</div>
								</div>
							)}
						})}
					</div>
				</div>
				:
				<div className="wrapper mobile">
					<h1 className="title">היסטוריה הזמנות</h1>
					<div className="navigation">
						<ul>
							<li onClick={ ()=> this.setState({ status: 0, viewAll: true }) } className={this.state.status == 0 ? "active" : null}>
								<img src={globalFileServer + 'icons/30.svg'} alt="" />
							</li>
							<li onClick={ ()=> this.setState({ status: 3, viewAll: false }) } className={this.state.status == 3 ? "active" : null}>
								<img src={globalFileServer + 'icons/31.svg'} alt="" />
							</li>
							<li onClick={ ()=> this.setState({ status: 2, viewAll: false }) } className={this.state.status == 2 ? "active" : null}>
								<img src={globalFileServer + 'icons/32.svg'} alt="" />
							</li>
							<li onClick={ ()=> this.setState({ status: 1, viewAll: false }) } className={this.state.status == 1 ? "active" : null}>
								<img src={globalFileServer + 'icons/33.svg'} alt="" />
							</li>
						</ul>
					</div>
					<div className="order-list">
						{this.state.status == 0 ? <h1>כל ההזמנות</h1> : null}
						{this.state.status == 3 ? <h1>ההזמנות מאושרות</h1> : null}
						{this.state.status == 2 ? <h1>ממתינות לאישור</h1> : null}
						{this.state.status == 1 ? <h1>לא מאושרות</h1> : null}
						{this.state.orderList.map((element, index) => {
							if (element.order.Status == this.state.status || this.state.viewAll) {
							return(
								<div key={index}>
									{localStorage.role ?
									<div className="user-info">
										<div onClick={ ()=> this.setState({openTooltip: element.order.Id}) }>
											<div className="name"><img src={globalFileServer + 'icons/user-shape.svg'}/></div>
											<div className="info">
												<p><span>{element.user.BusinessName} / </span><span>{element.user.UserName}</span></p>
											</div>
										</div>
										<div className={this.state.openTooltip == element.order.Id ? "tooltip-wrapper active" : "tooltip-wrapper"}>
											<div className="tooltip">
												<ul>
													<li className="close"><img onClick={ ()=> this.setState({openTooltip: false}) } src={globalFileServer + 'icons/exit.svg'}/></li>
													<li><span className="tit">ח.פ/ע.מ/ת.ז:</span><span>{element.user.UserName}</span></li>
													<li><span className="tit">שם העסק:</span><span>{element.user.BusinessName}</span></li>
													<li><span className="tit">איש קשר:</span><span>{element.user.ContactName}</span></li>
													<li><span className="tit">דוא"ל:</span><span>{element.user.Email}</span></li>
													<li><span className="tit">טלפון:</span><span>{element.user.Phone}</span></li>
												</ul>
											</div>
										</div>
									</div> : null}
									<p className="payment-method">{element.order.PaymentMethod ? "סוג אמצעי התשלום: " + element.order.PaymentMethod : null}</p>
									<div className="flex-container list-desc">
										{localStorage.role && element.order.Message ?
										<div className="user-info">
											<div className="absolute" onClick={ ()=> this.setState({openTooltipInfo: element.order.Id}) }>
												<img src={globalFileServer + 'icons/info.svg'}/>
											</div>
											<div className={this.state.openTooltipInfo == element.order.Id ? "tooltip-wrapper active" : "tooltip-wrapper"}>
												<div className="tooltip">
													<ul>
														<li className="close"><img onClick={ ()=> this.setState({openTooltipInfo: false}) } src={globalFileServer + 'icons/exit.svg'}/></li>
													</ul>
													<p dangerouslySetInnerHTML={{__html: element.order.Message.replace(/\n/g, "<br />")}}></p>
												</div>
											</div>
										</div> : null}
										<div className="col-lg-3">
											<div className="wrapp status">
												{!localStorage.role ?
												<div className="img">
													{element.order.Status == 3 ? <img src={globalFileServer + 'icons/31.svg'} alt="" /> : null}
													{element.order.Status == 2 ? <img src={globalFileServer + 'icons/32.svg'} alt="" /> : null}
													{element.order.Status == 1 ? <img src={globalFileServer + 'icons/33.svg'} alt="" /> : null}
												</div>
												:
												<div className="status-container">
													<div className="img">
														{element.order.Status == 3 ? <img onClick={this.selectStatus} src={globalFileServer + 'icons/31.svg'} alt="" /> : null}
														{element.order.Status == 2 ? <img onClick={this.selectStatus} src={globalFileServer + 'icons/32.svg'} alt="" /> : null}
														{element.order.Status == 1 ? <img onClick={this.selectStatus} src={globalFileServer + 'icons/33.svg'} alt="" /> : null}
													</div>
													<div className="select-status">
														<img onClick={this.changeStatus.bind(this, 3, element.order.Id)} src={globalFileServer + 'icons/31.svg'} />
														<img onClick={this.changeStatus.bind(this, 2, element.order.Id)} src={globalFileServer + 'icons/32.svg'} />
														<img onClick={this.changeStatus.bind(this, 1, element.order.Id)} src={globalFileServer + 'icons/33.svg'} />
													</div>
												</div>
												}
											</div>
										</div>
										<div className="col-lg-3">
											<div className="wrapp order">
												<p className={this.state.openDetails == element.order.Id ? "open" : null} onClick={this.toggleDetails.bind(this, element.order.Id)}>{'#100' + element.order.Id}</p>
											</div>
										</div>
										<div className="col-lg-3">
											<div className="wrapp date-picker">
											{!localStorage.role ?
												<p>{element.order.DeliveryDate ? element.order.DeliveryDate : null}</p>
											:
												<DatePicker
													dateFormat="DD/MM/YYYY"
													locale="he-il"
													placeholderText={element.order.DeliveryDate ? element.order.DeliveryDate : "בחר תאריך"}
													selected={element.order.EndDate ? element.order.EndDate : null}
													onChange={this.endDateChange.bind(this, element.order.Id)}
													onFocus={this.dateFocus}
													/>
											}
											</div>
										</div>
										<div className="col-lg-3">
											<div className="wrapp price">
												<p>
													<span className="last-price">
														<span>סה"כ</span>
														<span>{element.order.Price + (element.order.Price * this.state.tax / 100)} ₪ </span>
													</span>
												</p>
											</div>
										</div>
									</div>
									<div className={this.state.openDetails == element.order.Id ? "products-main-wrapp open" : "products-main-wrapp"}>
									<div className={localStorage.role && element.order.Status == 3 || localStorage.role && element.order.Status == 1 ? "products-wrapper disable" : "products-wrapper"}>
										{element.histor.map((elem, ind) => {
											let perc = (parseInt(elem.Price) * parseInt(elem.DiscountVal) / 100);
											return (
												<div key={ind} className={!localStorage.role ? "products-container user flex-container" : "products-container flex-container"}>
													<div className="product-name">
														<p>{elem.ProdName + " / " + elem.ProdValue + " " + elem.ProdUnit}</p>
													</div>
													<div className={!localStorage.role ? "product-quantity" : "product-quantity edit"}>
													{!localStorage.role ?
														<p><span>כמות: </span><span>{elem.Quantity}</span></p>
														:
														<div className="quantity">
															<div className="quantity-wrapp">
															{elem.Quantity > 1 ?
																<span onClick={this.increaseQuantity.bind(this, elem.Id, ind, index)} className="increase">&ndash;</span>
																:
																<span className="increase disabled">&ndash;</span>
															}
																<p>{elem.Quantity}</p>
																<span onClick={this.decreaseQuantity.bind(this, elem.Id, ind, index)} className="decrease">+</span>
															</div>
														</div>
													}
													</div>
													{localStorage.role ?
													<div className="user-discount">
														<p></p>
														<div className={elem.Appointed ? 'appointed' : null} onClick={this.saveUserDiscount.bind(this, index, ind)}>
															{!elem.Appointed ?
																<div>
																	<img src={globalFileServer + 'icons/save.svg'} alt="" />
																</div>
															:
																<div>
																	<img src={globalFileServer + 'icons/checked.svg'} alt="" />
																</div>
															}
														</div>
													</div> : null}
													{!localStorage.role ?
														<div className="discount">
														{elem.DiscountType && elem.DiscountVal ?
															<div>
																{elem.DiscountType == 2 ?
																	<p className="percent"><span>הנחה: </span><span>% {elem.DiscountVal}</span></p>
																	:
																	<div>
																		<p className="per-product"><span className="name">יחידה</span><span>{elem.DiscountVal} ₪ -</span></p>
																		<p>
																		<span className="name">סה"כ</span><span>{parseInt(elem.DiscountVal) * parseInt(elem.Quantity)} ₪ -</span>
																		</p>
																	</div>
																}
															</div>
															:
															<p className="percent">0</p>
														}
														</div>
														:
														<div className="discount">
															<input type="text" placeholder="0"
																value={elem.DiscountVal ? elem.DiscountVal : ""}
																onChange={this.changeDiscount.bind(this, elem.Id, index, ind)}
																onBlur={this.saveDiscount.bind(this, elem.Id, index, ind)}
															/>
														{elem.DiscountType && elem.DiscountVal ?
															<div className="edit">
																{elem.DiscountType == 2 ?
																	<p className="single-percent">
																		<div>
																			<span>% </span>
																		</div>
																	</p>
																	:
																	<div>
																		<p>
																			<span className="name">סה"כ</span>
																			<span>{parseInt(elem.DiscountVal) * parseInt(elem.Quantity)} ₪ -</span>
																		</p>
																	</div>
																}
															</div>
															:
															<div className="edit">
																<p className="percent">
																	<div>
																		<span> ₪ -</span>
																	</div>
																</p>
															</div>
														}
														</div>
													}
													<div className="price">
														{elem.DiscountType && elem.DiscountVal ?
															<div>
																{elem.DiscountType == 2 ?
																<p><span>סה"כ: </span><span>{(parseInt(elem.Price) - perc) * parseInt(elem.Quantity)}  ₪</span></p>
																:
																<p><span>סה"כ: </span><span>{(parseInt(elem.Price) - parseInt(elem.DiscountVal)) * parseInt(elem.Quantity)} ₪</span></p>
																}
															</div>
														:
															<p><span>סה"כ: </span><span>{parseInt(elem.Price) * parseInt(elem.Quantity)} ₪</span></p>
														}
													</div>
												</div>
											)
										})}
									</div>
									</div>
								</div>
							)}
						})}
					</div>
				</div>}
			</div>
		)
	}
}
