import React, { Component } from 'react';
import Select from 'react-select';
import TitleEditor from '../tools/TitleEditor';
import RichEditor from '../tools/RichEditor';
import MyCropper from "../tools/MyCropper";
import SweetAlert from 'sweetalert2';
import moment from 'moment';
import {Helmet} from "react-helmet";

let products = [];
let newDate = new Date();

let today = moment().format("YYYY-MM-DD");

let user;


export default class Profil extends Component {
	constructor(props){
		super(props);
		this.state = {
			userDetails: [],
			notificationInfo: [],
			formatedCources: [],
			courses: [],
			courseTitles: [],
			courcesSelected: [],
			allCourses: [],
			modelCourses: [],
			student: false,
			buyer: false,
			lessons: [],
			performance: [],
			popup: false,
			event: false,
			fileName: false,
			moment: moment(),
			preload: false,
			oldPass: '',
			newPass: ''
		}
		this.getUserInfo = this.getUserInfo.bind(this);
		this.updateUserInfo = this.updateUserInfo.bind(this);
		this.addImg = this.addImg.bind(this);
		this.uploadImg = this.uploadImg.bind(this);
		this.getNotificationInfo = this.getNotificationInfo.bind(this);
		this.willSentNotification = this.willSentNotification.bind(this);
		this.getCourses = this.getCourses.bind(this);
		this.setModel = this.setModel.bind(this);
		this.setStudent = this.setStudent.bind(this);
		this.setBuyer = this.setBuyer.bind(this);
		this.createCources = this.createCources.bind(this);
		this.getModelCourses = this.getModelCourses.bind(this);
		this.getLesson = this.getLesson.bind(this);
		this.getPerformance = this.getPerformance.bind(this);
		this.closePopup = this.closePopup.bind(this);
		this.setPreload = this.setPreload.bind(this);
		this.unsetPreload = this.unsetPreload.bind(this);
		this.sendNewPass = this.sendNewPass.bind(this);
		this.reSign = this.reSign.bind(this);
	}
	componentWillMount(){

    if(localStorage.user){
      user = JSON.parse(localStorage.user);
      this.getUserInfo();
      this.getNotificationInfo();
    }
		// this.getCourses();
		// this.getModelCourses();
		// this.getPerformance();
	}
	componentDidMount(){
		// localStorage.type == 'student' ? this.setState({student: true}) : null;
	}
	sendNewPass(){
		if (this.state.userDetails.Password == this.state.oldPass) {
			if (this.state.newPass.length < 3) {
				SweetAlert({
					title: 'הסיסמה קצרה מדי',
					type: 'error',
					timer: 3000,
					showConfirmButton: false,
				}).catch(SweetAlert.noop);
			} else {
				let val = {
					id: user.Id,
					val: this.state.newPass,
					paramName: 'Password',
					userId: user.Id,
					token: localStorage.token,
					sess_id: localStorage.sessionId
				};
				$.ajax({
					url: globalServer + 'update_user_info.php',
					type: 'POST',
					data: val,
				}).done(function(d, data) {
					this.reSign();
				}.bind(this, val)).fail(function() { console.log('error'); });
			}
		} else {
			SweetAlert({
				title: 'הסיסמה אינה תואמת',
				type: 'error',
				timer: 3000,
				showConfirmButton: false,
			}).catch(SweetAlert.noop);
		}
	}
	reSign(){
		let val = {
			'UserName': user.Mail,
			'Pass': this.state.newPass
		};
		$.ajax({
			url: globalServer + 'sign_in.php',
			type: 'POST',
			data: val,
		}).done(function(data) {
			if (data.result == "success") {
        let user = JSON.parse(data.user);
        localStorage.setItem('user', data.user);
        localStorage.setItem('sessionId', data.sessionId);
        localStorage.setItem('token', data.token);
				SweetAlert({
					title: 'סיסמתך שונתה בהצלחה',
					type: 'success',
					timer: 3000,
					showConfirmButton: false,
				}).catch(SweetAlert.noop);
				setTimeout(() => location.reload(), 3000);
			}
			if (data.result == "not-found") {
				let products = localStorage.products ? localStorage.products : [];
				localStorage.clear();
				localStorage.setItem('products', products);
				location.reload();
			}
		}.bind(this)).fail(function() {	console.log("error"); });
	}
	getPerformance(){
		let val = {
			userId: localStorage.id,
			token: localStorage.token,
			sess_id: localStorage.sessionId
		};
		$.ajax({
			url: globalServer + 'performance_view_per_student.php',
			type: 'POST',
			data: val,
		}).done(function(data) {
			this.setState({performance: data.StudentPerformances});
		}.bind(this)).fail(function() { console.log('error'); });
	}
	getLesson(){
		let val = {
			userId: localStorage.id,
			token: localStorage.token,
			sess_id: localStorage.sessionId,
			Id: this.state.userDetails.CourseId
		};
		$.ajax({
			url: globalServer + 'lessons_view_all.php',
			type: 'POST',
			data: val,
		}).done(function(data) {
			this.setState({lessons: data.Lessonss});
		}.bind(this)).fail(function() { console.log('error'); });
	}
	setModel(){
		let userDetails = this.state.userDetails;
		let temp = !this.state.userDetails.Model == false ? null : 1;
		!temp ? localStorage.removeItem('model') : null;
		if (localStorage.type && localStorage.type != 'wait' && temp) localStorage.setItem('model', 1);
		this.updateUserInfo(localStorage.id, temp, 'Model');
		userDetails.Model = !this.state.userDetails.Model;
		this.setState({userDetails});
	}
	setStudent(){
		this.setState({student: true});
		this.updateUserInfo(localStorage.id, 'student', 'Type');
		SweetAlert({
			title: 'בקשתך להיות סטודנט התקבלה בהצלחה.',
			type: 'success',
			timer: 3000,
			showConfirmButton: false,
		}).catch(SweetAlert.noop);
		// setTimeout(() => {
		// 	if (localStorage.price) localStorage.removeItem('price');
		// 	if (localStorage.type) localStorage.removeItem('type');
		// 	localStorage.setItem('temp', 'wait');
		// 	$('#getUserInfo').trigger('click');
		// }, 1000);
	}
	setBuyer(){
		SweetAlert({
			title: 'אתה בטוח?',
			text: 'לאחר אישורך אינך סטודנט יותר',
			type: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#3085d6',
			cancelButtonColor: '#d33',
			confirmButtonText: 'כן',
			cancelButtonText: 'לא'
		}).then(function() {
			this.setState({buyer: true});
			this.updateUserInfo(localStorage.id, 'buyer', 'Type');

			if (localStorage.price) localStorage.removeItem('price');
			if (localStorage.type) localStorage.removeItem('type');
			localStorage.setItem('temp', 'buyer');
			$('#getUserInfo').trigger('click');

		}.bind(this)).catch(SweetAlert.noop);

	}

	createCources(data){
		let formatedCources = [];
		data.map((element, index) => {
			let temp = {
				Id: element.Id,
				value: element.Title,
				label: element.Title
			}
			formatedCources.push(temp);
		});
		this.setState({formatedCources});
	}
	getCourses(){
		let val = {
			userId: localStorage.id,
			token: localStorage.token,
			sess_id: localStorage.sessionId,
			type: localStorage.type
		};
		$.ajax({
			url: globalServer + 'courses_view_teacher.php',
			type: 'POST',
			data: val,
		}).done(function(data) {
			this.setState({courses: data.Coursess});
		}.bind(this)).fail(function() { console.log('error'); });
	}
	getModelCourses(){
		let val = {
			userId: localStorage.id,
			token: localStorage.token,
			sess_id: localStorage.sessionId,
			type: localStorage.type
		};
		$.ajax({
			url: globalServer + 'model_courses_view.php',
			type: 'POST',
			data: val,
		}).done(function(data) {
			this.setState({modelCourses: data.Coursess});
		}.bind(this)).fail(function() { console.log('error'); });
	}
	getUserInfo(){
		let val= { userId: user.Id };
		$.ajax({
			url: globalServer + 'get_user.php',
			type: 'POST',
			data: val,
		}).done(function(data) {
			this.setState({ userDetails: data.Userss[0] });
		}.bind(this)).fail(function() { console.log('error'); });
	}
	updateUserInfo(itemId, text, paramName) {
		let val = {
			id: itemId,
			val: text,
			paramName: paramName,
			userId: localStorage.id,
			token: localStorage.token,
			sess_id: localStorage.sessionId
		};
		$.ajax({
			url: globalServer + 'update_user_info.php',
			type: 'POST',
			data: val,
		}).done(function(d, data) {
			let userDetails = this.state.userDetails;
			userDetails[d.paramName] = d.val;
			this.setState({userDetails});
		}.bind(this, val)).fail(function() { console.log('error'); });
	}
	setPreload(){
		this.setState({preload: true});
	}
	unsetPreload(){
		this.setState({preload: false});
	}
	uploadImg(data){
		let val = {
			userId: localStorage.id,
			token: localStorage.token,
			sess_id: localStorage.sessionId,
			fileName: data.fileName,
			img: data.img
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
	getNotificationInfo(){
		let val = {
			userId: localStorage.id,
			token: localStorage.token,
			sess_id: localStorage.sessionId,
			app_id: localStorage.appId
		};
		$.ajax({
			url: globalServer + 'view_app_id.php',
			type: 'POST',
			data: val,
		}).done(function(d, data) {
			this.setState({notificationInfo: data});
		}.bind(this, val)).fail(function() { console.log('error'); });
	}
	willSentNotification(e) {
    localStorage.user ? this.setState({user: JSON.parse(localStorage.user)}) : null;
		let val = {
			userId: user.Id,
			token: localStorage.token,
			sess_id: localStorage.sessionId,
			app_id: this.props.state.appId,
			disagree: e.target.checked ? 0 : 1
		};
		$.ajax({
			url: globalServer + 'edit_app_id.php',
			type: 'POST',
			data: val,
		}).done(function(d, data) {
			let notificationInfo = this.state.notificationInfo;
			notificationInfo.Disagree = d.disagree;
			this.setState({notificationInfo});
		}.bind(this, val)).fail(function() { console.log('error'); });
	}
	closePopup(){
		this.setState({popup: false});
	}
	isEmpty(obj) {
		for (var x in obj) { return false; }
		return true;
	}

	render(){
		let formatedCources = [];
		this.state.modelCourses.length ? this.state.modelCourses.map((element, index) => {
			let temp = {
				Id: element.Id,
				value: element.Title,
				label: element.Title
			}
			formatedCources.push(temp);
		}) : null;
		return (
			<div className="page-container profil-user">
				<Helmet>
					<title>פרופיל שלי</title>
				</Helmet>
				{this.state.preload ?
					<div className="spinner-wrapper">
						<div className="spinner">
							<div className="bounce1"></div>
							<div className="bounce2"></div>
							<div className="bounce3"></div>
						</div>
					</div>
				: null}
				<h1 className="title">פרופיל שלי</h1>
				<div className="wrapper flex-container">
					<div className="col-lg-7">
						<div className="wrapp">
							<div className="profil-wrapper">


								<span className="separate">ח.פ.</span>
								<p className="data-text">{this.state.userDetails.Hp}</p>
                <span className="separate">מס' לקוח פנימי</span>
								<p className="data-text">{this.state.userDetails.ExId}</p>
                <span className="separate">מייל / שם משתמש</span>
                <p className="data-text">{this.state.userDetails.Mail}</p>


								<span className="separate">שם מלא:</span>
								<TitleEditor
									title={this.state.userDetails.Name}
									itemId={user.Id}
									updateItems={this.updateUserInfo}
									toUpdate='Name'
								/>

								<span className="separate">טלפון</span>
								<TitleEditor
									title={this.state.userDetails.Tel}
									itemId={user.Id}
									updateItems={this.updateUserInfo}
									toUpdate='Tel'
								/>
								<span className="separate">עיר</span>
								<TitleEditor
									title={this.state.userDetails.Town}
									itemId={user.Id}
									updateItems={this.updateUserInfo}
									toUpdate='Town'
								/>
								<span className="separate">רחוב</span>
								<TitleEditor
									title={this.state.userDetails.Address}
									itemId={user.Id}
									updateItems={this.updateUserInfo}
									toUpdate='Address'
								/>
								<span className="separate">מיקוד</span>
								<TitleEditor
									title={this.state.userDetails.Zip}
									itemId={user.Id}
									updateItems={this.updateUserInfo}
									toUpdate='Zip'
								/>
							</div>
							{this.props.state.appId ?
								<div>
									<h2 className="sub-title">קבלת הודעות</h2>
									<div className="terms-and-conditions">
										<span>אני מסכים לקבל חדשות והתראות</span>
										<div className="checkboxes-and-radios">
											<input type="checkbox"
												onChange={this.willSentNotification}
												name="checkbox-cats"
												checked={!this.state.notificationInfo.Disagree}
											id="checkbox-3" value="3" />
											<label htmlFor="checkbox-3"></label>
										</div>
									</div>
								</div> : null}
						</div>
					</div>
					<div className="col-lg-5">
						<div className="left-col">
							<div className="restore-pass">
								<h2>איפוס סיסמה</h2>
								<div className="flex-container">
									<div className="col-lg-6">
										<div className="wrapp">
											<p className="name">סיסמה קיימת</p>
											<input
												type="text"
												onChange={(e) => this.setState({oldPass: e.target.value})}
												value={this.state.oldPass}
											/>
										</div>
									</div>
									<div className="col-lg-6">
										<div className="wrapp">
											<p className="name">סיסמה חדשה</p>
											<input
												type="text"
												onChange={(e) => this.setState({newPass: e.target.value})}
												value={this.state.newPass}
											/>
										</div>
									</div>
								</div>
								<div className="new-password">
									<button onClick={this.sendNewPass}>שמור</button>
								</div>
							</div>
							<div className="courses">
								{this.state.courses && this.state.courses.length ? <h2>קורסים</h2> : null}
								{this.state.courses && this.state.courses.length ? this.state.courses.map((element, index) => {
									let elDate = element.EndDate.split("/");
									elDate = elDate[2] + '-' + elDate[1] + '-' + elDate[0];
									let endOfCourse = moment(today).isAfter(elDate);
									return (
										<div key={index} className="course">
											<p className="name">שם הקורס</p>
											<p className="data">{element.Title}</p>
											<div className="flex-container">
												<div className="col-lg-6">
													<p className="name">תאריך התחלה</p>
													<p className="data">{element.StartDate}</p>
												</div>
												<div className="col-lg-6">
													<p className="name">תאריך סיום</p>
													<p className="data">{element.EndDate}</p>
												</div>
											</div>
											{localStorage.type == 'student' ?
												<div>
													<p className="name">סה”כ שעות לימוד</p>
													<p className="data">{element.Hours}</p>
													<ul>
														<li>
															<a onClick={() => this.setState({popup: element, event: 'confirmOfPresence', fileName: 'אישור נוכחות'})}>אישור נוכחות</a>
															<img src={globalFileServer + 'icons/download-arrow.svg'} />
														</li>
														<li>
															<a onClick={() => this.setState({popup: element, event: 'courseApprove', fileName: 'אישור לימודים'})}>אישור לימודים</a>
															<img src={globalFileServer + 'icons/download-arrow.svg'} />
														</li>
														{endOfCourse ?
															<li>
																<a onClick={() => this.setState({popup: element, event: 'endOfCourse', fileName: 'אישור סיום לימודים'})}>אישור סיום לימודים</a>
																<img src={globalFileServer + 'icons/download-arrow.svg'} />
															</li> : null}
													</ul>
												</div>
											: null}
										</div>
									);
								}) : null}
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	}
}
