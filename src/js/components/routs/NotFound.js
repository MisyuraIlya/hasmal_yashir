import React, { Component } from 'react';

export default class NotFound extends Component {
	constructor(props){
		super(props);
		this.state = {}
	}
	componentWillMount(){
		this.props.history.push('/');
	}
	componentDidMount(){}
	render(){
		return (
			<div className="page-container not-found">
				<div className="wrapper">
					<h1>שגיאה</h1>
					<div className="error">
						<img src={globalFileServer + 'icons/stop.svg'} />
						<span>404</span>
					</div>
					<h2>העמוד לא נמצא</h2>
					<div className="actions">
						<button onClick={() => this.props.history.push('/')}>
							דף הבית
						</button>
						<button onClick={() => this.props.history.goBack()}>
							חזור
						</button>
					</div>
				</div>
			</div>
		)
	}
}