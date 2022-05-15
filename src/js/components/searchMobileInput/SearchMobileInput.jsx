import React, { useState } from 'react';
import './SearchMobileInput.scss'
import { useDebounce } from 'use-debounce';

const SearchMobileInput = () => {

    const [text, setText] = useState('Hello');
    const [value] = useDebounce(text, 1000);

    return (

    <div className="search_container_mobile">
        <input 
        type='text' 
        placeholder='מוצר/מק"ט/תחום'
        className='search_input_mobile'
        defaultValue={'Hello'}
        onChange={(e) => {
          setText(e.target.value);
        }} 
         />
        <button type="submit" className="search_button_mobile"><img src={globalFileServer + 'category/modal/categoryLupa.png'}/></button>
        <p>Actual value: {text}</p>
        <p>Debounce value: {value}</p>
    </div>
    );
};

export default SearchMobileInput;