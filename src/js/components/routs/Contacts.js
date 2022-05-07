import ReactDOM from "react-dom";

import React, { Component, Fragment, useState, useEffect, useRef, useContext } from 'react';
import { NavLink } from "react-router-dom";
import {Helmet} from "react-helmet";
import SweetAlert from 'sweetalert2';
import UserContext from '../../UserContext';


const ContactUs = params => {

	const [name, SetName] = useState('');
	const [mail, SetMail] = useState('');
	const [company, SetCompany] = useState('');
	const [msg, SetMsg] = useState('');
  const [contactActive, SetContactActive] = useState(0);
  const [contactPopUpActive, SetContactPopUpActive] = useState(false);
  const [contactPopObj, SetContactPopObj] = useState({'Name':"",'Mail':"",'Phone':"",'ProdTitle':"",'DueDate':"", 'Atzva':"", 'Message':""});
  const [dumi, SetDumi]= useState(false);
  const [preload, SetPreload]= useState(false);
  const [inputInfoHover, SetInputInfoHover]= useState(false);



	const app = useContext(UserContext);
	let constant = app.returnConstant;

	const sendForm = () => {

	}
	const showError = () => {
		SweetAlert({
			title: 'פרטים חסרים',
			type: 'error',
			showConfirmButton: false,
			timer: 5000
		}).then(function () {}.bind(this)).catch(SweetAlert.noop);
	}

  const close = () => {

    SetContactPopObj({'Name':"",'Mail':"",'Phone':"",'ProdTitle':"",'DueDate':"", 'Atzva':"", 'Message':""});
    SetContactPopUpActive(false);
  }
  const open = () => {
    SetContactPopUpActive(true);
  }
  const setInputState = (param, val) => {
    contactPopObj[param] = val;
    SetContactPopObj(contactPopObj);
    SetDumi(JSON.stringify(contactPopObj));
  }

  const sendPopFormFunc = () => {
    if(contactPopObj.Name != "" && contactPopObj.Mail != "" && contactPopObj.Phone != "" && contactPopObj.ProdTitle != "" && contactPopObj.Message != ""){
      SetPreload(true);
      let valMail = {
        siteName: params.regConstants.constants.SITE_NAME,
        from: params.regConstants.constants.FROM_MAIL,
        to: params.regConstants.constants.TO_MAIL,
        name: contactPopObj.Name,
        mail: contactPopObj.Mail,
        phone: contactPopObj.Phone,
        prodTitle: contactPopObj.ProdTitle,
        dueDate: contactPopObj.DueDate,
        atzva: contactPopObj.Atzva,
        message: contactPopObj.Message
      };


      $.ajax({
        url: 'https://statos.co/statos_web_mail/send_from_contacts_b2b.php',
        type: 'POST',
        data: valMail,
        dataType: "json",
      }).done(function(d) {

        SweetAlert({
          title: app.state.lang == "he" ? 'הודעה נשלחה בהצלחה' : 'Message was sent successfully',
          type: 'success',
          showConfirmButton: false,
          timer: 4000
        }).catch(SweetAlert.noop);
          close();
          SetContactPopObj({'Name':"",'Mail':"",'Phone':"",'ProdTitle':"",'DueDate':"", 'Atzva':"", 'Message':""});
          SetPreload(false);
      }.bind(this)).fail(function() {
         SetPreload(false);
      }.bind(this));
    }else{

      SweetAlert({
        title: app.state.lang == "he" ? 'אנא מלא את כל השדות החובה' : "Please fill in all fields",
        type: 'info',
        showConfirmButton: false,
        timer: 4000
      }).catch(SweetAlert.noop);
    }
  }
  //contacts={this.props.state.contacts} contactBtm={this.props.state.contactBtm} contactFormInputs={this.props.state.contactFormInputs}
  let contacts;
  let contactBtm;
  let chosenContact;
  let contactFormInputs;

  if(params.regConstants && params.regConstants.contacts && params.regConstants.contacts.length > 0){
    contacts = params.regConstants.contacts.filter(item => item.Lang == app.state.lang);

    contactBtm = params.regConstants.ContactBtm.filter(item => item.Lang == app.state.lang);
    if(contactBtm && contactBtm.length > 0){
      chosenContact = params.regConstants.ContactBtm.filter(item => item.Id == contactActive && item.Lang == app.state.lang);
      contactFormInputs = params.regConstants.ContactFormInputs.filter(item => item.Lang == app.state.lang);
    }
  }




	return(
		<div className="contact-us">
      {preload ?
        <div className="spinner-wrapper">
          <div className="spinner">
            <div className="bounce1"></div>
            <div className="bounce2"></div>
            <div className="bounce3"></div>
          </div>
        </div>
      : null}
			<div className="container">
				<div className="flex-container">
					<div className="col-lg-6">
						<div className="form">
							<div className="wr">
								<div className="input-group">
									<input
										type="text"
										value={name ? name : ""}
										placeholder=""
										onChange={(e) => this.setState({name: e.target.value})}
										id="Name"
									/>
									<label className={name ? "active" : null} htmlFor="Name">{constant('FORM_NAME')}</label>
								</div>
								<div className="input-group">
									<input
										type="text"
										value={mail ? mail : ""}
										placeholder=""
										onChange={(e) => this.setState({mail: e.target.value})}
										id="Mail"
									/>
									<label className={mail ? "active" : null} htmlFor="Mail">{constant('FORM_MAIL')}</label>
								</div>
								<div className="input-group">
									<input
										type="text"
										value={company ? company : ""}
										placeholder=""
										onChange={(e) => this.setState({company: e.target.value})}
										id="Tel"
									/>
									<label className={company ? "active" : null} htmlFor="Tel">{constant('FORM_COMPANY')}</label>
								</div>
								<div className="input-group">
									<textarea
										placeholder=""
										type="text"
										value={msg ? msg : ""}
										placeholder=""
										onChange={(e) => this.setState({msg: e.target.value})}
										id="Msg"
									/>
									<label className={msg ? "active" : null} htmlFor="Msg">{constant('FORM_MESSAGE')}</label>
								</div>
								<div className="button-wrapper">
									<button onClick={name && mail && tel && msg ? sendForm : showError}>{constant('FORM_SEND')}</button>
								</div>
							</div>
						</div>
					</div>
					<div className="col-lg-6">
						<div className="info">
							<iframe
								src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3371.5992118674844!2d34.87461921548925!3d32.32261961432153!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x151d155902e7c0a9%3A0x74d5ee19cfdd1996!2sHaKadar%20St%2018%2C%20Netanya!5e0!3m2!1sen!2sil!4v1596109473687!5m2!1sen!2sil"
								frameBorder="0"
								allowFullScreen=""
								aria-hidden="false"
								tabIndex="0"
							/>
							<div className="items">
								{contacts && contacts.length>0 ? contacts.map((element, index) => {
									return(
										<div key={index} className="item">
											<div className="flex-container">
												<div className="col-lg-2">
													<div className="img">
														<img src={globalFileServer + 'icons/contact/' + element.Img} alt=""/>
													</div>
												</div>
												<div className="col-lg-10">
													<ul>
														<li>{element.Title}</li>
														<li>{element.Text}</li>
													</ul>
												</div>
											</div>
										</div>
									);
								}):null}
							</div>
						</div>
					</div>
				</div>

      	<div className="flex-container bottom-comp">
          <div className="col-lg-3">
            {contactBtm && contactBtm.length > 0 ? contactBtm.map((element, index) => {
              return(
                <div key={index} className={index == 0 ? "right-cont active" : "right-cont"}>
                  <div className="right-cont-subcont">
                    <img src={globalFileServer + '/icons/contact/' + element.RightImg} alt=""/>
                    <h2>{element.RighTitle}</h2>
                  </div>
                </div>
              )
            }):null}
          </div>
          {chosenContact && chosenContact.length > 0 ?
            <div className="col-lg-9">
              <div className="left-cont">
               <div className="left-cont-subcont">
                 <h1>{chosenContact[0].LeftTitle}</h1>
                 <h2>{chosenContact[0].LeftTitle2}</h2>
                 <button onClick={chosenContact[0].Id == 0 ? open : null}>{chosenContact[0].LeftBtn}</button>
               </div>
              </div>
            </div>
          :null}
        </div>
        {contactPopUpActive ? ReactDOM.createPortal(
					<div className="my-modal contact-pop">
						<div className="modal-wrapper animated">
              <div className="close-cont">
  							<div onClick={close} className="close">
  								<img src={globalFileServer + 'icons/close-dark.svg'} />
  							</div>
              </div>
              <div className="wrapper">
                <div className="sup-wrapper">
                  <h1>{constant('CONTACT_FORM_TITLE')}</h1>
                  {contactFormInputs && contactFormInputs.length > 0 ? contactFormInputs.map((element, index) => {
                    return(
                      <div className="input-div" key={index}>
                        <p>{element.Title}</p>
                        <input
                          type="text"
                          value={contactPopObj[element.Param] ? contactPopObj[element.Param] : ""}
                          placeholder=""
                          onChange={(e) => setInputState(element.Param, e.target.value)}
                          id="Tel"
                        />
                        {element.Info ?
                          <div className="info-cont">
                            <img
                              onMouseEnter={() => SetInputInfoHover(element.Info)}
                              onMouseLeave={() => SetInputInfoHover(false)}
                              src={globalFileServer + '/icons/contact/input_info.svg'} alt=""/>
                          </div>
                        :null}
                        {element.Info && element.Info == inputInfoHover ?
                          <div className="info-value-cont">
                            <p className="info-value">{inputInfoHover}</p>
                          </div>
                        :null}
                      </div>
                    )
                  }):null}
                  {contactFormInputs && contactFormInputs.length > 0 ?
                    <textarea
    										placeholder=""
    										type="text"
    										value={contactPopObj.Message ? contactPopObj.Message : ""}
    										placeholder={constant('CONTACT_FORM_TXTAREA')}
    										onChange={(e) => setInputState('Message', e.target.value)}
    										id="Msg"
    									/>

                  :null}
                  <button onClick={sendPopFormFunc}>{constant('CONTACT_FORM_BTN')}</button>
                </div>
              </div>
						</div>
						<div onClick={close} className="overflow"></div>
					</div>,
					document.getElementById('modal-root')
				) : null}

			</div>
		</div>
	);
}


export default class Contacts extends Component {
	constructor(props){
		super(props);
		this.state = {
      name:"",
      mail:"",
      phone:"",
      message:"",
      preload: false
    }
	}
	componentDidMount(){
    setTimeout(() => {
			window.scrollTo(0, 0);
		}, 100);
  }
  sendMail(){

    if(this.state.name != "" && this.state.mail != "" && this.state.phone != "" && this.state.message != ""){
      this.setState({preload:true});
      let valMail = {
        siteName: globalSiteName,
        from: this.props.state.defaults.statosMail,
        to: this.props.state.defaults.toMail,
        name: this.state.name,
        mail: this.state.mail,
        phone: this.state.phone,
        message: this.state.message
      };

      $.ajax({
        url: 'https://statos.co/statos_web_mail/send_from_contacts_b2b.php',
        type: 'POST',
        data: valMail,
        dataType: "json",
      }).done(function(d) {

        SweetAlert({
          title: 'הודעה נשלחה בהצלחה',
          type: 'success',
          showConfirmButton: false,
          timer: 4000
        }).catch(SweetAlert.noop);

        this.setState({name:"",mail:"",phone:"",message:"",preload:false});

      }.bind(this)).fail(function() {
         console.log('error');
         this.setState({preload:false});
      }.bind(this));
    }else{
      SweetAlert({
        title: 'אנא מלא את כל השדות',
        type: 'info',
        showConfirmButton: false,
        timer: 4000
      }).catch(SweetAlert.noop);
    }

  }

  changeValue(params,e){
  	this.setState({[params]: e.target.value});
  }

	render(){
    let lang;
    if(this.props.lang){
      lang = this.props.lang;
    }

		let app;
    let contactPage = false;
    if(this.props.location && this.props.location.pathname.includes("contact")){
      app = this.props.state;
      contactPage = true;
    }else{
      app = this.props.props.state;
    }

		return (
			<div className="contacts">
        {this.state.preload ?
          <div className="spinner-wrapper">
            <div className="spinner">
              <div className="bounce1"></div>
              <div className="bounce2"></div>
              <div className="bounce3"></div>
            </div>
          </div>
        : null}
        {contactPage ?
          <div className="header-img">
            <img src={globalFileServer + 'home/contact_banner.jpg'} alt=""/>
          </div>
        :null}

        <ContactUs regConstants={app}/>

			</div>
		)
	}
}
