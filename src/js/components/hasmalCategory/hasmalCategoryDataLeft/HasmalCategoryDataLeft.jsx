import React from 'react';
import './HasmalCategoryDataLeft.scss'
const HasmalCategoryDataLeft = ({products}) => {
  return (
    <div className='flex-container'>
      {products.map((i) => 
        <div className='card'>
          <div className='card_content'>
            <div className='image_content'>
              <p>brand logo</p>
              <img src={globalFileServer + 'category/data/love.png'}  className='love_image'/>
              <img src={globalFileServer + 'category/data/product.png'} />
            </div>

            <div className='card_title'>
                <div>
                  <h4>{i.title}</h4>
                  <h4>{i.title2}</h4>
                  <p>מק"ט {i.makat}</p>
                  <div className='show_more'>
                    <p>פרטים</p>
                  </div>
                </div>
            </div>
            
          </div>
        </div>
        )}
    </div>
  );
};

export default HasmalCategoryDataLeft;