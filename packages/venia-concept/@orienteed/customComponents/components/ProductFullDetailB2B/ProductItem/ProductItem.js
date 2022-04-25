import React, { useCallback, useState, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { ShoppingCart as ShoppingCartIcon } from 'react-feather';
import { QuantityFields } from '@magento/venia-ui/lib/components/CartPage/ProductListing/quantity';
import { useStyle } from '@magento/venia-ui/lib/classify';
import Price from '@magento/venia-ui/lib/components/Price';
import Image from '@magento/venia-ui/lib/components/Image';
import Icon from '@magento/venia-ui/lib/components/Icon';
import defaultClasses from './ProductItem.module.css';
import CustomButton from '../CustomButtom/CustomButton';

const ProductItem = props => {
    const classes = useStyle(defaultClasses, props.classes);

    const {
        product,
        variant,
        categoriesValuesName,
        categoriesName,
        addConfigurableProductToCart,
        cartId,
        errors,
        isAddConfigurableLoading
    } = props;

    const [quantity, setQuantity] = useState(1);

    const [error, setError] = useState('');

    useEffect(() => {
        setTimeout(() => setError(''), 10000);
    }, [error]);

    let totalPriceTag = (
        <span className={classes.indexFixed}>
            <Price
                currencyCode={
                    variant.product.price.regularPrice.amount.currency
                }
                value={variant.product.price.minimalPrice.amount.value}
            />
        </span>
    );
    const [totalPrice, setTotalPrice] = useState(totalPriceTag);

    const handleQuantityChange = tempQuantity => {
        setQuantity(tempQuantity);
        setTotalPrice(
            (totalPriceTag = (
                <span className={classes.indexFixed}>
                    <Price
                        currencyCode={
                            variant.product.price.regularPrice.amount.currency
                        }
                        value={
                            variant.product.price.minimalPrice.amount.value *
                            tempQuantity
                        }
                    />
                </span>
            ))
        );
    };

    const handleAddProductToCart = useCallback(async () => {
        const variables = {
            cartId,
            quantity: quantity,
            sku: variant.product.sku,
            parentSku: product.sku
        };
        try {
            await addConfigurableProductToCart({
                variables
            });
        } catch {
            setError('Error');
        }
    }, [cartId, quantity, variant, addConfigurableProductToCart, setError]);

    const stockStatusText = (
        <FormattedMessage
            id={'productFullDetailB2B.stockStatus'}
            defaultMessage={'Stock Status'}
        />
    );

    const totalPriceText = (
        <FormattedMessage
            id={'productFullDetailB2B.totalPrice'}
            defaultMessage={'Total Price'}
        />
    );

    const imageIcon = widthSize => (
        <div className={classes.indexFixedImage}>
            <Image
                resource={variant.product.media_gallery_entries[0].file}
                width={widthSize}
                alt={variant.product.sku}
            />
        </div>
    );

    const nameTag = (
        <p>{product.name + ' ' + categoriesValuesName.join(' - ')}</p>
    );

    const quantitySelector = (id = 1) => (
        <div className={classes.quantity}>
            <QuantityFields
                fieldName={`${variant.product.sku}-${id}`}
                classes={{ root: classes.quantityRoot }}
                min={1}
                onChange={handleQuantityChange}
            />
        </div>
    );

    const priceTag = (
        <span className={classes.indexFixed}>
            <Price
                currencyCode={
                    variant.product.price.regularPrice.amount.currency
                }
                value={variant.product.price.minimalPrice.amount.value}
            />
        </span>
    );

    const stockStatus =
        variant.product.stock_status === 'IN_STOCK' ? (
            <div className={classes.inStock} />
        ) : (
            <div className={classes.outStock} />
        );

    const addToCartButton = (
        <CustomButton
            priority={'high'}
            classes={{ root: classes.buttonAddToCart }}
            onClick={handleAddProductToCart}
            disabled={variant.product.stock_status === 'OUT_OF_STOCK'}
        >
            <Icon
                classes={{
                    icon: classes.buttonAddToCartIcon
                }}
                size={16}
                src={ShoppingCartIcon}
            />
        </CustomButton>
    );

    const categoriesKeyValue = () => {
        let tempCategoriesKeyValueList = [];
        categoriesName.map((categoryName, i) => {
            return tempCategoriesKeyValueList.push([
                categoryName,
                categoriesValuesName[i]
            ]);
        });
        return tempCategoriesKeyValueList;
    };

    const productItemDesktop = (
        <div className={classes.productItemErrorContainerDesktop}>
            <div className={classes.errorMessage}>
                {error != '' && <p>{errors.get('quantity')}</p>}
            </div>

            <div className={classes.productItemContainerDesktop}>
                {imageIcon(120)}
                <div className={classes.indexMobileName}>{nameTag}</div>
                <p className={classes.indexMobileSku}>{variant.product.sku}</p>
                <div className={classes.categoriesItemList}>
                    {categoriesValuesName.map((category, i) => {
                        return (
                            <p
                                key={`${variant.product.sku}-${category}-${i}`}
                                className={classes.indexFixedCategory}
                            >
                                {category}
                            </p>
                        );
                    })}
                </div>
                {quantitySelector(1)}
                {priceTag}
                {totalPrice}
                <div className={classes.stockAddContainer}>
                    {stockStatus}
                    {addToCartButton}
                </div>
            </div>
        </div>
    );

    const productItemMobile = (
        <div className={classes.productItemContainerMobile}>
            <div className={classes.productItemContainerMobileContent}>
                {/* Header Part */}
                <div className={classes.productItemHeaderMobile}>
                    <div className={classes.productItemHeaderImageMobile}>
                        {imageIcon(150)}
                    </div>
                    <div className={classes.productItemHeaderTextMobile}>
                        <h2>{nameTag}</h2>
                        <small className={classes.skuTextMobile}>
                            {variant.product.sku}
                        </small>
                        <div className={classes.stockStatusContainer}>
                            <div>{stockStatusText}:</div>
                            <div className={classes.stockStatusCircle}>
                                {stockStatus}
                            </div>
                        </div>
                        <h2>{priceTag}</h2>
                    </div>
                </div>

                {/* Body */}
                <div className={classes.productItemBodyInformation}>
                    {categoriesKeyValue().map(row => {
                        return (
                            <div
                                className={
                                    classes.productItemBodyInformationRow
                                }
                            >
                                <p className={classes.mobileCategoryName}>
                                    {row[0]}{' '}
                                </p>
                                <p className={classes.mobileCategoryValue}>
                                    {row[1]}
                                </p>
                            </div>
                        );
                    })}
                </div>
                <div className={classes.actionsContainer}>
                    <div className={classes.totalPriceContainer}>
                        <div> {totalPriceText}:</div>
                        <div className={classes.totalWrapper}>{totalPrice}</div>
                    </div>
                    <div className={classes.productItemBodyOperations}>
                        {quantitySelector(2)}
                        {addToCartButton}
                    </div>
                    {error != '' && (
                        <p style={{ color: '#f00' }}>
                            {errors.get('quantity')}
                        </p>
                    )}
                </div>
            </div>
        </div>
    );

    return (
        <div>
            {productItemDesktop} {productItemMobile}
        </div>
    );
};

export default ProductItem;
