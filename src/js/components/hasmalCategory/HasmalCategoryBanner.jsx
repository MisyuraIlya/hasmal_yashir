import React from 'react';

const HasmalCategoryBanner = () => {
  return (
    <div className='category_container'>
      <div className='category_banner'>
        <img src={ globalFileServer + 'category/categorybg.png'}/>
        <div className='category_banner_inside'> 
          <h1>תאורה</h1>
          <img src={ globalFileServer + 'category/categorybgmask.png'}/>
        </div>
      </div>
    </div>
  );
};

export default HasmalCategoryBanner;