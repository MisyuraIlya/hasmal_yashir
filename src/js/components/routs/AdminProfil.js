import React, { Component } from 'react';
import TitleEditor from '../tools/TitleEditor';
import LoadImage from '../tools/LoadImage';
import {Helmet} from "react-helmet";

let products = [];

export default class Profil extends Component {
	constructor(props){
		super(props);
		this.state = {
			adminDetails: []
		}
		this.getAdminInfo = this.getAdminInfo.bind(this);
		this.addImg = this.addImg.bind(this);
		this.updateAdminInfo = this.updateAdminInfo.bind(this);
	}
	componentWillMount(){
		localStorage.role && localStorage.token ? this.getAdminInfo() : null;
	}
	adminNotification(paramName, e){
		let text = e.target.checked ? 0 : 1;
		let itemId = localStorage.adminId;
		this.updateAdminInfo(itemId, text, paramName);
	}
	getAdminInfo(){
		let val= {
			role: localStorage.role,
			token: localStorage.token
		}
		$.ajax({
			url: globalServer + 'get_admin.php',
			type: 'POST',
			data: val,
		}).done(function(data) {
			this.setState({ adminDetails: data });
		}.bind(this)).fail(function() { console.log('error'); });
	}
	updateAdminInfo(itemId, text, paramName) {
		let val = {
			id: itemId,
			val: text,
			paramName: paramName,
			role: localStorage.role,
			token: localStorage.token,
		};
		$.ajax({
			url: globalServer + 'update_admin_info.php',
			type: 'POST',
			data: val,
		}).done(function(d, data) {
			let adminDetails = this.state.adminDetails;
			adminDetails[d.paramName] = d.val;
			this.setState({adminDetails});

		}.bind(this, val)).fail(function() { console.log('error'); });
	}
	addImg(itemId, d) {
		this.setState({img: d.fileName, loader: true});
		let val = {
			userId: localStorage.id,
			token: localStorage.token,
			sess_id: localStorage.sessionId,
			fileName: d.fileName,
			img: d.Img
		};
		$.ajax({
			url: globalServer + 'profil_upload_img.php',
			type: 'POST',
			data: val,
		}).done(function(d, data) {
			if (data.result == "success") {
				this.updateUserInfo(localStorage.id, d.fileName, 'Img');
			}
		}.bind(this, val)).fail(function() { console.log('error'); });
	}
	isEmpty(obj) {
		for (var x in obj) { return false; }
		return true;
	}
	render(){
		return (
			<div className="page-container profil">
				<Helmet>
					<title>פרופיל</title>
				</Helmet>
				<div className="admin-profil">
					<h1 className="title">פרופיל</h1>
					<div className="container">
						<h2 className="sub-title">פרטים שלי</h2>
						<div className="profil-wrapper">
							<span className="separate">טלפון:</span>
							<TitleEditor
								title={this.state.adminDetails.Phone}
								itemId={localStorage.adminId}
								updateItems={this.updateAdminInfo}
								toUpdate='Phone'
							/>
							<span className="separate">דואר אלקטרוני:</span>
							<TitleEditor
								title={this.state.adminDetails.Email}
								itemId={localStorage.adminId}
								updateItems={this.updateAdminInfo}
								toUpdate='Email'
							/>
						</div>
						<div>
							<h2 className="sub-title">קבלת הודעות</h2>
							<div className="terms-and-conditions">
								<span>הודעות על רכישה/ הזמנה</span>
								<div className="checkboxes-and-radios">
									<input type="checkbox"
										onChange={this.adminNotification.bind(this, 'CancelOrderNotification')}
										name="checkbox-cats"
										checked={!this.state.adminDetails.CancelOrderNotification || this.state.adminDetails.CancelOrderNotification == 0 ? true : false}
										id="checkbox-1" />
									<label htmlFor="checkbox-1"></label>
								</div>
							</div>
							<div className="terms-and-conditions">
								<span>צ’ט עם הלקוח</span>
								<div className="checkboxes-and-radios">
									<input type="checkbox"
										onChange={this.adminNotification.bind(this, 'CancelChatNotification')}
										name="checkbox-cats"
										checked={!this.state.adminDetails.CancelChatNotification || this.state.adminDetails.CancelChatNotification == 0 ? true : false}
										id="checkbox-2" />
									<label htmlFor="checkbox-2"></label>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}
}
