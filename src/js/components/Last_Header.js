import ReactDOM from "react-dom";
import React, { Component, Fragment, useState, useEffect, useContext } from "react";
import { NavLink, useHistory } from "react-router-dom";
import UserContext from '../UserContext';

let position = 0;
let ticking = false;


const SiteNav = params => {
	const [active, setActive] = useState(false);
	const [parent, setParent] = useState(false);
	const [activeHard, setActiveHard] = useState(false);
	const [parentHard, setParentHard] = useState(false);

	useEffect(() => {
		let el = document.getElementById('sub_categories');
		if (el) el.scrollTop = 0;
	}, [parent]);

	const getTitle = () => {
		let current = params.items.find(item => item.Id == parent);
		return current.Title;
	}

	const getSecondLavel = () => {
		let secondLavel = params.items.filter(item => item.Lvl2ParentMyId == parent);
    // /debugger;
		return secondLavel;
	}

	const closeNav = () => {
		setActive(false);
		setParent(false);
		setParentHard(false);
		if (params.active) params.close();
	}

	const setParentToHard = id => {
		if (!parentHard) {
			setParent(id);
			setParentHard(id);
		} else {
			if (parent == id) {
				setParent(false);
				setParentHard(false);
			} else {
				setParent(id);
				setParentHard(id);
			}
		}
	}

	const leaveCategory = () => {
		if (!parentHard) {
			setParent(false);
		}
	}

	const leaveSubCategory = () => {
		if (!parentHard) {
			setParent(false);
			setActive(false);
		}
	}

	const closeAll = () => {
		setParent(false);
		setActive(false);
		setParentHard(false);
	}

	const closeSubOnMobile = () => {
		if (window.innerWidth < 1000) {
			setParent(false);
			setParentHard(false);
		}
	}
	let categories = params.categories;

  const app = useContext(UserContext);

	return (
		<nav className={params.active ? "site-nav active" : "site-nav"}>

			<div className="flex-container">
				<div className="category-menu">
					<h2 onMouseEnter={e => leaveCategory()} onClick={e => setActive(!active)} className={active ? "title active" : "title"}>
						<span>קטלוג</span>
						<img src={globalFileServer + 'icons/plus.svg'} />
					</h2>
					<div className={active || parent ? "parent-nav active" : "parent-nav"}>
						<ul>
							{params.items.map((element, index) => {
								let pathname = location.pathname.split('/');
								let main = false;
								if (pathname.length == 4) {
									let currentActive = params.items.filter(item => item.Id == pathname[2]);
									if (currentActive.length) main = currentActive[0].ParentId;
								}
								if (!element.Lvl2ExId) {
									return (
										<li key={index}>
											<a
												className={element.Id == parent || main && main == element.Id && !parent ? 'active' : null}
												onClick={e => setParentToHard(element.Id)}
												onMouseEnter={e => !parentHard && window.innerWidth > 1000 ? setParent(element.Id) : null}
											>{element.Title}</a>
										</li>
									);
								}
							})}
						</ul>
					</div>
          {parent ? <>
    				<div onClick={e => closeAll()} className="outline"></div>
    				<div onMouseLeave={e => leaveSubCategory()} className="sub-categories">
    					<div id="sub_categories" className="wrapper">
    						<h1 onClick={e => closeSubOnMobile()}>
    							<span>{getTitle()}</span>
    							<img src={globalFileServer + 'icons/back-dark.svg'} />
    						</h1>
    						<div onClick={e => closeNav()} className="wrapp">
    							{getSecondLavel().map((element, index) => {
    								let child = params.items.filter($item => $item.ParentId == element.Id);
    								let pathname = location.pathname.split('/');
    								return (
    									<div className="col" key={index}>
    										<h3 className={pathname.length == 4 && pathname[2] == element.Id ? 'active' : null}>
    											<NavLink to={"/category/" + parent + "/" +  element.Id + '/0/'+ app.state.lang}>{element.Title}</NavLink>
    										</h3>
    										<ul>
    											{child.map((el, ind) => {
    												return (
    													<li key={ind}>
    														<NavLink to={'/category/' + parent + "/" +  element.Id + '/' +  el.Id + "/" + app.state.lang}>{el.Title}</NavLink>
    													</li>
    												);
    											})}
    										</ul>
    									</div>
    								);
    							})}
    						</div>
    					</div>
    				</div>
    			</> : null}
				</div>

			</div>
		</nav>
	);
}



const SelectLang = params => {

	const [view, setView] = useState(false);

	const app = useContext(UserContext);

	const history = useHistory();

	const selectLang = lang => {
		let replace = app.state.lang;

		app.selectLang(lang);
		setView(false);

		//let replace = lang == 'he' ? 'en' : 'he';
		let path = history.location.pathname.split('/');
    let foundIndex = path.findIndex(x => x == replace);

		if (foundIndex==-1) {
      if(path[0]==""){
        path = ['home', lang];
      }else{
        path = [path[0], lang];

      }
      //debugger;

		} else {
			//let foundIndex = path.findIndex(x => x == replace);
			path[foundIndex] = lang;
		}
		history.push(path.join('/'));
	}

	return(
		<li className="lang">
			<p onClick={e => setView(!view)}>
				<img src={globalFileServer + 'icons/arrow-down-smoll.svg'} />
				<span>{app.state.lang.toUpperCase()}</span>
			</p>
			{view ?
				<div className="items">
					{['he','en'].map((element, index) => {
						return(
							<div
								key={index}
								onClick={e => selectLang(element)}
								className={element == app.state.lang ? 'item active' : 'item'}
							>
								<span>{element.toUpperCase()}</span>
							</div>
						);
					})}
				</div>
			: null}
		</li>
	);
}

const Navigation = params => {
	const app = useContext(UserContext);
	let nav = app.state.nav.filter(item => item.Lang == app.state.lang);
	return(
		<nav>
			<ul>
				{nav.map((element, index) => {
					return(
						<li key={index}>
							{
								<NavLink to={element.Link + app.state.lang}>{element.Title}</NavLink>
							}
						</li>
					);
				})}
			</ul>
		</nav>
	);
}

export default class Header extends Component {
	state = {
		items: [],
		sidebar: false,
		activeHeader: false
	}
	componentDidMount = () => {
		if (window.innerWidth > 1200) document.addEventListener('scroll', this.scrollHandle);
		if (window.scrollY > 70 && !this.state.activeHeader) this.setState({activeHeader: true});
	}
	scrollHandle = e => {
		let lastPosition = window.scrollY;
		if (!ticking) {
			window.requestAnimationFrame(() => {
				this.doAnimate(position, lastPosition);
				ticking = false;
			});
		}
		ticking = true;
	}
	doAnimate = (pos, lastPosition) => {
		let scrollDown = lastPosition > position ? true : false;
		if (lastPosition > 70 && !this.state.activeHeader) {
			this.setState({activeHeader: true});
		}
		if (lastPosition < 70 && this.state.activeHeader) {
			this.setState({activeHeader: false});
		}
		position = lastPosition;
	}
	toggleSidebar = () => {
		this.setState({sidebar: !this.state.sidebar});
	}
	exit = () => {
		let siteVer = localStorage.siteVer;
		localStorage.clear();
		localStorage.siteVer = siteVer;
		location = '/';
	}
	render(){
		let app = this.props.state;
		let constant = this.props.returnConstant;
		return (
			<div className={this.state.activeHeader ? 'header active' : 'header'}>
				<div className="top">
					<div className="container">
						<div className="flex-container">
							<div className="col-lg-6">
								<div className="actions">
									<ul>
										<SelectLang />
									</ul>
								</div>
							</div>
							<div className="col-lg-6">
								<ul className="info">
									<li>
										<span>09-8844452</span>
									</li>
									<li>
										<span>{constant('LOGIN')}</span>
									</li>
								</ul>
							</div>
						</div>
					</div>
				</div>
				<div className="nav">
					<div className="container">
						<div className="flex-container">
							<div className="logo">
								<NavLink to={'/home/' + app.lang}>
									<img src={app.lang == 'he' ? globalFileServer + 'logo.png' : globalFileServer + 'enlogo.png'} alt=""/>
								</NavLink>
							</div>
              {/*
              <div className="header-right-cont">
                <SiteNav items={this.props.state.categories} />
              </div>
              */}
							<Navigation />
						</div>
					</div>
				</div>
			</div>
		)
	}
}
