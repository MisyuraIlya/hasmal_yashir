import React, { useState } from 'react';
import HasmalCategoryBanner from '../components/hasmalCategory/HasmalCategoryBanner';
import LogoMedias from '../components/tools/LogoMedias';
import HasmalFooter from '../components/footer/HasmalFooter';
import HasmalCategoryData from '../components/hasmalCategory/HasmalCategoryData';
import HasmalCategoryModal from '../components/hasmalCategory/HasmalCategoryModal';

const HasmalCategoryPage = () => {

  const [categoryModalIsOpen, setcategoryModalIsOpen] = useState(false)

  const imagess = globalFileServer + 'category/data/product.png';
  const dataImages = [
    {id:1, img:imagess},
    {id:2, img:imagess},
    {id:3, img:imagess},
    {id:4, img:imagess},
  ]

  const dataProduct = [
    {id:1, title:'ג"ת פולס צמוד קיר', title2:'Bosh GSR 10.8V-LI', makat:'0512345678'}
  ]
  return (
    <div>
      <HasmalCategoryBanner/>
      <div  onClick={() => console.log('clicked')}>
        <button onClick={() => setcategoryModalIsOpen(true)}>Open Modal</button>
        <HasmalCategoryModal dataProduct={dataProduct} dataImages={dataImages} categoryModalIsOpen={categoryModalIsOpen} onClose={() => setcategoryModalIsOpen(false)}/>
      </div>
      <HasmalCategoryData/>
      <LogoMedias/>
      <HasmalFooter/>
    </div>
  );
};

export default HasmalCategoryPage;