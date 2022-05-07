import ReactDOM from "react-dom";
import React, { Component, Fragment } from 'react';
import { NavLink } from "react-router-dom";
import MyCropper from "../tools/MyCropper";
import SweetAlert from 'sweetalert2';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

export default class CategoriesEdit extends Component {
	constructor(props){
		super(props);
		this.state = {
			categories: [],
			constCategories: [],
			preload: false,
			masc: false,
			search: "",
			seo: false,
			load: false,
      monthArr:[],
      yearArr:[],
      selectedMonth:0,
      selectedYear:0
		}
		this.setPreload = this.setPreload.bind(this);
		this.unsetPreload = this.unsetPreload.bind(this);
		this.editItem = this.editItem.bind(this);
		this.addItem = this.addItem.bind(this);
		this.search = this.search.bind(this);
		this.clearSearch = this.clearSearch.bind(this);
    this.selectMonth = this.selectMonth.bind(this);
    this.selectYear = this.selectYear.bind(this);


	}
	componentDidMount(){
		this.getCategories();
		window.scrollTo(0, 0);
		setTimeout(() => window.scrollTo(0, 0), 100);

    let monthArr = [{Id:1,Title:"ינואר"},
                    {Id:2,Title:"פברואר"},
                    {Id:3,Title:"מרץ"},
                    {Id:4,Title:"אפריל"},
                    {Id:5,Title:"מאי"},
                    {Id:6,Title:"יוני"},
                    {Id:7,Title:"יולי"},
                    {Id:8,Title:"אוגוסט"},
                    {Id:9,Title:"ספטמבר"},
                    {Id:10,Title:"אוקטובר"},
                    {Id:11,Title:"נובמבר"},
                    {Id:12,Title:"דצמבר"},

                  ];

    let yearArr = [{Id:1,Title:"2020"},
                    {Id:2,Title:"2021"},
                    {Id:3,Title:"2022"},
                    {Id:4,Title:"2023"},
                    {Id:5,Title:"2024"},
                    {Id:6,Title:"2025"}
                  ];

    this.setState({monthArr, yearArr})



	}
	componentWillReceiveProps(nextProps){

		if (this.props.match.params.parentId != nextProps.match.params.parentId || this.props.match.params.subId != nextProps.match.params.subId) {


      let prevId = parseInt(this.props.match.params.id);
			let nextId = parseInt(nextProps.match.params.id);
			var id = this.props.match.params.id;

      this.setState({categories: this.state.constCategories, search: ""});
      //debugger;


      setTimeout(() => {window.scrollTo(0, 0)}, 200);
      /*
			if (nextId) {
				setTimeout(() => {window.scrollTo(0, 0)}, 200);
			} else {
				setTimeout(() => {
					let element = document.getElementById('item_' + id);
					element.scrollIntoView({block: "center"});
				}, 200);
			}
      */

		}
	}
	toggleSeo(id){
		if (this.state.seo == id) {
			this.setState({seo: false})
		} else {
			this.setState({seo: id})
		}
	}
	search(e){
		let search = e.target.value;
    let id = parseInt(this.props.match.params.parentId);
    let subId = parseInt(this.props.match.params.subId);
		let categories = [];



    if(!id && !subId){
      categories = this.state.constCategories.filter(item => !item.ParentId && !item.SubParentId && item.Title && item.Title.includes(search));

    }else if(id && !subId){
      categories = this.state.constCategories.filter(item => item.ParentId == id && !item.SubParentId && item.Title && item.Title.includes(search));
    }else{

      categories = this.state.constCategories.filter(item => item.SubParentId == id && item.Title && item.Title.includes(search));

    }
    this.setState({categories, search});
    /*
    debugger;
		if (!id) {
			categories = this.state.constCategories.filter(x => x.Title.includes(search) && !x.ParentId);
		} else {
			categories = this.state.constCategories.filter(x => x.Title.includes(search) && x.ParentId == id);
		}
		this.setState({categories, search});
    */
	}
	clearSearch(){
		this.setState({categories: this.state.constCategories, search: ""});
	}
	deleteItem(id){
		this.setPreload();
		SweetAlert({
			title: 'האם אתה בטוח?',
			text: 'האם ברצונך למחוק פריט זה? לא תוכל לשחזר זאת!',
			type: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#22b09a',
			cancelButtonColor: '#d80028',
			confirmButtonText: 'מחק',
			cancelButtonText: 'בטל'
		}).then(function(id, res) {
			if (res.value) {
				let ParentId = parseInt(this.props.match.params.id);
				let val = {
					token: localStorage.token,
					role: localStorage.role,
					funcName: 'deleteItem',
					itemId: id,
					parent: ParentId ? ParentId : null
				};

				$.ajax({
					url: globalServer + 'categories.php',
					type: 'POST',
					data: val,
				}).done(function(data) {
					if (data.result != "error") {
						this.setState({categories: data.Categoriess, constCategories: data.Categoriess});
					}
					this.unsetPreload();
				}.bind(this)).fail(function() {	console.log("error"); });

			} else {
				this.unsetPreload();
			}
		}.bind(this, id)).catch(SweetAlert.noop);
	}
	addItem(){
		let id = parseInt(this.props.match.params.parentId);
    let subId = parseInt(this.props.match.params.subId);

		let val = {
			token: localStorage.token,
			role: localStorage.role,
			funcName: 'addItem',
			parent: id ? id : null,
      subId: subId ? subId : null
		};


		$.ajax({
			url: globalServer + 'categories.php',
			type: 'POST',
			data: val,
		}).done(function(data) {
			let categories = this.state.categories;
			categories.push(data);
			categories.sort((a, b) => { return a.Orden - b.Orden });
			this.setState({categories, constCategories: categories});
			setTimeout(() => {
				let element = document.getElementById('input_' + data.Id);
				element.scrollIntoView({block: "center"});
				element.focus();
			}, 200);
		}.bind(this)).fail(function() {	console.log("error"); });

	}
	getCategories = async() => {

    const val = {
      funcName: 'getAllItems',
      point: 'categories'
    };
    try {
      const data = await this.props.ajax(val);
      this.setState({categories: data.Categoriess, constCategories: data.Categoriess, load: true});
    } catch(err) {
      console.log('connection error GetSales');
    }


    const val2 = {
      funcName: 'getAlonDates',
      point: 'categories'
    };
    try {
      const data = await this.props.ajax(val2);

      let tmpMonth = parseInt(data.month);
      let tmpYear = data.year;


      let findYear = this.state.yearArr.filter((item) => {return item.Title == tmpYear});

      this.setState({selectedMonth: tmpMonth, selectedYear: findYear[0].Id});
      let elementMonth = document.getElementById('monthPicker');
      elementMonth.value = tmpMonth;

      let elementYear = document.getElementById('yearPicker');
      elementYear.value = findYear[0].Id;



    } catch(err) {
      //this.props.connectionError('connection error GetSales');
      console.log('connection error GetSales');
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








	editItem(value, id, paramName){
		let categories = this.state.categories;
		categories.find(x => x.Id == id)[paramName] = value;
		this.setState({categories, constCategories: categories});
	}
	updateItems = async (value, id, paramName) => {
		let categories = this.state.categories;
		categories.find(x => x.Id == id)[paramName] = value;
		this.setState({categories, constCategories: categories});

    const val = {
      funcName: 'editItem',
      point: 'categories',
      token: localStorage.token,
			role: localStorage.role,
			funcName: 'editItem',
			itemId: id,
			paramName: paramName,
			value: value
    };

    try {
      const data = await this.props.ajax(val);
    } catch(err) {
      //this.props.connectionError('connection error GetSales');
      console.log('connection error editItem');
    }

	}
	uploadImg = async (data) => {
		this.setPreload();
    const val = {
      funcName: 'uploadImg',
      point: 'categories',
      token: localStorage.token,
			role: localStorage.role,
			fileName: data.itemId + data.fileName,
			img: data.img,
			folder: data.folder,
			itemId: data.itemId
    };
debugger;
    try {
      const data = await this.props.ajax(val);

      let categories = this.state.categories;
      categories.find(x => x.Id == val.itemId).Img = val.fileName;
      this.setState({categories});
      this.unsetPreload();

    } catch(err) {
      //this.props.connectionError('connection error GetSales');
      console.log('connection error GetSales');
    }

	}
	binaryUpload(e){
		this.setState({preload: true});
		let url = globalServer + 'sheet_handler.php',
		files = e.target.files,
		formData = new FormData(e.target.parentElement);
		formData.append('dir', 'excel');
		formData.append('funcName', 'binaryUpload');
		let fetchData = {
			method: 'POST',
			body: formData,
			headers: new Headers()
		};
		fetch(url, fetchData).then((resp) => resp.json())
		.then(function(data) {
			if (data.result == "success") {
				SweetAlert({
					title: 'המערכת עודכנה בהצלחה',
					type: 'success',
					timer: 3000,
					showConfirmButton: false,
				}).then(function () {
					location.reload();
				}.bind(this)).catch(SweetAlert.noop);
			}
			if (data.result == "error" || data.result == "size error") {
				SweetAlert({
					title: 'איראה שגיאה. אנא נסה שנית',
					type: 'error',
					timer: 3000,
					showConfirmButton: false,
				}).then(function () {
					location.reload();
				}.bind(this)).catch(SweetAlert.noop);
			}
			this.setState({preload: false});
		}.bind(this)).catch(function(error) {
			this.setState({preload: false});
		}.bind(this));
	}


  reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  getItemStyle = (isDragging, draggableStyle) => ({
    userSelect: "none",
    background: isDragging ? "#f9f9f9" : "#fff",
    ...draggableStyle
  });

  getListStyle = isDraggingOver => ({
    background: isDraggingOver ? "#e5e5e5" : "#ddd",
  });

  onDragEnd = (result) => {

    if (!result.destination) {
      return;
    }

    let id = parseInt(this.props.match.params.parentId);
    let subId = parseInt(this.props.match.params.subId);

    let parent = this.state.constCategories.filter(item => item.Id == id);
    let mainParent;

		let categories;

    if(!id && !subId){
      categories = this.state.categories.filter(item => !item.ParentId);
    }else if(id && !subId){
      categories = this.state.categories.filter(item => item.ParentId == id && item.LvlNumber == '2');
    }else{
      categories = this.state.categories.filter(item => item.ParentId == id && item.LvlNumber == '3');
    }


    const categoriesReorder = this.reorder(
      categories,
      result.source.index,
      result.destination.index
    );

    //this.setState({ categories : categoriesReorder});
		this.setNewOrder(categoriesReorder);

  }
	setNewOrder = async (items) => {

		let newOrder = [];
    let findItem;
    let categories= this.state.categories;
		items.map((element, index) => {
      element.Orden = index;
      categories.find(item => item.Id == element.Id).Orden = index;
		});
    categories.sort((a, b) => (a.Orden > b.Orden) ? 1 : -1)

    this.setState({ categories});

    const val = {
      funcName: 'orderItems',
      point: 'categories',
      token: localStorage.token,
      role: localStorage.role,
      items: JSON.stringify(items)
    };
    try {
      const data = await this.props.ajax(val);
    } catch(err) {
      //this.props.connectionError('connection error GetSales');
      console.log('connection error orderItems');
    }


	}
  selectMonth(event){

    let tmpMonth = parseInt(event.target.value);

    this.setState({selectedMonth: tmpMonth});
    this.updateAlonDates(tmpMonth ,this.state.selectedYear);

  }

  selectYear(event){

    let tmpYear = event.target.value;
    this.updateAlonDates(this.state.selectedMonth ,tmpYear);

    this.setState({selectedYear:tmpYear});

  }
  updateAlonDates = async(month, year) => {

    let findYear = this.state.yearArr.filter((item) => {return item.Id == year})[0].Title;

    const val = {
      month: month,
      year: findYear,

    };
    const valAjax = {
      funcName: 'updateAlonDates',
      point: 'categories',
      val:val
    };

    try {
      const data = await this.props.ajax(valAjax);

    } catch(err) {
      console.log('connection error GetSales');
    }



  }

	render(){
		if (this.state.constCategories.length || this.state.load) {
		let id = parseInt(this.props.match.params.parentId);
    let subId = parseInt(this.props.match.params.subId);

    let parent = this.state.constCategories.filter(item => item.Id == id);
    let mainParent;

		let categories;
    if(!id && !subId){
      categories = this.state.categories.filter(item => !item.ParentId);
    }else if(id && !subId){
      categories = this.state.categories.filter(item => item.ParentId == id && item.LvlNumber == '2');
    }else{
      categories = this.state.categories.filter(item => item.ParentId == subId && item.LvlNumber == '3');
      mainParent = this.state.constCategories.filter(item => item.Id == subId);
    }

    categories.sort((a, b) => (a.Orden > b.Orden) ? 1 : -1)

		return (
			<div className="category-edit">
				<div className="breadcrumbs">
					<div className="container">
						<div className="flex-container">
							<div className="col-lg-6">
								{id ?
									<h1>
										<span>{parent.length ? parent[0].Title : null}</span>
									</h1>
								:
								<h1>ניהול קטגוריות</h1>
								}
							</div>
							<div className="col-lg-6">
								<ul>
									<li>
										<NavLink to="/"><img src={globalFileServer + 'icons/home.svg'} alt=""/></NavLink>
									</li>
									{id ?
										<Fragment>
											<li>
												<NavLink to="/category-edit/0/0">כל הקטגוריות</NavLink>
											</li>
                      {subId ?
                        <li>
                          <NavLink to={"/category-edit/"+ mainParent[0].Id +"/0"}>
                            <p>{mainParent[0].Title}</p>
                          </NavLink>
                        </li>
                        :
                        <li>
  												<a>{parent[0].Title}</a>
  											</li>
                      }
                      {subId ?
                        <li>
                          {parent[0].Title}
                        </li>
                      :null}
										</Fragment>
									:
									<li>
										<span>כל הקטגוריות</span>
									</li>
									}

								</ul>
							</div>
						</div>
					</div>
				</div>
				<div className="container items-container">
					{this.state.preload ?
						<div className="spinner-wrapper">
							<div className="spinner">
								<div className="bounce1"></div>
								<div className="bounce2"></div>
								<div className="bounce3"></div>
							</div>
						</div>
					: null}
					<div className="add-item add-item-main">
						<div className="flex-container">
							<div className="col-lg-6 alon-main-container">
                <div className="alon-container flex-container">
                  <div className="h3-cont col-lg-3">
                    <p>עלון מבצעים</p>
                  </div>
                  <select id="monthPicker" className="col-lg-2" onChange={this.selectMonth}>
                    {this.state.monthArr.map((element, index) => {
                      return (
                        <option key={index} id={element.Id} value={element.Id}>{element.Title}</option>
                      )
                    })}
                  </select>

                  <select id="yearPicker" className="col-lg-2" onChange={this.selectYear}>
                    {this.state.yearArr.map((element, index) => {
                      return (
                        <option key={index} id={element.Id} value={element.Id}>{element.Title}</option>
                      )
                    })}
                  </select>


                </div>
                {/*
								<form encType="multipart/form-data">
									<div className="masc">
										<p>
											<img src={globalFileServer + 'icons/ui.svg'} />
											<span>עדכון מערכת</span>
										</p>
									</div>
									<input onChange={e => this.binaryUpload(e)} accept="xls/xlsx" type="file" name='file_upload' />
								</form>
                  */}
							</div>
							<div className="col-lg-6">
								<div className="search">
									<input
										onChange={this.search}
										value={this.state.search}
										type="text"
										placeholder="חיפוש..."
									/>
									{this.state.search ?
										<img className="close" onClick={this.clearSearch} src={globalFileServer + "icons/close.svg"} alt=""/>
									:
									<img src={globalFileServer + "icons/search.svg"} alt=""/>
									}
								</div>
							</div>
						</div>
					</div>
					<div className="items">
						<div className="heading">
							<div className="flex-container">
								<div className="col-lg-1">
									<p>כניסה</p>
								</div>
								<div className="col-lg-1">
									<p>סדר</p>
								</div>
  								<div className="col-lg-2">
                    {this.props.match.params.subId =='0' || !this.props.match.params.subId =='0'?

  									  <p>תמונה</p>
                    :null}
  								</div>
                <div className="col-lg-1 product">
									<p style={{textAlign: 'right'}}>מזהה</p>
								</div>
								<div className={id && !subId ? "col-lg-3 product" : "col-lg-4 product"}>
									<p style={{textAlign: 'right'}}>כותרת</p>
								</div>
								<div className="col-lg-1">
									<p>סטאטוס</p>
								</div>
								<div className="col-lg-1">
                {/*
									<p>seo</p>
                  */}
								</div>
              {/*
								<div className="col-lg-1">
									<p>מחק</p>
								</div>
                */}
							</div>
						</div>

            <DragDropContext onDragEnd={this.onDragEnd}>
  						<Droppable droppableId="droppable">
  							{(provided, snapshot) => (
  							<div className="items" {...provided.droppableProps} ref={provided.innerRef} style={this.getListStyle(snapshot.isDraggingOver)}>
                  {categories.map((element, index) => {
                    let is_lvl3 = this.state.categories.filter((item) => {return item.ParentId == element.Id && item.LvlNumber == '3'});
                    let is_lvl2 = this.state.categories.filter((item) => {return item.ParentId == element.Id && item.LvlNumber == '2'});

                    return(
                      <div key={index} id={"item_" + element.Id} className="item">
                        <Draggable key={element.Id} draggableId={element.Id + ''} index={index}>
                          {(provided, snapshot) => (
                            <div
                              className="item"
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={this.getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
                              >

                              <div className="flex-container">
                                <div className="col-lg-1 enter">
                                  {!id && !subId ?
                                    <NavLink to={"/category-edit/" + element.Id + "/0" }>
                                      <img src={globalFileServer + "icons/enter.svg"} alt=""/>
                                    </NavLink>
                                  :
                                  <Fragment>

                                    {id && !subId ?
                                      <NavLink to={"/category-edit/" + id + "/" + element.Id}>
                                        <img src={globalFileServer + "icons/enter.svg"} alt=""/>
                                      </NavLink>
                                    :
                                      <NavLink to={ "/products-edit/" + id + "/" + subId + "/" + element.Id}>
                                        <img src={globalFileServer + "icons/enter.svg"} alt=""/>
                                      </NavLink>
                                    }

                                  </Fragment>
                                  }

                                </div>
                                <div className="col-lg-1 sort">
                                  <img src={globalFileServer + "icons/drag.svg"} alt=""/>
                                </div>
                                <div className="col-lg-2 for-img">
                                  {this.props.match.params.subId =='0' || !this.props.match.params.subId =='0'?
                                    <div
                                      onMouseOver={() => this.state.masc != element.Id ? this.setState({masc: element.Id}) : null}
                                      onMouseLeave={() => this.setState({masc: false})}
                                      className={element.Img ? "img-load active" : "img-load"}>
                                      {element.Img ?
                                        <Fragment>

                                          <img
                                            className="main-img"
                                            src={globalFileServer + 'categories/' + element.Img}
                                            onLoad={this.unsetPreload}
                                          />
                                        </Fragment>
                                      : null}
                                      <MyCropper
                                        aspectRatio={16/16} {...this}
                                        itemId={element.Id}
                                        folder="categories"
                                      />
                                    </div>
                                  :null}
                                </div>
                                <div className={"col-lg-1 title"}>
                                  <p>{element.Id}</p>
                                </div>
                                <div className={id && !subId ? "col-lg-3 title": "col-lg-4 title"}>
                                  <input
                                    id={'input_' + element.Id}
                                    type="text"
                                    placeholder="שם הקטגוריה"
                                    value={element.Title ? element.Title : ""}
                                    onChange={(e) => this.editItem(e.target.value, element.Id, 'Title')}
                                    onBlur={(e) => this.updateItems(e.target.value, element.Id, 'Title')}
                                  />
                                </div>

                                <div className="col-lg-1 status">
                                  {!element.Unpublished ?
                                    <div onClick={(e) => this.updateItems(1, element.Id, 'Unpublished')} className="input active">
                                      <img src={globalFileServer + "icons/done.svg"} alt=""/>
                                    </div>
                                  :
                                  <div onClick={(e) => this.updateItems(null, element.Id, 'Unpublished')} className="input">
                                    <img src={globalFileServer + "icons/cross-bold.svg"} alt=""/>
                                  </div>
                                  }
                                </div>
                                <div className="col-lg-1 seo">
                                  <div onClick={this.toggleSeo.bind(this, element.Id)} className="img">
                                    {/*
                                    <img src={globalFileServer + "icons/seo.svg"} alt=""/>
                                    */}
                                  </div>
                                </div>
                                {/*
                                <div className="col-lg-1 delete">
                                  <div className="img" onClick={this.deleteItem.bind(this, element.Id)}>
                                    <img src={globalFileServer + "icons/trash.svg"} alt=""/>
                                  </div>
                                </div>
                                */}
                                {this.state.seo == element.Id ? ReactDOM.createPortal(
                                  <div className="popup seo">
                                    <div className="popup-wrapper">
                                      <div onClick={this.toggleSeo.bind(this, element.Id)} className="close-popup">
                                        <img src={globalFileServer + 'icons/cross.svg'} alt="" />
                                      </div>
                                      <div className="wrapper">
                                        <h1>{element.Title}</h1>
                                        <h3>Meta title</h3>
                                        <textarea
                                          className="title"
                                          value={element.SeoTitle ? element.SeoTitle : ''}
                                          onChange={(e) => this.editItem(e.target.value, element.Id, 'SeoTitle')}
                                          onBlur={(e) => this.updateItems(e.target.value, element.Id, 'SeoTitle')}
                                        />
                                        <h3>Meta description</h3>
                                        <textarea
                                          value={element.SeoDescription ? element.SeoDescription : ''}
                                          onChange={(e) => this.editItem(e.target.value, element.Id, 'SeoDescription')}
                                          onBlur={(e) => this.updateItems(e.target.value, element.Id, 'SeoDescription')}
                                        />
                                        <h3>Keywords</h3>
                                        <textarea
                                          value={element.Keywords ? element.Keywords : ''}
                                          onChange={(e) => this.editItem(e.target.value, element.Id, 'Keywords')}
                                          onBlur={(e) => this.updateItems(e.target.value, element.Id, 'Keywords')}
                                        />
                                      </div>
                                    </div>
                                  </div>,
                                  document.getElementById('modal-root')
                                ) : null}
                              </div>
                            </div>
                          )}
  						 					</Draggable>
                      </div>
      							);
						      })}
                </div>
                )}
              </Droppable>
            </DragDropContext>
					</div>
				</div>
			</div>
		)
	} else return null;
	}
}
