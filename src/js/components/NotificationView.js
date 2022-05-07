import React, { Component, Fragment } from "react";
import { NavLink } from "react-router-dom";
import YouTube from 'react-youtube';

const opts = {
	height: '175',
	width: '100%',
	playerVars: {
		autoplay: 0
	}
};

export default class NotificationView extends Component {
	constructor(props){
		super(props);
		this.state = {
			items: []
		}
		this.getItems = this.getItems.bind(this);
		this.returnDate = this.returnDate.bind(this);
		this.returnLink = this.returnLink.bind(this);
	}
	componentDidMount(){

    this.intervalGetNotifications ? clearInterval(this.intervalGetNotifications):null;
    !localStorage.agent && !localStorage.role ? this.getItems() : null;
    if(!this.intervalGetNotifications){
      clearInterval(this.intervalGetNotifications)
      //!localStorage.agent && !localStorage.role ? this.intervalGetNotifications = setInterval(() => this.getItems(), 10000) : null;
    }

	}
  // componentWillReceiveProps(nextProps) {
	// 	if (this.props.state.openNotification != nextProps.state.openNotification && nextProps.state.openNotification) {
	// 	  this.getItems();
	// 	}
	// }
	getItems = async() => {
		let userRole;
		let privateCourse = null;
		let privatePrice = null;

    let user = null;

    localStorage.user ? user = JSON.parse(localStorage.user) : null;

    if(!user){
      userRole = 1;
    }else if(user.Type == 1){
      userRole = 2;
    }else if(user.Type == 2){
      userRole = 3;
    }


    const valAjax = {
      funcName: 'viewItemsSlim',
      point: 'new-api/notification',
      userRole: userRole
    };

    try {
      const data = await this.props.ajax(valAjax);

      let items = JSON.parse(data.items).Notifications;

			if (data.privateCourse) {
				data.privateCourse.map(item => items.push(item));
			}
			if (data.privatePrice) {
				data.privatePrice.map(item => items.push(item));
			}
			items.sort((a, b) => b.Id - a.Id);
      if(JSON.stringify(items) != JSON.stringify(this.state.items)){
        this.setState({items});
        this.props.setNotify(items.length);
      }

			if (!localStorage.notifications) {
				localStorage.setItem('notifications', 0);
			}
			if (localStorage.notifications && parseInt(localStorage.notifications) > items.length) {
				localStorage.notifications = items.length;
			}

    } catch(err) {
      //this.props.connectionError('connection error GetSales');
      console.log('connection error GetSales');
      this.setState({preload:false});
    }


    setTimeout(() => {
      this.getItems();
    }, 10000);
	}
	returnDate(val){
		let dateToReturn = "";
		let nDate = new Date;
		let d = nDate.getDate();
	    let m = nDate.getMonth() + 1;
	    let y = nDate.getFullYear();
		let date = d + "-" + m + "-" + y;

		let elementDate = val.split(' | ');

		if (elementDate[0] == date) {
			dateToReturn = elementDate[1];
		} else {
			dateToReturn = elementDate[0];
		}

		return dateToReturn;
	}
	returnLink(val){
		let locationOrigin = "https://avyafood.co.il";
		let res = val.slice(locationOrigin.length);
		return res;
	}
	render(){
		return (
			<Fragment>
				<div className={this.props.state.openNotification ? "notification-view header-cart opened" : "notification-view header-cart closed"}>
					<div className="header-cart-wrapp">
						<img onClick={this.props.toggleNotification.bind(this)} className="close-cart" src={globalFileServer + 'icons/cross-grey.svg'} />
						<div className="header">
							<h3>חדשות</h3>
						</div>
						<div id="notify" className="products">
							{this.state.items.map((element, index) => {
								return(
									<div key={index} className="item">
										<div className="wrapper">
											<h2>{element.Title}</h2>
											<span className="date">{this.returnDate(element.Date)}</span>
											{element.Img ?
												<img src={globalFileServer + 'notifications/' + element.Img} />
											: null}
											<p>{element.Description}</p>
											{element.Video ?
												<YouTube
													videoId={element.Video}
													opts={opts}
												/>
											: null}
											{element.Link ?
                        <div className="btn-cont">
                          <a href={globalFileServer + 'alon/' + element.Link} target="_blank">
                            <p>לחץ לצפייה</p>
                          </a>
                        </div>
											: null}
										</div>
									</div>
								);
							})}
						</div>
					</div>
				</div>
				{this.props.state.openNotification ?
					<div onClick={this.props.toggleNotification.bind(this)} className="fake-notification"></div>
				: null}
			</Fragment>
		)
	}
}
