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
                  {variaionData.Title ? <span>{variaionData.Title}</span> : null}
                </div>
                <div>
                  {variaionData.EngDesc ? <span>{variaionData.EngDesc}</span> : null}
                </div>
                <div>
                  {variaionData.CatalogNumber ?  <span>מק"ט: {variaionData.CatalogNumber}</span> : null}
                </div>
                <div>
                  {variaionData.Series ? <span>יצרן: {variaionData.Series}</span> : null}
                </div>
                <div>
                  {variaionData.RatedImpulse ? <span>דרוג: {variaionData.RatedImpulse}</span> : null}
                </div>
                <div>
                  {variaionData.CurveCode ? <span>קוד: {variaionData.CurveCode}</span> : null}
                </div>
                <div>
                  {variaionData.Poles ? <span>מוטות: {variaionData.Poles}</span> : null}
                </div>
            </div>
            <div>
              {variaionData.PdfLink ? <a href={variaionData.PdfLink}>מפרט טכני</a> : null}
            </div>
        </div>    
      </div>
    </div>
  );
};

export default VariationProduct;