import React from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { shape, string, bool, func } from 'prop-types';

import LoadingIndicator from '../../LoadingIndicator';
import Price from '../../Price';

import { useCartContext } from '@magento/peregrine/lib/context/cart';
import { useCustomerCreditSystem } from '@magento/peregrine/lib/talons/CheckoutPage/CustomerCreditSystem/useCustomerCreditSystem';
import { useStyle } from '@magento/venia-ui/lib/classify';
import { useAdapter } from '@magento/peregrine/lib/hooks/useAdapter';

import defaultClasses from './customerCreditSystem.module.css';

const CustomerCreditSystem = props => {
    const { formatMessage } = useIntl();
    const classes = useStyle(defaultClasses, props.classes);
    const { onPaymentSuccess, onPaymentError, resetShouldSubmit, shouldSubmit, paymentMethodMutationData, setPaymentData } = props;
    const { getPriceSummary } = useAdapter();
    const [{ cartId }] = useCartContext();
    const talonProps = useCustomerCreditSystem({
        onPaymentSuccess,
        onPaymentError,
        resetShouldSubmit,
        shouldSubmit,
        paymentMethodMutationData,
        cartId,
        setPaymentData
    });
    const { data } = getPriceSummary({ cartId: cartId });
    const priceSummary = data?.cart?.prices.grand_total;
    const { loading } = talonProps;

    if (loading) {
        return (
            <LoadingIndicator>
                <FormattedMessage id={'creditLoading.creditLoadingText'} defaultMessage={'Loading Payment'} />
            </LoadingIndicator>
        );
    }

    const { checkoutData } = talonProps;

    if (Object.keys(checkoutData).length == 0) {
        return null;
    }

    const {
        checkoutData: { grand_total, leftincredit, remainingcreditformatted, remainingcreditcurrentcurrency }
    } = talonProps;

    if (parseFloat(remainingcreditcurrentcurrency) < grand_total) {
        return (
            <div className={classes.orderAmountError}>
                <FormattedMessage
                    id={'customerCreditError.customerCreditErrorText'}
                    defaultMessage={'Order Amount Is Greater Than The Credit Amount'}
                />
            </div>
        );
    }

    return (
        <div className={classes.root}>
            <table className={classes.creditTable}>
                <thead>
                    <tr>
                        <th scope="col">
                            <FormattedMessage
                                id={'totalOrderAmount.totalOrderAmountText'}
                                defaultMessage={'Total Order Amount'}
                            />
                        </th>
                        <th scope="col">
                            <FormattedMessage
                                id={'availableCredit.availableCreditText'}
                                defaultMessage={'Available Credit'}
                            />
                        </th>
                        <th scope="col">
                            <FormattedMessage
                                id={'remainingCredit.remainingCreditText'}
                                defaultMessage={'Remaining Credit'}
                            />
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td
                            data-label={formatMessage({
                                id: 'totalOrderAmount.totalOrderAmountText',
                                defaultMessage: 'Total Order Amount'
                            })}
                        >
                            {priceSummary?.currency && (
                                <Price value={priceSummary?.value} currencyCode={priceSummary?.currency} />
                            )}
                        </td>
                        <td
                            data-label={formatMessage({
                                id: 'availableCredit.availableCreditText',
                                defaultMessage: 'Available Credit'
                            })}
                        >
                            {remainingcreditformatted}
                        </td>
                        <td
                            data-label={formatMessage({
                                id: 'remainingCredit.remainingCreditText',
                                defaultMessage: 'Remaining Credit'
                            })}
                        >
                            {leftincredit}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
};

export default CustomerCreditSystem;

CustomerCreditSystem.propTypes = {
    classes: shape({
        root: string,
        orderAmountError: string,
        creditTable: string,
        creditActions: string,
        customerCreditButton: string
    }),
    shouldSubmit: bool.isRequired,
    onPaymentSuccess: func,
    onDropinReady: func,
    onPaymentError: func,
    resetShouldSubmit: func.isRequired
};
