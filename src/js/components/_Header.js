import ReactDOM from "react-dom";
import React, { Component, Fragment, useState } from 'react';
import { NavLink } from "react-router-dom";
import UserEntry from './header/UserEntry';
import LiveChat from './header/LiveChat';
import { Helmet } from "react-helmet";


let user;

const MobileSiteNav = params => {
  const [activeSubCat, setActiveSubCat] = useState(false);
  const [activeSubSubCat, setActiveSubSubCat] = useState(false);


  const setActiveSubCatFunc = (id) => {
    setActiveSubCat(activeSubCat == id ? false : id);
  }
  const setActiveSubSubCatFunc = (id) => {
    setActiveSubSubCat(activeSubSubCat == id ? false : id);
  }

  let mainCattArr = params.items.filter((element) => {return !element.Lvl2ParentMyId && !element.Lvl3ParentMyId});

	return(

    <nav className={params.active ? "site-nav-mobile active" : "site-nav-mobile"}>
			<ul id = 'site-nav-ul' className="site-nav-ul">
        {params.appProps.state.user ?
          <NavLink onClick={params.close ? params.close : null} to={"/wishList"}>
            <p className="wishlist">סל קבוע</p>
          </NavLink>
        :null}
        {params.appProps.state.user ?
          <NavLink onClick={params.close ? params.close : null} to={"/docs"}>
            <p className="wishlist">מסמכים</p>
          </NavLink>
        :null}
				{params.items.map((element, index) => {
					if (!element.Lvl2ParentMyId && !element.Lvl3ParentMyId) {
            let sub = params.items.filter(item => item.Lvl2ParentMyId == element.Id);
						return(
							<li key={index} className={params.appProps.location.pathname.split("/")[2] == element.Id ? "item active" : "item"}>
                {sub.length > 0 ?
                  <Fragment>
                    <p onClick={()=>setActiveSubCatFunc(element.Id)} className="title-color arrow">{element.Title}</p>

                    <div className={activeSubCat == element.Id ? "sub-cat active" : "sub-cat"}>
                      {sub.map((elem, ind) => {
                        let subsub = params.items.filter(item => item.Lvl3ParentMyId == elem.Id);
                        let isSubView = true;
                        if(element.Title === elem.Title){
                          isSubView = false
                        }
                        return(
                          <div className="sub-cat_cont" key={ind} >
                            {isSubView ?
                              <div  className="sub-cat_row-cont">
                                {subsub.length > 0 ?
                                  <div>
                                    {ind == 0 ?
                                      <NavLink onClick={params.close ? params.close : null} to={"/category/" + element.Id + '/0/0'}>
                                        <p className="sub-cat_row">{"כל ה" + element.Title}</p>
                                      </NavLink>
                                    :null}
                                    <p  onClick={()=>setActiveSubSubCatFunc(elem.Id)} className="title-color arrow">{elem.Title}</p>
                                    <div className={activeSubSubCat == elem.Id ? "subsub-cat_maincont active" : "subsub-cat_maincont"}>
                                      {subsub.map((e,i) => {
                                        return(
                                          <div>
                                            {i == 0 ?
                                              <NavLink onClick={params.close ? params.close : null} to={"/category/" + element.Id + "/" + elem.Id + '/0'}>
                                                <p className="sub-cat_row">{"כל ה" + elem.Title}</p>
                                              </NavLink>
                                            :null}
                                            <ul key={i} className="subsub-cat_cont">
                                              <NavLink onClick={params.close ? params.close : null} to={'/category/' + element.Id + "/" + elem.Id + "/" + e.Id }>
                                                <li className="subsub-cat_row">{e.Title}</li>
                                              </NavLink>
                                            </ul>
                                          </div>
                                        )
                                      })}
                                    </div>
                                  </div>
                                :
                                  <NavLink  onClick={params.close ? params.close : null} className="sub-cat_row" to={'/category/' + element.Id + "/" + elem.Id + "/" + null }>
                                    <p className="title-color">{elem.Title}</p>
                                  </NavLink>
                                }
                              </div>
                            :null}
                          </div>
                        );
                      })}
                    </div>
                  </Fragment>

                :
                  <NavLink onClick={params.close ? params.close : null} className="title-color" to={"/category/" + element.Id + '/0/0'}>{element.Title}</NavLink>

                }

              </li>
						);
					}
				})}
			</ul>
		</nav>
	);
}

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
												to={'/category/' + element.Id + '/' + el.Id}>
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
      subCatActive:true,
      active: false
		}
		this.close = this.close.bind(this);
		this.open = this.open.bind(this);
		this.getProducts = this.getProducts.bind(this);
		this.toggleMenu = this.toggleMenu.bind(this);
		this.toggleShowCategories = this.toggleShowCategories.bind(this);
		this.getUsers = this.getUsers.bind(this);
		this.notVieWed = this.notVieWed.bind(this);
		this.goBack = this.goBack.bind(this);
		this.inputRef = React.createRef();
		this.reset = this.reset.bind(this);
    this.setSubCatActiveFunc = this.setSubCatActiveFunc.bind(this);


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
	goBack() {
		if (this.state.prevPath !== '/') {
			this.props.history.goBack();
		} else {
			this.props.history.push('/');
		}
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
	getUsers() {
		let val = {
			token: localStorage.token,
			sess_id: localStorage.sessionId
		};
		$.ajax({
			url: globalServer + 'user_list_slim.php',
			type: 'POST',
			data: val,
		}).done(function (d) {
			this.setState({ users: d.Userss });
		}.bind(this)).fail(function () { console.log('error'); });
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
			this.setState({ showCategories: true });
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
	// exit(){
	// 	this.props.localStorageClear();
	// 	location = '/index.html';
	// }
	toggleSearch() {
		this.props.toggleSearch(true);
		this.props.history.push("/wishList");
	}
	goToWishList() {
		this.setState({ toggleMenu: false, showCategories: false });
		this.props.toggleSearch(false);
		this.props.history.push("/wishList");

	}

	beforeLogOut(user) {
		this.props.history.push('/');

		if (user == "admin") {
			this.props.localStorageClear();
		} else if (user == "agent") {
			this.props.signOut(user);
		} else {
      if(localStorage.agent && localStorage.user){
        this.props.history.push('/');
        this.props.signOut("agentForUser");
      }else{
        this.props.history.push('/');
        this.props.signOut(user);
      }
		}
	}

  setSubCatActiveFunc(){
    this.setState({subCatActive:false});
    setTimeout(() => {
      this.setState({subCatActive:true})
    }, 300);
  }

	render() {
		let seo = this.props.state.seo.filter(item => '/' + item.Link == this.props.history.location.pathname)[0];
		const max = { Title: 70, Description: 240, Keywords: 240 };
		let lang = this.props.state.lang;
		let siteMenu =
			<div className="header-right-cont">
				<ul className={this.state.showCategories ? 'to-left' : null}>
{/*
				<li onClick={() => this.setState({ toggleMenu: false, showCategories: false })}>
					<NavLink exact to="/">{lang == 'he' ? 'בית' : 'главная'}</NavLink>
				</li>
*/}
  			{this.props.state.user ?
					<li onClick={this.goToWishList.bind(this)}>
						<NavLink exact to="/wishList">סל קבוע</NavLink>
					</li>
				: null}

        {this.props.state.categories ? this.props.state.categories.map((lvl1Ele,lvl1Ind) => {
          if(lvl1Ele.Lvl1ExId){
            let lvl2 = this.props.state.categories.filter((item) => {return item.Lvl2ParentMyId == lvl1Ele.Id});

            return(
              <li key={lvl1Ind} className="shop">
                <NavLink exact to={"/category/" + lvl1Ele.Id + '/0/0'}> {lvl1Ele.Title}</NavLink>
                {this.state.subCatActive && lvl2.length ?
                  <div className = "lvl2-main-cont">
                    {lvl2.map((lvl2Ele,lvl2Ind) => {
                      let lvl3 = this.props.state.categories.filter((item) => {return item.Lvl3ParentMyId == lvl2Ele.Id});
                      return(
                        <div key={lvl2Ind} className = "lvl2-row-cont">
                          <NavLink className = "lvl2-rows"
                            onClick={() => this.setSubCatActiveFunc()}
                            to={'/category/' + lvl1Ele.Id + '/' + lvl2Ele.Id + '/0'}>
                            {lvl2Ele.Title}
                          </NavLink>
                          {lvl3.length ?
                            <div>
                              <div className = "lvl2-arrow"></div>
                              <div className = "lvl3-main-cont">
                                {lvl3.map((lvl3Ele,lvl3Ind) => {
                                  return(
                                    <NavLink className = "lvl3-rows"
                                      key={lvl3Ind}
                                      onClick={() => this.setSubCatActiveFunc()}
                                      to={'/category/' + lvl1Ele.Id + '/' + lvl2Ele.Id + '/' + lvl3Ele.Id}>
                                      {lvl3Ele.Title}
                                    </NavLink>
                                  )
                                })}
                              </div>
                            </div>
                          :null}
                        </div>
                      )
                    })}
                  </div>
                :null}
              </li>
            )
          }
        })
        :null}


				{this.props.state.user && this.props.state.productSales && this.props.state.productSales.length > 1 ?
					<li className="sales" onClick={() => this.setState({ toggleMenu: false, showCategories: false })}>
						<div className="img-cont">
							<img src={globalFileServer + 'icons/percent.svg'} />
						</div>
						<NavLink exact to="/sales">מבצעים</NavLink>
					</li>
					: null}
				{localStorage.agent && localStorage.user ?
					<li onClick={() => this.setState({ toggleMenu: false, showCategories: false })}>
						<NavLink exact to="/docs">מסמכים</NavLink>
					</li>
				: null}
				{/*
						{localStorage.agent && localStorage.user ?
					<li onClick={() => this.setState({toggleMenu: false, showCategories: false})}>
							<NavLink exact to="/returns">החזרות</NavLink>
						</li>
				:null}

				{!localStorage.role && !localStorage.agent ? <li onClick={() => this.setState({ toggleMenu: false, showCategories: false })}>
					<NavLink to="/contact">
						{lang == 'he' ? 'צור קשר' : 'контакты'}
					</NavLink>
				</li> : null}
        	*/}
					{/*{localStorage.agent ?
					<li onClick={() => this.setState({toggleMenu: false, showCategories: false})}>
						<NavLink to='/admin-profil'>פרופיל</NavLink>
					</li>
				: null}*/}
			</ul>
			</div>



    return (
			<header className={lang == 'he' ? 'he' : 'ru'} id="header">

				{seo ?
					<Helmet>
						<title>{seo.Title ? seo.Title : ""}</title>
						<meta name="description" content={seo.Description ? seo.Description : ""} />
						<meta name="keywords" content={seo.Keywords ? seo.Keywords : ""} />
						<link rel="canonical" href={entry + '/' + seo.Link} />
						<link rel="alternate" href={entry + '/' + seo.Link} hreflang="he-il" />
					</Helmet>
					: null}
				{localStorage.role && seo ?
					<div className="page-settings">
						<div className="open-panel">
							<button onClick={this.startSeo.bind(this, seo)} className="icon">
								<img src={this.state.seo ? globalFileServer + 'icons/cross-white.svg' : globalFileServer + 'icons/controls.svg'} />
							</button>
						</div>
						{this.state.seo ? <div onClick={() => this.setState({ seo: false })} className="fake-div"></div> : null}
						<div className={this.state.seo ? "settings active" : "settings"}>
							<div className="flex-container container">
								<div className="col-lg-6">
									<div className="wrapper">
										<div className="flex-container">
											{this.state.seo && this.state.seo.Title != seo.Title && seo.Title.length <= max.Title ?
												<div onClick={this.saveSeo.bind(this, seo, 'Title')} className="save">
													<img src={globalFileServer + 'icons/save.svg'} />
												</div>
												: null}
											<div className="col-lg-3">
												<span>כותרת</span>
												<p>
													<span>{max.Title + ' / '}</span>
													<span className={seo.Title && (max.Title - seo.Title.length) < 0 ? 'error' : null}>
														{seo.Title ? (max.Title - seo.Title.length) : max.Title}
													</span>
												</p>
											</div>
											<div className="col-lg-9">
												<textarea
													value={seo.Title ? seo.Title : ""}
													onChange={this.props.editSeo.bind(this, seo.Id, 'Title')}
												/>
											</div>
										</div>
										<div className="flex-container">
											{this.state.seo && this.state.seo.Description != seo.Description && seo.Description.length <= max.Description ?
												<div onClick={this.saveSeo.bind(this, seo, 'Description')} className="save">
													<img src={globalFileServer + 'icons/save.svg'} />
												</div>
												: null}
											<div className="col-lg-3">
												<span>תיאור</span>
												<p>
													<span>{max.Description + ' / '}</span>
													<span className={seo.Description && (max.Description - seo.Description.length) < 0 ? 'error' : null}>
														{seo.Description ? (max.Description - seo.Description.length) : max.Description}
													</span>
												</p>
											</div>
											<div className="col-lg-9">
												<textarea
													value={seo.Description ? seo.Description : ""}
													onChange={this.props.editSeo.bind(this, seo.Id, 'Description')}
												/>
											</div>
										</div>
									</div>
								</div>
								<div className="col-lg-6">
									<div className="wrapper">
										<div className="flex-container">
											{this.state.seo && this.state.seo.Keywords != seo.Keywords && seo.Keywords.length <= max.Keywords ?
												<div onClick={this.saveSeo.bind(this, seo, 'Keywords')} className="save">
													<img src={globalFileServer + 'icons/save.svg'} />
												</div>
												: null}
											<div className="col-lg-3">
												<span>מילות מפתח</span>
												<p>
													<span>{max.Keywords + ' / '}</span>
													<span className={seo.Keywords && (max.Keywords - seo.Keywords.length) < 0 ? 'error' : null}>
														{seo.Keywords ? (max.Keywords - seo.Keywords.length) : max.Keywords}
													</span>
												</p>
											</div>
											<div className="col-lg-9">
												<textarea
													value={seo.Keywords ? seo.Keywords : ""}
													onChange={this.props.editSeo.bind(this, seo.Id, 'Keywords')}
												/>
											</div>
										</div>
										<div className="flex-container">
											{this.state.seo && this.state.seo.Redirect != seo.Redirect ?
												<div onClick={this.saveSeo.bind(this, seo, 'Redirect')} className="save">
													<img src={globalFileServer + 'icons/save.svg'} />
												</div>
												: null}
											<div className="col-lg-3">
												<span>הפניה מחדש</span>
											</div>
											<div className="col-lg-9">
												<textarea
													value={seo.Redirect ? seo.Redirect : ""}
													onChange={this.props.editSeo.bind(this, seo.Id, 'Redirect')}
												/>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
					</div>
					: null}
				{this.state.userEntry ? <UserEntry {...this} /> : null}
				{localStorage.agent || localStorage.role || localStorage.user ? <LiveChat {...this} /> : null}

				<div className="header-wrapper flex-container" onClick={() => this.setState({ seo: false })}>
          <div className="flex-container col-lg-8">
            <div className="col-lg-1 inner-user-menu">
            </div>
            <div className="logo-center col-lg-2">
              {window.innerWidth > 1000 ?
                <NavLink to="/">
                  <img src={globalFileServer + 'icons/main-logo11.png'} />
                </NavLink>
              :null}
            </div>
  					<div className={this.state.toggleMenu ? "main-menu col-lg-9 opened" : "main-menu col-lg-9 closed"}>
  						{localStorage.agent || localStorage.id || localStorage.role || localStorage.user ?
  							<div onClick={this.props.toggleMenu.bind(this)} className="menu-new">
  								<img src={globalFileServer + 'icons/head_icons/menu_new.svg'} />
  							</div>
  						: null}

  						<div className="open-menu">
  							<div onClick={this.toggleMenu} className={this.state.toggleMenu ? "nav-icon3 open" : "nav-icon3"}>
  								<span></span><span></span><span></span><span></span>
  							</div>
  							<div className="main-logo-mobile">
                  {window.innerWidth > 1000 ?
                    <img src={globalFileServer + 'icons/app_logo.png'} />
                    :
                    <NavLink to="/">
                      <img src={globalFileServer + 'icons/app_logo_name.png'} />
                    </NavLink>
                  }
  							</div>
  							<div onClick={this.goBack} className="back">
  								<img src={globalFileServer + 'icons/back-white-glb.svg'} />
  							</div>
  						</div>
  						<nav className= "closed">
  							{window.innerWidth > 1000 ?
                  <div>
                    {siteMenu}
                  </div>
  							:
                  null
                }
  							<div onClick={() => this.setState({ toggleMenu: false, showCategories: false })} className="hide-on-desctop logo">
  								{/* <img src={globalFileServer + 'icons/logo-black.png'} /> */}
  							</div>
  						</nav>
              {window.innerWidth < 1000 ?
                <MobileSiteNav active={this.state.toggleMenu} items={this.props.state.categories}  appProps={this.props} close={ () => this.setState({toggleMenu:false})} />
              :null}
  					</div>
          </div>
					<div className="actions col-lg-4">
						<ul>
							{/*<li>
								<button onClick={this.goBack} className="icon back">
									<img src={globalFileServer + 'icons/head_icons/previous-white.svg'} />
								</button>
							</li>*/}
							{localStorage.user ?
								<li>
									<button onClick={this.beforeLogOut.bind(this, "user")} className={window.innerWidth > 1000 ? "sign-in sign-out" : "icon"}>
										{window.innerWidth > 1000 ?
											<span>{this.props.state.user.Name ? (this.props.state.user.Name.length > 10 ? this.props.state.user.Name.substring(0, 10) + '.. / יציאה' : this.props.state.user.Name + ' / יציאה') : null}</span>

											:
											<img src={globalFileServer + 'icons/logout.svg'} />
										}
									</button>
								</li>
								: null}
							{localStorage.role ?
								<li>
									<button onClick={this.beforeLogOut.bind(this, "admin")} className={window.innerWidth > 1000 ? "sign-in sign-out" : "icon"}>
										{window.innerWidth > 1000 ?
											<span>{lang == 'he' ? 'יציאה מאדמין' : 'выход'}</span>
											:
											<img src={globalFileServer + 'icons/logout.svg'} />
										}
									</button>
								</li>
								: null}
							{localStorage.agent && !localStorage.user ?
								<li>
									<button onClick={this.beforeLogOut.bind(this, "agent")} className={window.innerWidth > 1000 ? "sign-in sign-out" : "icon"}>
										{window.innerWidth > 1000 ?
											<span>{localStorage.agentName + ' / יציאה'}</span>
											:
											<img src={globalFileServer + 'icons/logout.svg'} />
										}
									</button>
								</li>
								: null}
							{!localStorage.user && !localStorage.role && !localStorage.agent ?
								<li>
									<button id="signIn" onClick={() => this.setState({ userEntry: true })} className={window.innerWidth > 1000 ? "sign-in" : "icon"}>
										{window.innerWidth > 1000 ?
											<span>{lang == 'he' ? 'התחבר' : 'вход'}</span>
											:
											<p>כניסה</p>
										}  {/*<img src={globalFileServer +'icons/login.svg'} /> */}
									</button>
								</li>
								: null}
							{!localStorage.role && !localStorage.agent ?
								<li>
									<button onClick={this.props.toggleNotification.bind(this)} className="icon">
										{this.props.state.notifications && localStorage.notifications && (this.props.state.notifications - parseInt(localStorage.notifications)) > 0 ?
											<span>{this.props.state.notifications - parseInt(localStorage.notifications)}</span>
											: null}
										<img src={globalFileServer + 'icons/speaker.svg'} />
									</button>
								</li>
								: null}
							<li>
								<NavLink onClick={this.props.toggleCart.bind(this)} to="/cart">
									<button onClick={this.props.toggleCart.bind(this)} className="icon">
										{this.props.state.productsInCart.length ?
											<span>{this.props.state.productsInCart.length}</span> : null}
										<img src={globalFileServer + 'icons/supermarket-amit.svg'} />
									</button>
								</NavLink>
							</li>

							{(localStorage.user && !localStorage.agent) || localStorage.role || (localStorage.agent && !localStorage.user) ?
								<li>
									<button className="icon" onClick={() => this.setState({ openChat: true })}>
										{this.state.chatCounter ? <span>{this.state.chatCounter}</span> : null}
										<img src={globalFileServer + 'icons/head_icons/chat.svg'} />
									</button>
								</li>
								: null}
							<li>
								<button onClick={this.toggleSearch.bind(this)} className="icon">
									<img src={globalFileServer + 'icons/search-amit.svg'} />
								</button>
							</li>
							{window.innerWidth < 1000 && (localStorage.agent || localStorage.role || localStorage.user) ?
								<li>
									<button onClick={this.props.toggleMenu.bind(this)} className="icon">
										<img src={globalFileServer + 'icons/head_icons/menu_new.svg'} />
									</button>
								</li>
								: null}
						</ul>
					</div>
					{/* <div className={this.props.state.headerPop ? "header-popup-main-cont active" : "header-popup-main-cont"}>
						<div className="header-popup-sub-cont">
							<h3>מוצר התווסף לסל הקניות</h3>
							<img src={globalFileServer + 'icons/head_icons/cart.svg'} />
						</div>
					</div> */}
					<div className={this.props.state.user.Blocked ? "header-popup-glb-alert active" : "header-popup-glb-alert"}>
						<div className="header-popup-glb-alert-sub-cont">
							<h3>אין באפשרותך לבצע הזמנה. אנא צור קשר</h3>
						</div>
					</div>
				</div>

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
