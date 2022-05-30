import React, { useCallback, useState, useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { ShoppingCart as ShoppingCartIcon } from 'react-feather';

// import QuantityStepper from '@magento/venia-ui/lib/components/QuantityStepper';
import { useStyle } from '@magento/venia-ui/lib/classify';
import Price from '@magento/venia-ui/lib/components/Price';
import Image from '@magento/venia-ui/lib/components/Image';
import Icon from '@magento/venia-ui/lib/components/Icon';
import defaultClasses from './itemsTable.module.css';
import CustomButton from './CustomButtom/CustomButton';
import inStock from './assets/inStock.svg';
import outOfStock from './assets/outOfStock.svg';
import copyToClipboard from './assets/copyToClipboard.png';
// import useCopy from 'use-copy';

const ItemsTable = props => {
    const classes = useStyle(defaultClasses, props.classes);
    const { product, errors, handleAddToCart, aggregations, tempTotalPrice } = props;

    // const [copied, copy, setCopied] = useCopy(product.sku);

    const copyText = () => {
        copy();

        setTimeout(() => {
            setCopied(false);
        }, 1000);
    };

    const [quantity, setQuantity] = useState(1);

    const [error, setError] = useState('');

    useEffect(() => {
        setTimeout(() => setError(''), 10000);
    }, [error]);

    const handleQuantityChange = tempQuantity => {
        setQuantity(tempQuantity);
    };

    const stockStatusText = (
        <FormattedMessage id={'productFullDetailB2B.stockStatus'} defaultMessage={'Stock Status'} />
    );

    const totalPriceText = <FormattedMessage id={'productFullDetailB2B.totalPrice'} defaultMessage={'Total Price'} />;

    const imageIcon = widthSize => (
        <div className={classes.indexFixedImage}>
            <Image resource={product.media_gallery_entries[0].file} width={widthSize} alt={product.sku} />
        </div>
    );

    // + ' ' + categoriesValuesName.join(' - ')

    // const quantitySelector = (id = 1) => (
    //     <div className={classes.quantity}>
    //         <QuantityStepper
    //             fieldName={`${product.sku}-${id}`}
    //             classes={{ root: classes.quantityRoot }}
    //             min={1}
    //             onChange={handleQuantityChange}
    //         />
    //     </div>
    // );

    const priceTag = (
        <span className={classes.indexFixed}>
            <Price
                currencyCode={product.price.regularPrice.amount.currency}
                value={product.price.minimalPrice.amount.value}
            />
        </span>
    );

    const stockStatus =
        product.stock_status === 'IN_STOCK' ? (
            <div className={classes.inStockContainer}>
                <img src={inStock} alt="inStock" />
            </div>
        ) : (
            <div className={classes.outStockContainer}>
                <img src={outOfStock} alt="outOfStock" />
            </div>
        );

    const addToCartButton = (
        <CustomButton
            priority={'high'}
            classes={{ root: classes.buttonAddToCart }}
            onClick={handleAddToCart}
            disabled={product.stock_status === 'OUT_OF_STOCK'}
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

    const lastDigitsOfSku = product.sku.substring(product.sku.length - 7);

    const productItemDesktop = (
        <div className={classes.productItemErrorContainerDesktop}>
            <div className={classes.errorMessage}>{error != '' && <p>{errors.get('quantity')}</p>}</div>

            <div className={classes.productItemContainerDesktop}>
                {imageIcon(120)}
                <p className={classes.indexMobileSku}>
                    sku
                    {/* {' '}
                    {copied ? (
                        <div className={classes.copiedText}>
                            <FormattedMessage id={'productFullDetailB2B.copiedText'} defaultMessage={'Copied'} />
                        </div>
                    ) : (
                        <div className={classes.productSkuContainer}>
                            <a onClick={copyText}>...{lastDigitsOfSku}</a>
                            <img src={copyToClipboard} alt="copyToClipboard" onClick={copyText} />
                        </div>
                    )} */}
                </p>
                <div className={classes.categoriesItemList}>
                    {aggregations.map((category, i) => {
                        if (category.label !== 'Category' && category.label !== 'Price') {
                            return category.options.map(option => {
                                return (
                                    <p key={`${category.label}-${i}`} className={classes.indexFixedCategory}>
                                        {option.label}
                                    </p>
                                );
                            });
                        }
                    })}
                </div>
                quantity
                {/* {quantitySelector(1)} */}
                {priceTag}
                <span className={classes.indexFixed}>{tempTotalPrice}</span>
                <div className={classes.stockAddContainer}>
                    {stockStatus}
                    {addToCartButton}
                </div>
            </div>
        </div>
    );

    const productItemMobile = (
        <main className={classes.productItemContainerMobile}>
            <div className={classes.productItemContainerMobileContent}>
                <section className={classes.productItemHeaderMobile}>
                    <div className={classes.productItemHeaderImageMobile}>{imageIcon(150)}</div>
                    <article className={classes.productItemHeaderTextMobile}>
                        <small className={classes.skuTextMobile}>{product.sku}</small>
                        <div className={classes.stockStatusContainer}>
                            <div>{stockStatusText}:</div>
                            <div className={classes.stockStatusCircle}>{stockStatus}</div>
                        </div>
                        <h2>{priceTag}</h2>
                    </article>
                </section>

                {/* Body */}
                <section className={classes.productItemBodyInformation}>
                    <div className={classes.productItemBodyInformationRow}>
                        <article className={classes.mobileCategoryName}>
                            {' '}
                            {aggregations.map(category => {
                                if (category.label !== 'Category' && category.label !== 'Price') {
                                    return <p key={category.label}>{category.label}</p>;
                                }
                            })}{' '}
                        </article>
                        <article className={classes.mobileCategoryValue}>
                            {aggregations.map((category, i) => {
                                if (category.label !== 'Category' && category.label !== 'Price') {
                                    return category.options.map(option => {
                                        return <p key={`${category.label}-${i}`}>{option.label}</p>;
                                    });
                                }
                            })}
                        </article>
                    </div>
                </section>
                <section className={classes.actionsContainer}>
                    <article className={classes.totalPriceContainer}>
                        <div> {totalPriceText}:</div>
                        <div className={classes.totalWrapper}>
                            {' '}
                            <span className={classes.indexFixed}>{tempTotalPrice}</span>
                        </div>
                    </article>
                    <div className={classes.productItemBodyOperations}>
                        {/* {quantitySelector(2)} */}
                        {addToCartButton}
                    </div>
                    {error != '' && <p style={{ color: '#f00' }}>{errors.get('quantity')}</p>}
                </section>
            </div>
        </main>
    );

    return (
        <div className={classes.productsTableContainer}>
            {productItemDesktop} {productItemMobile}
        </div>
    );
};

export default ItemsTable;
