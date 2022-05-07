import React, { Component, Fragment } from 'react';
import { NavLink } from "react-router-dom";
import SearchProd from '../../tools/SearchProd';
import Calendar from 'react-calendar';
import SweetAlert from 'sweetalert2';

let appState;

export default class ChecksPopUP extends Component {
	constructor(props){
		super(props);
		this.state = {
      extId: "",
      items:[],
      Price: 0
    }
    this.getChecks = this.getChecks.bind(this);
	}

  componentDidMount(){
    if(this.props.state.popAction == "cheq"){
      this.getChecks();
    }else if(this.props.state.popAction == "payment"){
      let Price = Math.abs(parseFloat(this.props.state.userInfo.Balance).toFixed(2));
      this.setState({Price})
    }
	}
  getChecks() {

    let user = JSON.parse(localStorage.getItem('user'));

    let val = {
      sess_id: localStorage.sessionId,
      token: localStorage.token,
      id: user.Id,
      ext_id: user.ExId,
      action: "cheqs"
    };
    $.ajax({
      url: globalServer + 'new-api/docs.php',
      type: 'POST',
      data: val,
    }).done(function(data) {

      let items = JSON.parse(data);
      if(items.result = "success"){
        let tmpItems = JSON.parse(items.items);
        this.setState({items:tmpItems, preload: false});
      }
    }.bind(this)).fail(function() {
      console.log("error");
      this.setState({preload:false});

    }.bind(this));
  }

  changeValue(params, e){
    this.setState({[params]:e.target.value});
  }
	render(){
		return(
			<div className="wrapper">
        <div className="ChecksPopUP">
          {this.props.state.popAction && this.props.state.popAction == "cheq" ?
            <div className="list-main-cont">
              <div className="heading flex-container">
                <div className="col-lg-3">
                  <p>תאריך</p>
                </div>
                <div className="col-lg-3 center">
                  <p>מס'</p>
                </div>
                <div className="col-lg-3 center">
                  <p>חשבון</p>
                </div>
                <div className="col-lg-3 center">
                  <p>סה״כ</p>
                </div>
              </div>
              <div className="all-list-cont">
                {this.state.items && this.state.items.length>0 ? this.state.items.map((element,index) => {
                  let tmpDate = element.ValueDate.substring(0,10);
                  tmpDate = tmpDate.split("-");
                  tmpDate = tmpDate[2]+"/"+tmpDate[1]+"/"+tmpDate[0];
                  return(
                    <div key={index} className="list-sub-cont flex-container">
                      <div className="col-lg-3">
                        <p>{tmpDate}</p>
                      </div>
                      <div className="col-lg-3">
                        <p>{element.CheqNumber}</p>
                      </div>
                      <div className="col-lg-3">
                        <p>{element.BankAccNum}</p>
                      </div>
                      <div className="col-lg-3">
                        <p>{parseFloat(element.SuF).toFixed(2)}</p>
                      </div>
                    </div>
                  )
                }):null}
              </div>
            </div>
          :null}
          {this.props.state.popAction && this.props.state.popAction == "payment" ?
          <div className="list-main-cont">
            <div className="heading-payment">
            <div className="all-row-cont">
              <div className="flex-container row-cont">
                <div className="col-lg-4">
                  <p>סה״כ לתשלום</p>
                </div>
                <div className="col-lg-8">
                  <input
                    type="text"
                    value={this.state.Price}
                    onChange={this.changeValue.bind(this,"Price")}
                  />
                </div>
              </div>
              <div className="btn-container">
                <div onClick = {this.props.goToTranzillaFunc.bind(this, this.state.Price)} className="add-sale-btn">
                  <p>תשלום</p>
                </div>
              </div>
            </div>
            </div>
          </div>
          :null}
        </div>
			</div>
		);
	}
}
