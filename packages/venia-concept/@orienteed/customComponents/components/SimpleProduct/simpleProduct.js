import React from 'react';
import Breadcrumbs from '@magento/venia-ui/lib/components/Breadcrumbs';
import Carousel from '@magento/venia-ui/lib/components/ProductImageCarousel';
import defaultClasses from './simpleProduct.module.css';
import { useStyle } from '@magento/venia-ui/lib/classify';
import FullPageLoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';
import { Form } from 'informed';
import Price from '@magento/venia-ui/lib/components/Price';
import { FormattedMessage } from 'react-intl';
import RichText from '@magento/venia-ui/lib/components/RichText';
import { useSimpleProduct } from '../../talons/SimpleProduct/useSimpleProduct';
import WishlistGalleryButton from '@magento/venia-ui/lib/components/Wishlist/AddToListButton';
import { ADD_CONFIGURABLE_MUTATION } from '@magento/peregrine/lib/talons/ProductFullDetail/productFullDetail.gql.ce';

import ItemsTable from './itemsTable';
import ErrorView from '../../../../src/components/ErrorView/errorView';

const SimpleProduct = props => {
    const classes = useStyle(defaultClasses, props.classes);

    const talonProps = useSimpleProduct({
        addConfigurableProductToCartMutation: ADD_CONFIGURABLE_MUTATION
    });
    const { wishlistButtonProps, errorMessage, cartId, handleAddToCart, fetchedData, loading, error } = talonProps;

    const simpleProductData = loading ? null : fetchedData.products.items[0];
    const simpleProductAggregation = loading ? null : fetchedData.products.aggregations;

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

    return (
        <main>
            <Breadcrumbs categoryId={simpleProductData.categories[0].uid} currentProduct={simpleProductData.name} />
            <Form className={classes.root}>
                <section className={classes.imageCarouselContainer}>
                    <div className={classes.imageCarousel}>
                        <Carousel images={simpleProductData.media_gallery_entries} />
                    </div>
                </section>
                <section className={classes.title}>
                    <h1 className={classes.productName}>{simpleProductData.name}</h1>
                    <h2 className={classes.fromPrice}>
                        <FormattedMessage id={'productFullDetailB2B.fromPrice'} defaultMessage={'From '} />
                        {priceRender}
                    </h2>
                </section>
                <section className={classes.description}>
                    <h2 className={classes.descriptionTitle}>
                        <FormattedMessage
                            id={'productFullDetail.productDescription'}
                            defaultMessage={'Product Description'}
                        />
                    </h2>
                    <RichText content={simpleProductData.description.html} />
                </section>
                <section className={classes.favoritesButton}>
                    {wishlistButton}{' '}
                    <FormattedMessage id={'wishlistButton.addText'} defaultMessage={'Add to Favorites'} />
                </section>
            </Form>

            <div className={classes.productsTableContainer}>
                {indexTable}
                <ItemsTable
                    cartId={cartId}
                    errors={errors}
                    handleAddToCart={handleAddToCart}
                    product={simpleProductData}
                    aggregations={simpleProductAggregation}
                />
            </div>
        </main>
    );
};

export default SimpleProduct;
