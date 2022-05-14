import React from 'react';
import './SearchMobileInput.scss'
const SearchMobileInput = () => {
    return (
        <div className='flex-container category_mobile_search'>
        <div className='category_mobile_search_icon col-lg-2'>
            <img src={globalFileServer + 'category/modal/categoryLupa.png'}/>
        </div>
        <div className='category_mobile_search_input col-lg-10'>
            <input placeholder='ג״ת פולס צמוד_'/>
        </div>
    </div>
    );
};

export default SearchMobileInput;