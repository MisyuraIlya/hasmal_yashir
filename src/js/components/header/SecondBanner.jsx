import React from 'react';

const SecondBanner = ({globalFileServer}) => {
  return (
    <div className='container_banner'>
      <img src={globalFileServer + 'home/secondBanner/banner2.png'} />
      <h1>חדש בפולוס!<br/> ג"ת ניסתרים לפאנלים ביתיים </h1>
      <a href=''>+ עוד על פולס</a>

        <div className='button_mobile'>
          <button>+ לינק ליעד</button>
        </div>


    </div>
  );
};

export default SecondBanner;