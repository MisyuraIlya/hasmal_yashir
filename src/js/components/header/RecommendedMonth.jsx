import React from 'react';

const RecommendedMonth = ({globalFileServer}) => {
  const img1 = globalFileServer + 'home/recomendedMonth/item1.png'
  const img2 = globalFileServer + 'home/recomendedMonth/item2.png'
  const img3 = globalFileServer + 'home/recomendedMonth/item3.png'
  const specialEvnet = globalFileServer + 'home/recomendedMonth/specialevent.png'

  const testArray = [
    {id:1, title:'מברדה/ מקדחה ליתיום בוש', body:'Bosch GSR 10.8V-LI', makat:'מק"ט 0512345678' ,img:img1, specialEvent:specialEvnet, newEventTitle:'', specialEventTitle:'+ הנחה ייחודית'},
    {id:2, title:'ג"ת פולס צמוד קיר', body:'Bosch GSR 10.8V-LI', makat:'מק"ט 0512345678' ,img:img1, specialEvent:specialEvnet, newEventTitle:'+ חדש באתר', specialEventTitle:'' },
    {id:3, title:'ברדה/ מקדחה ליתיום בוש', body:'Bosch GSR 10.8V-LI', makat:'מק"ט 05123456789' ,img:img2, specialEvent:'', newEventTitle:'', specialEventTitle:''},
    {id:4, title:'ברדה/ מקדחה ליתיום בוש', body:'Bosch GSR 10.8V-LI', makat:'מק"ט 05123456789' ,img:img3, specialEvent:'', newEventTitle:'', specialEventTitle:''},
    {id:5, title:'ברדה/ מקדחה ליתיום בוש', body:'Bosch GSR 10.8V-LI', makat:'מק"ט 05123456789' ,img:img3, specialEvent:specialEvnet, newEventTitle:'+ חדש באתר', specialEventTitle:''},
    {id:6, title:'ברדה/ מקדחה ליתיום בוש', body:'Bosch GSR 10.8V-LI', makat:'מק"ט 05123456789' ,img:img3, specialEvent:'', newEventTitle:'',specialEventTitle:''}
  ]
  return (
    <div className='container_recommenedMonth'>
        <div className='title_recommendedMonth'>
          <h1>המומלצים של החודש</h1>
        </div>
        <div className="container recomendedMonth_desktop">
          {testArray.map((i, index) => 
          <div className='card' key={index}>
            <div className="event-box">

              <div className='event-border'>
                <div className='special_event'>
                  <img src={i.specialEvent}/>
                  <span className='special_event_special'>{i.specialEventTitle}</span>
                  <span className='special_event_new'>{i.newEventTitle}</span>
                </div>
                  <img src={i.img} className='event-img'/>
              </div>

              <div className='content-info'>
                <h3 className="event-text">{i.title}</h3>
                <p>{i.body}</p>
                <p>{i.makat}</p>
              </div>

            </div>
          </div>
          )}
        </div>


      {/* mobile */}
      <div className=' recommended_mobile'>
        <div className="flex-container">
          {testArray.map((i,index) =>
            <div className='col-lg-6 recomended_info_mobile' key={index}>

              <div className='mobile_recomended_image'>
                  <div className='mobile_special_event'>
                    <img src={i.specialEvent}/>
                    <span className='mobile_special_event_special'>{i.specialEventTitle}</span>
                    <span className='mobile_special_event_new'>{i.newEventTitle}</span>
                  </div>
                <img src={i.img} className='event-img'/>
              </div>

              <div className='mobile_recomended_body'>
                <h3>{i.title}</h3>
                <p>{i.body}</p>
                <p>{i.makat}</p>
              </div>

            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RecommendedMonth;