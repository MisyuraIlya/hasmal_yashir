import React from 'react';

const SearchModal = ({filteredProducts, globalFileServer, searchFilter}) => {
    
    console.log(globalFileServer)

    const products = [
        {id:1, title:'נורה ליבון',number:'112 סוגים',img:''},
        {id:2, title:'נורה ליבון',number:'112 סוגים',img:''},
        {id:3, title:'נורה ליבון',number:'112 סוגים',img:''},
        {id:4, title:'נורה ליבון',number:'112 סוגים',img:''},
        {id:5, title:'נורה ליבון',number:'112 סוגים',img:''},
    ]

    const sortedProducts = products.filter(title => title.title.includes(searchFilter))

    return (
        <div className='search_filter_container'>
            {filteredProducts.map((i) => 
                <div className='flex-container filtered_product_row'>
                    <div className='col-lg-6 filtered_info_product'>
                    <span>
                        {i.Title}
                    </span>
                    <p>{i.CatalogNumber}</p>
                    </div>

                    <div className='col-lg-6 image_filtered_product'>
                    {i.ImgLink ?  <img src={i.ImgLink} /> : <img src={globalFileServer + 'placeholder.jpg'} /> }
                    </div>
                    <div className='line_product'></div>
                </div>
            )}
        </div>
    );
};

export default SearchModal;