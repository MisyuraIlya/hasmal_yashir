import ReactDOM from "react-dom";
import React, { Component, Fragment } from 'react';
import AdminAgentPop from "./productPage/AdminAgentPop";
import SweetAlert from 'sweetalert2';


export default class AdminAgent extends Component {
	constructor(props){
		super(props);
		this.state = {
			items: [],
      tempItems: [],
			preload: false,
      agentPop: false
		}
		this.getItems = this.getItems.bind(this);
    this.closeAdminPop = this.closeAdminPop.bind(this);
    this.saveAgent = this.saveAgent.bind(this);

	}
	componentDidMount(){
	   this.getItems(this.state.saleType);
	}

  getItems(saleType){
    let action = "view";
		let val = {
			token: localStorage.token,
			role: localStorage.role,
      action: action
		};

		$.ajax({
			url: globalServer + 'new-api/admin-agents.php',
			type: 'POST',
			data: val,
		}).done(function(data) {
      if(JSON.parse(data).result = "success"){
        let items = JSON.parse(data).agents.Agents

        items.map((item) => {
          item.More = false;
        })
        //debugger;
        this.setState({items});
      }
		}.bind(this)).fail(function() {	console.log("error"); });
	}

  saveAgent(selectedAgent){
    let action;
    if(selectedAgent.Id){
      action = "update";
    }else{
      action = "insert";
    }

		let val = {
			token: localStorage.token,
			role: localStorage.role,
      action: action,
      selectedAgent: JSON.stringify(selectedAgent)
		};
    $.ajax({
			url: globalServer + 'new-api/admin-agents.php',
			type: 'POST',
			data: val,
		}).done(function(data) {
      if(JSON.parse(data).result == "success"){
        let items = this.state.items;
        if(selectedAgent.Id){
          items.map((ele,ind) => {
            if(ele.Id == selectedAgent.Id){
              items[ind] = selectedAgent;
            }
          })
        }else{
          selectedAgent.Id = JSON.parse(data).id;
          items.unshift(selectedAgent);
        }
        this.setState({items , agentPop: false, selectedAgent:false});
      }else{
        this.setState({agentPop: false, selectedAgent:false});
      }
		}.bind(this)).fail(function() {	console.log("error"); });


  }


  closeAdminPop(){
    this.setState({agentPop:false, selectedAgent:false});
  }
  openAgentPop(element){
    let items = this.state.items;
    items.find(item => item.Id == element.Id).More = false;

    this.setState({selectedAgent: element, agentPop:true, items})
  }

  deleteItem(id){
    let items = this.state.items;
    items.find(item => item.Id == id).More = false;

    this.setState({items})

		SweetAlert({
			title: 'האם אתה בטוח?',
			text: 'האם ברצונך למחוק פריט זה? לא תוכל לשחזר זאת!',
			type: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#22b09a',
			cancelButtonColor: '#d80028',
			confirmButtonText: 'מחק',
			cancelButtonText: 'בטל'
		}).then(function(id, res) {
			if (res.value) {
        let action = 'delete';
				let val = {
					token: localStorage.token,
					role: localStorage.role,
					itemId: id,
					action: action
				};
				$.ajax({
					url: globalServer + 'new-api/admin-agents.php',
					type: 'POST',
					data: val,
				}).done(function(data) {
					if (JSON.parse(data).result == "success") {
            let items = this.state.items;
            items = items.filter((item) => {return item.Id != id});
            this.setState({items});
					}
				}.bind(this)).fail(function() {	console.log("error"); });
			} else {
				//this.unsetPreload();
			}
		}.bind(this, id)).catch(SweetAlert.noop);
	}
  changeMoreVal(id,val){
    let tmpUsers = this.state.items;
    //userListAll
    tmpUsers.find(item => item.Id == id).More = val;
    this.setState({userList: tmpUsers})
  }
  unsetMore(itemId){
    let userList = this.state.userList;
    userList.find(item => item.Id == itemId).More = false;

    this.setState({userList });
  }

	render(){

		return (
			<div className="page-container history admin-agents">
        {this.state.agentPop ? ReactDOM.createPortal(
          <div className="my-modal prod-info">
            <div className="modal-wrapper animated">
              <div className="popup-contant-header flex-container">
                <div className="col-lg-10" >
                  <p>פרטי סוכן</p>
                </div>
                <div className="close-popup col-lg-2">
                  <div className="close-popup-cont" onClick={this.closeAdminPop}>
                    <img src={globalFileServer + 'icons/close_purple.svg'} />
                    </div>
                </div>
              </div>
              <AdminAgentPop {...this}/>
            </div>
            <div onClick={this.closeAdminPop} className="overflow"></div>
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
        <div className="admin-agents-subcont">

  				<h1 className="title">ניהול סוכנים</h1>
  				<div className={this.state.showCalendar ? 'container active' : 'container'}>
            <div className="filter flex-container">
              <div onClick = {()=> this.setState({agentPop:true})} className="add-sale-btn">
                <p>הוסף סוכן</p>
              </div>
            </div>

            <div className="items">
              <div className="heading">
                <div className="flex-container">
                  <div className="col-lg-2">
                    <div className="wrapp">
                      <p>שם</p>
                    </div>
                  </div>
                  <div className="col-lg-1">
                    <div className="wrapp">
                      <p>מס' פנימי</p>
                    </div>
                  </div>
                  <div className="col-lg-3">
                    <div className="wrapp">
                      <p>שם משתמש</p>
                    </div>
                  </div>
                  <div className="col-lg-2">
                    <div className="wrapp">
                      <p>סיסמה</p>
                    </div>
                  </div>

                  <div className="col-lg-2">
                    <div className="wrapp">
                      <p>מאסטר</p>
                    </div>
                  </div>
                  <div className="col-lg-2 center">
                    <div className="wrapp">
                      <p>פעולות</p>
                    </div>
                  </div>

                </div>
              </div>
              <div className="body">
                {!this.state.items.length ? <h1 className="no-products">לא קיימים סוכנים</h1> : null}
                {this.state.items.map((element, index) => {
                  return(
                    <div key={index} className={this.state.activeOrder == element.Id ? "item active" : "item"}>
                      <div className="flex-container">
                        <div className="col-lg-2 col-cls name-col">
                          <div className="wrapp">
                            <p>{element.Name}</p>
                          </div>
                        </div>
                        <div className="col-lg-1 col-cls extId-col">
                          <div className="wrapp">
                            <p>{element.ExId}</p>
                          </div>
                        </div>
                        <div className="col-lg-3 col-cls mail-col">
                          <div className="wrapp">
                            <p>{element.Mail}</p>
                          </div>
                        </div>

                        <div className="col-lg-2 col-cls pass-col">
                          <div className="wrapp">
                            <p>{element.Password}</p>
                          </div>
                        </div>

                        <div className="col-lg-2 col-cls status">
                          <div className="wrapp">
                            {!element.Super ? <p className='NotActive'>רגיל</p>:null}
                            {element.Super ? <p className='Active'>מנהל</p>:null}
                          </div>
                        </div>
                        {/*
                           onClick = {this.openAgentPop.bind(this, element)}
                        <div className="col-lg-2 col-cls delete center">
                          <div className="img" onClick={this.deleteItem.bind(this, element.Id)}>
                            <img src={globalFileServer + "icons/trash.svg"} alt=""/>
                          </div>
                        </div>
                        */}
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
                              <div className="flex-container row" onClick={this.openAgentPop.bind(this, element)}>
                                <div className="col-lg-2">
                                  <img src={globalFileServer + 'icons/wheel1.svg'} />
                                </div>
                                <div className="col-lg-10">
                                  <p>עדכן</p>
                                </div>
                              </div>
                              <div className="flex-container row" onClick={this.deleteItem.bind(this, element.Id)}>
                                <div className="col-lg-2">
                                  <img src={globalFileServer + 'icons/wheel1.svg'} />
                                </div>
                                <div className="col-lg-10">
                                  <p>מחק</p>
                                </div>
                              </div>
                            </div>
                          :null}
                        </div>
                      </div>
                    </div>
                  );

                })}
              </div>
            </div>
  				</div>
        </div>
			</div>
		)
	}
}
