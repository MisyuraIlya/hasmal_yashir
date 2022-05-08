import React from 'react';
import './HasmalCategoryModalLeft.scss'

const HasmalCategoryModalLeft = ({dataProduct}) => {

  return (
    <div className=''>
      {dataProduct.map((i) =>
      <>
        <h2>{i.title}</h2>
        <h4>{i.title2}</h4>
        <h4>מק"ט {i.makat}</h4>
      </>
      )}
    </div>
  );
};


export default HasmalCategoryModalLeft;