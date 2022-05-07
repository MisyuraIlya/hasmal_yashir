import ReactDOM from "react-dom";
import React, { Component, Fragment } from 'react';
import { NavLink } from "react-router-dom";
import {Helmet} from "react-helmet";


let arrayGLB = [];

export default class DepartmentPop extends Component {
	constructor(props){
		super(props);
		this.state = {
			deptArr: []
		}


	}
	componentDidMount(){

	}


	render(){

    let props = Object.assign({}, this.props);
    let deptsArr = this.props.state.finalDeptObj;
    let chosenOrder = this.props.state.chosenOrder;
    return(
			<div className="product-page DepartmentPop">
        {this.state.preload ?
          <div className="spinner-wrapper">
            <div className="spinner">
              <div className="bounce1"></div>
              <div className="bounce2"></div>
              <div className="bounce3"></div>
            </div>
          </div>
        : null}

  			<div className="product-wrapper flex-container">
          {deptsArr && deptsArr.length ? deptsArr.map((element, index) => {
            return(
              <div key={index} className="btn-cont">
                <NavLink to={'/collector-step-four/' + chosenOrder + "/" + element.Id}>
                  <p>{element.Title}</p>
                </NavLink>
              </div>
            )
          }):null}
  			</div>

			</div>
		)
	}
}
