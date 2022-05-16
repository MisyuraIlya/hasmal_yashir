import React from 'react';

const PreLoader = () => {
  return (
    <div>
			<div className="spinner-wrapper">
				<div className="spinner">
					<div className="bounce1"></div>
					<div className="bounce2"></div>
					<div className="bounce3"></div>
				</div>
			</div>
    </div>
  );
};

export default PreLoader;