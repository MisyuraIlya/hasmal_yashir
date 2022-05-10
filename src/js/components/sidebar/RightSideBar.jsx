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
    <div className="sd-header">
        <div className="btn btn-primary" onClick={toggleRightSideBar}><i className="fa fa-times">X</i></div>
    </div>
    <div className="sd-body">
        <ul>
            {sidebarName.map((i,index) => 
                <li><NavLink to={i.url}key={index} className="sd-link">{i.name}</NavLink></li>
            )}
        </ul>
    </div>
</div>
<div className={`sidebar-overlay ${rightSideBar == true ? 'active' : ''}`} onClick={toggleRightSideBar}></div>
        </>
    );
};

export default RightSideBar;




{/* <div className="container-fluid mt-3">
                
<nav className="navbar navbar-expand-lg navbar-light bg-white shadow-md">
    <div className="container-fluid p-2">
        <a className="navbar-brand text-primary mr-0">Company Logo</a>
        <div className="form-inline ml-auto">
            <div className="btn btn-primary" onClick={ToggleSidebar} >
                <i className="fa fa-bars"></i>
            </div>
        </div>
    </div>
</nav>
<div className={`sidebar ${isOpen == true ? 'active' : ''}`}>
    <div className="sd-header">
        <h4 className="mb-0">Sidebar Header</h4>
        <div className="btn btn-primary" onClick={ToggleSidebar}><i className="fa fa-times"></i></div>
    </div>
    <div className="sd-body">
        <ul>
            <li><a className="sd-link">Menu Item 1</a></li>
            <li><a className="sd-link">Menu Item 2</a></li>
            <li><a className="sd-link">Menu Item 3</a></li>
            <li><a className="sd-link">Menu Item 4</a></li>
            <li><a className="sd-link">Menu Item 5</a></li>
            <li><a className="sd-link">Menu Item 6</a></li>
            <li><a className="sd-link">Menu Item 7</a></li>
            <li><a className="sd-link">Menu Item 8</a></li>
        </ul>
    </div>
</div>
<div className={`sidebar-overlay ${isOpen == true ? 'active' : ''}`} onClick={ToggleSidebar}></div>
</div> */}