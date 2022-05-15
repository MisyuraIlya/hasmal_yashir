import React, { useState } from 'react';
import SearchModal from '../searchModal/SearchModal';
import { useDebounce } from 'use-debounce';


const DesktopFilterInput = () => {

  const [searchFilter, setSearchFilter] = useState('')
  const [text, setText] = useState('Hello');
  const [value] = useDebounce(text, 1000);

  return (
    <>
      <div className="input_banner">
      <div className="search_container">
          <form>
              <input 
              value={text} 
              // onChange={(e) => setSearchFilter(e.target.value)} 
              type='text' 
              placeholder='מוצר/מק"ט/תחום' 
              className='search_input'
              defaultValue={'Hello'}
              onChange={(e) => {
                setText(e.target.value);
              }} 
              />
              <button type="submit" className="search_button"><img  src={ globalFileServer + 'home/banner/lupa.png' } alt=""/></button>
          </form>
        </div>
      </div>

      <div className="filter_container">
        {searchFilter == '' 
        ? null
        :<SearchModal globalFileServer={globalFileServer} searchFilter={searchFilter}/>
        }
      </div>

      {searchFilter == '' 
      ? <div>
          <h2 className="title_banner_main">כותרת באנר רשאית בעמוד הבית</h2>
          <div className="banner_btn">
            <button>+ לינק ליעד</button>
          </div>
        </div>
      : null
      }

        <p>Actual value: {text}</p>
        <p>Debounce value: {value}</p>

    </>
  );
};

export default DesktopFilterInput;