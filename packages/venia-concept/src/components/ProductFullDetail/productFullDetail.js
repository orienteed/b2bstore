import React, { Fragment, Suspense, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { arrayOf, bool, number, shape, string } from 'prop-types';
import { Form } from 'informed';
import { Info } from 'react-feather';

import Price from '@magento/venia-ui/lib/components/Price';
import { useProductFullDetail } from '@magento/peregrine/lib/talons/ProductFullDetail/useProductFullDetail';
import { isProductConfigurable } from '@magento/peregrine/lib/util/isProductConfigurable';

import { useStyle } from '@magento/venia-ui/lib/classify';
import Breadcrumbs from '@magento/venia-ui/lib/components/Breadcrumbs';
import Button from '@magento/venia-ui/lib/components/Button';
import Carousel from '@magento/venia-ui/lib/components/ProductImageCarousel';
import FormError from '@magento/venia-ui/lib/components/FormError';
import { QuantityFields } from '@magento/venia-ui/lib/components/CartPage/ProductListing/quantity';
import RichContent from '@magento/venia-ui/lib/components/RichContent/richContent';

import { ProductOptionsShimmer } from '@magento/venia-ui/lib/components/ProductOptions';
import defaultClasses from './productFullDetail.module.css';

import noImage from './icons/product-package-cancelled.svg';

const WishlistButton = React.lazy(() => import('@magento/venia-ui/lib/components/Wishlist/AddToListButton'));
const Options = React.lazy(() => import('@magento/venia-ui/lib/components/ProductOptions'));

// Correlate a GQL error message to a field. GQL could return a longer error
// string but it may contain contextual info such as product id. We can use
// parts of the string to check for which field to apply the error.
const ERROR_MESSAGE_TO_FIELD_MAPPING = {
    'The requested qty is not available': 'quantity',
    'Product that you are trying to add is not available.': 'quantity',
    "The product that was requested doesn't exist.": 'quantity'
};

// Field level error messages for rendering.
const ERROR_FIELD_TO_MESSAGE_MAPPING = {
    quantity: 'The requested quantity is not available.'
};

const ProductFullDetail = props => {
    const { product } = props;
    const [quantity, setQuantity] = useState(1);

    const talonProps = useProductFullDetail({ product });

    const {
        breadcrumbCategoryId,
        errorMessage,
        handleAddToCart,
        handleSelectionChange,
        isOutOfStock,
        isAddToCartDisabled,
        isSupportedProductType,
        mediaGalleryEntries,
        productDetails,
        wishlistButtonProps,
        hasOptionsOfTheSelection
    } = talonProps;
    const { formatMessage } = useIntl();

    const classes = useStyle(defaultClasses, props.classes);

    const {
        price:{
            regularPrice:{
                amount:{
                    value: regularPriceValue
                }
            },
            minimalPrice:{
                amount:{
                    value: minimalPriceValue
                }
            }
        }
    }= productDetails;

    const priceRender = (regularPriceValue == minimalPriceValue) ? 
        <div>
            <p className={classes.productPrice}>
                <Price
                    currencyCode={productDetails.price.regularPrice.amount.currency}
                    value={productDetails.price.regularPrice.amount.value}
                />
            </p>
        </div>
    :
        <div>
            <p className={classes.productOldPrice}>
                <Price
                    currencyCode={productDetails.price.regularPrice.amount.currency}
                    value={productDetails.price.regularPrice.amount.value}
                />
            </p>
            <p className={classes.productPrice}>
                <Price
                    currencyCode={productDetails.price.minimalPrice.amount.currency}
                    value={productDetails.price.minimalPrice.amount.value}
                />
            </p>
        </div>

    const options = isProductConfigurable(product) ? (
        <Suspense fallback={<ProductOptionsShimmer />}>
            <Options
                onSelectionChange={handleSelectionChange}
                options={product.configurable_options}
            />
        </Suspense>
    ) : null;

    const breadcrumbs = breadcrumbCategoryId ? (
        <Breadcrumbs
            categoryId={breadcrumbCategoryId}
            currentProduct={productDetails.name}
        />
    ) : null;

    // Fill a map with field/section -> error.
    const errors = new Map();
    if (errorMessage) {
        Object.keys(ERROR_MESSAGE_TO_FIELD_MAPPING).forEach(key => {
            if (errorMessage.includes(key)) {
                const target = ERROR_MESSAGE_TO_FIELD_MAPPING[key];
                const message = ERROR_FIELD_TO_MESSAGE_MAPPING[target];
                errors.set(target, message);
            }
        });

        // Handle cases where a user token is invalid or expired. Preferably
        // this would be handled elsewhere with an error code and not a string.
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

        // Handle cases where a cart wasn't created properly.
        if (
            errorMessage.includes('Variable "$cartId" got invalid value null')
        ) {
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

        // An unknown error should still present a readable message.
        if (!errors.size) {
            errors.set('form', [
                new Error(
                    formatMessage({
                        id: 'productFullDetail.errorUnknown',
                        defaultMessage:
                            'Could not add item to cart. Please check required options and try again.'
                    })
                )
            ]);
        }
    }

    const tempTotalPrice =
        regularPriceValue == minimalPriceValue ? (
            <div>
                <p className={classes.productPrice}>
                    <Price
                        currencyCode={
                            productDetails.price.regularPrice.amount.currency
                        }
                        value={
                            productDetails.price.regularPrice.amount.value *
                            quantity
                        }
                    />
                </p>
            </div>
        ) : (
            <div>
                <p className={classes.productPrice}>
                    <Price
                        currencyCode={
                            productDetails.price.minimalPrice.amount.currency
                        }
                        value={
                            productDetails.price.minimalPrice.amount.value *
                            quantity
                        }
                    />
                </p>
                <p className={classes.productOldPrice}>
                    <Price
                        currencyCode={
                            productDetails.price.regularPrice.amount.currency
                        }
                        value={
                            productDetails.price.regularPrice.amount.value *
                            quantity
                        }
                    />
                </p>
            </div>
        );

    const handleQuantityChange = tempQuantity => {
        setQuantity(tempQuantity);
    };
    const cartCallToActionText = !isOutOfStock ? (
        <FormattedMessage
            id="productFullDetail.addItemToCart"
            defaultMessage="Add to Cart"
        />
    ) : (
        <FormattedMessage
            id="productFullDetail.itemOutOfStock"
            defaultMessage="Out of Stock"
        />
    );

    const cartActionContent = isSupportedProductType ? (
        <div className={isAddToCartDisabled ? classes.disabledButton : null}>
            <Button disabled={isAddToCartDisabled} priority="high" type="submit">
                {cartCallToActionText}
            </Button>
        </div>
    ) : (
        <div className={classes.unavailableContainer}>
            <Info />
            <p>
                <FormattedMessage
                    id={'productFullDetail.unavailableProduct'}
                    defaultMessage={
                        'This product is currently unavailable for purchase.'
                    }
                />
            </p>
        </div>
    );

    return (
        <Fragment>
            {breadcrumbs}
            <Form className={classes.root} onSubmit={handleAddToCart}>
                <section className={classes.title}>
                    <h1 className={classes.productName}>
                        {productDetails.name}
                    </h1>
                </section>
                <article className={classes.priceContainer}>
                    {' '}
                    {priceRender}
                </article>
                <section className={classes.imageCarousel}>
                    { hasOptionsOfTheSelection ? 
                        <Carousel images={mediaGalleryEntries} /> 
                    : <div className={classes.noImageContainer}>
                        <img className={classes.noImage} src={noImage} alt="No image" />
                    </div> }
                </section>
                {!hasOptionsOfTheSelection ? 
                    <div className={classes.errorOptionCombination}>
                        <FormattedMessage
                            id="productFullDetail.errorOptionCombination"
                            defaultMessage="This combination of options doesn´t exist."
                        />
                    </div> 
                :   null}
                <FormError
                    classes={{
                        root: classes.formErrors
                    }}
                    errors={errors.get('form') || []}
                />
                <section className={classes.options}>{options}</section>
                <section className={classes.quantity}>
                    <span className={classes.quantityTitle}>
                        <FormattedMessage
                            id={'global.quantity'}
                            defaultMessage={'Quantity'}
                        />
                    </span>
                    <article className={classes.quantityTotalPrice}>
                        <QuantityFields
                            classes={{ root: classes.quantityRoot }}
                            min={1}
                            onChange={handleQuantityChange}
                            message={errors.get('quantity')}
                        />
                        <article className={classes.totalPrice}>
                            {tempTotalPrice}
                        </article>
                    </article>
                </section>
                <section className={classes.actions}>
                    {cartActionContent}
                    <Suspense fallback={null}>
                        <WishlistButton {...wishlistButtonProps} />
                    </Suspense>
                </section>
                <section className={classes.description}>
                    <span className={classes.descriptionTitle}>
                        <FormattedMessage
                            id={'productFullDetail.productDescription'}
                            defaultMessage={'Product Description'}
                        />
                    </span>
                    <RichContent html={productDetails.description} />
                </section>
                <section className={classes.details}>
                    <span className={classes.detailsTitle}>
                        <FormattedMessage
                            id={'global.sku'}
                            defaultMessage={'SKU'}
                        />
                    </span>
                    <strong>{productDetails.sku}</strong>
                </section>
            </Form>
        </Fragment>
    );
};

ProductFullDetail.propTypes = {
    classes: shape({
        cartActions: string,
        description: string,
        descriptionTitle: string,
        details: string,
        detailsTitle: string,
        imageCarousel: string,
        options: string,
        productName: string,
        productPrice: string,
        quantity: string,
        quantityTitle: string,
        root: string,
        title: string,
        unavailableContainer: string
    }),
    product: shape({
        __typename: string,
        id: number,
        stock_status: string,
        sku: string.isRequired,
        price: shape({
            regularPrice: shape({
                amount: shape({
                    currency: string.isRequired,
                    value: number.isRequired
                })
            }).isRequired
        }).isRequired,
        media_gallery_entries: arrayOf(
            shape({
                uid: string,
                label: string,
                position: number,
                disabled: bool,
                file: string.isRequired
            })
        ),
        description: string
    }).isRequired
};

export default ProductFullDetail;
