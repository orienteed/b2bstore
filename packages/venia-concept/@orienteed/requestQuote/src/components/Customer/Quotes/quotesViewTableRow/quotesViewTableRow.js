import React from 'react';
import { shape, string } from 'prop-types';
import { FormattedMessage, } from 'react-intl';
import {mergeClasses} from '@magento/venia-ui/lib/classify';
import defaultClasses from '@orienteed/requestQuote/src/components/Customer/Quotes/quotesView/quotesView.module.css';
import Price from '@magento/venia-ui/lib/components/Price';
import ProductOptions from './productOptions'

const quotesViewTableRow = props => {

    const {
        item:{
            name, 
            sku, 
            request_price, 
            qty, 
            discount, 
            prices:{
                price, 
                total_item_discount, 
                row_total
            },
            configurable_options
        }
    }=props

    const classes = mergeClasses(defaultClasses, props.classes);

    const quotesViewTableRow = (
        <li className={classes.quotesViewTableRow}>
            <div className={classes.productName}>
                <span className={classes.productNameMobileLabel}>
                    <FormattedMessage
                        id={'quotesView.productNameText'}
                        defaultMessage={'Product Name'}
                    />
                </span>
                <span className={classes.productNameValue}>
                    {name}
                </span>
            </div>
            <div className={classes.productSku}>
                <span className={classes.productSkuMobileLabel}>
                    <FormattedMessage
                        id={'quotesView.productSkuText'}
                        defaultMessage={'SKU'}
                    />
                </span>
                <span className={classes.productSkuValue}>
                    {sku}
                    <ProductOptions
                        options={configurable_options}
                        classes={{
                            options: classes.options
                        }}
                    />
                </span>
            </div>
            <div className={classes.productPrice}>
                <span className={classes.productPriceMobileLabel}>
                    <FormattedMessage
                        id={'quotesView.productPriceText'}
                        defaultMessage={'Price'}
                    />
                </span>
                <span className={classes.productPriceValue}>
                    <Price currencyCode={price.currency} value={price.value} />
                </span>
            </div>
            <div className={classes.productQuotePrice}>
                <span className={classes.productQuotePriceMobileLabel}>
                    <FormattedMessage
                        id={'quotesView.productQuotePriceText'}
                        defaultMessage={'Quote Price'}
                    />
                </span>
                <span className={classes.productQuotePriceValue}>
                    <Price currencyCode={total_item_discount.currency} value={request_price} />
                </span>
            </div>
            <div className={classes.productQty}>
                <span className={classes.productQtyMobileLabel}>
                    <FormattedMessage
                        id={'quotesView.productQtyText'}
                        defaultMessage={'Qty'}
                    />
                </span>
                <span className={classes.productQtyValue}>{qty}</span>
            </div>
            <div className={classes.productDiscount}>
                <span className={classes.productDiscountMobileLabel}>
                    <FormattedMessage
                        id={'quotesView.productDiscountText'}
                        defaultMessage={'Discount'}
                    />
                </span>
                <span className={classes.productDiscountValue} dangerouslySetInnerHTML={{__html: discount}}>
                </span>
            </div>
            <div className={classes.productSubtotal}>
                <span className={classes.productSubtotalMobileLabel}>
                    <FormattedMessage
                        id={'quotesView.productSubtotalText'}
                        defaultMessage={'Subtotal'}
                    />
                </span>
                <span className={classes.productSubtotalValue}>
                    <Price currencyCode={row_total.currency} value={row_total.value} />
                </span>
            </div>
        </li>
    );

    return (
        <>{quotesViewTableRow}</>
    );
};

export default quotesViewTableRow;

quotesViewTableRow.propTypes = {
    classes: shape({
        quotesViewTableRow: string,
        productName: string,
        productNameLabel: string,
        productNameMobileLabel: string,
        productNameValue: string,
        productSku: string,
        productSkuLabel: string,
        productSkuMobileLabel: string,
        productSkuValue: string,
        productPriceMobileLabel: string,
        productPrice: string,
        productPriceLabel: string,
        productPriceValue: string,
        productQuotePrice: string,
        productQuotePriceLabel: string,
        productQuotePriceMobileLabel: string,
        productQuotePriceValue: string,
        productQty: string,
        productQtyLabel: string,
        productQtyMobileLabel: string,
        productQtyValue: string,
        productSubtotal: string,
        productSubtotalLabel: string,
        productSubtotalValue: string,
        productSubtotalMobileLabel: string,
        productDiscount: string,
        productDiscountMobileLabel: string,
        productDiscountValue: string
    })
};