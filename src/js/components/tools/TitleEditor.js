import React, {Component} from 'react';

import styles from './TitleEditor.scss';

export default class TitleEditor extends Component {
	constructor(props){
		super(props);
		this.state = {
			edit: false,
			title: this.props.title
		}
		this.save = this.save.bind(this);
		this.cansel = this.cansel.bind(this);
		this.EditOn = this.EditOn.bind(this);
		this.getTitle = this.getTitle.bind(this);
	}
	getTitle(event){
		this.setState({	title: event.target.value });
	}
	EditOn(){
		this.setState({	edit: true });
	}
	save(){
		this.setState({ edit: false });
		this.props.updateItems(this.props.itemId, this.state.title, this.props.toUpdate);
	}
	cansel(){
		this.setState({
			edit: false,
			title: this.props.title
		});
	}

	render() {
		return (
			<div className={this.props.subTitle ? "title-editor sub-title-editor" : "title-editor"}>
				{!this.state.edit ?
					<div className={this.props.banners ? "big-banners" : null}>
						<span onClick={this.EditOn} className="edit"><img src={globalFileServer + 'icons/edit.svg'}/></span>
						<h2 onClick={this.EditOn}>{this.props.title}</h2>
					</div>
				:
					<div className={this.props.banners ? "big-banners-val" : null}>
						<input onChange={this.getTitle} defaultValue={this.props.title} type="text" name="title-reditor" />
						<ul className="actions">
							<li><button onClick={this.save} className="button-green">שמור</button></li>
							<li><button onClick={this.cansel} className="button-red">ביטול</button></li>
						</ul>
					</div>
				}
			</div>
		);
	}
}
