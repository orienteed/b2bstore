import React from 'react';
import { arrayOf, shape, string } from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { useStyle } from '@magento/venia-ui/lib/classify';

import defaultClasses from './paymentMethod.module.css';
import Price from '@magento/venia-ui/lib/components/Price';
import { CreditCard } from 'react-feather';
const PaymentMethod = props => {
    const { data, total, classes: propsClasses } = props;
    const { grand_total: grandTotal, discounts, subtotal, total_shipping: totalShipping, total_tax: totalTax } = total;
    const classes = useStyle(defaultClasses, propsClasses);
    /**
     * There can be multiple payment methods for an order but
     * since Venia does not support multiple payment methods yet
     * we are picking the first method in the array.
     */
    const [{ name }] = data;

    const sumOfDiscounts = discounts.reduce((sum, discount) => {
        return sum + discount?.amount.value;
    }, 0);
    const currencyCode = discounts.length > 0 ? discounts[0].amount.currency : grandTotal?.currency;

    return (
        <div className={classes.root} data-cy="OrderDetails-PaymentMethod-root">
            <div className={classes.heading}>
                <FormattedMessage id="orderDetails.paymentMethodLabel" defaultMessage="Payment Method" />
            </div>
            <div className={classes.payment_type}>
                <div>
                    {name}
                    <span>
                        <FormattedMessage id="orderDetails.discount" defaultMessage="Discount: " />
                        <Price value={sumOfDiscounts} currencyCode={currencyCode} />
                    </span>
                </div>
                <div>
                    <span>
                        <FormattedMessage id="orderDetails.subtotal" defaultMessage="Subtotal: " />
                        <Price value={subtotal?.value} currencyCode={subtotal?.currency} />
                    </span>
                </div>
                <div>
                    <span>
                        <FormattedMessage id="orderDetails.tax" defaultMessage="Tax: " />
                        <Price value={totalTax?.value} currencyCode={totalTax?.currency} />
                    </span>
                </div>
                <div>
                    <span>
                        <FormattedMessage id="orderDetails.shipping" defaultMessage="Shipping: " />
                        <Price value={totalShipping?.value} currencyCode={totalShipping?.currency} />
                    </span>
                </div>
                <div>
                    <span>
                        <FormattedMessage id="orderDetails.TotalPrice" defaultMessage="Total price: " />
                        <Price value={grandTotal?.value} currencyCode={grandTotal?.currency} />
                    </span>
                </div>
                <div>
                    <span className={classes.boxInfo}>
                        <CreditCard size={20} />
                        <FormattedMessage id="orderDetails.SafetlyPayment" defaultMessage="Safety payment" />
                    </span>
                </div>
            </div>
        </div>
    );
};

export default PaymentMethod;

PaymentMethod.propTypes = {
    classes: shape({
        root: string,
        heading: string,
        payment_type: string
    }),
    data: arrayOf(
        shape({
            name: string
        })
    )
};
