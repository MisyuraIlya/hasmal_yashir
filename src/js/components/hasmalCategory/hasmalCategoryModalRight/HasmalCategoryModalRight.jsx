import React from 'react';
import './HasmalCategoryModalRight.scss'

const HasmalCategoryModalRight = ({dataImages}) => {
  return (
    <div className='right_modal_category'>
        <div className='right_modal_main_image'>
          <img src={globalFileServer + 'category/modal/categoryLupa.png'} className='right_modal_lupa_image'/>
          <img src={globalFileServer + 'category/data/product.png'} />
        </div>    
        <div className='flex-container'>
        {dataImages.map((i) => 
          <div className=' subImages'>
            <img src={i.img} />
          </div>
        )}
        </div>
        <h5>מפרט טכני</h5>

    </div>
  );
};

export default HasmalCategoryModalRight;