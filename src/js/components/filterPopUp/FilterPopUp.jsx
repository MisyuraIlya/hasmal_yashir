import React from 'react';
import './FilterPopUp.scss'
const FilterPopUp = () => {


  return (
    <div className='FilterPopUp_title_container'>
      <div className='FilterPopUp_title'><h1>מיון לפי</h1></div>
      <div>
        <input type='checkbox'/>
        <span>מותג</span>
      </div>
      <div>
        <input type='checkbox'/>
        <span>מחיר (מהנמוך לגבוה)</span>
      </div>
      <div>
        <input type='checkbox'/>
        <span>מחיר (מהגבוה לנמוך)</span>
      </div>
      <div>
        <input type='checkbox'/>
        <span>אחר</span>
      </div>
      <div className='FilterPopUp_button_container'> 
          <button className='FilterPopUp_button_enter'>אישור</button>
          <button className='FilterPopUp_title_cancel'>ביטול</button>
      </div>
    </div>
  );
};

export default FilterPopUp;