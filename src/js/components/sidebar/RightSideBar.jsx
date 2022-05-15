import React from 'react';
import { NavLink } from 'react-router-dom';
import './RightSideBar.scss'


const RightSideBar = ({toggleRightSideBar, rightSideBar}) => {
    const sidebarName = [
        {id:1, name:'כניסה / הרשמה', url:''},
        {id:2, name:'כל הקטגוריות', url:'/category-page/0/0/0'},
        {id:3, name:'כלי עבודה', url:'/category/52/0/0/0'},
        {id:4, name:'ציוד מיתוג', url:'/category/1/0/0/0'},
        {id:5, name:'כבלים וחיווט',url:'/category/62/0/0/0'},
        {id:6, name:'שקעים ומחברים', url:'/category/78/0/0/0'},
        {id:7, name:'תאורה', url:'/category/4/0/0/0' },
        {id:8, name:'אינסטלציה חשמלית', url:'/category/50/0/0/0'},
        {id:9, name:'תקנון', url:''},
        {id:10, name:'הצהרת נגישות', url:''},
        {id:11, name:'בואו נדבר', url:''}
    ]
    return (
        <>
<div className={`sidebar ${rightSideBar == true ? 'active' : ''}`}>
<img src={globalFileServer + 'header/mobile/sidebarbg.png'} />
    <div className="sd-header">
        <div className="btn btn-primary" onClick={toggleRightSideBar}><i className="fa fa-times"><img src={globalFileServer + 'header/mobile/sidebarButton.png'} /></i></div>
    </div>
    <div className="sd-body">
        <ul>
            {sidebarName.map((i,index) => 
                <li key={index}><NavLink to={i.url}  className="sd-link">{i.name}</NavLink></li>
            )}
        </ul>
    </div>
</div>
<div className={`sidebar-overlay ${rightSideBar == true ? 'active' : ''}`} onClick={toggleRightSideBar}></div>
        </>
    );
};

export default RightSideBar;



