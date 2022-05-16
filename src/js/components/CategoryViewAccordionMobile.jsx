import React from 'react';
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
const CategoryViewAccordionMobile = ({allCat, element}) => {

    const [active, setActive] = useState(false)
    const specialChars = /[`!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~]/;
    let filteredData = allCat.filter(item => item.LvlNumber == '2' )
    const lvl2 = filteredData.filter((i) => i.ExtId.split(specialChars)[0] === element.Title)

    return (
        <div className={`category_view_accordion ${active ? 'active' : ''}`}>
            
            <div className=''>
                {console.log(element)}
                    <div className='category_view_accordion_card' onClick={() => setActive(!active)}>
                        <NavLink to={`/category/${element.Id}/0/0/0`}>
                            <h2>{element.Title}</h2>
                        </NavLink>
                        <div className="category_view_accordion_icon"  onClick={() => setActive(!active)}>
                            <i className='bx bxs-chevron-left'></i>
                        </div>
                    </div>
                <div className='category_view_accordion_content'>
                {lvl2.map((i,index) => 
                <NavLink key={index} to={`/category/${i.ParentId}/${i.Id}/0/0`} ><h2>{i.Title}</h2></NavLink>
                )}
                </div>
            </div>
        </div>
    );
};

export default CategoryViewAccordionMobile;