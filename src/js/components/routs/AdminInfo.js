import React, { Component, Fragment } from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import SweetAlert from 'sweetalert2';
import Calendar from 'react-calendar';

export default class AdminInfo extends Component {
	constructor(props){
		super(props);
		this.state = {
			//date: new Date(),
      //toDate: new Date(),
			items: [],
			tempItems: [],
			product: false,
			//showCalendar: false,
			preload: false,
			search: false,
      calType:'',
      infoState: 0,
      toShow: 30,
      currentPage: 1,
      dayTitleArr:[{'id': '1', 'title': 'ראשון'},{'id': '2', 'title': 'שני'},{'id': '3', 'title': 'שלישי'},{'id': '4', 'title': 'רביעי'},{'id': '5', 'title': 'חמישי'},{'id': '6', 'title': 'שישי'},{'id': '7', 'title': 'שבת'}]
		}
		this.getUserCarts = this.getUserCarts.bind(this);
		this.sortItems = this.sortItems.bind(this);
    this.getLateClients = this.getLateClients.bind(this);


	}
	componentDidMount(){

		this.getUserCarts();
		setTimeout(() => window.scrollTo(0, 0), 200);
	}
  setActiveUser(id){
		this.setState({activeUser: this.state.activeUser == id ? false : id});
	}
  setPage(currentPage){
		this.setState({currentPage});
		window.scrollTo(0, 0);
	}


	showInfo(element){
		let html = ``;

		if (element.AddressJson) {
			html = `
			<div class="flex-container info-user">
				<div class="col-lg-4">
					<p>שם מלא</p>
					<p>מייל</p>
					<p>ת.ז.</p>
					<p>טלפון</p>
					<p>עיר</p>
					<p>שם הרחוב</p>
          <p>הערה:</p>
				</div>
				<div class="col-lg-8">
					<p>${element.UserName}</p>
					<p>${element.Mail}</p>
					<p>${element.Hp}</p>
					<p>${element.AddressJson.tel}</p>
					<p>${element.AddressJson.town}</p>
					<p>${element.AddressJson.streetName}</p>
          <p>${element.AddressJson.streetName}</p>
          <p>${element.OrdComment}</p>
					<p></p>
				</div>
			</div>
			`;
		} else {
			html = `
			<div class="flex-container info-user">
				<div class="col-lg-4">
					<p>שם מלא</p>
					<p>מייל</p>
          <p>כתובת</p>
					<p>טלפון</p>
          <p>מס' לקוח</p>
					<p>ח.פ/ע.מ</p>
				</div>
				<div class="col-lg-8">
					<p>${element.Name}</p>
					<p>${element.Mail}</p>
          <p>${element.Address}</p>
					<p>${element.Tel}</p>
          <p>${element.ExId}</p>
					<p>${element.Hp}</p>
				</div>
			</div>
			`;
		}
		SweetAlert({
			html: html,
			showConfirmButton: false,
			showCloseButton: true
		}).catch(SweetAlert.noop);
	}

	sortItems(e){
		let val = e.target.value.toLowerCase();
		this.setState({search: val});

		let items = this.state.items.filter(item => item.UserName ? item.UserName.toLowerCase().includes(val) : null);

    this.setState({tempItems:items});
	}

	getUserCarts(){

		let val = {
			token: localStorage.token,
			role: localStorage.role,
      action: "getCarts"
		};
		$.ajax({
      url: globalServer + 'new-api/cart_history.php',
			type: 'POST',
			data: val,
		}).done(function(data) {

			let items = JSON.parse(data).users;

      let tmpItems = [];
			items.map(item => {
				item.Products = JSON.parse(item.Products);
        item.Products && item.Products.length > 0 ? tmpItems.push(item) : null;
			});

			this.setState({items: tmpItems, tempItems: tmpItems, search: false});
		}.bind(this)).fail(function() {	console.log("error"); });
	}
  tabClickFunc(tabIndex){

    this.setState({infoState:tabIndex});
    //let date = this.state.date.toLocaleDateString('ru-RU').split('.').join('/');
    //let toDate = this.state.toDate.toLocaleDateString('ru-RU').split('.').join('/');
		this.getLateClients();

  }

  getLateClients(){
    this.setState({items: []});
    let val = {
			token: localStorage.token,
			role: localStorage.role,
      action: "adminInfo"
		};
		$.ajax({
      url: globalServer + 'new-api/sync/reminderCron.php',
			type: 'POST',
			data: val,
		}).done(function(data) {

      if(JSON.parse(data).result == "success"){
			  let items = JSON.parse(data).users;
        this.setState({items: items});
      }


		}.bind(this)).fail(function() {	console.log("error"); });
  }
  changeMoreVal(id,val){
    let items = this.state.items;
    //userListAll
    items.find(item => item.Id == id).More = val;
    this.setState({items})
  }
  unsetMore(itemId){
    let items = this.state.items;
    items.find(item => item.Id == itemId).More = false;

    this.setState({items})
  }
  removeProdsInCart(ele){
    let items = this.state.items;
    items.find(item => item.Id == ele.Id).More = false;

    this.setState({items})

    SweetAlert({
			title: 'האם אתה בטוח?',
			text: 'האם ברצונך למחוק את סל הקניות?',
			type: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#22b09a',
			cancelButtonColor: '#d80028',
			confirmButtonText: 'מחק',
			cancelButtonText: 'בטל'
		}).then(function(ele, res) {
			if (res.value) {
        let val = {
    			token: localStorage.token,
          sess_id: localStorage.sessionId,
    			role: localStorage.role,
          UserId: ele.UserId,
          action: "removeCart",
    		};
    		$.ajax({
          url: globalServer + 'new-api/cart_history.php',
    			type: 'POST',
    			data: val,
    		}).done(function(data) {
          if(JSON.parse(data).result == "success"){
            let items = this.state.items;
            items = items.filter(item => item.Id != ele.Id);
            this.setState({tempItems:items});
          }
    		}.bind(this)).fail(function() {	console.log("error"); });
			}
		}.bind(this, ele)).catch(SweetAlert.noop);


  }
	render(){
    let pagination = [...Array(Math.ceil(this.state.items.length / this.state.toShow)).keys()];

		return (
			<div className="page-container history admin-history admin-info">

        <div className="admin-info-cont">

  				{this.state.preload ?
  					<div className="spinner-wrapper">
  						<div className="spinner">
  							<div className="bounce1"></div>
  							<div className="bounce2"></div>
  							<div className="bounce3"></div>
  						</div>
  					</div>
  				: null}
  				<h1 className="title">מרכז מידע</h1>
  				<Calendar
  					onChange={(date) => this.calendarChange(date)}
  					value={this.state.date}
  					calendarType="Hebrew"
  					locale="he-IL"
  					className={this.state.showCalendar ? 'active' : null}
  				/>


          <div className="filter">
            {this.state.activeTab != "approved" && this.state.activeTab != "waitForApprove" ?
              <div className="">
                <div className="">
                  <ul className="filter-ul" style={{backgroundImage: 'url(' + globalFileServer + '/icons/filter.svg)'}}>
                    <li onClick = {this.tabClickFunc.bind(this,0)} className={this.state.infoState == 0 ? 'active':null}>
                      <span>סלי קניות</span>
                    </li>
                    <li onClick = {this.tabClickFunc.bind(this,1)} className={this.state.infoState == 1 ? 'active':null}>
                      <span>איחור בהזמנה</span>
                    </li>
                  </ul>
                </div>
              </div>
            : null}
          </div>

  				<div className={this.state.showCalendar ? 'container active' : 'container'}>
            <div className="items">
              <div className="heading">
                <div className="flex-container">
                  <div className="col-lg-1">
                    <div className="wrapp">
                      <p></p>
                    </div>
                  </div>
                  <div className="col-lg-2">
                    <div className="wrapp">
                      <p>#</p>
                    </div>
                  </div>

                  <div className="col-lg-3">
                    <div className="wrapp">
                      <p>שם לקוח</p>
                    </div>
                  </div>
                  <div className="col-lg-2">
                    <div className="wrapp">
                      {this.state.infoState == 0 ?
                        <p>תאריך</p>
                      :
                        <p>אספקה</p>
                      }
                    </div>
                  </div>
                  <div className="col-lg-1">
                    <div className="wrapp info">
                      <p>מידע</p>
                    </div>
                  </div>
                  <div className="col-lg-2">
                    <div className="wrapp info">
                      {this.state.infoState == 0 ?
                        <p>פעולות</p>
                      :null}
                    </div>
                  </div>
                </div>
              </div>
              {this.state.infoState == 0 ?
                <div className="body">
                  {!this.state.tempItems.length ? <h1 className="no-products">לא קיימים סלי קניות</h1> : null}
                  {this.state.tempItems.map((element, index) => {
                    if (index < this.state.toShow * this.state.currentPage && index >= (this.state.currentPage - 1) * this.state.toShow) {
                      let tmpDate = element.Date.substring(0,10);
                      tmpDate = tmpDate.split("-");
                      tmpDate = tmpDate[2]+"/"+tmpDate[1]+"/"+tmpDate[0];
                      return(
                        <div key={index} className={this.state.activeUser == element.Id ? "item active" : "item"}>
                          <div className="flex-container body-main-cls">
                            <div className="col-lg-1 col-drop" onClick={this.setActiveUser.bind(this, element.Id)}>
                              <div className="wrapp">
                                {this.state.activeOrder == element.Id ?
                                  <img src={globalFileServer + 'icons/up-purple.svg'} alt=""/>
                                  :
                                  <img src={globalFileServer + 'icons/down-purple.svg'} alt=""/>
                                }
                              </div>
                            </div>
                            <div className="col-lg-2 col-exId">
                              <div className="wrapp">
                                <p>{element.ExId}</p>
                              </div>
                            </div>
                            <div className="col-lg-3 col-name">
                              <div className="wrapp">
                                <p>{element.Name}</p>
                              </div>
                            </div>
                            <div className="col-lg-2 col-date">
                              <div className="wrapp">
                                <p>{tmpDate}</p>
                              </div>
                            </div>
                            <div className="col-lg-1 col-info">
                              <div className="wrapp">
                                <div className="img" >
                                  <img className="info-icon-img" src={globalFileServer + 'icons/info.svg'} onClick={() => this.setState({userInfo: element.Id})}/>
                                  {this.state.userInfo == element.Id ?
                                    <div className="user-info-wrapp">
                                      <div className="popup-contant">
                                        <div className="popup-contant-header flex-container">
                                          <div className="col-lg-10" >
                                            <p>מידע</p>
                                          </div>
                                          <div className="close-popup col-lg-2">
                                            <div className="close-popup-cont" onClick={() => this.setState({userInfo: false})}>
                                              <img src={globalFileServer + 'icons/close_purple.svg'} />
                                              </div>
                                          </div>
                                        </div>
                                        <div className="all-row-cont">
                                          <div className="flex-container row-cont">
                                            <div className="col-lg-4 title">
                                              <p>שם הלקוח</p>
                                            </div>
                                            <div className="col-lg-8 value">
                                              <p>{element.Name}</p>
                                            </div>
                                          </div>
                                          {element.Hp ?
                                            <div className="flex-container row-cont">
                                              <div className="col-lg-4 title">
                                                <p>ח.פ / ע.מ</p>
                                              </div>
                                              <div className="col-lg-8 value">
                                                <p>{element.Hp}</p>
                                              </div>
                                            </div>
                                          :null}
                                          {element.ExId ?
                                            <div className="flex-container row-cont">
                                              <div className="col-lg-4 title">
                                                <p>מס' לקוח</p>
                                              </div>
                                              <div className="col-lg-8 value">
                                                <p>{element.ExId}</p>
                                              </div>
                                            </div>
                                          :null}
                                          {element.Mail ?
                                            <div className="flex-container row-cont">
                                              <div className="col-lg-4 title">
                                                <p>שם משתמש</p>
                                              </div>
                                              <div className="col-lg-8 value">
                                                <p>{element.Mail}</p>
                                              </div>
                                            </div>
                                          :null}
                                        </div>
                                      </div>
                                    </div>
                                  : null}
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-1 more">
                              <div className="wrapp" >
                                <img src={globalFileServer + 'icons/more.svg'} onClick={this.changeMoreVal.bind(this,element.Id,!element.More)}/>
                              </div>
                              {element.More ?
                                <div className="more_cont">
                                  <div className="more_cont-header flex-container">
                                    <div className="col-lg-10" >
                                      <p></p>
                                    </div>
                                    <div className="close-popup col-lg-2">
                                      <div className="close-popup-cont" onClick={this.unsetMore.bind(this,element.Id)}>
                                        <img src={globalFileServer + 'icons/close_purple.svg'} />
                                        </div>
                                    </div>
                                  </div>
                                  <div className="flex-container row" onClick={this.removeProdsInCart.bind(this,element)}>
                                    <div className="col-lg-2">
                                      <img src={globalFileServer + 'icons/wheel1.svg'} />
                                    </div>
                                    <div className="col-lg-10">
                                      <p>מחק סל</p>
                                    </div>
                                  </div>
                                </div>
                              :null}
                            </div>
                          </div>
                          <div className={this.state.activeUser == element.Id ? "products active" : "products"}>
                            <div className="prod-heading">
                              <div className="flex-container">
                                <div className="col-lg-1">
                                  <div className="wrapp">
                                    <p></p>
                                  </div>
                                </div>
                                <div className="col-lg-4 head-title-col">
                                  <div className="wrapp title">
                                    <p>מוצר</p>
                                  </div>
                                </div>
                                <div className="col-lg-1 head-quan-col">
                                  <div className="wrapp">
                                    <p>כמות</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                            {element.Products ? element.Products.map((el, ind) => {
                              if(el.Products){
                                let image =  this.props.state.images.length ? this.props.state.images.filter(item => item == el.Products.CatalogNumber) : [] ;

                                return(
                                  <div key={ind} className="product">
                                    <div className="flex-container row-cls">
                                      <div className="col-lg-1 col-prod-img">
                                        <div className="wrapp">
                                          <div className="img">
                                            <img src={image.length ? globalFileServer + 'products/' + el.Products.CatalogNumber+ ".jpg" : globalFileServer + 'placeholder.jpg'} />
                                          </div>
                                        </div>
                                      </div>
                                      <div className="col-lg-4 col-prod-title">
                                        <div className="wrapp title">
                                          <p>{el.Products.Title}</p>
                                        </div>
                                      </div>
                                      <div className="col-lg-1 col-prod-quan">
                                        <div className="wrapp">
                                          <p>{el.Quantity}</p>
                                        </div>
                                      </div>
                                    </div>
                                  </div>
                                );
                              }

                            }):null}
                          </div>
                        </div>
                      );
                    }
                  })}
                </div>
              :null}
              {this.state.infoState == 1 ?
                <div className="body">
                  {!this.state.items.length ? <h1 className="no-products">לא קיימים לקוחות</h1> : null}
                  {this.state.items.map((element, index) => {
                    if (index < this.state.toShow * this.state.currentPage && index >= (this.state.currentPage - 1) * this.state.toShow) {
                      let dayString = "";
                      let singleDay = "";
                      if(element.DispatchingDays){
                        if(element.DispatchingDays.includes(",")){
                          let split = element.DispatchingDays.split(",");
                          split.map((e,i) => {
                            singleDay = this.state.dayTitleArr.filter((item) => {return item.id == e})[0].title;
                            dayString.length ? dayString += " , " + singleDay : dayString = singleDay;
                          })
                        }else{
                          dayString = this.state.dayTitleArr.filter((item) => {return item.id == element.DispatchingDays})[0].title;
                        }
                      }
                      return(
                        <div key={index} className="item">
                          <div className="flex-container body-main-cls">
                            <div className="col-lg-1 col-drop" onClick={this.setActiveUser.bind(this, element.Id)}>
                              <div className="wrapp">
                                <div className="img">
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-2 col-exId">
                              <div className="wrapp">
                                <p>{element.ExId}</p>
                              </div>
                            </div>
                            <div className="col-lg-3 col-name">
                              <div className="wrapp">
                                <p>{element.Name}</p>
                              </div>
                            </div>
                            <div className="col-lg-2 col-date">
                              <div className="wrapp">
                                <p>{dayString}</p>
                              </div>
                            </div>
                            <div className="col-lg-1 col-info">
                              <div className="wrapp">
                                <div className="img">
                                  <img className="info-icon-img" src={globalFileServer + 'icons/info.svg'} onClick={() => this.setState({userInfo: element.Id})}/>
                                  {this.state.userInfo == element.Id ?
                                    <div className="user-info-wrapp">
                                      <div className="popup-contant">
                                        <div className="popup-contant-header flex-container">
                                          <div className="col-lg-10" >
                                            <p>מידע</p>
                                          </div>
                                          <div className="close-popup col-lg-2">
                                            <div className="close-popup-cont" onClick={() => this.setState({userInfo: false})}>
                                              <img src={globalFileServer + 'icons/close_purple.svg'} />
                                              </div>
                                          </div>
                                        </div>
                                        <div className="all-row-cont">
                                          <div className="flex-container row-cont">
                                            <div className="col-lg-4 title">
                                              <p>שם הלקוח</p>
                                            </div>
                                            <div className="col-lg-8 value">
                                              <p>{element.Name}</p>
                                            </div>
                                          </div>
                                          {element.Hp ?
                                            <div className="flex-container row-cont">
                                              <div className="col-lg-4 title">
                                                <p>ח.פ / ע.מ</p>
                                              </div>
                                              <div className="col-lg-8 value">
                                                <p>{element.Hp}</p>
                                              </div>
                                            </div>
                                          :null}
                                          {element.ExId ?
                                            <div className="flex-container row-cont">
                                              <div className="col-lg-4 title">
                                                <p>מס' לקוח</p>
                                              </div>
                                              <div className="col-lg-8 value">
                                                <p>{element.ExId}</p>
                                              </div>
                                            </div>
                                          :null}
                                          {element.Mail ?
                                            <div className="flex-container row-cont">
                                              <div className="col-lg-4 title">
                                                <p>שם משתמש</p>
                                              </div>
                                              <div className="col-lg-8 value">
                                                <p>{element.Mail}</p>
                                              </div>
                                            </div>
                                          :null}
                                        </div>
                                      </div>
                                    </div>
                                  : null}
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    }
                  })}
                </div>
              :null}
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
			</div>
		)
	}
}
