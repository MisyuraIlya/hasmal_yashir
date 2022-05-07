					{/*  ============================ right section  ===================================*/}
					
					<div className={this.state.toggleMenu ? "main-menu col-lg-5 opened" : "main-menu col-lg-5 closed"}>
						<div className="open-menu">
              <div onClick={this.toggleMenu} className={this.state.toggleMenu ? "nav-icon3 open" : "nav-icon3"}>
                <span></span><span></span><span></span><span></span>
              </div>
							<div className="main-logo-mobile">
                <NavLink to="/">
								  <img src={globalFileServer + 'logo.png'} />
                </NavLink>
							</div>
							<div>
                <div className="back" onClick={this.goBack}>
                  <img src={globalFileServer + 'icons/back-white-glb.svg'} />
                </div>
							</div>
						</div>

            {window.innerWidth > 1000 ?
  						<nav className={this.state.toggleMenu ? "opened" : "closed"}>
  							{localStorage.role ?
  								<div onClick={this.props.toggleMenu.bind(this)} className="menu-new">
  									<img src={globalFileServer + 'icons/head_icons/menu_new.svg'} />
  								</div>
  								:
  								<div className="header-right-cont">
  									<SiteNav headProps={this.props} goToWishList={()=> this.goToWishList()} currState={this.state} items={this.props.state.categories} />
  								</div>
  							}
  							<div onClick={() => this.setState({ toggleMenu: false, showCategories: false })} className="hide-on-desctop logo">
  								{/* <img src={globalFileServer + 'icons/logo-black.png'} /> */}
  							</div>
  						</nav>
            :
            <div>
              <nav className={this.state.toggleMenu ? "opened" : "closed"}>
  							{siteMenu}
  						{/*	<div onClick={() => this.setState({toggleMenu: false, showCategories: false})} className="hide-on-desctop logo">
  								<img src={globalFileServer + 'logo.svg'} alt=""/>
  							</div>*/}
  						</nav>
  						<div onClick={() => this.setState({ toggleMenu: false, showCategories: false })} className={this.state.toggleMenu ? "fake-click opened" : "fake-click closed"}></div>
            </div>
          }
					</div>
					{/* ======================== center section ======================= */}
					<div className="logo-center flex-container col-lg-2">
						{window.innerWidth > 1000 ?
              <NavLink to={'/home/' + lang}>
                <img src={lang == 'he' ? globalFileServer + 'logo.png' : globalFileServer + 'enlogo.png'} alt=""/>
              </NavLink>
						: null}
						{/* <img src={globalFileServer + 'icons/main-logo1.png'} /> */}
					</div>
					{/* =================  RIGHT section ============================ */}
					<div className="actions col-lg-5">
							<ul className={!localStorage.user ? "prelogIn" : "afterLog"}>
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
                {!localStorage.user && !localStorage.role && !localStorage.agent ?
                  <li className={"right"}>
                    {window.innerWidth < 1000 ?
                      <div>
                      <button id="logIn" onClick={() => this.setState({userEntry: "login"})}>
                        <p>{'כניסה'}</p>
                      </button>
                      <button id="signUp" onClick={() => this.setState({userEntry: "register"})}>
                        <p>{'הרשמה'}</p>
                      </button>
                      </div>
                    :null}
                  </li>
                : null}


									<li className={"left"}>
										<button onClick={this.props.toggleNotification.bind(this)} className="icon">
											{this.props.state.notifications && localStorage.notifications && (this.props.state.notifications - parseInt(localStorage.notifications)) > 0 ?
												<span>{this.props.state.notifications - parseInt(localStorage.notifications)}</span>
												: null}
											<img src={globalFileServer + 'icons/speaker.svg'} />
										</button>
									</li>
                {localStorage.user && this.props.state.user.Type != 2 ?
  								<li>
  									<NavLink onClick={this.props.toggleCart.bind(this)} to="/cart">
  										<button onClick={this.props.toggleCart.bind(this)} className="icon">
  											{this.props.state.productsInCart.length ?
  												<span>{this.props.state.productsInCart.length}</span> : null}
  											<img src={globalFileServer + 'icons/supermarket-amit.svg'} />
                        {parseInt(this.props.state.totalBasket) != 0 ?
                          <p className="ttl">{this.props.state.totalBasket}</p>
                        :null}

  										</button>
  									</NavLink>
  								</li>
                :null}

								{this.props.state.user.Type != 2 && ((localStorage.user && !localStorage.agent) || localStorage.role || (localStorage.agent && !localStorage.user)) ?
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
                {/*
								{window.innerWidth < 1000 && (localStorage.agent || localStorage.role || localStorage.user) ?
									<li>
										<button onClick={this.props.toggleMenu.bind(this)} className="icon">
											<img src={globalFileServer + 'icons/menu_new_2.svg'} />
										</button>
									</li>
									: null}
                */}
							</ul>
					</div>
          {/*
					{window.innerWidth < 1000 ?
						<div>
							<MobileNav items={this.props.state.categories} userEntry={this.state.userEntry} />
						</div>
					: null}
          */}
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