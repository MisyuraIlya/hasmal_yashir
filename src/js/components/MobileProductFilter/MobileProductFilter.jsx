import React from 'react';
import FilterPopUp from '../filterPopUp/FilterPopUp';
import { useState } from 'react';

const MobileProductFilter = ({filterPopUp, handleFilterPopUp}) => {
  
  // const [popUp, setPopUp] = useState(false)
  
  // const hanglePopuP = () => {
  //   setPopUp(!popUp)
  // }

  return (
    <div onClick={handleFilterPopUp}>
      <h2>הצג לפי: מותג</h2>
    </div>
  );
};

export default MobileProductFilter;