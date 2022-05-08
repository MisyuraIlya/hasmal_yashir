import React from 'react';
import HasmalCategoryBanner from '../components/hasmalCategory/HasmalCategoryBanner';
import LogoMedias from '../components/tools/LogoMedias';
import HasmalFooter from '../components/footer/HasmalFooter';
import HasmalCategoryData from '../components/hasmalCategory/HasmalCategoryData';
// import HasmalCategoryModal from '../components/hasmalCategory/HasmalCategoryModal';
const HasmalCategoryPage = () => {


  return (
    <div>
      <HasmalCategoryBanner/>
      {/* <HasmalCategoryModal/> */}
      <HasmalCategoryData/>
      <LogoMedias/>
      <HasmalFooter/>
    </div>
  );
};

export default HasmalCategoryPage;