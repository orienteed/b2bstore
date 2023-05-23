import { gql } from '@apollo/client';

import { AvailablePaymentMethodsFragment } from '../PaymentInformation/paymentInformation.gql';
import { PriceSummaryFragment } from '../../CartPage/PriceSummary/priceSummaryFragments.gql';
import { ShippingInformationFragment } from './shippingInformationFragments.gql';
import { ShippingMethodsCheckoutFragment } from '../ShippingMethod/shippingMethodFragments.gql';

export const SET_CUSTOMER_ADDRESS_ID_ON_CART = gql`
    mutation SetCustomerAddressIdOnCart($cartId: String!, $addressId: Int!) {
        setShippingAddressesOnCart(
            input: { cart_id: $cartId, shipping_addresses: [{ customer_address_id: $addressId }] }
        ) {
            cart {
                id
                ...AvailablePaymentMethodsFragment
                ...PriceSummaryFragment
                ...ShippingInformationFragment
                ...ShippingMethodsCheckoutFragment
            }
        }
    }
    ${AvailablePaymentMethodsFragment}
    ${PriceSummaryFragment}
    ${ShippingInformationFragment}
    ${ShippingMethodsCheckoutFragment}
`;

export default {
    setDefaultAddressIdOnCartMutation: SET_CUSTOMER_ADDRESS_ID_ON_CART
};
