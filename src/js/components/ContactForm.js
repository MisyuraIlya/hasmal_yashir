import ReactDOM from "react-dom";
import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import SweetAlert from 'sweetalert2';

export default class ContactForm extends Component {
	constructor(props){
		super(props);
		this.state = {
			popup: false,
			reason: false,
			name: false,
			surName: false,
			mail: false,
			tel: false,
			town: false,
			msg: false
		}
		this.openPopup = this.openPopup.bind(this);
		this.closePopup = this.closePopup.bind(this);
		this.selectReason = this.selectReason.bind(this);
		this.sendMessage = this.sendMessage.bind(this);
	}
	componentWillMount(){}
	componentDidMount(){}
	componentWillReceiveProps(nextProps){}
	componentWillUnmount(){
		$('body').removeClass('fix');
		$('#root').removeClass('blur');
	}
	openPopup(){
		this.setState({popup: true});
		$('body').addClass('fix');
		$('#root').addClass('blur');
	}
	closePopup(){
		this.setState({popup: false});
		$('body').removeClass('fix');
		$('#root').removeClass('blur');
	}
	selectReason(e){
		this.setState({reason: e.target.value});
	}
	sendMessage(){
		let check = this.state.name && this.state.mail && this.state.tel && this.state.msg;
		if (check) {
			let val = {
				ProjectID: '8008',
				Password: 'pwd@8008rs11',
				Fname: this.state.name,
				Lname: this.state.surName,
				Address: this.state.town,
				Phone: this.state.tel,
				Email: this.state.mail,
				Comments: this.state.msg,
				Referal: location.href,
				MediaTitle: 'NEW LFA SITE'
			};
			let url = globalServer + 'new-api/bmby.php';
			$.ajax({
				url: url,
				type: 'POST',
				data: val,
			}).done(function(data) {
				SweetAlert({
					title: 'ההודעה נשלחה בהצלחה',
					text: 'נציגנו יצור עמך קשר בקרוב.',
					type: 'success',
					timer: 3000,
					showConfirmButton: false,
				}).then(function() {
					this.closePopup();
				}.bind(this)).catch(SweetAlert.noop);
			}.bind(this)).fail(function() {	console.log("error"); });
		} else {
			this.setState({error: true});
		}
	}
	render(){
		let subscribeText = this.props.lang == 'he' ? 'הרשמה לייעוץ' : 'Записатся на консультацию';
		let name = this.props.lang == 'he' ? "שם:" : "Имя:";
		let surName = this.props.lang == 'he' ? "שם משפחה:" : "Фамилия";
		let mail = this.props.lang == 'he' ? "מייל:" : "Почта";
		let tel = this.props.lang == 'he' ? "טלפון:" : "Телефон";
		let town = this.props.lang == 'he' ? "עיר:" : "Город";
		let msg = this.props.lang == 'he' ? "הודעה" : "Сообщение";
		let reasonTitle = this.props.lang == 'he' ? "נושא פנייה:" : "Тема обращения:";
		let send = this.props.lang == 'he' ? "שלח הודעה" : "Отправить сообщение";
		let reason = [
			{
				Id: 0,
				Title: this.props.lang == 'he' ? "סיבת הפניה" : "Причина"
			},
			{
				Id: 0,
				Title: this.props.lang == 'he' ? "קורסים" : "Курсы"
			},
			{
				Id: 0,
				Title: this.props.lang == 'he' ? "חנות" : "Магазин"
			},
			{
				Id: 0,
				Title: this.props.lang == 'he' ? "משרות" : "Вакансии"
			},
			{
				Id: 0,
				Title: this.props.lang == 'he' ? "איפוס סיסמה" : "Сбросить пароль"
			},
			{
				Id: 0,
				Title: this.props.lang == 'he' ? "כללי" : "Общие вопросы"
			}
		];
		return (
			<div className="contact-form-wrapper">
				<button onClick={this.openPopup} className="regular">{subscribeText}</button>
				{this.state.popup ? ReactDOM.createPortal(
					<div className="popup">
						<div className={this.props.lang == 'he' ? "contact-form animated zoomIn" : "contact-form ru animated zoomIn"}>
							<div className="header">
								<h2>{subscribeText}</h2>
								<img onClick={this.closePopup} src={globalFileServer + 'icons/cross-white.svg'} />
							</div>
							<div onClick={() => this.setState({error: false})} className="flex-container">
								<div className="col-lg-6">
									<div className="wrapp">
										<div className={this.state.error && !this.state.name ? "required error" : "required"}>
											<input
												type="text"
												value={this.state.name ? this.state.name : ''}
												onChange={(e) => this.setState({name: e.target.value})}
												placeholder={name}
											/>
										</div>
										<div>
											<input
												type="text"
												value={this.state.surName ? this.state.surName : ''}
												onChange={(e) => this.setState({surName: e.target.value})}
												placeholder={surName}
											/>
										</div>
										<div className={this.state.error && !this.state.mail ? "required error" : "required"}>
											<input
												type="text"
												value={this.state.mail ? this.state.mail : ''}
												onChange={(e) => this.setState({mail: e.target.value})}
												placeholder={mail}
											/>
										</div>
										<div className={this.state.error && !this.state.tel ? "required error" : "required"}>
											<input
												type="text"
												value={this.state.tel ? this.state.tel : ''}
												onChange={(e) => this.setState({tel: e.target.value})}
												placeholder={tel}
											/>
										</div>
										<div>
											<input
												type="text"
												value={this.state.town ? this.state.town : ''}
												onChange={(e) => this.setState({town: e.target.value})}
												placeholder={town}
											/>
										</div>
									</div>
								</div>
								<div className="col-lg-6">
									<div className="wrapp">
										<div>
											<select className={!this.state.reason ? 'no-selected' : null} value={!this.state.reason ? reason[0].Title : this.state.reason} onChange={this.selectReason}>
												{reason.map((element, index) => {
													return(
														<option
															key={index}
															value={element.Title}
															disabled={index == 0 ? true : false}
														>{element.Title}</option>
													);
												})}
											</select>
										</div>
										<div className={this.state.error && !this.state.msg ? "required error" : "required"}>
											<textarea
												value={this.state.msg ? this.state.msg : ''}
												onChange={(e) => this.setState({msg: e.target.value})}
												placeholder={msg}
											/>
										</div>
									</div>
								</div>
							</div>
							<div className="wrapper">
							</div>
							<div className="footer">
								<button onClick={this.sendMessage}>{send}</button>
							</div>
						</div>
					</div>,
					document.getElementById('modal-root')
				) : null}
			</div>
		)
	}
}
