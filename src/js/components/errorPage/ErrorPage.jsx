import React from 'react';
import './ErrorPage.scss'
const ErrorPage = () => {
  return (
    <div className='error_page_container'>
      <div>
        <img src={globalFileServer + '404.png'} />
        <div className='error_content'>
          <h1>אופס!</h1>
          <h1>העמוד שהגעת אליו לא תקין</h1>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;