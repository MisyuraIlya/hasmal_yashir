import ReactDOM from "react-dom";
import React, { Component, Fragment, useState } from 'react';
import { NavLink, useParams } from "react-router-dom";
import SweetAlert from 'sweetalert2';
import MyCropper from "../tools/MyCropper";
import BreadCrumbs from "../tools/BreadCrumbs";
import Preload from "../tools/Preload";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const Heading = e => {
	return(
		<div className="heading">
			<div style={{alignItems: 'flex-end'}} className="flex-container">
				<div className="col-lg-1">
          {/*
					<p>כניסה</p>
          */}
				</div>
				<div className="col-lg-1">
					<p>סדר</p>
				</div>
				<div className="col-lg-1">
					<p>תמונה</p>
				</div>
				<div className="col-lg-3 title">
					<p style={{textAlign: 'right'}}>כותרת</p>
				</div>
        <div className="col-lg-2 title">
					<p style={{textAlign: 'right'}}>מק״ט</p>
				</div>
        <div className="col-lg-1 title">
          <p style={{textAlign: 'right'}}></p>
        </div>
				<div className="col-lg-3">
					<div style={{alignItems: 'flex-end'}} className="flex-container">

						<div className="col-lg-3">
              {/*
							<p>רב מכר</p>
            */}
						</div>
						<div className="col-lg-3">
              {/*
							<p>חדש</p>
              */}
						</div>
            <div className="col-lg-3">
              {/*
              <p>מלאי</p>
              */}
            </div>
						<div className="col-lg-3">
							<p>סטאטוס</p>
						</div>
						<div className="col-lg-3">
              {/*
							<p>מחק</p>
              */}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

const AddItem = params => {
	const [openMain, setOpenMain] = useState(false);
	let { id } = useParams();

	return(
		<div className="add-item add-item-main">
      <button onClick={()=> params.addItemFunc(params.func)}>
        <img src={globalFileServer + "icons/plus.svg"} alt=""/>
        <span>הוסף מוצר</span>
      </button>
		</div>
	);
}

export default class DeptEdit extends Component {
	state = {
		items: [],
		preload: false,
		masc: false,
    dateNew: '',
    deptsMainObj:[],
    deptsChildObj:[],
    chosenMainDept:false
	}
	componentDidMount = () => {
		this.getItems();
		setTimeout(() => window.scrollTo(0, 0), 100);

	}
	getItems = async() => {


    const valAjax = {
      funcName: 'getDepts',
      point: 'departments',
      token: localStorage.token,
      role: localStorage.role
    };
    try {
      const data = await this.props.ajax(valAjax);

      if(data.result=="success"){
        this.setState({deptsMainObj:data.deptsMain ,deptsChildObj:data.deptsChild })
      }

    } catch(err) {
      console.log('connection error docs');
      this.setState({preload:false});
    }


	}
  deleteItem = async(value, id, paramName, func) => {
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

        let parentId;
        let funcName;
        if(func=="parent"){
          let deptsMainObj = this.state.deptsMainObj;
          deptsMainObj.find(x => x.Id == id)[paramName] = value;
      		this.setState({deptsMainObj});
          funcName = "editParentDept";
        }else{
          let deptsChildObj = this.state.deptsChildObj;
          deptsChildObj.find(x => x.Id == id)[paramName] = value;
          this.setState({deptsChildObj});
          funcName = "editChildDept";
        }

        let valAjax = {
    			funcName: funcName,
          point: 'departments',
    			token: localStorage.token,
    			role: localStorage.role,
    			itemId: id,
    			paramName: paramName,
    			value: value
    		};

        this.delFunc(valAjax);

			} else {
				this.unsetPreload();
			}
		}.bind(this, id)).catch(SweetAlert.noop);
	}

  delFunc = async (valAjax) =>{
    try {
      const data = await this.props.ajax(valAjax);
      this.unsetPreload();
    } catch(err) {
      console.log('connection error docs');
      this.setState({preload:false});
    }
  }
	editItem = (value, id, paramName, func) => {

    if(func=="parent"){
      let deptsMainObj = this.state.deptsMainObj;
      deptsMainObj.find(x => x.Id == id)[paramName] = value;
  		this.setState({deptsMainObj});
    }else{
      let deptsChildObj = this.state.deptsChildObj;
      deptsChildObj.find(x => x.Id == id)[paramName] = value;
      this.setState({deptsChildObj});
    }

	}
	updateItems = async(value, id, paramName, func) => {


    let parentId;
    let funcName;
    if(func=="parent"){
      let deptsMainObj = this.state.deptsMainObj;
      deptsMainObj.find(x => x.Id == id)[paramName] = value;
  		this.setState({deptsMainObj});
      funcName = "editParentDept";
    }else{
      let deptsChildObj = this.state.deptsChildObj;
      deptsChildObj.find(x => x.Id == id)[paramName] = value;
      this.setState({deptsChildObj});
      funcName = "editChildDept";
    }

    //debugger;
		let site = this.props.match.params.site;
		let valAjax = {
			funcName: funcName,
      point: 'departments',
			token: localStorage.token,
			role: localStorage.role,
			itemId: id,
			paramName: paramName,
			value: value
		};

    try {
      const data = await this.props.ajax(valAjax);

    } catch(err) {
      console.log('connection error docs');
      this.setState({preload:false});
    }


	}

  addItemFunc = async(func) => {


    let funcName;
    if(func=="parent"){
      funcName = "addParentDept";
    }else{
      funcName = "addChildDept";
    }

    const valAjax = {
      funcName: funcName,
      point: 'departments',
      token: localStorage.token,
      role: localStorage.role,
      itemId: this.state.chosenMainDept
    };


    try {
      const data = await this.props.ajax(valAjax);
      if(data.result=="success"){

        if(func=="parent"){
          let deptsMainObj = this.state.deptsMainObj;
          deptsMainObj.unshift(JSON.parse(data.dept));
          this.setState({deptsMainObj});
        }else{
          let deptsChildObj = this.state.deptsChildObj;
          deptsChildObj.unshift(JSON.parse(data.dept));
          this.setState({deptsChildObj});

        }
      }
    } catch(err) {
      console.log('connection error docs');
      this.setState({preload:false});
    }



  }
	setPreload = () => { this.setState({preload: true}); }
	unsetPreload = () => { this.state.preload ? this.setState({preload: false}) : null; }





	render(){
		let appState = this.props.state;
		let breadCrumbsNav = [
			{Title: 'ניהול מוצרים', Link: null}
		];
		return (
			<div className="category-edit dept_edit">
				<div className="container items-container">
					<Preload preload={this.state.preload} />
					<div className="items flex-container">
{/*
            <Heading />
*/}

            <div className="col-lg-6 depts-main-cont">
              <div className="depts-main-subcont">
                <AddItem addItemFunc={this.addItemFunc} func="parent"/>
                <h2>מחלקות ראשיות</h2>
                {this.state.deptsMainObj.length ? this.state.deptsMainObj.map((element,index) => {
                  if(!element.Extra1){
                    return(
                      <div key={index} className={this.state.chosenMainDept == element.Id ? "item active" : "item"} onClick={()=> this.setState({chosenMainDept: element.Id})}>
                        <div className="flex-container">
                          <div className="col-lg-1 enter">
                              <p>{element.Id}</p>
                          </div>
                          <div className="col-lg-3 title">
                            {/*<p>{element.Title}</p>*/}
                            <input
                              id={'input_' + element.Id}
                              type="text"
                              placeholder="שם הקטגוריה"
                              value={element.Title ? element.Title : ""}
                              onChange={(e) => this.editItem(e.target.value, element.Id, 'Title', "parent")}
                              onBlur={(e) => this.updateItems(e.target.value, element.Id, 'Title', "parent")}
                            />
                          </div>
                          <div className="col-lg-3 status">
  													{!element.Unpublished ?
  														<div onClick={(e) => this.updateItems(1, element.Id, 'Unpublished', "parent")} className="input active">
  															<img src={globalFileServer + "icons/done.svg"} alt=""/>
  														</div>
  													:
  													<div onClick={(e) => this.updateItems(null, element.Id, 'Unpublished', "parent")} className="input">
  														<img src={globalFileServer + "icons/cross-bold.svg"} alt=""/>
  													</div>
  													}
  												</div>
  												<div className="col-lg-3 delete">
  													<div className="img" onClick={e => this.deleteItem(1, element.Id, "Extra1", "parent")}>
  														<img src={globalFileServer + "icons/trash.svg"} alt=""/>
  													</div>
  												</div>
                        </div>
                      </div>
                    )
                  }
                }):null}
              </div>
            </div>

            <div className="col-lg-6 depts-main-cont child">
              <div className="depts-main-subcont child">
                {this.state.chosenMainDept ?
                  <AddItem addItemFunc={this.addItemFunc} func="child"/>
                :null}
                <h2>מחלקות משניות</h2>
                {this.state.chosenMainDept && this.state.deptsChildObj.length ? this.state.deptsChildObj.map((element,index) => {
                  if(element.DeptId == this.state.chosenMainDept && !element.Extra1){
                    return(
                      <div key={index} className="item">
                        <div className="flex-container">
                          <div className="col-lg-3 title">
                            <input
                              id={'input_' + element.Id}
                              type="text"
                              placeholder="שם הקטגוריה"
                              value={element.IturVal ? element.IturVal : ""}
                              onChange={(e) => this.editItem(e.target.value, element.Id, 'IturVal', "child")}
                              onBlur={(e) => this.updateItems(e.target.value, element.Id, 'IturVal', "child")}
                            />
                          </div>
                          <div className="col-lg-3 status">
  													{!element.Unpublished ?
  														<div onClick={(e) => this.updateItems(1, element.Id, 'Unpublished', "child")} className="input active">
  															<img src={globalFileServer + "icons/done.svg"} alt=""/>
  														</div>
  													:
  													<div onClick={(e) => this.updateItems(null, element.Id, 'Unpublished', "child")} className="input">
  														<img src={globalFileServer + "icons/cross-bold.svg"} alt=""/>
  													</div>
  													}
  												</div>
  												<div className="col-lg-3 delete">
  													<div className="img" onClick={e => this.deleteItem(1, element.Id, "Extra1", "child")}>
  														<img src={globalFileServer + "icons/trash.svg"} alt=""/>
  													</div>
  												</div>
                        </div>
                      </div>
                    )
                  }
                }):null}
              </div>
            </div>

          </div>
				</div>
			</div>
		)
	}
}
