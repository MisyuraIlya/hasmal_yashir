import React from 'react';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';

const RightSideBarAccordion = ({toggleDesktopRightSideBar, categories, item}) => {
  const [active, setActive] = useState(false)
  const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
  let filteredData = categories.filter(item => item.LvlNumber == '2' )
  const lvl2 = filteredData.filter((i) => i.ExtId.split(specialChars)[0] === item.Title)

  return (
    <div className={`right_side_bar_desktop_dropwon ${active ? 'active ' : ''}`}>
      <div className='card_container_dropwon'>
        <div className='card_container'>
          <li ><NavLink to={`/category/${item.Id}/0/0/0`} onClick={toggleDesktopRightSideBar} className="sd-link">{item.Title}</NavLink></li>
          <div className="right_side_bar_desktop_dropwon_icon " style={{width:'20%'}} onClick={() => setActive(!active)}>
              <i className='bx bxs-chevron-down'></i>
          </div>
        </div>
      <div className="right_side_bar_desktop_dropwon__content">
             {lvl2.map((i) => 
              <NavLink to={`/category/${i.ParentId}/${i.Id}/0/0`} onClick={toggleDesktopRightSideBar}><h2>{i.Title}</h2></NavLink>
             )}
      </div>
      </div>

    </div>
  );
};

export default RightSideBarAccordion;