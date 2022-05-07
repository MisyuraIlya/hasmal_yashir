import React, { Component, Fragment, useState, useEffect, useContext  } from 'react';
import { NavLink, useParams } from "react-router-dom";
import UserContext from '../../UserContext';

const SecondLevel = params => {
  const [active, setActive] = useState(false);
  const app = useContext(UserContext);
  let params2 = useParams();
  let { lvl1, lvl2, lvl3} = params2;

  useEffect(() => {
    setActive(params.childCategory.Id);
  }, []);

  const toggleActive = (id) => {
    if(id == active){
      setActive(false);
    }else{
      setActive(id);
    }
  }

  let element = params.element;
  let child = params.child;

  return(
    <div className="col">

      <NavLink to={'/category/' + params.parentCategory.Id + "/" + params.element.Id + "/0/" + app.state.lang}>
        <h3 className={element.Id == params.childCategory.Id ? "active" : null} onClick={()=> toggleActive(element.Id)}>{params.app.state.lang == "he" ? element.Title : element.CompanyId}</h3>
      </NavLink>
      <ul className={active == element.Id ? "active" : null}>
        {child.map((el, ind) => {

          return (
            <li key={ind}>
              <NavLink className={params.subChildCategory ? el.Id == params.subChildCategory.Id ? 'active-a' : null : null} to={'/category/' + params.parentCategory.Id + "/" + params.element.Id + "/" + el.Id + "/" + app.state.lang}>{params.app.state.lang == "he" ? el.Title : el.CompanyId}</NavLink>
            </li>
          );
        })}
      </ul>
    </div>
  )
}

const CategorySlide = params => {

  const [open, setOpen] = useState(false);
  const [categoryPop, setCategoryPop] = useState(false);



  const app = useContext(UserContext);
  let params2 = useParams();
  let { lvl1, lvl2, lvl3} = params2;

  let parentCategory = app.state.categories.filter(item => item.Id == lvl1)[0];
  let childCategory = app.state.categories.filter(item => item.Id == lvl2)[0];
  let subChildCategory = app.state.categories.filter(item => item.Id == lvl3)[0];
  let lvl1Categories = app.state.categories.filter(item => item.LvlNumber == '1');

  let firstLvl2 = false;
  if(lvl1Categories && lvl1Categories.length > 0){
    lvl1Categories.map((element,ind) => {
      firstLvl2 = app.state.categories.filter(item => item.LvlNumber == '2' && item.ParentId == element.Id)[0];
      if(firstLvl2){
        element.FirstLvl2 = firstLvl2.Id;
      }
    })
  }


  const getSecondLavel = () => {

		let secondLavel = app.state.categories.filter(item => item.LvlNumber=="2" && item.ParentId == lvl1);
		return secondLavel;
	}

    return (
      <div className={open ? "category-slidebar-super-main-cont open" : "category-slidebar-super-main-cont closed"}>
        <div onClick={()=> setOpen(!open)} className="close-cont">
          {open ?
            <img src={globalFileServer + 'icons/close.svg'} />
          :
            <img className="open" src={globalFileServer + 'icons/mobile-filter.svg'} />
          }
        </div>


        <div className="category-slidebar-main-cont">

          <div className="category-slidebar-fixed-cont">

            <div className="category-slidebar-cont">
            {app.state.categories.length ?
              <div className="category-slidebar-subcont">
                  <div className="choose-cat-trigger" onClick={()=> setCategoryPop(!categoryPop)}>
                    <p>לכל המחלקות</p>
                    <img src={globalFileServer + 'icons/down-pink.svg'} alt=""/>
                  </div>
                  <div className="lvl1-title-cont">
                    <img src={parentCategory.Img ? globalFileServer + 'categories/' + parentCategory.Img : globalFileServer + 'logo.png'} />
                    <h1>{parentCategory.Title}</h1>

                    {categoryPop ?
                      <div className="more_cont">
                        <div className="more_cont-header flex-container">
                          <div className="col-lg-10" >
                            <p></p>
                          </div>
                          <div className="close-popup col-lg-2">
                            <div className="close-popup-cont" onClick={()=> setCategoryPop(false)}>
                              <img src={globalFileServer + 'icons/close_purple.svg'} />
                              </div>
                          </div>
                        </div>
                        {lvl1Categories && lvl1Categories.length > 0 ? lvl1Categories.map((catEle,catInd) => {
                          return(
                            <div key={catInd} className="flex-container row" onClick={()=>goToCatLvl1(catEle.Id)}>
                              <NavLink onClick={()=> setCategoryPop(false)} to={'/category/' + catEle.Id.toString() + "/" + catEle.FirstLvl2.toString() + "/0/" + app.state.lang}>
                                <div className="col-lg-1">
                                </div>
                                <div className="col-lg-11">
                                  <p>{catEle.Title}</p>
                                </div>
                              </NavLink>
                            </div>
                          )
                        }):null}
                      </div>
                    :null}
                  </div>
                  <div className="category-list-cont">
                    <div className="category-list-subcont"  onClick={()=> setOpen(!open)}>

                    {getSecondLavel().map((element, index) => {
                      let child = app.state.categories.filter($item => $item.ParentId == element.Id && $item.LvlNumber == "3");

                      if(child){
                        return (
                          <SecondLevel key={index}  app={app} allCategories={app.state.categories} element={element} child={child} parentCategory={parentCategory} childCategory={childCategory} subChildCategory={subChildCategory}/>
                        );
                      }
                    })}

                    </div>
                  </div>

              </div>
              :null}
            </div>
          </div>
        </div>
      </div>
    )

}
export default CategorySlide;
