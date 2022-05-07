import React, { Component, Fragment } from 'react';
import { NavLink } from "react-router-dom";
import UserContext from '../../UserContext';
import ContactFooter from '../tools/ContactFooter.js'

export default class CategoryView extends Component {
	constructor(props){
		super(props);
		this.state = {}
	}
	componentDidMount(){
		setTimeout(() => window.scrollTo(0, 0), 100);
    if(localStorage.getItem('lastUrl')){
      localStorage.removeItem('lastUrl');
    }

	}
	render(){

		let categories = [];
    let id = parseInt(this.props.match.params.lvl1);
    let subId = parseInt(this.props.match.params.lvl2);

    let parentCategory;
    let childCategory;

    if(this.props.state.categories.length>0){

      if(!id && !subId){
        categories = this.props.state.categories.filter(item => !item.ParentId && !item.SubParentId);
      }else if(id && !subId){
        categories = this.props.state.categories.filter(item => item.LvlNumber=="2" && item.ParentId == id);
        parentCategory = this.props.state.categories.filter(item => item.Id == id)[0];

      }else{
        categories = this.props.state.categories.filter(item =>  item.Lvl3ParentMyId == subId);
        parentCategory = this.props.state.categories.filter(item => item.Id == id)[0];
        childCategory= this.props.state.categories.filter(item => item.Id == subId)[0];
      }
    }
    let lang = this.props.state.lang;
		if (categories.length) {
		return (
			<div className="category-view">
				<div className="heading">
					{this.state.preload ?
						<div className="spinner-wrapper">
							<div className="spinner">
								<div className="bounce1"></div>
								<div className="bounce2"></div>
								<div className="bounce3"></div>
							</div>
						</div>
					: null}
				</div>

        <div className="category-header-cont">
          <div className="row-cont flex-container">
              <div className="h1-cont col-lg-8">
                <h1>{parentCategory.Title}</h1>
              </div>
          </div>
        </div>
				<div className="container categories">
					<div className="flex-container">
						{categories.map((element, index) => {
							return(
								<div key={index} className="col-lg-3">
									<NavLink to={ ('/category/' + this.props.match.params.lvl1 + "/" + element.Id + "/0/" + lang)}>
										<div className="wrapper">
											<img src={element.Img ? globalFileServer + 'categories/' + element.Img : globalFileServer + 'placeholder.jpg'} />
											<h2>{element.Title}</h2>
										</div>
									</NavLink>
								</div>
							);
						})}
					</div>
				</div>
        <ContactFooter lang={lang}/>

			</div>
		)
	} else return null;
	}
}
