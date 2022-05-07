import React, { Component } from 'react';
let nl2br  = require('nl2br');
import {Helmet} from "react-helmet";

export default class Mail extends Component {
	constructor(props){
		super(props);
		this.state = {
			items: [],
			filteredItems: [],
			department: 'קורסים',
			departments: ['קורסים','חנות','משרות','איפוז סיסמה','כללי']
		}
		this.getItems = this.getItems.bind(this);
	}
	componentWillMount(){
		this.getItems();
	}
	componentDidMount(){}
	componentWillUnmount(){}
	setDepartment(department){
		let filteredItems = this.state.items.filter((element) => {
			return element.Department == this.state.department;
		});
		this.setState({department, filteredItems});
	}
	handleChange(id, e){
		let val = {
			role: localStorage.role,
			token: localStorage.token,
			id: id,
			done: e.target.checked
		};
		$.ajax({
			url: globalServer + 'update_massage_for_admin.php',
			type: 'POST',
			data: val,
		}).done(function(e, id, data) {
			let items = this.state.items;
			items.find(x=> x.Id == id).Done = e;
			this.setState({items});
		}.bind(this, e.target.checked, id)).fail(function() { console.log('error'); });
	}
	getItems(){
		let val = {
			role: localStorage.role,
			token: localStorage.token
		};
		$.ajax({
			url: globalServer + 'massages_for_admin_view.php',
			type: 'POST',
			data: val,
		}).done(function(data) {
			let items = data.ContactLists.filter((element) => {
				return element.Department == this.state.department;
			});
			this.setState({items: data.ContactLists, filteredItems: items});
		}.bind(this)).fail(function() { console.log('error'); });
	}
	render(){
		return (
			<div className="page-container mails">
				<Helmet>
					<title>הודעות</title>
				</Helmet>
				<h1 className="title">הודעות</h1>
				<div className="container">
					<div className="navigation-wrapper">
						<div className="track flex-container">

							{this.state.departments.length ? this.state.departments.map((element, index) => {
								return (
									<div key={index} className="item">
										<div onClick={this.setDepartment.bind(this, element)} className={this.state.department == element ? "wrapp active" : "wrapp"}>
											<p>{element}</p>
										</div>
									</div>
								);
							}) : null}
							
						</div>
					</div>
					<div className="heading flex-container">
						<div className="col-lg-2"><p>שם</p></div>
						<div className="col-lg-2"><p>טלפון</p></div>
						<div className="col-lg-2"><p>כתובת מ''ל</p></div>
						<div className="col-lg-2"><p>תאריך</p></div>
						<div className="col-lg-3"><p>טקסט הודעה</p></div>
						<div className="col-lg-1"><p>מצב</p>	</div>
					</div>
					<div className="body">
						{this.state.filteredItems && this.state.filteredItems.length ? this.state.filteredItems.map((element, index) => {
							return (
								<div className="flex-container">
									<div className="col-lg-2">
										<div className="wrapp">
											<p className="simple">{element.Name + " " + element.Secondname}</p>
										</div>
									</div>
									<div className="col-lg-2">
										<div className="wrapp">
											<p className="simple">{element.Phone}</p>
										</div>
									</div>
									<div className="col-lg-2">
										<div className="wrapp">
											<p className="simple">{element.Mail}</p>
										</div>
									</div>
									<div className="col-lg-2">
										<div className="wrapp">
											<p className="simple">{element.Date}</p>
										</div>
									</div>
									<div className="col-lg-3">
										<div className="wrapp">
											<div className="text">
												<p dangerouslySetInnerHTML={{__html: nl2br(element.Msg)}}></p>
											</div>
										</div>
									</div>
									<div className="col-lg-1">
										<div className="wrapp">
											<div className="checkboxes-and-radios">
												<input type="checkbox"
													onChange={this.handleChange.bind(this, element.Id)}
													name="checkbox-cats"
													checked={element.Done}
													id={"checkbox_" + index}
												/>
												<label htmlFor={"checkbox_" + index}></label>
											</div>
										</div>
									</div>
								</div>
							);
						}) : null}
					</div>
				</div>
			</div>
		)
	}
}