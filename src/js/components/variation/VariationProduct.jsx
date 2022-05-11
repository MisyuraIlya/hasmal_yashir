import React, { useEffect, useState } from 'react';

const VariationProduct = ({variaionData, numberOfVariation}) => {

  const [active, setActive] = useState(false)


  return (
    <div className={`variation_accordion ${active ? 'active ' : ''}`}>
      <div className="flex-container " onClick={() => setActive(!active)}>
          <span>{variaionData.Title}</span>
          <div className="variation_accordion__icon" >
              <i className='bx bxs-chevron-down'></i>
          </div>
      </div>
      <div className="variation_accordion__content">
        <div className='flex-container variation_card_info_container'>
            <div className='col-lg-4'>
                <img src={variaionData.ImgLink} />
            </div>
            <div className='col-lg-8'>
                <div>
                    <span>{variaionData.Title}</span>
                </div>
                <div>
                    <span>{variaionData.EngDesc}</span>
                </div>
                <div>
                  <span>מק"ט {variaionData.CatalogNumber}</span>
                </div>
            </div>
            <div>
                <a href={variaionData.PdfLink}>מפרט טכני</a>
            </div>
        </div>    
      </div>
    </div>
  );
};

export default VariationProduct;