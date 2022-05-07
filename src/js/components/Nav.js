import React, { Component, Fragment, useState } from 'react';
import { NavLink, useParams } from "react-router-dom";
import Autosuggest from 'react-autosuggest';
import SweetAlert from 'sweetalert2';
import SyncPop from './header/SyncPop';


const sidebarLight = [
  /*
	{
		Title: 'פרופיל אישי',
		Link: '/profil',
		Img: 'profil.svg'
	},

	{
		Title:'כרטסת',
		Link: '/docs',
		Img: 'list.svg',
		Password: false
	},
*/
	{
		Title:'היסטוריית הזמנות',
		Link: '/history',
		Img: 'cart.svg',
		Password: false
	}
  /*,
	{
		Title:'החזרות',
		Link: '/returns',
		Img: 'returns.svg',
		Password: false
	}*/
];
const sidebarLightb2c = [
	{
		Title: 'פרופיל אישי',
		Link: '/profil',
		Img: 'profil.svg'
	},
	{
		Title:'הזמנות אונליין',
		Link: '/history',
		Img: 'cart.svg',
		Password: false
	}

];
const sidebarAdmin = [
  /*{
    Title: 'שיוך קטגוריות',
    Link: '/category-build/1',
    Img: 'list.svg',
    Password: false
  },*/
  {
    Title: 'ניהול מוצרים',
    Link: '/category-edit/0/0',
    Img: 'nav_prod.svg',
    Password: false
  },
	{
		Title: 'לקוחות',
		Link: '/clients',
		Img: 'clients.svg',
		Password: false,
    Pop: false
	}/*,
	{
		Title: 'אזורי חלוקה',
		Link: '/gis',
		Img: 'gps.svg',
		Password: false,
    Pop: false
	}*/,
	{
		Title: 'הודעות פרסומיות',
		Link: '/notification',
		Img: 'mail.svg',
		Password: false,
    Pop: false
	},

/*  {
		Title: 'מחלקות',
		Link: '/deptEdit',
		Img: 'department.svg',
		Password: false
	},
  {
		Title: 'ניהול עובדים',
		Link: '/employee',
		Img: 'employees.svg',
		Password: false
	},
  {
    Title: 'ליקוט',
    Link: '/collector-step-three',
    Img: 'box.svg',
    Password: false
  },*/
	{
		Title: 'הזמנות',
		Link: '/admin-history',
		Img: 'cart.svg',
		Password: false,
    Pop: false
	},
  {
	 	Title: 'מבצעים',
	 	Link: '/admin-sales',
	 	Img: 'sales.svg',
	 	Password: false,
    Pop: false
	},/*
  {
	 	Title: 'מידע',
	 	Link: '/admin-info',
	 	Img: 'info.svg',
	 	Password: false,
    Pop: false
	},
	{
		Title: 'עדכון מערכת',
		Link: '/admin-history',
		Img: 'sync.svg',
		Password: false,
    Pop: true
	}*/
];
const getSuggestionValue = suggestion => suggestion.name;
const renderSuggestion = suggestion => (
	<div className="hello"><span>{suggestion.Name} / </span><span>{suggestion.ExId}</span></div>
);

export default class Nav extends Component {
	constructor(props){
		super(props);
		this.state = {
			users: [],
			allUsers: [],
			preload: false,
			suggestions: [],
			value: '',
			adminPass1: localStorage.adminPass1 ? localStorage.adminPass1 : false,
			adminPass2: localStorage.adminPass2 ? localStorage.adminPass2 : false,
      syncPop: false,
      SelectedUser:[]

		}
		this.getUsers = this.getUsers.bind(this);
		this.onChange = this.onChange.bind(this);
		this.getSuggestions = this.getSuggestions.bind(this);
		this.onSuggestionsFetchRequested = this.onSuggestionsFetchRequested.bind(this);
		this.onSuggestionsClearRequested = this.onSuggestionsClearRequested.bind(this);
		this.onSuggestionSelected = this.onSuggestionSelected.bind(this);
    this.close = this.close.bind(this);
    this.preload = this.preload.bind(this);


	}
	componentDidMount(){}
  close(){
    this.setState({syncPop:false});
  }
  preload(){
    this.setState({preload: !this.state.preload});
  }
	setPassword(link, eP){
		SweetAlert({
			input: 'text',
			title: 'Enter Password',
			confirmButtonText: 'Accept',
			showCancelButton: true
		}).then(function (res) {
			if (eP == 1) {
				if (res.value == this.props.state.adminPass1) {
					localStorage.setItem('adminPass1', res.value);
					this.setState({adminPass1: res.value});
					this.props.history.push(link);
					this.props.toggleMenu();
				}
				if (res.value && res.value != this.props.state.adminPass1) {
					SweetAlert({
						title: 'Your password is incorrect',
						type: 'error',
						timer: 3000,
						showConfirmButton: false,
					}).catch(SweetAlert.noop);
				}
			}
			if (eP == 2) {
				if (res.value == this.props.state.adminPass2) {
					localStorage.setItem('adminPass2', res.value);
					this.setState({adminPass2: res.value});
					this.props.history.push(link);
					this.props.toggleMenu();
				}
				if (res.value && res.value != this.props.state.adminPass2) {
					SweetAlert({
						title: 'Your password is incorrect',
						type: 'error',
						timer: 3000,
						showConfirmButton: false,
					}).catch(SweetAlert.noop);
				}
			}
		}.bind(this)).catch(SweetAlert.noop);
	}

	signIn(user) {
    SweetAlert({
			title: 'שם הלקוח: ' + user.Name,
			text: '',
			type: 'success',
			timer: 1300,
			showConfirmButton: false,
		}).then(function () {
			localStorage.setItem('user', JSON.stringify(user));
			localStorage.setItem('type', user.Type);
			localStorage.setItem('name', user.Name);
			localStorage.setItem('id', user.Id);
			localStorage.setItem('exId', user.ExId);
      this.props.toggleMenu();
      this.props.AgentLog("in");
      this.props.history.push('/wishList');

			//location.reload();
		}.bind(this)).catch(SweetAlert.noop);
	}
	getUsers(){
		this.setState({preload: true});
		let val = {'token': localStorage.agentToken};
		$.ajax({
			url: globalServer + 'new-api/get_agent_users.php',
			type: 'POST',
			data: val,
		}).done(function(data) {
			this.setState({
				preload: false,
				users: data.Userss,
				allUsers: data.Userss
			});

		}.bind(this)).fail(function() {
      console.log("error");
      this.setState({preload: false});
    });
	}
	onChange(event, { newValue }) {
		this.setState({	value: newValue	});
    console.log(newValue);
	}
	getSuggestions(value) {
		const inputValue = value.trim().toLowerCase();
		const inputLength = inputValue.length;

		let isNumber =  /^\d+$/.test(value);
    //debugger;
		if (isNumber) {
			return inputLength === 0 ? [] : this.state.users.filter(user =>
				user.ExId ? user.ExId.slice(0, inputLength) === inputValue : null
			);
		} else {
			return (
				inputLength === 0 ? [] : this.state.users.filter(user => {
					if (user.Name.split(' ').length > 1) {
            return user.Name.includes(inputValue)
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
		//this.setState({	suggestions: [], value: "" });
	}
	onSuggestionSelected(event, { suggestion, suggestionValue, suggestionIndex, sectionIndex, method }) {
		if (method == "click" || method == "enter") {
      let users = this.state.users.filter((elem) => { return elem.Id == suggestion.Id });
			this.setState({users: [], value:""});
      this.signIn(users[0]);
		}
	}
  signOut(){
    this.props.history.push('/');
    this.props.toggleMenu();
    this.props.signOut("agentForUser");
  }
  checkNewUser = () => {
    this.setState({preload: true});

    let value = this.state.value;
		let val = {'token': localStorage.agentToken,
                'value': value,
                'action': 'agent_new_user'
              };

		$.ajax({
			url: globalServer + 'b2b_registration.php',
			type: 'POST',
			data: val,
		}).done(function(data) {



      if(data.result=="success"){

        this.setState({users: []});
        this.signIn(data.user);
      }else if(data.result == "already_exists"){
        this.setState({users: []});
        this.signIn(data.user);
      }else{
        SweetAlert({
          title: "מס' לקוח לא קיים",
          type: 'info',
          timer: 3000,
          showConfirmButton: false,
        }).catch(SweetAlert.noop);

      }

			this.setState({
				preload: false
			});

		}.bind(this)).fail(function() {
      console.log("error");
      this.setState({preload: false});
    });
//


  }
	render(){
		let lang = this.props.state.lang;
		const { value, suggestions } = this.state;
		const inputProps = {
			placeholder: "שם/מס' לקוח..",
			value,
			onChange: this.onChange
		}
		return (
			<nav id="main" data-class={lang == 'he' ? 'he' : 'ru'} className={this.props.state.toggleMenu ? 'active' : null}>
				{this.state.preload ?
					<div className="spinner-wrapper">
						<div className="spinner">
							<div className="bounce1"></div>
							<div className="bounce2"></div>
							<div className="bounce3"></div>
						</div>
					</div>
				: null}
        {this.state.syncPop ? <SyncPop {...this} /> : null}
				{localStorage.agent ?
					<div className="agent">
						{this.state.users.length ?
							<Fragment>
								<div className="user-search">
                  {this.state.SelectedUser.length == 0 ?
                    <div>
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
                      <div className="search-new-btn-cont">
                        <p onClick={this.checkNewUser}>חיפוש</p>
                      </div>
                    </div>
									:
                  <div onClick={() => this.setState({ SelectedUser:[]})} className="back">
                    <p>חזור לחיפוש</p>
										<img src={globalFileServer + 'icons/back-new.svg'} />
									</div>
									}
								</div>
								<div className="user-list">
                  {this.state.SelectedUser.map((element, index) => {
										return(
											<div key={index} className="item flex-container">
												<div className="col-lg-2">
													<img className="info" src={globalFileServer + 'icons/info.svg'} />
													<div className="info-wrapper">
														<div className="flex-container">
															<div className="col-lg-6">
																<p>שם לקוח:</p>
																<p>ת.ז. :</p>
																<p>מספר טלפון:</p>
															</div>
															<div className="col-lg-6">
																<p>{element.Name}</p>
																<p>{element.ExId}</p>
																<p>{element.Tel}</p>
															</div>
															{element.Mail ? <p>{element.Mail}</p> : null}
														</div>
													</div>
												</div>
												<div className="col-lg-8">
													<p>{element.Name}</p>
												</div>
												<div onClick={this.signIn.bind(this, element)} className="col-lg-2">
													<img className="login" src={globalFileServer + 'icons/enter.svg'} />
												</div>
											</div>
										);
									})}
								</div>
							</Fragment>
						:
						<Fragment>
							{localStorage.id && localStorage.exId && localStorage.user ?
								<div className="user-info">
									<h2>{'משתמש פעיל: ' + localStorage.name}</h2>
									<div className="flex-container">
										<div className="col-lg-3">
											<p>מס' לקוח:</p>
										</div>
										<div className="col-lg-9">
											<p>{JSON.parse(localStorage.user).ExId}</p>
										</div>
									</div>
									<div className="flex-container">
										<div className="col-lg-3">
											<p>מס' טלפון:</p>
										</div>
										<div className="col-lg-9">
											<p>{JSON.parse(localStorage.user).Tel}</p>
										</div>
									</div>
									<div className="flex-container">
										<div className="col-lg-3">
											<p>מייל:</p>
										</div>
										<div className="col-lg-9">
											<p>{JSON.parse(localStorage.user).Mail}</p>
										</div>
									</div>
									<button onClick={this.signOut.bind(this)} className="sign-out">
										<span>יציאה ממנוי לקוח</span>
									</button>
								</div>
							:
							<button onClick={this.getUsers} className="get-users">החל בהזמנה</button>
							}
						</Fragment>
						}
					</div>
				:
				<ul>

					{localStorage.role ? sidebarAdmin.map((element, index) => {
						return(
							<li key={index}>
								{element.Password ?
									<Fragment>
										{element.Password == 1 && this.props.state.adminPass1 && this.props.state.adminPass1 == this.state.adminPass1 || element.Password == 2 && this.props.state.adminPass2 && this.props.state.adminPass2 == this.state.adminPass2 ?
											<NavLink onClick={this.props.toggleMenu.bind(this)} to={element.Link}>
												<img src={globalFileServer + 'icons/menu/' + element.Img} />
												<span>{element.Title}</span>
											</NavLink>
										:
										<a onClick={this.setPassword.bind(this, element.Link, element.Password)}>
											<img src={globalFileServer + 'icons/menu/' + element.Img} />
											<span>{element.Title}</span>
										</a>
										}
									</Fragment>
								:
                <Fragment>
                  {element.Pop ?
                    <a onClick={() => this.setState({syncPop:true})}>
                      <img src={globalFileServer + 'icons/menu/' + element.Img} />
                      <span>{element.Title}</span>
                    </a>
                    :
                    <NavLink onClick={this.props.toggleMenu.bind(this)} to={element.Link}>
                      <img src={globalFileServer + 'icons/menu/' + element.Img} />
                      <span>{element.Title}</span>
                    </NavLink>
                  }
                </Fragment>
								}
							</li>
						);
					}) : null}
					{localStorage.id && !localStorage.type ? sidebarLight.map((element, index) => {
						return(
							<li key={index} onClick={this.props.toggleMenu.bind(this)}>
								<NavLink to={element.Link}>
									<img src={globalFileServer + 'icons/menu/' + element.Img} />
									<span>{element.Title}</span>
								</NavLink>
							</li>
						);
					}) : null}

          {localStorage.user && JSON.parse(localStorage.user).Type == 1 && !localStorage.agent ? sidebarLight.map((element, index) => {
              return(
                <li key={index} onClick={this.props.toggleMenu.bind(this)}>
                  <NavLink to={element.Link}>
                    <img src={globalFileServer + 'icons/menu/' + element.Img} />
                    <span>{element.Title}</span>
                  </NavLink>
                </li>
              )
            }) : null}
            {localStorage.user && JSON.parse(localStorage.user).Type == 2 && !localStorage.agent ? sidebarLightb2c.map((element, index) => {
                return(
                  <li key={index} onClick={this.props.toggleMenu.bind(this)}>
                    <NavLink to={element.Link}>
                      <img src={globalFileServer + 'icons/menu/' + element.Img} />
                      <span>{element.Title}</span>
                    </NavLink>
                  </li>
                )
              }) : null}



				</ul>
				}
			</nav>
		)
	}
}
