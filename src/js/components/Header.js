import ReactDOM from "react-dom";
import React, { Component, Fragment, useState, useEffect, useContext } from "react";
import { NavLink, useHistory } from "react-router-dom";
import UserEntry from './header/UserEntry';
import LiveChat from './header/LiveChat';
import { Helmet } from "react-helmet";
import UserContext from '../UserContext';

// header components
import LogInOne from "./loginModal/LogInOne";
import LogInTwo from "./loginModal/LogInTwo";


const SiteNav = params => {
	const [active, setActive] = useState(false);
	const [parent, setParent] = useState(false);
	const [activeHard, setActiveHard] = useState(false);
	const [parentHard, setParentHard] = useState(false);
  	const [userEntry, setUserEntry] = useState(false);
	const [userButton, setUserButton] = useState(false);
  	const app = useContext(UserContext);


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

  const close = () => {
    setUserEntry(false);
  }


	let categories = params.categories;
  	let nav = app.state.nav.filter(item => item.Lang == app.state.lang);

	return (
		<nav className={params.active ? "site-nav active" : "site-nav"}>

			<div className="flex-container">
        <div className="reg-menu">
          <ul>
            <li>
              <div className="img">
                <NavLink to={'/' + app.state.lang}>
                  <img src={globalFileServer + 'icons/Home_icon_bl.svg'} />
                </NavLink>
              </div>
            </li>
            {!localStorage.user && !localStorage.role && !localStorage.agent ?
              <li>
                <button id="logIn" onClick={e => setUserEntry("login")} className={window.innerWidth > 1000 ? "sign-in" : "icon"}>
                  <span>{app.state.lang == 'he' ? 'כניסה' : 'LogIn'}</span>
                </button>
                <button id="signUp" onClick={e => setUserEntry("register")} className={window.innerWidth > 1000 ? "sign-in" : "icon"}>
                  <span>{app.state.lang == 'he' ? 'הרשמה' : 'SignUp'}</span>
                </button>
              </li>
            : null}
            {userEntry ? <UserEntry headProps={params.headProps} close={()=> close()} action={userEntry} lang={app.state.lang} {...this} /> : null}

            {localStorage.user && app.state.user.Type  == 1 ?
              <li onClick={()=> params.goToWishList()}>
                <a>{app.state.lang == 'he' ? "סל קבוע" : ""}</a>
              </li>
            : null}
            {localStorage.user && app.state.user.Type  == 1 ?
              <li>
                <NavLink to={'/docs'}>{app.state.lang == 'he' ? "מסמכים" : ""}</NavLink>
              </li>
            : null}
            {localStorage.user && app.state.user.Type  == 1 ?
              <li>
                <NavLink to={'/sales/1'}>{app.state.lang == 'he' ? "עלון מבצעים" : ""}</NavLink>
              </li>
            : null}
            {localStorage.user && app.state.user.Type == 2 ?
                <li onClick={() => this.setState({toggleMenu: false})}>
                  <NavLink to={"/collector-step-three"}>ליקוט</NavLink>
                </li>
            : null}
          </ul>
        </div>

  				<div className="category-menu">
            <NavLink to={'/category-page/0/0/' + app.state.lang}>
    					<h2 onMouseEnter={e => leaveCategory()} onClick={e => setActive(!active)} className={active ? "title active" : "title"}>
    						<span>{app.state.lang == "he" ? "קטלוג" : "Catalog"}</span>
    					</h2>
            </NavLink>
  					<div className={active || parent ? "parent-nav active" : "parent-nav"}>
              <div className="parent-subnav">
    						<div className="flex-container parent-cat-cont">
    							{params.items.map((element, index) => {
    								let pathname = location.pathname.split('/');
    								let main = false;
    								if (pathname.length == 4) {
    									let currentActive = params.items.filter(item => item.Id == pathname[2]);
    									if (currentActive.length) main = currentActive[0].ParentId;
    								}
    								if (element.LvlNumber == '1') {
    									return (
    										<div className="col-lg-2 col-cont" key={index}>
    											<NavLink to={"/category-page/" + element.Id + "/0/0/" + app.state.lang}>
                            <img src={element.Img ? globalFileServer + 'categories/' + element.Img : globalFileServer + "placeholder.jpg"} />
                            <h3>{element.Title}</h3>
                          </NavLink>
    										</div>
    									);
    								}
    							})}
    						</div>
              </div>
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
      								let child = params.items.filter($item => $item.Lvl3ParentMyId == element.Id);
      								let pathname = location.pathname.split('/');
      								return (
      									<div className="col" key={index}>
      										<h3 className={pathname.length == 4 && pathname[2] == element.Id ? 'active' : null}>
      											<NavLink to={"/category-page/" + parent + "/" +  element.Id + '/0/'+ app.state.lang}>{element.Title}</NavLink>
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

const MobileNav = params => {
	let user = localStorage.user ? JSON.parse(localStorage.user) : {};
	const [active, setActive] = useState(false);
	let userEntry = params.userEntry;
	const handleClick = funk => {
		if (funk == 1) {
			setActive(!active);
		}
	}
	const nav = [
		{
			Title: 'בית',
			Link: '/',
			Img: 'home-mob.svg'
		},
		{
			Title: 'אזור אישי',
			Link: Object.keys(user).length ? '/user-info/' + user.Id : '/user-info/0',
			Img: 'avatar.svg',
			toggleModal: false
		},
		{
			Title: 'כל המוצרים',
			Link: '/',
			Img: 'list-mob.svg',
			Categories: true,
			Funk: 1
		},
		{
			Title: 'ההזמנות שלי',
			Link: Object.keys(user).length ? '/user-info/' + user.Id : '/cart',
			Img: 'shopping-bag.svg'
		},
		{
			Title: 'עגלת קניות',
			Link: Object.keys(user).length ? '/user-cart/' + user.Id : '/user-cart/0',
			Img: 'cart.svg',
			Cart: true
		}
	];
	return (
		<Fragment>


			<SiteNav active={active} items={params.items} site={params.site} close={e => setActive(false)} />
			<div className="mobile-nav">
				<div className="flex-container">
					{nav.map((element, index) => {
						return (
							<div key={index} className="col-g-5">
								{!element.Funk ?
									<NavLink exact={element.Link == '/' ? true : null} to={element.Link}>
										<div className="img">
											{element.Cart ? <div className="counter">
												<span>{params.products}</span>
											</div> : null}
											<img src={globalFileServer + 'icons/' + element.Img} />
										</div>
										<p>{element.Title}</p>
									</NavLink> :
									<a onClick={e => handleClick(element.Funk)} className={element.Categories ? 'cat' : null}>
										<div className="img">
											<img src={globalFileServer + 'icons/' + element.Img} />
										</div>
										<p className={active ? 'active' : null}>{element.Title}</p>
									</a>
								}
							</div>
						);
					})}
				</div>
			</div>
		</Fragment>
	);
}


let user;


const SubMenu = (that) => (
	<div className={that.state.showCategories ? "sub-menu flex-container active" : "sub-menu flex-container"}>
		<div className="sub-menu-big-cont">

			{that.props.state.defaults.catLevels == "1" ?
				that.props.state.categories.map((element, index) => {
					return (
						<div key={index} className="col-lg-4" onClick={() => that.toggleShowCategories()}>
							<NavLink to={"/categories/" + element.Id} className={that.props.state.matchSubId == element.Id ? 'active' : null}>
								{element.Title}
							</NavLink>
						</div>
					)
				})
				:
				that.props.state.categories.map((element, index) => {
					let subCat = that.props.state.categories.filter(item => item.ParentId == element.Id);
					// console.log('yuli'+element.ParentId);
					if (!element.ParentId && subCat.length > 0) {
						return (
							<div key={index} className="sub-menu-cont" onClick={() => that.toggleShowCategories()}>
								<h3>
									<NavLink to={"/categories/" + element.Id} className={that.props.state.matchSubId == element.Id ? 'active' : null}>
										{element.Title}
									</NavLink>
								</h3>
								{
									subCat.map((el, i) => {
										return (
											<NavLink
												key={i}
												onClick={() => that.toggleShowCategories()}
												to={'/category-page/' + element.Id + '/' + el.Id}>
												{el.Title}
											</NavLink>
										)
									})
								}
							</div>
						)
					}
				})
			}
		</div>

	</div>
);

export default class Header extends Component {
	constructor(props) {
		super(props);
		this.state = {
			userEntry: false,
			openChat: false,
			foundProducts: [],
			search: false,
			toggleMenu: false,
			showCategories: false,
			seo: false,
			users: [],
			chatCounter: false,
			prevPath: '/',
			userButton:false,
			categoryButton:false,
			rigthSideBar:false,

		}
		this.close = this.close.bind(this);
		this.open = this.open.bind(this);
		this.getProducts = this.getProducts.bind(this);
		this.toggleMenu = this.toggleMenu.bind(this);
		this.toggleShowCategories = this.toggleShowCategories.bind(this);
		this.getUsers = this.getUsers.bind(this);
		this.notVieWed = this.notVieWed.bind(this);
		this.inputRef = React.createRef();
		this.reset = this.reset.bind(this);
		console.log(props.toggleRightSideBar)

	}
	componentDidMount() {
		if (localStorage.user) {
			user = JSON.parse(localStorage.user)
		}
		localStorage.role || localStorage.agent ? this.getUsers() : null;
		this.setState({ prevPath: this.props.location.pathname });
	}
	componentWillReceiveProps(nextProps) {
		if (nextProps.location !== this.props.location) {
			this.setState({ prevPath: this.props.location.pathname });
		}
	}
	componentWillUpdate(nextProps, nextState) { }
	reset() {
		this.inputRef.current.value = "";
		this.setState({ foundProducts: [], search: false, toggleMenu: false, showCategories: false });
	}


	notVieWed(items, userId) {
		let notVieWed;
		if (localStorage.role || localStorage.agent) {
			notVieWed = items.filter(item => !item.SendTo && !item.Viewed);
		} else {
			notVieWed = items.filter(item => item.SendTo == user.Id && !item.Viewed);
		}
		this.setState({ chatCounter: notVieWed.length });
	}
	getUsers = async() =>{


    const valAjax = {
      funcName: '',
      point: 'user_list_slim',
      token: localStorage.token,
      sess_id: localStorage.sessionId
    };

    try {
      const data = await this.props.ajax(valAjax);

      this.setState({ users: data.Userss });

    } catch(err) {
      console.log('connection error order');
    }


	}
	toggleShowCategories() {
		this.setState({ showCategories: !this.state.showCategories })
	}
	startSeo(seo) {
		if (this.state.seo) {
			this.setState({ seo: false });
		} else {
			let seoClone = Object.assign({}, seo);
			this.setState({ seo: seoClone });
		}
	}
	saveSeo(seo, paramName) {
		this.props.saveSeo(seo, paramName);
		let seoClone = this.state.seo;
		seoClone[paramName] = seo[paramName];
		this.setState({ seo: seoClone });
	}
	toggleMenu() {
		this.setState({ toggleMenu: !this.state.toggleMenu });
		if (!this.props.location.pathname.includes("category-blog") && this.props.location.pathname.includes("category") || this.props.location.pathname.includes("product")) {
			//this.setState({ showCategories: true });
		}
	}
	getProducts(e) {
		if (e.target.value) {
			let user = false;
			localStorage.user ? user = JSON.parse(localStorage.user) : null;
			let val = { 'word': e.target.value };
			user ? val.priceFor = user.PriceFor : null;
			// debugger;
			$.ajax({
				url: globalServer + 'product_search.php',
				type: 'POST',
				data: val,
			}).done(function (data) {
				if (data.result == "no-found") {
					this.setState({ foundProducts: [] });
				} else {
					this.setState({ foundProducts: data.Productss });
				}
			}.bind(this)).fail(function () { console.log("error"); });
		} else {
			this.setState({ foundProducts: [] });
		}
	}
	close() {
		this.setState({
			userEntry: false,
			openChat: false
		});
	}
	open() {
		this.setState({ openChat: true });
	}
	toggleSearch() {
		this.props.toggleSearch(true);
		this.props.history.push("/wishList/"+this.props.state.lang);
	}
	goToWishList = () => {
		this.setState({ toggleMenu: false, showCategories: false });
		this.props.toggleSearch(false);
		this.props.history.push("/wishList/"+this.props.state.lang);

	}
	beforeLogOut(user) {
		this.props.history.push('/');

		if (user == "admin") {
			this.props.localStorageClear();
		} else if (user == "agent") {
			this.props.signOut(user);
		} else {
			this.props.signOut(user);
		}
	}
	goBack = () => {
			if (this.state.prevPath !== '/') {
				this.props.history.goBack();
			} else {
				this.props.history.push('/');
			}
		}

	goToContact = () => {
		this.setState({ toggleMenu: false, showCategories: false })

		setTimeout(() => {
		$('html, body').animate({
			scrollTop: $("#contact-footer").offset().top - 50
		}, 0);
		}, 500);
		this.props.history.push('/');
	}
	scrollUp = () => {
		window.scrollTo({top: 0, behavior: 'smooth'});
	}

	openUserLoginModal = () => {
		this.setState({userButton:true})
	}
	closeUserLoginModal = () => {
		this.setState({userButton:false})
	}

	openRigthSideBar = () => {
		this.setState({rigthSideBar:true})
		// this.setState({categoryButton:true})
	}

	closeRigthSideBar= () => {
		// this.setState({categoryButton:false})
	}
  	
	render() {
		let seo = this.props.state.seo.filter(item => '/' + item.Link == this.props.history.location.pathname)[0];
		const max = { Title: 70, Description: 240, Keywords: 240 };
		let lang = this.props.state.lang;
		let siteMenu =
			<div className="header-right-cont col-lg-5 header-mob-right-cont">
				<ul className={this.state.showCategories ? 'to-left' : null}>
					{/* <li className="logo" onClick={() => this.setState({ toggleMenu: false, showCategories: false })}>
					<NavLink exact to="/">
						<img src={globalFileServer + 'main-logo.png'} />
					</NavLink>
				</li> */}
					<li onClick={() => this.setState({ toggleMenu: false, showCategories: false })}>
						<NavLink exact to="/">{lang == 'he' ? 'בית' : 'главная'}</NavLink>
					</li>


          {localStorage.user && this.props.state.user.Type == 1 ?
            <li onClick={()=> this.goToWishList()}>
              <a>{lang == 'he' ? "סל קבוע" : ""}</a>
            </li>
          : null}
          {localStorage.user && this.props.state.user.Type == 1 ?
            <li onClick={() => this.setState({ toggleMenu: false, showCategories: false })}>
              <NavLink to={'/docs'}>{lang == 'he' ? "מסמכים" : ""}</NavLink>
            </li>
          : null}
          {!localStorage.user ?
            <li onClick={() => this.goToContact()}>
              <NavLink to={'/docs'}>{lang == 'he' ? "צור קשר" : ""}</NavLink>
            </li>
          :null}
          {this.props.state.user && this.props.state.productSales && this.props.state.productSales.length > 0 ?
            <li className="sales" onClick={() => this.setState({ toggleMenu: false, showCategories: false })}>
              <NavLink exact to="/sales/1">עלון מבצעים</NavLink>
            </li>
          : null}
          <div className="parent-mob-cat-cont">
            {this.props.state.categories.map((element, index) => {
              if (element.LvlNumber == '1') {
                return (
                  <div className="col-cont" key={index}>
                    <NavLink to={"/category-page/" + element.Id + "/0/0/" + lang}>
                      <li onClick={() => this.setState({ toggleMenu: false })}>{lang == 'he' ? element.Title : element.CompanyId}</li>
                    </NavLink>
                  </div>
                );
              }
            })}
          </div>
        {/*

        */}
{/*
          {localStorage.agent && localStorage.user ?
						<li onClick={() => this.setState({ toggleMenu: false, showCategories: false })}>
							<NavLink exact to="/docs">כרטסת</NavLink>
						</li>
					: null}
*/}

				</ul>
			</div>
		return (
			<header className={lang == 'he' ? 'he' : 'ru'} id="header">
        {!location.href.includes("cart") ?
          <div onClick={this.scrollUp} className="up">
            <img src={globalFileServer + 'icons/up.svg'} alt=""/>
          </div>
        :null}
        {this.state.userEntry ? <UserEntry headProps={this.props} close={()=> close()} action={this.state.userEntry} lang={this.props.state.lang} {...this} /> : null}

				{localStorage.agent || localStorage.role || localStorage.user ? <LiveChat {...this} /> : null}


				<div className="header-wrapper">

					<div className="header-container">
						<div className="second-header flex-container"> 
						{/*===== right section ====*/}
						<div className="col-lg-6 right-right">
							<NavLink to={'/home/' + lang} className="first_logo">
									<img src={lang == 'he' ? globalFileServer + 'logo.png' : globalFileServer + 'enlogo.png'} alt=""/>
								</NavLink>

								<NavLink to={'/home/' + lang} className="second_logo" >
									<div style={{margin:'20px 20px 20px 20px'}} className="text-image-container">
										<img src={lang == 'he' ? globalFileServer + 'header/group.png' : globalFileServer + 'enlogo.png'} alt=""/>
									</div>
								</NavLink>
						</div>
							{/*==== left section ====*/}
							<div className="col-lg-6 flex-container">

								<div className="col-lg-4 left-right">
								<NavLink to={'/categories'}>
									<button className="first-button"> כל קטגוריות המוצרים</button>
								</NavLink>
								</div>

								<div className="col-lg-4 left-center">
									<button onClick={this.openUserLoginModal} className="second-button"><img src={lang == 'he' ? globalFileServer + 'header/default_user.png' : globalFileServer + 'enlogo.png'} alt="" />האיזור שלי</button>
								</div>

								<div className="col-lg-4 left-left">
									<img src={globalFileServer + 'header/lupa.png'} />
									<img src={globalFileServer + 'header/shop.png'} />
									<img src={globalFileServer + 'header/sideBar.png'} />
								</div>
							
							</div>
							</div>
					</div>

					<div className="flex-container header-container-mobile">
						{/*===== right section ====*/}
							<div className="col-lg-4 right_mobile">
								<img src={globalFileServer + 'header/mobile/sidebar.png'} onClick={this.props.toggleRightSideBar} />
							</div>
							{/*==== center section ====*/}
							<div className="col-lg-4 center-mobile ">
								<NavLink to={'/home/' + lang} className="first_logo">
									<img src={lang == 'he' ? globalFileServer + '/header/mobile/logo.png' : globalFileServer + 'enlogo.png'} alt=""/>
								</NavLink>
							</div>
							{/* left section */}
							<div className="col-lg-4 left-mobile ">
								<img src={globalFileServer + 'header/mobile/lupa.png'} />
								<img src={globalFileServer + 'header/shop.png'} />
							</div>
					</div>


				</div>
			
				{/* whats the ponit */}
				{this.state.userButton ? <LogInOne globalFileServer={globalFileServer} closeUserLoginModal={this.closeUserLoginModal}/> : null}
				{/* <LogInTwo/> */}


				{lang == 'ru' ?
					<style dangerouslySetInnerHTML={{ __html: `h1, h2, h3, h4, p, span, a, button, input, textarea, li { direction: ltr; }` }} />
					:
					<style dangerouslySetInnerHTML={{ __html: `[dir='rtl'] .slick-slide {float: left;}` }} />
				}
				{this.state.showCategories ?
					<div onClick={() => this.setState({ showCategories: false })} className="close-categories"></div>
					: null}
			</header>
		)
	}
}
