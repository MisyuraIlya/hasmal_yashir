import React from 'react';
import './HasmalCategoryDataRight.scss'
const HasmalCategoryDataRight = ({data, subData}) => {
  console.log(data)
  return (
    <div className='rightCategory'>
      <h2>{data}</h2>
      <div className='subCategory'>
        {subData.map((i) => 
        <div>
        <input  key={i.id} type="checkbox"/>
        <span>{i.title}</span>
        </div>
        )}
      </div>
        
      <div className='filtered_content'>
        <h3>אביזרים לתאורה</h3>
        <h3>נורות</h3>
      </div>

      <div className='filtered_content'>
        <h3>מותג 1</h3>
        <h3>מותג 2</h3>
        <h3>מותג 3</h3>
        <h3>מותג 4</h3>
      </div>


      <div className='filtered_content'>
        <h3>פילטר סוג 1</h3>
        <h3>פילטר סוג 2</h3>
        <h3>פילטר סוג 3</h3>
      </div>

    </div>
  );
};

export default HasmalCategoryDataRight;