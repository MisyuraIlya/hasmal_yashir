import ReactDOM from "react-dom";
import React, { Component, Fragment } from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import SweetAlert from 'sweetalert2';
import Calendar from 'react-calendar';
import PayPopup from '././shopCart/PayPopup';
import ChecksPopUP from "./productPage/ChecksPopUP";
import ReturnsPop from "./productPage/ReturnsPop";




export default class Docs extends Component {
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
      toShow: 50,
      currentPage: 1,
      toPayPopup: false,
      chosenDoc:[],
      userInfo:[],
      checksPopUP: false,
      popAction:"",
      returnsPop: false,
      orderHistory: []


		}
		this.selectDate = this.selectDate.bind(this);
		this.sortItems = this.sortItems.bind(this);
		this.closePayPopup = this.closePayPopup.bind(this);
    this.splitPaymentsPay = this.splitPaymentsPay.bind(this);
    this.closeChecksPopUP = this.closeChecksPopUP.bind(this);
    this.goToTranzillaFunc = this.goToTranzillaFunc.bind(this);
    this.closeReturnPop = this.closeReturnPop.bind(this);
    this.saveReturns = this.saveReturns.bind(this);

	}
	componentDidMount(){
    let tmpDate = new Date();
    let firstDay = new Date(tmpDate.getFullYear(), tmpDate.getMonth(), 1);

    tmpDate.setDate(tmpDate.getDate() - 3);
    firstDay = tmpDate;

    this.setState({date:firstDay});

		let date = firstDay.toLocaleDateString('ru-RU').split('.').join('/');
    let toDate = this.state.toDate.toLocaleDateString('ru-RU').split('.').join('/');
		this.getItems(date,toDate,this.state.orderState);
		setTimeout(() => window.scrollTo(0, 0), 200);
	}

  closeChecksPopUP(){
    this.setState({checksPopUP:false});
  }
  setActiveOrder(id){
		this.setState({activeOrder: this.state.activeOrder == id ? false : id});
	}

  goToTranzillaFunc(price){
    this.setState({chosenPrice: price, toPayPopup: true, checksPopUP:false});
  }

  downloadPdf(exFile){
    this.setState({preload:true});


    let split = exFile.replace(/\\/g , "/");
    split = split.split("/");

    let fileName = split[split.length-1];
    let extPath = "";
    for(let i=0; i<split.length;i++){
      if(i != split.length-1){
        extPath += split[i] + "/";
      }
    }

    let val = {
      fileName: fileName,
      extPath: extPath
    };

    $.ajax({
      url: globalServer + 'new-api/docs_pdf_download.php',
			type: 'POST',
			data: val,
		}).done(function(data) {
      var win = window.open(globalServer + 'new-api/sync/docs/' + fileName , '_blank');
      this.setState({preload:false});
		}.bind(this)).fail(function() {
      console.log("error");
      this.setState({preload:false});
    });
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
	getItems = async (date,toDate,orderState) => {

    this.setState({preload:true});
    let user = JSON.parse(localStorage.getItem('user'));

    let tmpDate = date.split("/");
    tmpDate = tmpDate[2]+tmpDate[1]+tmpDate[0];
    let tmpToDate = toDate.split("/");
    tmpToDate = tmpToDate[2]+tmpToDate[1]+tmpToDate[0];

    let val = {
      sess_id: localStorage.sessionId,
      token: localStorage.token,
      id: user.Id,
      ext_id: user.ExId,
      date: tmpDate,
      toDate:tmpToDate,
      action: "docs"//docs//docsForPayment
    };

    const valAjax = {
      funcName: '',
      point: 'new-api/docs',
      val: val
    };

    try {
      const data = await this.props.ajax(valAjax);
    //  debugger;
      let items = JSON.parse(data);

      if(items.result == "success"){
        let docItems = items.items;

        this.setState({userInfo:items.user, items:docItems, tempItems: docItems, orderHistory: items.OrderHistory, search: false, preload: false});
      }
    } catch(err) {
      console.log('connection error docs');
      this.setState({preload:false});
    }
	}

  createNewCart(order){
    this.props.simpleClearCart();

    let user = JSON.parse(localStorage.getItem('user'));


    let ordProducts = [];
    let obj;

    order.Products.map((ele,ind) => {
      obj = {'CatalogNumber':ele.ItemKey,
             'Price': ele.Price,
             'Discount': null,
             'Title': ele.ItemName,
             'PurchQuantity': ele.PurchQuantity
            };
      ordProducts.push(obj);
    })

    let val = {
     userId: user.Id,
     priceCode: user.PriceList,
     Products: ordProducts,
     userExtId: user.ExId
   };


    $.ajax({
      url: globalServer + 'new-api/return_prices_for_products.php',
      type: 'POST',
      data: val,
    }).done(function(ordProducts,data) {
      let newProducts = [];
      let product;
      let tmpProd;
      let prodFromDb;

      ordProducts.map((item) => {
        product = this.props.state.products.filter((e,i) => {return e.CatalogNumber == item.CatalogNumber});
        if(product.length && !product[0].SpecialPrice){
          prodFromDb = data.filter((e,i) => {return e.CatalogNumber == item.CatalogNumber});
          product[0].Price = prodFromDb[0].Price;
          product[0].Discount = prodFromDb[0].Discount;
          tmpProd = { 'Id' : parseInt(product[0].Id),
                      "Quantity" : parseFloat(item.PurchQuantity),
                      "Products" : product[0],
                      "UnitChosen": product[0].Unit == "2" ? 2 : 0,
                      "CategoryId": product[0].CategoryId
                    };
          newProducts.push(tmpProd);
        }
      });

      this.props.restoreCart(newProducts);
      this.props.history.push("/cart");
    }.bind(this,ordProducts)).fail(function() {	console.log("error"); });
  }


	closePayPopup(){
		this.setState({toPayPopup: false, payAgentPopup: false});
	}


  splitPaymentsPay(data){

    let chosenDoc = {};
    let paymentData = JSON.parse(data);
    let credTypeArr = ["ישראכרט",
    "ויזה",
    "דיינרס",
    "אמריקן",
    "JCB",
    "לאומיכארד"];

    let paymentDataString = "עסקת אשראי: " + paymentData.Tempref + " , " + "4 ספרות: " +
    paymentData.ccno + " , " + "תוקף: " + paymentData.expmonth + "-" + paymentData.expyear + " , " + "סוג: " + credTypeArr[parseInt(paymentData.cardtype)] + " , " +
    "תשלומים: " + paymentData.cred_type + " , " + "סכום: " + paymentData.sum;

    chosenDoc.paymentDataString = paymentDataString;
    chosenDoc.TFtalVat = paymentData.sum;


    let val = {
			token: localStorage.token,
			role: localStorage.role,
      action: "writeKabalatSohen",
      prodObj: JSON.stringify(chosenDoc),
      docId: 31,
      userObj: JSON.stringify(this.props.state.user)
		};
    $.ajax({
			url: globalServer + 'new-api/write_docs.php',
			type: 'POST',
			data: val,
		}).done(function(data) {
      if(JSON.parse(data).result == "success"){
        SweetAlert({
          title: 'תשלום התקבל בהצלחה',
          type: 'success',
          showConfirmButton: false,
          timer: 4000
        }).catch(SweetAlert.noop);
      }else{
        SweetAlert({
          title: 'התשלום התקבל אך לא הונפקה קבלה. נציג יצור עמך קשר בהקדם',
          type: 'info',
          showConfirmButton: false,
          timer: 4000
        }).catch(SweetAlert.noop);
      }
		}.bind(this)).fail(function() {	console.log("error"); });


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

        let tmpDate = new Date();
        let firstDay = new Date(tmpDate.getFullYear(), tmpDate.getMonth(), 1);
        this.setState({date:firstDay});

        let date = firstDay.toLocaleDateString('ru-RU').split('.').join('/');
        let toDate = this.state.toDate.toLocaleDateString('ru-RU').split('.').join('/');
        this.getItems(date,toDate,this.state.orderState);

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


  payCredit = () => {
    debugger;
  }
	render(){
    let pagination = [...Array(Math.ceil(this.state.items.length / this.state.toShow)).keys()];

		return (
			<div className="page-container history admin-history docs">
        <div className="docs-sub-cont">

          {this.state.checksPopUP ? ReactDOM.createPortal(
            <div className="my-modal prod-info">
              <div className="modal-wrapper animated">
                <div className="popup-contant-header flex-container">
                  <div className="col-lg-10" >
                    {this.state.popAction == "payment" ?
                      <p>הזן סכום לתשלום</p>
                      :
                      <p>המחאות עתידיות</p>
                    }
                  </div>
                  <div className="close-popup col-lg-2">
                    <div className="close-popup-cont" onClick={this.closeChecksPopUP}>
                      <img src={globalFileServer + 'icons/close_purple.svg'} />
                      </div>
                  </div>
                </div>
                <ChecksPopUP {...this}/>
              </div>
              <div onClick={this.closeChecksPopUP} className="overflow"></div>
            </div>,
            document.getElementById('modal-root')
          ) : null}
          {this.state.returnsPop ? ReactDOM.createPortal(
            <div className="my-modal prod-info">
              <div className="modal-wrapper animated returns">
                <div className="popup-contant-header flex-container">
                  <div className="col-lg-10" >
                    <p>מוצרים לזיכוי</p>
                  </div>
                  <div className="close-popup col-lg-2">
                    <div className="close-popup-cont" onClick={this.closeReturnPop}>
                      <img src={globalFileServer + 'icons/close_purple.svg'} />
                      </div>
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
          {this.state.toPayPopup ? ReactDOM.createPortal(
  					<PayPopup {...this}/>,
  					document.getElementById('modal-root')
  				) : null}
  				<h1 className="title">היסטוריית מסמכים</h1>
  				<Calendar
  					onChange={(date) => this.calendarChange(date)}
  					value={this.state.date}
  					calendarType="Hebrew"
  					locale="he-IL"
  					className={this.state.showCalendar ? 'active' : null}
  				/>
          <div className="for-calendar flex-container">
            <div className="flex-container right-side-header col-lg-7">
              <div className="cal-cls  right-side-comp">
                <div className="open-calendar">
                  <p className="inline-cls">מתאריך</p>
                  <button className="inline-cls" onClick={this.selectDate.bind(this,'from')}>
                    <img src={globalFileServer + 'icons/calendar.svg'} alt=""/>
                    <span>{this.state.date.toLocaleDateString('he-IL').split('.').join('/')}</span>
                  </button>
                </div>
              </div>
              <div className="cal-cls  right-side-comp">
                <div className="open-calendar">
                  <p className="inline-cls">לתאריך</p>
                  <button className="inline-cls" onClick={this.selectDate.bind(this,'to')}>
                    <img src={globalFileServer + 'icons/calendar.svg'} alt=""/>
                    <span>{this.state.toDate.toLocaleDateString('he-IL').split('.').join('/')}</span>
                  </button>
                </div>
              </div>
            {/*
              <div className="search-cls  right-side-comp">

                <div className="search">

                  <input
                    type="text"
                    value={this.state.search ? this.state.search : ''}
                    onChange={this.sortItems}
                    placeholder="חפש אסמכתא"
                  />
                  {!this.state.search ?
                    <img src={globalFileServer + 'icons/search-gray.svg'} alt=""/>
                  :
                  <img onClick={() => this.setState({search: false, tempItems: this.state.items})} src={globalFileServer + 'icons/close.svg'} alt=""/>
                  }
                </div>
              </div>
            */}
            </div>
            <div className="flex-container left-side-header col-lg-5">
              {this.state.userInfo ?
                <div className="userInfo-cls flex-container">
{/*
                  <div className="left-side-comp header-btn-cont col-pay">
                    <div className="btn-small-cont" onClick={()=> this.setState({returnsPop:true})}>
                      <img className="info-icon-img xls-btn-icon" src={globalFileServer + 'icons/refunding.svg'} />
                    </div>
                  </div>
                  <div className="left-side-comp header-btn-cont col-pay">
                    <div className="btn-small-cont" onClick={()=> this.setState({checksPopUP:true, popAction:"payment"})}>
                      <img className="info-icon-img xls-btn-icon" src={globalFileServer + 'icons/credit.svg'} />
                    </div>
                  </div>

                  <div className="left-side-comp header-btn-cont col-cheq">
                    <div className="btn-small-cont" onClick={()=> this.setState({checksPopUP:true, popAction:"cheq"})}>
                      <img className="info-icon-img xls-btn-icon" src={globalFileServer + 'icons/cheque.svg'} />
                    </div>
                  </div>
*/}
                  <div className="left-side-comp userInfoCol col-lg-3">
                    <p>יתרת חוב: </p>
                    <p className="infoVal">{parseFloat(this.state.userInfo.Balance).toFixed(2) + " ₪"}</p>
                  </div>
                {/*
                  <div  className="left-side-comp userInfoCol col-lg-3">
                    <p>אובליגו: </p>
                    <p className="infoVal">{(parseFloat(this.state.userInfo.MaxObligo))}</p>
                  </div>
                */}
                </div>
              :null}
            </div>
          </div>

  				<div className={this.state.showCalendar ? 'doc-container active' : 'doc-container'}>
            <div className="items">
              <div className="heading">
                <div className="flex-container heading-cont">
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

                  <div className="col-lg-1">
                    <div className="wrapp">
                      <p>הנחה מסחרית</p>
                    </div>
                  </div>

                  <div className="col-lg-1">
                    <div className="wrapp">
                      <p>סה״כ מע״מ</p>
                    </div>
                  </div>
                  <div className="col-lg-1">
                    <div className="wrapp">
                      <p>סה״כ לתשלום</p>
                    </div>
                  </div>


                  <div className="col-lg-1">
                    <div className="wrapp">
                      <p>סוג</p>
                    </div>
                  </div>

                </div>
              </div>
              <div className="body">
                {!this.state.tempItems.length && !this.state.orderHistory.length ? <h1 className="no-products">לא נמצאו מסמכים בתאריכים אלו</h1> : null}

                {this.state.orderHistory.length ?
                  <div className="devide-rec-main">
                    <div className="devide-rec-sub">
                      <p>הזמנות</p>
                    </div>
                  </div>
                :null}
                {this.state.orderHistory.map((element, index) => {

                    let tmpDate="";
                    if(element.Date){
                      tmpDate = element.Date.split(" | ")[0];
                      tmpDate = tmpDate.replaceAll("-", "/");
                    }

                    return(
                      <div key={index} className={this.state.activeOrder == element.Id ? "item active" : "item"}>
                        <div className="flex-container body-main-cls">
                          <div className="col-lg-1 col-drop" onClick={this.setActiveOrder.bind(this, element.Id)}>
                            <div className="wrapp">
                              <div className="img">
                                {this.state.activeOrder == element.Id ?
                                  <img src={globalFileServer + 'icons/up-purple.svg'} alt=""/>
                                  :
                                  <img src={globalFileServer + 'icons/down-purple.svg'} alt=""/>
                                }
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-1 col-id" onClick={this.setActiveOrder.bind(this, element.Id)}>
                            <div className="wrapp">
                              <p>{element.ExId}</p>
                            </div>
                          </div>

                          <div className="col-lg-2 col-valDate" onClick={this.setActiveOrder.bind(this, element.Id)}>
                            <div className="wrapp">
                              <p>{tmpDate}</p>
                            </div>
                          </div>
                          <div className="col-lg-2 col-docNum" onClick={this.setActiveOrder.bind(this, element.Id)}>
                            <div className="wrapp">
                              <p>{"-"}</p>
                            </div>
                          </div>

                          <div className="col-lg-1 col-sum1 sum1" onClick={this.setActiveOrder.bind(this, element.Id)}>
                            <div className="wrapp">
                              <p>{element.DeliveryPrice ? element.DeliveryPrice + "%" : "-"}</p>
                            </div>
                          </div>

                          <div className="col-lg-1 col-sum1 sum2" onClick={this.setActiveOrder.bind(this, element.Id)}>
                            <div className="wrapp">
                              <p>{(parseFloat(element.Total)-parseFloat(element.PriceNoVat)).toFixed(2)}</p>
                            </div>
                          </div>
                          <div className="col-lg-1 col-sum1 sum3" onClick={this.setActiveOrder.bind(this, element.Id)}>
                            <div className="wrapp">
                              <p>{element.Total}</p>
                            </div>
                          </div>


                          <div className="col-lg-1 col-approved col-status">
                            <div className="wrapp">
                              <p className='NotActive'>{"הזמנה"}</p>
                            </div>
                          </div>



                        </div>
                        <div className="products">
                          <div className="heading heading-prod">
                            <div className="flex-container heading-prod-cont">
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
                                <div className="wrapp title">
                                  <p>מוצר</p>
                                </div>
                              </div>

                              <div className="col-lg-2">
                                <div className="wrapp">
                                  <p>כמות</p>
                                </div>
                              </div>
                              <div className="col-lg-2">
                                <div className="wrapp">
                                  <p>סה״כ לפני מע״מ</p>
                                </div>
                              </div>

                            </div>
                          </div>
                          {element.Products ? element.Products.map((el, ind) => {
                            return(
                              <div key={ind} className="product">
                                <div className="flex-container row-cls">
                                  <div className="col-lg-1 col-prod-img">
                                    <div className="wrapp">
                                      <div className="img">
                                        <img src={el.Extra1 ? el.Extra1 : globalFileServer + 'placeholder.jpg'} />
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex-container col-lg-2 united-cls">
                                    <div className="col-lg-5 col-prod-catalog">
                                      <div className="wrapp title">
                                        <p>{el.CatalogNum}</p>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex-container col-lg-3 col-title-cont">
                                    <div className="col-lg-5 col-title">
                                      <div className="wrapp title">
                                        <p>{el.ProdName}</p>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-lg-2 col-prod-quan">
                                    <div className="wrapp comment">
                                      <p className="ltr">{el.Quantity}</p>
                                    </div>
                                  </div>
                                  <div className="col-lg-2 col-prod-ttlprice">
                                    <div className="wrapp">
                                      <p className="ltr">{el.Total}</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            );
                          }):null}
                        </div>
                      </div>
                    );
                })}
                {this.state.tempItems.length ?
                  <div className="devide-rec-main">
                    <div className="devide-rec-sub">
                      <p>מסמכים</p>
                    </div>
                  </div>
                :null}
                {this.state.tempItems.map((element, index) => {
                  if (index < this.state.toShow * this.state.currentPage && index >= (this.state.currentPage - 1) * this.state.toShow) {

                    let tmpDate="";
                    if(element.shippedDate){
                      tmpDate = String(element.shippedDate);
                      tmpDate =  tmpDate.substring(6,8) + "/" + tmpDate.substring(4,6) + "/" +tmpDate.substring(0,4);
                    }

                    return(
                      <div key={index} className={this.state.activeOrder == element.invoiceId ? "item active" : "item"}>
                        <div className="flex-container body-main-cls">
                          <div className="col-lg-1 col-drop" onClick={this.setActiveOrder.bind(this, element.invoiceId)}>
                            <div className="wrapp">
                              <div className="img">
                                {this.state.activeOrder == element.invoiceId ?
                                  <img src={globalFileServer + 'icons/up-purple.svg'} alt=""/>
                                  :
                                  <img src={globalFileServer + 'icons/down-purple.svg'} alt=""/>
                                }
                              </div>
                            </div>
                          </div>
                          <div className="col-lg-1 col-id" onClick={this.setActiveOrder.bind(this, element.invoiceId)}>
                            <div className="wrapp">
                              <p>{element.invShortId}</p>
                            </div>
                          </div>


                          <div className="col-lg-2 col-valDate" onClick={this.setActiveOrder.bind(this, element.invoiceId)}>
                            <div className="wrapp">
                              <p>{tmpDate}</p>
                            </div>
                          </div>
                          <div className="col-lg-2 col-docNum" onClick={this.setActiveOrder.bind(this, element.invoiceId)}>
                            <div className="wrapp">
                              <p>{element.shipmentId}</p>
                            </div>
                          </div>
                          <div className="col-lg-1 col-sum1 comm" onClick={this.setActiveOrder.bind(this, element.invoiceId)}>
                            <div className="wrapp">
                              <p>{element.hnCommercial ? parseFloat(element.hnCommercial).toFixed(2) : '-'}</p>
                            </div>
                          </div>


                          <div className="col-lg-1 col-sum1 sum2" onClick={this.setActiveOrder.bind(this, element.invoiceId)}>
                            <div className="wrapp">
                              <p>{parseFloat(element.totalmaam).toFixed(2)}</p>
                            </div>
                          </div>

                          <div className="col-lg-1 col-sum1 sum3" onClick={this.setActiveOrder.bind(this, element.invoiceId)}>
                            <div className="wrapp">
                              <p>{parseFloat(element.ordTotal).toFixed(2)}</p>
                            </div>
                          </div>


                          <div className="col-lg-1 col-approved col-status">
                            <div className="wrapp">
                              <p className='Active'>{element.invTypeTitle}</p>
                            </div>
                          </div>
{/*
                          <div className="col-lg-1 new-cart">
                            <button onClick={()=> this.payCredit()}>
                              <img src={globalFileServer + "icons/credit.svg"} alt=""/>
                              <span>תשלום</span>
                            </button>
                          </div>
*/}
                        </div>
                        <div className="products">
                          <div className="heading heading-prod">
                            <div className="flex-container heading-prod-cont">
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
                                <div className="wrapp title">
                                  <p>מוצר</p>
                                </div>
                              </div>

                              <div className="col-lg-2">
                                <div className="wrapp">
                                  <p>כמות</p>
                                </div>
                              </div>
                              <div className="col-lg-2">
                                <div className="wrapp">
                                  <p>סה״כ לפני מע״מ</p>
                                </div>
                              </div>

                            </div>
                          </div>
                          {element.Products ? element.Products.map((el, ind) => {
                            return(
                              <div key={ind} className="product">
                                <div className="flex-container row-cls">
                                  <div className="col-lg-1 col-prod-img">
                                    <div className="wrapp">
                                      <div className="img">
                                        <img src={el.Extra1 ? el.Extra1 : globalFileServer + 'placeholder.jpg'} />
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex-container col-lg-2 united-cls">
                                    <div className="col-lg-5 col-prod-catalog">
                                      <div className="wrapp title">
                                        <p>{el.item}</p>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="flex-container col-lg-3 col-title-cont">
                                    <div className="col-lg-5 col-title">
                                      <div className="wrapp title">
                                        <p>{el.Title}</p>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-lg-2 col-prod-quan">
                                    <div className="wrapp comment">
                                      <p className="ltr">{el.shippedQty}</p>
                                    </div>
                                  </div>
                                  <div className="col-lg-2 col-prod-ttlprice">
                                    <div className="wrapp">
                                      <p className="ltr">{el.neto}</p>
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
			</div>
		)
	}
}
