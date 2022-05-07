import React, { Component, Fragment } from "react";
import ReactDOM from "react-dom";

require('./globals.js');

if (module.hot) {
	module.hot.accept();
}

class App extends Component {
	constructor(props){
		super(props);
		this.state = {}
		this.saveAppId = this.saveAppId.bind(this);
	}
	componentDidMount(){
		document.addEventListener('deviceready', () => {
			window.plugins.OneSignal.startInit("1095dabe-e167-457e-8282-fee616f6b124").inFocusDisplaying(window.plugins.OneSignal.OSInFocusDisplayOption.Notification).endInit();
			window.plugins.OneSignal.getIds((ids) => {
				this.saveAppId(ids.userId);
			});
		}, false);
	}
	saveAppId(appId){
		alert(appId);
		let value = {
			appId: appId
		}
		if (localStorage.id && !localStorage.agent) {
			value.userId = localStorage.id
		}
		$.ajax({
			url: globalServer + 'new-api/save_app_id.php',
			type: 'POST',
			data: value,
		}).done(function(d) {
			alert(JSON.stringify(d));
		}.bind(this)).fail(function() { console.log('error'); });
	}
	render() {
		return (
			<div className="home">
				<button onClick={() => this.saveAppId('d6s5f4gsdf5s4')}>getUserAppId</button>
			</div>
		);
	}
}

ReactDOM.render(<App />, document.getElementById('root'));
