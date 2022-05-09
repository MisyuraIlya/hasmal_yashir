import React from 'react';

const AnotherProduct = () => {

  const anotherData = [
    {id:1, img:'', title:'ג"ת פולס צמוד קיר', engTitle:'Bosh GSR 10.8V-Li'},
    {id:2, img:'', title:'ג"ת פולס צמוד קיר', engTitle:'Bosh GSR 10.8V-Li'},
    {id:3, img:'', title:'ג"ת פולס צמוד קיר', engTitle:'Bosh GSR 10.8V-Li'}
  ]

  return (
    <div className='another_container'>
      <div className='another_container_banner_image'>
        <img src={globalFileServer + 'category/modal/anotherProductBanner.png'} className='right_modal_lupa_image'/>
      </div>
      <div className='abother_container_content_card'>
        <div className='another_title'>
          <h1>עוד ממשפחת המוצר</h1>
        </div>
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
        <div className='another_title'>
          <h1>יכול להיות שגם אחד מהמוצרים הללו יעניין אותך</h1>
        </div>
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
    </div>
  );
};

export default AnotherProduct;