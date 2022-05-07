import React, {Component} from 'react';
import { NavLink } from "react-router-dom";

const BreadCrumbs = params => {
	let { title,breadCrumbsNav } = params;
	return(
		<div className="breadcrumbs">
			<div className="container">
				<div className="flex-container">
					<div className="col-lg-6">
						<h1>{title}</h1>
					</div>
					<div className="col-lg-6">
						<ul>
							<li>
								<NavLink to="/"><img src={globalFileServer + 'icons/home.svg'} alt=""/></NavLink>
							</li>
							{breadCrumbsNav.map((element, index) => {
								return(
									<li key={index}>
										{element.Link ?
											<NavLink to={element.Link}>{element.Title}</NavLink>
											: <span>{element.Title}</span>}
									</li>
								);
							})}
						</ul>
					</div>
				</div>
			</div>
		</div>
	)
}

export default BreadCrumbs;
