import React, { Component, Fragment } from 'react';
import { NavLink } from "react-router-dom";
import SearchProd from '../../tools/SearchProd';
import Calendar from 'react-calendar';
import SweetAlert from 'sweetalert2';

let appState;

export default class ReturnsPop extends Component {
	constructor(props){
		super(props);
		this.state = {
      serchProdTitle: "",
      returnObj:[],
      searchActive: false
    }

    this.getProdFromSearch = this.getProdFromSearch.bind(this);
    this.closeSearch = this.closeSearch.bind(this);
    this.selectChildren = this.selectChildren.bind(this);

	}

  saveReturns(){

    if(this.state.returnObj.length > 0){
      let returnObj = this.state.returnObj;
      let isAll = true;
      let isAllUnit = true;
      let findProd;
      returnObj.map((element) => {
        if(element.Quantity == ""){
          isAll = false;
        }
        if(element.Unit == -1){
          isAllUnit = false;
        }
        if(element.Unit == "1" && isAll == true){
          findProd = this.props.props.state.products.filter((ele) => {return ele.CatalogNumber == element.CatalogNumber})
          findProd = findProd[0];
          if(findProd.PackQuan && parseInt(findProd.PackQuan)>1){
            element.Quantity = parseFloat(element.Quantity) * parseInt(findProd.PackQuan);
          }
        }
      })

      if(isAll == true && isAllUnit == true){
        SweetAlert({
    			title: 'האם אתה בטוח?',
    			text: 'בקשה לזיכוי תשלח לספק',
    			type: 'warning',
    			showCancelButton: true,
    			confirmButtonColor: '#22b09a',
    			cancelButtonColor: '#d80028',
    			confirmButtonText: 'אישור',
    			cancelButtonText: 'בטל'
    		}).then(function(returnObj, res) {
    			if (res.value) {
            this.props.saveReturns(returnObj);
          }
        }.bind(this,returnObj)).catch(SweetAlert.noop);
      }else{
        if(isAll == false){
          SweetAlert({
            title: 'אנא הזן כמות החזר רצויה לכל המוצרים',
            type: 'info',
            showConfirmButton: false,
            timer: 4000
          }).catch(SweetAlert.noop);
        }else if(isAllUnit == false){
          SweetAlert({
            title: 'אנא בחר ביחידות המידה הרצויות',
            type: 'info',
            showConfirmButton: false,
            timer: 4000
          }).catch(SweetAlert.noop);
        }
      }
    }else{
      SweetAlert({
        title: 'חפש והוסף מוצר לרשימה',
        type: 'info',
        showConfirmButton: false,
        timer: 4000
      }).catch(SweetAlert.noop);
    }
  }



  closeSearch(Id, action){

  }
  getProdFromSearch(catalogNumber, title, id, action) {
    let returnObj = this.state.returnObj;
    let match = returnObj.filter((ele,ind) => {return ele.CatalogNumber == catalogNumber});

    let tmpAllProds = this.props.props.state.products.filter((item) => {return item.CatalogNumber == catalogNumber})

    if(!match.length){
      let all_prods = this.props.props.state.products;
      let element = all_prods.filter((ele,ind) => {return ele.CatalogNumber == catalogNumber});
      let unitArr;

      if(element[0].Unit == "2"){
        unitArr = [{id:-1, title: "בחר"}, {id:2, title: "קילו"}];
      }else{
        if(element[0].PackQuan && element[0].PackQuan != "1"){
          unitArr = [{id:-1, title: "בחר"}, {id:0, title: "יחידות"}];
        }else{
          unitArr = [{id:-1, title: "בחר"}, {id:0, title: "יחידות"}];
        }
      }
      let val = {"CatalogNumber": catalogNumber,"Title": title, "Quantity":"", "Unit":-1, "NoVat": tmpAllProds[0].Vat, UnitArr:unitArr}
      returnObj.unshift(val);
      this.setState({returnObj,searchActive:false});
    }else{
      SweetAlert({
        title: 'פריט זהה קיים ברשימה. נסה פריט אחר',
        type: 'info',
        showConfirmButton: false,
        timer: 4000
      }).catch(SweetAlert.noop);
    }
  }

  changeValue(params, catalogNum, e){
    let returnObj = this.state.returnObj;
    returnObj.find(x => x.CatalogNumber == catalogNum)[params] = e.target.value;
    this.setState({returnObj});
  }

  selectChildren(catalogNum, params, event){
    let selLine = event.target.value;
    let returnObj = this.state.returnObj;
    returnObj.find(x => x.CatalogNumber == catalogNum)[params] = selLine;
    this.setState({returnObj});
  }
  deleteItem(catalogNum){
    let returnObj = this.state.returnObj;
    returnObj = returnObj.filter((item) => {return item.CatalogNumber != catalogNum});
    this.setState({returnObj});
	}

	render(){
		return(
      <div className="wrapper returnsPop">

        <div className="returnsPop-cont">
          <div className="input-cont search-cont">
            <p>חפש לפי שם או מק״ט</p>
            <SearchProd data={this}
              Id={""}
              Action={""}
              IsSearch={true}
              placeholder={''}
              value={this.state.serchProdTitle}
            />
          </div>
          <div className="list-main-cont">
            <div className="heading flex-container">
              <div className="col-lg-5">
                <p>שם מוצר</p>
              </div>
              <div className="col-lg-3 center">
                <p>כמות</p>
              </div>
              <div className="col-lg-3 center">
                <p>יחידה</p>
              </div>
              <div className="col-lg-1 center">
                <p></p>
              </div>
            </div>
            <div className="all-list-cont">
              {this.state.returnObj && this.state.returnObj.length>0 ? this.state.returnObj.map((element,index) => {

                return(
                  <div key={index} className="list-sub-cont flex-container">
                    <div className="col-lg-5">
                      <p>{element.Title}</p>
                    </div>
                    <div className="col-lg-2 quan-cont">
                      <input
                        type="text"
                        value={element.Quantity}
                        onChange={this.changeValue.bind(this,"Quantity", element.CatalogNumber)}
                      />
                    </div>
                    <div className="col-lg-3">
                      <select
                        onChange={this.selectChildren.bind(this, element.CatalogNumber ,"Unit")}
                        value={element.Unit}
                        >
                        {element.UnitArr ? element.UnitArr.map((ele, ind) => {
                          return (
                            <option key={ind} id={ele.id} value={ele.id}>{ele.title}</option>
                          )
                        }):null}}
                      </select>
                    </div>
                    <div className="col-lg-1 delete center">
                      <div className="img-del" onClick={this.deleteItem.bind(this, element.CatalogNumber)}>
                        <img src={globalFileServer + "icons/trash-purple.svg"} alt=""/>
                      </div>
                    </div>
                  </div>
                )
              }):null}
            </div>
          </div>
        </div>
        <div className="btn-container">
          <div onClick = {this.saveReturns.bind(this)} className="add-return-btn">
            <p>שמור ושלח</p>
          </div>
        </div>
			</div>
		);
	}
}
