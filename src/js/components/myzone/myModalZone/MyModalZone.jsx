import React from 'react';
import './MyModalZone.scss'

const MODAL_STYLES = {
  position: 'fixed',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  backgroundColor: '#FFF',
  padding: '50px',
  zIndex: 1000
}




const MyModalZone = ({ open, children, onClose }) => {
  if (!open) return null
  return (
    <>
    <div className='myModal_zone_container'  />
    <div className='myModal_zone_modal' >
      <button onClick={onClose}>Close Modal</button>
      {children}
    </div>
    </>
  );
};

export default MyModalZone;