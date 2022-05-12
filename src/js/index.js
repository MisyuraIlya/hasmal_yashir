import React, { Component, Fragment } from "react";
import ReactDOM from "react-dom";
import { Switch, HashRouter as Router, Route } from "react-router-dom";
import SweetAlert from 'sweetalert2';
import UserContext from './UserContext';

import Home from './components/routs/Home';
import CategoryPage from './components/routs/CategoryPage';
import CategoryView from './components/routs/CategoryView';



import ShopCart from './components/routs/ShopCart';
import WishList from './components/routs/WishList';
import ForSale from './components/routs/ForSale';
import Profil from './components/routs/Profil';
import AdminProfil from './components/routs/AdminProfil';
import Notification from './components/routs/Notification';
import History from './components/routs/History';
import AdminHistory from './components/routs/AdminHistory';
import AdminSales from './components/routs/AdminSales';
import AdminInfo from './components/routs/AdminInfo';


import Contact from './components/routs/Contacts';
import NotFound from './components/routs/NotFound';
import Filters from './components/routs/Filters';
import Gis from './components/routs/Gis';
import AdminAgent from './components/routs/AdminAgent';

import Header from './components/Header';
import Footer from './components/Footer';
// import MiniCart from './components/MiniCart';
import Nav from './components/Nav';
import NotificationView from './components/NotificationView';
import Chat from './components/header/LiveChat';
import Clients from './components/routs/Clients';
import Docs from './components/routs/Docs';
import Returns from './components/routs/Returns';


import CategoryEdit from './components/routs/CategoryEdit';
import ProductsEdit from './components/routs/ProductsEdit';
import ProductEdit from './components/routs/ProductEdit';
import ProductParent from './components/routs/ProductParent';

import About from './components/routs/About';
import Departments from './components/routs/Department';
import CategoryBuild from './components/routs/CategoryBuild';
import DeptEdit from './components/routs/DeptEdit';



import Employee from './components/routs/Employee';
import EmployeePage from './components/routs/EmployeePage';
import CollectorStepThree from './components/routs/CollectorStepThree';
import CollectorStepFour from './components/routs/CollectorStepFour';
import AdminCollectorStepFour from './components/routs/AdminCollectorStepFour';

//pages 
import MyCategoryPage from "./pages/MyCategoryPage";
import MyZonePage from "./pages/MyZonePage";
import HasmalCategoryPage from "./pages/HasmalCategoryPage";


import './App.scss';
import RightSideBar from "./components/sidebar/RightSideBar";
import DesktopRightSideBar from "./components/sidebar/DesktopRightSideBar";
require('./globals.js');

if (module.hot) {
	module.hot.accept();
}


const BasicRouter = (prop) => (
	<Router>
    {/* {console.log(prop.toggleRightSideBar)} */}
		<Fragment>
      <header id="header">
        <Route {...prop} render={matchProps => (<Header {...matchProps}{...prop} />)} />
      </header>			
      <Route {...prop} render={matchProps => (<Nav {...matchProps}{...prop} />)} />
			{!localStorage.agent && !localStorage.role ? <Route {...prop} render={matchProps => (<NotificationView {...matchProps}{...prop} />)} /> : null}
      <RightSideBar toggleRightSideBar={prop.toggleRightSideBar} rightSideBar={prop.state.rightSideBar}/>
      <DesktopRightSideBar categories={prop.state.categories} toggleDesktopRightSideBar={prop.toggleDesktopRightSideBar}  desktopRightSideBar={prop.state.desktopRightSideBar}/>
			<main id={prop.state.toggleMenu ? 'active' : null} className={'he'}>
				<Switch>
					//<Route path="/" exact render={(props) => (<Home {...props}{...prop}/>)} />
          <Route path="/home" render={(props) => (<Home key={props.match.params.lang} {...props}{...prop}/>)} />

            {/* == pages == */}
            <Route path="/categories" render={(props) => (<MyCategoryPage/>)} />
            <Route path="/myzone" render={(props) => (<MyZonePage/>)} />
            {/* <Route path="/category" render={(props) => (<HasmalCategoryPage/>)} /> */}
            {/* =========== */}
            
            <Route path="/category/:lvl1/:lvl2/:lvl3/:id" render={(props) => (<CategoryPage {...props}{...prop}/>)} />
            <Route path="/category-page/:lvl1/:lvl2/:lvl3" render={(props) => (<CategoryView {...props}{...prop}/>)} />
            <Route path="/productParent/:lvl1/:lvl2/:lvl3/:id" render={(props) => (<ProductParent {...props}{...prop}/>)} />

					<Route path="/cart" render={(props) => (<ShopCart {...props}{...prop}/>)} />
					<Route path="/wishList/:lang" render={(props) => (<WishList {...props}{...prop}/>)} />
          <Route path="/sales/:id" render={(props) => (<ForSale {...props}{...prop} />)} />

          {!localStorage.agent && !localStorage.role ? <Route path="/profil" render={(props) => (<Profil {...props}{...prop}/>)} /> :null}
					{localStorage.role ? <Route path="/admin-history" render={(props) => (<AdminHistory {...props}{...prop}/>)} /> : null}
          {localStorage.role ? <Route path="/admin-sales" render={(props) => (<AdminSales {...props}{...prop}/>)} /> : null}
          {localStorage.role ? <Route path="/admin-info" render={(props) => (<AdminInfo {...props}{...prop}/>)} /> : null}


          <Route path="/category-edit/:parentId/:subId" render={(props) => (<CategoryEdit {...props}{...prop}/>)} />
          <Route path="/products-edit/:lvl1id/:lvl2id/:lvl3id" render={(props) => (<ProductsEdit key={props.match.params.id} {...props}{...prop}/>)} />
          <Route path="/editproduct/:id" render={(props) => (<ProductEdit {...props}{...prop}/>)} />
          <Route path="/category-build/:id" render={(props) => (<CategoryBuild {...props}{...prop}/>)} />
          <Route path="/deptEdit" render={(props) => (<DeptEdit {...props}{...prop}/>)} />




          <Route path="/notification" render={(props) => (<Notification {...props}{...prop}/>)} />
          <Route path="/departments/:id/:lang" render={(props) => (<Departments {...props}{...prop}/>)} />

					{localStorage.user ? <Route path="/history" render={(props) => (<History {...props}{...prop}/>)} /> : null}
          {localStorage.user ? <Route path="/docs" render={(props) => (<Docs {...props}{...prop}/>)} /> : null}
          {localStorage.user ? <Route path="/returns" render={(props) => (<Returns {...props}{...prop}/>)} /> : null}

					<Route path="/filters" render={(props) => (<Filters {...props}{...prop}/>)} />
					<Route path="/contact/:lang" render={(props) => (<Contact {...props}{...prop}/>)} />
          <Route path="/about/:lang" render={(props) => (<About {...props}{...prop}/>)} />

					<Route path="/gis" render={(props) => (<Gis {...props}{...prop}/>)} />
          {localStorage.role ? <Route path="/agents" render={(props) => (<AdminAgent {...props}{...prop}/>)} /> : null}
          <Route path="/chat" render={(props) => (<Chat {...props}{...prop}/>)} />
          {localStorage.role ? <Route path="/clients" render={(props) => (<Clients {...props}{...prop}/>)} /> : null}



          <Route path="/employee" render={(props) => (<Employee {...props}{...prop}/>)} />
          <Route path="/employe/:id" render={(props) => (<EmployeePage {...props}{...prop}/>)} />
          {(localStorage.user &&  JSON.parse(localStorage.user).Type == 2) || localStorage.role ? <Route path="/collector-step-three" render={(props) => (<CollectorStepThree {...props}{...prop}/>)} /> : null}
          {(localStorage.user &&  JSON.parse(localStorage.user).Type == 2) || localStorage.role  ? <Route path="/collector-step-four/:order/:dept" render={(props) => (<CollectorStepFour {...props}{...prop}/>)} /> : null}
          {localStorage.role ? <Route path="/admin-collector-step-four/:order" render={(props) => (<AdminCollectorStepFour {...props}{...prop}/>)} /> : null}

{/*

category-page
*/}

					<Route render={(props) => (<NotFound {...props}{...prop}/>)} />
				</Switch>
			</main>

			{/* {location.href.includes("category") || location.href.includes("cart") ? null : <Route {...prop} render={matchProps => (<Footer {...matchProps}{...prop} />)} />} */}
		</Fragment>
	</Router>
);
export default BasicRouter;

class App extends Component {
	constructor(props){
		super(props);
		this.state = {
			header: 1,
			categories: [],
			items: [],
			productsInCart: [],
			openCart: false,
			price: 0,
			wishList: [],
			lang: 'he',
			maam: 0,
			delivery: [],
			paymentTypes: [],
			seo: [],
			toggleMenu: false,
			matchId: false,
			matchSubId: false,
			user: false,
			images: [],
			productSales: [],
			categorySales: [],
      productSalesDiffQuan:[],
			products: [],
			openNotification: false,
			notifications: 0,
      defaults: [],
      b2cPriceCode: "8",
      priceNoLogin: "0",
      b2cAvailiable: false,
      searchMode:false,
      appId: "",
      updateImgs:false,
      dateNew:"",
      headerPop:false,
      constants: {},
      nav: [],
      showCase: [],
      parallax: [],
      departments: [],
      imageText: [],
      contacts: [],
      ContactBtm: [],
      ContactFormInputs: [],
      about: [],
      employee:"",
      listView: "",
      totalBasket: 0,
      rightSideBar:false,
      desktopRightSideBar:false,
		}

	}
  
	componentDidMount(){

    let htmlElement = document.querySelector("html");
    let body = document.querySelector("body");
    htmlElement.setAttribute('dir', 'rtl');
    htmlElement.setAttribute('lang', 'he');


		localStorage.user ? this.setState({user: JSON.parse(localStorage.user)}) : null;
		localStorage.products ? this.getProducts() : null;
		this.getCategories();
		localStorage.wishList ? this.setState({wishList: JSON.parse(localStorage.getItem('wishList'))}) : null;
    localStorage.freeProdsInCart ? localStorage.removeItem('freeProdsInCart') : null;

    document.addEventListener('deviceready', () => {
			window.plugins.OneSignal.startInit("859c5027-9fcb-4bc5-8fee-2d7b39123211").inFocusDisplaying(window.plugins.OneSignal.OSInFocusDisplayOption.Notification).endInit();

      window.plugins.OneSignal.startInit("ff47ea8a-d01e-45af-8d1c-b7136095ecf6").inFocusDisplaying(window.plugins.OneSignal.OSInFocusDisplayOption.Notification).endInit();

      window.plugins.OneSignal.getIds((ids) => {
				this.saveAppId(ids.userId);
			});

		}, false);
    //this.getItems();
		//this.getLang();
    // this.saveAppId("81b6cd26-7c22-4698-9eb2-51f58c445446");
    if(!localStorage.listView){
      localStorage.listView = 'false';
    }
    this.setState({listView: localStorage.listView});
	}
	saveAppId = async(appId) => {
		let value = {
			appId: appId
		}
    if(localStorage.user){
  		if (JSON.parse(localStorage.user) && !localStorage.agent) {
  			value.userId = JSON.parse(localStorage.user).Id;
  		}
    }
    if(localStorage.agent){
      value.agent = localStorage.agent;
    }
    if(localStorage.role){
      value.admin = "1";
    }

    const valAjax = {
      funcName: '',
      point: 'new-api/save_app_id',
      val: value
    };
    try {
      const data = await this.ajax(valAjax);
    } catch(err) {
      console.log('connection error catsview');
    }

	}
  ajax = (value) => {
    return $.ajax({
      url: entry + '/app/app_data.php',
			type: 'POST',
			data: value,
		}).done(function(data) {
		}.bind(this)).fail(function() {
      console.log('error');
    });
	}
	connectionError = (value) => {
		alert(value);
	}
	setNotify = (data) => {
		this.setState({ notifications: data });
	}
  clearCart = (data) => {
		this.setState({productsInCart: []});
		localStorage.removeItem('products');
		if (data) {
      this.localStorageClear();
			setTimeout(() => location = '/', 2000);
		} else {
			setTimeout(() => location = '/history', 2000);
		}
	}
  simpleClearCart = () => {
    this.setState({productsInCart: []});
		localStorage.removeItem('products');
  }

  signOut = (user) => {
    if(this.state.productsInCart.length==0 && user == "agentForUser"){
      this.localStorageClear(user);
    }else{
      SweetAlert({
        title: 'האם אתה בטוח?',
        text: 'כל העסקאות והמוצרים מהעגלה יימחקו.',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#22b09a',
        cancelButtonColor: '#d80028',
        confirmButtonText: 'אשר',
        cancelButtonText: 'בטל'
      }).then(function(res) {
        if (res.value) {
          this.localStorageClear(user);
        }
      }.bind(this)).catch(SweetAlert.noop);
    }
	}

  localStorageClear = (isAgent) => {
    let tmpLocalStorage = JSON.stringify(localStorage);
    let siteVer = localStorage.siteVer;


    localStorage.clear();
    tmpLocalStorage = JSON.parse(tmpLocalStorage);
    if(tmpLocalStorage.agent && isAgent!="agent"){
      localStorage.setItem('agent', tmpLocalStorage.agent);
      localStorage.setItem('agentExId', tmpLocalStorage.agentExId);
      localStorage.setItem('agentName', tmpLocalStorage.agentName);
      localStorage.setItem('agentToken', tmpLocalStorage.agentToken);
      localStorage.setItem('sessionId', tmpLocalStorage.sessionId);
    }
    tmpLocalStorage.notifications ? localStorage.setItem('notifications', tmpLocalStorage.notifications) : null;
    tmpLocalStorage.logMail ? localStorage.setItem('logMail', tmpLocalStorage.logMail) : null;
    tmpLocalStorage.logPass ? localStorage.setItem('logPass', tmpLocalStorage.logPass) : null;

    localStorage.siteVer = siteVer;

    if(isAgent=="agentForUser"){
      this.setState({productsInCart:[],user:false});
    }else{
      setTimeout(() => location.reload(), 200);
    }


  }

	setActiveModel = (id) => {
		this.setState({chatModel: id});
	}
  addToCart = (product, id, saleProdObj) => {

    let unitChosen = 0;
    if(product.Unit=='0'){
      unitChosen = 0;
    }else if(parseInt(product.PackQuan)!=1 && product.Unit=='1'){
      unitChosen = 1;
    }else if(product.Unit=='2'){
      unitChosen = 0;
    }else{
      unitChosen = 0;
    }

		let newProduct = {
			Id: id,
			//Quantity: parseInt(product.PackQuan),
      Quantity: 1,
			Products: product,
			CategoryId: product.CategoryId,
      //UnitChosen: saleProdObj ? saleProdObj.Val : product.Unit == "2" ? 2 : 0
      UnitChosen: unitChosen
		};

		let productsSet = [];
		localStorage.products ?	productsSet = JSON.parse(localStorage.getItem('products')) : null;
		productsSet.push(newProduct);
		localStorage.setItem('products', JSON.stringify(productsSet));
		if (window.innerWidth > 1000) {
			this.setState({productsInCart: productsSet});
		} else {
			this.setState({productsInCart: productsSet});
		}
    this.setState({headerPop: true});
    setTimeout(() => {
      this.setState({headerPop: false});
    }, 3000);
    if(window.innerWidth > 1000){
      setTimeout(() => {
        $("#input_"+id).focus();
      }, 200);
      setTimeout(() => {
        $("#input_"+id).select();
      }, 300);
    }
    setTimeout(() => {
      this.writeGlbTotal();
    }, 100);

	}
  addToWish = (element) => {
		let wishList = [];
		localStorage.wishList ?	wishList = JSON.parse(localStorage.getItem('wishList')) : null;
		wishList.push(element);
		localStorage.setItem('wishList', JSON.stringify(wishList));
		this.setState({wishList});
	}

  increaseCart = (id, isCart) => {
		let productsSet = JSON.parse(localStorage.getItem('products'));
    //debugger;
		productsSet.find(item => item.Id == id).Quantity += 1;
    // productsSet.map((item,index) => {
    //   if(item.Id == id){
    //     item.Quantity = (Math.floor(parseFloat(item.Quantity)/parseInt(item.Products.PackQuan))*parseInt(item.Products.PackQuan)) + parseInt(item.Products.PackQuan);
    //   }
    // });
    //debugger;


//openCart


		localStorage.setItem('products', JSON.stringify(productsSet));
		if (window.innerWidth > 1000 && isCart!="cart") {
			this.setState({productsInCart: productsSet});
		} else {
			this.setState({productsInCart: productsSet});
		}
    setTimeout(() => {
      this.writeGlbTotal();
    }, 100);
	}
  decreaseCart = (id, isCart) => {
		let productsSet = JSON.parse(localStorage.getItem('products'));

	  productsSet.find(item => item.Id == id).Quantity -= 1;
    // productsSet.map((item,index) => {
    //   if(item.Id == id){
    //     item.Quantity = (Math.floor(parseFloat(item.Quantity)/parseInt(item.Products.PackQuan))*parseInt(item.Products.PackQuan)) - parseInt(item.Products.PackQuan);
    //
    //   }
    // });

		localStorage.setItem('products', JSON.stringify(productsSet));
		if (window.innerWidth > 1000 && isCart!="cart") {
			this.setState({productsInCart: productsSet});
		} else {
			this.setState({productsInCart: productsSet});
		}
    setTimeout(() => {
      this.writeGlbTotal();
    }, 100);
	}
  deleteProduct = (element, isCart) => {
		let productsInCart = this.state.productsInCart.filter(item => item.Id != element);

		if (window.innerWidth > 1000 && isCart!="cart") {
			this.setState({productsInCart});
		} else {
			this.setState({productsInCart});
		}
		localStorage.products = JSON.stringify(productsInCart);

    localStorage.freeProdsInCart ? localStorage.removeItem('freeProdsInCart') : null;

    // if(productsInCart.length > 0){
    //   productsInCart.map((element) => {
    //     this.globalPriceCalc(element.Products, element.Quantity, element.UnitChosen);
  	// 	});
    // }
    setTimeout(() => {
      this.writeGlbTotal();
    }, 100);
	}

  changeQuantity = (id, isCart, e) => {
    if(isCart!="cart"){
      e = isCart;
    }
		//if (!isNaN(e.target.value) || e.target.value.includes(".")) {

			let productsSet = JSON.parse(localStorage.getItem('products'));
      let value="";

      //if(e.target.value!=""){
        let prodObj = productsSet.filter(item => item.Id == id);
        if(e.target.value.includes(".") && prodObj[0].Products.Unit == "2" && prodObj[0].UnitChosen == 2 && (!this.state.user || this.state.user.Type == 2)){
          if(e.target.value.split(".")[1] == ".5"){
            value = parseFloat(e.target.value);
          }else if(e.target.value.split(".")[1]==""){
            value = e.target.value + "5";
            value = parseFloat(value);
          }else{
            value = parseFloat(e.target.value).toFixed(1);
          }

        }else{
          value = parseInt(e.target.value);
        }
      //}
			if (String(e.target.value) == "-1") {
				//this.deleteProduct(id);
			} else {

				productsSet.find(item => item.Id == id).Quantity = value;
				localStorage.setItem('products', JSON.stringify(productsSet));
        if (window.innerWidth > 1000  && isCart!="cart") {
				  this.setState({productsInCart: productsSet});
        }else{
          this.setState({productsInCart: productsSet});
        }

			}
      this.getPrice(productsSet);
      setTimeout(() => {
        this.writeGlbTotal();
      }, 100);
		//}

	}
  avoidNullInCart = (id, e) => {
    if (e.target.value == 0) {
      this.deleteProduct(id);
    }
  }
  changeUnit = (id, unitChosen) => {
    let productsSet = JSON.parse(localStorage.getItem('products'));


    productsSet.map((item) => {
      if(item.Id == id && item.UnitChosen == 2 && unitChosen == 1){
        item.Quantity = Math.ceil(item.Quantity);
        item.UnitChosen = unitChosen;
      }else if(item.Id == id){
        item.UnitChosen = unitChosen;
      }
    });


    //debugger;

    //productsSet.find(item => item.Id == id).UnitChosen = unitChosen;

    localStorage.setItem('products', JSON.stringify(productsSet));
    this.setState({productsInCart: productsSet});
    this.getPrice(productsSet);
  }
  getProducts = () => {
    if(localStorage.getItem('products')!="undefined"){
		  this.setState({productsInCart: JSON.parse(localStorage.getItem('products'))});
    }
	}
  setMatch = (params) => {
		this.setState({
			matchId: params.Id,
			matchSubId: params.SubId
		});
	}
  toggleMenu = () => {
		this.setState({toggleMenu: !this.state.toggleMenu});
	}
	changeLang = (lang) => {
		this.setState({lang});
	}
	addSeo = (data) => {
		let seo = this.state.seo;
		seo.push(data);
		this.setState({seo});
	}
	saveSeo = (seo, paramName) => {
		let val = {
			token: localStorage.token,
			role: localStorage.role,
			itemId: seo.Id,
			paramName: paramName,
			value: seo[paramName]
		};
		$.ajax({
			url: globalServer + 'new-api/seo.php',
			type: 'POST',
			data: val,
		}).done(function(data) {
		}.bind(this)).fail(function() {	console.log("error"); });
	}
	editSeo = (id, paramName, e) => {
		let seo = this.state.seo;
		seo.find(x => x.Id == id)[paramName] = e.target.value;
		this.setState({seo});
	}
	addItem = () => {
		let val = {
			token: localStorage.token,
			role: localStorage.role
		};
		$.ajax({
			url: globalServer + 'new-api/site_items_add.php',
			type: 'POST',
			data: val,
		}).done(function(data) {
			if (data.result == 'success') {
				let items = this.state.items;
				items.push(JSON.parse(data.item));
				this.setState({items});
			}
		}.bind(this)).fail(function() {	console.log("error"); });
	}
	uploadImg = (data) => {
		let params = {
			token: localStorage.token,
			role: localStorage.role,
			Folder: data.folder,
			FileName: data.fileName,
			Img: data.img,
			ItemId: data.itemId
		};
		$.ajax({
			url: globalServer + 'new-api/upload_img_site_items.php',
			type: 'POST',
			data: params
		}).done(function(d, data) {
			let items = this.state.items;
			items.find(x => x.Id == d.itemId).Img = d.fileName;
			this.setState({items});
		}.bind(this, data)).fail(function() { console.log('error'); });
	}
	editItems = (data) => {
		let items = this.state.items;
		items.find(x => x.Id == data.itemId)[data.paramName] = data.value;
		this.setState({items});
	}
	updateItems = (data) => {
		let val = {
			token: localStorage.token,
			role: localStorage.role,
			itemId: data.itemId,
			paramName: data.paramName,
			value: data.value
		};
		$.ajax({
			url: globalServer + 'new-api/site_items_edit.php',
			type: 'POST',
			data: val,
		}).done(function(data) {
		}.bind(this)).fail(function() {	console.log("error"); });
	}
	updateEditorItems = (data) => {
		let items = this.state.items;
		items.find(x => x.Id == data.itemId)[data.paramName] = data.value;
		this.setState({items});
		this.updateItems(data);
	}
	toggleCart = (data) => {
		// this.setState({openCart: !this.state.openCart});
	}
	toggleNotification = () => {
		this.setState({openNotification: !this.state.openNotification});


		if (!this.state.openNotification) {
			localStorage.notifications = this.state.notifications;
			let element = document.getElementById('notify');
			element.scrollTo(0, 0);
		}
	}
	addToState = (stateName, val) => {
		let state = this.state[stateName];
		state.push(val);
		this.setState({[stateName]: state});
	}
	updateState = (stateName, id, paramName, val) => {
		let state = this.state[stateName];
		if (state.find(x=> x.Id == id)) {
			state.find(x=> x.Id == id)[paramName] = val;
			this.setState({[stateName]: state});
		}
	}
	deleteFromState = (stateName, id) => {
		let state = this.state[stateName].filter((element, index) => {	return element.Id != id	});
		this.setState({[stateName]: state});
	}

	getCategories = async() => {
    let user = false;
		localStorage.user ? user = JSON.parse(localStorage.user) : null;
		let val = {};
		user ? val.priceFor = user.PriceFor : null;
    user ? val.userType = user.Type : null;
    user ? val.PriceListBase = user.PriceListBase : null;

    const valAjax = {
      funcName: '',
      point: 'new-api/cats_view',
      val: val
    };

    try {
      const data = await this.ajax(valAjax);
      let productSales = [
				{
					Discount: null,
					ExId: "10002602000300",
					ForExId: "10002602000300",
					ForId: "10002602000300",
					Id: 1,
					Price: "30.00",
					Quantity: 1,
					ToExId: "1000000001",
					ToId: 1000000001
				}
			];
      let productSalesDiffQuan = [
        {
          Id: 1,
          ProdId: "10002602000300",
          ProdExtId: "10002602000300",
          CatalogNum: "10002602000300",
          PriceCode: null,
          Quantity: "0",
          Price: "0"
        }
      ];
      let tmpDefaults = JSON.parse(data.defaults);
      let tmpmainGlobals = JSON.parse(data.mainGlobals).mainGlobals;

      tmpDefaults.Maam = String(tmpmainGlobals.maamPerc);
      tmpDefaults.statosMail = tmpmainGlobals.statosMail;
      tmpDefaults.MaamDecimal = tmpmainGlobals.maamDecimal;
      let areaCode = false;
      this.state.user && this.state.user.DispatchingDays ? areaCode = this.state.user.DispatchingDays : null;

      let userArea = [];

      tmpDefaults.userArea = null;

			this.setState({
				categories: JSON.parse(data.categories).Categoriess,
				// maam: defaults.Maam,
        defaults: tmpDefaults,
				adminPass1: JSON.parse(data.defaults).AdminPass.split(',')[0],
				adminPass2: JSON.parse(data.defaults).AdminPass.split(',')[1],
				// paymentTypes: JSON.parse(data.defaults)[2].Pay,
				// delivery: JSON.parse(data.defaults)[3].Shipment,
				// freeDelivery: JSON.parse(data.defaults)[4].FreeDelivery,
				// deliveryTypes: JSON.parse(data.shipment_types).ShipmentTypess,
				// seo: JSON.parse(data.seo).Seos,
				//images: data.images,
				productSales: JSON.parse(data.product_sales).ProductSaless.length ? JSON.parse(data.product_sales).ProductSaless : productSales,
        productSalesDiffQuan: JSON.parse(data.product_sales_diffQuan).ProductSalesDiffquans.length ? JSON.parse(data.product_sales_diffQuan).ProductSalesDiffquans : productSalesDiffQuan,
				products: JSON.parse(data.products).Productss,
        // catLevels: JSON.parse(data.defaults)[6].catLevels
			});
      this.writeGlbTotal();

    } catch(err) {
      console.log('connection error catsview');
    }



	}
  getPrice = (element, lowPrice) => {
		let price = 0;

    if (lowPrice && lowPrice.length) {

			if (lowPrice[0].SpecialPrice) {

				price = lowPrice[0].SpecialPrice;

			} else {

				if (lowPrice[0].Discount) {

					let percent = lowPrice[0].Discount;
					let p = lowPrice[0].Price;
					price = (p - ((p * percent) / 100)).toFixed(2);

				} else {

					price = lowPrice[0].Price;

				}

			}

		} else {

      if (element.Discount) {

        let percent = element.Discount;
        let p = element.Price;
        price = (p - ((p * percent) / 100)).toFixed(2);

      } else {

        price = element.Price;

      }

		}

		return price;
	}
  glbVatCalc = (products) => {
    if(products.Vat){
      return true;
    }else{
      return false;
    }
  }
  globalPriceCalc = (products, quantity, unitChosen) => {

    let price = 0;
		let isProductSales = [];
    let isfixedPriceSale = [];

    let appState = this.state;
    let productsQP = appState.productSalesDiffQuan.filter(item => item.ProdId == products.Id);

    let inCart = this.state.productsInCart.filter(item => item.Products.CatalogNumber == products.CatalogNumber);

    if("UnitChosen" in inCart[0] && inCart[0].UnitChosen == 1){
      quantity = quantity * parseFloat(products.PackQuan);
    }

    let product;
		if (productsQP.length > 1) {
			let current = productsQP.filter(item => quantity >= item.Quantity);
			product = current[current.length - 1];
		} else {
			product = products;
		}

		let productSales = this.state.productSales.filter(item => item.ToCatalogNum == products.CatalogNumber);

    let freeProdsInCart = [];
    if(localStorage.freeProdsInCart && productSales.length){
      freeProdsInCart = JSON.parse(localStorage.getItem('freeProdsInCart'));
      freeProdsInCart = freeProdsInCart.filter((item) => {return item.Products.CatalogNumber != productSales[0].ForCatalogNum});
      localStorage.setItem('freeProdsInCart', JSON.stringify(freeProdsInCart));
    }



    let fixedPriceSale = this.state.productSales.filter(item => item.ForCatalogNum == products.CatalogNumber && !item.ToCatalogNum);

    let free = 0;
		let prePrice = 0;
		prePrice = parseFloat(product.Price);

    let forQuanInUnits = 0;
    let toQuanInUnits = 0;
    let forQuanOrderInUnit = 0;
    let toQuanOrderInUnit = quantity;
    let isDisacrdDiscount = false;

    //if(this.state.user.Type){

  		if (productSales.length > 0) {
        this.state.productsInCart.map((item) => {
          if(item.Products.CatalogNumber == productSales[0].ForCatalogNum){
            if(productSales[0].ForUnit == "0"){
              forQuanInUnits = productSales[0].ForQuantity;
            }else{
              forQuanInUnits = productSales[0].ForQuantity * parseFloat(item.Products.PackQuan);
            }
          }
        })
        if(productSales[0].ToUnit == "0"){
          toQuanInUnits = productSales[0].ToQuantity;
        }else{
          toQuanInUnits = productSales[0].ToQuantity * parseFloat(products.PackQuan);
        }

        isProductSales = this.state.productsInCart.filter((item) => {
          if(item.UnitChosen == "0"){
            forQuanOrderInUnit =  item.Quantity;
          }else{
            forQuanOrderInUnit =  item.Quantity * parseFloat(item.Products.PackQuan);
          }
          if(item.Products.CatalogNumber == productSales[0].ForCatalogNum && forQuanOrderInUnit >= forQuanInUnits && toQuanOrderInUnit >= toQuanInUnits){
            return item;
          }
        })
      }

      if(fixedPriceSale.length > 0){
        isfixedPriceSale = this.state.productsInCart.filter((item) => {


          if(fixedPriceSale[0].ForUnit == "0" || fixedPriceSale[0].ForUnit == "2"){
            forQuanInUnits =  fixedPriceSale[0].ForQuantity;
          }else{
            forQuanInUnits =  fixedPriceSale[0].ForQuantity * parseFloat(item.Products.PackQuan);
          }
          //debugger;
          if(item.Products.CatalogNumber == fixedPriceSale[0].ForCatalogNum && !fixedPriceSale[0].ToCatalogNum && quantity >= forQuanInUnits){
            return item;
          }
          //debugger;
        })
      }
//debugger;
  		// делаем акцию на продукт
      let singlePrice = 0;
      let fullyPaidQuan = 0;
      let fixedPrice = 0;
      let singleQuanForFreeCalc = 0;
      let singleQuanForFreeCalc2 = 0;
      let isSameCatalogNum = false;

  		if (productSales.length && isProductSales.length) {

        if(parseFloat(productSales[0].ForCatalogNum) != parseFloat(productSales[0].ToCatalogNum)){
          if(isProductSales[0].UnitChosen == "0" || isProductSales[0].UnitChosen == "2"){
            singleQuanForFreeCalc = isProductSales[0].Quantity;
          }else{
            singleQuanForFreeCalc = isProductSales[0].Quantity * isProductSales[0].Products.PackQuan;
          }
          if(productSales[0].ForUnit == "0" || productSales[0].ForUnit == "2"){
            singleQuanForFreeCalc2 = productSales[0].ForQuantity;
          }else{
            singleQuanForFreeCalc2 = productSales[0].ForQuantity * isProductSales[0].Products.PackQuan;
          }
          free = (Math.floor(singleQuanForFreeCalc / singleQuanForFreeCalc2)) * productSales[0].ToQuantity;

        }else if(parseFloat(productSales[0].ForCatalogNum) == parseFloat(productSales[0].ToCatalogNum)){

          isSameCatalogNum = true;
          if(productSales[0].Discount != "100"){

            if(isProductSales[0].UnitChosen == "0" || isProductSales[0].UnitChosen == "2"){
              singleQuanForFreeCalc = isProductSales[0].Quantity;
            }else{
              singleQuanForFreeCalc = isProductSales[0].Quantity * isProductSales[0].Products.PackQuan;
            }

            if(productSales[0].ForUnit == "0" || productSales[0].ForUnit == "2"){
              singleQuanForFreeCalc2 = productSales[0].ForQuantity + 1;
            }else{
              singleQuanForFreeCalc2 = productSales[0].ForQuantity * isProductSales[0].Products.PackQuan + (1*isProductSales[0].Products.PackQuan);
            }
            free = Math.floor(singleQuanForFreeCalc / (singleQuanForFreeCalc2));
          }else{

            if(productSales[0].ForUnit == "0" || productSales[0].ForUnit == "2"){
              singleQuanForFreeCalc = productSales[0].ForQuantity;
            }else{
              singleQuanForFreeCalc = productSales[0].ForQuantity * isProductSales[0].Products.PackQuan;
            }

            if(productSales[0].ToUnit == "0" || productSales[0].ToUnit == "2"){
              singleQuanForFreeCalc2 = productSales[0].ToQuantity;
            }else{
              singleQuanForFreeCalc2 = productSales[0].ToQuantity * isProductSales[0].Products.PackQuan;;
            }

            singleQuanForFreeCalc = Math.floor(quantity / singleQuanForFreeCalc);
            free = singleQuanForFreeCalc2 * singleQuanForFreeCalc;

          }
        }

        if(free != 0){
    			if (productSales[0].Discount) {

            if(productSales[0].Discount != "100" || isSameCatalogNum == false){
              if(productSales[0].ForUnit == "1"){
                free = free * parseFloat(products.PackQuan);
              }

              singlePrice = prePrice - ((prePrice * parseFloat(productSales[0].Discount)) / 100);
              price = singlePrice * free;

              if ((quantity - free) > 0) {
        				price += prePrice * (quantity - free);
        			}
            }else{
              price = prePrice * quantity;
              let tmpProdsInCart = this.state.productsInCart;
              if(productSales[0].ToUnit=="1"){
                free = free / parseFloat(products.PackQuan);
              }
              tmpProdsInCart.map((item) => {
                if(item.Products.CatalogNumber == productSales[0].ForCatalogNum){
                  let freeProd = {CategoryId: item.CategoryId, Id: item.Id, Quantity: free, unitChosen: productSales[0].ToUnit, isFree: true, Products: item.Products}
                  freeProdsInCart.push(freeProd);
                }
              })
              //debugger;
              localStorage.setItem('freeProdsInCart', JSON.stringify(freeProdsInCart));
              isDisacrdDiscount = true;
            }


    			} else {
    				fixedPrice = parseFloat(productSales[0].Price);

            singlePrice = isProductSales[0].Products.Price;

            let free2 = free;
            if(productSales[0].ForUnit == "1"){
              free2 = free2 * parseFloat(products.PackQuan);
            }

            if ((quantity - free) > 0) {
              fullyPaidQuan = quantity - free2;
              price = (fixedPrice * free) + (fullyPaidQuan * prePrice);
            }else{
              price = fixedPrice * quantity;
            }

            //debugger;
    			}
        }else{
          price = prePrice * quantity;
        }


  		}else if(fixedPriceSale.length && isfixedPriceSale.length ){

      //  free = Math.floor(isProductSales[0].Quantity / (productSales[0].ForQuantity+1));
        if(isfixedPriceSale[0].UnitChosen == "0" || isfixedPriceSale[0].UnitChosen == "2"){
          singleQuanForFreeCalc = isfixedPriceSale[0].Quantity;
        }else{
          singleQuanForFreeCalc = isfixedPriceSale[0].Quantity * isfixedPriceSale[0].Products.PackQuan;
        }
        if(fixedPriceSale[0].ForUnit == "0" || fixedPriceSale[0].ForUnit == "2"){
          singleQuanForFreeCalc2 = fixedPriceSale[0].ForQuantity;
        }else{
          singleQuanForFreeCalc2 = fixedPriceSale[0].ForQuantity * isfixedPriceSale[0].Products.PackQuan;
        }
        free = Math.floor(singleQuanForFreeCalc / singleQuanForFreeCalc2);
        //debugger;
        fullyPaidQuan = quantity - (singleQuanForFreeCalc2*free);
        singlePrice = isfixedPriceSale[0].Products.Price;

        if(fixedPriceSale[0].Price){
          fixedPrice = parseFloat(fixedPriceSale[0].Price);
          price = (fixedPrice*free) + (fullyPaidQuan * singlePrice);
        }else{
          price = (fullyPaidQuan * singlePrice) + ((singlePrice - (singlePrice * parseFloat(fixedPriceSale[0].Discount) / 100)) * (quantity - fullyPaidQuan));
        }

      //  debugger;

      }
  		if (!isProductSales.length && !isfixedPriceSale.length) {
  			price = prePrice * quantity;
  		}
      let priceBefore = prePrice * quantity;

      if(priceBefore<price){
        price = priceBefore;
      }



/*
    }else{
      price = prePrice * quantity;
    }
    */
    let returnArr = [];
    returnArr.push(price);

    free != 0 && (isProductSales.length || isfixedPriceSale.length) && isDisacrdDiscount == false ? returnArr.push(1) : returnArr.push(0);
		return returnArr;
  }
  toggleSearch = (state) => {
    this.setState({searchMode: state});
  }
  restoreCart = (products) => {
		localStorage.setItem('products', JSON.stringify(products));
		this.setState({productsInCart: products, openCart: true});

    this.setState({headerPop: true});
    setTimeout(() => {
      this.setState({headerPop: false});
    }, 3000);
		// this.getPrice(products);
	}
  addImgToGlbArr = (image) => {
    let images = this.state.images;
    images.push(image);
    this.setState({images});
  }
  removeImgFromGlbArr = (catalogNum) => {
    let images = this.state.images;
    images.filter((item,index) => {return item != catalogNum});
    this.setState({images});
  }
  AgentLog = (val) => {

    if(val=="in"){
      localStorage.user ? this.setState({user: JSON.parse(localStorage.user)}) : null;
    }

  }

  getLang = () => {
		let path = location.hash.split('/');
		let lang = 'he';
		if (path.includes('he')) lang = 'he';
		if (path.includes('en')) lang = 'en';

		this.setState({lang});
		this.htmlLang(lang);
	}
	getItems = () => {
		let val = { funcName: 'GetSiteData' };
		$.ajax({
			url: globalServer + 'global_items.php',
			type: 'POST',
			data: val
		}).done(function(data) {
			this.setState({
				nav: data.nav,
				constants: data.constants.Constants
			});

		}.bind(this)).fail(function() {	console.log("error"); });
	}

  selectLang = lang => {
		this.setState({lang});
		this.htmlLang(lang);
	}
	htmlLang = lang => {

		let htmlElement = document.querySelector("html");
		let body = document.querySelector("body");
		if (lang == 'he') {
			htmlElement.setAttribute('dir', 'rtl');
			htmlElement.setAttribute('lang', 'he');
			body.classList.remove('ru');
		} else {
      /*
			htmlElement.setAttribute('dir', 'ltr');
			htmlElement.setAttribute('lang', 'en');
			body.classList.add('ru');
      */
		}
	}
	returnConstant = param => {
		let langConst = this.state.constants;
		let result = '';
		if ( Object.keys(langConst).length ) {
			result = langConst[param + '_' + this.state.lang];
		}
		return result;
	}

  setEmployee = (employee) =>{
		this.setState({employee});
	}


  setView = (value) => {
    localStorage.listView = value;
    this.setState({listView: value});
  }

  writeGlbTotal = () =>{


    // let totalBasket = ((priceBefore - (priceBefore*discount/100)) + deliveryPrice + ((glbVatActive - (glbVatActive * discount / 100)) * parseFloat(this.state.defaults.Maam) / 100)).toFixed(2)
    // this.setState({totalBasket})

    let priceArray = [];
    let vatArray = [];
    let noVatArray = [];
    let isVat = false;
    let discount = 0;
    let deliveryPrice = 0;


    let productsSet = [];
    localStorage.products ?	productsSet = JSON.parse(localStorage.getItem('products')) : null;

		productsSet.map((element, index) => {
			priceArray.push((this.globalPriceCalc(element.Products, element.Quantity, element.UnitChosen))[0]);

      isVat = this.glbVatCalc(element.Products);
      if(!isVat){
        vatArray.push(priceArray[priceArray.length-1]);
      }
		});
		const reducer = (accumulator, currentValue) => accumulator + currentValue;

		let price = 0;
    let priceBefore = 0;

		if (priceArray.length) {
			priceBefore = price = priceArray.reduce(reducer);
			if (localStorage.user) {
				let user = JSON.parse(localStorage.user);
				price = priceArray.reduce(reducer);
				if (discount) {
					let percent = parseFloat(discount);
					let p = parseFloat(price);
					let prePrice = (p - ((p * percent) / 100));
					price = prePrice;
					//this.setState({discount: this.state.discount});
				}
			}
		}
    let glbVatActive = 0;
    vatArray.length ? glbVatActive = (vatArray.reduce(reducer)).toFixed(2) : null;


    let totalBasket = ((priceBefore - (priceBefore*discount/100)) + deliveryPrice + ((glbVatActive - (glbVatActive * discount / 100)) * parseFloat(this.state.defaults.Maam) / 100)).toFixed(2)

    this.setState({totalBasket: parseFloat(totalBasket).toFixed(1)});

  }

  toggleRightSideBar = () => {
    this.state.rightSideBar === true ?  this.setState({rightSideBar:false}) : this.setState({rightSideBar:true})

  }

  toggleDesktopRightSideBar =() => {
    this.state.desktopRightSideBar === true ?  this.setState({desktopRightSideBar:false}) : this.setState({desktopRightSideBar:true})
  }

	render() {

		return (
      <UserContext.Provider value={this}>
				<BasicRouter {...this} />
			</UserContext.Provider>
		);
	}
}

ReactDOM.render(<App />, document.getElementById('root'));
