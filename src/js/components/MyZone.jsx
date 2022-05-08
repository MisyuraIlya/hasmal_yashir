import React from 'react';
import MyZoneAccordion from './myzone/accordion/MyZoneAccordion';
import 'boxicons/css/boxicons.min.css';
const MyZone = ({globalFileServer, isOpen, hasbonit, products, currentUser, showeMore}) => {
    // console.log(openSelectedCard)
    

    return (
        <div className='myzone_container'>
            <div className='myzone_container_center'>

                <div className='myzone_user_info'>
                    <h1>שלום {currentUser},</h1>
                    <h4>אלו ההזמנות שלך עד היום</h4>
                </div>

                <div className='myzone_zone_container'>

                    <div className='myzone_zone_menu'>
                        <div> 
                            <span>כרטסת</span>
                        </div>
                        <div>
                            <span>קבלות</span>
                        </div>
                        <div>
                            <span>חשבונית מס מרכזת</span>
                        </div>
                        <div className='myzone_zone_menu_selected'>
                            <span>חשבונית מס</span>
                        </div>
                        <div>
                            <span>הזמנות</span>
                        </div>
                    </div>

                    <div className='myzone_zone_entire'>
                        <div className='flex-container myzone_zone_calender'>
                            <div className='col-lg-4'>
                                <div className='myzone_calender'>
                                <span>23/11/2019</span>
                                    <div className='myzone_calender_icon'><img src={globalFileServer + 'myzone/calender.png'}/></div>
                                </div>
                            </div>
                            <div className='col-lg-4'>
                                <div className='myzone_calender'>
                                    <span>תאריך</span> 
                                    <div className='myzone_calender_icon'><img src={globalFileServer + 'myzone/calender.png'}/></div>
                                </div>
                            </div>
                            <div className='col-lg-4 myzone_calender_button' >
                                <button>עדכן</button>
                            </div>
                        </div>

                        <div className='myzone_zone_title'>
                            <div>מזהה</div>
                            <div>תאריך</div>
                            <div>סטטוס</div>
                        </div>

                        <div className='myzone_card_container'>
                            {
                                hasbonit.map((item, index) => 
                                    <MyZoneAccordion
                                        key={index}
                                        isOpen={isOpen}
                                        indificator = {item.indificator}
                                        date = {item.date}
                                        status = {item.status}
                                        products = {products}
                                    />
                                )
                            }

                        </div>
                    </div>

                    <div className='myzone_showmore'>
                        <span onClick={showeMore}>הצג עוד</span>
                    </div>

                </div>

 

            </div>
        </div>
    );
};

export default MyZone;