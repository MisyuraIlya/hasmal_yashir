import React from 'react';

const LogInOne = ({globalFileServer, closeUserLoginModal}) => {
    return (
        <div className='login_modal'>
            	<img src={globalFileServer + 'header/mobile/mobile_auth_mobile.png'} />
            <span onClick={closeUserLoginModal} className='close_login_modal'>סגור</span>
            <div className='login_container'>
                <h2>כניסה אל האזור האישי</h2>
                <input placeholder='* אימייל'></input>
                <input placeholder='* מספר טלפון'></input>
                <button><span>שלח</span></button>
            </div>
        </div>
    );
};

export default LogInOne;