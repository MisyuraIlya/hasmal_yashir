import React from 'react';

const HasmalFooter = () => {
  return (
    <>
    <div className='main_footer'>
      <div className='flex-container main_footer'> 
        
        <div className='col-lg-6 right_footer'>

        <img src={globalFileServer + 'footer/footerMask.png'} />
          <div className='footer_container_right'>
              <img src={globalFileServer + 'footer/logoFooter.png'} />
            
            <div className='right_footer_description'>
              <p>חשמל ישיר הנה מהוותיקות והגדולות בענף החשמל בישראל. מאז 1983 אנחנו עוסקים בשיווק ובאספקת ציוד וחומרי חשמל לתעשייה, לקבלני חשמל וללקוחות פרטיים. חשמל ישיר מציעה לענפי התעשייה השונים פתרונות המותאמים לדרישת הלקוח, ידע המבוסס על ניסיון ארוך טווח והיכרות עם תנאי שטח. לחשמל ישיר חוג לקוחות רחב ועליו נמנים מפעליי תעשייה, קבלני חשמל, מוסדות ציבור, חברות בנייה, רשויות מקומיות וקהל לקוחות פרטיים.</p>
              <p>
  איכות בשירות: חשמל ישיר עומדת באופן עיקבי ביעדי המכירות של ספקיה, ועל כן מדורגת כחברה המובילה בתחומה. הנהלת החברה דוגלת ברכישת מגוון מוצרים איכותיים, אשר יתנו מענה הולם לצורכי הלקוחות.</p>
            </div>

            <div className='right_footer_icons'>
            <img src={globalFileServer + 'footer/Instagram.png'} />
            <img src={globalFileServer + 'footer/\Linkedin.png'} />
            <img src={globalFileServer + 'footer/Facebook.png'} />
            </div>
          </div>

        </div>


        <div className='col-lg-6 left_footer'>
          <div className='footer_container'>
            <h2>אוקיי, בואו נדבר</h2>
            <form>
              <input placeholder='*שם מלא' className='long_input'/>
              <div className='flex-container'>
                <div className='col-lg-6'>
                  <input placeholder='חברה/ שם עסק' className='short_input'/>
                  <input placeholder='טלפון' className='short_input'/>
                </div>

                <div className='col-lg-6'>
                <select className='short_select'>
                    <option value="" disabled >הסניף שלי</option>
                    <option value="hurr">1</option>
                </select>
                <input placeholder='דוא"ל' className='short_input'/>
                </div>
              </div>
              <input placeholder='באיזה נושא נוכל לעזור?' className='long_input'/>
              <button>שלח</button>
            </form>
          </div>
        </div>
      </div>
    </div>

    {/* mobile footer */}
      <div className='mobile_first_footer'>
            <h1>אוקיי, בואו נדבר</h1>
            <div className='mobile_input_section'>
              <div className='mobile_inputs'>
                <input type='text' placeholder='* שם מלא'/>
                <input type='text' placeholder='חברה / שם העסק'/>
                <input type='text' placeholder='* הסניף שלי'/>
                <input type='text' placeholder='* טלפון' />
                <input type='text' placeholder='דוא"ל'/>
                <input type='text' placeholder='באיזה נושא נוכל לעזור?'/>
              </div>
            </div>
            <div className='flex-container'>
              <div className='col-lg-6 mobile_first_down'>
                <button>שלח</button>
              </div>
              <div className='col-lg-6 mobile_first_icons'>
                <img src={globalFileServer + 'footer/Instagram.png'} />
                <img src={globalFileServer + 'footer/\Linkedin.png'} />
                <img src={globalFileServer + 'footer/Facebook.png'} />
              </div>
            </div>
      </div>

      <div className='mobile_second_footer'>
          <div className='second_mobile_container'>
            <img src={globalFileServer + 'footer/logoFooter.png'} />
          </div>
          <div className='second_mobile_description'>
            <p>
              חשמל ישיר הנה מהוותיקות והגדולות בענף החשמל בישראל. מאז 1983 אנחנו עוסקים בשיווק ובאספקת ציוד וחומרי חשמל לתעשייה, לקבלני חשמל וללקוחות פרטיים. חשמל ישיר מציעה לענפי התעשייה השונים פתרונות המותאמים לדרישת הלקוח, ידע המבוסס על ניסיון ארוך טווח והיכרות עם תנאי שטח. לחשמל ישיר חוג לקוחות רחב ועליו נמנים מפעליי תעשייה, קבלני חשמל, מוסדות ציבור, חברות בנייה, רשויות מקומיות וקהל לקוחות פרטיים.
            </p>
            <p>
              איכות בשירות: חשמל ישיר עומדת באופן עיקבי ביעדי המכירות של ספקיה, ועל כן מדורגת כחברה המובילה בתחומה. הנהלת החברה דוגלת ברכישת מגוון מוצרים איכותיים, אשר יתנו מענה הולם לצורכי הלקוחות. 
            </p>
          </div>
          <img src={globalFileServer + 'footer/footerMask.png'} />
      </div>
    </>
  );
};

export default HasmalFooter;