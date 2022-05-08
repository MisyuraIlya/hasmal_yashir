import React from 'react';
import { useState } from 'react';
const HasmalCategoryBanner = ({categories, parentCategory}) => {
  categories.length ? console.log('yes') : console.log('null');
  return (
    <div className='category_container'>
      <div className='category_banner'>
        <img src={ globalFileServer + 'category/categorybg.png'}/>
        <div className='category_banner_inside'>
          {
            categories.length 
            ? <h1>{parentCategory.Title}</h1>
            : null
          }

          <img src={ globalFileServer + 'category/categorybgmask.png'}/>
        </div>
      </div>
    </div>
  );
};

export default HasmalCategoryBanner;