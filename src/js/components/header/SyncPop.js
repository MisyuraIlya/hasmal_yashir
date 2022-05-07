 import React, { Component } from 'react';
import SweetAlert from 'sweetalert2';
import moment from 'moment';

export default class SyncPop extends Component {
	constructor(props){
		super(props);
		this.state = {
      action:false
		}
  }
	componentWillMount(){

		$('body').addClass('fix');
		$('main, footer, .fixed-menu, .top, .logo, .navigation-container, .copyright').addClass('blur');
	}
	componentWillUnmount(){
		$('body').removeClass('fix');
		$('main, footer, .fixed-menu, .top, .logo, .navigation-container, .copyright').removeClass('blur');
	}



  updateSystem = async (action) => {
    this.setState({preload: true});
    this.props.close();
    this.props.preload();
    SweetAlert({
      title: 'עדכון המערכת עלול לערוך מספר דקות',
      text: 'אנא היו סבלניים',
      type: 'info',
      timer: 4000,
      showConfirmButton: false,
    }).catch(SweetAlert.noop);

    const val = {
      funcName: '',
      point: 'new-api/sync/global_api',
      action: action
    };

    try {
      const data = await this.props.props.ajax(val);

      if (data.result == "success") {
        SweetAlert({
          title: 'המערכת עודכנה בהצלחה',
          type: 'success',
          timer: 3000,
          showConfirmButton: false,
        }).then(function () {
          location.reload();
        }.bind(this)).catch(SweetAlert.noop);
      } else {
        SweetAlert({
          title: 'שגיאת מערכת',
          text: 'נסה שוב',
          type: 'error',
          timer: 3000,
          showConfirmButton: false,
        }).then(function () {
          location.reload();
        }.bind(this)).catch(SweetAlert.noop);
      }
    } catch(err) {
      //this.props.connectionError('connection error GetSales');
      console.log('connection error global_api');
    }

  };


  updateSystem(action){
		this.setState({preload: true});
    this.props.close();
    this.props.preload();
		SweetAlert({
			title: 'עדכון המערכת עלול לערוך מספר דקות',
			text: 'אנא היו סבלניים',
			type: 'info',
			timer: 4000,
			showConfirmButton: false,
		}).catch(SweetAlert.noop);

    let url = '';
    if(action=="ordApproval"){
      url = 'new-api/sync/approveOrdCron.php';
    }else{
      url = 'new-api/sync/global_api.php';
    }
    let val = {'action': action};
		$.ajax({
			url: globalServer + url,
			type: 'POST',
      data: val
		}).done(function(data) {
      data = JSON.parse(data);

			if (data.result == "success") {
				SweetAlert({
					title: 'המערכת עודכנה בהצלחה',
					type: 'success',
					timer: 3000,
					showConfirmButton: false,
				}).then(function () {
					location.reload();
				}.bind(this)).catch(SweetAlert.noop);
			} else {
				SweetAlert({
					title: 'שגיאת מערכת',
					text: 'נסה שוב',
					type: 'error',
					timer: 3000,
					showConfirmButton: false,
				}).then(function () {
					location.reload();
				}.bind(this)).catch(SweetAlert.noop);
			}
    });
	}

	render(){
		return (
			<div className="popup" id="userEntry">
				<div className="popup-wrapper">
					<div className="wrapp">
						<div onClick={() => this.props.close()} className="close-popup">
							<img src={globalFileServer + 'icons/cross-black.svg'} alt="" />
						</div>
						<div className="user-entry-wrapper">
              <div className="action-to-perform SyncPop">
                <h3>עדכון מערכת</h3>
  							<ul>
  								<li onClick={()=> this.updateSystem("Items")}><div>מוצרים</div></li>
                  <li onClick={()=> this.updateSystem("Users")}><div>לקוחות</div></li>
                  <li onClick={()=> this.updateSystem("LastPrice")}><div>מוצרים קבועים</div></li>
  								<li onClick={()=> this.updateSystem("AllPriceLists")}><div>מחירונים</div></li>
                  <li onClick={()=> this.updateSystem("SpecialSales")}><div>מבצעים</div></li>

              	</ul>
              </div>
					</div>
					</div>
				</div>
			</div>
		)
	}
}
