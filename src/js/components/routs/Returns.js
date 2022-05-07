import ReactDOM from "react-dom";

import React, { Component, Fragment } from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import SweetAlert from 'sweetalert2';
import Calendar from 'react-calendar';

import ReturnsPop from "./productPage/ReturnsPop";


export default class Returns extends Component {
	constructor(props){
		super(props);
		this.state = {
			date: new Date(),
      toDate: new Date(),
			items: [],
			tempItems: [],
			product: false,
			showCalendar: false,
			preload: false,
			search: false,
      calType:'',
      orderState: 0,
      toShow: 20,
      currentPage: 1,
      returnsPop: false
		}
		this.getItems = this.getItems.bind(this);
		this.selectDate = this.selectDate.bind(this);
		this.sortItems = this.sortItems.bind(this);
    this.closeReturnPop = this.closeReturnPop.bind(this);
    this.saveReturns = this.saveReturns.bind(this);

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
  setActiveOrder(id){
		this.setState({activeOrder: this.state.activeOrder == id ? false : id});
	}

  setPage(currentPage){
		this.setState({currentPage});
		window.scrollTo(0, 0);
	}

	sortItems(e){
		let val = e.target.value.toLowerCase();
		this.setState({search: val});
		let items = this.state.items.filter(item => item.DocNumber ? item.DocNumber.includes(val) : null);

    this.setState({tempItems:items});
	}
	calendarChange(date){
    if(this.state.calType=='from'){
		    this.setState({ date, showCalendar: false });
        this.getItems(date.toLocaleDateString('ru-RU').split('.').join('/'),this.state.toDate.toLocaleDateString('ru-RU').split('.').join('/'),this.state.orderState);
    }else if(this.state.calType=='to'){
        this.setState({ toDate: date, showCalendar: false });
        this.getItems(this.state.date.toLocaleDateString('ru-RU').split('.').join('/'),date.toLocaleDateString('ru-RU').split('.').join('/'),this.state.orderState);
    }
	}
	selectDate(calType){
		this.setState({showCalendar: true,calType});
	}
	getItems(date,toDate,orderState){

    this.setState({preload:true});
    let user = JSON.parse(localStorage.getItem('user'));

    let tmpDate = date.split("/");
    tmpDate = tmpDate[2]+"-"+tmpDate[1]+"-"+tmpDate[0] + " 00:00:00";
    let tmpToDate = toDate.split("/");
    tmpToDate = tmpToDate[2]+"-"+tmpToDate[1]+"-"+tmpToDate[0] + " 00:00:00";

    let val = {
      sess_id: localStorage.sessionId,
      token: localStorage.token,
      id: user.Id,
      ext_id: user.ExId,
      date: tmpDate,
      toDate:tmpToDate,
      action: "docs"
    };
    $.ajax({
      url: globalServer + 'new-api/docs.php',
			type: 'POST',
			data: val,
		}).done(function(data) {

      let items = JSON.parse(data);

      if(items.result = "success"){
        let docItems = items.items;
        docItems.map(item => {
  				item.Products = JSON.parse(item.Products);
  			});
        this.setState({items:docItems, tempItems: docItems, search: false, preload: false});

      }
		}.bind(this)).fail(function() {
      console.log("error");
      this.setState({preload:false});

    });
	}

  closeReturnPop(){
    this.setState({returnsPop:false});
  }

  saveReturns(returnObj){

    let val = {
			token: localStorage.token,
			role: localStorage.role,
      action: "writeReturns",
      prodObj: JSON.stringify(returnObj),
      docId: 5,
      userObj: JSON.stringify(this.props.state.user)
		};

    $.ajax({
			url: globalServer + 'new-api/write_docs.php',
			type: 'POST',
			data: val,
		}).done(function(data) {

      if(JSON.parse(data).result == "success"){
        SweetAlert({
          title: 'בקשה לזיכוי נשלחה בהצלחה',
          type: 'success',
          showConfirmButton: false,
          timer: 4000
        }).catch(SweetAlert.noop);
        this.getItems(this.state.date.toLocaleDateString('ru-RU').split('.').join('/'),this.state.toDate.toLocaleDateString('ru-RU').split('.').join('/'),this.state.orderState);
        this.closeReturnPop();
      }else{
        SweetAlert({
          title: 'בקשה לזיכוי לא נשלחה. אנא צור קשר',
          type: 'info',
          showConfirmButton: false,
          timer: 4000
        }).catch(SweetAlert.noop);
      }
		}.bind(this)).fail(function() {	console.log("error"); });

  }
	render(){
    let pagination = [...Array(Math.ceil(this.state.items.length / this.state.toShow)).keys()];

		return (
			<div className="page-container history admin-history return-page">
        {this.state.returnsPop ? ReactDOM.createPortal(
          <div className="my-modal prod-info">
            <div className="modal-wrapper animated">
              <div className="close-cont">
                <div onClick={this.closeReturnPop} className="close">
                  <img src={globalFileServer + 'icons/close.svg'} />
                </div>
              </div>
              <ReturnsPop {...this}/>
            </div>
            <div onClick={this.closeReturnPop} className="overflow"></div>
          </div>,
          document.getElementById('modal-root')
        ) : null}
				{this.state.preload ?
					<div className="spinner-wrapper">
						<div className="spinner">
							<div className="bounce1"></div>
							<div className="bounce2"></div>
							<div className="bounce3"></div>
						</div>
					</div>
				: null}
				<h1 className="title">היסטוריית זיכויים</h1>
				<Calendar
					onChange={(date) => this.calendarChange(date)}
					value={this.state.date}
					calendarType="Hebrew"
					locale="he-IL"
					className={this.state.showCalendar ? 'active' : null}
				/>
				<div className="flex-container for-calendar">

					<div className="col-lg-4 cal-cls">
						<div className="open-calendar">
              <p>מתאריך</p>
							<button onClick={this.selectDate.bind(this,'from')}>
								<img src={globalFileServer + 'icons/calendar.svg'} alt=""/>
								<span>{this.state.date.toLocaleDateString('he-IL').split('.').join('/')}</span>
							</button>
						</div>
					</div>
          <div className="col-lg-4 cal-cls">
						<div className="open-calendar">
              <p>לתאריך</p>
							<button onClick={this.selectDate.bind(this,'to')}>
								<img src={globalFileServer + 'icons/calendar.svg'} alt=""/>
								<span>{this.state.toDate.toLocaleDateString('he-IL').split('.').join('/')}</span>
							</button>
						</div>
					</div>

          <div className="col-lg-4 search-cls">
            <p>חיפוש</p>
            <div className="search">
              <input
                type="text"
                value={this.state.search ? this.state.search : ''}
                onChange={this.sortItems}
              />
              {!this.state.search ?
                <img src={globalFileServer + 'icons/search-gray.svg'} alt=""/>
              :
              <img onClick={() => this.setState({search: false, tempItems: this.state.items})} src={globalFileServer + 'icons/close.svg'} alt=""/>
              }
            </div>
          </div>
				</div>

				<div className={this.state.showCalendar ? 'container active' : 'container'}>
          <div onClick={()=> this.setState({returnsPop:true})}className="add-return-btn">
            <p>בקש החזרה</p>
          </div>
          <div className="items">
            <div className="heading">
              <div className="flex-container">
                <div className="col-lg-1">
                  <div className="wrapp">
                    <p></p>
                  </div>
                </div>
                <div className="col-lg-1">
                  <div className="wrapp">
                    <p>#</p>
                  </div>
                </div>
                <div className="col-lg-1">
                  <div className="wrapp">
                    <p>סוג</p>
                  </div>
                </div>
                <div className="col-lg-2">
                  <div className="wrapp">
                    <p>תאריך</p>
                  </div>
                </div>

                <div className="col-lg-2">
                  <div className="wrapp">
                    <p>תאריך ערך</p>
                  </div>
                </div>
                <div className="col-lg-2">
                  <div className="wrapp">
                    <p>אסמכתא</p>
                  </div>
                </div>
                <div className="col-lg-2">
                  <div className="wrapp">
                    <p>סך בתנועה</p>
                  </div>
                </div>

              </div>
            </div>
            <div className="body">
              {!this.state.tempItems.length ? <h1 className="no-products">לא נמצאו מסמכים בתאריכים אלו</h1> : null}
              {this.state.tempItems.map((element, index) => {
                if (index < this.state.toShow * this.state.currentPage && index >= (this.state.currentPage - 1) * this.state.toShow) {
                  if(element.DocumentId == "5"){
                    return(
                      <div key={index} className={this.state.activeOrder == element.ID ? "item active" : "item"}>
                        <div className="flex-container body-main-cls">
                          <div className="col-lg-1 col-drop" onClick={this.setActiveOrder.bind(this, element.ID)}>
                            <div className="wrapp">
                              <div className="img">
                                <img src={globalFileServer + 'icons/down.svg'} alt=""/>
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-1 col-id" onClick={this.setActiveOrder.bind(this, element.ID)}>
                            <div className="wrapp">
                              <p>{element.ID}</p>
                            </div>
                          </div>
                          <div className="col-lg-1 col-status" onClick={this.setActiveOrder.bind(this, element.ID)}>
                            <div className="wrapp">
                              <p>{'זיכוי'}</p>
                            </div>
                          </div>
                          <div className="col-lg-2 col-dueDate" onClick={this.setActiveOrder.bind(this, element.ID)}>
                            <div className="wrapp">
                              <p>{element.DueDate.substring(0,10)}</p>
                            </div>
                          </div>
                          <div className="col-lg-2 col-valDate" onClick={this.setActiveOrder.bind(this, element.ID)}>
                            <div className="wrapp">
                              <p>{element.ValueDate.substring(0,10)}</p>
                            </div>
                          </div>
                          <div className="col-lg-2 col-docNum" onClick={this.setActiveOrder.bind(this, element.ID)}>
                            <div className="wrapp">
                              <p>{element.DocNumber}</p>
                            </div>
                          </div>
                          <div className="col-lg-2 col-sum1" onClick={this.setActiveOrder.bind(this, element.ID)}>
                            <div className="wrapp">
                              <p>{parseFloat(element.TFtalVat).toFixed(2)}</p>
                            </div>
                          </div>

                        </div>
                        <div className="products">
                          <div className="heading">
                            <div className="flex-container">
                              <div className="col-lg-1">
                                <div className="wrapp">
                                  <p></p>
                                </div>
                              </div>
                              <div className="col-lg-2">
                                <div className="wrapp title">
                                  <p>מק״ט</p>
                                </div>
                              </div>
                              <div className="col-lg-3">
                                <div className="wrapp">
                                  <p>שם פריט</p>
                                </div>
                              </div>
                              <div className="col-lg-2">
                                <div className="wrapp">
                                  <p>מחיר</p>
                                </div>
                              </div>
                              <div className="col-lg-2">
                                <div className="wrapp">
                                  <p>כמות</p>
                                </div>
                              </div>
                              <div className="col-lg-2">
                                <div className="wrapp">
                                  <p>סה״כ</p>
                                </div>
                              </div>

                            </div>
                          </div>
                          {element.Products ? element.Products.map((el, ind) => {
                            let image = this.props.state.images.length ? this.props.state.images.filter(item => item == el.ItemKey) : [];
                            return(
                              <div key={ind} className="product">
                                <div className="flex-container row-cls">
                                  <div className="col-lg-1 col-prod-img">
                                    <div className="wrapp">
                                      <div className="img">
                                        <img src={image.length ? globalFileServer + 'products/' + el.ItemKey+ ".jpg" : globalFileServer + 'placeholder.jpg'} />
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex-container col-lg-5 united-cls">
                                    <div className="col-lg-5 col-prod-catalog">
                                      <div className="wrapp title">
                                        <p>{el.ItemKey}</p>
                                      </div>
                                    </div>
                                    <div className="col-lg-7 col-prod-title">
                                      <div className="wrapp">
                                        <p>{el.ItemName}</p>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-lg-2 col-prod-price">
                                    <div className="wrapp">
                                      <p>{(parseFloat(el.Price)).toFixed(2)}</p>
                                    </div>
                                  </div>
                                  <div className="col-lg-2 col-prod-quan">
                                    <div className="wrapp comment">
                                      <p>{el.Quantity}</p>
                                    </div>
                                  </div>
                                  <div className="col-lg-2 col-prod-comment">
                                    <div className="wrapp comment">
                                      <p>{parseFloat(el.TFtal).toFixed(2)}</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          }):null}
                        </div>
                      </div>
                    );
                  }
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
