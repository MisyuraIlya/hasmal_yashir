import React, {Component} from 'react';
import RichTextEditor from 'react-rte';

import styles from './RichEditor.scss';

const toolbarConfigFull = {
	display: ['INLINE_STYLE_BUTTONS', 'BLOCK_TYPE_BUTTONS', 'LINK_BUTTONS', 'BLOCK_TYPE_DROPDOWN', 'HISTORY_BUTTONS'],
	INLINE_STYLE_BUTTONS: [
		{label: 'Bold', style: 'BOLD', className: 'custom-css-class'},
		{label: 'Italic', style: 'ITALIC'},
		{label: 'Underline', style: 'UNDERLINE'}
		],
		BLOCK_TYPE_DROPDOWN: [
		{label: 'Normal', style: 'unstyled'},
		{label: 'Heading Large', style: 'header-one'},
		{label: 'Heading Medium', style: 'header-two'},
		{label: 'Heading Small', style: 'header-three'}
		],
		BLOCK_TYPE_BUTTONS: [
		{label: 'UL', style: 'unordered-list-item'},
		{label: 'OL', style: 'ordered-list-item'}
	]
}
const toolbarConfigLimited = {
	display: ['INLINE_STYLE_BUTTONS', 'BLOCK_TYPE_BUTTONS', 'LINK_BUTTONS', 'HISTORY_BUTTONS'],
	INLINE_STYLE_BUTTONS: [
		{label: 'Bold', style: 'BOLD', className: 'custom-css-class'},
		{label: 'Italic', style: 'ITALIC'},
		{label: 'Underline', style: 'UNDERLINE'}
		],
		BLOCK_TYPE_BUTTONS: [
		{label: 'UL', style: 'unordered-list-item'},
		{label: 'OL', style: 'ordered-list-item'}
	]
}

export default class RichEditor extends Component {
	constructor(props) {
		super(props);
		this.state ={
			value: false
		};
		this.handleChange = this.handleChange.bind(this);
		this.save = this.save.bind(this);
	}
	componentDidMount(){
		if (this.props.lang == 'he') {
			this.setState({	value: RichTextEditor.createValueFromString(this.props.text[this.props.paramName] ? this.props.text[this.props.paramName] : '', 'html')	});
		}
		if (this.props.lang == 'ru') {
			this.setState({	value: RichTextEditor.createValueFromString(this.props.text[this.props.paramName + 'Ru'] ? this.props.text[this.props.paramName + 'Ru'] : '', 'html') });
		}
	}
	handleChange(value) {
		this.setState({value});
	}
	componentWillReceiveProps(nextProps){
		if (this.props.lang != nextProps.lang) {
			if (nextProps.lang == 'he') {
				this.setState({	value: RichTextEditor.createValueFromString(this.props.text[this.props.paramName] ? this.props.text[this.props.paramName] : '', 'html')	});
			}
			if (nextProps.lang == 'ru') {
				this.setState({	value: RichTextEditor.createValueFromString(this.props.text[this.props.paramName + 'Ru'] ? this.props.text[this.props.paramName + 'Ru'] : '', 'html') });
			}
		}
	}
	save(){
		let data = {
			itemId: this.props.itemId,
			value: this.state.value.toString('html') == "<p><br></p>" ? null : this.state.value.toString('html'),
			paramName: this.props.lang == 'he' ? this.props.paramName : this.props.paramName + 'Ru'
		}
		this.props.dist ? data.dist = this.props.dist : null;
		this.props.updateItems(data);
	}
	render() {
		return (
			<div className="rich-text-editor">
				{/* dangerouslySetInnerHTML={{__html: this.state.value.toString('html')}} */}
				{this.state.value ?
					<RichTextEditor
						toolbarConfig={!this.props.limited ? toolbarConfigFull : toolbarConfigLimited}
						value={this.state.value}
						onChange={this.handleChange}
						onBlur={this.save}
						placeholder={this.props.placeholder ? this.props.placeholder : this.props.lang == 'he' ? 'הדבק את הטקסט שלך כאן' : 'место для ввода текста'}
					/>
				: null}
			</div>
		);
	}
}
