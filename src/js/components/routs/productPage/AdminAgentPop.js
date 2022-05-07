import React, { Component, Fragment } from 'react';
import { NavLink } from "react-router-dom";
import Calendar from 'react-calendar';
import SweetAlert from 'sweetalert2';

let appState;

export default class AdminSalesPop extends Component {
	constructor(props){
		super(props);
		this.state = {
      selectedAgent:[],
      date: new Date(),
      prevDate: "",
      forUnitArr: [],
      toUnitArr: []
    }
    this.saveAgent = this.saveAgent.bind(this);


	}
	componentDidMount(){
    if(this.props.state.selectedAgent){
      let selectedAgent = JSON.stringify(this.props.state.selectedAgent);
      selectedAgent = JSON.parse(selectedAgent);

      this.setState({selectedAgent})
    }else{
      let selectedAgent = {
        'ExId': "",
        'Id': null,
        'Mail': "",
        'Name': "",
        'Password': "",
        'Token': null,
        'Unpublished': null,
        'Super': null
      };
      this.setState({selectedAgent});
    }

	}
  changeValue(params,e){
    let selectedAgent = this.state.selectedAgent;
    selectedAgent[params] = e.target.value;
    this.setState({selectedAgent});

  }



  saveAgent(){

    let selectedAgent = this.state.selectedAgent;

    let allAgents = this.props.state.items;
    if(selectedAgent.ExId!=""){
      let dublicate = allAgents.filter((item) => {return item.ExId == selectedAgent.ExId && item.Id != selectedAgent.Id})
    //  debugger;

      if(dublicate.length==0){
        if(selectedAgent.Mail != "" && selectedAgent.Password != "" && selectedAgent.Name != ""){
          this.props.saveAgent(selectedAgent);
        }else{
          SweetAlert({
            title: 'חסרים נתונים',
            type: 'info',
            showConfirmButton: false,
            timer: 4000
          }).catch(SweetAlert.noop);
        }
      }else{
        SweetAlert({
          title: "מס' פנימי קיים ואינו יכול לחזור על עצמו",
          type: 'info',
          showConfirmButton: false,
          timer: 4000
        }).catch(SweetAlert.noop);
      }
    }else{
      SweetAlert({
        title: "אנא הזן מס' פנימי של תוכנת הנהחש",
        type: 'info',
        showConfirmButton: false,
        timer: 4000
      }).catch(SweetAlert.noop);
    }


  }

  togglePerm(val){
    let selectedAgent = this.state.selectedAgent;
    selectedAgent.Super = val;
    this.setState({selectedAgent});

  }
	render(){
		return(
			<div className="wrapper admin-agent-pop">
        <div className="agent-main-cont">
          <div className="all-row-cont">
            <div className="flex-container row-cont">
              <div className="col-lg-4">
                <p>מס' פנימי</p>
              </div>
              <div className="col-lg-8">
                <input
                  type="text"
                  value={this.state.selectedAgent.ExId}
                  onChange={this.changeValue.bind(this,"ExId")}
                />
              </div>
            </div>

            <div className="flex-container row-cont">
              <div className="col-lg-4">
                <p>שם משתמש</p>
              </div>
              <div className="col-lg-8">
                <input
                  type="text"
                  value={this.state.selectedAgent.Mail}
                  onChange={this.changeValue.bind(this,"Mail")}
                />
              </div>
            </div>

            <div className="flex-container row-cont">
              <div className="col-lg-4">
                <p>סיסמה</p>
              </div>
              <div className="col-lg-8">
                <input
                  type="text"
                  value={this.state.selectedAgent.Password}
                  onChange={this.changeValue.bind(this,"Password")}
                />
              </div>
            </div>

            <div className="flex-container row-cont">
              <div className="col-lg-4">
                <p>שם הסוכן</p>
              </div>
              <div className="col-lg-8">
                <input
                  type="text"
                  value={this.state.selectedAgent.Name}
                  onChange={this.changeValue.bind(this,"Name")}
                />
              </div>
            </div>

            <div className="flex-container row-cont toggle-cont">
              <div className="col-lg-4">
                <p>הרשאות</p>
              </div>
              <div className="col-lg-4 toggle">
                <p onClick={this.togglePerm.bind(this,null)} className={!this.state.selectedAgent.Super ? "active" : null}>רגיל</p>
              </div>
              <div className="col-lg-4 toggle master">
                <p onClick={this.togglePerm.bind(this,'1')} className={this.state.selectedAgent.Super ? "active" : null}>מנהל</p>
              </div>
            </div>

            <div className="btn-container">
              <div onClick = {this.saveAgent.bind(this)} className="add-sale-btn">
                <p>שמור</p>
              </div>
            </div>

          </div>

        </div>

			</div>
		);
	}
}
