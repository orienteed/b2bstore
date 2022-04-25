import React, { Fragment, Suspense } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Form } from 'informed';

import { useStyle } from '@magento/venia-ui/lib/classify';
import FormError from '@magento/venia-ui/lib/components/FormError';
import RichContent from '@magento/venia-ui/lib/components/RichContent';
import Carousel from '@magento/venia-ui/lib/components/ProductImageCarousel';
import { QuantityFields } from '@magento/venia-ui/lib/components/CartPage/ProductListing/quantity';

const WishlistButton = React.lazy(() =>
    import('@magento/venia-ui/lib/components/Wishlist/AddToListButton')
);

import defaultClasses from './ProductFullDetailB2C.module.css';
import noImage from './icons/product-package-cancelled.svg';

const ProductFullDetailB2C = props => {
    const classes = useStyle(defaultClasses, props.classes);
    const { formatMessage } = useIntl();

    const {
        breadcrumbs,
        errors,
        handleAddToCart,
        productDetails,
        priceRender,
        mediaGalleryEntries,
        availableOptions,
        hasOptionsOfTheSelection,
        wishlistButtonProps,
        handleQuantityChange,
        tempTotalPrice,
        cartActionContent
    } = props;

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
                    {hasOptionsOfTheSelection ? (
                        <Carousel images={mediaGalleryEntries} />
                    ) : (
                        <div className={classes.noImageContainer}>
                            <img
                                className={classes.noImage}
                                src={noImage}
                                alt="No image"
                            />
                        </div>
                    )}
                </section>
                {!hasOptionsOfTheSelection ? (
                    <div className={classes.errorOptionCombination}>
                        <FormattedMessage
                            id="productFullDetail.errorOptionCombination"
                            defaultMessage="This combination of options doesn't exist."
                        />
                    </div>
                ) : null}
                <FormError
                    classes={{
                        root: classes.formErrors
                    }}
                    errors={errors.get('form') || []}
                />
                <section className={classes.options}>
                    {availableOptions}
                </section>
                <section className={classes.quantity}>
                    <span className={classes.quantityTitle}>
                        <FormattedMessage
                            id={'global.quantity'}
                            defaultMessage={'Quantity'}
                        />
                    </span>
                    <article className={classes.quantityTotalPrice}>
                        <QuantityFields
                            fieldName={'quantity'}
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

export default ProductFullDetailB2C;
