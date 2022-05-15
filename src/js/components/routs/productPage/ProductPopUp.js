import ReactDOM from "react-dom";
import React, { Component, Fragment } from 'react';
import { NavLink } from "react-router-dom";
import {Helmet} from "react-helmet";
import ProductInfo from "./ProductInfo";
import MyCropper from "../../tools/MyCropper";
import LoadImage from '../../tools/LoadImage';
import ProductAddToCart from "./ProductAddToCart";
import VariationProduct from "../../variation/VariationProduct";
import AnotherProduct from "../../anotherProduct/AnotherProduct";


import ProductsSwiper from "../../productsSwiper/ProductsSwiper";


let arrayGLB = [];



export default class ProductPage extends Component {
	constructor(props){
		super(props);
		this.state = {
			products: [],
      allProducts: [],
			info: false,
      preload: false,
      dateNew: '',
      imageModal: false,
      modalSwiperThumb: '',
		}
		this.close = this.close.bind(this);
    this.uploadImg = this.uploadImg.bind(this);
    this.setPreload = this.setPreload.bind(this);
    this.unsetPreload = this.unsetPreload.bind(this);

	}

	componentDidMount(){
    let dateNew = new Date;
		dateNew = dateNew.toLocaleTimeString().slice(0, -3);
		this.setState({dateNew});
		this.getProduct();
	}
	componentWillReceiveProps(nextProps) {
		// if (this.props.match.params.id != nextProps.match.params.id) {
		// 	this.setState({info: false});
		// 	this.getProduct(nextProps.match.params.id);
		// }
	}
	componentWillUnmount(){
		// let tmpParams = {
		// 	Id: false,
		// 	SubId: false
		// };
		// this.props.setMatch(tmpParams);
	}
	getProduct(id){
      let selectedProd = this.props.state.selectedProd;
			// let parent = this.props.state.categories.filter(item => item.ParentId == selectedProd.CatalogNumber);
			// if (parent.length) {
			// 	let tmpParams = {
			// 		Id: selectedProd.CategoryId,
			// 		SubId: selectedProd.Id
			// 	};
			// 	this.props.setMatch(tmpParams);
			// }
			this.setState({
				products: selectedProd,
				info: selectedProd.Id
			});
			// setTimeout(() => window.scrollTo(0, 0), 100);

	}

  uploadImg(data){
		let params = {
			token: localStorage.token,
			role: localStorage.role,
			Folder: data.folder,
			FileName: data.itemId,
			Img: data.img,
			ItemId: data.itemId
		};
		$.ajax({
			url: globalServer + 'upload_img_product.php',
			type: 'POST',
			data: params
		}).done(function(d, data) {
			if(data.result == "success") {
        this.unsetPreload();
        let dateNew = new Date;
    		dateNew = dateNew.toLocaleTimeString().slice(0, -3);
    		this.setState({dateNew});
        this.props.props.addImgToGlbArr(d.itemId);
        $("#img"+d.itemId).css({"background-image":"url("+ globalFileServer + "products/" + d.itemId + ".jpg?" + dateNew +")"});
			}
		}.bind(this, data)).fail(function() {
       console.log('error');
       this.unsetPreload();
     });
	}
  setPreload(){
    this.setState({preload: true});
  }
  unsetPreload(){
    this.setState({preload: false});
  }
	close(){
    // alert("boom");
    // this.props.closePropdPop();
  }

  deleteImage(catalogNum){
    let params = {
			fileName: catalogNum+".jpg",
      token: localStorage.token,
      role: localStorage.role
		};
		$.ajax({
			url: globalServer + 'delete_img.php',
			type: 'POST',
			data: params
		}).done(function(catalogNum, data) {
			if(data.result == "success") {
        this.props.props.removeImgFromGlbArr(catalogNum);
        let dateNew = new Date;
    		dateNew = dateNew.toLocaleTimeString().slice(0, -3);
    		this.setState({dateNew});
        $("#img"+catalogNum).css({"background-image":"url("+ globalFileServer + "products/product.jpg" +")"});
			}
		}.bind(this, catalogNum)).fail(function() {
       console.log('error');
     });
  }

  
	render(){
    // console.log(this.state.products.CatalogNumber)
    let inCart = this.props.props.state.productsInCart.filter(item => item.Products.CatalogNumber == this.props.state.selectedProd.CatalogNumber);
    let productSales = this.props.props.state.productSales.length ? this.props.props.state.productSales.filter(item => item.ForCatalogNum == this.props.state.selectedProd.CatalogNumber) : [];
    let diffQuantity = this.props.props.state.productSalesDiffQuan.filter(item => item.ProdId == this.props.state.selectedProd.Id && item.Quantity != null);
    let maam = !this.props.props.state.user.Type ? 1 : 1;
    let image = this.props.props.state.images.length ? this.props.props.state.images.filter(item => item == this.props.state.selectedProd.CatalogNumber) : [];
    let type;
    if((inCart.length && !("UnitChosen" in inCart[0])) ||  (inCart.length == 0)){
      this.props.state.selectedProd.Unit == 2 ? type = " לק״ג" : type = " ליחידה"
    }else if((inCart.length && (("UnitChosen" in inCart[0] && inCart[0].UnitChosen == 0)))){
      type = " ליחידה";
    }else if((inCart.length && (("UnitChosen" in inCart[0] && inCart[0].UnitChosen == 1)))){
      type = " למארז"
    }else if((inCart.length && (("UnitChosen" in inCart[0] && inCart[0].UnitChosen == 2)))){
      type = " לק״ג";
    }
    let lang = 'he';
    if(this.props.lang){
      lang = this.props.lang;
    }else if(this.props.state.lang){
      lang = this.props.state.lang;
    }


    
    let priceListGroup='';
    if(this.props.state.selectedProd && this.props.state.selectedProd.PriceListGroup){
      switch(this.props.state.selectedProd.PriceListGroup){
        case '1':
        priceListGroup = 'מחיר אחרון';
        break;
        case '2':
        priceListGroup = 'מחיר לקוח';
        break;
        case '3':
        priceListGroup = 'הצעת מחיר';
        break;
      }
    }

    let props = Object.assign({}, this.props);
    
    // const variaionData = this.props.filteredVatiation(this.state.products.CatalogNumber);

    return(
			<div className="product-page">
      {this.state.preload ?
        <div className="spinner-wrapper">
          <div className="spinner">
            <div className="bounce1"></div>
            <div className="bounce2"></div>
            <div className="bounce3"></div>
          </div>
        </div>
      : null}
      {this.state.imageModal ? ReactDOM.createPortal(
        <div className="modai-image animated">
          <div onClick={() => this.setState({imageModal: false})} className="close">
            <img src={globalFileServer + 'icons/close.svg'} />
          </div>
          <div className="img-wrapper">
            <img src={globalFileServer + 'products/' + this.state.imageModal + ".jpg"} />
          </div>
        </div>,
        document.getElementById('modal-root')
      ): null}

				<div className="product-wrapper flex-container">
          <div className="col-lg-5 image image_container_popup">
            {this.props.variationData 
            ? <div>
                <ProductsSwiper mainImg={this.props.state.selectedProd.ImgLink} variaionData={this.props.variationData}/>
                {this.props.state.selectedProd.PdfLink ? <a href={this.props.state.selectedProd.PdfLink}>מפרט טכני</a> : null}
              </div>
            
            : <img className="img" src={this.props.state.selectedProd.ImgLink} onError={(e) => e.target.src = globalFileServer + 'placeholder.jpg'} />
            }
            

          </div>
					<div className="col-lg-7 info-p">
						<div className="product-details">

							<div className="name">
								<h2>{lang == "he" ? this.props.state.selectedProd.Title : this.props.state.selectedProd.TitleEng}</h2>
                <h2>{this.props.state.selectedProd.EngDesc ? this.props.state.selectedProd.EngDesc : null}</h2>
                <h4>מק"ט {this.props.state.selectedProd.CatalogNumber ? this.props.state.selectedProd.CatalogNumber : null}</h4>
                {this.props.state.selectedProd.Series ? <h4>יצרן: {this.props.state.selectedProd.Series}</h4> : null}
                {this.props.state.selectedProd.RatedImpulse ? <h4>דרוג: {this.props.state.selectedProd.RatedImpulse}</h4> : null}
                {this.props.state.selectedProd.CurveCode ? <h4>קוד: {this.props.state.selectedProd.CurveCode}</h4> : null}
                {this.props.state.selectedProd.Poles ? <h4>מוטות: {this.props.state.selectedProd.Poles}</h4> : null}
                {/* work here */}
                <div className="variation_container">

                  {
                    this.props.variationData.map((i,key) => 
                    <div className="variations_cards" key={key}>
                      <VariationProduct variaionData={i} numberOfVariation={key}/>
                    </div>
                    )
                  }
                </div>

                {this.props.state.selectedProd.Description ?
  								<div className="details">
  									<p>{this.props.state.selectedProd.Description}</p>
  								</div>
  							: null}
                {/* {this.props.state.selectedProd.PackQuan ?
                  <div className="prod-info-cont flex-container">
                    <div className="col-lg-3">
                      <p className="c-title pack_quan">יחידות באריזה:</p>
                    </div>
                    <div className="col-lg-9">
                      <p className="c-nomber">{this.props.state.selectedProd.PackQuan}</p>
                    </div>
                  </div >
                :null} */}
                {/* {this.props.state.selectedProd.CatalogNumber ?
                  <div className="prod-info-cont flex-container">
                    <div className="col-lg-3">
                      <p className="c-title">מספר קטלוגי:</p>
                    </div>
                    <div className="col-lg-9">
                      <p className="c-nomber">{this.props.state.selectedProd.CatalogNumber}</p>
                    </div>
                  </div >
                :null} */}
                {this.props.state.selectedProd.Barcode ?
                  <div className="prod-info-cont flex-container">
                    <div className="col-lg-3">
                      <p className="c-title">ברקוד:</p>
                    </div>
                    <div className="col-lg-9">
                      <p className="c-nomber">{this.props.state.selectedProd.Barcode}</p>
                    </div>
                  </div >
                :null}
                {this.props.state.selectedProd.Extra4 ?
                  <div className="prod-info-cont flex-container">
                    <div className="col-lg-3">
                      <p className="c-title">כמות במלאי:</p>
                    </div>
                    <div className="col-lg-9">
                      <p className="c-nomber">{this.props.state.selectedProd.Extra4}</p>
                    </div>
                  </div >
                :null}
                {this.props.state.selectedProd.Extra5 ?
                  <div className="prod-info-cont flex-container">
                    <div className="col-lg-3">
                      <p className="c-title">מותג:</p>
                    </div>
                    <div className="col-lg-9">
                      <p className="c-nomber">{this.props.state.selectedProd.Extra5}</p>
                    </div>
                  </div >
                :null}
                {/*
                {priceListGroup ?
                  <div className="prod-info-cont flex-container">
                    <div className="col-lg-5">
                      <p className="c-title">{lang == "he" ? "מחירון: " : "Last Purchase: "}</p>
                    </div>
                    <div className="col-lg-7">
                      <p className="c-nomber">{priceListGroup}</p>
                    </div>
                  </div >
                :null}
                */}
                <div className="add_to_cart_popup">
                  <button>הוספה לרשימה</button>
                </div>

							</div>

              <div className="flex-container bottom-flex">
                {this.props.state.selectedProd.Price ?
                  <div className="price-cont col-lg-8">
                    {(this.props.props.state.user && this.props.props.state.user.Id) ||  (!this.props.props.state.user && !localStorage.role && this.props.props.state.priceNoLogin == "1") ?
        							<div className="price">
        								{this.props.props.getPrice(this.props.state.selectedProd, arrayGLB) == this.props.state.selectedProd.Price ?
                          <div>

                            {(inCart.length && (("UnitChosen" in inCart[0] && (inCart[0].UnitChosen == 0 || inCart[0].UnitChosen == 2)) ||  (!("UnitChosen" in inCart[0])))) || (inCart.length == 0) ?
                              <h3 className="price">{(parseFloat(this.props.state.selectedProd.Price) * maam).toFixed(2) + type}</h3>
                            :
                              <h3 className="price">{(parseFloat(this.props.state.selectedProd.Price) * parseInt(this.props.state.selectedProd.PackQuan) * maam).toFixed(2) + type}</h3>
                            }
                          </div>
        								:
        								<div className="price-widh-discount">
        									<h3 className="price">{(parseFloat(this.props.state.selectedProd.Price) * maam).toFixed(2)}</h3>
        									<h3 className="old-price">{(parseFloat(this.props.state.selectedProd.OrgPrice) * maam).toFixed(2)}</h3>
        								</div>
        								}
        							</div>
                    :null}
                  </div>
                :null}

                <div className="add-cont col-lg-4">
                  {this.props.state.selectedProd.Price && (this.props.props.state.user || this.props.props.state.b2cAvailiable) ?
                    <div className="actions flex-container">
                      {inCart.length ?
                        <div className="added">
                          <img src={globalFileServer + 'icons/in_cart.png'}/>
                          <p>נוסף לסל</p>
                        </div>
                      :null}
                      <div className={inCart.length ? "add-to-cart" : "add-to-cart not-in-cart"}>
                        <ProductAddToCart
                          inCart={inCart}
                          element={this.props.state.selectedProd}
                          {...props}
                        />
                      </div>

                      <div className="sum-cont">
                        <h3 className="h3-1">{"סה״כ: "}</h3>
                        {(inCart.length && (("UnitChosen" in inCart[0] && (inCart[0].UnitChosen == 0 || inCart[0].UnitChosen == 2)) ||  (!("UnitChosen" in inCart[0])))) || (inCart.length == 0) ?
                          <h3 className="h3-2">{inCart.length ? (((parseFloat(this.props.state.selectedProd.Price) * maam))*inCart[0].Quantity).toFixed(2) : "0"}</h3>
                        :
                          <h3 className="h3-2">{inCart.length ? (((parseFloat(this.props.state.selectedProd.Price) * maam))*inCart[0].Quantity * parseFloat(this.props.state.selectedProd.PackQuan).toFixed(2)).toFixed(2) : "0"}</h3>
                        }
                      </div>
                    </div>
                  :null}
                </div>
              </div>
						</div>

					</div>

				</div>
        
        <div>
          {(productSales.length || diffQuantity.length) && this.props.props.state.user.Type ?
            <div className="sales-info">
              <ProductInfo {...this} />
            </div>
          :null}
        </div>
        <div className="another_products">
            <AnotherProduct getRandomProduct={this.props.getRandomProduct}/>
        </div>
			</div>
		)
	}
}
