import { useCartContext } from '../../../context/cart';
import { useAdapter } from '@magento/peregrine/lib/hooks/useAdapter';

const mapBillingAddressData = rawBillingAddressData => {
    if (rawBillingAddressData) {
        const { street, country, region } = rawBillingAddressData;

        return {
            ...rawBillingAddressData,
            street1: street[0],
            street2: street[1],
            country: country.code,
            state: region.label
        };
    } else {
        return {};
    }
};

/**
 * Talon for the braintree summary view.
 *
 * @returns {
 *   billingAddress: {
 *      firstName: String,
 *      lastName: String,
 *      country: String,
 *      street1: String,
 *      street2: String,
 *      city: String,
 *      state: String,
 *      postalCode: String,
 *   },
 *   paymentNonce: {
 *      type: String,
 *      description: String,
 *      details: {
 *          cardType: String,
 *          lastFour: String,
 *          lastTwo: String
 *      },
 *   },
 *   isBillingAddressSame: Boolean,
 *   isLoading: Boolean,
 * }
 */
export const useBraintreeSummary = () => {
    const { getSummaryData } = useAdapter();

    const [{ cartId }] = useCartContext();
    const { data: summaryData, loading: isLoading } = getSummaryData({ cartId: cartId });

    const billingAddress = summaryData ? mapBillingAddressData(summaryData.cart.billingAddress) : {};

    const isBillingAddressSame = summaryData ? summaryData.cart.isBillingAddressSame : true;

    const paymentNonce = summaryData ? summaryData.cart.paymentNonce : null;

    return {
        billingAddress,
        isBillingAddressSame,
        isLoading,
        paymentNonce
    };
};
