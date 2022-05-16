import React from 'react';
import { NavLink } from 'react-router-dom';
import PreLoader from '../loader/PreLoader';
const SearchModal = ({loader, filteredProducts, globalFileServer, searchFilter}) => {
        console.log(loader)
        // const sortedProducts = products.filter(title => title.title.includes(searchFilter))
        //to={`/category/${PrimaryMenuItemId}/${SecondaryMenuItemId}/${ThirdMenuItemId}/${CatalogNumber}`}
        console.log(filteredProducts.length > 0)
    return (
        <div className='search_filter_container'>

            {loader 
            ? <PreLoader/>
        
            :
            filteredProducts.length > 0 
            ?             filteredProducts.map((i) => 
                <NavLink to={`/category/${i.PrimaryMenuItemId}/${i.SecondaryMenuItemId}/${i.ThirdMenuItemId}/${encodeURIComponent(i.CatalogNumber)}`}>
                    <div className='flex-container filtered_product_row'>
                        <div className='col-lg-6 filtered_info_product'>
                        <span>
                            {i.Title}
                        </span>
                        <p>{i.CatalogNumber}</p>
                        </div>
    
                        <div className='col-lg-6 image_filtered_product'>
                        {i.ImgLink ?  <img src={i.ImgLink} /> : <img src={globalFileServer + 'placeholder.jpg'} /> }
                        </div>
                        <div className='line_product'></div>
                    </div>
                </NavLink>
                )
            : <div className='search_filter_container_null'><h3>לא נמצאו פריטים</h3></div>
            }
            
        </div>
    );
};

export default SearchModal;