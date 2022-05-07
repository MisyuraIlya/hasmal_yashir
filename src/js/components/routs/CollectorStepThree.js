import ReactDOM from "react-dom";
import React, { Component, Fragment } from 'react';
import { NavLink } from "react-router-dom";
import SweetAlert from 'sweetalert2';
import Calendar from 'react-calendar';
import DepartmentPop from "./productPage/DepartmentPop";


export default class CollectorStepThree extends Component {
	constructor(props){
		super(props);
		this.state = {
			date: localStorage.date ? new Date(localStorage.date) : new Date(),
			orders: [],
			messagePopup: false,
			showCalendar: false,
      preload: false,
      deptPop: false,
      deptsMainObj:[],
      deptsChildObj:[],
      chosenMainDept:false,
      finalDeptObj:[],
      chosenOrder:false
		}
    this.selectDate = this.selectDate.bind(this);

		this.getOrders = this.getOrders.bind(this);
		this.updateItem = this.updateItem.bind(this);
	}
	componentDidMount(){
		setTimeout(() => {window.scrollTo(0, 0)}, 200);
		let date = this.state.date.toLocaleDateString('he-IL').split('.').join('/');
		this.getOrders(date);
	}
  selectDate(){
		this.setState({showCalendar: true});
	}
  calendarChange(date){
		localStorage.setItem('date', date);
		this.setState({ date, showCalendar: false, ready: false });
		this.getOrders(date.toLocaleDateString('he-IL').split('.').join('/'));
	}
	updateItem(id, paramName, e){
		let orders = this.state.orders;
		orders.find(x => x.Id == id)[paramName] = e.target.value;
		this.setState({orders});
	}
	editItem = async(id, paramName, e)=>{

    const valAjax = {
      funcName: 'editUniqueOrders',
      point: 'orders',
      itemId: id,
      paramName: paramName,
      value: e.target.value,
      user:[]
    };

    try {
      const data = await this.props.ajax(valAjax);

    } catch(err) {
      console.log('connection error addItem');
    }

	}
	getOrders = async(date)=>{

    this.setState({preload: true})
    var cur_date = date.split("/");
    date = cur_date[2] + "-" + (("0"+ (cur_date[1])).slice(-2))  + "-" + (("0"+ (cur_date[0])).slice(-2))  + " 00:00:00.000";

    let user = false;
		localStorage.user ? user = JSON.parse(localStorage.user) : user = false;

    const valAjax = {
      funcName: 'getOrdersPerDepartmentsAndDistribution',
      point: 'orders',
      date: date,
      userId: user ? user.Id : false
    };
    try {
      const data = await this.props.ajax(valAjax);

      let orders = JSON.parse(data.orders);

      if(orders){


        let deptsMainObj = data.deptsMain;
        let deptsChildObj = data.deptsChild;
        if(user){
          user = JSON.parse(data.user);
        }
        let finalDeptObj = [];
        let userDeptsMain = [];

        orders.map((item) => {
          item.ProdCount = JSON.parse(item.ProdCount);
        })

        if(user){
          if(user.Department!=""){
            if(user.Department.includes(",")){
              userDeptsMain = user.Department.split(",");
            }else{
              userDeptsMain.push(user.Department);
            }
          }


          userDeptsMain.map((item) => {
            deptsMainObj.map((item2) => {
              if(item2.Id == item){
                finalDeptObj.push(item2);
              }
            })
          })

          finalDeptObj.map((item) => {
            deptsChildObj.map((item2) => {
              if(parseInt(item2.DeptId) == item.Id){
                if(!item.Children){
                  item.Children = [];
                }
                item.Children.push(item2);
              }
            })
          })
          this.setState({orders, user, finalDeptObj});


        }else{
          this.setState({orders});
        }


        if (localStorage.scrollTo) {
          let scrollTo = localStorage.scrollTo;
          localStorage.removeItem('scrollTo');
          setTimeout(() => {
            let element = document.getElementById('item_' + scrollTo);
            element.scrollIntoView({block: "center"});
          }, 50);
        }
      }

      this.setState({preload: false})

    } catch(err) {
      this.setState({preload: false})
      console.log('connection error getOrdersPerDepartmentsAndDistribution');
    }


	}
  ordDoneFunc(id){
    this.setState({preload: true})


    SweetAlert({
      title: 'האם אתה בטוח?',
      text: 'המשרד יקבל התראה על סיום הליקוט',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#22b09a',
      cancelButtonColor: '#d80028',
      confirmButtonText: 'אשר',
      cancelButtonText: 'בטל'
    }).then(function(res) {
      if (res.value) {
        let val = {
    			'funcName': 'setOrderDone',
    			'id': id
    		};

        const valAjax = {
          funcName: 'setOrderDone',
          point: 'orders',
          id: id
        };

        this.ordDoneFuncAjax(valAjax, id);

      }else{
        this.setState({preload: false})
      }
    }.bind(this)).catch(SweetAlert.noop);


  }

  ordDoneFuncAjax = async(valAjax, id) =>{

    try {
      const data = await this.props.ajax(valAjax);

      let orders = this.state.orders;
      orders.find(item => item.ID == id).CommentCollector = "1";

      this.setState({preload: false, orders})

    } catch(err) {
      this.setState({preload: false})
      console.log('connection error ordDoneFuncAjax');
    }
  }

  chooseOrderFunc = (id) => {
    //{/*<NavLink to={'/collector-step-four/' + element.ID}>*/}
    if(localStorage.role){
      this.props.history.push('/admin-collector-step-four/'+id);
    }else{
      this.setState({deptPop:true, chosenOrder: id});

    }
  }

	render(){
		return (
  			<div className="step-three">
        {this.state.preload ?
					<div className="spinner-wrapper">
						<div className="spinner">
							<div className="bounce1"></div>
							<div className="bounce2"></div>
							<div className="bounce3"></div>
						</div>
					</div>
				: null}

        {this.state.deptPop ? ReactDOM.createPortal(
          <div className="my-modal prod-info">
            <div className="modal-wrapper animated DepartmentPop-modal">
              <div className="close-cont">
                <div onClick={() => this.setState({deptPop: !this.state.deptPop})} className="close">
                  <img src={globalFileServer + 'icons/close.svg'} />
                </div>
              </div>
              <DepartmentPop {...this} />
            </div>
            <div onClick={this.close} className="overflow"></div>
          </div>,
          document.getElementById('modal-root')
        ) : null}


        <Calendar
          onChange={(date) => this.calendarChange(date)}
          value={this.state.date}
          calendarType="Hebrew"
          locale="he-IL"
          className={this.state.showCalendar ? 'active' : null}
        />

        <div className="title-cont">
            <div onClick={()=> this.getOrders(this.state.date.toLocaleDateString('he-IL').split('.').join('/'))} className="refresh-btn">
              <img src={globalFileServer + 'icons/menu/sync.svg'} />
            </div>
				    <h1 className="emp-app-title">בחר הזמנה</h1>
            <div className="open-calendar">
              <button onClick={this.selectDate}>
                <img src={globalFileServer + 'icons/calendar.svg'} alt=""/>
                <span>{this.state.date.toLocaleDateString('he-IL').split('.').join('/')}</span>
              </button>
            </div>
        </div>
				<div className="container">
					<div className="items">
						{this.state.orders.map((element, index) => {
              let time;
              if(element.Date){
                time = element.Date.split(" | ");
                time = time[1].substring(0, time[1].length - 3);
              }
							return(
								<div key={index} id={"item_" + element.ID} className="item">
									<div className="wrapper">
                    {!element.CommentCollector && element.ordActive && element.Status != '1'?
                      <div className={element.Remarks ? "done-btn left": "done-btn"}>
                        <p onClick={this.ordDoneFunc.bind(this,element.ID)}>סיום</p>
                      </div>
                    :null}
										{/*<NavLink to={'/collector-step-four/' + element.ID}>*/}
                    <div onClick={()=> this.chooseOrderFunc(element.ID)}>
											<div className="heading">
												<h2>{element.AccountName}</h2>
												<p>{"# " + element.ID}</p>
                        <p>{time}</p>
                        {/*element.ReadyQuantity + " / " + */}
												<div className="count">
													<p>{element.ProdCount[0].prodCount}</p>
												</div>
                        {element.Status == '1' ?
                        <div className="isOrdActive">
                          <p className="ordDone status">{"הופק"}</p>
                        </div>
                        :null}
                        {element.ordActive ?
                          <div className="isOrdActive">
                            {/*
                            {parseInt(element.ReadyQuantity) != element.ProdCount[0].prodCount ?
                              <p>{"בליקוט"}</p>
                            :null}
                            */}

                            {element.CommentCollector && element.Status != '1' ?
                              <p className="ordDone">{"לוקט"}</p>
                            :null}
                            {!element.CommentCollector && element.Status != '1' ?
                              <p className="ordDone in-process">{"בליקוט"}</p>
                            :null}

  												</div>
                        :null}
											</div>
                    </div>
										{/*</NavLink>*/}
                    {element.Remarks ?
  										<button className={"active"} onClick={() => this.setState({messagePopup: element.ID})}>
  											<span className={"icon active"}></span>
  											<span>הערות</span>
  										</button>
                    :null}
										{this.state.messagePopup == element.ID ?
											ReactDOM.createPortal(
												<div className="popup write-message">
													<div className="popup-wrapper">
														<div onClick={() => this.setState({messagePopup: false})} className="close-popup">
															<img src={globalFileServer + 'icons/close.svg'} alt="" />
														</div>
														<div className="wrapp">
															{element.Remarks ? <p>הערות מנהל</p> : null}
															<textarea disabled
																value={element.Remarks ? element.Remarks : ''}
																placeholder="הערות מנהל"
																onChange={this.updateItem.bind(this, element.Id, 'CommentAdmin')}
																onBlur={this.editItem.bind(this, element.Id, 'CommentAdmin')}
															/>
                              {!localStorage.user ?
                                <div>
                                  <p>מלקטים:</p>
                                  {element.Melaktim && element.Melaktim.length ? element.Melaktim.map((item) => {
                                    return(
                                      <p>{item.Melaket}</p>
                                    )
                                  }):null}
                                </div>
                              :null}
														</div>


													</div>
												</div>,
												document.getElementById('modal-root')
											)
										: null}
									</div>
								</div>
							);
						})}
					</div>
				</div>
			</div>
		)
	}
}
