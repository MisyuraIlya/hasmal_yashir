import ReactDOM from "react-dom";
import React, { Component, Fragment } from 'react';
import { NavLink } from "react-router-dom";
import SweetAlert from 'sweetalert2';
import { adminReasons } from '../../globals.js';

export default class CollectorStepFour extends Component {
	constructor(props){
		super(props);
		this.state = {
			date: localStorage.date ? new Date(localStorage.date) : new Date(),
			order: false,
			products: [],
			preload: false,
			media: [],
			save: false,

		}
		this.getOrders = this.getOrders.bind(this);
		this.setPreload = this.setPreload.bind(this);
		this.updateProduct = this.updateProduct.bind(this);
		this.changeQuantity = this.changeQuantity.bind(this);
    this.ordActiveFunc = this.ordActiveFunc.bind(this);


	}
	componentDidMount(){
    this.setState({preload: true});
		setTimeout(() => {window.scrollTo(0, 0)}, 200);
		let date = this.state.date.toLocaleDateString('he-IL').split('.').join('/');
		this.getOrders(date);
		localStorage.setItem('scrollTo', this.props.match.params.order);
	}


	saveItem = async(action, itemKey) => {
		this.setPreload();
    let user = false;
		localStorage.user ? user = JSON.parse(localStorage.user) : user = false;

		let val = {
			'products': JSON.stringify(this.state.products),
			'id': this.state.order.ID,
      'userName': user ? user.Name : false

		};

    const valAjax = {
      funcName: 'saveProducts',
      point: 'orders',
      val: val
    };

    try {
      const data = await this.props.ajax(valAjax);

        let products = this.state.products;
        products = products.filter((item) => {return item.ItemKey != itemKey})

        this.setState({products});
        this.unsetPreload();

/*
        if(action=="done"){
           this.props.history.push('/collector-step-three');
        }
*/
    } catch(err) {
      this.unsetPreload();
      console.log('connection error saveItem');
    }

	}

	setPreload(){
		this.setState({preload: true});
	}
	unsetPreload = () =>{
		this.setState({preload: false});
	}

	getOrders = async(date)=>{


    this.setState({preload: true});


    var cur_date = date.split("/");
    date = (("0"+ (cur_date[0])).slice(-2))  + "/" + (("0"+ (cur_date[1])).slice(-2))  + "/" + cur_date[2].slice(2,4);


    const valAjax = {
      funcName: 'getProductsPerOrderAndDateAndDepartmentAndDistributionLine',
      point: 'orders',
      orderId: this.props.match.params.order,
      deptId: this.props.match.params.dept
    };
    try {
      const data = await this.props.ajax(valAjax);

      let products = JSON.parse(data.products);
      //  debugger;

      products.map((item) => {
        for (let element of this.props.state.products) {
          if(item.ItemKey == element.CatalogNumber){
          //  debugger;
            if(parseInt(item.BaseQuantity)==0){
              if(parseInt(item.ReadyQuantity)==0 || !item.ReadyQuantity){
                item.BaseQuantity = item.Quantity;
              }else{
                item.BaseQuantity = item.ReadyQuantity;
              }
              //debugger;

            }else{
              //item.BaseQuantity = parseInt(item.BaseQuantity) / parseInt(element.PackQuan);
              item.BaseQuantity = parseInt(item.BaseQuantity);

            //  debugger;

            }
          //  debugger;

            break;
          }
        }
        item.isChanged = null;
      })
      this.setState({
        order: JSON.parse(data.order)[0],
        products: products,
        preload: false
      });

    } catch(err) {
      console.log('connection error addItem');
      this.setState({preload: false})

    }

	}
	updateProduct(id, paramName, val) {
    if(this.state.order.ordActive){
  		let products = this.state.products;
  		products.find(x => x.ItemKey == id)[paramName] = val;
      products.find(x => x.ItemKey == id).isChanged = 1;
  		this.setState({products});
  		if (!this.state.save) this.setState({save: true});
    }
    //this.ordActiveFunc();
  }

	changeQuantity(id, quantity){

    if(this.state.order.ordActive && !this.state.order.ordLikutDone){
      let products = this.state.products;
      products.find(x => x.ItemKey == id).ReadyQuantity = quantity;
      products.find(x => x.ItemKey == id).isChanged = 1;


      this.setState({products});
      if (!this.state.save) this.setState({save: true});
    }

    //this.ordActiveFunc();
	}

  ordActiveFunc = async() =>{
    let user;
    localStorage.user ? user = JSON.parse(localStorage.user): null;

    if(!this.state.order.ordActive){
      let val = {
        'id': this.state.order.ID,
        'melaketName': user ? user.Name : null
      };

      const valAjax = {
        funcName: 'setOrdActive',
        point: 'orders',
        val:val

      };

      try {
        const data = await this.props.ajax(valAjax);

        let order = this.state.order;
        order.ordActive = '1';
        this.setState({order});

      } catch(err) {
        console.log('connection error addItem');
      }
    }
  }

  selectInput(id){
    $("#input_"+id).focus();
    $("#input_"+id).select();
  }
	render(){
		let ready = this.state.products.filter(item => item.ReadyQuantity);

		return (
			<div className="step-four">

				{this.state.preload ?
					<div className="spinner-wrapper">
						<div className="spinner">
							<div className="bounce1"></div>
							<div className="bounce2"></div>
							<div className="bounce3"></div>
						</div>
					</div>
				: null}
        <div className="title-cont">
          {/*{this.state.order.DocNumber && this.state.order.DocNumber != "0" ? "# " + this.state.order.DocNumber : "# " + this.state.order.ID}*/}
          <div onClick={()=> this.getOrders(this.state.date.toLocaleDateString('he-IL').split('.').join('/'))} className="refresh-btn">
            <img src={globalFileServer + 'icons/menu/sync.svg'} />
          </div>
          {this.state.order.AccountName ?
            <h1 className="emp-app-title">{this.state.order.AccountName}</h1>
          :null}
          {this.state.save ?
  					<Fragment>
  {/*
  						<div onClick={this.saveItem("done")} className="save-item done-btn">
  							<img src={globalFileServer + 'icons/done.svg'} />
  						</div>

              <div onClick={this.saveItem.bind(this,"save")} className="save-item save-btn">
  							<img src={globalFileServer + 'icons/save.svg'} />
  						</div>
*/}
  					</Fragment>
  				: null}
          <div className="glb-counter">
            <p>{ready.length + ' / ' + this.state.products.length}</p>
          </div>
        </div>
        <div className="status-cont">
          {this.state.order.ordActive && this.state.order.Status != '1' && this.state.order.ordLikutDone == '1' ?
            <p className="status-cont-active">{"לוקט"}</p>
          :null}
          {this.state.order.ordActive && this.state.order.Status == '1' ?
            <p className="status-cont-active">{"הופק"}</p>
          :null}
          {!this.state.order.ordActive && !this.state.order.Status != '1' ?
            <p onClick = {this.ordActiveFunc.bind(this)} className="status-cont-btn">{"החל בליקוט"}</p>
          :null}
        </div>

				<div className="container">
					<div className="items">
						{this.state.products.length > 0 ? this.state.products.map((element, index) => {
							let readyQuantity = element.ReadyQuantity ? element.ReadyQuantity : 0;
							let perc = 0;
							let limit = (parseFloat(element.BaseQuantity) * perc) / 100;
							let success = parseFloat(readyQuantity) >= (parseFloat(element.BaseQuantity) - limit) && parseFloat(readyQuantity) <= (parseFloat(element.BaseQuantity) + limit);
              if(!element.MelaketUpdatedQuan){
                return(
  								<div key={index} className="item">
  									<div className="title">
  										<p>
  											<span className="title">מספר קטלוגי:</span>
  											<span className="catalog">{element.ItemKey}</span>
  										</p>
  										<h2>{element.ItemName}</h2>
  									</div>
  									<div className="flex-container row-flex-cont">
                    {/*
                      <div className="col-lg-4">
                        <div className="img-load">
                          <img
                            className="main-img"
                            src={globalFileServer + 'products/jpg.' + element.ItemKey + '.jpg'}
                            onError={(e) => e.target.src = globalFileServer + 'placeholder.jpg'}

                          />
                        </div>
                      </div>
                      */}
  										<div className="col-lg-4">
  											<div className="quantity">
  												<h3
  													data-class={readyQuantity ? 'enable' : 'disable'}
  													className={success ? 'success' : 'error'}
  												>{readyQuantity  + ' / ' + parseInt(element.BaseQuantity)}</h3>
                          {this.state.order.Status!='1' && this.state.order.CommentCollector!='1' ?
    												<div className="action flex-container">
    													<div className="col-lg-4">
    														<div className="wrapp" onClick={ () => this.changeQuantity(element.ItemKey, parseFloat(readyQuantity) + 1 ) }>
    															<img src={globalFileServer + 'icons/plus.svg'} />
    														</div>
    													</div>
    													<div className="col-lg-4">
    														<div className="input">
    															<input
    																type="number"
    																value={	element.ReadyQuantity ? element.ReadyQuantity : "" }
    																onChange={ (e) => this.updateProduct(element.ItemKey, 'ReadyQuantity', e.target.value) }
                                    onClick={this.selectInput.bind(this, element.ItemKey)}
    															/>
    														</div>
    													</div>
    													<div className="col-lg-4">
    														{readyQuantity ?
    															<div className="wrapp" onClick={ () => this.changeQuantity(element.ItemKey, parseFloat(readyQuantity) - 1 ) }>
    																<img src={globalFileServer + 'icons/minus.svg'} />
    															</div>
    														:
    														<div className="wrapp">
    															<img src={globalFileServer + 'icons/minus.svg'} />
    														</div>
    														}
    													</div>
    												</div>
                          :null}

  											</div>
  										</div>
                      {this.state.order.Status!='1' && this.state.order.CommentCollector!='1' ?
                        <div className="col-lg-4 fullQuan-btn">
                          <div onClick={() => this.changeQuantity(element.ItemKey, parseFloat(element.BaseQuantity) )} className="img">
                            <img src={globalFileServer + 'icons/thumb-up.svg'} alt=""/>
                          </div>
                        </div>
                      :null}
                      {element.ReadyQuantity ?
                        <div className="col-lg-4 save-btn-cont">
                          <p onClick={()=> this.saveItem("save", element.ItemKey)}>שמור</p>
                        </div>
                      :null}


  									</div>
  								</div>
  							);
              }
						}):null}
					</div>
				</div>
			</div>
		)
	}
}
