import React from 'react';

const LogInTwo = () => {
    return (
        <div className='login_modal'>
            <img src={globalFileServer + 'header/mobile/mobile_auth_mobile.png'} />
            <span className='close_login_modal'>סגור</span>
            <div className='login_container'>
                <h2>הזן את הקוד שנשלח אליך</h2>
                <input placeholder=''></input>
                <br/>
                <div className='login_request_container'>
                    <span className='login_request_again'>לא קיבלתי קוד, שלחו לי שוב</span>
                </div>
                <button><span>שלח</span></button>
            </div>
        </div>
    );
};

export default LogInTwo;