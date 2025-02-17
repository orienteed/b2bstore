/* eslint-disable react/jsx-no-literals */
import React, { useCallback, useState, useEffect } from 'react';
import { useIntl, FormattedMessage } from 'react-intl';
import { ShoppingCart as ShoppingCartIcon } from 'react-feather';
import QuantityStepper from '../../../QuantityStepper';
import { useStyle } from '@magento/venia-ui/lib/classify';
import Price from '../../../Price';
import Image from '../../../Image';
import Icon from '../../../Icon';
import Button from '../../../Button';
import defaultClasses from './ProductItem.module.css';
import { useToasts } from '@magento/peregrine';

import PlaceholderImage from '../../../Image/placeholderImage';

import copyToClipboard from '@magento/venia-ui/lib/assets/copyToClipboard.png';
import { InStockIcon } from '@magento/venia-ui/lib/assets/inStockIcon';
import { OutStockIcon } from '@magento/venia-ui/lib/assets/outStockIcon';
import NotifyPrice from '../../../ProductsAlert/NotifyPrice';
import PriceAlert from '../../../ProductsAlert/PriceAlertModal/priceAlert';
import { useProductsAlert } from '@magento/peregrine/lib/talons/productsAlert/useProductsAlert';
import NotifyButton from '../../../ProductsAlert/NotifyButton/NotifyButton';
import StockAlert from '../../../ProductsAlert/StockAlertModal/stockAlert';

const ProductItem = props => {
    const classes = useStyle(defaultClasses, props.classes);
    const [, {addToast}] = useToasts();
    const { formatMessage } = useIntl();

    const [quantity, setQuantity] = useState(1);
    const handleQuantityChange = tempQuantity => {
        setQuantity(tempQuantity);
    };

    const {
        product,
        variant,
        categoriesValuesName,
        categoriesName,
        addConfigurableProductToCart,
        cartId,
        errors
    } = props;
    
    useEffect(() => {
        setQuantity(1);
    }, [variant]);

    const [copied, setCopied] = useState(false);
    const productAlertStatus = variant?.product?.mp_product_alert;
    const [isItemDisabled, setIsItemDisabled] = useState(false);
    const productsAlert = useProductsAlert({ ItemSku: variant?.product?.sku });
    const {
        isStockModalOpened,
        handleOpendStockModal,
        handleCloseModal,
        handleOpenPriceModal,
        openPriceModal,
        formProps,
        submitStockAlert,
        handleSubmitPriceAlert,
        alertConfig
    } = productsAlert;

    const copyText = () => {
        navigator.clipboard.writeText(variant.product.sku);
        setCopied(true);

        setTimeout(() => {
            setCopied(false);
        }, 1000);
    };

    const [error, setError] = useState('');

    useEffect(() => {
        setTimeout(() => setError(''), 10000);
    }, [error]);

    const handleAddProductToCart = useCallback(async () => {
        setIsItemDisabled(true);
        const variables = {
            cartId,
            quantity,
            sku: variant.product.sku,
            parentSku: product.sku
        };
        try {
            await addConfigurableProductToCart({
                variables
            });
            addToast({
                type: 'success',
                message: formatMessage({
                    id: 'cartPage.AddedSuccessfully',
                    defaultMessage: 'Added to cart successfully.'
                }),
                timeout: 6000
            });
            setIsItemDisabled(false);
        } catch {
            setIsItemDisabled(false);
            setError('Error');
            addToast({
                type: 'error',
                message: formatMessage({
                    id: 'cartPage.AddedFailure',
                    defaultMessage: 'Failed to add an item to cart.'
                }),
                timeout: 6000
            });
        }
    }, [cartId, quantity, variant, addConfigurableProductToCart, setError, product, addToast, formatMessage]);

    const stockStatusText = (
        <FormattedMessage id={'productFullDetailB2B.stockStatus'} defaultMessage={'Stock Status'} />
    );

    const totalPriceText = <FormattedMessage id={'productFullDetailB2B.totalPrice'} defaultMessage={'Total Price'} />;

    const imageIcon = widthSize => (
        <div className={classes.indexFixedImage}>
            {variant.product?.media_gallery_entries.length > 0 ? (
                <Image
                    resource={variant.product?.media_gallery_entries[0]?.file}
                    width={widthSize}
                    alt={variant.product.sku}
                />
            ) : (
                <div className={classes.placeholderContainer}>
                    <PlaceholderImage alt={variant.product.name} classes={classes} width={widthSize} height="120" />
                </div>
            )}
        </div>
    );

    const isPdSize = categoriesValuesName.some(value => !isNaN(parseFloat(value) && isFinite(value)))

    const nameTag = <p>{product.name + ' ' + categoriesValuesName.join(' - ')} {isPdSize ? "cm" : ""}</p>;

    const quantitySelector = (id = 1) => (
        <div className={classes.quantity}>
            <QuantityStepper
                fieldName={`${variant.product.sku}-${id}`}
                classes={{ root: classes.quantityRoot }}
                min={1}
                isPDP={true}
                onChange={e => handleQuantityChange(e?.target?.value || e)}
            />
        </div>
    );

    const priceTag = (
        <div className={classes.priceContainer}>
            <span className={classes.indexFixed}>
                <Price
                    currencyCode={variant.product.price.regularPrice.amount.currency}
                    value={variant.product.price.minimalPrice.amount.value}
                />
            </span>
            {productAlertStatus?.mp_productalerts_price_alert && process.env.B2BSTORE_VERSION === 'PREMIUM' && (
                <div className={classes.notifyPrice}>
                    <NotifyPrice handleOpenPriceModal={handleOpenPriceModal} />
                </div>
            )}
        </div>
    );

    const stockStatus =
        variant.product.stock_status === 'IN_STOCK' ? (
            <div className={classes.inStockContainer}>
                <InStockIcon />
            </div>
        ) : (
            <div className={classes.outStockContainer}>
                <OutStockIcon />
            </div>
        );
    const addToCartButton = (
        <Button
            className={classes.buttonAddToCart}
            onClick={handleAddProductToCart}
            disabled={
                variant.product.stock_status === 'OUT_OF_STOCK' ||
                variant.product.price?.minimalPrice?.amount?.value === -1 ||
                isItemDisabled
            }
        >
            <Icon
                classes={{
                    icon: classes.buttonAddToCartIcon
                }}
                size={16}
                src={ShoppingCartIcon}
            />
        </Button>
    );

    const stockButton =
        variant?.product?.stock_status === 'OUT_OF_STOCK' &&
        productAlertStatus?.mp_productalerts_stock_notify &&
        process.env.B2BSTORE_VERSION === 'PREMIUM' ? (
            <div className={classes.stockBtnWrapper}>
                <NotifyButton
                    handleOpendStockModal={handleOpendStockModal}
                    productStatus={variant?.product?.stock_status}
                />
            </div>
        ) : (
            addToCartButton
        );
    const categoriesKeyValue = () => {
        const tempCategoriesKeyValueList = [];
        categoriesName.map((categoryName, i) => {
            return tempCategoriesKeyValueList.push([categoryName, categoriesValuesName[i]]);
        });
        return tempCategoriesKeyValueList;
    };

    const lastDigitsOfSku = variant.product.sku.substring(variant.product.sku.length - 7);

    const productItemDesktop = (
        <div className={classes.productItemErrorContainerDesktop}>
            <div className={classes.errorMessage}>{error != '' && <p>{errors.get('quantity')}</p>}</div>

            <div className={classes.productItemContainerDesktop}>
                {imageIcon(120)}
                <div className={classes.indexMobileName}>{nameTag}</div>
                <p className={classes.indexMobileSku}>
                    {' '}
                    {copied ? (
                        <div className={classes.copiedText}>
                            <FormattedMessage id={'productFullDetailB2B.copiedText'} defaultMessage={'Copied'} />
                        </div>
                    ) : (
                        <div className={classes.productSkuContainer}>
                            <button type="button" onClick={copyText}>
                                ...{lastDigitsOfSku} <img src={copyToClipboard} alt="copyToClipboard" />
                            </button>
                        </div>
                    )}
                </p>
                <div className={classes.categoriesItemList}>
                    {categoriesValuesName.map((category, i) => {
                        const isCategoryPdSize = !isNaN(parseFloat(category) && isFinite(category))
                        return (
                            <p key={`${variant.product.sku}-${category}-${i}`} className={classes.indexFixedCategory}>
                                {category} {isCategoryPdSize ? "cm" : ""}
                            </p>
                        );
                    })}
                </div>
                {quantitySelector(1)}
                {variant?.product.stock_status === 'IN_STOCK' ? priceTag : <span>-</span>}
                {variant?.product.stock_status === 'IN_STOCK' ? (
                    <span className={classes.indexFixed}>
                        <Price
                            currencyCode={variant.product.price.regularPrice.amount.currency}
                            value={variant.product.price.minimalPrice.amount.value * quantity || 0}
                        />
                    </span>
                ) : (
                    <span>-</span>
                )}
                <div className={classes.stockAddContainer}>
                    {stockStatus}
                    {stockButton}
                </div>
            </div>
        </div>
    );

    const productItemMobile = (
        <div className={classes.productItemContainerMobile}>
            <div className={classes.productItemContainerMobileContent}>
                {/* Header Part */}
                <div className={classes.productItemHeaderMobile}>
                    <div className={classes.productItemHeaderImageMobile}>{imageIcon(150)}</div>
                    <div className={classes.productItemHeaderTextMobile}>
                        <h2>{nameTag}</h2>
                        <small className={classes.skuTextMobile}>{variant.product.sku}</small>
                        <div className={classes.stockStatusContainer}>
                            <div>{stockStatusText}:</div>
                            <div className={classes.stockStatusCircle}>{stockStatus}</div>
                        </div>
                        {variant?.product.stock_status === 'IN_STOCK' && <h2>{priceTag}</h2>}
                    </div>
                </div>

                {/* Body */}
                <div className={classes.productItemBodyInformation}>
                    {categoriesKeyValue().map(row => {
                        return (
                            <div className={classes.productItemBodyInformationRow}>
                                <p className={classes.mobileCategoryName}>{row[0]} </p>
                                <p className={classes.mobileCategoryValue}>{row[1]}</p>
                            </div>
                        );
                    })}
                </div>
                <div className={classes.actionsContainer}>
                    {variant?.product.stock_status === 'IN_STOCK' && (
                        <div className={classes.totalPriceContainer}>
                            <div> {totalPriceText}:</div>
                            <div className={classes.totalWrapper}>
                                <span className={classes.indexFixed}>
                                    <Price
                                        currencyCode={variant.product.price.regularPrice.amount.currency}
                                        value={variant.product.price.minimalPrice.amount.value * quantity}
                                    />
                                </span>
                            </div>
                        </div>
                    )}
                    <div className={classes.productItemBodyOperations}>
                        {quantitySelector(2)}
                        {stockButton}
                    </div>
                    {error != '' && <p style={{ color: '#f00' }}>{errors.get('quantity')}</p>}
                </div>
            </div>
        </div>
    );

    return (
        <div>
            {productItemDesktop} {productItemMobile}
            <PriceAlert
                formProps={formProps}
                isOpen={openPriceModal}
                onConfirm={handleSubmitPriceAlert}
                onCancel={handleCloseModal}
                alertConfig={alertConfig?.price_alert}
            />
            <StockAlert
                isOpen={isStockModalOpened}
                onConfirm={submitStockAlert}
                formProps={formProps}
                onCancel={handleCloseModal}
                alertConfig={alertConfig?.stock_alert}
            />
        </div>
    );
};

export default ProductItem;
