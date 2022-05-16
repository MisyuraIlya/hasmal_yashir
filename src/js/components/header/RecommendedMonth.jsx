import React, { useEffect, useState } from 'react';

const RecommendedMonth = ({randomPromotedData, promotedData, globalFileServer}) => {

  const specialEvnet = globalFileServer + 'home/recomendedMonth/specialevent.png'
  return (
    <div className='container_recommenedMonth'>
        <div className='title_recommendedMonth'>
          <h1>המומלצים של החודש</h1>
        </div>

        <div className="container recomendedMonth_desktop">
          { randomPromotedData.map((i, index) => 
          <div className='card_recommendedMonth' key={index}>
            <div className="event-box">

              <div className='event-border'>
                <div className='special_event'>
                  <img src={specialEvnet}/>
                  {/* what is the special event table in data base? */}
                  <span className='special_event_special'>+ הנחה ייחודית</span>
                  <span className='special_event_new'>{i.newEventTitle}</span>
                </div>
                  <img src={i.ImgLink} className='event_img'/>
              </div>

              <div className='content-info'>
                <p className="event-text">{i.Title}</p>
                <p>{i.EngDesc}</p>
                <p>מק"ט {i.CatalogNumber}</p>
              </div>

            </div>
          </div>
          )}
        </div>



      {/* mobile */}
      <div className=' recommended_mobile'>
        <div className="flex-container">
          {randomPromotedData.map((i,index) =>
            <div className='col-lg-6 recomended_info_mobile' key={index}>

              <div className='mobile_recomended_image'>
                  {/* <div className='mobile_special_event'>
                    <img src={i.specialEvent}/>
                    <span className='mobile_special_event_special'>{i.specialEventTitle}</span>
                    <span className='mobile_special_event_new'>{i.newEventTitle}</span>
                  </div> */}
                <img src={i.ImgLink} className='event-img'/>
              </div>

              <div className='mobile_recomended_body'>
                <h3>{i.Title}</h3>
                <p>{i.EngDesc}</p>
                <p>{i.CatalogNumber}</p>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecommendedMonth;

// getRandomProduct = () => {
//   const random = this.state.tmpProducts[Math.floor(Math.random() * this.state.tmpProducts.length)];
//   return random;
// }