import React from 'react';
import { useStyle } from '@magento/venia-ui/lib/classify';
import defaultClasses from './recommendedProducts.module.css';
import ArrowRight from './Icon/arrow-right.svg';
import ProductCard from './ProductCard';

const recommendedProducts = props => {
    const classes = useStyle(defaultClasses, props.classes);
    return (
        <div className={classes.mainWrapper}>
            <div className={classes.flex}>
                <span className={classes.headerText}>Recommended products</span>
                <button className={classes.showBtn}>
                    Show all recommended products
                    <img src={ArrowRight} />
                </button>
            </div>
            <ProductCard/>
        </div>
    );
};

export default recommendedProducts;
