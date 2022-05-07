import React, { Component, Fragment } from 'react';
import { NavLink } from "react-router-dom";
import SweetAlert from 'sweetalert2';

export default class Employee extends Component {
	constructor(props){
		super(props);
		this.state = {
			items: [],
			preload: false,
			search: false
		}
	}
	componentDidMount(){
		this.getItems();
		setTimeout(() => {window.scrollTo(0, 0)}, 200);
	}
	sortItems = (e) => {
		let val = e.target.value.toLowerCase();
		this.setState({search: val});
		let items = this.props.state.employee.filter(item => item.Name.toLowerCase().includes(val));
		this.setState({items});
	}
	getItems = async() => {


    const valAjax = {
      funcName: 'getEmployee',
      point: 'users',
      token: localStorage.token,
      role: localStorage.role
    };

    try {
      const data = await this.props.ajax(valAjax);

      this.props.setEmployee(data.Userss);
      this.setState({items: data.Userss});

    } catch(err) {
      console.log('connection error addItem');
    }


	}
	addItem = async() => {
		this.setState({preload: true});
		let date = new Date();
		let recovery = date.getSeconds() + "" + date.getMilliseconds() + "" + date.getDay();

    const valAjax = {
      funcName: 'addEmployee',
      point: 'users',
      token: localStorage.token,
      role: localStorage.role,
      recovery: recovery.substring(0, 4)
    };

    try {
      const data = await this.props.ajax(valAjax);
      if (data.result == "success") {
				let newItem = JSON.parse(data.items);

				let items = this.props.state.employee;
				items.push(newItem);
				items.sort((a, b) => b.Id - a.Id);
				this.props.setEmployee(items);
				this.setState({preload: false, items});
				this.props.history.push('/employe/' + data.itemId);
			} else {
				this.props.showError();
			}

    } catch(err) {
      console.log('connection error addItem');
    }

	}
	deleteItem = (id) => {
		SweetAlert({
			title: 'האם אתה בטוח?',
			text: 'האם ברצונך למחוק פריט זה? לא תוכל לשחזר זאת!',
			type: 'warning',
			showCancelButton: true,
			confirmButtonColor: '#22b09a',
			cancelButtonColor: '#d80028',
			confirmButtonText: 'מחק',
			cancelButtonText: 'בטל'
		}).then(function(id, res) {
			if (res.value) {
				let items = this.props.state.employee.filter(item => item.Id != id);
				this.props.setEmployee(items);
				this.setState({items});

        const valAjax = {
          funcName: 'deleteEmployee',
          point: 'users',
          token: localStorage.token,
          role: localStorage.role,
          id:id
        };

        this.deleteItemFunc(valAjax);
				$.ajax({
					url: globalServer + 'users.php',
					type: 'POST',
					data: val,
				}).done(function(data) {}.bind(this)).fail(function() {	this.props.showError() }.bind(this));
			}
		}.bind(this, id)).catch(SweetAlert.noop);
	}

  deleteItemFunc = async(valAjax)=>{
    try {
      const data = await this.props.ajax(valAjax);

    } catch(err) {
      console.log('connection error deleteItemFunc');
    }
  }

	render(){
		return (
			<div className="employee">
				{this.state.preload ?
					<div className="spinner-wrapper">
						<div className="spinner">
							<div className="bounce1"></div>
							<div className="bounce2"></div>
							<div className="bounce3"></div>
						</div>
					</div>
				: null}
				<h1 className="app-title">רשימת עובדים</h1>
				<div onClick={this.addItem} className="add-item">
					<img src={globalFileServer + 'icons/plus-white.svg'} />
				</div>
				<div className="container">
					<div className="search">
						<input
							type="text"
							placeholder="חפש עובדים"
							value={this.state.search ? this.state.search : ''}
							onChange={()=> this.sortItems}
						/>
						{!this.state.search ?
							<img src={globalFileServer + 'icons/search-gray.svg'} alt=""/>
						:
						<img onClick={() => this.setState({search: false, items: this.props.state.employee})} src={globalFileServer + 'icons/close.svg'} alt=""/>
						}
					</div>
					<h2>כל העובדים</h2>
					<div className="items">
						{this.state.items.map((element, index) => {
							return(
								<div key={index} className="item">
									<NavLink to={"/employe/" + element.Id} className="flex-container">
										<div className="col-lg-2">
											<div className="img">
												<img src={globalFileServer + 'icons/profil/' + element.Img + '.svg'} alt=""/>
											</div>
										</div>
										<div className="col-lg-10">
											<div className="wrapper">
												<h3>{element.Name ? element.Name : 'עובד חדש'}</h3>
                        {element.Type == 2 ?
                          <h4>מלקט</h4>
                        :null}
                        {element.Type == 3 ?
                          <h4>נהג</h4>
                        :null}
											</div>
										</div>
									</NavLink>
									<div onClick={()=> this.deleteItem( element.Id)} className="delete">
										<img src={globalFileServer + 'icons/trash.svg'} alt=""/>
									</div>
								</div>
							);
						})}
					</div>
				</div>
			</div>
		)
	}
}
