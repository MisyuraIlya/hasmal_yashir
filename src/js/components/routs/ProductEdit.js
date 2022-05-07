import React, { Component, Fragment } from 'react';
import { NavLink } from "react-router-dom";
import MyCropper from "../tools/MyCropper";
import SweetAlert from 'sweetalert2';

export default class ProductEdit extends Component {
	constructor(props){
		super(props);
		this.state = {
			preload: false,
			product: false,
			categories: [],
			filterTypes: [],
			options: [],
			filters: [],
			openMain: false,
			openChild: false,
			mainCategoryId: false,
			replace: false
		}
		this.getProduct = this.getProduct.bind(this);
		this.uploadImg = this.uploadImg.bind(this);
		this.setPreload = this.setPreload.bind(this);
		this.unsetPreload = this.unsetPreload.bind(this);
		this.updateFilters = this.updateFilters.bind(this);
		this.addItem = this.addItem.bind(this);
		this.editItem = this.editItem.bind(this);
		this.updateItems = this.updateItems.bind(this);
	}
	componentDidMount(){
		this.getProduct(this.props.match.params.id);
		localStorage.setItem('prod', this.props.match.params.id);
		setTimeout(() => window.scrollTo(0, 0), 200);
	}
	componentWillUnmount(){
		if (!location.pathname.includes('/products-edit/')) {
			localStorage.removeItem('scrollY');
			localStorage.removeItem('currentPage');
			localStorage.removeItem('prod');
		}
	}
	setPreload(){
		this.setState({preload: true});
	}
	unsetPreload(){
		if (this.state.preload) {
			this.setState({preload: false});
		}
	}
	addItem(){
		let val = {
			token: localStorage.token,
			role: localStorage.role,
			funcName: 'addOption',
			itemId: this.state.product.Id
		};
		let url = globalServer + 'products.php';
		$.ajax({
			url: url,
			type: 'POST',
			data: val,
		}).done(function(data) {
			let options = this.state.options;
			options.push(data);
			this.setState({options});
			setTimeout(() => {
				let element = document.getElementById('input_' + data.Id);
				element.scrollIntoView({block: "center"});
				element.focus();
			}, 200);
		}.bind(this)).fail(function() {	console.log("error"); });
	}
	deleteItem(id){
		let options = this.state.options.filter(item => item.Id != id);
		this.setState({options});
		let val = {
			token: localStorage.token,
			role: localStorage.role,
			funcName: 'deleteOption',
			itemId: id,
			productId: this.state.product.Id
		};
		$.ajax({
			url: globalServer + 'products.php',
			type: 'POST',
			data: val,
		}).done(function(data) {
			this.setState({options: data.Optionss});
		}.bind(this)).fail(function() {	console.log("error"); });
	}
	editItem(value, id, paramName){
		let options = this.state.options;
		options.find(x => x.Id == id)[paramName] = value;
		this.setState({options});
	}
	updateItems(value, id, paramName) {
		let options = this.state.options;
		options.find(x => x.Id == id)[paramName] = value;
		this.setState({options});
		let val = {
			token: localStorage.token,
			role: localStorage.role,
			funcName: 'editOption',
			itemId: id,
			paramName: paramName,
			value: value
		};
		let url = globalServer + 'products.php';
		$.ajax({
			url: url,
			type: 'POST',
			data: val,
		}).done(function(data) {
		}.bind(this)).fail(function() {	console.log("error"); });
	}
	editProduct(value, id, paramName){
		let product = this.state.product;
		product[paramName] = value;
		this.setState({product});
	}
	updateProduct(value, id, paramName) {
		let product = this.state.product;
		product[paramName] = value;
		this.setState({product});
		let val = {
			token: localStorage.token,
			role: localStorage.role,
			funcName: 'editItem',
			itemId: id,
			paramName: paramName,
			value: value
		};
		let url = globalServer + 'products.php';
		$.ajax({
			url: url,
			type: 'POST',
			data: val,
		}).done(function(data) {
		}.bind(this)).fail(function() {	console.log("error"); });
	}
	setActive(id, active){
		let options = this.state.options;
		options.find(x => x.Id == id).Active = 1;
		this.setState({options});
		let val = {
			token: localStorage.token,
			role: localStorage.role,
			funcName: 'setActiveOption',
			itemId: id,
			productId: this.state.product.Id,
			value: 1
		};
		let url = globalServer + 'products.php';
		$.ajax({
			url: url,
			type: 'POST',
			data: val,
		}).done(function(data) {
			this.setState({options: data.Optionss});
		}.bind(this)).fail(function() {	console.log("error"); });
	}
	addFilter(id){
		let filter = this.state.filters.filter(item => item.Id == id)[0];
		let courseId = filter.CourseId ? filter.CourseId.split(',') : [];
		if (courseId.includes(this.state.product.Id + '')) {
			courseId = courseId.filter(item => item != this.state.product.Id + '');
		} else {
			courseId.push(this.state.product.Id + '');
		}
		let filters = this.state.filters;
		filters.find(x => x.Id == id).CourseId = courseId.join(',');
		this.setState({filters});
		let data = {
			itemId: id,
			paramName: 'CourseId',
			value: courseId.join(',')
		}
		this.updateFilters(data);
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
			url: globalServer + 'filters.php',
			type: 'POST',
			data: val,
		}).done(function(data) {
		}.bind(this)).fail(function() {	console.log("error"); });
	}
	saveCategory(id){
		localStorage.removeItem('prod');
		let product = this.state.product;
		product.CategoryId = id;
		this.setState({product, mainCategoryId:false, openMain: false, openChild: false});
		let paramName = 'CategoryId';
		let val = {
			token: localStorage.token,
			role: localStorage.role,
			funcName: 'editItem',
			itemId: product.Id,
			paramName: paramName,
			value: id
		};
		let url = globalServer + 'products.php';
		$.ajax({
			url: url,
			type: 'POST',
			data: val,
		}).done(function(data) {
		}.bind(this)).fail(function() {	console.log("error"); });
	}
	getProduct(id){
		let val = {funcName: 'getProductAdmin', id: id};
		$.ajax({
			url: globalServer + 'product_edit_admin.php',
			type: 'POST',
			data: val,
		}).done(function(data) {
			this.setState({
				product: data.Product,
				categories: data.Categories/*,
				filterTypes: data.FilterTypes,
				filters: data.Filters,
				options: data.Options*/
			});
		}.bind(this)).fail(function() {	console.log("error"); });
	}
	uploadImg(data){
		this.setPreload();
		let val = {
			'token': localStorage.token,
			'role': localStorage.role,
			'funcName': 'uploadImg',
			'fileName': data.itemId + data.fileName,
			'img': data.img,
			'folder': data.folder,
			'itemId': data.itemId
		};
		let images = this.state.product.Img ? this.state.product.Img.split(",") : [];
		if (data.paramName) {
			var foundIndex = images.indexOf(data.paramName);
			images[foundIndex] = data.itemId + data.fileName;
			images = images.join(",");
		} else {
			images.push(data.itemId + data.fileName);
			images = images.join(",");
		}
		val.images = images;
		$.ajax({
			url: globalServer + 'products.php',
			type: 'POST',
			data: val,
		}).done(function(val, data) {
			let product = this.state.product;
			product.Img = val.images;
			this.setState({product});
		}.bind(this, val)).fail(function() { this.props.showError() }.bind(this));
	}
	deleteImg(val){
		SweetAlert({
			title: 'האם אתה בטוח?',
			text: 'האם ברצונך למחוק פריט זה? לא תוכל לשחזר זאת!',
			type: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#22b09a',
			cancelButtonColor: '#d80028',
			confirmButtonText: 'מחק',
			cancelButtonText: 'בטל'
		}).then(function(val, res) {
			if (res.value) {
				let images = this.state.product.Img.split(",").filter(item => item != val);
				let product = this.state.product;
				product.Img = images.join(",");
				this.setState({product});
				this.updateProduct(images.join(","), product.Id, 'Img');
			}
		}.bind(this, val)).catch(SweetAlert.noop);
	}
	onDragLeave(index, img){
		this.setState({replace: img});
	}
	onDragEnd(index, img){
		let images = this.state.product.Img.split(",");
		let foundIndex = images.indexOf(this.state.replace);
		images[foundIndex] = img;
		images[index] = this.state.replace;
		images = images.join(",");
		let product = this.state.product;
		product.Img = images;
		this.setState({product, replace: false});
		this.updateProduct(images, product.Id, 'Img');
	}
	render(){
		if (this.state.product && this.state.categories.length) {
		let parentCategory = this.state.categories.filter(item => item.Id == this.state.product.CategoryId)[0];
		let parentId = parentCategory.ParentId;
		let categories = this.state.categories;
		let children = !this.state.mainCategoryId ? categories.filter(item => item.ParentId == parentId) : categories.filter(item => item.ParentId == this.state.mainCategoryId);
		let product = this.state.product;
		return (
			<div className="product-edit">
				<div className="breadcrumbs">
					<div className="container">
						<div className="flex-container">
							<div className="col-lg-6">
								<h1>עריכת מוצר</h1>
							</div>
							<div className="col-lg-6">
								<ul>
									<li>
										<NavLink to="/"><img src={globalFileServer + 'icons/home.svg'} alt=""/></NavLink>
									</li>
									<li>
										<span>{this.state.product.Title}</span>
									</li>
								</ul>
							</div>
						</div>
					</div>
				</div>
				<div className="container main-container">
					<div className="flex-container">
						<div className="col-lg-8 product-details">
							<div className="wrapper first">
								<div className="input">
									<h2>כותרת המוצר</h2>
									<input
										type="text"
										value={product.Title ? product.Title : ""}
										onChange={(e) => this.editProduct(e.target.value, product.Id, 'Title')}
										onBlur={(e) => this.updateProduct(e.target.value, product.Id, 'Title')}
									/>
								</div>
								<div className="textarea">
									<h2>תיאור מוצר</h2>
									<textarea
										value={product.Description ? product.Description : ""}
										onChange={(e) => this.editProduct(e.target.value, product.Id, 'Description')}
										onBlur={(e) => this.updateProduct(e.target.value, product.Id, 'Description')}
									/>
								</div>
							</div>
							<div className="wrapper pricing">
								<div className="add-item">
									<button onClick={this.addItem}>
										<img src={globalFileServer + "icons/plus.svg"} alt=""/>
										<span>הוסף אופציה</span>
									</button>
								</div>
								{this.state.options.length ?
									<div className="heading">
										<div className="flex-container">
											<div className="col-lg-4 title">
												<p>כותרת</p>
											</div>
											<div className="col-lg-2">
												<p>מחיר</p>
											</div>
											<div className="col-lg-2">
												<p>הנחה</p>
											</div>
											<div className="col-lg-2">
												<p>מק"ט</p>
											</div>
											<div className="col-lg-1 center">
												<p>דיפולט</p>
											</div>
											<div className="col-lg-1 center">
												<p>מחק</p>
											</div>
										</div>
									</div>
								: null}
								<div className="items">
									{this.state.options.map((element, index) => {
										return(
											<div key={index} className="flex-container">
												<div className="col-lg-4 title">
													<div className="wrapp">
														<input
															id={'input_' + element.Id}
															type="text"
															placeholder="כותרת"
															value={element.Title ? element.Title : ""}
															onChange={(e) => this.editItem(e.target.value, element.Id, 'Title')}
															onBlur={(e) => this.updateItems(e.target.value, element.Id, 'Title')}
														/>
													</div>
												</div>
												<div className="col-lg-2 price">
													<div className="wrapp">
														<input
															type="text"
															placeholder="מחיר"
															value={element.Price ? element.Price : ""}
															onChange={(e) => this.editItem(e.target.value, element.Id, 'Price')}
															onBlur={(e) => this.updateItems(e.target.value, element.Id, 'Price')}
														/>
													</div>
												</div>
												<div className="col-lg-2">
													<div className="wrapp">
														<input
															type="text"
															placeholder="הנחה"
															value={element.Discount ? element.Discount : ""}
															onChange={(e) => this.editItem(e.target.value, element.Id, 'Discount')}
															onBlur={(e) => this.updateItems(e.target.value, element.Id, 'Discount')}
														/>
													</div>
												</div>
												<div className="col-lg-2">
													<div className="wrapp">
														<input
															type="text"
															placeholder='מק"ט'
															value={element.CatalogNumber ? element.CatalogNumber : ""}
															onChange={(e) => this.editItem(e.target.value, element.Id, 'CatalogNumber')}
															onBlur={(e) => this.updateItems(e.target.value, element.Id, 'CatalogNumber')}
														/>
													</div>
												</div>
												<div className="col-lg-1 center">
													<div onClick={!element.Active ? this.setActive.bind(this, element.Id, 1) : null} className="img">
														{element.Active ?
															<img src={globalFileServer + "icons/star-full.svg"} alt=""/>
														:
														<img src={globalFileServer + "icons/star.svg"} alt=""/>
														}
													</div>
												</div>
												<div className="col-lg-1 center">
													<div className="img" onClick={this.deleteItem.bind(this, element.Id)}>
														<img src={globalFileServer + "icons/trash.svg"} alt=""/>
													</div>
												</div>
											</div>
										);
									})}
								</div>
							</div>
							<div className="wrapper images">
								{this.state.preload ?
									<div className="spinner-wrapper">
										<div className="spinner">
											<div className="bounce1"></div>
											<div className="bounce2"></div>
											<div className="bounce3"></div>
										</div>
									</div>
								: null}
								<div className="add-item">
									<button>
										<img src={globalFileServer + "icons/plus.svg"} alt=""/>
										<span>הוסף תמונה</span>
									</button>
									<MyCropper
										aspectRatio={16/16} {...this}
										itemId={product.Id}
										folder="products"
									/>
								</div>
								<div className="images-wrapper flex-container">
									{product.Img ? product.Img.split(',').map((element, index) => {
										return(
											<div
												key={index} className={this.state.replace == element ? "col-lg-4 active" : "col-lg-4"}
												draggable={true}
												onDragLeave={this.onDragLeave.bind(this, index, element)}
												onDragEnd={this.onDragEnd.bind(this, index, element)}
											>
												<div className="img-load active">
													<MyCropper
														aspectRatio={16/16} {...this}
														itemId={product.Id}
														folder="products"
														dist={element}
													/>
													<img
														className="main-img" onLoad={this.unsetPreload}
														src={globalFileServer + "products/" + element}
													/>
													<div onClick={this.deleteImg.bind(this, element)} className="delete">
														<img src={globalFileServer + "icons/trash-white.svg"} alt=""/>
													</div>
												</div>
											</div>
										);
									}) : null}
								</div>
							</div>
							<div className="wrapper seo">
								<h3>Meta title</h3>
								<textarea
									className="title"
									value={product.SeoTitle ? product.SeoTitle : ''}
									onChange={(e) => this.editProduct(e.target.value, product.Id, 'SeoTitle')}
									onBlur={(e) => this.updateProduct(e.target.value, product.Id, 'SeoTitle')}
								/>
								<h3>Meta description</h3>
								<textarea
									value={product.SeoDescription ? product.SeoDescription : ''}
									onChange={(e) => this.editProduct(e.target.value, product.Id, 'SeoDescription')}
									onBlur={(e) => this.updateProduct(e.target.value, product.Id, 'SeoDescription')}
								/>
								<h3>Keywords</h3>
								<textarea
									value={product.Keywords ? product.Keywords : ''}
									onChange={(e) => this.editProduct(e.target.value, product.Id, 'Keywords')}
									onBlur={(e) => this.updateProduct(e.target.value, product.Id, 'Keywords')}
								/>
							</div>
						</div>
						<div className="col-lg-4 product-options">
							<div className="wrapper categories">
								<h2>בחר קטגוריה</h2>
								<div className={this.state.openMain ? "select active" : "select"}>
									<div onClick={() => this.setState({openMain: !this.state.openMain, openChild: false})} className="headind">
										<p>{!this.state.mainCategoryId ? categories.filter(item => item.Id == parentId)[0].Title : categories.filter(item => item.Id == this.state.mainCategoryId)[0].Title}</p>
										<div className="img">
											<img src={globalFileServer + "icons/down-chevron.svg"} alt=""/>
										</div>
									</div>
									<div className={this.state.openMain ? "masc active" : "masc"}>
										<ul>
											{categories.map((element, index) => {
												if (!element.ParentId) {
													return(
														<li key={index}>
															<a className={!this.state.mainCategoryId && parentId == element.Id  || this.state.mainCategoryId && this.state.mainCategoryId == element.Id ? 'active' : null}
																onClick={() => this.setState({openMain: false, openChild: false, mainCategoryId: element.Id})}>
																<span>{element.Title}</span>
																<div className="img">
																	<img src={globalFileServer + 'icons/back.svg'} alt=""/>
																</div>
															</a>
														</li>
													);
												}
											})}
										</ul>
									</div>
								</div>
								<h2>בחר תת קטגוריה</h2>
								<div className={this.state.openChild ? "select active" : "select"}>
									<div onClick={() => this.setState({openChild: !this.state.openChild, openMain: false})} className="headind">
										<p>{!this.state.mainCategoryId || this.state.mainCategoryId == parentId ? categories.filter(item => item.Id == product.CategoryId)[0].Title : 'בחר תת קטגוריה'}</p>
										<div className="img">
											<img src={globalFileServer + "icons/down-chevron.svg"} alt=""/>
										</div>
									</div>
									<div id={children.length > 7 ? "big-menu" : null} className={this.state.openChild ? "masc active" : "masc"}>
										<ul className="wrapp">
											{children.map((element, index) => {
												return(
													<li key={index}>
														<a onClick={this.saveCategory.bind(this, element.Id)} className={element.Id == product.CategoryId ? 'active' : null}>
															<span>{element.Title}</span>
															<div className="img">
																<img src={globalFileServer + 'icons/back.svg'} alt=""/>
															</div>
														</a>
													</li>
												);
											})}
										</ul>
									</div>
								</div>
							</div>
							<div className="wrapper settings">
								<h2>בחר שדות למיין</h2>
								{this.state.filterTypes.map((element, index) => {
									return(
										<div key={index} className="items">
											<div className="wrapp">
												<h3>{element.Title}</h3>
												<div className="search-box">
													{this.state.filters.map((e, i) => {
														if (e.TypeId == element.Id) {
															return (
																<div key={i} className="item" onClick={this.addFilter.bind(this, e.Id)}>
																	<span className={e.CourseId && e.CourseId.split(",").includes(product.Id + '') ? "check active" : "check"}>
																		{e.CourseId && e.CourseId.split(",").includes(product.Id + '') ? <img src={globalFileServer + 'icons/done.svg'} alt=""/> : null}
																	</span>
																	<span className="title">{e.Title}</span>
																	<div className="img">
																		<img src={globalFileServer + 'icons/back.svg'} alt=""/>
																	</div>
																</div>
															);
														}
													})}
												</div>
											</div>
										</div>
									);
								})}
							</div>
						</div>
					</div>
				</div>
			</div>
		)
	} else return null;
	}
}
