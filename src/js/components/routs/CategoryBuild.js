import ReactDOM from "react-dom";
import React, { Component, Fragment, useState, useEffect, useRef } from "react";
import { NavLink } from "react-router-dom";
import MyCropper from "../tools/MyCropper";
import SweetAlert from 'sweetalert2';

import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";



const AddCategoryMode = (params) => {

  const [mainCategories, setMainCategories] = useState([]);
  const [fixedCats, setFixedCats] = useState([]);



  useEffect(() => {
    //console.log("booooommm");
    //
    // let categories = params.categories.filter(item => !item.ExtId );
    // categories.reverse();
    //
    // setFixedCats(JSON.stringify(categories));
    // setMainCategories(categories);

  }, [params.categories]);

  let categories = params.categories.filter(item => !item.ExtId );
  categories.reverse();
  return(
    <div className="items">
      <div className="heading">
        <div className="flex-container">
          <div className="col-lg-2">
            <p>תמונה</p>
          </div>
          <div className="col-lg-1 product">
            <p style={{textAlign: 'right'}}>מזהה</p>
          </div>
          <div className={"col-lg-4 product"}>
            <p style={{textAlign: 'right'}}>כותרת</p>
          </div>
          <div className="col-lg-1">
            <p style={{textAlign: 'center'}}>מחק</p>
          </div>
        </div>
      </div>

      <div className="items" >
        {categories && categories.length ? categories.map((element, index) => {
          return(
            <div key={index} id={"item_" + element.Id} className="item">
              <div className="flex-container">
                <div className="col-lg-2 for-img">
                  <div
                    className={element.Img ? "img-load active" : "img-load"}>
                    {element.Img ?
                      <Fragment>
                        <img
                          className="main-img"
                          src={globalFileServer + 'categories/' + element.Img}
                        />
                      </Fragment>
                    : null}
                  </div>
                </div>
                <div className={"col-lg-1 title"}>
                  <p>{element.Id}</p>
                </div>
                <div className={"col-lg-4 title"}>
                  <input
                    id={'input_' + element.Id}
                    type="text"
                    placeholder="שם הקטגוריה"
                    value={element.Title ? element.Title : ""}
                    onChange={(e) => params.editItem(e.target.value, element.Id, 'Title')}
                    onBlur={(e) => params.updateItems(e.target.value, element.Id, 'Title')}
                  />
                </div>
                <div className="col-lg-1 delete">

                  <div className="img" onClick={() => params.deleteItem(element.Id)}>
                    <img src={globalFileServer + "icons/trash.svg"} alt=""/>
                  </div>

                </div>
              </div>
            </div>
          );
        }):null}
      </div>
    </div>
  )
}


const ArrangeCategoryMode = (params) => {
  //const [mainCategories, setMainCategories] = useState([]);
  //const [fixedCats, setFixedCats] = useState([]);
  const [openFamily, setOpenFamily] = useState(false);
  //const [categoriesLvl1, setCategoriesLvl1] = useState([]);


  useEffect(() => {

    // let categories = params.categories.filter(item => item.ExtId );
    // categories.reverse();
    //
    // let categoriesLvl1 = params.categories.filter(item => !item.ExtId );
    // setCategoriesLvl1(categoriesLvl1);
    //
    // setFixedCats(JSON.stringify(categories));
    // setMainCategories(categories);
  }, []);


  const selectChosen = (childCatId, parentCatId) => {
    setOpenFamily(false);
    params.selectChosen(childCatId, parentCatId);
  }

  //let categories = params.categories.filter(item => item.ExtId );
  let categories = params.categories;

  //categories.reverse();
  let categoriesLvl1 = params.categories.filter(item => !item.ExtId );

  return(
    <div className="items">
      <div className="heading">
        <div className="flex-container">
          <div className="col-lg-2">
            <p>תמונה</p>
          </div>
          <div className="col-lg-1 product">
            <p style={{textAlign: 'right'}}>מזהה</p>
          </div>
          <div className={"col-lg-4 product"}>
            <p style={{textAlign: 'right'}}>כותרת</p>
          </div>
          <div className="col-lg-1">
            <p style={{textAlign: 'right'}}>רמה1</p>
          </div>
          <div className="col-lg-2">
            <p style={{textAlign: 'center'}}>קטגוריה</p>
          </div>
        </div>
      </div>

      <div className="items" >
        {categories && categories.length ? categories.map((element, index) => {

          let parentCat = params.categories.filter((item) => {return item.Id == element.ParentId});

          return(
            <div key={index} id={"item_" + element.Id} className="item">
              <div className="flex-container">
                <div className="col-lg-2 for-img">
                  <div
                    className={element.Img ? "img-load active" : "img-load"}>
                    {element.Img ?
                      <Fragment>
                        <img
                          className="main-img"
                          src={globalFileServer + 'categories/' + element.Img}
                        />
                      </Fragment>
                    : null}
                  </div>
                </div>
                <div className={"col-lg-1 title"}>
                  <p>{element.Id}</p>
                </div>
                <div className={"col-lg-4 title"}>
                  <input
                    id={'input_' + element.Id}
                    type="text"
                    placeholder="שם הקטגוריה"
                    value={element.Title ? element.Title : ""}
                    onChange={(e) => params.editItem(e.target.value, element.Id, 'Title')}
                    onBlur={(e) => params.updateItems(e.target.value, element.Id, 'Title')}
                  />
                </div>
                <div className="col-lg-1 title">
                  <input
                    id={'input_' + element.Id}
                    type="text"
                    placeholder="שם הקטגוריה"
                    value={element.LvlNumber ? element.LvlNumber : ""}
                    onChange={(e) => params.editItem(e.target.value, element.Id, 'LvlNumber')}
                    onBlur={(e) => params.updateItems(e.target.value, element.Id, 'LvlNumber')}
                  />
                </div>
                <div className="col-lg-2">
                  {element.LvlNumber != 1 ?
                    <div className={openFamily == element.Id ? "select active padding" : "select padding"}>
                      <div onClick={openFamily ? () => setOpenFamily(false) : () => setOpenFamily(element.Id)} className="headind">
                        <p>{parentCat && parentCat.length ? parentCat[0].Title : 'בחר'}</p>
                        <div className="img">
                          <img src={globalFileServer + "icons/down-chevron.svg"} alt=""/>
                        </div>
                      </div>
                      <div className={openFamily == element.Id ? "masc active" : "masc"}>
                        <ul>
                          {categoriesLvl1.length ? categoriesLvl1.map((ele,ind) => {
                            return(
                              <li key={ind}>
                                <div className="mask-li-cls" onClick={() => selectChosen(element.Id, ele.Id)}>
                                  <span>{ele.Title}</span>
                                  <div className="img">
                                    <img src={globalFileServer + 'icons/back-select.svg'} alt=""/>
                                  </div>
                                </div>
                              </li>
                            )
                          }):null}
                        </ul>
                      </div>
                    </div>
                  :null}
                </div>
              </div>
            </div>
          );
        }):null}
      </div>
    </div>
  )
}

export default class CategoryBuild extends Component {
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
      pageMode: false,
      greg: false

		}
		this.setPreload = this.setPreload.bind(this);
		this.unsetPreload = this.unsetPreload.bind(this);
		this.search = this.search.bind(this);
		this.clearSearch = this.clearSearch.bind(this);
	}
	componentDidMount(){

    let pageMode = this.props.match.params.id;
    this.setState({pageMode});

		this.getCategories();
		window.scrollTo(0, 0);
		setTimeout(() => window.scrollTo(0, 0), 100);
	}
	componentWillReceiveProps(nextProps){

		if (this.props.match.params.id != nextProps.match.params.id) {
      let pageMode = nextProps.match.params.id;
      this.setState({pageMode});
      setTimeout(() => {window.scrollTo(0, 0)}, 200);

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


	getCategories = async() => {

    const val = {
      funcName: 'getAllItems',
      point: 'categories'
    };
    try {
      const data = await this.props.ajax(val);

      this.setState({categories: data.Categoriess, constCategories: data.Categoriess, load: true});

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



  addItem = async() => {

    //this.setState({greg: !this.state.greg});

    const valAjax = {
      funcName: 'addItem',
      point: 'categories',
      token: localStorage.token,
      role: localStorage.role,
    };
    try {
      const data = await this.props.ajax(valAjax);
      //debugger;
      let cats = this.state.categories;
      cats.push(data);
      cats.sort((a, b) => { return a.Orden - b.Orden });

      //this.setState({categories: []});
      this.setState({categories: cats});

    } catch(err) {
      console.log('connection error addItem');
    }

  }

  editItem = (value, id, paramName) => {
    let categories = this.state.categories;
    categories.find(x => x.Id == id)[paramName] = value;

    this.setState({categories});
  }


  updateItems = async (value, id, paramName) => {

    let categories = this.state.categories;
    categories.find(x => x.Id == id)[paramName] = value;
    this.setState({categories});


    const valAjax = {
      funcName: 'editItem',
      point: 'categories',
      token: localStorage.token,
      role: localStorage.role,
      itemId: id,
      paramName: paramName,
      value: value
    };

    try {
      const data = await this.props.ajax(valAjax);
    } catch(err) {
      console.log('connection error editItem');
    }

  }

  deleteItem = (id) => {
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

        const valAjax = {
          funcName: 'deleteItem',
          point: 'categories',
          token: localStorage.token,
          role: localStorage.role,
          itemId: id,

        };

        this.deleteItemFunc(valAjax);

      }
    }.bind(this, id)).catch(SweetAlert.noop);
  }

  deleteItemFunc = async (valAjax) =>{

    try {
      const data = await this.props.ajax(valAjax);
      this.setState({categories: data.Categoriess});


    } catch(err) {
      console.log('connection error deleteItemFunc');
    }
  }

  selectChosen = async (childCatId, parentCatId) => {
    let cats = this.state.categories;
    cats.find(x => x.Id == childCatId).ParentId = parentCatId;
    this.setState({categories: cats});


    const val = {
      childCatId: childCatId,
      parentCatId: parentCatId
    };

    const valAjax = {
      funcName: 'linkCatToCatLvl1',
      point: 'categories',
      token: localStorage.token,
      role: localStorage.role,
      val: val
    };

    try {
      const data = await this.props.ajax(valAjax);

    } catch(err) {
      console.log('connection error editItem');
    }


  }

	render(){

		return (
			<div className="category-edit build">
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
          <div className="tabs-main-cont">
            <div className="tabs-main-subcont">
              <div className="tab-cont">
                <NavLink to={'/category-build/0'}>
                  <p className={this.state.pageMode == 0 ? "active" : null} onClick={()=> this.setState({pageMode:0})}>ראשיות</p>
                </NavLink>
              </div>
              <div className="tab-cont">
                <NavLink to={'/category-build/1'}>
                  <p className={this.state.pageMode == 1 ? "active" : null} onClick={()=> this.setState({pageMode:1})}>שיוך קטגוריות</p>
                </NavLink>
              </div>
            </div>
          </div>
					<div className="add-item add-item-main">
						<div className="flex-container">
							<div className="col-lg-6">
                {this.state.pageMode == 0 ?
  								<div onClick={()=> this.addItem()} className="masc">
										<img src={globalFileServer + 'icons/plus-white.svg'} />
										<span>הוסף</span>
  								</div>
                :null}
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

          {this.state.pageMode && this.state.pageMode == '0' && this.state.categories.length > 0 ?
            <AddCategoryMode categories = {this.state.categories} props={this.props} editItem={this.editItem} updateItems={this.updateItems} deleteItem={this.deleteItem}/>
          :null}


          {this.state.pageMode && this.state.pageMode == '1' && this.state.categories.length > 0 ?
            <ArrangeCategoryMode categories = {this.state.categories} props={this.props} selectChosen={this.selectChosen} editItem={this.editItem} updateItems={this.updateItems}/>
          :null}

				</div>
			</div>
		)
  }
}
