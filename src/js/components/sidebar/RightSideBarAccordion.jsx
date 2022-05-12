import React from 'react';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';

const RightSideBarAccordion = ({categories, item}) => {
  const [active, setActive] = useState(false)
  
  return (
    <div className={`right_side_bar_desktop_dropwon ${active ? 'active ' : ''}`}>
      <div className='card_container_dropwon'>
        <div className='card_container'>
          <li onClick={() => setActive(!active)}><NavLink to={item.url} className="sd-link">{item.name}</NavLink></li>
          <div className="right_side_bar_desktop_dropwon_icon " style={{width:'20%'}}>
              <i className='bx bxs-chevron-down'></i>
          </div>
        </div>
      <div className="right_side_bar_desktop_dropwon__content">
             hgel
      </div>
      </div>

    </div>
  );
};

export default RightSideBarAccordion;