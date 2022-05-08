import React, { useState } from 'react';
import './MyZoneAccordion.scss'

const MyZoneAccordion = (props) => {

    const [active, setActive] = useState(false)
    return (
        <div className={`accordion ${active ? 'active ' : ''}`}>
            <div className="flex-container accordion__title" onClick={() => setActive(!active)}>
                <div className='col-lg-4 accordion_id'>
                    <span className=''>{props.indificator}</span>
                </div>
                <div className={`col-lg-4  ${active ? 'myzone_card_devider_active ' : 'myzone_card_devider'}`}>
                    <span>{props.date}</span>
                </div>
                <div className={`col-lg-4  ${active ? 'myzone_card_devider_active ' : 'myzone_card_devider'}`}>
                    <div className='flex-container'>
                         <div className='col-lg-6' style={{width:'80%'}}>
                            <span>{props.status}</span>
                        </div>
                        <div className="accordion__icon col-lg-6" style={{width:'20%'}}>
                            <i className='bx bxs-chevron-down'></i>
                        </div>
                    </div>
                </div>
            </div>
            <div className="accordion__content">
                {props.products.map((i) => 
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
                    )}
                    <div className='flex-container myzone_zone_card_form'>
                        <div className='col-lg-6'><span>סמן הכל</span></div>
                        <div className='col-lg-6 myzone_zone_button'><button>הוסף לסל</button></div>
                    </div>                    
            </div>
        </div>
    );
};

export default MyZoneAccordion;