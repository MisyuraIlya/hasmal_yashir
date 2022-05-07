import React, { Component } from 'react';
import {hashHistory} from 'react-router';
import Search from './liveChat/Search';
import moment from 'moment';
import MyCropper from "../tools/MyCropper";

let firstDate;

export default class LiveChat extends Component {
	constructor(props){
		super(props);
		this.state = {
			message: '',
			img: false,
			activeUser: false,
			itemsFiltered: [],
			moment: moment(),
			notViewed: [],
			messages: false,
			user: false,
			lastMessage: false,
			preload: false
		}
		this.handleKeyDown = this.handleKeyDown.bind(this);
		this.post = this.post.bind(this);
		this.getMessages = this.getMessages.bind(this);
		this.backToUsersList = this.backToUsersList.bind(this);
		this.setViewed = this.setViewed.bind(this);
		this.getUserFromSearch = this.getUserFromSearch.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.addImg = this.addImg.bind(this);
		this.uploadImg = this.uploadImg.bind(this);
		this.setPreload = this.setPreload.bind(this);
		this.unsetPreload = this.unsetPreload.bind(this);
		this.close = this.close.bind(this);
	}
	componentDidMount(){
		this.getMessages();
		this.intervalGetMessages = setInterval(this.getMessages, 5000);
	}
	componentWillUpdate(nextProps, nextState){
		if (nextProps.props.state.chatModel && this.props.props.state.chatModel != nextProps.props.state.chatModel) {
			this.backToUsersList();
			this.props.open();
			this.startChat(nextProps.props.state.chatModel);
			this.props.props.setActiveModel(false);
		}
	}
	componentWillUnmount(){
		clearInterval(this.intervalGetMessages);
		this.setState({
			message: '',
			img: false
		});
	}
	close(){
		this.setState({
			message: '',
			img: false,
			activeUser: false,
			itemsFiltered: [],
			moment: moment(),
			notViewed: [],
			messages: false,
			user: false,
			lastMessage: false,
			preload: false
		});
		clearInterval(this.intervalGetUserMessages);
		clearInterval(this.intervalGetMessages);
		setTimeout(() => this.intervalGetMessages = setInterval(this.getMessages, 4000), 4000);
		this.props.close();
	}
	setPreload(){
		this.setState({preload: true});
	}
	unsetPreload(){
		this.setState({preload: false});
	}
	uploadImg(data){
		this.setState({img: data.fileName, preload: true});
		let val = {
			userId: localStorage.id,
			token: localStorage.token,
			sess_id: localStorage.sessionId,
			fileName: data.fileName,
			img: data.img
		};
		$.ajax({
			url: globalServer + 'live_chat_upload_img.php',
			type: 'POST',
			data: val,
		}).done(function(d, data) {
			if (data.result == "success") {
				let target_img = 0;
				this.imgInterval = setInterval(() => {
					if (target_img) {
						console.log('wait for img');
						clearInterval(this.imgInterval);
						this.post();
						target_img = 0;
					}
				}, 500);
				let newImg = new Image();
				newImg.src = globalFileServer + 'chat/' + d.fileName;
				newImg.onload = () => {
					target_img = 1;
				}
			}
		}.bind(this, val)).fail(function() { console.log('error'); });
	}
	addImg(itemId, d){
		this.setState({img: d.fileName, preload: true});
		let val = {
			userId: localStorage.id,
			token: localStorage.token,
			sess_id: localStorage.sessionId,
			fileName: d.fileName,
			img: d.Img
		};
		$.ajax({
			url: globalServer + 'live_chat_upload_img.php',
			type: 'POST',
			data: val,
		}).done(function(d, data) {
			if (data.result == "success") {
				let target_img = 0;
				this.imgInterval = setInterval(() => {
					if (target_img) {
						console.log('wait for img');
						clearInterval(this.imgInterval);
						this.post();
						target_img = 0;
					}
				}, 500);
				let newImg = new Image();
				newImg.src = globalFileServer + 'chat/' + d.fileName;
				newImg.onload = () => {
					target_img = 1;
				}
			}
		}.bind(this, val)).fail(function() { console.log('error'); });
	}
	setViewed(msg){
		let ids = [];
		msg.map((element, index) => {
			ids.push(element.Id);
		});
		let val = {
			userId: localStorage.id,
			token: localStorage.token,
			sess_id: localStorage.sessionId,
			Ids: ids,
			ActiveUser: this.state.activeUser
		};
		$.ajax({
			url: globalServer + 'set_viewed_live_chat.php',
			type: 'POST',
			data: val,
		}).done(function(d) {
		}.bind(this)).fail(function() { console.log('error'); });
	}
	backToUsersList(){
		this.setState({
			message: '',
			img: false,
			activeUser: false,
			itemsFiltered: [],
			moment: moment(),
			notViewed: [],
			messages: false,
			user: false,
			lastMessage: false,
			preload: false
		});
		this.getMessages();
		clearInterval(this.intervalGetUserMessages);
		this.intervalGetMessages = setInterval(this.getMessages, 4000);
	}
	getUserMessages(userId){
		console.log('getUserMessages');
    let user;
    if(localStorage.user){
      user = JSON.parse(localStorage.user)
    }
		let val = {
			token: localStorage.token,
			sess_id: localStorage.sessionId,
			UserId: user.Id
		};
		$.ajax({
			url: globalServer + 'live_chat_view.php',
			type: 'POST',
			data: val,
		}).done(function(userId, d) {
			let items = [];
			d[0].LiveChats.map((element, index) => { items.push(element) });
			d[1].LiveChats.map((element, index) => { items.push(element) });
			items.sort((a, b) => { return a.Id - b.Id });
			items = items.filter((element) => {
				return element.UserId == userId || element.SendTo == userId
			});
			items.length ? firstDate = items[0].Date : null;
			let msg = items.filter((element) => {
				return element.UserId == userId && !element.Viewed;
			});
			msg.length ? this.setViewed(msg) : null;
			if (JSON.stringify(this.state.messages) != JSON.stringify(items)) {
				setTimeout(() => { document.getElementById('chatMessages').scrollTop = document.getElementById('chatMessages').scrollHeight }, 100);
			}
			this.setState({messages: items, lastMessage: items[items.length - 1]});
			this.props.notVieWed(items);
		}.bind(this, userId)).fail(function() { console.log('error'); });
	}
	startChat(userId){
		console.log('startChat');
		let user = this.props.state.users.filter((element) => { return element.Id == userId });
		this.setState({activeUser: userId, user});
		this.getUserMessages(userId);
		clearInterval(this.intervalGetMessages);
		this.intervalGetUserMessages = setInterval(this.getUserMessages.bind(this, userId), 4000);
	}
	getUserFromSearch(userId) {
		this.startChat(userId);
	}
	getMessages(){
		console.log('getMessages');
    let user;
    if(localStorage.user){
      user = JSON.parse(localStorage.user)
    }
		let val = {
			token: localStorage.token,
			sess_id: localStorage.sessionId,
			UserId: user.Id
		};
		$.ajax({
			url: globalServer + 'live_chat_view.php',
			type: 'POST',
			data: val,
		}).done(function(d) {

			let items = [];
			d[0].LiveChats.map((element, index) => { items.push(element) });
			d[1].LiveChats.map((element, index) => { items.push(element) });
			items.sort((a, b) => { return a.Id - b.Id });
			let ids = [];
			items.map((element, index) => {
				element.SendTo ? ids.push(element.SendTo) : null;
				element.UserId ? ids.push(element.UserId) : null;
			});
			let uniqueId = ids.filter((v, i, a) => a.indexOf(v) === i);
			let id = uniqueId.filter((i) => { return i != localStorage.id });
			let itemsFiltered = [];
			let notViewed = [];
			for (let value of id) {
				let temp = items.filter((element) => {
					return element.SendTo == value || element.UserId == value;
				});
				temp.length ? itemsFiltered.push(temp[temp.length - 1]) : null;

				let uIds = items.filter((element) => {
					return element.UserId == value && !element.Viewed;
				});
				if (uIds.length) {
					let temp = { Id: value, Count: uIds.length };
					notViewed.push(temp);
				}
			}
			itemsFiltered.sort((a, b) => { return b.Id - a.Id });
			if (JSON.stringify(this.state.items) != JSON.stringify(items)) {
				this.setState({items});
				this.props.notVieWed(items);
			}
			if (JSON.stringify(this.state.itemsFiltered) != JSON.stringify(itemsFiltered)) {
				this.setState({itemsFiltered});
			}
			if (JSON.stringify(this.state.notViewed) != JSON.stringify(notViewed)) {
				this.setState({notViewed});
			}
		}.bind(this)).fail(function() { console.log('error'); });
	}
	post(){
		if (this.state.message.length || this.state.img) {
			let val = {
				userId: localStorage.id,
				token: localStorage.token,
				sess_id: localStorage.sessionId,
				SendTo: this.state.activeUser,
				Message: this.state.message && this.state.message.length ? this.state.message : null,
				Img: this.state.img ? this.state.img : null,
				Date: this.state.moment.format("DD/MM/YYYY, H:mm")
			};
			this.setState({message: '', img: false});
			$.ajax({
				url: globalServer + 'create_message_live_chat.php',
				type: 'POST',
				data: val,
			}).done(function(d) {
				let messages = this.state.messages;
				let msg = JSON.parse(d.msg);
				msg.Animated = 'animated';
				messages.push(msg);
				this.setState({messages, preload: false});
				setTimeout(() => { document.getElementById('chatMessages').scrollTop = document.getElementById('chatMessages').scrollHeight }, 100);
			}.bind(this)).fail(function() { console.log('error'); });
		}
	}
	handleChange(e){
		e.preventDefault();
		this.setState({message: e.target.value})
	}
	handleKeyDown(e){
		if (e.key == "Enter") this.post();
	}
	render(){
		let today = this.state.moment.format("DD/MM/YYYY, H:mm");
		let temp = 0;
		return (
			<div id="live-chat" tabIndex="0" className="live-chat">
				{this.props.state.openChat ? <div onClick={this.close} className="fake-click"></div> : null}
				<div className={this.props.state.openChat ? "live-chat-wrapper active" : "live-chat-wrapper"}>
					{this.state.preload ?
						<div className="spinner-wrapper">
							<div className="spinner">
								<div className="bounce1"></div>
								<div className="bounce2"></div>
								<div className="bounce3"></div>
							</div>
						</div>
					: null}
					<div className="header">
						{this.state.messages ?
							<div>
								<div className="heading user">
									{this.state.user.length ?
										<div>
											{this.state.user[0].Img ?
												<img src={globalFileServer + 'profile/' + this.state.user[0].Img} />
											:
											<img src={globalFileServer + 'icons/chat.svg'} />
											}
											<div className="details">
												<p className="name">{this.state.user[0].Name}</p>
												{this.state.lastMessage ?
													<p className="m">
														<text>{this.state.lastMessage.Message ?
															this.state.lastMessage.Message.length > 20 ? this.state.lastMessage.Message.substring('', 20) + ' ...' : this.state.lastMessage.Message
														: 'תמונה'}</text>
													</p> : null}
											</div>
										</div>
									: null}
								</div>
								<div onClick={this.backToUsersList} className="close-chat">
									<img src={globalFileServer + 'icons/back.svg'} />
								</div>
							</div>
						:
						<div>
							<div className="heading first">
								<img onClick={this.close} src={globalFileServer + 'icons/cross-white.svg'} />
								{this.props.state.openChat ? <Search data={this} /> : null}
							</div>
						</div>
						}
					</div>
					<div className={this.state.messages ? "users-body swipe" : "users-body"}>
						<div className="users">
							{this.props.state.users.length && this.state.itemsFiltered.length ? this.state.itemsFiltered.map((element, index) => {
								let userId = element.SendTo == localStorage.id ? element.UserId : element.SendTo;
								let userToSpeak = this.props.state.users.filter((elem) => {
										return elem.Id == userId;
								});
								let dateToShow = today.split(',')[0] == element.Date.split(',')[0] ? element.Date.split(',')[1] : element.Date.split(',')[0];
								let notViewed = this.state.notViewed.filter((elem) => {return elem.Id == userId});
								return (
									<div onClick={this.startChat.bind(this, userId)} key={index} className="user">
										<div className="img">
											{userToSpeak[0].Img ?
												<img src={globalFileServer + 'profile/' + userToSpeak[0].Img} />
											:
											<div className="no-img">
												<span>{userToSpeak[0].Name[0]}</span>
											</div>
											}
										</div>
										<div className="name">
											<h4>{userToSpeak[0].Name}</h4>
											<p>{element.Message ? element.Message.length > 27 ? element.Message.substring('', 27) + ' ...' : element.Message : "תמונה"}</p>
										</div>
										<div className="other">
											<p>{dateToShow}</p>
											{notViewed && notViewed[0] && notViewed[0].Count ?
												<div className="count">
													<span>{notViewed[0].Count}</span>
												</div> : null}
										</div>
									</div>
								);
							}) : null}
						</div>
					</div>
					{this.state.messages ?
						<div className="footer">
							<div className="message-body">
								<div className="attach">
									<MyCropper
										aspectRatio={16/16} {...this}
										itemId={localStorage.id}
										folder="profile"
										chat={true}
									/>
								</div>
								<input
									type="text"
									onChange={this.handleChange}
									value={this.state.message}
									placeholder="הודעה"
									onKeyDown={this.handleKeyDown}
								/>
							</div>
							<div className="send">
								<button onClick={this.post}>
									<img src={globalFileServer + 'icons/send-message.svg'} />
								</button>
							</div>
						</div> : null}
					<div id="chatMessages" className={this.state.messages ? "chat-body active" : "chat-body"}>
						<div className="messages">
							{this.state.messages.length ?
								<div className="date-separator first">
									<p>{firstDate ? today.split(',')[0] == firstDate.split(',')[0] ? 'היום' : firstDate.split(',')[0] : null}</p>
								</div> : null}
							{this.state.messages.length ? this.state.messages.map((element, index) => {
								return (
									<div key={index} className="msg">
										{this.state.messages[index + 1] && this.state.messages[index + 1].Date.split(',')[0] != element.Date.split(',')[0] ?
											<div className="date-separator">
												{today.split(',')[0] == this.state.messages[index + 1].Date.split(',')[0] ?
													<p>היום</p>
												:
												<p>{this.state.messages[index + 1].Date.split(',')[0]}</p>
												}
											</div> : null}
										<div className={element.SendTo == localStorage.id ? "msg-wrapper" : "msg-wrapper my-message"}>
											{element.Message ? <p className={element.Animated ? 'animated bounceIn' : null}>{element.Message}</p> : null}
											{element.Img ? <span className="image-holder">
												<img
													className={element.Animated ? 'chat-img animated bounceIn' : 'chat-img'}
													src={globalFileServer + 'chat/' + element.Img}
													onLoad={() => this.setState({preload: false})}
												/>
											</span> : null}
											<div className={element.Animated ? 'data animated fadeIn' : 'data'}>
												{element.SendTo != localStorage.id ?
													<div>
														{element.Viewed ?
														<img src={globalFileServer + 'icons/viewed.svg'} />
														:
														<img src={globalFileServer + 'icons/not-viewed.svg'} />
														}
													</div>
												: null}
												<span>{element.Date.split(',')[1]}</span>
											</div>
										</div>
									</div>
								);
							}) : null}
							</div>
						</div>
				</div>
			</div>
		)
	}
}
