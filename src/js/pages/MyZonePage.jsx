import React, { useState } from 'react';
import MyZone from '../components/MyZone';
import LogoMedias from '../components/tools/LogoMedias';
import HasmalFooter from '../components/footer/HasmalFooter';
const MyZonePage = () => {

    
    const hasbonit = [
        {id:1, indificator:'2998', date:'12/8/21', status:'סופק'},
        {id:2, indificator:'123456', date:'12/8/21', status:'סופק'},
        {id:3, indificator:'123466', date:'12/8/21', status:'בוטל'},
        {id:4, indificator:'123', date:'12/8/21', status:'ממתין לאיסוף'},
        {id:5, indificator:'123', date:'12/8/21', status:'סופק'},
        {id:6, indificator:'123', date:'12/8/21', status:'סופק'},
    ]

    const products = [
        {id:1, imf:'', title:'שם המוצר', body:'נתונים נוספים על המוצר מקט ועוד', desc:'פירוט וריאנטים, כמויות וכיו״ב'},
        {id:2, imf:'', title:'שם המוצר', body:'נתונים נוספים על המוצר מקט ועוד', desc:'פירוט וריאנטים, כמויות וכיו״ב'},
        {id:3, imf:'', title:'שם המוצר', body:'נתונים נוספים על המוצר מקט ועוד', desc:'פירוט וריאנטים, כמויות וכיו״ב'},
        {id:4, imf:'', title:'שם המוצר', body:'נתונים נוספים על המוצר מקט ועוד', desc:'פירוט וריאנטים, כמויות וכיו״ב'},
        {id:5, imf:'', title:'שם המוצר', body:'נתונים נוספים על המוצר מקט ועוד', desc:'פירוט וריאנטים, כמויות וכיו״ב'},
        {id:6, imf:'', title:'שם המוצר', body:'נתונים נוספים על המוצר מקט ועוד', desc:'פירוט וריאנטים, כמויות וכיו״ב'},
        {id:7, imf:'', title:'שם המוצר', body:'נתונים נוספים על המוצר מקט ועוד', desc:'פירוט וריאנטים, כמויות וכיו״ב'},
        {id:8, imf:'', title:'שם המוצר', body:'נתונים נוספים על המוצר מקט ועוד', desc:'פירוט וריאנטים, כמויות וכיו״ב'},
    ]
    

    const currentUser = 'אריאל'

    const [active, setActive] = useState(false)
    const [visible, setVisible] = useState(2)

    const showeMore = () => {
        setVisible((prev) => prev + 3);
    }
    return (
        <div>
            <MyZone 
            active={active}
            setActive={setActive}
            hasbonit={hasbonit.slice(0,visible)} 
            products={products} 
            currentUser={currentUser} 
            showeMore={showeMore}
            />
            <LogoMedias/>
            <HasmalFooter/>
        </div>
    );
};

export default MyZonePage;