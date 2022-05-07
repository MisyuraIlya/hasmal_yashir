import ReactDOM from "react-dom";
import React, { Component, Fragment, useState } from 'react';
import { NavLink, useParams } from "react-router-dom";
import SweetAlert from 'sweetalert2';
import MyCropper from "../tools/MyCropper";
import BreadCrumbs from "../tools/BreadCrumbs";
import Preload from "../tools/Preload";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const Heading = e => {
	return(
		<div className="heading">
			<div style={{alignItems: 'flex-end'}} className="flex-container">
				<div className="col-lg-1">
          {/*
					<p>כניסה</p>
          */}
				</div>
				<div className="col-lg-1">
					<p>סדר</p>
				</div>
				<div className="col-lg-1">
					<p>תמונה</p>
				</div>
				<div className="col-lg-3 title">
					<p style={{textAlign: 'right'}}>כותרת</p>
				</div>
        <div className="col-lg-2 title">
					<p style={{textAlign: 'right'}}>מק״ט</p>
				</div>
        <div className="col-lg-1 title">
          <p style={{textAlign: 'right'}}></p>
        </div>
				<div className="col-lg-3">
					<div style={{alignItems: 'flex-end'}} className="flex-container">

						<div className="col-lg-3">
              {/*
							<p>רב מכר</p>
            */}
						</div>
						<div className="col-lg-3">
              {/*
							<p>חדש</p>
              */}
						</div>
            <div className="col-lg-3">
              {/*
              <p>מלאי</p>
              */}
            </div>
						<div className="col-lg-3">
							<p>סטאטוס</p>
						</div>
						<div className="col-lg-3">
              {/*
							<p>מחק</p>
              */}
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}

const AddItem = params => {
	const [openMain, setOpenMain] = useState(false);
	let { id } = useParams();

	const getTitle = () => {
		return params.categories.map((element, index) => {
			if (element.ExId == id) {
				return element.Title;
			}
		});
		return null;
	}

	let title = getTitle();
	return(
		<div className="add-item add-item-main">

		</div>
	);
}

export default class ProductsEdit extends Component {
	state = {
		items: [],
		preload: false,
		masc: false,
    dateNew: ''
	}
	componentDidMount = () => {
		this.getItems();
		setTimeout(() => window.scrollTo(0, 0), 100);
    let dateNew = new Date;
    dateNew = dateNew.toLocaleTimeString().slice(0, -3);
    this.setState({dateNew});
	}
	getItems = async() => {

		let val = {
      lvl1id: this.props.match.params.lvl1id,
      lvl2id: this.props.match.params.lvl2id,
      lvl3id:this.props.match.params.lvl3id
		};

    const valAjax = {
      funcName: 'getItemsAdmin',
      point: 'product_edit_admin',
      val: val
    };
    try {
      const data = await this.props.ajax(valAjax);
      this.setState({
        items: data.Items
      });
    } catch(err) {
      console.log('connection error docs');
      this.setState({preload:false});
    }


	}
	deleteItem = (id) => {
		this.setPreload();
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
				let ParentId = parseInt(this.props.match.params.id);
				let site = this.props.match.params.site;
				let val = {
					token: localStorage.token,
					role: localStorage.role,
					funcName: 'deleteItem',
					itemId: id,
					parent: ParentId,
					site
				};
				$.ajax({
					url: globalServer + 'product_edit_admin.php',
					type: 'POST',
					data: val,
				}).done(function(data) {
					this.setState({
						items: data.Items
					});
					this.unsetPreload();
				}.bind(this)).fail(function() {	this.unsetPreload(); }.bind(this));
			} else {
				this.unsetPreload();
			}
		}.bind(this, id)).catch(SweetAlert.noop);
	}
	sortItems = async(element, direction) => {

      let newOrder;
      let chosenIndex = 0;
      let prods = this.state.items;
      for(let i=0;i<prods.length;i++){
        if(prods[i].Id == element.Id){
          chosenIndex = i;
        }
      }

      newOrder = !direction ? prods[chosenIndex+1].Orden : prods[chosenIndex-1].Orden;
      let replacedItem = this.state.items.filter(item => item.Orden == newOrder)[0];

      let nOrder = [
        {
          Id: element.Id,
          Index: newOrder
        },
        {
          Id: replacedItem.Id,
          Index: element.Orden
        }
      ];
      let items = this.state.items;
      items.find(x => x.Orden == newOrder).Orden = element.Orden;
      items.find(x => x.Id == element.Id).Orden = newOrder;
      items.sort((a, b) => { return a.Orden - b.Orden });
      this.setState({items});


      const valAjax = {
        funcName: 'orderItems',
        point: 'product_edit_admin',
        token: localStorage.token,
				role: localStorage.role,
        order: nOrder
      };

      try {
        const data = await this.props.ajax(valAjax);

      } catch(err) {
        console.log('connection error docs');
        this.setState({preload:false});
      }



	}
	uploadImg = async (data) => {
		this.setPreload();
		let val = {
			token: localStorage.token,
			role: localStorage.role,
			funcName: 'uploadImg',
      point: 'product_edit_admin',
			fileName: "jpg." + data.itemId + ".jpg",
			img: data.img,
			folder: data.folder,
			itemId: data.itemId
		};
    try {
      const data = await this.props.ajax(val);

      //this.props.addImgToGlbArr(val.itemId);

      this.unsetPreload();
      let dateNew = new Date;
      dateNew = dateNew.toLocaleTimeString().slice(0, -3);
      this.setState({dateNew});

    } catch(err) {
      console.log('connection error uploadImg');
    }


	}
	editItem = (value, id, paramName) => {
		let items = this.state.items;
		items.find(x => x.Id == id)[paramName] = value;
		this.setState({items});
	}
	updateItems = async(value, id, paramName) => {
		let items = this.state.items;
		items.find(x => x.Id == id)[paramName] = value;
		this.setState({items});

    //debugger;
		let site = this.props.match.params.site;
		let valAjax = {
			funcName: 'editItem',
      point: 'product_edit_admin',
			token: localStorage.token,
			role: localStorage.role,
			itemId: id,
			paramName: paramName,
			value: value
		};

    try {
      const data = await this.props.ajax(valAjax);

    } catch(err) {
      console.log('connection error docs');
      this.setState({preload:false});
    }


	}
	setPreload = () => { this.setState({preload: true}); }
	unsetPreload = () => { this.state.preload ? this.setState({preload: false}) : null; }



  reorder = (list, startIndex, endIndex) => {
    const result = Array.from(list);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);

    return result;
  };

  getItemStyle = (isDragging, draggableStyle) => ({
    userSelect: "none",
    background: isDragging ? "#f9f9f9" : "#fff",
    ...draggableStyle
  });

  getListStyle = isDraggingOver => ({
    background: isDraggingOver ? "#e5e5e5" : "#ddd",
  });

  onDragEnd = (result) => {

    if (!result.destination) {
      return;
    }
    const items = this.reorder(
      this.state.items,
      result.source.index,
      result.destination.index
    );
    this.setState({ items });
		this.setNewOrder(items);

  }
	setNewOrder = async(items) => {
    items.map((element, index) => {
      element.Orden = index;
		});

		let valAjax = {
			funcName: 'orderItems',
      point: 'new-api/products_edit',
			token: localStorage.token,
			role: localStorage.role,
			items: JSON.stringify(items)
		};

    try {
      const data = await this.props.ajax(valAjax);
    } catch(err) {
      console.log('connection error docs');
      this.setState({preload:false});
    }


	}


	render(){
		let appState = this.props.state;
		let breadCrumbsNav = [
			{Title: 'ניהול מוצרים', Link: null}
		];
		return (
			<div className="category-edit blog-edit">
				<BreadCrumbs title="מוצרים" breadCrumbsNav={breadCrumbsNav} />
				<div className="container items-container">
					<Preload preload={this.state.preload} />
					<AddItem categories={appState.categories} />
					<div className="items">
						<Heading />

            <DragDropContext onDragEnd={this.onDragEnd}>
              <Droppable droppableId="droppable">
                {(provided, snapshot) => (
                <div className="items" {...provided.droppableProps} ref={provided.innerRef} style={this.getListStyle(snapshot.isDraggingOver)}>

      						{this.state.items.map((element, index) => {
                    //let image = this.props.state.images.length ? this.props.state.images.filter(item => item == element.CatalogNumber) : [];

      							return(
      								<div key={index} id={"item_" + element.Id} className="item">
                        <Draggable key={element.Id} draggableId={element.Id + ''} index={index}>
                          {(provided, snapshot) => (
                            <div
                              className="item"
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={this.getItemStyle(snapshot.isDragging, provided.draggableProps.style)}
                              >
                              <div className="flex-container">

            										<div className="col-lg-1 enter">
                                {/*
            											<NavLink to={"/editproduct/" + element.Id}>
            												<img src={globalFileServer + "icons/enter.svg"} alt=""/>
            											</NavLink>
                                */}
            										</div>

                                <div className="col-lg-1 sort">
                                  <img src={globalFileServer + "icons/drag.svg"} alt=""/>
                                </div>
            										<div className="col-lg-1 for-img">
            											<div
            												onMouseOver={() => this.state.masc != element.Id ? this.setState({masc: element.Id}) : null}
            												onMouseLeave={() => this.setState({masc: false})}
            												className={element.Img ? "img-load active" : "img-load"}>
            													<Fragment>
            														{this.state.masc == element.Id ?
            															<div className="masc">
            																<img src={element.Extra1} onError={(e) => e.target.src = globalFileServer + 'placeholder.jpg'}/>
            															</div>
            														: null}
            														<img
            															className="main-img"
            															src={element.Extra1}
                                          onError={(e) => e.target.src = globalFileServer + 'placeholder.jpg'}
            															onLoad={this.unsetPreload}
            														/>
            													</Fragment>
{/*
            												<MyCropper
            													aspectRatio={16/16}
            													itemId={element.CatalogNumber}
            													folder="products"
            													uploadImg={this.uploadImg}
            													setPreload={this.setPreload}
            													unsetPreload={this.unsetPreload}
            												/>
*/}
            											</div>
            										</div>
            										<div className="col-lg-3 title">
            											<p>{element.Title}</p>
            										</div>
                                <div className="col-lg-2 title">
            											<p>{element.CatalogNumber}</p>
            										</div>
                                <div className="col-lg-1 title">
                                {/*
            											<p>{element.Price + ' ₪'}</p>
                                */}
            										</div>
            										<div className="col-lg-3">
            											<div className="flex-container">


                                    <div className="col-lg-3 status sale">
                                    {/*
            													{element.Promoted ?
            														<div onClick={(e) => this.updateItems(null, element.Id, 'Promoted')} className="input active">
            															<img src={globalFileServer + "icons/done.svg"} alt=""/>
            														</div>
            													:
            													<div onClick={(e) => this.updateItems(1, element.Id, 'Promoted')} className="input">
            														<img src={globalFileServer + "icons/cross-bold.svg"} alt=""/>
            													</div>
            													}
                                      */}
            												</div>
            												<div className="col-lg-3 status sale">
                                    {/*

            													{element.SpecialPrice ?
            														<div onClick={(e) => this.updateItems(null, element.Id, 'SpecialPrice')} className="input active">
            															<img src={globalFileServer + "icons/done.svg"} alt=""/>
            														</div>
            													:
            													<div onClick={(e) => this.updateItems(1, element.Id, 'SpecialPrice')} className="input">
            														<img src={globalFileServer + "icons/cross-bold.svg"} alt=""/>
            													</div>
            													}
                                      */}

            												</div>
                                    <div className="col-lg-3 status sale">
                                    {/*

                                      {!element.ActualQuan ?
                                        <div onClick={(e) => this.updateItems(1, element.Id, 'ActualQuan')} className="input active">
                                          <img src={globalFileServer + "icons/done.svg"} alt=""/>
                                        </div>
                                      :
                                      <div onClick={(e) => this.updateItems(null, element.Id, 'ActualQuan')} className="input">
                                        <img src={globalFileServer + "icons/cross-bold.svg"} alt=""/>
                                      </div>
                                      }
                                      */}

                                    </div>
            												<div className="col-lg-3 status">
            													{!element.Unpublished ?
            														<div onClick={(e) => this.updateItems(1, element.Id, 'Unpublished')} className="input active">
            															<img src={globalFileServer + "icons/done.svg"} alt=""/>
            														</div>
            													:
            													<div onClick={(e) => this.updateItems(null, element.Id, 'Unpublished')} className="input">
            														<img src={globalFileServer + "icons/cross-bold.svg"} alt=""/>
            													</div>
            													}
            												</div>
            												<div className="col-lg-3 delete">
                                    {/*
            													<div className="img" onClick={e => this.deleteItem(element.Id)}>
            														<img src={globalFileServer + "icons/trash.svg"} alt=""/>
            													</div>
                                    */}
            												</div>
            											</div>
            										</div>
            									</div>
                            </div>
                          )}
  						 					</Draggable>
      								</div>
      							);
      						})}
                </div>
                )}
              </Droppable>
            </DragDropContext>
          </div>
				</div>
			</div>
		)
	}
}
