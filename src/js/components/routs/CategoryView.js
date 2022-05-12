import React, { Component, Fragment } from 'react';
import { NavLink } from "react-router-dom";
import UserContext from '../../UserContext';
import HasmalFooter from "../footer/HasmalFooter";
import RecommendedMonth from '../header/RecommendedMonth';
export default class CategoryView extends Component {
	constructor(props){
		super(props);
		this.state = {
			active:false,
			total:[],
		}
	}
	componentDidMount(){
		setTimeout(() => window.scrollTo(0, 0), 100);
    if(localStorage.getItem('lastUrl')){
      localStorage.removeItem('lastUrl');
    }

		this.getItems();

	}

	getItems = async () => {

		const valAjax = {
      funcName: 'getLvl1Cat',
      point: 'categories'
    };

		
    try {
      const data = await this.props.ajax(valAjax);
			if(data.result == 'success'){
				this.setState({total:data.items})
			}

		} catch(err) {
      console.log('connection error GetSales');
      this.setState({preload:false});
    }
	}
	render(){

		let categories = [];
    let id = parseInt(this.props.match.params.lvl1);
    let subId = parseInt(this.props.match.params.lvl2);
    let parentCategory;
    let childCategory;
    if(this.props.state.categories.length>0){
			categories = this.state.total

    }

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

              </div>
          </div>
        </div>
						{/* desktop version */}
				<div className="container categories">
					<div className="flex-container">
						{categories.map((element, index) => {
							return(
								<div key={index} className="col-lg-3">
									<NavLink to={ ('/category/' + element.Id  + "/0/0/0" )}>
										<div className="wrapper">
											<img src={element.Img ? globalFileServer + 'categories/' + element.Img : globalFileServer + 'placeholder.jpg'} />
											<div className='button_category'>
												<h4>{element.Title}</h4>
												<span>{element.Counter} פריטים</span>
											</div>
										</div>
									</NavLink>
								</div>
							);
						})}
					</div>
				</div>

				{/* mobile version */}
				<div className='categories_mobile'>
					{categories.map((element, index) => {
								return(
									<div key={index} className="card_category_mobile">
										{/* <NavLink to={ ('/category/' + element.Id  + "/0/0/0" )}> */}
												{/* <img src={element.Img ? globalFileServer + 'categories/' + element.Img : globalFileServer + 'placeholder.jpg'} /> */}
												<div className='flex-container' onClick={() => this.setState({active:!this.state.active})}>

													<h2>{element.Title}</h2>
													<div className="card_category_mobile_icon">
															<i className='bx bxs-chevron-left'></i>
													</div>

												</div>

											
										{/* </NavLink> */}
									</div>
								);
							})}
				</div>

      <RecommendedMonth/>
			<HasmalFooter/>
			</div>
		)
	} else return null;
	}
}
