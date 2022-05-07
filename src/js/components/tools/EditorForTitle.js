import React, {Component} from 'react';

import styles from './EditorForTitle.scss';

export default class EditorForTitle extends Component {
	constructor(props) {
		super(props);
		this.state = {};
		this.handleChange = this.handleChange.bind(this);
		this.onBlur = this.onBlur.bind(this);
	}
	componentDidMount(){}
	handleChange(e) {
		let data = {
			itemId: this.props.element.Id,
			value: e.target.value,
			paramName: this.props.lang == 'he' ? this.props.paramName : this.props.paramName + 'Ru'
		}
		this.props.dist ? data.dist = this.props.dist : null;
		this.props.editItems(data);
	}
	onBlur(e){
		let data = {
			itemId: this.props.element.Id,
			value: e.target.value,
			paramName: this.props.lang == 'he' ? this.props.paramName : this.props.paramName + 'Ru'
		}
		this.props.dist ? data.dist = this.props.dist : null;
		this.props.updateItems(data);
	}
	render() {
		return (
			<div className="editor-for-title">
				<input
					value={this.props.lang == 'he' ?
						this.props.element[this.props.paramName] ? this.props.element[this.props.paramName] : ''
					:
						this.props.element[this.props.paramName + 'Ru'] ? this.props.element[this.props.paramName + 'Ru'] : ''
					}
					onChange={this.handleChange}
					onBlur={this.onBlur}
					type="text"
					placeholder={this.props.placeholder ? this.props.placeholder : this.props.lang == 'he' ? 'כותרת פריט' : 'Название позиции'}
					className={this.props.tag ? this.props.tag : null}
				/>
			</div>
		);
	}
}
