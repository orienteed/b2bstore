import React from 'react';
import { arrayOf, shape, string } from 'prop-types';
import { FormattedMessage } from 'react-intl';

import { useStyle } from '@magento/venia-ui/lib/classify';

import defaultClasses from './paymentMethod.module.css';
import Price from '@magento/venia-ui/lib/components/Price';
import { CreditCard } from 'react-feather';
const PaymentMethod = props => {
    const { data, total, classes: propsClasses } = props;

    const classes = useStyle(defaultClasses, propsClasses);
    /**
     * There can be multiple payment methods for an order but
     * since Venia does not support multiple payment methods yet
     * we are picking the first method in the array.
     */

    const [{ name }] = data;

    return (
        <div className={classes.root} data-cy="OrderDetails-PaymentMethod-root">
            <div className={classes.heading}>
                <FormattedMessage id="orderDetails.paymentMethodLabel" defaultMessage="Payment Method" />
            </div>
            <div className={classes.payment_type}>
                <div>
                    {name}

                    {total?.discounts?.length > 0 && (
                        <span>
                            <FormattedMessage id="orderDetails.Discount" defaultMessage="Discounts: " />
                            {total?.discounts?.length > 0
                                ? total?.discounts?.map(discount => {
                                      return (
                                          <Price value={discount?.value ? discount?.value : 0} currencyCode={'USD'} />
                                      );
                                  })
                                : '$0.00'}
                        </span>
                    )}

                    {total?.total_tax?.value > 0 ? (
                        <span>
                            <FormattedMessage id="orderDetails.Tax" defaultMessage="Tax: " />
                            <Price value={total?.total_tax?.value} currencyCode={total?.total_tax?.currency} />
                        </span>
                    ) : null}
                    <span>
                        <FormattedMessage id="orderDetails.SubTotalPrice" defaultMessage="Subtotal price: " />
                        <Price
                            value={total?.subtotal?.value ? total?.subtotal?.value : 0}
                            currencyCode={total?.subtotal?.currency}
                        />
                    </span>
                    <span>
                        <FormattedMessage id="orderDetails.Shipping" defaultMessage="Shipping: " />
                        <Price value={total?.total_shipping?.value} currencyCode={total?.total_shipping?.currency} />
                    </span>
                    <span>
                        <FormattedMessage id="orderDetails.TotalPrice" defaultMessage="Total price: " />
                        <Price value={total?.grand_total?.value} currencyCode={total?.grand_total?.currency} />
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
