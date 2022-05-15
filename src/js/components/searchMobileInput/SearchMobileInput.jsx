import React, { useEffect, useState, useMemo } from 'react';
import SearchModal from '../searchModal/SearchModal';
import './SearchMobileInput.scss'
import { useDebounce } from 'use-debounce';

const SearchMobileInput = ({filteredProducts,getFilteredProducts}) => {

    const [searchFilter, setSearchFilter] = useState('')
    const [value] = useDebounce(searchFilter, 1000);
  
  
    useMemo(() => {
      getFilteredProducts(value)
    },[value])
  
    return (

    <div className="search_container_mobile">
        <input 
        type='text' 
        placeholder='מוצר/מק"ט/תחום'
        className='search_input_mobile'
        // defaultValue={'Hello'}
        onChange={getFilteredProducts} 
         />
        <button type="submit" className="search_button_mobile"><img src={globalFileServer + 'category/modal/categoryLupa.png'}/></button>

    </div>
    );
};

export default SearchMobileInput;