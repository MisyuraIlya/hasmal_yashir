import React, { useEffect, useState } from 'react';

const CategoryLabel = ({handleCheckedLabel, getAllLables}) => {

  let DataLable = getAllLables()
  // const [state, setState] = useState([])

  // const handleChecked = (e) => {
  //   const isChecked = e.target.checked;
  //   const nameValue = e.target.value;
  //   const labelData = {isChecked, nameValue}
  //   if(isChecked == false){
  //     const deletData = nameValue
  //     const filtered = state.filter((i) => i.nameValue !== deletData)
  //     setState(filtered)
  //   } else {
  //     setState([...state, labelData])
  //   }
  
  // }

  return (
    <div className='category_label_component'>
      {
        [...DataLable].map((i) => 
          <div className='category_label_container'>
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