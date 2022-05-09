import React, { useState } from 'react';

const VariationProduct = ({numberOfVariation}) => {

  const [active, setActive] = useState(false)
  return (
    <div className={`variation_accordion ${active ? 'active ' : ''}`}>
      <div className="flex-container " onClick={() => setActive(!active)}>
          <span>וריאציית מוצר {numberOfVariation}</span>
          <div className="variation_accordion__icon" >
              <i className='bx bxs-chevron-down'></i>
          </div>
      </div>
      <div className="variation_accordion__content">
        <span>content</span>
          {/* {props.products.map((i) => 
              <>
                  <div className='myzone_zone_card_info_container'>
                      <input type='checkbox'/>
                      <div>
                          <img src={globalFileServer + 'home/recomendedMonth/item1.png'} />
                      </div>
                      <div>
                          <h5>{i.title}</h5>
                      </div>
                      <div>
                          <span>{i.body}</span>
                      </div>
                      <div>
                          <span>{i.desc}</span>
                      </div>
                  </div>    
                  <hr class="myzone_zone_zard_devider"></hr>
              </>                      
              )} */}                 
      </div>
    </div>
  );
};

export default VariationProduct;