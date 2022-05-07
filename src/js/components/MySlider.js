import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import Slider from 'react-slick';

export default class MySlider extends Component {
	constructor(props){
		super(props);
		this.state = {}
	}
	componentDidMount(){}
	render(){
		let settings = {
			infinite: true,
			slidesToShow: window.outerWidth < 1000 ? 1 : this.props.slidesToShow,
			slidesToScroll: window.outerWidth < 1000 ? 1 : this.props.slidesToScroll,
			dots: this.props.dots,
			arrows: this.props.arrows,
			rtl: this.props.lang == 'he' ? true : false,
			cssEase: 'ease-in-out',
			speed: this.props.speed,
			swipe: window.outerWidth < 1000 ? true : false
		}
		return (
			<Slider {...settings}>
				{this.props.items.map((element, index) => {
					return(
						<div key={index} className="item flex-container">
							{this.props.link ? <NavLink className="absolute" to={'/' + this.props.link + '/' + element.Id}></NavLink> : null}
							<div className="img col-lg-12">
								<img src={element.Img ? globalFileServer + this.props.folderName + '/' + element.Img : globalFileServer + "placeholder_4x4.jpg"} alt=""/>
							</div>
							<div className="text col-lg-12">
								<h1 className="for-title">{this.props.lang == 'he' ? element.Title : element.TitleRu}</h1>
								{this.props.text ?
									<div dangerouslySetInnerHTML={{__html: this.props.lang == 'he' ? element.Description : element.DescriptionRu}}></div>
								: null}
							</div>
						</div>
					);
				})}
			</Slider>
		)
	}
}
