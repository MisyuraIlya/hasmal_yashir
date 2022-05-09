import React from 'react';

const AnotherProduct = () => {

  const anotherData = [
    {id:1, img:'', title:'ג"ת פולס צמוד קיר', engTitle:'Bosh GSR 10.8V-Li'},
    {id:2, img:'', title:'ג"ת פולס צמוד קיר', engTitle:'Bosh GSR 10.8V-Li'},
    {id:3, img:'', title:'ג"ת פולס צמוד קיר', engTitle:'Bosh GSR 10.8V-Li'}
  ]

  return (
    <div className=''>
      <img src={globalFileServer + 'category/modal/anotherProductBanner.png'} className='right_modal_lupa_image'/>
      <h1>עוד ממשפחת המוצר</h1>
      <div className='flex-container another_proudct_section'>
          {anotherData.map((i) => 
            <div className='another_product_card'>
              <div className='annother_product_img_cont'>
                <img src={globalFileServer + 'category/data/product.png'} />
              </div>
              <div className='another_prodcut_card_cont'>
                <div className='another_product_card_font'>
                <h2>{i.title}</h2>
                <h2>{i.engTitle}</h2>
                </div>
              </div>
            </div>
          )}
      </div>
    </div>
  );
};

export default AnotherProduct;