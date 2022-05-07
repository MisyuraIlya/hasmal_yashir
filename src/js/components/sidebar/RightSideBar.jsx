import React from 'react';
import { NavLink } from 'react-router-dom';
import './RightSideBar.scss'


const RightSideBar = ({rightSideBar}) => {
    const sidebarName = [
        {id:1, name:'כניסה / הרשמה'},
        {id:2, name:'כל הקטגוריות'},
        {id:3, name:'כלי עבודה'},
        {id:4, name:'ציוד מיתוג'},
        {id:5, name:'כבלים וחיווט'},
        {id:6, name:'שקעים ומחברים'},
        {id:7, name:'תאורה'},
        {id:8, name:'אינסטלציה חשמלית'},
        {id:9, name:'תקנון'},
        {id:10, name:'הצהרת נגישות'},
        {id:11, name:'בואו נדבר'}
    ]
    return (
        <>
        {rightSideBar 
        ? 
        <div className='right_sidebar_container'>
            <div>
                <img src='/#'/>
            {/* <img src='/#'/> */}
                <ul className='right_sidebar_items'>
                    {sidebarName.map((item, index) => 
                    <>
                        <li key={index}>
                            <NavLink  to={"/docs"}>
                                {item.name}
                            </NavLink>
                        </li>
                        <hr class="right_sidebar_divider"/>
                    </>
                    )}
                </ul>
            </div>
         </div>
    
        : null}

        </>
    );
};

export default RightSideBar;