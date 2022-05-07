import React from 'react';

const CategoryModal = () => {

    const categoryProduct = [
        {id:1, img:'', title:'תאורה', total:'1204 פריטים'},
        {id:2, img:'', title:'ציוד מחתוג', total:'912 פריטים'},
        {id:3, img:'', title:'אוורור וחימום', total:'312 פריטים'},
        {id:4, img:'', title:'כבלים וחיווט', total:'1026 פריטים'},
        {id:5, img:'', title:'כלי עבודה', total:'1026 פריטים'},
        {id:6, img:'', title:'שקעים ומחברים', total:'312 פריטים'},
        {id:7, img:'', title:'אינסטלציה חשמלית', total:'1026 פריטים'},
        {id:8, img:'', title:'מבצעים', total:'32 פריטים'},
    ]
    return (
        <div className='category_modal'>
            <div className='category_modal_container'>
                <div className='container_category'>
                    <h2>כל קטגוריות המוצרים שלנו</h2>
                </div>
                <div className='container'>
                    {categoryProduct.map((i) => 
                        <div className='card_category'>
                            <div>
                            <img src={globalFileServer + 'home/recomendedMonth/item1.png'} />
                            </div>
                            <div className='button_category_product'>
                                <h3>
                                    {i.title}
                                </h3>
                                <div>{i.total}</div>
                            </div>
                        </div>
                    )}
                </div>
            </div>  
        </div>
    );
};

export default CategoryModal;