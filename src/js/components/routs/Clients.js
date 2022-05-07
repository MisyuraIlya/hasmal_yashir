import React, { Component } from 'react';
import Select from 'react-select';
import Autosuggest from 'react-autosuggest';
import {Helmet} from "react-helmet";
import SweetAlert from 'sweetalert2';

const getSuggestionValue = suggestion => suggestion.name;
const renderSuggestion = suggestion => (
	<div className="hello"><span>{suggestion.Name} / </span><span>{suggestion.ExId}</span></div>
);

export default class Clients extends Component {
	constructor(props){
		super(props);
		this.state = {
			activeTab: 'all',
			userList: [],
			userListAll: [],
			cources: [],
			preload: false,
			suggestions: [],
			users: [],
			value: '',
			toShow: 25,
			pCounter: [],
			pFrom: 0,
			pTo: 24,
			cFrom: 0,
			cTo: 5,
			showCources: null,
			userInfo: null,
			generatePassword: null,
      setupUser: null,
			toSend: null,
			newPassword: null,
			back: false,
      regProds:[],
      regProdsUser: false
		}
		this.getUsers = this.getUsers.bind(this);
		this.updateUserInfo = this.updateUserInfo.bind(this);
		this.getSuggestions = this.getSuggestions.bind(this);
		this.onSuggestionsFetchRequested = this.onSuggestionsFetchRequested.bind(this);
		this.onSuggestionsClearRequested = this.onSuggestionsClearRequested.bind(this);
		this.onSuggestionSelected = this.onSuggestionSelected.bind(this);
		this.onChange = this.onChange.bind(this);
		this.changeModel = this.changeModel.bind(this);
		this.UpPaggination = this.UpPaggination.bind(this);
		this.downPaggination = this.downPaggination.bind(this);
		this.resetCounter = this.resetCounter.bind(this);
	}
	componentDidMount() {
		this.getUsers();
	}
	onChange(event, { newValue }) {
		this.setState({	value: newValue	});
	}
	getSuggestions(value) {
		const inputValue = value.trim().toLowerCase();
		const inputLength = inputValue.length;

		let isNumber =  /^\d+$/.test(value);

		if (isNumber) {
			return inputLength === 0 ? [] : this.state.userList.filter(user =>
				user.ExId.toLowerCase().slice(0, inputLength) === inputValue
			);
		} else {
			return (
				inputLength === 0 ? [] : this.state.userList.filter(user => {
					if (user.Name.split(' ').length > 1) {
						return user.Name.split(' ')[0].toLowerCase().slice(0, inputLength) === inputValue
						||
						user.Name.split(' ')[1].toLowerCase().slice(0, inputLength) === inputValue
					} else {
						return user.Name.toLowerCase().slice(0, inputLength) === inputValue
					}
				})
			)
		}
	}
	onSuggestionsFetchRequested({ value }) {
		this.setState({	suggestions: this.getSuggestions(value)	});
	}
	onSuggestionsClearRequested() {
		this.setState({	suggestions: [], value: "" });
	}
	onSuggestionSelected(event, { suggestion, suggestionValue, suggestionIndex, sectionIndex, method }) {
		if (method == "click" || method == "enter") {
			let userList = this.state.userList.filter((elem) => { return elem.Id == suggestion.Id });
			//this.setState({userList, activeTab: false});
			this.setState({userList, back: true});
		}
	}
	updateUserList(type){

		this.state.back ? this.setState({back: false}) : null;
		this.resetCounter();
		let userList = [];
		let Userss = this.state.userListAll;
		switch (type) {
			case 'all':
				userList = Userss;
				this.setState({userList, activeTab: 'all', pCounter: Array.from(Array(Math.ceil(userList.length / this.state.toShow)).keys())});
			break;
			case 'b2b':
				userList = Userss.filter((element) => { return element.Type == 1});
				this.setState({userList, activeTab: 'b2b', pCounter: Array.from(Array(Math.ceil(userList.length / this.state.toShow)).keys())});
			break;
			case 'b2c':
				userList = Userss.filter((element) => { return element.Type == 2});
				this.setState({userList, activeTab: 'b2c', pCounter: Array.from(Array(Math.ceil(userList.length / this.state.toShow)).keys())});
			break;
		}
	}
	changeModel(itemId, text, paramName){
		let userList = this.state.userList;
		userList.find(x=> x.Id == itemId)[paramName] = text;
		this.setState({userList, preload: true});
		this.updateUserInfo(itemId, text, paramName);
	}
	changeType(itemId, e){
		let userList = this.state.userList;
		userList.find(x=> x.Id == itemId).Type = e.target.value;
		this.setState({userList, preload: true});
		this.updateUserInfo(itemId, e.target.value, 'Type');
		if (e.target.value == 'buyer') {
			this.updateUserInfo(itemId, null, 'CourseId');
		} else {
			this.updateUserInfo(itemId, null, 'PriceFor');
		}
	}
	changePrice(itemId, e){
		let userList = this.state.userList;
		userList.find(x=> x.Id == itemId).Price = e.target.value;
		this.setState({userList, preload: true});
		this.updateUserInfo(itemId, e.target.value, 'PriceFor');
	}
  resetUser(itemId){
    let userList = this.state.userList;
    userList.find(item => item.Id == itemId).More = false;

    this.setState({preload: false, userList});
    SweetAlert({
			title: 'אפס לקוח?',
			type: 'success',
			showConfirmButton: true,
      showCancelButton: true,
      confirmButtonText: 'אשר',
      cancelButtonText: 'בטל'
		}).then(function (res) {
      if (res.value) {

        const valAjax = {
          funcName: '',
          point: 'reset_user',
          id: itemId,
    			role: localStorage.role,
    			token: localStorage.token
        };

        this.resetUserFunc(valAjax, itemId);


      }
    }.bind(this)).catch(SweetAlert.noop);
  }

  resetUserFunc = async(valAjax, itemId)=>{

    try {
      const data = await this.props.ajax(valAjax);

      let userList = this.state.userList;
      userList.find(item => item.Id == itemId).Blocked = false;
      userList.find(item => item.Id == itemId).Registration = false;
      userList.find(item => item.Id == itemId).Mail = false;
      userList.find(item => item.Id == itemId).Password = false;
      userList.find(item => item.Id == itemId).More = false;

      this.setState({preload: false, userList});

    } catch(err) {
      console.log('connection error docs');
      this.setState({preload:false});
    }
  }

	updateUserInfo = async(itemId, text, paramName) =>{

    if(paramName == "Blocked"){
      text == null ?  text = "1" : text = null;
    }

		let val = {
			id: itemId,
			val: text,
			paramName: paramName,
		};

    const valAjax = {
      funcName: '',
      point: 'update_user',
      val: val,
      role: localStorage.role,
			token: localStorage.token
    };

    try {
      const data = await this.props.ajax(valAjax);

      let userList = this.state.userList;
      userList.find(item => item.Id == itemId).More = false;

      if(paramName == "Blocked"){
        userList.find(item => item.Id == itemId).Blocked = text;
      }
      if(paramName=="Password"){
        userList.find(item => item.Id == itemId).Password = this.state.newPassword;

      }
      this.setState({preload: false, userList,newPassword: false, generatePassword: false});

    } catch(err) {
      console.log('connection error docs');
      this.setState({preload:false});
    }


	}


	getUsers = async() => {

    const valAjax = {
      funcName: '',
      point: 'user_list',
      role: localStorage.role,
			token: localStorage.token
    };

    try {
      const data = await this.props.ajax(valAjax);

      let tmpUsers;
      tmpUsers = data.Userss;
      tmpUsers.map((item) => {
        item.More = false;
      })

			this.setState({userList: tmpUsers, userListAll: tmpUsers, activeTab: 'all', pCounter: Array.from(Array(Math.ceil(data.Userss.length / this.state.toShow)).keys())});
    } catch(err) {
      console.log('connection error docs');
      this.setState({preload:false});
    }


	}
	showPaggination(number) {
		let val = number * this.state.toShow;
		this.setState({
			cFrom: number,
			cTo: number + 5,
			pFrom: val,
			pTo: val + this.state.toShow
		});
		window.scrollTo(0, 0);
	}
	UpPaggination(){
		this.setState({
			cFrom: this.state.cFrom + 1,
			cTo: this.state.cTo + 1,
			pFrom: this.state.pFrom + this.state.toShow,
			pTo: this.state.pTo + this.state.toShow
		});
		window.scrollTo(0, 0);
	}
	downPaggination(){
		this.setState({
			cFrom: this.state.cFrom - 1,
			cTo: this.state.cTo - 1,
			pFrom: this.state.pFrom - this.state.toShow,
			pTo: this.state.pTo - this.state.toShow
		});
		window.scrollTo(0, 0);
	}
	toShow(num){
		let pCounter = Array.from(Array(Math.ceil(this.state.userList.length / num)).keys());
		this.setState({
			toShow: num,
			pCounter,
			pFrom: 0,
			pTo: num,
			cFrom: 0,
			cTo: 5
		});
		window.scrollTo(0, 0);
	}
	resetCounter(){
		this.setState({toShow: 25,pFrom: 0,pTo: 24,cFrom: 0,cTo: 5});
	}

	generatePassword() {
		let length = 5,
		charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
		retVal = "";
		for (var i = 0, n = charset.length; i < length; ++i) {
			retVal += charset.charAt(Math.floor(Math.random() * n));
		}
		return retVal;
	}
	sendMail(element){
		let pass = this.generatePassword();
		this.updateUserInfo(element.Id, pass, 'Password');
		let userList = this.state.userList;
		userList.find(x=> x.Id == element.Id).Password = pass;
		this.setState({newPassword: pass, userList});
		let val = {
			siteName: 'Lfa',
			from: 'shop@lfayou.co.il',
			to: this.state.toSend,
			contactName: element.Name,
			userName: element.Passport,
			name: pass
		};
		$.ajax({
			url: 'https://statos.co/statos_web_mail/sendPass.php',
			type: 'POST',
			data: val,
			dataType: "json",
		}).done(function(val, d) {
		}.bind(this, val)).fail(function() { console.log('error'); });
	}
  changeMoreVal(id,val){
    let tmpUsers = this.state.userList;
    //userListAll
    tmpUsers.find(item => item.Id == id).More = val;
    this.setState({userList: tmpUsers})
  }

  setupUserClick(id,mail){
    let tmpUsers = this.state.userList;
    tmpUsers.find(item => item.Id == id).More = false;
    let pass = this.generatePassword();
    this.setState({userList: tmpUsers, setupUser: id, toSend: mail, newPassword:pass});
  }
  setupUserApprove = async() => {
    let val = {
			id: this.state.setupUser,
			pass: this.state.newPassword,
			mail: this.state.toSend
		};

    const valAjax = {
      funcName: '',
      point: 'setup_user',
      val: val,
      role: localStorage.role,
			token: localStorage.token
    };

    try {
      const data = await this.props.ajax(valAjax);

      if(data.result=="success"){
        let userList = this.state.userList;
        userList.find(item => item.Id == this.state.setupUser).Registration = 1;
        userList.find(item => item.Id == this.state.setupUser).Mail = this.state.toSend;
        userList.find(item => item.Id == this.state.setupUser).Password = this.state.newPassword;

        this.setState({preload: false, userList, setupUser: null, toSend: null, newPassword:null});
      }else if(data.result=="exists"){
        SweetAlert({
          title: 'שם משתמש קיים',
          type: 'info',
          showConfirmButton: false,
          timer: '4000'
        }).catch(SweetAlert.noop);
        this.setState({preload: false, toSend: null});
      }

    } catch(err) {
      console.log('connection error docs');
      this.setState({preload:false});
    }


  }

  goToPassSetup(id, mail){
    let tmpUsers = this.state.userList;
    tmpUsers.find(item => item.Id == id).More = false;
    let pass = this.generatePassword();
    this.setState({userList: tmpUsers, generatePassword: id, toSend: mail, newPassword:pass})
  }

  downloadActiveUsers(){

    $.ajax({
      url: globalServer + 'new-api/active_users_xls.php',
      type: 'POST'
    }).done(function(data) {

      if (data.result == "success") {

        var win = window.open(entry + '/output/' + data.link, '_blank');
        SweetAlert({
          title: 'אקסל הופק בהצלחה',
          type: 'success',
          timer: 3000,
          showConfirmButton: false,
        }).then(function () {
          //location.reload();
        }.bind(this)).catch(SweetAlert.noop);
      } else {
        SweetAlert({
          title: 'שגיאת מערכת',
          text: 'נסה שוב',
          type: 'error',
          timer: 3000,
          showConfirmButton: false,
        }).then(function () {
          location.reload();
        }.bind(this)).catch(SweetAlert.noop);
      }
    });
  }

  regularProds(itemId,exId){
    let user = false;
    localStorage.user ? user = JSON.parse(localStorage.user) : null;
    let val = {
      'id': itemId,
      'userExtId': exId
    };
    $.ajax({
      url: globalServer + 'products_regular_per_user_for_admin.php',
      type: 'POST',
      data: val,
    }).done(function(data) {
      let regProds = data;
      let userList = this.state.userList;
      userList.find(item => item.Id == itemId).More = false;

      this.setState({ regProdsUser: exId, regProds, userList });
    }.bind(this)).fail(function() {	console.log("error"); });
  }

  updateRegProd(value, userExId, catalogNum){
    let val = {
			value: value,
			userExId: userExId,
			catalogNum: catalogNum,
			role: localStorage.role,
			token: localStorage.token
		};

		$.ajax({
			url: globalServer + 'set_reg_prods.php',
			type: 'POST',
			data: val,
		}).done(function(data) {

      if(data.result=="success"){

        let regProds = this.state.regProds;
        regProds.find(item => item.CatalogNumber == catalogNum).Visible = value;
        this.setState({regProds});
      }


		}.bind(this)).fail(function() { console.log('error'); });
  }
  unsetMore(itemId){
    let userList = this.state.userList;
    userList.find(item => item.Id == itemId).More = false;

    this.setState({userList });
  }
	render(){
		const { value, suggestions } = this.state;
		const inputProps = {
			placeholder: "חפש שם או מס' לקוח",
			value,
			onChange: this.onChange
		}
		return (
			<div className="page-container clients">

				<Helmet>
					<title>לקוחות</title>
				</Helmet>
				{this.state.preload ? <div className="preload"></div> : null}
				<div className="wrapper container">
          <h1 className="title">לקוחות</h1>

					<div className="filter flex-container">
						<div className="col-lg-2">
							{this.state.back ?
								<p onClick={this.updateUserList.bind(this, this.state.activeTab)}>
									<img src={globalFileServer + 'icons/back-new.svg'} />
									<span>חזור</span>
								</p>
							:
							<p>{'נמצאו ' + this.state.userList.length + ' לקוחות'}</p>
							}
						</div>
						{this.state.activeTab != "approved" && this.state.activeTab != "waitForApprove" ?
							<div style={{display: 'flex'}} className="col-lg-10">
								<div className="col-lg-4">
									{!this.state.back ?
										<div className="search">
											<Autosuggest
												suggestions={suggestions}
												onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
												onSuggestionSelected={this.onSuggestionSelected}
												onSuggestionsClearRequested={this.onSuggestionsClearRequested}
												getSuggestionValue={getSuggestionValue}
												renderSuggestion={renderSuggestion}
												inputProps={inputProps}
												highlightFirstSuggestion={true}
											/>
										</div>
									: null}

								</div>
                {/*
                <div className="col-lg-1 xls-btn-cont">
                  <div className="xls-btn-small-cont" onClick={this.downloadActiveUsers.bind(this)}>
                    <img className="info-icon-img xls-btn-icon" src={globalFileServer + 'icons/excel.svg'} />
                  </div>
                </div>
                */}
								<div className="col-lg-7">
									<ul className="filter-ul" style={{backgroundImage: 'url(' + globalFileServer + '/icons/filter.svg)'}}>
										<li className={this.state.activeTab == "all" ? "active" : null} onClick={this.updateUserList.bind(this, "all")}>
											<span>הכל</span>
										</li>
                  {/*
										<li className={this.state.activeTab == "b2b" ? "active" : null} onClick={this.updateUserList.bind(this, "b2b")}>
											<span>עסקי</span>
										</li>
										<li className={this.state.activeTab == "b2c" ? "active" : null} onClick={this.updateUserList.bind(this, "b2c")}>
											<span>פרטי</span>
										</li>
                  */}
									</ul>
								</div>
							</div> : null}
					</div>

					<div className="clients-wrapper">
            <div className="heading">
              <div className="flex-container">
                <div className="col-lg-2">
                  <div className="wrapp">
                    <p>מס'</p>
                  </div>
                </div>
                <div className="col-lg-4">
                  <div className="wrapp">
                    <p>לקוח</p>
                  </div>
                </div>
                <div className="col-lg-2">
                  <div className="wrapp">
                    <p>סוג</p>
                  </div>
                </div>
                <div className="col-lg-2">
                  <div className="wrapp">
                    <p>סטאטוס</p>
                  </div>
                </div>
                <div className="col-lg-1">
                  <div className="wrapp">
                    <p>מידע</p>
                  </div>
                </div>
                <div className="col-lg-1">
                  <div className="wrapp">
                    <p>פעולות</p>
                  </div>
                </div>
              </div>
            </div>
						{this.state.userList.length ? this.state.userList.map((element, index) => {
							let idToStr = [];
							if (index >= this.state.pFrom && index < this.state.pTo && element.Type==1) {
								return (
									<div className="client-item" key={index}>
										<div className="flex-container user-info">
												<div className="col-lg-2 num-col">
													<div className="wrapp">
														<p>{element.ExId}</p>
													</div>
												</div>
                        <div className="col-lg-4 name-col">
													<div className="wrapp">
														<p>{element.Name}</p>
													</div>
												</div>
                        <div className="col-lg-2 type-col">
                          <div className="wrapp">
                            {element.Type == 2 ? <p>פרטי</p> : null}
                            {element.Type == 1 ?  <p>עסקי</p> : null}
                          </div>
                        </div>
                        <div className="col-lg-2 status">
                          <div className="wrapp">
                            {!element.Registration && !element.Blocked? <p className='NotActive'>לא פעיל</p>:null}
                            {element.Blocked ? <p className='Blocked'>חסום</p>:null}
                            {element.Registration && !element.Blocked ? <p className='Active'>פעיל</p>:null}
                          </div>
                        </div>
												<div className="col-lg-1 info-col">
													<div className="wrapp info info-icon">
														<img className="info-icon-img" onClick={() => this.setState({userInfo: element.Id})} src={globalFileServer + 'icons/info.svg'} />
														{this.state.userInfo == element.Id ?
															<div className="user-info-wrapp">
																<div className="popup-contant">
                                  <div className="popup-contant-header flex-container">
                                    <div className="col-lg-10" >
                                      <p>שינוי סיסמה</p>
                                    </div>
                                    <div className="close-popup col-lg-2">
                                      <div className="close-popup-cont" onClick={() => this.setState({userInfo: null})}>
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
                                    {element.Password ?
                                      <div className="flex-container row-cont">
                                        <div className="col-lg-4 title">
                                          <p>סיסמה</p>
                                        </div>
                                        <div className="col-lg-8 value">
                                          <p>{element.Password}</p>
                                        </div>
                                      </div>
                                    :null}
                                    {element.Tel ?
                                      <div className="flex-container row-cont">
                                        <div className="col-lg-4 title">
                                          <p>טלפון</p>
                                        </div>
                                        <div className="col-lg-8 value">
                                          <p>{element.Tel}</p>
                                        </div>
                                      </div>
                                    :null}
                                  </div>
																</div>
															</div>
														: null}
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
                              {!element.Registration ?
                                <div className="flex-container row" onClick={this.setupUserClick.bind(this,element.Id, element.Mail)}>
                                  <div className="col-lg-2">
                                    <img src={globalFileServer + 'icons/wheel1.svg'} />
                                  </div>
                                  <div className="col-lg-10">
                                    <p>הקמת לקוח</p>
                                  </div>
                                </div>
                              :null}
                              {element.Registration ?
                                <div className="flex-container row" onClick={this.goToPassSetup.bind(this, element.Id, element.Mail)}>
                                  <div className="col-lg-2">
                                    <img src={globalFileServer + 'icons/wheel1.svg'} />
                                  </div>
                                  <div className="col-lg-10" src={globalFileServer + 'icons/clients/pass.svg'}>
                                    <p>שינוי סיסמה</p>
                                  </div>
                                </div>
                              :null}
                              <div className="flex-container row" onClick = {this.updateUserInfo.bind(this, element.Id, element.Blocked, "Blocked")}>
                                <div className="col-lg-2">
                                  <img src={globalFileServer + 'icons/wheel1.svg'} />
                                </div>
                                <div className="col-lg-10">
                                  {element.Blocked ?
                                    <p>הפעלת לקוח</p>
                                  :
                                    <p>חסימת לקוח</p>
                                  }
                                </div>
                              </div>
                              {element.Registration ?
                                <div className="flex-container row" onClick = {this.resetUser.bind(this, element.Id)}>
                                  <div className="col-lg-2">
                                    <img src={globalFileServer + 'icons/wheel1.svg'} />
                                  </div>
                                  <div className="col-lg-10">
                                    <p>איפוס לקוח</p>
                                  </div>
                                </div>
                              :null}
                            {/*
                              <div className="flex-container row" onClick = {this.regularProds.bind(this, element.Id, element.ExId)}>
                                <div className="col-lg-2">
                                  <img src={globalFileServer + 'icons/wheel1.svg'} />
                                </div>
                                <div className="col-lg-10">
                                  <p>סל קבוע</p>
                                </div>
                              </div>
                            */}
                            </div>
                          :null}
                        </div>
                        <div className="pass">
                          {this.state.generatePassword == element.Id ?
                            <div className="user-info-wrapp">
                              <div className="popup-contant">
                                <div className="popup-contant-header flex-container">
                                  <div className="col-lg-10" >
                                    <p>שינוי סיסמה</p>
                                  </div>
                                  <div className="close-popup col-lg-2">
                                    <div className="close-popup-cont" onClick={() => this.setState({generatePassword: null})}>
                                      <img src={globalFileServer + 'icons/close_purple.svg'} />
                                      </div>
                                  </div>
                                </div>
                                <div className="all-row-cont">
                                  <div className="flex-container row-cont">
                                    <div className="col-lg-4">
                                      <p>סיסמה חדשה</p>
                                    </div>
                                    <div className="col-lg-8">
                                      <input
                                        type="text"
                                        value={this.state.newPassword}
                                        onChange={(e) => this.setState({newPassword: e.target.value})}
                                      />
                                    </div>
                                  </div>
                                  <div className="btn-container">
                                    <p onClick={this.updateUserInfo.bind(this, element.Id, this.state.newPassword, "Password")}>אישור</p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          : null}
                          {this.state.setupUser == element.Id ?
                            <div className="user-info-wrapp">
                              <div className="popup-contant">
                                <div className="popup-contant-header flex-container">
                                  <div className="col-lg-10" >
                                    <p>פרטי כניסה</p>
                                  </div>
                                  <div className="close-popup col-lg-2">
                                    <div className="close-popup-cont" onClick={() => this.setState({setupUser: null})}>
                                      <img src={globalFileServer + 'icons/close_purple.svg'} />
                                      </div>
                                  </div>
                                </div>
                                  <div className="all-row-cont">
                                    <div className="flex-container row-cont">
                                      <div className="col-lg-4">
                                        <p>שם משתמש</p>
                                      </div>
                                      <div className="col-lg-8">
                                        <input
                                          type="text"
                                          value={!this.state.toSend ? "" : this.state.toSend}
                                          onChange={(e) => this.setState({toSend: e.target.value})}
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
                                          value={this.state.newPassword}
                                          onChange={(e) => this.setState({newPassword: e.target.value})}
                                        />
                                      </div>
                                    </div>
                                    <div className="btn-container">
                                      <p onClick={this.setupUserApprove.bind(this)}>אישור</p>
                                    </div>
                                  </div>
                              </div>
                            </div>
                          : null}
                          {this.state.regProdsUser && this.state.regProdsUser ==  element.ExId ?
                            <div className="user-info-wrapp">
                              <div className="popup-contant">
                                <div className="popup-contant-sub">

                                  <div className="popup-contant-header flex-container">
                                    <div className="col-lg-10" >
                                      <p>סל קבוע</p>
                                    </div>
                                    <div className="close-popup col-lg-2">
                                      <div className="close-popup-cont" onClick={() => this.setState({regProdsUser: false, regProds: []})}>
                                        <img src={globalFileServer + 'icons/close_purple.svg'} />
                                        </div>
                                    </div>
                                  </div>
                                  <div className="all-row-cont">
                                    <div className="reg-heading">
                                      <div className="flex-container">
                                        <div className="col-lg-3">
                                          <div className="wrapp">
                                            <p>סטאטוס</p>
                                          </div>
                                        </div>
                                        <div className="col-lg-4">
                                          <div className="wrapp">
                                            <p>מס' קטלוגי</p>
                                          </div>
                                        </div>
                                        <div className="col-lg-5">
                                          <div className="wrapp">
                                            <p>מוצר</p>
                                          </div>
                                        </div>
                                      </div>
                                    </div>
                                    {this.state.regProds.map((ele,ind) => {
                                      return(
                                        <div key={ind} className="flex-container row-cont">
                                          <div className="col-lg-3 status">
                                            {!ele.Visible ?
                                              <div onClick={this.updateRegProd.bind(this, 1, element.ExId, ele.CatalogNumber)} className="input active">
                                                <img src={globalFileServer + "icons/done.svg"} alt=""/>
                                              </div>
                                            :
                                            <div onClick={this.updateRegProd.bind(this, null, element.ExId, ele.CatalogNumber)} className="input">
                                              <img src={globalFileServer + "icons/cross-bold.svg"} alt=""/>
                                            </div>
                                            }
                                          </div>
                                          <div className="col-lg-4">
                                            <div className="wrapp">
                                              <p>{ele.CatalogNumber}</p>
                                            </div>
                                          </div>
                                          <div className="col-lg-5">
                                            <div className="wrapp">
                                              <p>{ele.Title}</p>
                                            </div>
                                          </div>
                                        </div>
                                      )
                                    })}
                                  </div>
                                </div>
                              </div>
                            </div>
                          : null}
                        </div>
										</div>
									</div>
								)};
						}) : null}
					</div>
					{this.state.userList.length > this.state.toShow ?
						<div className="pagination">
							<div className="flex-container">
								<div className="col-lg-6">
									<div className="wrapp">
										<ul>
											<li
												onClick={this.toShow.bind(this, 25)}
												className={this.state.toShow == 25 ? 'active' : null}
											>
												<span>25</span>
											</li>
											<li
												onClick={this.toShow.bind(this, 50)}
												className={this.state.toShow == 50 ? 'active' : null}
											>
												<span>50</span>
											</li>
											<li
												onClick={this.toShow.bind(this, 100)}
												className={this.state.toShow == 100 ? 'active' : null}
											>
												<span>100</span>
											</li>
										</ul>
									</div>
								</div>
								<div className="col-lg-6">
									<div className="wrapp menu-paggination">
										<ul>
											{this.state.cFrom > 0 ? <li onClick={this.downPaggination}><span>{"<"}</span></li> : null}
											{this.state.pCounter.length ? this.state.pCounter.map((element, index) => {
												if (index >= this.state.cFrom - 2 && index < this.state.cTo - 2) {
													return (
														<li
															key={index}
															onClick={() => this.state.cFrom !== index ? this.showPaggination(element) : null}
															className={this.state.cFrom == index ? 'active' : null}
														>
															<span>{element + 1}</span>
														</li>
													)};
											}) : null}
											{this.state.cTo < this.state.pCounter.length ? <li onClick={this.UpPaggination}><span>{">"}</span></li> : null}
										</ul>
									</div>
								</div>
							</div>
							<ul>

							</ul>
						</div> : null }
				</div>
			</div>
		)
	}
}
