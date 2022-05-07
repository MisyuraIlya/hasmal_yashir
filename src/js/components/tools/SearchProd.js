import Autosuggest from 'react-autosuggest';
import UserContext from '../../UserContext';
import React, { Component, Fragment, useState, useEffect, useRef, useContext } from 'react';

const getSuggestionValue = suggestion => suggestion.CatalogNumber;
const renderSuggestion = suggestion => (
	<div className="hello"><span>{suggestion.CatalogNumber} | </span><span>{suggestion.Title}</span></div>
);

export default class SearchProd extends Component {
	constructor(props){
		super(props);
		this.state = {
			prodList: [],
			suggestions: [],
			value: '',
      isNoChange: true
		}
		this.getProds = this.getProds.bind(this);
		this.getSuggestions = this.getSuggestions.bind(this);
		this.onSuggestionsFetchRequested = this.onSuggestionsFetchRequested.bind(this);
		this.onSuggestionsClearRequested = this.onSuggestionsClearRequested.bind(this);
		this.onSuggestionSelected = this.onSuggestionSelected.bind(this);
		this.onChange = this.onChange.bind(this);

	}
	componentWillMount(){
		this.getProds();
	}
	componentDidMount(){}
	componentWillUnmount(){}


  getProds = async() => {

    //const app = useContext(UserContext);

    const valAjax = {
      funcName: 'all_prods',
      point: 'new-api/admin-sales',
      token: localStorage.token,
      role: localStorage.role,
    };

    try {
      const data = await this.props.data.props.props.ajax(valAjax);

			let prodList = JSON.parse(data).Productss;
			this.setState({prodList});

    } catch(err) {
      console.log('connection error docs');
      this.setState({preload:false});
    }

	}
	onChange(event, { newValue }) {
		newValue ? this.setState({	value: newValue	}) : null;
    this.setState({isNoChange:false})
	}
	getSuggestions(value) {
		const inputValue = value.trim().toLowerCase();
		const inputLength = inputValue.length;

		let isNumber =  /^\d+$/.test(value);

		if (isNumber) {
			return inputLength === 0 ? [] : this.state.prodList.filter((product) => {

          // console.log('hp: ' + user.Hp + "input" + inputValue);
          // console.log(product.CatalogNumber.toLowerCase().slice(0, inputLength) === inputValue);
          if(product.CatalogNumber && product.CatalogNumber.toLowerCase().slice(0, inputLength) === inputValue){
            return product.CatalogNumber;
          }

      })
		} else {
			return (
				inputLength === 0 ? [] : this.state.prodList.filter(product => {
					if (product.Title.split(' ').length > 1) {
						return product.Title.split(' ')[0].toLowerCase().slice(0, inputLength) === inputValue
						||
						product.Title.split(' ')[1].toLowerCase().slice(0, inputLength) === inputValue
					} else {
						return product.Title.toLowerCase().slice(0, inputLength) === inputValue
					}
				})
			)
		}
	}
	onSuggestionsFetchRequested({ value }) {
    if(this.props.IsSearch == true){
		  this.setState({	suggestions: 	this.getSuggestions(value)});
      //debugger;
    }else{
      //this.props.data.updateInput(value, this.props.Id, this.props.Action );
    }

	}
	onSuggestionsClearRequested() {
		this.setState({	suggestions: [], value: "" });
    this.props.data.closeSearch(this.props.Id,this.props.Action);
	}
	onSuggestionSelected(event, { suggestion, suggestionValue, suggestionIndex, sectionIndex, method }) {
		if (method == "click" || method == "enter") {
      //debugger;
      this.setState({isNoChange: true});
			this.props.data.getProdFromSearch(suggestion.CatalogNumber, suggestion.Title, this.props.Id,this.props.Action );
		}
	}
/*
  onBlur(value){
    //debugger;
    this.props.data.updateInput(value.target.value, this.props.Id, this.props.Action );
  }
*/
	render(){
		const { value, suggestions } = this.state;

		const inputProps = {
			placeholder: this.props.placeholder,
			value: this.state.isNoChange ? this.props.value ? this.props.value : "" : value,
			onChange: this.onChange
		}
		return (
			<div className="searchProd">
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
