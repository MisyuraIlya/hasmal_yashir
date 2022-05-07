import React, { Component } from 'react';
import { Link } from 'react-router';
import SweetAlert from 'sweetalert2';

export default class ManagerEntry extends Component {
	constructor(props){
		super(props);
		this.state = {
			login: true,
			userName: false,
			loginPassword: false,
			rememberMe: false,
      adminModal: false,
      agentModal: false,
		}
		this.signIn = this.signIn.bind(this);
	}
	componentDidMount(){
		$('body').addClass('fix');
		$('main, header, .copyright').addClass('blur');
	}
	componentWillUnmount(){
		$('body').removeClass('fix');
		$('main, header, .copyright').removeClass('blur');
	}
	signIn(){
		let val;

    let fileName = "";
    if(this.state.agentModal){
      fileName = "new-api/agent_login_in.php";
    }else if(this.state.adminModal){
      fileName = "new-api/admin_login_in.php";
    }
    val = {
      'UserName': this.state.userName,
      'Pass': this.state.loginPassword
    };

		$.ajax({
			url: globalServer + fileName,
			type: 'POST',
			data: val,
		}).done(function(data) {
			if (data.result == "success") {
        if(this.state.agentModal){
  				localStorage.clear();
  				localStorage.setItem('agent', data.agent);
  				localStorage.setItem('agentExId', data.agentExId);
  				localStorage.setItem('agentName', data.agentName);
  				localStorage.setItem('agentToken', data.agentToken);
  				SweetAlert({
  					title: 'כניסה לסוכן בוצעה בהצלחה',
  					type: 'success',
  					timer: 3000,
  					showConfirmButton: false,
  				}).then(function() {
  					location.reload();
  				}.bind(this)).catch(SweetAlert.noop);
        }else if(this.state.adminModal){
          // debugger;
          localStorage.clear();
          localStorage.setItem('adminId', data.adminId);
          localStorage.setItem('name', data.name);
          localStorage.setItem('role', data.role);
          localStorage.setItem('sessionId', data.session_id);
          localStorage.setItem('token', data.token);
          SweetAlert({
            title: 'ברוכים הבאים',
            text: 'כניסה לאדמין בוצעה בהצלחה',
            type: 'success',
            timer: 3000,
            showConfirmButton: false,
          }).then(function() {
            location.reload();
          }.bind(this)).catch(SweetAlert.noop);
        }

			}
			if (data.result == "not-found") {
				SweetAlert({
					title: 'שם משתמש או סיסמה אינם נכונים',
					text: 'אנא נסה שנית',
					type: 'error',
					timer: 3000,
					showConfirmButton: false,
				}).then(function() {}.bind(this)).catch(SweetAlert.noop);
			}
		}.bind(this)).fail(function() {	console.log("error"); });
	}
	render(){
		return (
			<div className="popup" id="managerEntry">
				<div className="popup-wrapper">
          <div onClick={this.props.closeEntryModal.bind(this)} className="close-popup">
            <img src={globalFileServer + 'icons/cross-white.svg'} alt="" />
          </div>
          <div className="admin-icon">
            <img src={globalFileServer + 'icons/admin.svg'} />
          </div>
          {this.state.adminModal || this.state.agentModal ?
            <div className="wrapp">

  						<div className="user-entry-wrapper">
  							<div className="user-entry">
  								<form autoComplete="off" className="login">
  									<input
  										type="text"
  										onChange={(e) => this.setState({userName: e.target.value})}
  										placeholder="שם משתמש"
  										value={this.state.userName ? this.state.userName : ''}
  									/>
  									<input
  										onKeyPress={(e) => e.charCode == 13 ? this.signIn() : null}
  										type="password"
  										onChange={(e) => this.setState({loginPassword: e.target.value})}
  										placeholder="סיסמה"
  										value={this.state.loginPassword ? this.state.loginPassword : ''}
  										autoComplete="new-password"
  									/>
  								</form>
  								<div className="login">
  									<div className="terms-and-conditions">
  										<div className="checkboxes-and-radios">
  											<input type="checkbox"
  												onChange={(e) => this.setState({rememberMe: e.target.checked})}
  												name="checkbox-cats" checked={this.state.rememberMe}
  											id="checkbox-2" value="2" />
  											<label htmlFor="checkbox-2"></label>
  										</div>
  										<span>זכור את הסיסמה במכשיר זה</span>
  									</div>
  									<div className="actions">
  										{this.state.loginPassword && this.state.loginPassword ?
  											<div className="send">
  												<button onClick={this.signIn}>כניסה</button>
  											</div>
  										:
  										<div className="accept">
  											<button>כניסה</button>
  										</div>
  										}
  										<div className="cancel">
  											<button onClick={this.props.closeEntryModal.bind(this)}>ביטול</button>
  										</div>
  									</div>
  								</div>
  							</div>
  						</div>
  					</div>
            :
            <div className="wrapp">
              <div className="action-to-perform">
                <h3>בחר סוג משתמש</h3>
                <ul>
                  <li onClick={() => this.setState({agentModal: true})} className={this.state.agentModal ? 'active' : null}><div>סוכן</div></li>
                  <li onClick={() => this.setState({adminModal: true})} className={!this.state.adminModal ? 'active' : null}><div>אדמין</div></li>
                </ul>
              </div>
            </div>
          }


				</div>
			</div>
		)
	}
}
