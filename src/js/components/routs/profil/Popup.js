import React, { Component } from 'react';
import moment from 'moment';

export default class Popup extends Component {
	constructor(props){
		super(props);
		this.state = {
			to: '',
			moment: moment(),
			preload: false,
			file: false
		}
		this.onKeyDown = this.onKeyDown.bind(this);
		this.confirmOfPresence = this.confirmOfPresence.bind(this);
		this.endOfCourse = this.endOfCourse.bind(this);
		this.courseApprove = this.courseApprove.bind(this);
	}
	componentWillMount(){

	}
	componentDidMount(){
		$('#autoFocus').focus();
		$('body').addClass('fix');
	}
	componentWillUnmount(){
		$('body').removeClass('fix');
	}
	onKeyDown(e){
		if (e.keyCode == 27) {
			this.props.data.closePopup();
		}
	}
	courseApprove(){
		this.setState({preload: true});
		let course = this.props.data.state.popup;
		let today = this.state.moment.format("YYYY-MM-DD");
		let lessons = this.props.data.state.lessons.filter((element) => { return element.CourseId == course.Id });
		let performance = this.props.data.state.performance.filter((element) => { return element.CourseId == course.Id && element.Presence == 1});
		let lessonsUntilNow = lessons.filter((element) => {
			return ((moment(element.Date).isBefore(today)) || element.Date == today)
		});
		let nDate = new Date;
		let docDate = nDate.toLocaleDateString().split('/');
		let val = {
			userId: localStorage.id,
			token: localStorage.token,
			sess_id: localStorage.sessionId,
			To: this.state.to,
			Date: docDate[1] + "/" + docDate[0] + "/" + docDate[2],
			CourseName: course.Title,
			StudentName: this.props.data.state.userDetails.ContactName,
			TZ: this.props.data.state.userDetails.UserName,
			StartCourse: course.StartDate,
			EndCourse: course.EndDate,
			Day: 'ב\'',
			Time: '10:00-13:00',
			StudentPresenceUntilNow: performance.length,
			PresenceUntilNow: lessonsUntilNow.length,
			AllPresence: lessons.length,
			Hours: course.Hours,
			FileName: 'course_approve' + nDate.toLocaleTimeString().split(' ')[0].split(':').join('') + '.pdf'
		};
		$.ajax({
			url: globalServer + 'course_approve_pdf.php',
			type: 'POST',
			data: val,
		}).done(function(val, data) {
			this.setState({file: val.FileName, preload: false});
		}.bind(this, val)).fail(function() { console.log('error'); });
	}
	endOfCourse(){
		this.setState({preload: true});
		let course = this.props.data.state.popup;
		let today = this.state.moment.format("YYYY-MM-DD");
		let lessons = this.props.data.state.lessons.filter((element) => { return element.CourseId == course.Id });
		let performance = this.props.data.state.performance.filter((element) => { return element.CourseId == course.Id && element.Presence == 1});
		let lessonsUntilNow = lessons.filter((element) => {
			return ((moment(element.Date).isBefore(today)) || element.Date == today)
		});
		var nDate = new Date;
		let docDate = nDate.toLocaleDateString().split('/');
		let val = {
			userId: localStorage.id,
			token: localStorage.token,
			sess_id: localStorage.sessionId,
			To: this.state.to,
			Date: docDate[1] + "/" + docDate[0] + "/" + docDate[2],
			CourseName: course.Title,
			StudentName: this.props.data.state.userDetails.ContactName,
			TZ: this.props.data.state.userDetails.UserName,
			StartCourse: course.StartDate,
			EndCourse: course.EndDate,
			Day: 'ב\'',
			Time: '10:00-13:00',
			StudentPresenceUntilNow: performance.length,
			PresenceUntilNow: lessonsUntilNow.length,
			AllPresence: lessons.length,
			FileName: 'end_of_course' + nDate.toLocaleTimeString().split(' ')[0].split(':').join('') + '.pdf'
		};
		$.ajax({
			url: globalServer + 'end_of_course_pdf.php',
			type: 'POST',
			data: val,
		}).done(function(val, data) {
			this.setState({file: val.FileName, preload: false});
		}.bind(this, val)).fail(function() { console.log('error'); });
	}
	confirmOfPresence() {
		this.setState({preload: true});
		let course = this.props.data.state.popup;
		let today = this.state.moment.format("YYYY-MM-DD");
		let lessons = this.props.data.state.lessons.filter((element) => { return element.CourseId == course.Id });
		let performance = this.props.data.state.performance.filter((element) => { return element.CourseId == course.Id && element.Presence == 1});
		let lessonsUntilNow = lessons.filter((element) => {
			return ((moment(element.Date).isBefore(today)) || element.Date == today)
		});
		let days = [];
		lessons.map((element, index) => {days.push(element.Day = moment(element.Date).format('dddd'))});
		let unique = [...new Set(days)];
		let daysHtml = [];
		unique.map((element) => {
			let time = lessons.find((elem) => { return elem.Day == element });
			let html = "<p>הקורס מתקיים ביום " + element + " בין השעות " + time.EndTime + " - " + time.StartTime + "</p>";
			daysHtml.push(html);
		});
		var nDate = new Date;
		let docDate = nDate.toLocaleDateString().split('/');
		let val = {
			userId: localStorage.id,
			token: localStorage.token,
			sess_id: localStorage.sessionId,
			To: this.state.to,
			Date: docDate[1] + "/" + docDate[0] + "/" + docDate[2],
			CourseName: course.Title,
			StudentName: this.props.data.state.userDetails.ContactName,
			TZ: this.props.data.state.userDetails.UserName,
			StartCourse: course.StartDate,
			DayTime: daysHtml.join(''),
			StudentPresenceUntilNow: performance.length,
			PresenceUntilNow: lessonsUntilNow.length,
			AllPresence: lessons.length,
			FileName: 'confirmOfPresence' + nDate.toLocaleTimeString().split(' ')[0].split(':').join('') + '.pdf'
		};
		$.ajax({
			url: globalServer + 'presence_pdf.php',
			type: 'POST',
			data: val,
		}).done(function(val, data) {
			this.setState({file: val.FileName, preload: false});
		}.bind(this, val)).fail(function() { console.log('error'); });
	}
	render(){
		return (
			<div className="popup add-img">
				<div id="autoFocus" onKeyDown={this.onKeyDown} tabIndex="1" className="popup-wrapper">
					<div onClick={this.props.data.closePopup} className="close-popup">
						<img src={globalFileServer + 'icons/close.svg'} alt="" />
					</div>
					{!this.state.file && !this.state.preload ?
					<div className="wrapp">
						<input className={!this.state.to ? 'active' : null} type="text" value={this.state.to} onChange={(e) => this.setState({to: e.target.value})} placeholder="לכבוד:" />
						{this.state.to ?
							<button onClick={this[this.props.data.state.event]}>אשר</button>
						: null}
					</div>
					: null}
					{this.state.file && !this.state.preload ?
					<div className="wrapp big">
						<h4>קובץ PDF שלך מוכן</h4>
						<a href={globalServer + 'pdf_files/' + this.state.file} target="_blank">
							<img src={globalFileServer + 'icons/pdf_c.svg'} alt="" />
							<span>{this.props.data.state.fileName}</span>
						</a>
					</div>: null }
					{this.state.preload ?
						<div className="wrapp">
							<div className="loader-container">
							<div className="loader"></div>
						</div>
					</div> : null}
				</div>
			</div>
		)
	}
}
