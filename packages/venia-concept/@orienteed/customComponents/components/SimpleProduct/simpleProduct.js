import React, { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
import { useQuery } from '@apollo/client';
import { GET_SIMPLE_PRODUCT } from '../../talons/SimpleProduct/getSimpleProduct.gql';
import Breadcrumbs from '@magento/venia-ui/lib/components/Breadcrumbs';
import Carousel from '@magento/venia-ui/lib/components/ProductImageCarousel';
import defaultClasses from './simpleProduct.module.css';
import { useStyle } from '@magento/venia-ui/lib/classify';
import FullPageLoadingIndicator from '@magento/venia-ui/lib/components/LoadingIndicator';
import { Form } from 'informed';
import Price from '@magento/venia-ui/lib/components/Price';
import { FormattedMessage, useIntl } from 'react-intl';
import RichText from '@magento/venia-ui/lib/components/RichText';
import { useSimpleProduct } from '../../talons/SimpleProduct/useSimpleProduct';
import WishlistGalleryButton from '@magento/venia-ui/lib/components/Wishlist/AddToListButton';

const SimpleProduct = props => {
    const classes = useStyle(defaultClasses, props.classes);
    const { search } = useLocation();
    const sku = new URLSearchParams(search).get('sku');
    const talonProps = useSimpleProduct();
    const { storeConfig } = talonProps;

    const { data, loading } = useQuery(GET_SIMPLE_PRODUCT, {
        variables: { sku: sku }
    });

    if (loading) {
        return <FullPageLoadingIndicator />;
    }
    const wishlistButtonProps =
        storeConfig && storeConfig.magento_wishlist_general_is_enabled === '1'
            ? {
                  item: {
                      sku: data.products.items[0].sku,
                      quantity: 1
                  },
                  storeConfig
              }
            : null;

    const wishlistButton = wishlistButtonProps ? <WishlistGalleryButton {...wishlistButtonProps} /> : null;
    const priceRender =
        data.products.items[0].price.regularPrice.amount.value ===
        data.products.items[0].price.minimalPrice.amount.value ? (
            <div>
                <p className={classes.productPrice}>
                    <Price
                        currencyCode={data.products.items[0].price.regularPrice.amount.currency}
                        value={data.products.items[0].price.regularPrice.amount.value}
                    />
                </p>
            </div>
        ) : (
            <div>
                <p className={classes.productOldPrice}>
                    <Price
                        currencyCode={data.products.items[0].price.regularPrice.amount.currency}
                        value={data.products.items[0].price.regularPrice.amount.value}
                    />
                </p>
                <p className={classes.productPrice}>
                    <Price
                        currencyCode={data.products.items[0].price.minimalPrice.amount.currency}
                        value={data.products.items[0].price.minimalPrice.amount.value}
                    />
                </p>
            </div>
        );

    console.log('DATA', data);
    return (
        data && (
            <main>
                <Breadcrumbs
                    categoryId={data.products.items[0].categories[0].uid}
                    currentProduct={data.products.items[0].name}
                />
                <Form className={classes.root}>
                    <section className={classes.imageCarouselContainer}>
                        <div className={classes.imageCarousel}>
                            <Carousel images={data.products.items[0].media_gallery_entries} />
                        </div>
                    </section>
                    <section className={classes.title}>
                        <h1 className={classes.productName}>{data.products.items[0].name}</h1>
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
                        <RichText content={data.products.items[0].description.html} />
                    </section>
                    <section className={classes.favoritesButton}>
                        {wishlistButton}{' '}
                        <FormattedMessage id={'wishlistButton.addText'} defaultMessage={'Add to Favorites'} />
                    </section>
                </Form>
            </main>
        )
    );
};

export default SimpleProduct;
