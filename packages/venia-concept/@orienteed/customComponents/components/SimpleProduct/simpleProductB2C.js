import React, { Fragment, Suspense } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Form } from 'informed';

import { useStyle } from '@magento/venia-ui/lib/classify';
import FormError from '@magento/venia-ui/lib/components/FormError';
import RichContent from '@magento/venia-ui/lib/components/RichContent';
import Carousel from '@magento/venia-ui/lib/components/ProductImageCarousel';
import { QuantityFields } from '@magento/venia-ui/lib/components/CartPage/ProductListing/quantity';

import defaultClasses from './simpleProductB2C.module.css';
import Breadcrumbs from '@magento/venia-ui/lib/components/Breadcrumbs';
import Button from '@magento/venia-ui/lib/components/Button';
import Options from '../CustomProductOptions/options';

const SimpleProductB2C = props => {
    const classes = useStyle(defaultClasses, props.classes);
    const {
        simpleProductData,
        handleAddToCart,
        priceRender,
        errors,
        tempTotalPrice,
        wishlistButton,
        simpleProductAggregationFiltered
    } = props;

    const cartCallToActionText =
        simpleProductData.stock_status === 'IN_STOCK' ? (
            <FormattedMessage id="productFullDetail.addItemToCart" defaultMessage="Add to Cart" />
        ) : (
            <FormattedMessage id="productFullDetail.itemOutOfStock" defaultMessage="Out of Stock" />
        );
    return (
        <Fragment>
            <Breadcrumbs categoryId={simpleProductData.categories[0].uid} currentProduct={simpleProductData.name} />
            <Form className={classes.root} onSubmit={handleAddToCart}>
                <section className={classes.title}>
                    <h1 className={classes.productName}>{simpleProductData.name}</h1>
                </section>
                <article className={classes.priceContainer}> {priceRender}</article>
                <section className={classes.imageCarousel}>
                    <Carousel images={simpleProductData.media_gallery_entries} />
                </section>

                <FormError
                    classes={{
                        root: classes.formErrors
                    }}
                    errors={errors.get('form') || []}
                />

                <Options simpleProductAggregationFiltered={simpleProductAggregationFiltered} />

                <section className={classes.quantity}>
                    <span className={classes.quantityTitle}>
                        <FormattedMessage id={'global.quantity'} defaultMessage={'Quantity'} />
                    </span>
                    <article className={classes.quantityTotalPrice}>
                        {/* <QuantityFields
                            fieldName={'quantity'}
                            classes={{ root: classes.quantityRoot }}
                            min={1}
                            onChange={handleQuantityChange}
                            message={errors.get('quantity')}
                        /> */}
                        quantity
                        <article className={classes.totalPrice}>{tempTotalPrice}</article>
                    </article>
                </section>
                <section className={classes.actions}>
                    <Button priority="high" type="submit">
                        {cartCallToActionText}
                    </Button>
                    <section className={classes.favoritesButton}>
                        {wishlistButton}{' '}
                        <FormattedMessage id={'wishlistButton.addText'} defaultMessage={'Add to Favorites'} />
                    </section>
                </section>
                <section className={classes.description}>
                    <span className={classes.descriptionTitle}>
                        <FormattedMessage
                            id={'productFullDetail.productDescription'}
                            defaultMessage={'Product Description'}
                        />
                    </span>
                    <RichContent html={simpleProductData.description.html} />
                </section>
                <section className={classes.details}>
                    <span className={classes.detailsTitle}>
                        <FormattedMessage id={'global.sku'} defaultMessage={'SKU'} />
                    </span>
                    <strong>{simpleProductData.sku}</strong>
                </section>
            </Form>
        </Fragment>
    );
};

export default SimpleProductB2C;
