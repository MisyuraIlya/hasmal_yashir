import React, {Component} from 'react';
import ReactQuill from 'react-quill';

const modules = {
	toolbar: [
		[{ 'header': [1, 2, 3, false] }],
		['bold', 'italic', 'underline'], // 'underline','strike', 'blockquote'
		[{'list': 'ordered'}, {'list': 'bullet'}],
		['link'],
		[{ 'color': ['#808080', '#000', '#b370b2', '#709eb3', '#ccc07f'] }],
		[{ align: '' }, { align: 'center' }, { align: 'right' }], //{ 'align': [] }
		['clean']
	]
}
const modulesLimited = {
	toolbar: [
		['bold', 'italic', 'underline'],
		[{ align: '' }, { align: 'center' }, { align: 'right' }],
		['clean']
	]
}

export default class MyEditor extends Component {
	constructor(props) {
		super(props);
		this.state = {
			value: ''
		};
		this.handleChange = this.handleChange.bind(this);
		this.save = this.save.bind(this);
		this.quillRef = null;
		this.reactQuillRef = null;
	}
	componentDidMount(){
		if (this.props.lang == 'he') {
			this.setState({	value: this.props.text[this.props.paramName] ? this.props.text[this.props.paramName] : ''});
		}
		if (this.props.lang == 'ru') {
			this.setState({	value: this.props.text[this.props.paramName + 'Ru'] ? this.props.text[this.props.paramName + 'Ru'] : ''});
		}
		this.attachQuillRefs();
	}
	componentWillReceiveProps(nextProps){
		if (this.props.lang != nextProps.lang) {
			if (nextProps.lang == 'he') {
				this.setState({	value: this.props.text[this.props.paramName] ? this.props.text[this.props.paramName] : ''});
				this.quillRef.root.dataset.placeholder = this.props.placeholder ? this.props.placeholder : 'הדבק את הטקסט שלך כאן';
			}
			if (nextProps.lang == 'ru') {
				this.setState({	value: this.props.text[this.props.paramName + 'Ru'] ? this.props.text[this.props.paramName + 'Ru'] : ''});
				this.quillRef.root.dataset.placeholder = this.props.placeholder ? this.props.placeholder : 'место для ввода текста';
			}
		}
		this.attachQuillRefs();
	}
	attachQuillRefs(){
		if (typeof this.reactQuillRef.getEditor !== 'function') return;
		this.quillRef = this.reactQuillRef.getEditor();
	}
	save(a, b, c){
		let data = {
			itemId: this.props.itemId,
			value: this.state.value.toString('html') == "<p><br></p>" ? null : this.state.value.toString('html'),
			paramName: this.props.lang == 'he' ? this.props.paramName : this.props.paramName + 'Ru'
		}
		this.props.dist ? data.dist = this.props.dist : null;
		this.props.updateItems(data);
	}
	handleChange(value){
		this.setState({ value: value })
	}
	render() {
		return (
			<div className={this.props.lang == 'he' ? "my-editor he" : "my-editor ru"}>
				<ReactQuill
					ref={(el) => { this.reactQuillRef = el }}
					value={this.state.value}
					onChange={this.handleChange}
					onBlur={this.save}
					theme="snow"
					modules={!this.props.limited ? modules : modulesLimited}
					placeholder={this.props.placeholder ? this.props.placeholder : this.props.lang == 'he' ? 'הדבק את הטקסט שלך כאן' : 'место для ввода текста'}
				/>
			</div>
		);
	}
}
