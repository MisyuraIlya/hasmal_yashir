import React from 'react';

const LogInOne = ({closeUserLoginModal}) => {
    return (
        <div className='login_modal'>
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