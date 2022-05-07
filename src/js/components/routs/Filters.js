import React, { Component } from 'react';
import EditorForTitle from "../tools/EditorForTitle";
import SweetAlert from 'sweetalert2';

export default class Filters extends Component {
	constructor(props){
		super(props);
		this.state = {
			filterTypes: [],
			filters: []
		}
		this.getItems = this.getItems.bind(this);
		this.addFamily = this.addFamily.bind(this);
		this.editFilterTypes = this.editFilterTypes.bind(this);
		this.updateFilterTypes = this.updateFilterTypes.bind(this);
		this.editFilters = this.editFilters.bind(this);
		this.updateFilters = this.updateFilters.bind(this);
	}
	componentDidMount(){
		this.getItems();
	}
	editFilters(data) {
		let filters = this.state.filters;
		filters.find(x => x.Id == data.itemId)[data.paramName] = data.value;
		this.setState({filters});
	}
	updateFilters(data){
		let val = {
			token: localStorage.token,
			role: localStorage.role,
			funcName: 'editFilters',
			itemId: data.itemId,
			paramName: data.paramName,
			value: data.value
		};
		$.ajax({
			url: globalServer + 'new-api/filters.php',
			type: 'POST',
			data: val,
		}).done(function(data) {
		}.bind(this)).fail(function() {	console.log("error"); });
	}
	editFilterTypes(data) {
		let filterTypes = this.state.filterTypes;
		filterTypes.find(x => x.Id == data.itemId)[data.paramName] = data.value;
		this.setState({filterTypes});
	}
	updateFilterTypes(data){
		let val = {
			token: localStorage.token,
			role: localStorage.role,
			funcName: 'editFilterTypes',
			itemId: data.itemId,
			paramName: data.paramName,
			value: data.value
		};
		$.ajax({
			url: globalServer + 'new-api/filters.php',
			type: 'POST',
			data: val,
		}).done(function(data) {
		}.bind(this)).fail(function() {	console.log("error"); });
	}
	addFilter(typeId){
		let val = {
			token: localStorage.token,
			role: localStorage.role,
			funcName: 'addFilter',
			typeId: typeId
		};
		$.ajax({
			url: globalServer + 'new-api/filters.php',
			type: 'POST',
			data: val,
		}).done(function(data) {
			if (data.result == 'success') {
				let filters = this.state.filters;
				filters.push(JSON.parse(data.item));
				this.setState({filters});
			}
		}.bind(this)).fail(function() {	console.log("error"); });
	}
	addFamily(){
		let val = {
			token: localStorage.token,
			role: localStorage.role,
			funcName: 'addFamily'
		};
		$.ajax({
			url: globalServer + 'new-api/filters.php',
			type: 'POST',
			data: val,
		}).done(function(data) {
			if (data.result == 'success') {
				let filterTypes = this.state.filterTypes;
				filterTypes.push(JSON.parse(data.item));
				this.setState({filterTypes});
			}
		}.bind(this)).fail(function() {	console.log("error"); });
	}
	getItems(){
		let val = {
			token: localStorage.token,
			role: localStorage.role,
			funcName: 'viewItems'
		};
		$.ajax({
			url: globalServer + 'new-api/filters.php',
			type: 'POST',
			data: val,
		}).done(function(data) {
			this.setState({
				filterTypes: JSON.parse(data.filterTypes).FilterTypess,
				filters: JSON.parse(data.filters).Filterss,
			});
		}.bind(this)).fail(function() {	console.log("error"); });
	}
	deleteItem(id, type){
		debugger;
		SweetAlert({
			title: 'האם אתה בטוח?',
			text: 'האם ברצונך למחוק פריט זה? לא תוכל לשחזר זאת!',
			type: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#22b09a',
			cancelButtonColor: '#d80028',
			confirmButtonText: 'מחק',
			cancelButtonText: 'בטל'
		}).then(function(id, type, res) {
			if (res.value) {
				let data = {
					itemId: id,
					paramName: 'Unpublished',
					value: 1
				}
				if (type == 'filter') {
					this.updateFilters(data);
					let filters = this.state.filters.filter(item => item.Id != id);
					this.setState({filters});
				} else {
					this.updateFilterTypes(data);
					let filterTypes = this.state.filterTypes.filter(item => item.Id != id);
					this.setState({filterTypes});
				}
			}
		}.bind(this, id, type)).catch(SweetAlert.noop);
	}
	render(){
		return (
			<div className="page-container filters">
				<div className="container">
					<h1 className="title">סינון</h1>
					<div className="flex-container">
						{this.state.filterTypes.map((element, index) => {
							return(
								<div className="col-lg-4" key={index}>
									<div className="wrapper">
										<div className="main-tite">
											<EditorForTitle
												element={element}
												editItems={this.editFilterTypes}
												updateItems={this.updateFilterTypes}
												lang={this.props.state.lang}
												paramName={'Title'}
												dist="filter_types"
											/>
										</div>
										<ul>
											{this.state.filters.map((e, i) => {
												if (e.TypeId == element.Id) {
													return(
														<li key={i}>
															<div className="sub-title">
																<EditorForTitle
																	element={e}
																	editItems={this.editFilters}
																	updateItems={this.updateFilters}
																	lang={this.props.state.lang}
																	paramName={'Title'}
																	dist="filters"
																/>
																<div onClick={this.deleteItem.bind(this, e.Id, 'filter')} className={this.props.state.lang =='he' ? "delete-item he" : "delete-item ru"}>
																	<img src={globalFileServer + 'icons/trash-white.svg'} alt=""/>
																</div>
															</div>
														</li>
													);
												}
											})}
										</ul>
										<div className="add-item">
											<button onClick={this.addFilter.bind(this, element.Id)} className="regular">
												<img src={globalFileServer + 'icons/plus-dark.svg'} alt=""/>
												<span>{this.props.state.lang == 'he' ? 'הוסף פילטר' : 'добавить фильтр'}</span>
											</button>
											<button onClick={this.deleteItem.bind(this, element.Id, 'filterType')} className={this.props.state.lang =='he' ? "delete-item regular he" : "delete-item regular ru"}>
												<img src={globalFileServer + 'icons/trash-dark.svg'} alt=""/>
												<span>{this.props.state.lang == 'he' ? 'מחק פריט' : 'удалить элемент'}</span>
											</button>
										</div>
									</div>
								</div>
							);
						})}
					</div>
					<div className="add-item">
						<button onClick={this.addFamily} className="regular">
							<img src={globalFileServer + 'icons/plus-dark.svg'} alt=""/>
							<span>{this.props.state.lang == 'he' ? 'הוסף משפחה' : 'добавить категорию'}</span>
						</button>
					</div>
				</div>
			</div>
		)
	}
}
