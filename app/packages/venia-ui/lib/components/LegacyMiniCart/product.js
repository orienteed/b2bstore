import React, { useMemo } from 'react';
import { array, func, number, shape, string } from 'prop-types';

import Image from '../Image';
import Kebab from './kebab';
import Price from '@magento/venia-ui/lib/components/Price';
import ProductOptions from './productOptions';
import Section from './section';

import { transparentPlaceholder } from '@magento/peregrine/lib/util/images';
import { useProduct } from '@magento/peregrine/lib/talons/LegacyMiniCart/useProduct';
import { useStyle } from '../../classify';
import { useAdapter } from '@magento/peregrine/lib/hooks/useAdapter';

import defaultClasses from './product.module.css';

const QUANTITY_OPERATOR = '×';

const PRODUCT_IMAGE_WIDTH = 80;

const Product = props => {
    const { beginEditItem, currencyCode, item } = props;
    const { removeItemFromCart: removeItemFromCartFromAdapter } = useAdapter();

    const talonProps = useProduct({
        beginEditItem,
        item,
        removeItemFromCartFromAdapter
    });

    const {
        handleEditItem,
        handleFavoriteItem,
        handleRemoveItem,
        isFavorite,
        isLoading,
        productImage,
        productName,
        productOptions,
        productPrice,
        productQuantity
    } = talonProps;

    const classes = useStyle(defaultClasses, props.classes);

    const productImageComponent = useMemo(() => {
        const imageProps = {
            alt: productName,
            classes: { image: classes.image, root: classes.imageContainer },
            width: PRODUCT_IMAGE_WIDTH
        };

        if (!productImage) {
            imageProps.src = transparentPlaceholder;
        } else {
            imageProps.resource = productImage;
        }

        return <Image {...imageProps} />;
    }, [classes.image, classes.imageContainer, productImage, productName]);

    const mask = isLoading ? <div className={classes.mask} /> : null;

    return (
        <li className={classes.root}>
            {productImageComponent}
            <div className={classes.name}>{productName}</div>
            <ProductOptions options={productOptions} />
            <div className={classes.quantity}>
                <div className={classes.quantityRow}>
                    <span>{productQuantity}</span>
                    <span className={classes.quantityOperator}>{QUANTITY_OPERATOR}</span>
                    <span className={classes.price}>
                        <Price currencyCode={currencyCode} value={productPrice} />
                    </span>
                </div>
            </div>
            {mask}
            <Kebab>
                <Section text="Add to favorites" onClick={handleFavoriteItem} icon="Heart" isFilled={isFavorite} />
                <Section text="Edit item" onClick={handleEditItem} icon="Edit2" />
                <Section text="Remove item" onClick={handleRemoveItem} icon="Trash" />
            </Kebab>
        </li>
    );
};

Product.propTypes = {
    beginEditItem: func.isRequired,
    currencyCode: string,
    item: shape({
        image: shape({
            file: string
        }),
        name: string,
        options: array,
        price: number,
        qty: number
    }).isRequired
};

export default Product;
