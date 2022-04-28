import { useStyle } from '@magento/venia-ui/lib/classify';
import React from 'react';
import defaultClasses from './productCard.module.css';
import FavIcon from './Icon/fav.svg';
import trueIcon from './Icon/true.svg';
import NotFoundIcon from './Icon/notFound.svg';
import ShareIcon from './Icon/share.svg';
import CompareIcon from './Icon/compare.svg';
const ProductCard = ({ item }) => {
    const classes = useStyle(defaultClasses);
    console.log(item, 'itemitem');
    const { small_image, stock_status, price_range, name } = item;
    return (
        <div>
            <div className={classes.imgWrapper}>
                <img className={classes.image} src={small_image.url} />
                {/* <div className={classes.discountWrapper}> //We do not have this feature yet 
                    <span>15%</span>
                </div> */}
                {/* <div className={classes.favWrapper}> //We do not have this feature yet 
                    <button>
                        <img src={FavIcon} />
                    </button>
                </div> */}
                <div className={classes.stokeWrapper}>
                    {stock_status != 'IN_STOCK' ? (
                        <span className={classes.outStock}>
                            <img src={NotFoundIcon} /> Out of stock
                        </span>
                    ) : (
                        <span className={classes.inStock}>
                            <img src={trueIcon} /> In stock
                        </span>
                    )}
                </div>
                {/* <div className={classes.shareWrapper}>  // We do not have this feature yet 
                    <button>
                        <img src={CompareIcon} />
                    </button>
                    <button>
                        <img src={ShareIcon} />
                    </button>
                </div> */}
            </div>
            <div className={classes.cardContent}>
                <p className={classes.productInfo}>Good home | part No. 235652</p>
                <p className={classes.productName}>{name}</p>
                <p className={classes.price}>
                    your price {price_range.maximum_price.regular_price.currency === 'EUR' ? '€ ' : '$ '}
                    {price_range.maximum_price.regular_price.value}
                </p>
            </div>
        </div>
    );
};

export default ProductCard;
