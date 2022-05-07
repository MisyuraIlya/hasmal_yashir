import React, { Component } from 'react';
import SweetAlert from 'sweetalert2';
import FacebookLogin from 'react-facebook-login';
import moment from 'moment';

export default class UserEntry extends Component {
	constructor(props){
		super(props);
		this.state = {
			login: false,
			hp: "",
      extId:"",
			phone: "",
			email: "",
      name:"",
			pass: "",
			confirmPass: "",
			termsAndConditions: false,
			rememberMe: true,
			mailError: false,
			passError: false,
			forgotPass: false,
			accessToken: "",
			userID: "",
			requestCode: "",
			type: "buyer",
			preload: false,
			moment: moment(),
			registration: false,
      newUserType: "",
      actionToPerform: "",
      b2bconnection:false,
      b2buser:[]
		}
		this.sendPassStatos = this.sendPassStatos.bind(this);
		this.emptyData = this.emptyData.bind(this);
		this.getImgProfile = this.getImgProfile.bind(this);
		this.loginWithFacebook = this.loginWithFacebook.bind(this);
		this.startFacebookRegister = this.startFacebookRegister.bind(this);
		this.registerWithFacebook = this.registerWithFacebook.bind(this);
		this.facebookRegiser = this.facebookRegiser.bind(this);
		this.loginWithFacebookApp = this.loginWithFacebookApp.bind(this);
		this.facebookRegiserApp = this.facebookRegiserApp.bind(this);
		this.signInSuccess = this.signInSuccess.bind(this);
		this.loginInSuccess = this.loginInSuccess.bind(this);
		this.nextLoginWithFacebookApp = this.nextLoginWithFacebookApp.bind(this);
		this.nextFacebookRegiserApp = this.nextFacebookRegiserApp.bind(this);

  }
	componentWillMount(){
		localStorage.logMail ? this.setState({email: localStorage.logMail}) : null;
		localStorage.logPass ? this.setState({pass: localStorage.logPass}) : null;
		$('body').addClass('fix');
		$('main, footer, .fixed-menu, .top, .logo, .navigation-container, .copyright').addClass('blur');

    this.setState({actionToPerform: this.props.action});
    if(this.props.action == "register"){
      this.setState({newUserType: "b2b"});
    }
	}
	componentWillUnmount(){
		$('body').removeClass('fix');
		$('main, footer, .fixed-menu, .top, .logo, .navigation-container, .copyright').removeClass('blur');
	}

	startFacebookRegister(){
		this.setState({preload: true});
	}
	facebookRegiser(data){
		let name = data.name.split(' ');
		this.setState({
			preload: false,
			name: name[0],
			email: data.email,
			accessToken: data.accessToken,
			userID: data.userID
		});
		this.getImgProfile(data.userID);
	}
	getImgProfile(id){
		let val = {	'fId': id };
		$.ajax({
			url: globalServer + 'save_profile_img.php',
			type: 'POST',
			data: val,
		}).done(function(data) {
		}.bind(this)).fail(function() {	console.log("error"); });
	}
	restorePass = async() =>{
		if (this.state.pass == this.state.confirmPass) {
			let val = { 'UserCod': this.state.requestCode, 'pass': this.state.pass };

      const valAjax = {
        funcName: '',
        point: 'restore_password',
        val: val
      };
      try {
        const data = await this.props.headProps.ajax(valAjax);

        if (data.result == "success") {
          SweetAlert({
            title: 'הסיסמה עודכנה בהצלחה',
            text: '',
            type: 'success',
            timer: 3000,
            showConfirmButton: false,
          }).then(function() {
            this.setState({forgotPass: false});
          }.bind(this)).catch(SweetAlert.noop);
        }
        if (data.result == "not-found") {
          SweetAlert({
            title: 'קוד האיפוס אינו תקין',
            text: 'אנא נסה שנית',
            type: 'error',
            timer: 3000,
            showConfirmButton: false,
          }).catch(SweetAlert.noop);
        }

      } catch(err) {
        console.log('connection error b2b_registration');
      }


		} else {
			SweetAlert({
				title: 'סיסמה אינה תואמת',
				text: 'אנא נסה שנית',
				type: 'error',
				timer: 3000,
				showConfirmButton: false,
			}).catch(SweetAlert.noop);
		}
	}
	sendPassStatos(mail, random){
		let val = { 'Random': random, 'Mail': mail, 'SiteUrl': location.origin ,'SiteName': globalSiteName};
		$.ajax({
			url: 'https://statos.co/statos_web_mail/restore_pass_glb.php',
			type: 'POST',
			data: val,
		}).done(function(data) {
		}.bind(this)).fail(function() {	console.log("error"); });
	}
	sendPass = async() =>{

    let val = {
      'Email': this.state.email, 'siteUrl': entry
    };
    const valAjax = {
      funcName: '',
      point: 'forgot_pass',
      val: val
    };

    try {
      const data = await this.props.headProps.ajax(valAjax);

      if (data.result == "success") {
        if (data.mail) {
          this.sendPassStatos(data.mail, data.random);
          SweetAlert({
            title: 'קוד הבקשה נשלח לכתובת המייל',
            text: 'יש לעבור לתיבת הדואר',
            type: 'success',
            timer: 3000,
            showConfirmButton: false,
          }).then(function () {

            this.setState({forgotPass: 'stepTwo',pass: ""});
          }.bind(this)).catch(SweetAlert.noop);
        } else {
          SweetAlert({
            title: 'מייל לא קיים',
            text: 'אנא פנה לשירות תמיכה',
            type: 'error',
            timer: 3000,
            showConfirmButton: false,
          }).then(function () {
          }.bind(this)).catch(SweetAlert.noop);
        }
      }
      if (data.result == "not-found") {
        SweetAlert({
          title: 'משתמש לא קיים',
          text: 'אנא נסה שנית',
          type: 'error',
          timer: 3000,
          showConfirmButton: false,
        }).catch(SweetAlert.noop);
      }

    } catch(err) {
      console.log('connection error b2b_registration');
    }




	}
	signIn = async () => {
		$('#password').blur();
		let val = {
			userName: this.state.email,
			password: this.state.pass,
      funcName: '',
      point: 'sign_in',
		};

    try {
      const data = await this.props.headProps.ajax(val);
      if (data.result == "success") {
				SweetAlert({
					title: 'ברוכים הבאים',
					text: 'קנייה נעימה!!!',
					type: 'success',
					timer: 3000,
					showConfirmButton: false
				}).then(function () {
          let siteVer = localStorage.siteVer;

          if(data.role =="super_user"){
            localStorage.clear();
            localStorage.setItem('adminId', data.adminId);
            localStorage.setItem('name', data.name);
            localStorage.setItem('role', data.role);
            localStorage.setItem('sessionId', data.sessionId);
            localStorage.setItem('token', data.token);
            localStorage.setItem('logMail', this.state.email);
            localStorage.setItem('logPass', this.state.pass);
          }else if(data.role == "agent"){
            localStorage.clear();
    				localStorage.setItem('agent', data.agent);
    				localStorage.setItem('agentExId', data.agentExId);
    				localStorage.setItem('agentName', data.agentName);
    				localStorage.setItem('agentToken', data.agentToken);
            localStorage.setItem('sessionId', data.sessionId);
            localStorage.setItem('logMail', this.state.email);
            localStorage.setItem('logPass', this.state.pass);
          }else{
            let user = JSON.parse(data.user);
            localStorage.setItem('user', data.user);
            localStorage.setItem('sessionId', data.sessionId);
            localStorage.setItem('token', data.token);
            localStorage.setItem('logMail', this.state.email);
            localStorage.setItem('logPass', this.state.pass);
          }
          localStorage.siteVer = siteVer;

      	  location.reload();
				}.bind(this)).catch(SweetAlert.noop);
			}
			if (data.result == "not-found") {
				SweetAlert({
					title: 'שם משתמש או סיסמה אינם נכונים',
					text: 'אנא נסה שנית או שחזר סיסמה',
					type: 'error',
					timer: 3000,
					showConfirmButton: false,
				}).then(function () {}.bind(this)).catch(SweetAlert.noop);
			}

    } catch(err) {
      console.log('connection error sign in');
    }


	}
	loginInSuccess(data){
		let val = {	'Email': data.email, 'UserId': data.id };
		$.ajax({
			url: globalServer + 'sign_in_with_facebook.php',
			type: 'POST',
			data: val,
		}).done(function(data) {
			this.setState({preload: false});
			if (data.result == "success") {
				SweetAlert({
					title: 'ברוכים הבאים',
					text: 'קנייה נעימה!!!',
					type: 'success',
					timer: 3000,
					showConfirmButton: false
				}).then(function () {
					let user = JSON.parse(data.user);
					localStorage.setItem('user', data.user);
					user.Type ? localStorage.setItem('type', user.Type) : null;
					localStorage.setItem('name', user.Name);
					localStorage.setItem('id', user.Id);
					localStorage.setItem('exId', user.ExId);
					localStorage.setItem('sessionId', data.sessionId);
					localStorage.setItem('token', data.token);
          localStorage.setItem('logMail', this.state.email);
          localStorage.setItem('logPass', this.state.pass);
					location.reload();
				}.bind(this)).catch(SweetAlert.noop);
			}
			if (data.result == "not-found") {
				SweetAlert({
					title: 'משתמש לא קיים במערכת',
					text: 'אולי רשמתה במערכת לא באמצעות פייסבוק. תנסה לרשום באמצעות פייסבוק או להזכיר שם משתמש וסיסמה',
					type: 'error',
					timer: 5000,
					showConfirmButton: false,
				}).then(function () {}.bind(this)).catch(SweetAlert.noop);
			}
		}.bind(this)).fail(function() {	console.log("error"); });
	}
	nextLoginWithFacebookApp(){
		facebookConnectPlugin.api("/me?fields=email,name,picture",["public_profile","email"], this.loginInSuccess.bind(this), err => console.error(err));
	}
	loginWithFacebookApp(){
		facebookConnectPlugin.login(["public_profile","email"], this.nextLoginWithFacebookApp.bind(this), err => console.error(err));
	}
	loginWithFacebook(data) {
		let val = [];
		if (!data) {
			val = {	'Email': this.state.email,'UserId': this.state.userID };
		} else {
			val = {	'Email': data.email, 'UserId': data.userID };
		}
		$.ajax({
			url: globalServer + 'sign_in_with_facebook.php',
			type: 'POST',
			data: val,
		}).done(function(data) {
			this.setState({preload: false});
			if (data.result == "success") {
				SweetAlert({
					title: 'ברוכים הבאים',
					text: 'קנייה נעימה!!!',
					type: 'success',
					timer: 3000,
					showConfirmButton: false,
				}).then(function () {
					let user = JSON.parse(data.user);
					localStorage.setItem('user', data.user);
					user.Type ? localStorage.setItem('type', user.Type) : null;
					localStorage.setItem('name', user.Name);
					localStorage.setItem('id', user.Id);
					localStorage.setItem('exId', user.ExId);
					localStorage.setItem('sessionId', data.sessionId);
					localStorage.setItem('token', data.token);
          localStorage.setItem('logMail', this.state.email);
          localStorage.setItem('logPass', this.state.pass);
					location = 'index.html';
				}.bind(this)).catch(SweetAlert.noop);
			}
			if (data.result == "not-found") {
				SweetAlert({
					title: 'משתמש לא קיים במערכת',
					text: 'אולי רשמתה במערכת לא באמצעות פייסבוק. תנסה לרשום באמצעות פייסבוק או להזכיר שם משתמש וסיסמה',
					type: 'error',
					timer: 5000,
					showConfirmButton: false,
				}).then(function () {}.bind(this)).catch(SweetAlert.noop);
			}
		}.bind(this)).fail(function() {	console.log("error"); });
	}
	register = async () => {
		let validMail = this.validateEmail(this.state.email);
		if (validMail && this.state.pass == this.state.confirmPass) {
			let date = new Date();
			let recovery = date.getSeconds() + "" + date.getMilliseconds() + "" + date.getDay();

			let val = {
        'Id': this.state.b2buser.Id,
				'Hp': this.state.hp,
				'Password': this.state.pass,
				'Tel': this.state.phone,
				'Mail': this.state.email,
				'Recovery': recovery.substring(0, 4),
        'Name': this.state.name.catch,
        'action': 'create_user'
			};
      const valAjax = {
        funcName: '',
        point: 'b2b_registration',
        val: val
      };


      try {
        const data = await this.props.headProps.ajax(valAjax);

        if (data.result == "success") {
          this.signIn();
        }
        if (data.result == "already_exists") {
          SweetAlert({
            title: 'שם משתמש קיים',
            text: 'אנא ציין כתובת מייל שונה ונסה שוב',
            type: 'info',
            timer: 3000,
            showConfirmButton: false,
          }).then(function () {});
        }
      } catch(err) {
        console.log('connection error b2b_registration');
      }

		} else {
			!validMail ? this.setState({mailError: true}) : null;
			this.state.pass !== this.state.confirmPass ? this.setState({passError: true}) : null;
		}
	}
	registerWithFacebook(){
		let validMail = this.validateEmail(this.state.email);
		if (validMail) {
			let date = new Date();
			let recovery = date.getSeconds() + "" + date.getMilliseconds() + "" + date.getDay();
			let val = {
				'Passport': this.state.passport,
				'Name': this.state.name,
				'Tel': this.state.phone,
				'Mail': this.state.email,
				'Recovery': recovery.substring(0, 4),
				'UserId': this.state.userID,
				'Img': this.state.userID ? this.state.userID + '.jpg' : null
			};
			$.ajax({
				url: globalServer + 'registration_with_facebook.php',
				type: 'POST',
				data: val,
			}).done(function(val, data) {
				if (data.result == "success") {
					// this.afterRegistration('loginWithFacebook');
				}
				if (data.result == "already_exists") {
					SweetAlert({
						title: 'שם משתמש קיים',
						text: 'אנא נסה לבצע התחברות',
						type: 'info',
						timer: 3000,
						showConfirmButton: false,
					});
				}
			}.bind(this, val)).fail(function() {	console.log("error"); });
		} else {
			!validMail ? this.setState({mailError: true}) : null;
			this.state.pass !== this.state.confirmPass ? this.setState({passError: true}) : null;
		}
	}
	signInSuccess(data){
		this.setState({
			preload: false,
			name: data.name,
			email: data.email,
			userID: data.id
		});
		this.getImgProfile(data.id);
	}
	nextFacebookRegiserApp(data){
		this.setState({
			accessToken: data.authResponse.accessToken
		});
		facebookConnectPlugin.api("/me?fields=email,name,picture",["public_profile","email"], this.signInSuccess.bind(this), err => console.error(err));
	}
	facebookRegiserApp(){
		this.setState({preload: true});
		facebookConnectPlugin.login(["public_profile","email"], this.nextFacebookRegiserApp.bind(this), err => console.error(err));
	}
	emptyData(){
		SweetAlert({
			title: 'פרטים חסרים',
			text: 'אנא מלא את כל השדות ואשר את תנאי השימוש',
			type: 'info',
			timer: 4000,
			showConfirmButton: false,
		});
	}
	isANumber(str){
		if(/^\d+$/.test(str) || str == "") { return true; } else { return false; }
	}
	validateEmail(email) {
		if(email.match(/^(([^<>()\[\]\.,;:\s@\"]+(\.[^<>()\[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i)) {
			return true;
		} else {
			return false;
		}
	}
  checkB2bConn = async () => {

    this.setState({preload:true});

    const val = {
      funcName: '',
      point: 'new-api/findb2bclient',
      exId: this.state.extId

    };
    try {
      const data = await this.props.headProps.ajax(val);

      this.setState({preload:false});

      if (data.result == "success") {
        this.setState({b2buser:JSON.parse(data.users).Userss[0],b2bconnection:true});
      }else if(data.result == "multiple") {
        SweetAlert({
          title: 'נמצאו מספר סניפים לעסק הנ״ל ונדרשת הגדרת מנהל',
          text: 'אנא צרו קשר להקמת משתמש זה',
          type: 'info',
          timer: 3000,
          showConfirmButton: false,
        }).then(function () {});
      }else if(data.result == "registered"){
        SweetAlert({
          title: 'לקוח מחובר. אנא היכנס בתור משתמש קיים.',
          text: 'במידה ואינך זוכר את הסיסמה באפשרותך לשחזרה',
          type: 'info',
          timer: 3000,
          showConfirmButton: false,
        }).then(function () {});
      }else if(data.result == "not-found"){
        SweetAlert({
          title: 'פרטי העסק לא נמצאו',
          text: 'אנא צור קשר',
          type: 'info',
          timer: 3000,
          showConfirmButton: false,
        }).then(function () {});
      }
    } catch(err) {
      //this.props.connectionError('connection error GetSales');
      console.log('connection error findb2bclient');
    }




  }
	render(){
    let action = this.props.action;
    let lang = this.props.lang;

		return (
			<div className="popup" id="userEntry">
        {this.state.preload ?
          <div className="spinner-wrapper">
            <div className="spinner">
              <div className="bounce1"></div>
              <div className="bounce2"></div>
              <div className="bounce3"></div>
            </div>
          </div>
        : null}
				<div className="popup-wrapper">
					<div className="wrapp">
						<div onClick={() => this.props.close()} className="close-popup">
							<img src={globalFileServer + 'icons/close-dark.svg'} alt="" />
						</div>
						<div className="user-entry-wrapper">
              {this.state.actionToPerform == "" ?
                <div className="action-to-perform">
                  <h3>ברוכים הבאים! נא לבחור סוג משתמש</h3>
    							<ul>
    								<li onClick={() => this.setState({actionToPerform: "login"})} className={this.state.login ? 'active' : null}><div className='existing-user-btn'>כניסה</div></li>
    								<li onClick={() => this.setState({actionToPerform: "register", newUserType: "b2b"})} className={!this.state.login ? 'active' : null}><div>הרשמה</div></li>
    							</ul>
                </div>
              :null}
              {this.state.actionToPerform == "register" && this.state.newUserType == "b2c" ?
                <h3>מלא את הפרטים הבאים</h3>
              :null}
							<div className="user-entry">

								{this.state.actionToPerform == "login" ?
									<div className="login">
                    <img className="user_icon" src={globalFileServer + 'user_icon.png'} />
                    <h3>{lang == "he" ? "כניסה": ""}</h3>
                    <div className="input-cont">
                      <p>{lang == "he" ? "מייל" : ""}</p>
										  <input type="text" onChange={(e)=> this.setState({email: e.target.value})} value={this.state.email} />
                    </div>
                    <div className="input-cont">
                      <p>{lang == "he" ? "סיסמה" : ""}</p>
                      <input id="password" onKeyPress={(e) => e.charCode == 13 ? this.signIn() : null} type="password" onChange={(e)=> this.setState({pass: e.target.value})} value={this.state.pass} />
                    </div>

										<div className="actions">
											{this.state.pass && this.state.pass ?
												<div className="send btn-cont">
													<button onClick={()=> this.signIn()}>כניסה</button>
												</div>
											:
											<div className="accept btn-cont">
												<button>כניסה</button>
											</div>
											}
										</div>
										<p onClick={() => this.setState({forgotPass : "stepOne"})} className="forgot-pass">שחזר סיסמה</p>
										{this.state.forgotPass ?
											<div className="forgot-pass-wrapp">
												<div className="forgot-password">
													<div className="cancel">
														<div onClick={()=> this.setState({forgotPass : false})}>
															<img src={globalFileServer + 'icons/close.svg'} alt="" />
														</div>
													</div>
													{this.state.forgotPass == "stepOne" ?
														<div>
															<h3>אנא הקלידו את כתובת המייל שלכם</h3>
															<input type="text" onChange={(e)=> this.setState({email: e.target.value})} placeholder="אימייל" value={this.state.email} />
															<button onClick={this.sendPass}>שלח</button>
														</div> : null}
													{this.state.forgotPass == "stepTwo" ?
														<div>
															<h3>אנא הקלד קוד הבקשה וסיסמה חדשה</h3>
															<input type="text" onChange={(e)=> this.setState({requestCode: e.target.value})} placeholder="קוד הבקשה" value={this.state.requestCode} />
															<input type="text" onChange={(e)=> this.setState({pass: e.target.value})} placeholder="סיסמה חדשה" value={this.state.pass} />
															<input type="text" onChange={(e)=> this.setState({confirmPass: e.target.value})} placeholder="אימות סיסמה חדשה" value={this.state.confirmPass} />
															<button onClick={this.restorePass}>שלח</button>
														</div> : null}
												</div>
											</div>
										: null}
									</div>
								:null}
                {this.state.actionToPerform == "register" ?
  								<div className="register">
                    {this.state.newUserType == "" ?
                      <div className="action-to-perform">
                        <h3>אנא בחר סוג לקוח</h3>
          							<ul>
          								<li onClick={() => this.setState({newUserType: "b2c"})} className={this.state.login ? 'active' : null}><div>לקוח פרטי</div></li>
          								<li onClick={() => this.setState({newUserType: "b2b"})} className={!this.state.login ? 'active' : null}><div>לקוח עסקי</div></li>
          							</ul>
                      </div>
                    :null}

                    {!this.state.accessToken && this.state.newUserType == "b2c" ?
                      <div>
                        {/*<div className="facebook-login">
                          {!!window.cordova ?
                            <button className="for-cordova" onClick={this.facebookRegiserApp}>
                              <img src={globalFileServer + 'icons/facebook-white.svg'} alt="" />
                              <span>התחבר באמצעות פייסבוק</span>
                            </button>
                          :
                          <FacebookLogin
                            appId="170015466922476"
                            autoLoad={false}
                            scope="email,public_profile,user_birthday,user_location"
                            fields="name,email,picture"
                            onClick={this.startFacebookRegister}
                            callback={this.facebookRegiser}
                            textButton="התחבר באמצעות פייסבוק"
                            cssClass="facebook-button"
                            icon='fa-facebook'
                          />
                          }
                          <p>או</p>
                        </div>*/}
  											<input type="text" onChange={(e)=> this.setState({email: e.target.value})} placeholder="מייל" value={this.state.email} />
                        <input type="text" onChange={(e)=> this.setState({name: e.target.value})} placeholder="שם" value={this.state.name} />

                        <input type="number"
  												onChange={(e)=> this.isANumber(e.target.value) ? this.setState({phone: e.target.value}) : null}
  												name="phone" placeholder="טלפון" value={this.state.phone}
  											/>

  											<input type="password"
  												className={this.state.passError ? "error" : null}
  												onChange={(e)=> this.state.passError ? this.setState({pass: e.target.value, passError: false}) : this.setState({pass: e.target.value})}
  												name="pass" placeholder="סיסמה" value={this.state.pass}
  											/>
  											<input type="password"
  												className={this.state.passError ? "error" : null}
  												onChange={(e)=> this.state.passError ? this.setState({confirmPass: e.target.value, passError: false}) : this.setState({confirmPass: e.target.value})}
  												name="confirmPass" placeholder="אימות סיסמה" value={this.state.confirmPass}
  											/>

  											<div className="terms-and-conditions">
  												<div className="checkboxes-and-radios">
  													<input type="checkbox"
  														onChange={(e)=> this.setState({termsAndConditions: e.target.checked})}
  														name="checkbox-cats" checked={this.state.termsAndConditions}
  													id="checkbox-3" value="3" />
  													<label htmlFor="checkbox-3"></label>
  												</div>
  												<span>אנא קרא והסכם <a target="_blank" href={globalFileServer + 'privacy_policy.pdf'}>לתנאי השימוש</a></span>
  											</div>
  											<div className="actions">
  												{this.state.email && this.state.name && this.state.phone && this.state.pass && this.state.confirmPass && this.state.termsAndConditions ?
  													<div className="send">
  														<button onClick={() => this.register()}>צור חשבון</button>
  													</div>
  												:
  												<div className="accept">
  													<button onClick={() => this.emptyData()}>צור חשבון</button>
  												</div>
  												}
  												<div className="cancel">
  													<button onClick={()=> this.props.close()}>ביטול</button>
  												</div>
  											</div>
  										</div>
  									:
  									null
  									}

                    {this.state.newUserType == "b2b" && !this.state.b2bconnection ?
                      <div className="connect-b2b-form">
                        <img className="user_icon" src={globalFileServer + 'user_icon.png'} />
                        <h3>{lang == "he" ? "הרשמה": ""}</h3>

                        <div className="input-cont">
                          <p>{lang == "he" ? "מס' לקוח פנימי" : ""}</p>
                          <input type="text" onChange={(e)=> this.setState({extId: e.target.value})} name="user_name" value={this.state.extId} />
                        </div>
                        <div className="accept">
                          <button onClick={() => this.checkB2bConn()}>בדיקה</button>
                        </div>
                      </div>
                    :null}
                    {this.state.newUserType == "b2b" && this.state.b2bconnection ?
                      <div className="register-with-facebook">

                        <img className="user_icon" src={globalFileServer + 'user_icon.png'} />
                        <h3>{this.state.b2buser.Name}</h3>
                        <div className="input-cont">
                          <p>{lang == "he" ? "כתובת מייל" : ""}</p>
                          <input type="text" onChange={(e)=> this.setState({email: e.target.value})} name="user_name" value={this.state.email} className={this.state.mailError ? "error" : null}  />
                        </div>
                        <div className="input-cont">
                          <p>{lang == "he" ? "מס' טלפון" : ""}</p>
                          <input type="number"
                            onChange={(e)=> this.isANumber(e.target.value) ? this.setState({phone: e.target.value}) : null}
                            name="phone" value={this.state.phone}
                          />
                        </div>
                        <div className="input-cont">
                          <p>{lang == "he" ? "סיסמה" : ""}</p>
                          <input type="password"
                            className={this.state.passError ? "error" : null}
                            onChange={(e)=> this.state.passError ? this.setState({pass: e.target.value, passError: false}) : this.setState({pass: e.target.value})}
                            name="pass" value={this.state.pass}
                          />
                        </div>
                        <div className="input-cont">
                          <p>{lang == "he" ? "אימות סיסמה" : ""}</p>
                          <input type="password"
                            className={this.state.passError ? "error" : null}
                            onChange={(e)=> this.state.passError ? this.setState({confirmPass: e.target.value, passError: false}) : this.setState({confirmPass: e.target.value})}
                            name="confirmPass" value={this.state.confirmPass}
                          />
                        </div>
                        <div className="terms-and-conditions">
                          <div className="checkboxes-and-radios">
                            <input type="checkbox"
                              onChange={(e)=> this.setState({termsAndConditions: e.target.checked})}
                              name="checkbox-cats" checked={this.state.termsAndConditions}
                            id="checkbox-3" value="3" />
                            <label htmlFor="checkbox-3"></label>
                          </div>
                          <span>{lang == "he" ? "קראתי ואני מסכים " : ""}<a target="_blank" href={globalFileServer + 'policy_form.pdf'}>לתנאי השימוש</a></span>
                        </div>
                        <div className="actions">
                          {this.state.email && this.state.phone && this.state.termsAndConditions && this.state.pass && this.state.confirmPass ?
                            <div className="send">
                              <button onClick={() => this.register()}>צור חשבון</button>
                            </div>
                          :
                          <div className="accept">
                            <button onClick={() => this.emptyData()}>צור חשבון</button>
                          </div>
                          }
                        </div>
                      </div>
                      :null
                    }
  								</div>
                :null}
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}
}
