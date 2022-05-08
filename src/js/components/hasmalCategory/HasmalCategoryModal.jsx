import React from 'react';
import './HasmalCategoryModal.scss'
import HasmalCategoryModalLeft from './hasmalCategoryModalLeft/HasmalCategoryModalLeft';
import HasmalCategoryModalRight from './hasmalCategoryModalRight/HasmalCategoryModalRight';
const HasmalCategoryModal = ({ dataProduct, dataImages, categoryModalIsOpen, onClose }) => {

  if (!categoryModalIsOpen) return null


  return (
    <>
      <div className='category_modal_container' onClick={onClose} />
      <div className='category_modal_styles' >
        <div className='flex-container'>
          <div className='images_category_right'>
            <HasmalCategoryModalRight dataImages={dataImages}/>
          </div>
          <div className='description_category_left'>
            <HasmalCategoryModalLeft dataProduct={dataProduct}/>
          </div>
        </div>
      </div>
    </>
  );
};

export default HasmalCategoryModal;