import React, { useState } from 'react';
import defaultClasses from './simpleProduct.module.css';
import { useStyle } from '@magento/venia-ui/lib/classify';
import FullPageLoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';
import Price from '@magento/venia-ui/lib/components/Price';
import { FormattedMessage } from 'react-intl';
import { useSimpleProduct } from '../../talons/SimpleProduct/useSimpleProduct';
import WishlistGalleryButton from '@magento/venia-ui/lib/components/Wishlist/AddToListButton';
import { ADD_CONFIGURABLE_MUTATION } from '@magento/peregrine/lib/talons/ProductFullDetail/productFullDetail.gql.ce';
import ErrorView from '../../../../src/components/ErrorView/errorView';
import SimpleProductB2B from './simpleProductB2B';
import SimpleProductB2C from './simpleProductB2C';

const SimpleProduct = props => {
    const classes = useStyle(defaultClasses, props.classes);
    const [quantity, setQuantity] = useState(1);

    const B2B = false;

    const talonProps = useSimpleProduct({
        addConfigurableProductToCartMutation: ADD_CONFIGURABLE_MUTATION
    });
    const { wishlistButtonProps, errorMessage, cartId, handleAddToCart, fetchedData, loading, error } = talonProps;

    const simpleProductData = loading ? null : fetchedData.products.items[0];
    const simpleProductAggregation = loading ? null : fetchedData.products.aggregations;

    const simpleProductAggregationFiltered = loading
        ? null
        : simpleProductAggregation.filter(product => {
              return (
                  product.label !== 'Category' && product.label !== 'Price' && product.label !== 'Material estructura'
              );
          });

    if (loading) {
        return <FullPageLoadingIndicator />;
    }
    if (error) {
        return <ErrorView />;
    }

    const wishlistButton = wishlistButtonProps ? <WishlistGalleryButton {...wishlistButtonProps} /> : null;

    const priceRender =
        simpleProductData.price.regularPrice.amount.value === simpleProductData.price.minimalPrice.amount.value ? (
            <div>
                <p className={classes.productPrice}>
                    <Price
                        currencyCode={simpleProductData.price.regularPrice.amount.currency}
                        value={simpleProductData.price.regularPrice.amount.value}
                    />
                </p>
            </div>
        ) : (
            <div>
                <p className={classes.productOldPrice}>
                    <Price
                        currencyCode={simpleProductData.price.regularPrice.amount.currency}
                        value={simpleProductData.price.regularPrice.amount.value}
                    />
                </p>
                <p className={classes.productPrice}>
                    <Price
                        currencyCode={simpleProductData.price.minimalPrice.amount.currency}
                        value={simpleProductData.price.minimalPrice.amount.value}
                    />
                </p>
            </div>
        );

    const errors = new Map();
    if (errorMessage) {
        Object.keys(ERROR_MESSAGE_TO_FIELD_MAPPING).forEach(key => {
            if (errorMessage.includes(key)) {
                const target = ERROR_MESSAGE_TO_FIELD_MAPPING[key];
                const message = ERROR_FIELD_TO_MESSAGE_MAPPING[target];
                errors.set(target, message);
            }
        });

        if (errorMessage.includes('The current user cannot')) {
            errors.set('form', [
                new Error(
                    formatMessage({
                        id: 'productFullDetail.errorToken',
                        defaultMessage:
                            'There was a problem with your cart. Please sign in again and try adding the item once more.'
                    })
                )
            ]);
        }

        if (errorMessage.includes('Variable "$cartId" got invalid value null')) {
            errors.set('form', [
                new Error(
                    formatMessage({
                        id: 'productFullDetail.errorCart',
                        defaultMessage:
                            'There was a problem with your cart. Please refresh the page and try adding the item once more.'
                    })
                )
            ]);
        }

        if (!errors.size) {
            errors.set('form', [
                new Error(
                    formatMessage({
                        id: 'productFullDetail.errorUnknown',
                        defaultMessage: 'Could not add item to cart. Please check required options and try again.'
                    })
                )
            ]);
        }
    }
    const handleQuantityChange = tempQuantity => {
        setQuantity(tempQuantity);
    };

    const tempTotalPrice =
        simpleProductData.price.regularPrice.amount.value === simpleProductData.price.minimalPrice.amount.value ? (
            <div>
                <p className={classes.productPrice}>
                    <Price
                        currencyCode={simpleProductData.price.regularPrice.amount.currency}
                        value={simpleProductData.price.regularPrice.amount.value * quantity}
                    />
                </p>
            </div>
        ) : (
            <div>
                <p className={classes.productOldPrice}>
                    <Price
                        currencyCode={simpleProductData.price.regularPrice.amount.currency}
                        value={simpleProductData.price.regularPrice.amount.value * quantity}
                    />
                </p>
                <p className={classes.productPrice}>
                    <Price
                        currencyCode={simpleProductData.price.minimalPrice.amount.currency}
                        value={simpleProductData.price.minimalPrice.amount.value * quantity}
                    />
                </p>
            </div>
        );

    const indexTable = (
        <div className={classes.productItemContainer}>
            <p key="imageIndex" className={classes.indexFixed} />

            <p key="skuIndex" className={classes.indexMobileSku}>
                SKU
            </p>
            <div className={classes.categoriesItemList}>
                {simpleProductAggregation.map(category => {
                    if (category.label !== 'Category' && category.label !== 'Price') {
                        return (
                            <p key={category.label} className={classes.indexFixedCategory}>
                                {category.label}
                            </p>
                        );
                    }
                })}
            </div>

            <p key="quantityIndex" className={classes.indexFixed}>
                <FormattedMessage id={'productFullDetailB2B.indexQuantity'} defaultMessage={'Quantity'} />
            </p>
            <p className={classes.titles} key="priceIndex">
                <FormattedMessage id={'productFullDetailB2B.indexUnitPrice'} defaultMessage={'Price / Unit'} />
            </p>
            <p className={classes.titles} key="totalPriceIndex">
                <FormattedMessage id={'productFullDetailB2B.totalPrice'} defaultMessage={'Total Price'} />
            </p>
        </div>
    );

    return B2B ? (
        <SimpleProductB2B
            indexTable={indexTable}
            errors={errors}
            priceRender={priceRender}
            wishlistButton={wishlistButton}
            cartId={cartId}
            handleAddToCart={handleAddToCart}
            simpleProductData={simpleProductData}
            simpleProductAggregation={simpleProductAggregation}
            tempTotalPrice={tempTotalPrice}
        />
    ) : (
        <SimpleProductB2C
            simpleProductData={simpleProductData}
            handleAddToCart={handleAddToCart}
            priceRender={priceRender}
            errors={errors}
            tempTotalPrice={tempTotalPrice}
            wishlistButton={wishlistButton}
            simpleProductAggregationFiltered={simpleProductAggregationFiltered}
        />
    );
};

export default SimpleProduct;
