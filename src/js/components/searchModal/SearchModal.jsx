import React from 'react';
import { NavLink } from 'react-router-dom';
const SearchModal = ({filteredProducts, globalFileServer, searchFilter}) => {
    


        // const sortedProducts = products.filter(title => title.title.includes(searchFilter))
        //to={`/category/${PrimaryMenuItemId}/${SecondaryMenuItemId}/${ThirdMenuItemId}/${CatalogNumber}`}
    return (
        <div className='search_filter_container'>
            {filteredProducts.map((i) => 
            <NavLink to={`/category/${i.PrimaryMenuItemId}/${i.SecondaryMenuItemId}/${i.ThirdMenuItemId}/${i.CatalogNumber}`}>
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
            )}
        </div>
    );
};

export default SearchModal;