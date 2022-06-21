import React from 'react';
import { useStyle } from '@magento/venia-ui/lib/classify';

import Image from '@magento/venia-ui/lib/components/Image';
import { Trash2 } from 'react-feather';
import Icon from '@magento/venia-ui/lib/components/Icon';
import { Price } from '@magento/peregrine';
import AddToCartbutton from '@magento/venia-ui/lib/components/Gallery/addToCartButton';
import WishlistGalleryButton from '@magento/venia-ui/lib/components/Wishlist/AddToListButton';

import defaultClasses from './ProductCard.module.css';

const ProductCard = ({ item, deleteProduct }) => {
    const { name, price } = item;
    const { minimalPrice } = price;
    const classes = useStyle(defaultClasses);
    const imageProps = { alt: name, src: item.small_image.url, width: 400 };

    const addToCart = <AddToCartbutton item={item} urlSuffix={item.url_suffix} />;
    return (
        <div className={classes.root} data-cy="compareProducts-root">
            <Image {...imageProps} />
            <div className={classes.actionWrap}>
                <span className={classes.name} data-cy="compareProducts-productName">
                    {name}
                </span>{' '}
                <button
                    className={classes.deleteItem}
                    onClick={()=>deleteProduct(item.sku)}
                    data-cy="compareProducts-deleteItem"
                >
                    <Icon size={16} src={Trash2} />
                </button>
            </div>
            <div className={classes.priceContainer} data-cy="compareProducts-priceContainer">
                As low as <Price currencyCode={minimalPrice.amount.currency} value={minimalPrice.amount.value} />
            </div>
            <div className={classes.actionsContainer}>
                {addToCart}
                <WishlistGalleryButton item={{ sku: item.sku, quantity: 1 }} />
            </div>
        </div>
    );
};

export default ProductCard;
