import React, { Fragment, useState, Suspense } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { Form } from 'informed';
import { mergeClasses } from '@magento/venia-ui/lib/classify';

import RichText from '@magento/venia-ui/lib/components/RichText';
import Carousel from '@magento/venia-ui/lib/components/ProductImageCarousel';
import CurrentFilter from '@magento/venia-ui/lib/components/FilterModal/CurrentFilters/currentFilter';

import ProductItem from './ProductItem/ProductItem';
import CategoryFilter from './CategoryFilter/CategoryFilter';
import defaultClasses from './ProductFullDetailB2B.module.css';

const AddWishlistButton = React.lazy(() => import('@magento/venia-ui/lib/components/Wishlist/AddToListButton'));

const DeleteWishlistButton = React.lazy(() =>
    import('@magento/venia-concept/src/components/Wishlist/DeleteToListButton/deleteToListButton.js')
);

const ProductFullDetailB2B = props => {
    const classes = mergeClasses(defaultClasses, props.classes);
    const { formatMessage } = useIntl();
    const {
        breadcrumbs,
        product,
        errors,
        productDetails,
        priceRender,
        mediaGalleryEntries,
        addConfigurableProductToCart,
        cartId,
        isAddConfigurableLoading,
        wishlistAddButtonProps,
        wishlistDeleteButtonProps,
        isInWishList
    } = props;

    const [selectedFilter, setSelectedFilter] = useState([]);

    const getCategoriesValuesNameByVariant = variant => {
        return variant.attributes.map((attribute, i) => {
            return product.configurable_options[i].values.find(value => value.value_index == attribute.value_index)
                .label;
        });
    };

    const getCategoriesValuesIdByVariant = variant => {
        return variant.attributes.map((attribute, i) => {
            return attribute.value_index;
        });
    };

    const getCategoriesName = () => {
        return product.configurable_options.map(category => {
            return category.label;
        });
    };

    const fillFilters = () => {
        const filters = [];
        product.configurable_options.map(category =>
            filters.push(
                category.values.map(value => {
                    return { id: value.value_index, text: value.label };
                })
            )
        );

        const categoriesName = getCategoriesName();
        filters.map((filter, i) => {
            filter.unshift(categoriesName[i]);
        });

        return filters;
    };

    const handleRemoveItem = tempItemInfo => {
        let tempFilterList = selectedFilter;
        tempFilterList = tempFilterList.filter(filter => filter.id != tempItemInfo.item.value);
        setSelectedFilter(tempFilterList);
    };

    const selectedFilterList = (
        <div className={classes.selectedFilterContainer}>
            <FormattedMessage id={'productFullDetailB2B.selectFiltersTitle'} defaultMessage={'Filters:'} />
            <div className={classes.selectedFilter}>
                {selectedFilter.map(filter => (
                    <CurrentFilter item={{ title: filter.text, value: filter.id }} removeItem={handleRemoveItem} />
                ))}
            </div>
        </div>
    );

    const filterOptions = (
        <div className={classes.filterNameSelectorContainer}>
            {fillFilters().map(filter => {
                return (
                    <div className={classes.filterNameSelector}>
                        <p>{filter.shift()}</p>
                        <CategoryFilter
                            availableCategoryItems={filter}
                            selectedFilter={selectedFilter}
                            setSelectedFilter={setSelectedFilter}
                        />
                    </div>
                );
            })}
        </div>
    );

    const indexTable = (
        <div className={classes.productItemContainer}>
            <p key="imageIndex" className={classes.indexFixed} />
            <p key="nameIndex" className={classes.indexMobileName}>
                <FormattedMessage id={'productFullDetailB2B.indexName'} defaultMessage={'Name'} />
            </p>
            <p key="skuIndex" className={classes.indexMobileSku}>
                SKU
            </p>
            <div className={classes.categoriesItemList}>
                {getCategoriesName().map(category => {
                    return <p className={classes.indexFixedCategory}>{category}</p>;
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
            <p key="stockIndex">
                <FormattedMessage id={'productFullDetailB2B.stockStatus'} defaultMessage={'Stock Status'} />
            </p>
        </div>
    );

    const productsTable = (
        <div className={classes.productsTableContainer}>
            {product.variants.map(variant => {
                const categoriesValuesName = getCategoriesValuesNameByVariant(variant);
                const categoriesName = getCategoriesName();
                const categoriesIds = getCategoriesValuesIdByVariant(variant);
                const selectedFilterIds = selectedFilter.map(filter => filter.id);

                // Show all if there isnt any categorie selected
                // Show only the products that agree with all the filters option
                if (
                    selectedFilterIds.length === 0 ||
                    categoriesIds.filter(value => selectedFilterIds.includes(value)).length === selectedFilterIds.length // !== 0
                ) {
                    return (
                        <ProductItem
                            product={product}
                            variant={variant}
                            categoriesValuesName={categoriesValuesName}
                            categoriesName={categoriesName}
                            addConfigurableProductToCart={addConfigurableProductToCart}
                            cartId={cartId}
                            errors={errors}
                            isAddConfigurableLoading={isAddConfigurableLoading}
                        />
                    );
                }
            })}
        </div>
    );

    return (
        <Fragment>
            {breadcrumbs}
            <Form className={classes.root}>
                <section className={classes.title}>
                    <h1 className={classes.productName}>{productDetails.name}</h1>
                    <h2 className={classes.fromPrice}>
                        <FormattedMessage id={'productFullDetailB2B.fromPrice'} defaultMessage={'From '} />
                        {priceRender}
                    </h2>
                </section>
                <section className={classes.imageCarouselContainer}>
                    <div className={classes.imageCarousel}>
                        <Carousel images={mediaGalleryEntries} />
                    </div>
                </section>
                <section className={classes.description}>
                    <h2 className={classes.descriptionTitle}>
                        <FormattedMessage
                            id={'productFullDetail.productDescription'}
                            defaultMessage={'Product Description'}
                        />
                    </h2>
                    <RichText content={productDetails.description} />
                    <Suspense fallback={null}>
                        {isInWishList ? (
                            <DeleteWishlistButton {...wishlistDeleteButtonProps} />
                        ) : (
                            <AddWishlistButton {...wishlistAddButtonProps} />
                        )}
                    </Suspense>
                </section>
                <section className={classes.b2cContent}>
                    <h2 className={classes.b2cContentTitle}>
                        <FormattedMessage id={'productFullDetailB2B.titleTable'} defaultMessage={'Products table'} />
                    </h2>
                    <div className={classes.productsContainer}>
                        {selectedFilterList}
                        {filterOptions}
                        {indexTable}
                        {productsTable}
                    </div>
                </section>
            </Form>
        </Fragment>
    );
};

export default ProductFullDetailB2B;
