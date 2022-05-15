import React, { useEffect, useState } from 'react';
import SearchModal from '../searchModal/SearchModal';
import { useDebounce } from 'use-debounce';


const DesktopFilterInput = ({filteredProducts,getFilteredProducts}) => {

  const [searchFilter, setSearchFilter] = useState('')
  const [value] = useDebounce(searchFilter, 1000);
  console.log(value)
  const functionQuery = getFilteredProducts(value)
  // const [filteredData, setFilteredData] = useState([])
  // console.log(filteredProducts)
  // console.log(getFilteredProducts)
  
  // const fetchData = async () => {
  //   const data = await getFilteredProducts(value)
  //   setFilteredData(data)
  // }

  // useEffect(() => {
  //   fetchData()
  // }, [value])
  // // const response = getFilteredProducts(value)
  // console.log(filteredData)
  return (
    <>
      <div className="input_banner">
      <div className="search_container">
          <form>
              <input 
              value={searchFilter} 
              // onChange={(e) => setSearchFilter(e.target.value)} 
              type='text' 
              placeholder='מוצר/מק"ט/תחום' 
              className='search_input'
              // defaultValue={'Hello'}
              onChange={(e) => setSearchFilter(e.target.value)} 
              />
              <button type="submit" className="search_button"><img  src={ globalFileServer + 'home/banner/lupa.png' } alt=""/></button>
          </form>
        </div>
      </div>

      <div className="filter_container">
        {searchFilter == '' 
        ? null
        :<SearchModal filteredProducts={filteredProducts} globalFileServer={globalFileServer} searchFilter={searchFilter}/>
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

        {/* <p>Actual value: {text}</p>
        <p>Debounce value: {value}</p> */}

    </>
  );
};

export default DesktopFilterInput;