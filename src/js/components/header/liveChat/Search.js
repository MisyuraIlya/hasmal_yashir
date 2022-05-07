import React, { Component } from 'react';
import Autosuggest from 'react-autosuggest';

const getSuggestionValue = suggestion => suggestion.name;
const renderSuggestion = suggestion => (
	<div className="hello"><span>{suggestion.Name} | </span><span>{suggestion.Hp}</span></div>
);

export default class Search extends Component {
	constructor(props){
		super(props);
		this.state = {
			userList: [],
			suggestions: [],
			users: [],
			value: ''
		}
		this.getUsers = this.getUsers.bind(this);
		this.getSuggestions = this.getSuggestions.bind(this);
		this.onSuggestionsFetchRequested = this.onSuggestionsFetchRequested.bind(this);
		this.onSuggestionsClearRequested = this.onSuggestionsClearRequested.bind(this);
		this.onSuggestionSelected = this.onSuggestionSelected.bind(this);
		this.onChange = this.onChange.bind(this);
	}
	componentWillMount(){
		this.getUsers();
	}
	componentDidMount(){}
	componentWillUnmount(){}
	getUsers = async() =>{



    const valAjax = {
      funcName: '',
      point: 'users_search_by_user',
      token: localStorage.agent ? localStorage.agentToken : localStorage.token,
			sess_id: localStorage.sessionId
    };

    try {

      const data = await this.props.data.props.props.ajax(valAjax);

      let userList = data.Userss;
      this.setState({userList});

    } catch(err) {
      console.log('connection error order');
    }

	}
	onChange(event, { newValue }) {
		newValue ? this.setState({	value: newValue	}) : null;
	}
	getSuggestions(value) {
		const inputValue = value.trim().toLowerCase();
		const inputLength = inputValue.length;

		let isNumber =  /^\d+$/.test(value);

		if (isNumber) {
			return inputLength === 0 ? [] : this.state.userList.filter((user) => {

          // console.log('hp: ' + user.Hp + "input" + inputValue);
          return(
            // user.Hp ? user.Hp.toLowerCase().slice(0, inputLength) === inputValue : null
            // ||
            user.ExId ? user.ExId.toLowerCase().slice(0, inputLength) === inputValue : null
          )
      })


		} else {
			return (
				inputLength === 0 ? [] : this.state.userList.filter(user => {
					if (user.Name.split(' ').length > 1) {
						return user.Name.split(' ')[0].toLowerCase().slice(0, inputLength) === inputValue
						||
						user.Name.split(' ')[1].toLowerCase().slice(0, inputLength) === inputValue
					} else {
						return user.Name.toLowerCase().slice(0, inputLength) === inputValue
					}
				})
			)
		}
	}
	onSuggestionsFetchRequested({ value }) {
		this.setState({	suggestions: this.getSuggestions(value)	});
	}
	onSuggestionsClearRequested() {
		this.setState({	suggestions: [], value: "" });
	}
	onSuggestionSelected(event, { suggestion, suggestionValue, suggestionIndex, sectionIndex, method }) {
		if (method == "click" || method == "enter") {
			this.props.data.getUserFromSearch(suggestion.Id);
		}
	}
	render(){
		const { value, suggestions } = this.state;
		const inputProps = {
			placeholder: "שם / מס' לקוח",
			value,
			onChange: this.onChange
		}
		return (
			<div className="search">
				<Autosuggest
					suggestions={suggestions}
					onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
					onSuggestionSelected={this.onSuggestionSelected}
					onSuggestionsClearRequested={this.onSuggestionsClearRequested}
					getSuggestionValue={getSuggestionValue}
					renderSuggestion={renderSuggestion}
					inputProps={inputProps}
					highlightFirstSuggestion={true}
				/>
			</div>
		)
	}
}
