import ReactDOM from "react-dom";

import React, { Component, Fragment } from 'react';
import DatePicker from 'react-datepicker';
import moment from 'moment';
import Calendar from 'react-calendar';
import SearchProd from '../tools/SearchProd';
import AdminSalesPop from "./productPage/AdminSalesPop";
import SweetAlert from 'sweetalert2';




export default class AdminSales extends Component {
	constructor(props){
		super(props);
		this.state = {
			preload: false,
			search: false,
      monthArr:[],
      yearArr:[],
      selectedMonth:0,
      selectedYear:2,
      filterSales:[],
      allSales: []
		}

	}
	componentDidMount(){

     let monthArr = [{Id:1,Title:"ינואר"},
                     {Id:2,Title:"פברואר"},
                     {Id:3,Title:"מרץ"},
                     {Id:4,Title:"אפריל"},
                     {Id:5,Title:"מאי"},
                     {Id:6,Title:"יוני"},
                     {Id:7,Title:"יולי"},
                     {Id:8,Title:"אוגוסט"},
                     {Id:9,Title:"ספטמבר"},
                     {Id:10,Title:"אוקטובר"},
                     {Id:11,Title:"נובמבר"},
                     {Id:12,Title:"דצמבר"},

                   ];

     let yearArr = [{Id:1,Title:"2020"},
                     {Id:2,Title:"2021"},
                     {Id:3,Title:"2022"},
                     {Id:4,Title:"2023"},
                     {Id:5,Title:"2024"},
                     {Id:6,Title:"2025"}
                   ];

     this.setState({monthArr, yearArr})

     setTimeout(() => {
       let elementYear = document.getElementById('yearPicker');
       elementYear.value = 2;
     }, 100);


	}


  updateInput = (value, id, paramName, title ) =>{

    let action;
    this.state.saleType == 1 ? action = "edit_saleType1" : action = "edit_saleType2";
		let val = {
			token: localStorage.token,
			role: localStorage.role,
      saleType: this.state.saleType,
      action: action,
      id: id,
      paramName: paramName,
      val: value
		};

		$.ajax({
			url: globalServer + 'new-api/admin-sales.php',
			type: 'POST',
			data: val,
		}).done(function(data) {

      //if(JSON.parse(data).result == "success"){

        let items = this.state.items;
        items.find(x => x.Id == id)[paramName] = value;
        if(title){
          items.find(x => x.Id == id)['ForTitle'] = title
        }
        this.setState({items});
      //}
		}.bind(this)).fail(function() {	console.log("error"); });

  }

  lastday = function(y,m){
  return  new Date(y, m +1, 0).getDate();
  }

  searchSales = async () =>{

    this.setState({preload: true});
    let selectedYear = this.state.yearArr.filter((item) => {return item.Id == this.state.selectedYear})[0].Title;
    var lastDate = this.lastday(parseInt(selectedYear),parseInt(this.state.selectedMonth)-1)

    let fromDate = selectedYear + "-" + (("0"+ (this.state.selectedMonth)).slice(-2))  + '-' + '01';
    let toDate = selectedYear + "-" + (("0"+ (this.state.selectedMonth)).slice(-2)) + '-' + lastDate;


    let val ={
      fromDate: fromDate,
      toDate: toDate,
    };

    const valAjax = {
      funcName: 'getSaleAdmin',
      point: 'products_on_sale_per_user',
      val: val
    };

    try {
      const data = await this.props.ajax(valAjax);
      let sales = JSON.parse(data.sales);

      sales = this.orderFuncSales(sales);
      this.setState({ filterSales: sales, allSales:sales });
      this.setState({preload: false});


    } catch(err) {
      //this.props.connectionError('connection error GetSales');
      console.log('connection error GetSales');
      this.setState({preload:false});
    }

  }

  orderFuncSales = (sales) => {

    sales = sales.sort(function (a, b) {
        return a.PageNum - b.PageNum || a.Orden - b.Orden;
    });

    return sales;
  }

  editItem = async(value, id, param) => {

    let allSales = this.state.allSales;
    allSales.find(x => x.Id == id)[param] = value;
    //let allSales = this.orderFuncSales(tempItems);


    let filterSales = this.state.filterSales;
    filterSales.find(x => x.Id == id)[param] = value;
    //let filterSales = this.orderFuncSales(tempItems);

    this.setState({allSales, filterSales});

    let val ={
      id: id,
      param: param,
      stringVal:value
    };

    const valAjax = {
      funcName: 'editSaleAdmin',
      point: 'products_on_sale_per_user',
      val: val
    };

    try {
      const data = await this.props.ajax(valAjax);


    } catch(err) {
      //this.props.connectionError('connection error GetSales');
      console.log('connection error GetSales');
      this.setState({preload:false});
    }

	}

  updateItems = (value, id, param) => {
    let allSales = this.state.allSales;
    allSales = this.orderFuncSales(allSales);

    let filterSales = this.state.filterSales;
    filterSales = this.orderFuncSales(filterSales);

    this.setState({allSales, filterSales});

  }


  selectMonth = (event)=>{
    let tmpMonth = parseInt(event.target.value);
    this.setState({selectedMonth: tmpMonth});
  }

  selectYear = (event) =>{
    let tmpYear = event.target.value;
    this.setState({selectedYear:tmpYear});
  }

  sortItems = (e) => {

    let val = e.target.value.toLowerCase();
    this.setState({search: val});

    if(val!=""){
      let items = this.state.allSales.filter(item => item.ForCatalogNum.toLowerCase().includes(val));
      this.setState({filterSales:items});
    }else{
      this.setState({search: false, filterSales: this.state.allSales});
    }
  }





	render(){

		return (
			<div className="page-container history admin-history admin-sales">
        {this.state.salesPop ? ReactDOM.createPortal(
          <div className="my-modal prod-info">
            <div className="modal-wrapper animated returns">
              <div className="popup-contant-header flex-container">
                <div className="col-lg-10" >
                  <p>מוצרים לזיכוי</p>
                </div>
                <div className="close-popup col-lg-2">
                  <div className="close-popup-cont" onClick={this.closeSalePop}>
                    <img src={globalFileServer + 'icons/close_purple.svg'} />
                    </div>
                </div>
              </div>
              <AdminSalesPop {...this}/>
            </div>
            <div onClick={this.closeSalePop} className="overflow"></div>
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
				<h1 className="title">ניהול מבצעים</h1>

				<div className={this.state.showCalendar ? 'container active' : 'container'}>
          <div className="filter flex-container">
            <select id="monthPicker" className="col-lg-1" onChange={this.selectMonth}>
              {this.state.monthArr.map((element, index) => {
                return (
                  <option key={index} id={element.Id} value={element.Id}>{element.Title}</option>
                )
              })}
            </select>

            <select id="yearPicker" className="col-lg-1" onChange={this.selectYear}>
              {this.state.yearArr.map((element, index) => {
                return (
                  <option key={index} id={element.Id} value={element.Id}>{element.Title}</option>
                )
              })}
            </select>
            <div className="btn-cont">
              <p onClick={()=> this.searchSales()}>חיפוש</p>
            </div>

            <div className="search">
              <input
                type="text"
                value={this.state.search ? this.state.search : ''}
                onChange={this.sortItems}
                placeholder="חפש מקט..."
              />
              {!this.state.search ?
                <img src={globalFileServer + 'icons/search-gray.svg'} alt=""/>
              :
              <img onClick={() => this.setState({search: false, filterSales: this.state.allSales})} src={globalFileServer + 'icons/close.svg'} alt=""/>
              }
            </div>
          </div>
          <div className="items">
            <div className="heading">
              <div className="flex-container">
                <div className="col-lg-2">
                  <div className="wrapp">
                    <p>תאריך</p>
                  </div>
                </div>
                <div className="col-lg-2">
                  <div className="wrapp">
                    <p>תמונה</p>
                  </div>
                </div>

                <div className="col-lg-2">
                  <div className="wrapp">
                    <p>מק״ט</p>
                  </div>
                </div>
                <div className="col-lg-3">
                  <div className="wrapp">
                    <p>תיאור</p>
                  </div>
                </div>
                <div className="col-lg-1">
                  <div className="wrapp">
                    <p>עמוד</p>
                  </div>
                </div>
                <div className="col-lg-1">
                  <div className="wrapp">
                    <p>סדר</p>
                  </div>
                </div>

              </div>
            </div>
            <div className="body">
              {!this.state.filterSales.length ? <h1 className="no-products">לא קיימים מבצעים</h1> : null}
              {this.state.filterSales.map((element, index) => {
                let tmpDate = element.ValidDate.substring(0,10);
                tmpDate = tmpDate.split("-");
                tmpDate = tmpDate[2]+"/"+tmpDate[1]+"/"+tmpDate[0];
                return(
                  <div key={index} className={this.state.activeOrder == element.Id ? "item active" : "item"}>
                    <div className="flex-container row-cont">
                      <div className="col-lg-2 col-cls forTitle-col">
                        <div className="wrapp">
                          <p>{tmpDate}</p>
                        </div>
                      </div>
                      <div className="col-lg-2 col-cls forQuan-col">
                        <div className="wrapp">
                          <div className="img">
                            <img src={element.Extra1 ? element.Extra1 : globalFileServer + 'placeholder.jpg'} />
                          </div>
                        </div>
                      </div>

                      <div className="col-lg-2 col-cls toTitle-col">
                        <div className="wrapp">
                          <p>{element.ForCatalogNum}</p>
                        </div>
                      </div>
                      <div className="col-lg-3 col-cls toQuan-col">
                        <div className="wrapp">
                          <p>{element.Title}</p>
                        </div>
                      </div>
                      <div className="col-lg-1 col-cls dis-col">
                        <div className="wrapp">
                          <input
                            type="text"
                            placeholder="כמות"
                            value={element.PageNum}
                            onChange={(e) => this.editItem(e.target.value, element.Id, "PageNum")}
                            onBlur={(e) => this.updateItems(e.target.value, element.Id, "PageNum")}

                          />
                        </div>
                      </div>
                      <div className="col-lg-1 col-cls price-col">
                        <div className="wrapp">
                          <input
                            type="text"
                            placeholder="כמות"
                            value={element.Orden}
                            onChange={(e) => this.editItem(e.target.value, element.Id, "Orden")}
                            onBlur={(e) => this.updateItems(e.target.value, element.Id, "Orden")}

                          />
                        </div>
                      </div>
                    </div>
                  </div>
                );

              })}
            </div>
          </div>
				</div>
			</div>
		)
	}
}
