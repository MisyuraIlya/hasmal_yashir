import React, {Component} from 'react';
import SweetAlert from 'sweetalert2';

let start = false;

export default class PayPopup extends Component {
	constructor(props){
		super(props);
		this.state = {
			date: false,
			time: false,
			error: false
		}
		//this.getTime = this.getTime.bind(this);
		this.recievingMessages = this.recievingMessages.bind(this);
	}
	componentDidMount(){
		$('body').addClass('fix');
		$('#root').addClass('blur');
		//this.getTime();
		window.addEventListener('message', this.recievingMessages, true);
    //this.getItems();

	}
	componentWillUnmount(){
		$('body').removeClass('fix');
		$('#root').removeClass('blur');
		window.removeEventListener('message', this.recievingMessages, true);
	}
	recievingMessages(e){
// debugger;
		if (e.data && e.data.res === 'SuccessVerifon' ) {
			//this.props.splitPaymentsPay(e.data.data, false);
			this.props.closePayPopup();
     	this.props.OrderSuccess();
      //e.data.id
			//this.props.reSign();
		}

		if (e.data && e.data.res == 'ErrorVerifon' ) {
    //  this.props.closePayPopup();
			SweetAlert({
				title: 'העסקה נכשלה',
				text: 'אנא בדקו את פרטי הכרטיס או נסו כרטיס אחר',
				type: 'error',
			}).then(function () {

			}.bind(this)).catch(SweetAlert.noop);
		}
		if (e.data === 'CancelVerifon' ) {
			this.props.closePayPopup();
		}
	}

  getItems = async() => {
		let orderVal = this.props.state.orderVal;
		let val = {
			Amount: parseFloat(orderVal.finalTotal).toFixed(2),
			OrdId: orderVal.ordId,
      UserName: orderVal.userName
		};

    const valAjax = {
      funcName: 'generateUrl',
      point: 'max',
      val: val
    };
    debugger;
    try {
      let data = await this.props.props.ajax(valAjax);
      debugger;

      if(data.updatedCart){
        SweetAlert({
          title: 'שים לב, סל הקניות שלך עודכן',
          text: 'אנא בדוק את השינויים שבוצעו',
          type: 'info',
        }).then(function () {
          location.reload();
        }.bind(this)).catch(SweetAlert.noop);
      }else{
        this.setState({url: data.url});
      }
    } catch(err) {
      console.log('connection error getItems');
    }

	}

	getOrderVal = () => {
		let orderVal = this.props.state.orderVal;
		let val = {
			Amount: parseFloat(orderVal.finalTotal).toFixed(2),
      //Amount: 1,
			OrdId: orderVal.ordId,
      UserName: orderVal.userName
		};
		return JSON.stringify(val);
	}

	render() {
    let total;

    total = Math.abs(this.props.state.finalTotal);
    //total = 6;
		return (
			<div className="pay-popup">
				<div className="popup" id="payPopup">
					<div className="popup-wrapper">
						<div className="wrapp">
							<div onClick={this.props.closePayPopup} className="close-popup">
								<img src={globalFileServer + 'icons/close.svg'} alt="" />
							</div>
              <div className="wrapper">
								<iframe src={'https://churishop.co.il/iframe?val=' + this.getOrderVal()} framborder="0"></iframe>
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
