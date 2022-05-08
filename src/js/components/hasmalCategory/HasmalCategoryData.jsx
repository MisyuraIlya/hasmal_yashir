import React from 'react';
import HasmalCategoryDataLeft from './hasmalCategoryDataLeft/HasmalCategoryDataLeft';
import HasmalCategoryDataRight from './hasmalCategoryDataRight/HasmalCategoryDataRight';

const HasmalCategoryData = () => {

  const data = ['תאורה פנים חוץ וגן חירום']

  const subData = [
    {id:1, title:'תאורת הכוונה והתראה'},
    {id:2, title:'תאורה מגונת אש'},
    {id:3, title:'תאורה להפסקות חשמל'},
  ]

  const products = [
    {id:1, title:'ג"ת פולס צמוד קיר', title2:'bosh GSR 10.8V-LI', makat:'0512345678'},
    {id:2, title:'ג"ת פולס צמוד קיר', title2:'bosh GSR 10.8V-LI', makat:'0512345678'},
    {id:3, title:'ג"ת פולס צמוד קיר', title2:'bosh GSR 10.8V-LI', makat:'0512345678'},
    {id:4, title:'ג"ת פולס צמוד קיר', title2:'bosh GSR 10.8V-LI', makat:'0512345678'},
    {id:5, title:'ג"ת פולס צמוד קיר', title2:'bosh GSR 10.8V-LI', makat:'0512345678'},
    {id:6, title:'ג"ת פולס צמוד קיר', title2:'bosh GSR 10.8V-LI', makat:'0512345678'},
    {id:7, title:'ג"ת פולס צמוד קיר', title2:'bosh GSR 10.8V-LI', makat:'0512345678'},
    {id:8, title:'ג"ת פולס צמוד קיר', title2:'bosh GSR 10.8V-LI', makat:'0512345678'},
    {id:9, title:'ג"ת פולס צמוד קיר', title2:'bosh GSR 10.8V-LI', makat:'0512345678'},
    {id:10, title:'ג"ת פולס צמוד קיר', title2:'bosh GSR 10.8V-LI', makat:'0512345678'},
    {id:11, title:'ג"ת פולס צמוד קיר', title2:'bosh GSR 10.8V-LI', makat:'0512345678'},

  ]
  return (
    <div className='hasmalCategory_data_container'>
      <div className='flex-container'>
        <div className='hasmalCategory_data_right'>
          <HasmalCategoryDataRight data={data} subData={subData}/>
        </div>
        <div className='hasmalCategory_data_left'>
          <HasmalCategoryDataLeft products={products}/>
        </div>
      </div>
    </div>
  );
};

export default HasmalCategoryData;