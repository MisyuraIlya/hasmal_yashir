import React, { Component, Fragment } from 'react';
import { NavLink } from "react-router-dom";
import SweetAlert from 'sweetalert2';

const img = [1,2,3,4,5,6,7];

export default class EmployeePage extends Component {
	constructor(props){
		super(props);
		this.state = {
			save: false,
      mailChanged:false,
      deptsMain:[]
		}

		this.generatePassword = this.generatePassword.bind(this);
		this.setNewPassword = this.setNewPassword.bind(this);
	}
	componentDidMount(){
		!this.props.state.employee.length ? this.props.history.push('/employee') : null;
		setTimeout(() => {window.scrollTo(0, 0)}, 200);

    this.getDepts();
	}

  getDepts = async () => {
    const valAjax = {
      funcName: 'getDeptsMain',
      point: 'users',
      token: localStorage.token,
      role: localStorage.role
    };

    try {
      const data = await this.props.ajax(valAjax);

      if(data.result=="success"){
        let deptsMain = data.deptsMain;
        this.setState({ deptsMain});

      }


      this.setState({preload:false});
    } catch(err) {
      //this.props.connectionError('connection error GetSales');
      console.log('connection error GetSales');
      this.setState({preload:false});
    }
  }
	generatePassword() {
		let length = 5,
		charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789",
		retVal = "";
		for (var i = 0, n = charset.length; i < length; ++i) {
			retVal += charset.charAt(Math.floor(Math.random() * n));
		}
		return retVal;
	}
	setNewPassword(){
		let newPassword = this.generatePassword();
		let items = this.props.state.employee;
		items.find(x => x.Id == this.props.match.params.id).Password = newPassword;
		this.props.setEmployee(items);
		!this.state.save ? this.setState({save: true}) : null;
	}
	editItem = (paramName, val, id) => {
		let items = this.props.state.employee;

    let findEmp = items.filter(x => x.Id == this.props.match.params.id)[0];

    let userDeptsMain = [];

    if(paramName=="Department"){
      if(findEmp.Department && findEmp.Department!=""){
        if(findEmp.Department.includes(",")){
          userDeptsMain = findEmp.Department.split(",");
        }else{
          userDeptsMain.push(findEmp.Department);
        }
      }
      if(val==1){
        userDeptsMain.push(id)
      }else{
        userDeptsMain = userDeptsMain.filter((item) => {return item != id});
      }
      val = userDeptsMain.join();
    }


		items.find(x => x.Id == this.props.match.params.id)[paramName] = val;


		this.props.setEmployee(items);
		!this.state.save ? this.setState({save: true}) : null;
    if(paramName=="Mail"){
      this.setState({mailChanged:true});
    }
	}

	saveItem = async(employee)=> {
		let val = {
			'employee': employee
		};

    const valAjax = {
      funcName: 'saveEmployee',
      point: 'users',
      token: localStorage.token,
      role: localStorage.role,
      val: val
    };

    try {
      const data = await this.props.ajax(valAjax);

      if(data.exist=="already_exists" && this.state.mailChanged){
        SweetAlert({
          title: 'כתובת מייל קיימת ולא נשמרה במערכת',
          type: 'info',
          showConfirmButton: false,
          timer: 4000
        }).catch(SweetAlert.noop);
        this.props.history.push('/employee');
      }else if(data.result=="success"){
        this.props.history.push('/employee');
      }

    } catch(err) {
      console.log('connection error addItem');
    }


	}

	render(){
		if (this.props.state.employee.length) {
		let employee = this.props.state.employee.filter(item => item.Id == this.props.match.params.id)[0];

    let userDeptsMain = [];
    if(employee.Department && employee.Department!=""){
      if(employee.Department.includes(",")){
        userDeptsMain = employee.Department.split(",");
      }else{
        userDeptsMain.push(employee.Department);
      }
    }


		return (
			<div className="employee-page">
				{this.state.save && window.innerWidth < 1000 ?
					<div onClick={()=> this.saveItem( employee)} className="save-item">
						<img src={globalFileServer + 'icons/done.svg'} />
					</div>
				: null}
				<h1 className="app-title">{employee.Name ? employee.Name : "כרטיס עובד"}</h1>
				<div className="container">
					<div className="item">
						<h2>כללי</h2>
						<div className="input">
							<input
								type="text"
								placeholder="שם העובד"
								onChange={(e) => this.editItem('Name', e.target.value)}
								value={employee.Name ? employee.Name : ''}
							/>
							<input
								type="email"
								placeholder="מייל - ישמש כשם משתמש בכניסה"
								onChange={(e) => this.editItem('Mail', e.target.value)}
								value={employee.Mail ? employee.Mail : ''}
							/>
							<input
								type="number"
								placeholder="נייד"
								onChange={(e) => this.editItem('Tel', e.target.value)}
								value={employee.Tel ? employee.Tel : ''}
							/>
							<div className="flex-container">
								<div className="col-lg-6">
									<input
										type="text"
										placeholder="סיסמה"
										onChange={(e) => this.editItem('Password', e.target.value)}
										value={employee.Password}
									/>
								</div>
								<div className="col-lg-6 for-button">
									<button onClick={this.setNewPassword}>
										<img src={globalFileServer + 'icons/security.svg'} />
										<span>יצירת סיסמה</span>
									</button>
								</div>
							</div>
						</div>
					</div>

					{/*<div className="item">
						<ul className="select-img">
							{img.map((element, index) => {
								return (
									<li key={index} onClick={this.editItem.bind(this, 'Img', element)} className={element == employee.Img ? 'active' : null}>
										<img src={globalFileServer + 'icons/profil/' + element + '.svg'} />
										{element == employee.Img ? <img className="selected" src={globalFileServer + 'icons/done.svg'} /> : null}
									</li>
								);
							})}
						</ul>
					</div>*/}
          <div className="item">
							{this.state.deptsMain.length ? this.state.deptsMain.map((element, index) => {
                let isDeptActive = userDeptsMain.filter((item) => {return parseInt(item) == element.Id});
								return (
                  <ul  key={index} className="select-department flex-container">
                    <li className="status col-lg-2">
                      <div>
                        {isDeptActive && isDeptActive.length ?
                          <div onClick={(e) => this.editItem('Department', null, element.Id)} className="input active">
                            <img src={globalFileServer + "icons/done.svg"} alt=""/>
                          </div>
                        :
                        <div onClick={(e) => this.editItem('Department', 1, element.Id)} className="input">
                          <img src={globalFileServer + "icons/cross-bold.svg"} alt=""/>
                        </div>
                        }
                      </div>
                    </li>
                    <li className="title  col-lg-7" className={element == employee.Img ? 'active' : null}>
                      {element.Title}
  									</li>
                  </ul>

								);
							}):null}
					</div>
					{this.state.save && window.innerWidth > 1000 ?
						<div className="item">
							<div className="save-item">
								<button onClick={()=> this.saveItem(employee)}>
									<img src={globalFileServer + 'icons/done.svg'} />
									<span>שמור</span>
								</button>
							</div>
						</div>
					: null}
				</div>
			</div>
		)
	} else {
		return(null);
	}
	}
}
