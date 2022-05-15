import React, { useEffect } from 'react';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import './DesktopRightSideBar.scss'
import RightSideBarAccordion from './RightSideBarAccordion';

const DesktopRightSideBar = ({ categories, toggleDesktopRightSideBar, desktopRightSideBar}) => {

  const authSidebar = [
    {id:1, name:'כניסה / הרשמה', url:''},
    {id:2, name:'עגלת הזמנות', url:''},
    {id:3, name:'צור קשר', url:''},
    {id:4, name:'תקנון', url:''},
    {id:5, name:'הצהרת נגישות', url:''},
  ]

  let lvl1 = categories.filter(item => item.LvlNumber == '1')
  let splitedLvl1One= lvl1.slice(0,4)
  let splitedLvl1Second = lvl1.slice(4,9)

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
                  <li key={index} ><NavLink to={i.url}className="sd-link">{i.name}</NavLink></li>
              )}
          </ul>
        </div>
        <div className="sd-body_desktop_center">
          <ul className='split_ul_right_desktop'>
              <span><NavLink to='/category-page/0/0/0'  className="yellow_cat">קטגוריות מוצרים</NavLink></span>
              {splitedLvl1One.length > 0 
                ?splitedLvl1One.map((i,index) => 
                <RightSideBarAccordion toggleDesktopRightSideBar={toggleDesktopRightSideBar} categories={categories} key={index} item={i}/>
                )
                : null
              }
              
          </ul>
        </div>
        <div className='sd-body_desktop_left'>
        <ul className='split_ul_right_desktop'>
              {splitedLvl1Second.length > 0 
                ?splitedLvl1Second.map((i,index) => 
                <RightSideBarAccordion toggleDesktopRightSideBar={toggleDesktopRightSideBar} categories={categories} key={index} item={i}/>
                )
                : null
              }
              
          </ul>
        </div>
      </div>


    </div>
  );
};

export default DesktopRightSideBar;