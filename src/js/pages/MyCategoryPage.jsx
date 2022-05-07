import React from 'react';
import CategoryModal from '../components/categoryModal/CategoryModal';
import LogoMedias from '../components/tools/LogoMedias';
import HasmalFooter from '../components/footer/HasmalFooter';
import RecommendedMonth from '../components/header/RecommendedMonth';
const MyCategoryPage = () => {
    return (
        <div>
            <CategoryModal/>
            <RecommendedMonth globalFileServer={globalFileServer}/>
            <LogoMedias/>
            <HasmalFooter/>
        </div>
    );
};

export default MyCategoryPage;