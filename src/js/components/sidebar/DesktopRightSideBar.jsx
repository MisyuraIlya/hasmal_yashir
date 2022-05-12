import React, { useEffect } from 'react';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './DesktopRightSideBar.scss'
import RightSideBarAccordion from './RightSideBarAccordion';

const DesktopRightSideBar = ({categories, toggleDesktopRightSideBar, desktopRightSideBar}) => {

  const [cat, setCat] = useState([])
  const authSidebar = [
    {id:1, name:'כניסה / הרשמה', url:''},
    {id:2, name:'עגלת הזמנות', url:''},
    {id:3, name:'צור קשר', url:''},
    {id:4, name:'תקנון', url:''},
    {id:5, name:'הצהרת נגישות', url:''},
  ]
  const sidebarName = [
    {id:3, name:'כלי עבודה', url:'/category/52/0/0/0'},
    {id:4, name:'ציוד מיתוג', url:'/category/1/0/0/0'},
    {id:5, name:'כבלים וחיווט',url:'/category/62/0/0/0'},
  ]
  const secondSideBarName =[
    {id:6, name:'שקעים ומחברים', url:'/category/78/0/0/0'},
    {id:7, name:'תאורה', url:'/category/4/0/0/0' },
    {id:8, name:'אינסטלציה חשמלית', url:'/category/50/0/0/0'},
    {id:11, name:'בואו נדבר', url:''}
  ]

  let lvl1 = categories.filter(item => item.LvlNumber == '1')


  // let parentCategory = categories.filter(item => item.Id == this.props.match.params.lvl1)[0];
  // let childCategory = categories.filter(item => item.Id == this.props.match.params.lvl2)[0];
  // let subChildCategory = categories.filter(item => item.Id == this.props.match.params.lvl3)[0];
  // console.log(parentCategory, childCategory, subChildCategory)

  return (
    <div className={`sidebar_desktop ${desktopRightSideBar == true ? 'active' : ''}`}>
      <img className='sidebar_desktop_mask' src={globalFileServer + '/sidebar/rightSideBarBg.png'} />
      <img className='sidebar_desktop_bg' src={globalFileServer + '/sidebar/maskRightSideBar.png'} />


      <div className='right_sidebar_content'>
      <div className="sd-header_desktop">
        <div className="btn btn-primary" onClick={toggleDesktopRightSideBar}><i className="fa fa-times"><img src={globalFileServer + 'header/mobile/sidebarButton.png'} /></i></div>
      </div>
        <div className="sd-body_desktop_right ">
          <ul>

              {authSidebar.map((i,index) => 
                  <li><NavLink to={i.url}key={index} className="sd-link">{i.name}</NavLink></li>
              )}
          </ul>
        </div>

        <div className="sd-body_desktop_center">
          <ul>
              <span><NavLink to='/category-page/0/0/0'  className="yellow_cat">קטגוריות מוצרים</NavLink></span>
              {lvl1.length > 0 
                ?lvl1.map((i,index) => 
                <RightSideBarAccordion  categories={categories} key={index} item={i}/>
                )
                : null
              }
              
          </ul>
        </div>
        {/* <div className='sd-body_desktop_left'>
            <ul>
             {secondSideBarName.map((i,index) => 
              <div className='right_side_bar_desktop_dropwon'>
                <li><NavLink to={i.url}key={index} className="sd-link">{i.name}</NavLink></li>
                <div className="dropdown_icon " style={{width:'20%'}}>
                    <i className='bx bxs-chevron-down'></i>
                </div>
              </div>
              )}
          </ul>
        </div> */}
      </div>


    </div>
  );
};

export default DesktopRightSideBar;