import React from 'react';
import { useState } from 'react';
const LoveProduct = () => {
  const [active, setActive] = useState(false)
  return (
    <div>
      {active
      ? <img src={globalFileServer + 'category/data/click_love.png'}  className='love_image'  onClick={() => setActive(!active)}/>
      
    
      : <img src={globalFileServer + 'category/data/love.png'}  className='love_image' onClick={() => setActive(!active)}/>
      }
    </div>
  );
};

export default LoveProduct;