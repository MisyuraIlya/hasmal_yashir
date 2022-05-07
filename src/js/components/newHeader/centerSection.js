import React from 'react';
import { NavLink, useHistory } from "react-router-dom";

const centerSection = () => {
    return (
        <div>
        {
            window.innerWidth > 1000 
            ?	<NavLink to={'/home/' + lang}>
                    <img src={lang == 'he' ? globalFileServer + 'logo.png' : globalFileServer + 'enlogo.png'} alt=""/>
                </NavLink>
            :	null
        }
        {/* <img src={globalFileServer + 'icons/main-logo1.png'} /> */}
        </div>
    );
};

export default centerSection;