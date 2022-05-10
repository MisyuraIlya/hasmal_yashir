import React, { useEffect, useState } from 'react';

const CategoryLabel = ({tmpProducts}) => {


  const allLables = tmpProducts.map((i) => {return i.Extra1} )
  const filteredSpecialCharacter = allLables.map((i) => i.split('#'))
  const filteredExist = new Set([].concat(...filteredSpecialCharacter))


  const s = new Set([1,2,3,4]);

  const a = [...filteredExist].map( n => console.log(n))



  return (
    <div className='category_label_component'>
      {
        [...filteredExist].map((i) => 
          <div className='category_label_container'>
            <div className='category_label'>
              <input type='checkbox'/>
              <span>{i}</span>
            </div>
          </div>
        )
      }
    </div>
  );
};

export default CategoryLabel;