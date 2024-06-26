import React, { useEffect, useState } from 'react';

const CategoryLabel = ({handleCheckedLabel, getAllLables}) => {

  let DataLable = getAllLables()


  return (
    <div className='category_label_component'>
      {
        [...DataLable].map((i,index) => 
          <div className='category_label_container' key={index}>
            <div className='category_label'>
              <input 
                type='checkbox'
                value={i}
                onChange={handleCheckedLabel}
              />
              <span>{i}</span>
            </div>
          </div>
        )
      }
    </div>
  );
};

export default CategoryLabel;